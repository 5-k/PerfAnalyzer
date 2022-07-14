"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.uploadBlob = exports.copyResultsToAzureBlob = void 0;
var utility_1 = require("./utility");
var constant_1 = require("./constant");
var storage_blob_1 = require("@azure/storage-blob");
var azure_arm_endpoint_1 = require("azure-pipelines-tasks-azure-arm-rest-v2/azure-arm-endpoint");
var fs = require('fs');
var tl = require('azure-pipelines-task-lib/task');
var Path = require('path');
var armStorage = require('azure-pipelines-tasks-azure-arm-rest-v2/azure-arm-storage');
function copyResultsToAzureBlob(reportFolderName, logFolderName) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var connectedServiceName, storageAccountName, azureEndpoint, storageArmClient, storageAccount, storageAccountResourceGroupName, accessKeys, accessKey, storageAccountURI, cert, blobServiceClient, destContainerName, destContainerClient, blobPrefix, reportFolderABSPath, e_1, logFolderABSPath, e_2, outputStorageUri, REPORT_URL, JTL_URL, LOG_URL;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, utility_1.logInformation)('Starting copyResultsToAzureBlob');
                    connectedServiceName = tl.getInput(constant_1.InputVariables.CONNECTED_SERVICE_ARM_NAME, true);
                    storageAccountName = tl.getInput(constant_1.InputVariables.STORAGE_ACCOUNT_RM, true);
                    return [4 /*yield*/, new azure_arm_endpoint_1.AzureRMEndpoint(connectedServiceName).getEndpoint()];
                case 1:
                    azureEndpoint = _b.sent();
                    storageArmClient = new armStorage.StorageManagementClient(azureEndpoint.applicationTokenCredentials, (_a = azureEndpoint.subscriptionID) !== null && _a !== void 0 ? _a : '');
                    return [4 /*yield*/, storageArmClient.storageAccounts.get(storageAccountName)];
                case 2:
                    storageAccount = _b.sent();
                    storageAccountResourceGroupName = getResourceGroupNameFromUri(storageAccount.id);
                    return [4 /*yield*/, storageArmClient.storageAccounts.listKeys(storageAccountResourceGroupName, storageAccountName, null)];
                case 3:
                    accessKeys = _b.sent();
                    accessKey = accessKeys[0];
                    storageAccountURI = constant_1.AZURE_STORAGE_ACCOUNT_URI.replace(constant_1.AZURE_STORAGE_ACCOUNT_NAME_PLACEHOLDER, storageAccountName);
                    cert = new storage_blob_1.StorageSharedKeyCredential(storageAccountName, accessKey);
                    blobServiceClient = new storage_blob_1.BlobServiceClient(storageAccountURI, cert);
                    destContainerName = tl.getInput(constant_1.InputVariables.CONTAINER_NAME);
                    if (!destContainerName || destContainerName.length == 0) {
                        (0, utility_1.logInformation)('Missing required variable: ' + constant_1.InputVariables.CONTAINER_NAME);
                        tl.setResult(tl.TaskResult.Failed, "Missing required variable: " + constant_1.InputVariables.CONTAINER_NAME);
                    }
                    destContainerClient = blobServiceClient.getContainerClient(destContainerName);
                    blobPrefix = tl.getInput(constant_1.InputVariables.BLOB_PREFIX);
                    reportFolderABSPath = Path.join(process.cwd(), reportFolderName);
                    (0, utility_1.logInformation)('Uploading Reports to Blob Storage from path: ' + reportFolderABSPath + ' to BlobStorageAccount: ' + storageAccountName + ' and container Name: ' + destContainerName + " at path: " + Path.join(blobPrefix, reportFolderName));
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, uploadBlob(reportFolderABSPath, reportFolderName, blobPrefix, destContainerClient)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    (0, utility_1.logInformation)('Error Publishing report to blob storage: ' + (e_1 === null || e_1 === void 0 ? void 0 : e_1.message));
                    return [3 /*break*/, 7];
                case 7:
                    logFolderABSPath = Path.join(process.cwd(), logFolderName);
                    (0, utility_1.logInformation)('Uploading Logs to Blob Storage from path: ' + logFolderABSPath + ' to BlobStorageAccount: ' + storageAccountName + ' and container Name: ' + destContainerName + " at path: " + Path.join(blobPrefix, logFolderName));
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, uploadBlob(logFolderABSPath, logFolderName, blobPrefix, destContainerClient)];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_2 = _b.sent();
                    (0, utility_1.logInformation)('Error Publishing LOGS to blob storage: ' + (e_2 === null || e_2 === void 0 ? void 0 : e_2.message));
                    return [3 /*break*/, 11];
                case 11:
                    outputStorageUri = tl.getInput(constant_1.InputVariables.OUTPUT_STORAGE_URI);
                    if (!outputStorageUri || outputStorageUri.length == 0) {
                        (0, utility_1.logInformation)('No Output Storage URL Provided. Hence unable to create performance test Result.');
                    }
                    else {
                        if (!outputStorageUri.endsWith(constant_1.URL_SEPERATOR)) {
                            outputStorageUri = outputStorageUri + constant_1.URL_SEPERATOR;
                        }
                        if (!blobPrefix.endsWith(constant_1.URL_SEPERATOR)) {
                            blobPrefix = blobPrefix + constant_1.URL_SEPERATOR;
                        }
                        REPORT_URL = outputStorageUri + blobPrefix + reportFolderName + constant_1.URL_SEPERATOR + constant_1.JMETER_REPORT_INDEX_FILE_NAME;
                        JTL_URL = outputStorageUri + blobPrefix + logFolderName + constant_1.URL_SEPERATOR + constant_1.LOG_JTL_FILE_NAME;
                        LOG_URL = outputStorageUri + blobPrefix + logFolderName + constant_1.URL_SEPERATOR + constant_1.JMETER_LOG_FILE_NAME;
                        (0, utility_1.logInformation)(' Performance Test Result Available at: ' + REPORT_URL);
                        (0, utility_1.logInformation)(' JMeter JTL File Available at: ' + JTL_URL);
                        (0, utility_1.logInformation)(' JMeter Log File Available at: ' + LOG_URL);
                        tl.warning(' Performance Test Result Available at: ' + REPORT_URL);
                        tl.warning(' JMeter JTL File Available at: ' + JTL_URL);
                        tl.warning(' JMeter Log File Available at: ' + LOG_URL);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.copyResultsToAzureBlob = copyResultsToAzureBlob;
function uploadBlob(src, uploadFolderName, blobPrefix, destContainerClient) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readdir(src, { withFileTypes: true }, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, files_1, entry, srcPath, uploadFileName, path, blockBlobClient;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!err) return [3 /*break*/, 1];
                                    (0, utility_1.logInformation)(err);
                                    return [3 /*break*/, 7];
                                case 1:
                                    _i = 0, files_1 = files;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < files_1.length)) return [3 /*break*/, 7];
                                    entry = files_1[_i];
                                    srcPath = Path.join(src, entry.name);
                                    uploadFileName = srcPath.substring(srcPath.indexOf(uploadFolderName));
                                    if (!entry.isDirectory()) return [3 /*break*/, 4];
                                    return [4 /*yield*/, uploadBlob(srcPath, uploadFolderName, blobPrefix, destContainerClient)];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 6];
                                case 4:
                                    path = '';
                                    if (!blobPrefix || blobPrefix.length == 0) {
                                        path = uploadFileName;
                                    }
                                    else {
                                        path = Path.join(blobPrefix, uploadFileName);
                                    }
                                    blockBlobClient = destContainerClient.getBlockBlobClient(path);
                                    return [4 /*yield*/, blockBlobClient.uploadFile(srcPath, getBlobOptions(uploadFileName))];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.uploadBlob = uploadBlob;
function getResourceGroupNameFromUri(resourceUri) {
    if ((0, utility_1.isNonEmpty)(resourceUri)) {
        resourceUri = resourceUri.toLowerCase();
        return resourceUri.substring(resourceUri.indexOf("resourcegroups/") + "resourcegroups/".length, resourceUri.indexOf("/providers"));
    }
    return "";
}
function getBlobOptions(fileName) {
    var type = '';
    if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
        type = 'text/html';
    }
    else if (fileName.endsWith('.css')) {
        type = 'text/css';
    }
    else if (fileName.endsWith('.js')) {
        type = 'text/javascript';
    }
    else if (fileName.endsWith('.png')) {
        type = 'image/png';
    }
    else if (fileName.endsWith('.svg')) {
        type = 'image/svg+xml';
    }
    else if (fileName.endsWith('.woff')) {
        type = 'font/woff';
    }
    else if (fileName.endsWith('.woff2')) {
        type = 'font/woff2';
    }
    else if (fileName.endsWith('.ttf')) {
        type = 'font/ttf';
    }
    else if (fileName.endsWith('.eot')) {
        type = 'font/eot';
    }
    else if (fileName.endsWith('.jpg')) {
        type = 'images/jpg';
    }
    else if (fileName.endsWith('.jpeg')) {
        type = 'images/jpeg';
    }
    else if (fileName.endsWith('.json') || fileName.endsWith('.md') || fileName.endsWith('.less')) {
        type = 'text/plain';
    }
    else {
        type = 'text/plain';
    }
    var blobOptions = { blobHTTPHeaders: { blobContentType: type } };
    return blobOptions;
}
