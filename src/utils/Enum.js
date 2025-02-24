const ProjectStatusIdEnum = {
    UPLOADING: 1,
    UPLOADED: 2,
    IN_DEVELOPMENT: 3,
    READY_FOR_DEVELOPMENT: 4,
    DEVELOPMENT_UPDATED: 5,
    FINISHED: 6,
    READY_FOR_QA: 7,
    DESIGN_UPDATED: 8,
    FINISHED_INCREMENTALLY: 9,
    CHANGE_REQUESTED: 10,
}

const SourceTypeIdEnum = {
    FIGMA: 1,
}

const PROJECT_STATUS_ID_MAPPING = {
    1: 'Uploading',
    2: 'Uploaded',
    3: 'In development',
    4: 'Ready for development',
    5: 'Development updated',
    6: 'Finished',
    7: 'Ready for QA',
    8: 'Design updated',
    9: 'Finished incrementally',
    10: 'Change requested',
}

const TokenTypeEnum = {
    ACCESS: 'ACCESS',
    REFRESH: 'REFRESH',
    RESET_PASSWORD: 'RESET_PASSWORD',
    VERIFY_EMAIL: 'VERIFY_EMAIL',
};

module.exports = {
    ProjectStatusIdEnum,
    SourceTypeIdEnum,
    PROJECT_STATUS_ID_MAPPING,
    TokenTypeEnum
}