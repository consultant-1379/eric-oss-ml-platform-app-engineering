import http from "k6/http";
import { check } from "k6";
import { URLS, PROTOCOL } from '../constants/Constants.js';
import { addAuthorizationHeader } from "../implementations/SefGatewayImpl.js";

var mlHostname = `${__ENV.GAS_HOSTNAME}`;
var mlDomain = PROTOCOL + mlHostname;
const usernameMLModel = `${__ENV.ML_MODEL_USERNAME}`;
const passwordMlModel = `${__ENV.ML_MODEL_PWD}`;

export function checkMLExecEnvAvailable() {
     let params = {};
     params = addAuthorizationHeader(params, usernameMLModel, passwordMlModel);
     console.log("checking if ML Execution Environment is available");
    let response = http.get(mlDomain + URLS.SIMPLE_ML_DEMO_URL, params)
    if(
        !check(response, {
            ["ML Execution Environment is available"]: r => {
                console.log("status: ", r.status);
                console.log("repsonse: ", r.body);
                return r.body.includes("Hello ML Execution Environment!");
            }
        })
    ) {
        console.error("ML Execution Environment is not available. Response: ", response.body);
    }
}

export function checkInvokeServiceByRApp(serviceName, input) {
    console.log("checking if service can be invoked by rApp: ", serviceName);
    let params = {};
    params = addAuthorizationHeader(params, usernameMLModel, passwordMlModel);
   let response = http.get(mlDomain + URLS.SIMPLE_ML_DEMO_URL_WITH_PARAM + input, params);
    if (
        !check(response, {
            ["Service with name: " + serviceName + " is invoked successfully."]: (r) => {
                console.log("status: ", r.status);
                console.log("body: ", r.body);
                console.log("response: ", r.json().strData);
                return r.json().strData.match("ml_" + input);
            }
        })
    ) {
        console.error("Service with name: " + serviceName + " is not invoked successfully.");
    }
}