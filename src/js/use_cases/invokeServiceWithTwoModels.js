import { group } from "k6";
import { checkInvokeService } from "../modules/checks/ServiceChecks.js";
import { SERVICES } from "../modules/constants/Constants.js";

export function invokeServiceWithTwoModelsTest() {

    group("Invoke a service with two models", () => {
        group("Invoke the service", () => {
            checkInvokeService(SERVICES.NAME_WITH_TWO_MODELS, "test_input");
        })
    })
    
}
