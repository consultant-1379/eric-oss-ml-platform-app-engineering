import { group } from "k6";
import { checkLoginWithUser, checkLoginWithToken, checkLogin, checkLoginCreatingUser, checkCreateUser, checkDeleteUser, checkRolesExist } from "../modules/checks/MxeChecks.js";

const usernameMLAdmin = `${__ENV.ML_ADMIN_USERNAME}`;
const passwordMLAdmin = `${__ENV.ML_ADMIN_PWD}`;
const usernameMLModel = `${__ENV.ML_MODEL_USERNAME}`;
const passwordMlModel = `${__ENV.ML_MODEL_PWD}`;

const userMLAdmin =
{
    user: {
        firstName: "ML",
        lastName: "AdminUser",
        email: usernameMLAdmin + "@ericsson.se",
        username: usernameMLAdmin,
        status: "Enabled",
        privileges: ["MachineLearningTest_Application_Administrator", "MachineLearning_Application_Administrator", "OSSPortalAdmin"]
    },
    password: passwordMLAdmin,
    passwordResetFlag: false,
    tenant: "master"
};

const userMLModel = {
    user: {
        firstName: "ML",
        lastName: "ModelUser",
        email: usernameMLModel + "@ericsson.se",
        username: usernameMLModel,
        status: "Enabled",
        privileges: ["MLDemoAdmin", "OSSPortalAdmin"]
    },
    password: passwordMlModel,
    passwordResetFlag: false,
    tenant: "master"
}

export function loginWithUser() {

    group("Login to ML Execution Environment", () => {
        group("Login to ML Execution Environment", () => {
            checkLoginWithUser(usernameMLAdmin, passwordMLAdmin);
        })
    })

}

export function loginWithToken() {
    group("Login to ML Execution Environment", () => {
        group("Login to ML Execution Environment", () => {
            checkLoginWithToken(usernameMLAdmin, passwordMLAdmin);
        })
    })

}

export function createUser() {
    group("Create User", () => {
        group("Create User", () => {
            checkCreateUser(userMLAdmin);
            checkCreateUser(userMLModel);
        })
    })
}

export function deleteUser() {
    group("Delete User", () => {
        group("Delete User", () => {
            checkDeleteUser(usernameMLAdmin);
            checkDeleteUser(usernameMLModel);
        })
    })
}

export function checkRolesExistTest() {
    group("Check Roles Exist", () => {
        group("Check Roles Exist", () => {
            checkRolesExist("MachineLearning_Application_Administrator");
            checkRolesExist("MLDemoAdmin");
            checkRolesExist("MachineLearningTest_Application_Administrator");
        })
    })
}