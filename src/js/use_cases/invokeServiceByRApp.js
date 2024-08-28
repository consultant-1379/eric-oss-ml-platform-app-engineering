import { group } from "k6";
import { checkInvokeServiceByRApp, checkMLExecEnvAvailable } from "../modules/checks/IdunChecks.js";
import { checkLogin, checkLoginWithToken, checkLoginWithUser, checkRBACEnforced } from "../modules/checks/MxeChecks.js";
import { SERVICES } from "../modules/constants/Constants.js";

const usernameMLModel = `${__ENV.ML_MODEL_USERNAME}`;
const passwordMlModel = `${__ENV.ML_MODEL_PWD}`;

/*
The ML_MODEL_USER only has rights to invoke model services.
*/

export function invokeServiceByRAppTest() {
    
    group("Invoke the service by the Simple ML Demo rApp", () => {
        group("Login with the user of the rApp", () => {
            checkLoginWithToken(usernameMLModel, passwordMlModel);
            checkLoginWithUser(usernameMLModel, passwordMlModel);
        })
        
        group("Invoke the service by the rApp", () => {
            checkMLExecEnvAvailable();
            checkInvokeServiceByRApp(SERVICES.NAME_WITH_SIMPLE_DEMO, "input");
        })

        group("Check that RBAC is enforced", () => {
            checkRBACEnforced(usernameMLModel, passwordMlModel);
        })
    }
)}