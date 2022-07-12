
export enum InputVariables {
    JMX_SOURCE = 'jmxSource',
    JMX_SOURCE_RUN_FILE_SOURCE_PATH = 'jmxsourceRunFilePath',
    JMX_SOURCE_RUN_FILE_URL ='jmxsourceRunFileURL',
    JMX_PROPERTY_FILE_SOURCE = 'jmxPropertySource',
    JMX_PROPERTY_FILE_SOURCE_PATH ='jmxPropertySourcePath',
    JMX_PROPERTY_FILE_URL ='jmxPropertySourceURL',
    JMX_INPUT_FILE_SOURCE = 'jmxInputFilesSource',
    JMX_INPUT_FOLDER_SOURCE_PATH ='jmxInputFolderSourcePath',
    JMX_INPUT_FILES_URL ='jmxInputFilesUrls',
    JMX_BINARY_URI ='jmeterURI',
    JMETER_FOLDER_NAME ='jmeterFolderName',
    JMETER_LOG_FOLDER = 'jmeterLogFolder',
    JMETER_REPORT_FOLDER = 'jmeterReportFolder',
    COPY_RESULT_TO_AZURE_BLOB_STORAGE = 'copyResultToAzureBlobStorage',
    PUBLISH_RESULTS_TO_BUILD_ARTIFACT = 'publishResultsToBuildArtifact',
    TOKEN_REGEX = 'tokenRegex',
    CONNECTED_SERVICE_ARM_NAME = 'ConnectedServiceNameARM',
    STORAGE_ACCOUNT_RM = 'StorageAccountRM',
    CONTAINER_NAME ='ContainerName',
    BLOB_PREFIX = 'BlobPrefix',
    OUTPUT_STORAGE_URI = 'outputStorageUri',
    ARTIFACT_NAME_REPORT = 'artifactNameReport',
    ARTIFACT_NAME_LOG = 'artifactNameLog'
}
export enum InputVariableType {
    SourceCode = 'sourceCode',
    Url = 'url',
    Urls = 'urls',
    None = 'none'
}