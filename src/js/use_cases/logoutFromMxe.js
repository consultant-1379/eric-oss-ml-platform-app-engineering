import { group } from "k6";
import { checkLogoutWithUser } from "../modules/checks/MxeChecks.js";

export function logoutFromMxeTest() {

    group("Logout from ML Execution Environment", () => {
        group("Logout from ML Execution Environment", () => {
            checkLogoutWithUser();
        })
    })

}