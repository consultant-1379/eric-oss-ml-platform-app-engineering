import http from "k6/http";
import { STATUS_CODES } from "../constants/Constants.js";
import { addAuthorizationHeader } from "./SefGatewayImpl.js";
import { getScrapeUrl } from "./UrlImpl.js";

const usernameMLAdmin = `${__ENV.ML_ADMIN_USERNAME}`;
const passwordMLAdmin = `${__ENV.ML_ADMIN_PWD}`;

export function checkHealthOfAllScrapePoolsUp() {
    let params = {
        headers: {
            "content-type":
                "application/json"
        }
    };
    params = addAuthorizationHeader(params, usernameMLAdmin, passwordMLAdmin);
    let scrape_url = getScrapeUrl();
    console.log("scrape url: ", scrape_url);
    let res = http.get(scrape_url, params);

    let allPoolsUp = true;
    if(res.status === STATUS_CODES.OK) {
        let pools = JSON.parse(res.body);
        let numberOfTargetDown = 0;
        console.log("number of active targets: ", pools.data.activeTargets.length);
        for (let i = 0; i < pools.data.activeTargets.length; i++) {
            let target = pools.data.activeTargets[i];
            if (target.health != "up" && (target.discoveredLabels.__meta_kubernetes_pod_label_app_kubernetes_io_instance.includes("model") 
                || target.discoveredLabels.__meta_kubernetes_pod_label_app_kubernetes_io_instance.includes("ml-execution-env"))) {
                    numberOfTargetDown++;
                    console.log("Reason: " + target.lastError);
                    if (target.labels.pod_name != undefined) {
                        console.log("pod name: " + target.labels.pod_name);
                    }
                    else if (target.discoveredLabels.__meta_kubernetes_pod_name != undefined) {
                        console.log("pod name: " + target.discoveredLabels.__meta_kubernetes_pod_name);
                    }
                    allPoolsUp = false;
            }
        }
        if(!allPoolsUp){
            console.warn("Total number of unhealthy targets: " + numberOfTargetDown);
        }
    } else {
        console.error("status is not OK: ", res.status);
        allPoolsUp = false;
        console.error(res.body);
    }
    return allPoolsUp;
}