import http from "k6/http";
import { sleep } from "k6";
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { getModelUrl } from "./UrlImpl.js";
import { MODEL_STATUSES } from "../constants/Constants.js";
import { addAuthorizationHeader } from "./SefGatewayImpl.js";

const usernameMLAdmin = `${__ENV.ML_ADMIN_USERNAME}`;
const passwordMLAdmin = `${__ENV.ML_ADMIN_PWD}`;

//DEPRECATED
//models are not onboarded through source code anymore, but are onboarded from internal Container Registry (see onboardModelFromContainerRegistry())
export function onboardModel(id, file) {
    const formData = new FormData();
    let params = {
        headers: {
            "content-type":
                "multipart/form-data; boundary=" + formData.boundary,
        }
    };
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("start onboarding model: ", id);

    formData.append('sourcearchive', http.file(file, id, 'application/x-zip-compressed'));
    console.log("url: ", getModelUrl());

    let response = http.post(
        getModelUrl(),
        formData.body(),
        params
    );
    console.log("response: ", response.body);
    console.log("status: ", response.status);
    return response;
}

export function onboardModelFromContainerRegistry(id, data) {
    const formData = new FormData();
    let params = {
        headers: {
            "content-type":
                "multipart/form-data; boundary=" + formData.boundary,
        }
    };
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("start onboarding model: ", id);

    formData.append('imageregistry', http.file(JSON.stringify(data), id, 'application/json'));

    console.log("url: ", getModelUrl());
    let response = http.post(
        getModelUrl(),
        formData.body(),
        params
    );

    console.log("response: ", response.body);
    console.log("status: ", response.status);
    return response;
}

export function checkModelStatusIsAvailable(id) {
    let params = {};
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    let counter = 0;
    let response;
    let actualStatus;
    do {
        counter++;
        response = http.get(getModelUrl(), params);
        actualStatus = response.json().models.find(e => e.id.includes(id)).status;
        if (actualStatus === MODEL_STATUSES.AVAILABLE) {
            console.log("Model with id: " + id + " is " + MODEL_STATUSES.AVAILABLE);
            return true;
        } else if (actualStatus === MODEL_STATUSES.PACKAGING) {
            console.log("Model is still in packaging status.");
            sleep(10);
        } else {
            console.error("The status of the model is not what expected.");
            console.log("The status of " + id + " model is " + actualStatus + ".");
            return false;
        }
    } while (counter < 25);
    console.log("counter: ", counter);
    if(counter === 25 && actualStatus !== MODEL_STATUSES.AVAILABLE) {
        console.error("The status of the model is not \'available\' after 4 minutes. status: ", actualStatus);
        return false;
    }
}

export function checkModelExists(id) {
    let params = {};
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    let response = http.get(getModelUrl(), params);
    console.log("listing services is succesful: ", response.status);
    if (response.json().models.find(e => e.id === id)) {
        console.log("Model with name: " + id + " exists.");
        return true;
    } else {
        console.log("Model with name: " + id + " does not exists.");
        return false;
    }
}

export function deleteModel(id, version) {
    let params = {};
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("start deleting model: ", id);
    let url = getModelUrl() + "/" + id + "/versions/" + version;
    console.log("url for model deletion: ", url);
    let response = http.del(url, null, params);
    console.log("status: ", response.status);
    console.log("response: ", response.body);
    return response;
}