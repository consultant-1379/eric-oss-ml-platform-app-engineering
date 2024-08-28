import { group } from "k6";
import { checkDeletingServiceIsSuccessful } from "../modules/checks/ServiceChecks.js";
import { SERVICES } from "../modules/constants/Constants.js";

const TESTSTAGE = `${__ENV.TESTSTAGE}`;


//used for testing the model service deletion funtion, and used in the teardown section
export function deleteServiceTest() {

    group("Delete services", () => {
        group("Delete services", () => {
            checkDeletingServiceIsSuccessful(SERVICES.NAME_WITH_SINGLE_MODEL);
            checkDeletingServiceIsSuccessful(SERVICES.NAME_WITH_TWO_MODELS);
            checkDeletingServiceIsSuccessful(SERVICES.NAME_WITH_SIMPLE_DEMO);
            if(TESTSTAGE === "postupgrade") {
               console.log("Deleting service after upgrade: ", SERVICES.NAME_WITH_SINGLE_MODEL_2);
               checkDeletingServiceIsSuccessful(SERVICES.NAME_WITH_SINGLE_MODEL_2);
            }
        })
    })
}

//only used in the SetUp
//the model service that is used after upgrade is only deleted in the setUp before upgrade
export function deleteServicesInSetUpTest() {

    group("Delete services in Set Up stage", () => {
        group("Delete services in Set Up stage", () => {
            checkDeletingServiceIsSuccessful(SERVICES.NAME_WITH_SINGLE_MODEL);
            checkDeletingServiceIsSuccessful(SERVICES.NAME_WITH_TWO_MODELS);
            checkDeletingServiceIsSuccessful(SERVICES.NAME_WITH_SIMPLE_DEMO);
            if(TESTSTAGE === "preupgrade") {
                console.log("Deleting service before upgrade: ", SERVICES.NAME_WITH_SINGLE_MODEL_2);
                checkDeletingServiceIsSuccessful(SERVICES.NAME_WITH_SINGLE_MODEL_2);
            }
        })
    })
}