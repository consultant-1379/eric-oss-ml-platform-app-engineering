import http from "k6/http";
import { sleep } from "k6";
import { getServiceUrl, getModelEndpointsUrl } from "./UrlImpl.js";
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { SERVICE_STATUSES } from "../constants/Constants.js";
import { addAuthorizationHeader } from "./SefGatewayImpl.js";

var namespace = `${__ENV.NAMESPACE}`;
const usernameMLAdmin = `${__ENV.ML_ADMIN_USERNAME}`;
const passwordMLAdmin = `${__ENV.ML_ADMIN_PWD}`;


export function createService(serviceName, manifest) {
    const formData = new FormData();
    let params = {
        headers: {
            "content-type":
                "multipart/form-data; boundary=" + formData.boundary,
        }
    };
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("start creating the service: ", serviceName);
    formData.append('manifest', http.file(manifest, serviceName + ".yml", 'application/octet-stream'));

    let response = http.post(
        getServiceUrl(),
        formData.body(),
        params
    );
    console.log("response: ", response.body);
    return response;
}

export function checkServiceExist(name) {
    let counter = 0;
    do {
        counter++
        if (checkServiceIsInList(name)) {
            return true;
        } else {
            sleep(5);
        }
    } while(counter < 13)
    if(counter === 13) {
        console.error("Service with name: " + name + " is not created after one minute.")
        return false;
    }
}

export function checkServiceIsInRunningStatus(name) {
    let counter = 0;
    let actualStatus;
    let params = {};
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("checking services are in running status: ", name);
    do {
        counter++;
        let response = http.get(getServiceUrl(), params);
        console.log("status: ", response.status);
        actualStatus = response.json().services.find(e => e.name === name).status;
        if (actualStatus === SERVICE_STATUSES.RUNNING) {
            console.log("Service with name: " + name + " is in running status.");
            return true;
        } else if (actualStatus === SERVICE_STATUSES.CREATING) {
            console.log("Service is still in creating status.")
            sleep(10);
        } else {
            console.error("The status of the service is not what expected.");
            console.log("Status of " + name + " service: " + actualStatus);
            return false;
        }
    } while (counter < 25);
    if (counter === 25 && actualStatus !== SERVICE_STATUSES.RUNNING) {
        console.error("The status of the service is not \'running\' after 4 minutes. status: ", actualStatus)
        return false;
    }
}

export function invokeService(serviceName, input) {
    let params = {
        headers: {
            "content-type":
                "application/json"
        }
    };
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("start invoking the service: ", serviceName);
    let data = {data: {ndarray: [input]}};
    let url = getModelEndpointsUrl() + serviceName;
    console.log("url for invoking: ", url);

    let response = http.post(
        url,
        JSON.stringify(data),
        params
    );
    console.log("response: ", response.body);
    return response;
}

export function modifyService(serviceName, manifest){
    console.log("service is getting modified: ", serviceName);
    const formData = new FormData();
    let params = {
        headers: {
            "content-type":
                "multipart/form-data; boundary=" + formData.boundary,
        }
    };
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    formData.append('manifest', http.file(manifest, serviceName +".yml", 'application/octet-stream'));

    let response = http.patch(
        getServiceUrl() + "/name=" + serviceName,
        formData.body(),
        params
    );
    console.log("response: ", response.body);
    return response;
}

export function deleteService(serviceName) {
    console.log("start deleting service: ", serviceName);
    let params = {};
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    let url = getServiceUrl() + "/name=" + serviceName;
    console.log("url for deleting service: ", url);
    let response = http.del(url, null, params);
    console.log("response: ", response.body);
    return response;
}

export function checkServiceDeleted(name) {
    let counter = 0;
    do {
        counter++
        if (checkServiceIsInList(name)) {
            sleep(10);
        } else {
            return true;
        }
    } while(counter < 7)
    if(counter === 7) {
        console.error("Service with name: " + name + " is not deleted within one minute.")
        return false;
    }
}

export function checkServiceIsInList(name) {
    console.log("serviceUrl: ", getServiceUrl());
    let params = {};
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("checking service in list: ", name);
    
    let response = http.get(getServiceUrl(), params);
    console.log("status: ", response.status);
    console.log("response: ", response.body);
    if (response.json().services.find(e => e.name === name)) {
        console.log("Service with name: " + name + " exists.");
        return true;
    } else {
        console.log("Service with name: " + name + " does not exists.");
        return false;
    }
}