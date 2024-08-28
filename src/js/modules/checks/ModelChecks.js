import http from "k6/http";
import { check } from "k6";
import * as model from "../implementations/ModelImpl.js";
import { getModelUrl } from "../implementations/UrlImpl.js";
import { MODEL_STATUSES } from "../constants/Constants.js";
import { addAuthorizationHeader } from "../implementations/SefGatewayImpl.js";

const usernameMLAdmin = `${__ENV.ML_ADMIN_USERNAME}`;
const passwordMLAdmin = `${__ENV.ML_ADMIN_PWD}`;


export function checkOnboardModel(id, data, legacy) {
    var legacyValue = setLegacyValue(legacy);;
    console.log("legacyValue: ", legacyValue);
    let response = model.onboardModelFromContainerRegistry(id, data);
    if (
        !check(response, {
            ["Model with id: " + id + " is onboarded"]: (r) => {
                console.log("status: ", r.json().status);
                return r.json().message.includes("has been onboarded to cluster with ID \"" + id)
                    && r.json().status.match("available");
            }
        }, { legacy: legacyValue })
    ) {
        console.error("Model with id: " + id + " is not onboarded.");
    }
}

export function checkModelIsOnboarded(id, legacy) {
    var legacyValue = setLegacyValue(legacy);;
    let params = {};
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("checking if models are successfully onboarded: ", id);
    let response = http.get(getModelUrl(), params);
    console.log("status: ", response.status);
    console.log("number of models: ", response.json().models.length);
    response.json().models.forEach(element => {console.log("id: ", element.id)});
    if (
        !check(response, {
            ["Model with id: '" + id + "' is available"]: (r) => {
                if(r.json().models.find(e => e.id.includes(id))) {
                    console.log("status of " + id + ": ", r.json().models.find(e => e.id.includes(id)).status);
                    return model.checkModelStatusIsAvailable(id);
                }
            }
        }, { legacy: legacyValue })
    ) {
        console.error("Model with id: " + id + " is not available.");
    }
}

export function checkDeletingModelIsSuccessful(id, legacy) {
    var legacyValue = setLegacyValue(legacy);;
    let params = {};
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    console.log("checking if model is successfully deleted: ", id);
    let response = http.get(getModelUrl(), params);

    if (model.checkModelExists(id)) {
        for (let i = 0; i < response.json().models.length; i++) {
            if (response.json().models[i].id === id && response.json().models[i].status == MODEL_STATUSES.PACKAGING) {
                console.error("Model with id: " + id + " is still in packaging status.");
            } else if (response.json().models[i].id === id) {
                let res = model.deleteModel(response.json().models[i].id, response.json().models[i].version);
                if (
                    !check(res, {
                        ["Model with id: '" + id + "' is deleted"]: (r) => {
                            return r.json().message.match("Model with ID \"" + response.json().models[i].id + "\" and version \""
                                + response.json().models[i].version + "\" has been deleted on cluster.");
                        }
                    }, { legacy: legacyValue })
                ) {
                    console.error("Model with id: " + id + " is not deleted.");
                }
            }
        }
    }
}

function setLegacyValue(legacy) {
    var legacyValue = "true";
    if(legacy) {
        legacyValue = "false";
    };
    return legacyValue;
}
