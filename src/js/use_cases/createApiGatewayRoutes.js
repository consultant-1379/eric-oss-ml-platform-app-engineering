import { group } from "k6";
import { checkCreatingRouteIsSuccessful, checkRouteExist } from "../modules/checks/ApiGatewayChecks.js";
import { SERVICES } from "../modules/constants/Constants.js";


export function createApiGatewayRoutesTest() {
    
    group("Create API Gateway Routes", () => {
        group("Create API Gateway routes", () => {
            console.log("creating routes");
            checkCreatingRouteIsSuccessful(SERVICES.NAME_WITH_SINGLE_MODEL);
            checkCreatingRouteIsSuccessful(SERVICES.NAME_WITH_TWO_MODELS);
            checkCreatingRouteIsSuccessful(SERVICES.NAME_WITH_SIMPLE_DEMO);
        })

        group("Check API Gateway routes exist", () => {
            console.log("checking routes");
            checkRouteExist(SERVICES.NAME_WITH_SINGLE_MODEL);
            checkRouteExist(SERVICES.NAME_WITH_TWO_MODELS);
            checkRouteExist(SERVICES.NAME_WITH_SIMPLE_DEMO);
        })
    })
}

