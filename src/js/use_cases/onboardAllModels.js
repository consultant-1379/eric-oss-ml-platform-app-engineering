import { group } from "k6";
import { checkOnboardModel, checkModelIsOnboarded, checkModelIsOnboardedToTestUpgrade, checkOnboardModelToTestUpgrade } from "../modules/checks/ModelChecks.js";
import { MODELS, DATA_MODEL1, DATA_MODEL2, DATA_MODEL3, MODEL_IMAGE1 } from "../modules/constants/Constants.js";

const TESTSTAGE = `${__ENV.TESTSTAGE}`;

export function onboardAllModelsTest() {

    group("Onboard models", () => {
        group("Onboard models", () => {
            console.log("image: ", MODEL_IMAGE1);
            checkOnboardModel(MODELS.ID_1, DATA_MODEL1);
            checkOnboardModel(MODELS.ID_3, DATA_MODEL3);
            if(TESTSTAGE === "preupgrade") {
                console.log("onboard model before upgrade: ", MODELS.ID_2);
                checkOnboardModel(MODELS.ID_2, DATA_MODEL2);
            };
        })
    })

}

export function checkIfModelsAvailableTest() {
    group("Check model is onboarded", () => {
        group("Check model is onboarded", () => {
            checkModelIsOnboarded(MODELS.ID_2);
        })
    })
}