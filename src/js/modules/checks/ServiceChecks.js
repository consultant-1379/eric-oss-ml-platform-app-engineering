import { check } from "k6";
import * as service from "../implementations/ServiceImpl.js";


export function checkIsServiceAvailable(serviceName, legacy) {
    var legacyValue = setLegacyValue(legacy);
    console.log("legacyValue: ", legacyValue);
    if(service.checkServiceIsInList(serviceName)) {
        let exist = service.checkServiceIsInRunningStatus(serviceName);
        if(
            !check(exist, {
                ["Service with name: " + serviceName + " is available"]: (e) => {
                    return e === true;
                }
            }, { legacy: legacyValue })
        ) {
            console.error("Service with name: " + serviceName + " is not in 'running' status.");
        }
    }
}

export function checkCreateService(serviceName, manifest, legacy) {
    var legacyValue = setLegacyValue(legacy);
    console.log("legacyValue: ", legacyValue);
    let response = service.createService(serviceName, manifest);
    if (
        !check(response, {
            ["Service with name: " + serviceName + " is created"]: (r) => {
                console.log("status: ", r.status);
                return r.json().message.includes("Model service \"" + serviceName + "\" creation has started")
                    && service.checkServiceExist(serviceName)
                    && service.checkServiceIsInRunningStatus(serviceName);
            }
        }, { legacy: legacyValue })
    ) {
        console.error("Service with name: " + serviceName + " is not created.");
    }
}

//set legacy only if the test should be non-legacy
export function checkInvokeService(serviceName, input, legacy) {
    var legacyValue = setLegacyValue(legacy);
    console.log("legacyValue: ", legacyValue);
    if (service.checkServiceIsInList(serviceName)) {
        let response = service.invokeService(serviceName, input);
        if (
            !check(response, {
                ["Service with name: " + serviceName + " is invoked."]: (r) => {
                    console.log("status: ", r.status);
                    return r.json().data.ndarray.includes(input);
                }
            }, { legacy: legacyValue })
        ) {
            console.error("Service with name: " + serviceName + " is not invoked.");
        }
    } else {
        console.error("service to be invoked does not exist: ", serviceName);
    }
}

export function checkModifyService(serviceName, manifest) {
    let response = service.modifyService(serviceName, manifest)
    if (
        !check(response, {
            ["Service with name: " + serviceName + " is modified"]: (r) => {
                console.log("status: ", r.status);
                return r.json().message.includes("Model service \"" + serviceName + "\" update has started");
            }
        })
    ) {
        console.error("Service with name: " + serviceName + " is not modified.");
    }
}

export function checkDeletingServiceIsSuccessful(serviceName, legacy) {
    var legacyValue = setLegacyValue(legacy);
    console.log("legacyValue: ", legacyValue);
    if (service.checkServiceIsInList(serviceName)) {
        let response = service.deleteService(serviceName);
        console.log("response after deleting service: ", response.body);
        if (
            !check(response, {
                ["Service with name: " + serviceName + " is deleted"]: (r) => {
                    console.log("status: ", r.status);
                    return r.json().message.match("Model service \"" + serviceName + "\" has been deleted on cluster.")
                        && service.checkServiceDeleted(serviceName);
                }
            }, { legacy: legacyValue })
        ) {
            console.error("Service with name: " + serviceName + " is not deleted.");
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