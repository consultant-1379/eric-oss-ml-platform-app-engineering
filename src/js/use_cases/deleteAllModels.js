import { group } from "k6";
import { checkDeletingModelIsSuccessful } from "../modules/checks/ModelChecks.js";
import { MODELS } from '../modules/constants/Constants.js';

const TESTSTAGE = `${__ENV.TESTSTAGE}`;


//used for testing the model deletion funtion, and used in the teardown section
export function deleteModelTest() {

    group("Delete models", () => {
        group("Delete models", () => {
            checkDeletingModelIsSuccessful(MODELS.ID_1);
            checkDeletingModelIsSuccessful(MODELS.ID_3);
            if(TESTSTAGE === "postupgrade") {
               console.log("deleting model after upgrade: ", MODELS.ID_2);
               checkDeletingModelIsSuccessful(MODELS.ID_2);
            }
        })
    })

}

//used in the SetUp
//the model that is used after upgrade is only deleted in the setUp before upgrade
export function deleteModelsInSetUpTest() {

    group("Delete models in Set Up stage", () => {
        group("Delete models in Set Up stage", () => {
            checkDeletingModelIsSuccessful(MODELS.ID_1);
            checkDeletingModelIsSuccessful(MODELS.ID_3);
            if(TESTSTAGE === "preupgrade") {
                console.log("deleting model before upgrade: ", MODELS.ID_2);
                checkDeletingModelIsSuccessful(MODELS.ID_2);
            }
        })
    })
}