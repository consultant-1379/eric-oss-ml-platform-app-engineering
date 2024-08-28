import { check } from "k6";
import { listRoutes, createRoute, deleteRoute } from "../implementations/ApiGatewayImpl.js";
import { STATUS_CODES, } from '../constants/Constants.js';

const systemUser = `${__ENV.SYSTEM_USER}`;
const systemPassword = `${__ENV.SYSTEM_USER_PASSWORD}`;

export function checkCreatingRouteIsSuccessful(id) {
    let response = createRoute(id, systemUser, systemPassword);
    if (
        !check(response, {
            ["API Gateway route with id: " + id + " is created"]: (r) => {
                console.log("status: ", r.status);
                return r.status === STATUS_CODES.CREATED
            }
        })
    ) {
        console.error("Route with id: " + id + " is not created.");
    }
}

export function checkDeletingRouteIsSuccessful(id) {
    console.log("listing API Gateway routes");
    let response = listRoutes(systemUser, systemPassword);
    console.log("status: ", response.status);
    if(response.json().find(e => e.id.match(id))) {
        console.log("number of routes: ", response.json().length);
        console.log("start deleting route: " + id);
        for (let i = 0; i < response.json().length; i++) {
            if (response.json()[i].id.match(id)) {
                let res = deleteRoute(id, systemUser, systemPassword);
                console.log("status: ", res.status);
                if (
                    !check(res, {
                        ["Route with id: '" + id + "' is deleted"]: (r) => {
                            return r.status === STATUS_CODES.NO_CONTENT;
                        }
                    })
                ) {
                    console.error("Route with id: " + id + " is not deleted: ", res.body);
                }
            } 
        }
    }
}

export function checkRouteExist(id) {
    let response = listRoutes(systemUser, systemPassword);
    console.log("listing routes: ", response.body);
    if(response.json().find(e => e.id.match(id))) {
        console.log("Route with id: " + id + " exists.");
        return true;
    } else {
        console.log("Route with id: " + id + " does not exist.");
        return false;
    }
}

