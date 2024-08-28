import { group } from "k6";
import { checkModifyService } from "../modules/checks/ServiceChecks.js";
import { SERVICES, MANIFESTS } from "../modules/constants/Constants.js";


export function modifyReplicasInServiceTest() {

    group("Modify the number of replicas", () => {
        group("Modify the number of replicas in the service", () => {
            checkModifyService(SERVICES.NAME_WITH_SINGLE_MODEL, MANIFESTS.FILE_CHANGE_REPLICAS);
        })
    })
    
}
