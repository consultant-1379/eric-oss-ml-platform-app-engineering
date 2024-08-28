import { group } from "k6";
import { checkCreateService, checkIsServiceAvailable } from "../modules/checks/ServiceChecks.js";
import { MANIFESTS, SERVICES } from "../modules/constants/Constants.js";

const TESTSTAGE = `${__ENV.TESTSTAGE}`;

export function createAllServicesTest() {

    group("Create services", () => {
        group("Create services", () => {
            checkCreateService(SERVICES.NAME_WITH_SINGLE_MODEL, MANIFESTS.OPENED_SINGLE_MODEL_MANIFEST);
            checkCreateService(SERVICES.NAME_WITH_SIMPLE_DEMO, MANIFESTS.OPENED_SIMPLE_DEMO_MANIFEST);
            if(TESTSTAGE === "preupgrade") {
                console.log("creating model service before upgrade");
                checkCreateService(SERVICES.NAME_WITH_SINGLE_MODEL_2, MANIFESTS.OPENED_SINGLE_MODEL_MANIFEST_2);
            }
        })
    })

}

export function checkIfServiceAvailableTest() {
    group("Check service is available", () => {
        group("Check service is available", () => {
            checkIsServiceAvailable(SERVICES.NAME_WITH_SINGLE_MODEL_2);
        })
    })
}