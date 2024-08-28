import { group } from "k6";
import { checkInvokeService } from "../modules/checks/ServiceChecks.js";
import { SERVICES } from "../modules/constants/Constants.js";

const TESTSTAGE = `${__ENV.TESTSTAGE}`;

export function invokeServiceWithOneModelTest() {

    group("Invoke a service with one model", () => {
        group("Invoke the service", () => {
            checkInvokeService(SERVICES.NAME_WITH_SINGLE_MODEL, "test");
            if(TESTSTAGE === "postupgrade" || TESTSTAGE === "preupgrade") {
                checkInvokeService(SERVICES.NAME_WITH_SINGLE_MODEL_2, "test_availability_upgrade");
            }
        })
    })
    
}
