import { group } from "k6";
import { checkDeletingRouteIsSuccessful } from "../modules/checks/ApiGatewayChecks.js";
import { SERVICES } from "../modules/constants/Constants.js";


export function deleteApiGatewayRoutesTest() {
    group("Delete API Gateway Routes", () => {
        group("Delete API Gateway routes", () => {
            checkDeletingRouteIsSuccessful(SERVICES.NAME_WITH_SINGLE_MODEL);
            checkDeletingRouteIsSuccessful(SERVICES.NAME_WITH_TWO_MODELS);
            checkDeletingRouteIsSuccessful(SERVICES.NAME_WITH_SIMPLE_DEMO);
        })
    })
}
