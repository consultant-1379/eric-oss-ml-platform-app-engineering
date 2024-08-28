import { group } from "k6";
import { checkModifyService } from "../modules/checks/ServiceChecks.js";
import { SERVICES, MANIFESTS } from "../modules/constants/Constants.js";

export function modifyWeightInServiceTest() {

    group("Modify the weight", () => {
        group("Modify the weight in the service", () => {
            checkModifyService(SERVICES.NAME_WITH_TWO_MODELS, MANIFESTS.FILE_CHANGE_WEIGHT);
        })
    })
    
}
