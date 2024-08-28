import { check } from "k6";
import { login, logout, checkAccessControl } from "../implementations/MxeImpl.js";
import { STATUS_CODES } from "../constants/Constants.js";
import { generateToken, createUser, deleteUser, checkRole } from "../implementations/SefGatewayImpl.js";

export function checkLoginWithUser(username, pwd) {
    let response = login(username, pwd);
    if (
        !check(response, {
            ["Login to ML Execution Environment is successful"]: (r) => {
                console.log("status code at login with user: ", r.status);
                console.log("response body at login with user: ", r.body);
                return r.status === STATUS_CODES.OK;
            }
        })
    ) {
        console.error("Login to ML Execution Environment is not successful.");
    }
}

export function checkLoginWithToken(username, pwd) {
    let response = generateToken(username, pwd);
    console.log(`Check if login to ML Execution Environment is successful`);
    if (
        !check(response, {
            ["Login to ML Execution Environment is successful"]: (r) => {
                console.log(`Status code with token authentication: ${response.status}`);
                console.log(`Response body with token authentication: ${response.body}`);
                return r.status === STATUS_CODES.OK;
            }
        })
    ) {
        console.error("Login to ML Execution Environment is not successful.");
    }
}

export function checkCreateUser(user) {
    let response = createUser(user);
    if (
        !check(response, {
            ["User is created"]: (r) => {
                return r.status === STATUS_CODES.OK || r.status === STATUS_CODES.CONFLICT;
            }
        })
    ) {
        console.error(`Creating '${user.user.username}' user is not successful.`);
    }
}

export function checkDeleteUser(username) {
    let response = deleteUser(username);
    if (
        !check(response, {
            ["Deleting user is successful"]: (r) => {
                return r.status === STATUS_CODES.NO_CONTENT;
            }
        })
    ) {
        console.error(`Deleting '${username}' user is not successful.`);
    }
}


export function checkLogoutWithUser() {
    let response = logout();
    if (
        !check(response, {
            ["Logout from ML Execution Environment is successful"]: (r) => {
                console.log("status code at logout: ", r.status);
                return r.status === STATUS_CODES.OK;
            }
        })
    ) {
        console.error("Logout from ML Execution Environment is not successful.");
    };
}

export function checkRolesExist(role) {
    let exist = checkRole(role);

    if (
        !check(exist, {
            ["Role " + role + " exists."]: (e) => {
                return exist;
            }
        })
    ) {
        console.error("Role: " + role + " does not exist.");
    }
}

export function checkRBACEnforced(username, pwd) {
    let statuses = checkAccessControl(username, pwd);
    for (let i = 0; i < statuses.length; i++) {
        if (!check(statuses[i], {
            ["ML Model User is only allowed to invoke model services"]: (e) => {
                return statuses[i] === 403;
            }
        })) {
            console.error("Status code is not as expected: " + statuses[i]);
        }
    }
}

