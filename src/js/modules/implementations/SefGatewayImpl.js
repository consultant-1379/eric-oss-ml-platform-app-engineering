import http from "k6/http";
import { STATUS_CODES } from "../constants/Constants.js";
import { getUserUrl, getTokenUrl, getRolesUrl } from "../implementations/UrlImpl.js";
import { sleep } from "k6";

let token;
let tokenRefresh;
let tokenTime;
const gasUser = `${__ENV.GAS_USER}`;
const gasPassword = `${__ENV.GAS_PWD}`;

export function addAuthorizationHeader(params, username, password) {
    const currentTime = new Date();
    if ((currentTime - tokenTime) / 1000 > tokenRefresh) {
        generateToken(username, password);
    }

    if (!("headers" in params)) {
        params.headers = {};
    }
    params.headers["Authorization"] = `Bearer ${token}`;
    return params;
}

export function generateToken(username, password) {
    console.log("username: ", username);
    let url = getTokenUrl();
    console.log("url for getting the token: ", url);
    const payload = {
        grant_type: "password",
        username: username,
        password: password,
        client_id: "eo",
        client_secret: __ENV.IAM_CLIENT_SECRET
    };
    
    let response = http.post(url, payload);
    const json = response.json();
    token = json.access_token;
    console.log("token: ", json.access_token);
    console.log("expires in: ", json.expires_in);
    console.log("Status code: ", response.status);
    tokenRefresh = json.expires_in - 30;
    tokenTime = new Date();
    return response;
}

export function checkRole(role) {
    generateToken(gasUser, gasPassword);
    console.log("GAS USER: ", gasUser);
    console.log(`Checking roles`);
    console.log("url to check roles: ", getRolesUrl());
    const params = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    var responseRoles;
    for(let i = 0; i < 9; i++) {
        responseRoles = http.get(getRolesUrl(), params);
        console.log("status: ", responseRoles.status);
        console.log("checking if " + role + " is present in the list");
        var exist = false;
        for (let f = 0; f < responseRoles.json().length; f++) {
            if (responseRoles.json()[f].name.match(role)) {
                console.log("role is present: ", role);
                exist = true;
                break;
            }
        }
        if (exist === true) {
            break;
        } else {
            sleep(20);
        }
    };
    for(let j = 0; j < responseRoles.json().length; j++) {
        console.log("role name: ", responseRoles.json()[j].name);
    }
    return exist;
}

export function createUser(user) {
    generateToken(gasUser, gasPassword);
    console.log("GAS USER: ", gasUser);
    console.log(`Creating user '${user.user.username}'`);
    const params = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    let url = getUserUrl();
    console.log("url for creating user: ", url);
    const response = http.post(url, JSON.stringify(user), params);
    console.log(`Status code: ${response.status}`);
    if(response.status === STATUS_CODES.CONFLICT) {
        console.log(`'${user.user.username}' user already exists`);
    }
    console.log(`Response body: ${response.body}`);
    return response;
}

export function deleteUser(username) {
    generateToken(gasUser, gasPassword);
    console.log("GAS USER: ", gasUser);
    console.log(`Deleting user '${username}'`);
    const params = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
    let url = getUserUrl() + "/" + username;
    console.log("url for deleting user: ", url);
    const response = http.del(url, null, params);
    console.log(`Status code: ${response.status}`);
    console.log(`Response body: ${response.body}`);
    return response;
}

