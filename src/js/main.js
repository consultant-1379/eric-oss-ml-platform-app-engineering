import { createUser, loginWithToken, loginWithUser, deleteUser, checkRolesExistTest } from "./use_cases/loginToMxe.js";
import { invokeServiceWithOneModelTest } from "./use_cases/invokeServiceWithOneModel.js";
import { invokeServiceWithTwoModelsTest } from "./use_cases/invokeServiceWithTwoModels.js";
import { modifyReplicasInServiceTest } from "./use_cases/modifyServiceReplicas.js";
import { modifyWeightInServiceTest } from "./use_cases/modifyServiceWeight.js";
import { invokeServiceByRAppTest } from "./use_cases/invokeServiceByRApp.js";
import { logoutFromMxeTest } from "./use_cases/logoutFromMxe.js";
import { onboardAllModelsTest, checkIfModelsAvailableTest } from "./use_cases/onboardAllModels.js";
import { createAllServicesTest, checkIfServiceAvailableTest } from "./use_cases/createAllServices.js";
import { deleteServiceTest, deleteServicesInSetUpTest } from "./use_cases/deleteAllServices.js";
import { deleteModelTest, deleteModelsInSetUpTest } from "./use_cases/deleteAllModels.js";
import { createApiGatewayRoutesTest } from "./use_cases/createApiGatewayRoutes.js";
import { deleteApiGatewayRoutesTest } from "./use_cases/deleteApiGatewayRoutes.js";
import { validateMetrics } from "./use_cases/checkMetrics.js";

export function handleSummary(data) {
    return {
        "/reports/summary.json": JSON.stringify(data),
    }
}

export const options = {
    insecureSkipTLSVerify: true,
    setupTimeout: '4m',
};

const SEF_STATUS = `${__ENV.SEF_STATUS}`;
const TESTSTAGE = `${__ENV.TESTSTAGE}`;

export function setup() {
    console.log("value of SEF_STATUS: ", SEF_STATUS);
    try {
        checkRolesExistTest();
        createUser();
        if(SEF_STATUS === "disabled") {
            deleteApiGatewayRoutesTest();
            createApiGatewayRoutesTest();
        }
        loginWithToken();
        loginWithUser();
        deleteServicesInSetUpTest();
        deleteModelsInSetUpTest();
        if (TESTSTAGE === "postupgrade") {
            checkIfServiceAvailableTest();
            checkIfModelsAvailableTest();
        }
        logoutFromMxeTest();
    } catch(e) {
        console.log("Set up was not successful: ", e);
        logoutFromMxeTest();
        teardown();
        throw e;
    }
}

export default function() {

    loginWithToken();
    loginWithUser();

    onboardAllModelsTest();

    createAllServicesTest();

    invokeServiceWithOneModelTest();
    //invokeServiceWithTwoModelsTest();  //depends on> https://eteamproject.internal.ericsson.com/browse/MXESUP-129

    modifyReplicasInServiceTest();
    //modifyWeightInServiceTest();

    //invokeServiceByRAppTest();

    loginWithToken();
    loginWithUser();

    validateMetrics();

    deleteServiceTest();

    deleteModelTest();

    logoutFromMxeTest();
}


export function teardown() {
    console.log("Running teardown");
    loginWithToken();
    loginWithUser();
    if(SEF_STATUS === "disabled") {
        deleteApiGatewayRoutesTest();
    }
    deleteServiceTest();
    deleteModelTest();
    deleteUser();
    logoutFromMxeTest();
}
