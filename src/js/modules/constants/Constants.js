export const URLS = {
    LOGIN_URL: "/auth/v1/login",
    LOGOUT_URL: "/auth/v1/logout",
    MODEL_URL: "/model-lcm/v1/models",
    SERVICE_URL: "/model-lcm/v1/model-services",
    MODEL_ENDPOINTS_SELDON_URL: "/seldon/",
    MODEL_ENDPOINTS_URL: "/model-endpoints/",
    SIMPLE_ML_DEMO_URL: "/simplemldemo",
    SIMPLE_ML_DEMO_URL_WITH_PARAM: "/simplemldemo?data=",
    ROUTES_URL: "/v1/routes/",
    USER_URL: "/idm/usermgmt/v1/users",
    TOKEN_URL: "/auth/realms/master/protocol/openid-connect/token",
    ROLES_URL: "/auth/admin/realms/master/roles",
    SCRAPE_URL: "/metrics/viewer/api/v1/targets?state=active"
}

const MODEL_FILE1 = "model1.zip";
const MODEL_FILE2 = "model2.zip";
const MODEL_FILE3 = "model3.zip";

const PATH_MODELS = "../../../resources/models/";
const PATH_MANIFESTS = "../../../resources/manifests/";

const MANIFEST_SINGLE_MODEL = "single_model_service.yml";
const MANIFEST_SINGLE_MODEL_2 = "single_model_service_upgrade.yml";
const MANIFEST_TWO_MODELS = "ab_model_service.yml";
const MANIFEST_CHANGE_REPLICAS = "single_model_service_three_replicas.yml";
const MANIFEST_CHANGE_WEIGHT = "ab_model_service_change_weight.yml";
const MANIFEST_SIMPLE_DEMO = "ml_test_service.yml";

export const DEMO_ROUTE = "simple-ml-demo-0-simplemldemo";

export const MODELS = {
    ID_1: "sample.model.1.test",
    ID_2: "sample.model.2.test",
    ID_3: "ml.test.model",
    FILE_1: open(PATH_MODELS + MODEL_FILE1, "b"),
    FILE_2: open(PATH_MODELS + MODEL_FILE2, "b"),
    FILE_3: open(PATH_MODELS + MODEL_FILE3, "b"),
}

export const SERVICES = {
    NAME_WITH_SINGLE_MODEL: "single-model-service",
    NAME_WITH_SINGLE_MODEL_2: "single-model-service-upgrade",
    NAME_WITH_TWO_MODELS: "ab-model-service",
    NAME_WITH_SIMPLE_DEMO: "ml-test-service",
}

export const MANIFESTS = {
    OPENED_SINGLE_MODEL_MANIFEST: open(PATH_MANIFESTS + MANIFEST_SINGLE_MODEL),
    OPENED_TWO_MODELS_MANIFEST: open(PATH_MANIFESTS + MANIFEST_TWO_MODELS),
    OPENED_SIMPLE_DEMO_MANIFEST: open(PATH_MANIFESTS + MANIFEST_SIMPLE_DEMO),
    OPENED_SINGLE_MODEL_MANIFEST_2: open(PATH_MANIFESTS + MANIFEST_SINGLE_MODEL_2),
    FILE_CHANGE_REPLICAS: open(PATH_MANIFESTS + MANIFEST_CHANGE_REPLICAS),
    FILE_CHANGE_WEIGHT: open(PATH_MANIFESTS + MANIFEST_CHANGE_WEIGHT),
}

export const MODEL_STATUSES = {
    PACKAGING: "packaging",
    AVAILABLE: "available"
}

export const SERVICE_STATUSES = {
    RUNNING: "running",
    CREATING: "creating"
}

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    CONFLICT: 409,
    FORBIDDEN: 403
}

export const PROTOCOL = "https://";

export const APPMGR_HOSTNAME = __ENV.APPMGR_HOSTNAME;

const tag1 = "build-" + __ENV.BUILD_NUMBER;
const tag2 = "build-" + __ENV.BUILD_NUMBER;
const tag3 = "build-" + __ENV.BUILD_NUMBER;

export const MODEL_IMAGE1 = APPMGR_HOSTNAME + "/armdocker.rnd.ericsson.se/proj-eric-oss-dev-test/eric-oss-ml-platform-app-test-model1:" + tag1;
export const MODEL_IMAGE2 = APPMGR_HOSTNAME + "/armdocker.rnd.ericsson.se/proj-eric-oss-dev-test/eric-oss-ml-platform-app-test-model2:" + tag2;
export const MODEL_IMAGE3 = APPMGR_HOSTNAME + "/armdocker.rnd.ericsson.se/proj-eric-oss-dev-test/eric-oss-ml-platform-app-test-model3:" + tag3;

export const DATA_MODEL1 =
    {
        "id": MODELS.ID_1,
        "description": "A Test Model returning the input string",
        "author": "ML Execution Env App Eng Team",
        "title": "Test Model",
        "version": "1.1.0",
        "image": MODEL_IMAGE1,
    };

export const DATA_MODEL2 =
    {
        "id": MODELS.ID_2,
        "description": "A Test Model returning the input string",
        "author": "ML Execution Env App Eng Team",
        "title": "Test model",
        "version": "2.2.0",
        "image": MODEL_IMAGE2,
    };

export const DATA_MODEL3 =
    {
        "id": MODELS.ID_3,
        "description": "A Test Model returning the received string with ml_ prefix",
        "author": "ML Execution Env App Eng Team",
        "title": "ML Execution Env Test Model",
        "version": "3.3.0",
        "image": MODEL_IMAGE3,
    };