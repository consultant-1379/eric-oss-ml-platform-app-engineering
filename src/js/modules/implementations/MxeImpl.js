import http from "k6/http";
import { getLoginUrl, getLogoutUrl, getModelUrl, getServiceUrl } from "./UrlImpl.js";
import { addAuthorizationHeader } from "../implementations/SefGatewayImpl.js";
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

const usernameMLModel = `${__ENV.ML_MODEL_USERNAME}`;

export function login(username, pwd) {
    console.log("username: ", username);
    return http.post(getLoginUrl(),
        {},
        {
            headers:
            {
                "X-LOGIN": username,
                "X-PASSWORD": pwd,
            }
        }
    );
}

export function logout() {
    return http.get(getLogoutUrl());
}
//username === usernameMLModel || username === UserWithoutAnyPriviliges
export function checkAccessControl(username, password) {
    const formData = new FormData();
    let params = {};
    params = addAuthorizationHeader(params, username, password);

    const statuses = [];

    if(username === usernameMLModel) {
        console.log("checking if RBAC is enforced for " + usernameMLModel);
        
        let statusListingModels = (http.get(getModelUrl(), params)).status;
        console.log(`status for ${usernameMLModel} when listing models: `, statusListingModels);
        
        let statusListingServices = (http.get(getServiceUrl(), params)).status;
        console.log(`status for ${usernameMLModel} when listing services: `, statusListingServices);
      
        let statusOnboardingModel = (http.post(getModelUrl(), formData.body(), params)).status;
        console.log(`status for ${usernameMLModel} when onborading models: `, statusOnboardingModel);
        
        let statusCreatingService = (http.post(getServiceUrl(), formData.body(), params)).status;
        console.log(`status for ${usernameMLModel} when creating service: `, statusCreatingService);
       
        statuses.push(statusListingModels, statusListingServices, statusOnboardingModel, statusCreatingService);
    }
    return statuses;
}
