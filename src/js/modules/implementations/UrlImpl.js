import { URLS, PROTOCOL } from '../constants/Constants.js';

var mlHostname = "";
var eicHostname = `${__ENV.EIC_HOSTNAME}`;
var gasHostname = `${__ENV.GAS_HOSTNAME}`;
var namespace = `${__ENV.NAMESPACE}`;

if(`${__ENV.SEF_STATUS}` == "enabled") {
    mlHostname = eicHostname;
} else {
    mlHostname = gasHostname;
}

var mlDomain = PROTOCOL + mlHostname;
var gasDomain = PROTOCOL + gasHostname;
var eicDomain = PROTOCOL + eicHostname;

export function getLoginUrl() {
    console.log("hostname: ", mlDomain);
    console.log("namespace: ", namespace);
    return gasDomain + URLS.LOGIN_URL;
}

export function getModelUrl() {
    return mlDomain + URLS.MODEL_URL;
}

export function getServiceUrl() {
    return mlDomain + URLS.SERVICE_URL;
}

export function getModelEndpointsUrl() {
    return mlDomain + URLS.MODEL_ENDPOINTS_URL;
}

export function getLogoutUrl() {
    return gasDomain + URLS.LOGOUT_URL;
}

export function getRoutesUrl() {
    return gasDomain + URLS.ROUTES_URL;
}

export function getUserUrl() {
    return eicDomain + URLS.USER_URL;
}

export function getTokenUrl() {
    return eicDomain + URLS.TOKEN_URL;
}

export function getRolesUrl() {
    return eicDomain + URLS.ROLES_URL;
}

export function getScrapeUrl() {
    return mlDomain + URLS.SCRAPE_URL;
}