const ProjectStatusIdEnum = {
    UPLOADED: 1,
    IN_DEVELOPMENT: 2,
    READY_FOR_DEVELOPMENT: 3,
    DEVELOPMENT_UPDATED: 4,
    FINISHED: 5,
    READY_FOR_QA: 6,
    DESIGN_UPDATED: 7
}

const SourceTypeIdEnum = {
    FIGMA: 1,
}

const PROJECT_STATUS_ID_MAPPING = {
    1: 'Uploaded',
    2: 'In development',
    3: 'Ready for development',
    4: 'Development updated',
    5: 'Finished',
    6: 'Ready for QA',
    7: 'Design updated',
}

module.exports = {
    ProjectStatusIdEnum,
    SourceTypeIdEnum,
    PROJECT_STATUS_ID_MAPPING
}