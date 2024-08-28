import http from "k6/http";
import { getRoutesUrl } from "./UrlImpl.js";
import { URLS } from "../constants/Constants.js";
import { addAuthorizationHeader } from "./SefGatewayImpl.js";

var openedJson = open("../../../resources/routes/route.json"); 

var mlHostname = `${__ENV.GAS_HOSTNAME}`;
var namespace = `${__ENV.NAMESPACE}`;

export function createRoute(id, username, pwd) {
    let params = {
        headers: {
            "content-type":"application/json"
        }
    };
    params = addAuthorizationHeader(params, username, pwd);
    console.log("Creating route: " + id);
    return http.post(getRoutesUrl(),
        getModifiedRouteBody(id),
        params
    );
}

export function listRoutes(username, pwd) {
    let params = {};
    params = addAuthorizationHeader(params, username, pwd);
    return http.get(getRoutesUrl(), params);
}

export function deleteRoute(id, username, pwd) {
    let params = {};
    params = addAuthorizationHeader(params, username, pwd);
    return http.del(getRoutesUrl() + id, null, params);
}

function getModifiedRouteBody(id) {
    var obj = JSON.parse(openedJson);
    var elements = Object.keys(obj);

    for(let i = 0; i < elements.length; i++) {
        if(elements[i] === "predicates") {
            let predicates = obj[elements[i]];
            for(let f = 0; f < predicates.length; f++) {
                if(predicates[f].name === "Host") {
                    predicates[f].args._genkey_0 = mlHostname;
                } else {
                    predicates[f].args._genkey_0 = URLS.MODEL_ENDPOINTS_SELDON_URL + namespace + "/" + id + "/**";
                }
            }
        } else if (elements[i] === "id") {
            obj[elements[i]] = id;
        } else if(elements[i] === "uri") {
            obj[elements[i]] = "http://" + id + ":8000";
        }
    }
    return JSON.stringify(obj);
}
