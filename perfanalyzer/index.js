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
exports.replaceTokens = void 0;
var tl = require('azure-pipelines-task-lib/task');
var https = require('https');
var fs = require('fs');
var tar = require('tar');
var Path = require('path');
var sh = require('shelljs');
var util = require('util');
var exec = require('child_process').exec;
var moment = require("moment");
var JMETER_FILE_NAME = 'apache-jmeter.tgz';
var JMETER_BIN_Folder_NAME = 'bin';
var armStorage = require('azure-pipelines-tasks-azure-arm-rest-v2/azure-arm-storage');
var azure_arm_endpoint_1 = require("azure-pipelines-tasks-azure-arm-rest-v2/azure-arm-endpoint");
var _a = require("@azure/storage-blob"), BlobServiceClient = _a.BlobServiceClient, StorageSharedKeyCredential = _a.StorageSharedKeyCredential, BlockBlobParallelUploadOptions = _a.BlockBlobParallelUploadOptions, BlobHTTPHeaders = _a.BlobHTTPHeaders;
var DATE_FORMAT = 'DD-MMM-YYYY HH:mm:ss:SSS ZZ';
var DEFAULT_JMETER_REPORT_DIR_NAME = "CurrentReport";
var DEFAULT_JMETER_LOG_DIR_NAME = "CurrentLog";
var AZURE_STORAGE_ACCOUNT_URI = 'https://${storageAccountName}.blob.core.windows.net';
var AZURE_STORAGE_ACCOUNT_NAME_PLACEHOLDER = '${storageAccountName}';
var LOG_JTL_FILE_NAME = 'log.jtl';
var JMETER_LOG_FILE_NAME = 'jmeter.log';
var JMETER_REPORT_INDEX_FILE_NAME = 'index.html';
var URL_SEPERATOR = '/';
var InputVariables;
(function (InputVariables) {
    InputVariables["JMX_SOURCE"] = "jmxSource";
    InputVariables["JMX_SOURCE_RUN_FILE_SOURCE_PATH"] = "jmxsourceRunFilePath";
    InputVariables["JMX_SOURCE_RUN_FILE_URL"] = "jmxsourceRunFileURL";
    InputVariables["JMX_PROPERTY_FILE_SOURCE"] = "jmxPropertySource";
    InputVariables["JMX_PROPERTY_FILE_SOURCE_PATH"] = "jmxPropertySourcePath";
    InputVariables["JMX_PROPERTY_FILE_URL"] = "jmxPropertySourceURL";
    InputVariables["JMX_INPUT_FILE_SOURCE"] = "jmxInputFilesSource";
    InputVariables["JMX_INPUT_FOLDER_SOURCE_PATH"] = "jmxInputFolderSourcePath";
    InputVariables["JMX_INPUT_FILES_URL"] = "jmxInputFilesUrls";
    InputVariables["JMX_BINARY_URI"] = "jmeterURI";
    InputVariables["JMETER_FOLDER_NAME"] = "jmeterFolderName";
    InputVariables["JMETER_LOG_FOLDER"] = "jmeterLogFolder";
    InputVariables["JMETER_REPORT_FOLDER"] = "jmeterReportFolder";
    InputVariables["COPY_RESULT_TO_AZURE_BLOB_STORAGE"] = "copyResultToAzureBlobStorage";
    InputVariables["TOKEN_REGEX"] = "tokenRegex";
    InputVariables["CONNECTED_SERVICE_ARM_NAME"] = "ConnectedServiceNameARM";
    InputVariables["STORAGE_ACCOUNT_RM"] = "StorageAccountRM";
    InputVariables["CONTAINER_NAME"] = "ContainerName";
    InputVariables["BLOB_PREFIX"] = "BlobPrefix";
    InputVariables["OUTPUT_STORAGE_URI"] = "outputStorageUri";
})(InputVariables || (InputVariables = {}));
var InputVariableType;
(function (InputVariableType) {
    InputVariableType["SourceCode"] = "sourceCode";
    InputVariableType["Url"] = "url";
    InputVariableType["Urls"] = "urls";
    InputVariableType["None"] = "none";
})(InputVariableType || (InputVariableType = {}));
function downloadFile(fileSource, destinationFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logInformation('Downloading File: ' + fileSource + ' to location: ' + destinationFilePath);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    https.get(fileSource, function (response) {
                        var stream = fs.createWriteStream(destinationFilePath);
                        response.on("error", reject);
                        stream.on("finish", function () {
                            stream.close();
                            logInformation("Download " + fileSource + " Completed to :" + destinationFilePath);
                            resolve();
                        }).on("error", reject);
                        response.pipe(stream);
                    }).on("error", reject);
                })];
        });
    });
}
function unzipJMeterBinary() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tar.x({ file: JMETER_FILE_NAME })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function copyFileToDirectory(sourcefilePath, destinationFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logInformation('Start Copying File to destination ' + destinationFilePath + ' from source ' + sourcefilePath);
                    return [4 /*yield*/, fs.copyFile(sourcefilePath, destinationFilePath, function (err) {
                            if (err)
                                throw err;
                            logInformation('Completed ' + sourcefilePath + ' was copied to ' + destinationFilePath);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function copyDir(src, dest) {
    return __awaiter(this, void 0, void 0, function () {
        var fileNames;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileNames = [];
                    return [4 /*yield*/, fs.readdir(src, { withFileTypes: true }, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, files_1, entry, srcPath, destPath, fileName;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!err) return [3 /*break*/, 1];
                                        logInformation(err);
                                        return [3 /*break*/, 7];
                                    case 1:
                                        _i = 0, files_1 = files;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < files_1.length)) return [3 /*break*/, 7];
                                        entry = files_1[_i];
                                        srcPath = Path.join(src, entry.name);
                                        destPath = Path.join(dest, entry.name);
                                        if (!entry.isDirectory()) return [3 /*break*/, 4];
                                        return [4 /*yield*/, copyDir(srcPath, dest)];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, copyFileToDirectory(srcPath, destPath)];
                                    case 5:
                                        _a.sent();
                                        fileName = Path.parse(destPath).base;
                                        fileNames.push(fileName);
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
                    return [2 /*return*/, fileNames];
            }
        });
    });
}
function handleJMeterJMXFile(JMETER_BIN_Folder) {
    return __awaiter(this, void 0, void 0, function () {
        var jmxSourceInput, jmxSourceRunFilePath, fileName, destinationFilePath, jmxSourceRunFileURL, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jmxSourceInput = tl.getInput(InputVariables.JMX_SOURCE, true);
                    if (!(jmxSourceInput == InputVariableType.SourceCode)) return [3 /*break*/, 2];
                    jmxSourceRunFilePath = tl.getInput(InputVariables.JMX_SOURCE_RUN_FILE_SOURCE_PATH, true);
                    if (isEmpty(jmxSourceRunFilePath)) {
                        tl.setResult(tl.TaskResult.Failed, "Missing Source File Path");
                        return [2 /*return*/, null];
                    }
                    fileName = Path.parse(jmxSourceRunFilePath).base;
                    destinationFilePath = Path.join(JMETER_BIN_Folder, fileName);
                    logInformation('Copying JMX Source File from Source: ' + jmxSourceRunFilePath + " to destination: " + destinationFilePath);
                    return [4 /*yield*/, copyFileToDirectory(jmxSourceRunFilePath, destinationFilePath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, fileName];
                case 2:
                    jmxSourceRunFileURL = tl.getInput(InputVariables.JMX_SOURCE_RUN_FILE_URL, true);
                    if (isEmpty(jmxSourceRunFileURL)) {
                        tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX From External URL");
                        return [2 /*return*/, null];
                    }
                    jmxSourceRunFileURL = jmxSourceRunFileURL.trim();
                    fileName = Path.parse(jmxSourceRunFileURL).base;
                    logInformation('Downloading File from source ' + jmxSourceRunFileURL + ' to destination' + fileName + ' at location preloaded: ' + JMETER_BIN_Folder);
                    return [4 /*yield*/, downloadFile(jmxSourceRunFileURL, fileName)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, fileName];
            }
        });
    });
}
function handleJMeterPropertyFile(JMETER_BIN_Folder) {
    return __awaiter(this, void 0, void 0, function () {
        var jmxPropertySource, jmxPropertyFilePath, fileName, destinationFilePath, jmxPropertyFileURL, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jmxPropertySource = tl.getInput(InputVariables.JMX_PROPERTY_FILE_SOURCE, true);
                    if (!(jmxPropertySource == InputVariableType.None)) return [3 /*break*/, 1];
                    logInformation("No Property File Input");
                    return [2 /*return*/, null];
                case 1:
                    if (!(jmxPropertySource == InputVariableType.SourceCode)) return [3 /*break*/, 3];
                    jmxPropertyFilePath = tl.getInput(InputVariables.JMX_PROPERTY_FILE_SOURCE_PATH, true);
                    if (isEmpty(jmxPropertyFilePath)) {
                        tl.setResult(tl.TaskResult.Failed, "Missing Property File Path");
                        return [2 /*return*/, null];
                    }
                    fileName = Path.parse(jmxPropertyFilePath).base;
                    destinationFilePath = Path.join(JMETER_BIN_Folder, fileName);
                    logInformation('Copying JMX Property File from Source: ' + jmxPropertyFilePath + " to destination: " + destinationFilePath);
                    return [4 /*yield*/, copyFileToDirectory(jmxPropertyFilePath, destinationFilePath)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, fileName];
                case 3:
                    jmxPropertyFileURL = tl.getInput(InputVariables.JMX_PROPERTY_FILE_URL, true);
                    if (isEmpty(jmxPropertyFileURL)) {
                        tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX Property File From External URL");
                        return [2 /*return*/];
                    }
                    jmxPropertyFileURL = jmxPropertyFileURL.trim();
                    fileName = Path.parse(jmxPropertyFileURL).base;
                    logInformation('Downloading File from source ' + jmxPropertyFileURL + ' to destination' + fileName + ' at location preloaded: ' + JMETER_BIN_Folder);
                    return [4 /*yield*/, downloadFile(jmxPropertyFileURL, fileName)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, fileName];
            }
        });
    });
}
function handleJMeterInputFile(JMETER_BIN_Folder) {
    return __awaiter(this, void 0, void 0, function () {
        var jmxInputFilesSource, jmxInputFolderSourcePath, jmxInputFolderSourceUrls, fileNames, count, _i, jmxInputFolderSourceUrls_1, file, fileName, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jmxInputFilesSource = tl.getInput(InputVariables.JMX_INPUT_FILE_SOURCE, true);
                    if (!(jmxInputFilesSource == InputVariableType.None)) return [3 /*break*/, 1];
                    logInformation('Not downloading files');
                    return [2 /*return*/, null];
                case 1:
                    if (!(jmxInputFilesSource == InputVariableType.SourceCode)) return [3 /*break*/, 3];
                    jmxInputFolderSourcePath = tl.getInput(InputVariables.JMX_INPUT_FOLDER_SOURCE_PATH, true);
                    if (!jmxInputFolderSourcePath || jmxInputFolderSourcePath.length == 0) {
                        tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX Input File From Source");
                        return [2 /*return*/, null];
                    }
                    logInformation('Downloading Input File(s) from source ' + jmxInputFolderSourcePath + ' to destination' + JMETER_BIN_Folder);
                    return [4 /*yield*/, copyDir(jmxInputFolderSourcePath, JMETER_BIN_Folder)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    jmxInputFolderSourceUrls = tl.getDelimitedInput(InputVariables.JMX_INPUT_FILES_URL, ',', true);
                    if (isEmpty(jmxInputFolderSourceUrls)) {
                        tl.setResult(tl.TaskResult.Failed, "Missing User Input External URLs");
                        return [2 /*return*/, null];
                    }
                    fileNames = [];
                    count = 0;
                    _i = 0, jmxInputFolderSourceUrls_1 = jmxInputFolderSourceUrls;
                    _a.label = 4;
                case 4:
                    if (!(_i < jmxInputFolderSourceUrls_1.length)) return [3 /*break*/, 9];
                    file = jmxInputFolderSourceUrls_1[_i];
                    if (isEmpty(file)) {
                        logInformation('Skipping File');
                        return [3 /*break*/, 8];
                    }
                    count++;
                    file = file.trim();
                    fileName = Path.parse(file).base;
                    logInformation('Downloading (' + count + '/' + jmxInputFolderSourceUrls.length + '). File from source ' + file + ' to destination' + fileName + ' to preloaded location: ' + JMETER_BIN_Folder);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, downloadFile(file, fileName)];
                case 6:
                    _a.sent();
                    fileNames.push(fileName);
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _a.sent();
                    logInformation('Could not download File: ' + file);
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 4];
                case 9: return [2 /*return*/, fileNames];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var JMETER_URL, JMETER_FILE_Folder, JMETER_BIN_Folder, JMETER_ABS_BIN_Folder, jmeterJMXFileName, jmxPropertySource, jmxInputFilesSource, jmeterPropertyFileName, jmeterInputFileNames, jmeterLogFolder, jmeterReportFolder, command, CurrentLogJTLFile, CurrentLogLogFile, exec2, promise2, promise, child, child2, _a, stdout, stderr, copyToBlob, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 15, , 16]);
                    JMETER_URL = tl.getInput(InputVariables.JMX_BINARY_URI, true);
                    JMETER_FILE_Folder = tl.getInput(InputVariables.JMETER_FOLDER_NAME, true);
                    JMETER_BIN_Folder = Path.join(JMETER_FILE_Folder, JMETER_BIN_Folder_NAME);
                    JMETER_ABS_BIN_Folder = Path.join(process.cwd(), JMETER_FILE_Folder, JMETER_BIN_Folder_NAME);
                    logInformation('Current Working directory: ' + process.cwd());
                    logInformation('JMETER_URL ' + JMETER_URL);
                    logInformation('JMETER_FILE_Folder ' + JMETER_FILE_Folder);
                    logInformation('JMETER_BIN_Folder ' + JMETER_BIN_Folder);
                    logInformation('JMETER_ABS_BIN_Folder ' + JMETER_ABS_BIN_Folder);
                    logInformation('Current Working directory: ' + process.cwd());
                    logInformation('Start Downloading JMeter Binary');
                    return [4 /*yield*/, downloadFile(JMETER_URL, JMETER_FILE_NAME)];
                case 1:
                    _b.sent();
                    logInformation('Completed Downloading JMeter Binary');
                    logInformation('Start Unzipping JMeter Binary');
                    return [4 /*yield*/, unzipJMeterBinary()];
                case 2:
                    _b.sent();
                    logInformation('Completed Unzipping JMeter Binary');
                    return [4 /*yield*/, process.chdir(JMETER_ABS_BIN_Folder)];
                case 3:
                    _b.sent();
                    logInformation('Change Directory to JMeter Bin Path ' + JMETER_ABS_BIN_Folder + ' completed. Current Working Directory: ' + process.cwd());
                    logInformation('Start handleJMeterJMXFile. Current Working directory' + process.cwd());
                    return [4 /*yield*/, handleJMeterJMXFile(JMETER_ABS_BIN_Folder)];
                case 4:
                    jmeterJMXFileName = _b.sent();
                    logInformation('Completed handleJMeterJMXFile JMXFileName: ' + jmeterJMXFileName);
                    jmxPropertySource = tl.getInput(InputVariables.JMX_PROPERTY_FILE_SOURCE, true);
                    jmxInputFilesSource = tl.getInput(InputVariables.JMX_INPUT_FILE_SOURCE, true);
                    jmeterPropertyFileName = null;
                    if (!(jmxPropertySource == InputVariableType.None)) return [3 /*break*/, 5];
                    logInformation('No Property File Configuration Enabled. Skipping Property Configuration Step.');
                    return [3 /*break*/, 7];
                case 5:
                    logInformation('Start Handle Property Files. Current Working directory: ' + process.cwd());
                    return [4 /*yield*/, handleJMeterPropertyFile(JMETER_ABS_BIN_Folder)];
                case 6:
                    jmeterPropertyFileName = _b.sent();
                    if (isEmpty(jmeterPropertyFileName)) {
                        logInformation('No Property Input Files Found to Use In Pipeline');
                        tl.setResult(tl.TaskResult.Failed, 'No Property Input Files Found to Use In Pipeline');
                        return [2 /*return*/];
                    }
                    logInformation('Completed Handle Property Files jmeterPropertyFileName: ' + jmeterPropertyFileName);
                    _b.label = 7;
                case 7:
                    if (!(jmxInputFilesSource == InputVariableType.None)) return [3 /*break*/, 8];
                    logInformation('No Input File Configuration Enabled. Skipping Input File Configuration Step.');
                    return [3 /*break*/, 10];
                case 8:
                    logInformation('Start Handle Input Files. Current Working directory: ' + process.cwd());
                    return [4 /*yield*/, handleJMeterInputFile(JMETER_ABS_BIN_Folder)];
                case 9:
                    jmeterInputFileNames = _b.sent();
                    logInformation('Completed Handle Input Files. FileCount: ' + ((null != jmeterInputFileNames) ? jmeterInputFileNames === null || jmeterInputFileNames === void 0 ? void 0 : jmeterInputFileNames.length : 0));
                    _b.label = 10;
                case 10:
                    jmeterLogFolder = tl.getInput(InputVariables.JMETER_LOG_FOLDER, true);
                    jmeterReportFolder = tl.getInput(InputVariables.JMETER_REPORT_FOLDER, true);
                    if (isEmpty(jmeterLogFolder)) {
                        jmeterLogFolder = DEFAULT_JMETER_LOG_DIR_NAME;
                        logInformation('Missing JMeter Log Folder Name. Using ' + DEFAULT_JMETER_LOG_DIR_NAME + ' as default name.');
                    }
                    if (isEmpty(jmeterReportFolder)) {
                        jmeterReportFolder = DEFAULT_JMETER_REPORT_DIR_NAME;
                        logInformation('Missing JMeter Report Folder Name. Using ' + DEFAULT_JMETER_REPORT_DIR_NAME + ' as default name.');
                    }
                    command = '';
                    CurrentLogJTLFile = Path.join(jmeterLogFolder, LOG_JTL_FILE_NAME);
                    CurrentLogLogFile = Path.join(jmeterLogFolder, JMETER_LOG_FILE_NAME);
                    if (!(jmxPropertySource == 'none')) return [3 /*break*/, 11];
                    command = 'jmeter -n -t ' + jmeterJMXFileName + '  -l ' + CurrentLogJTLFile + ' -j ' + CurrentLogLogFile + ' -f -e -o ' + jmeterReportFolder;
                    logInformation('Running JMeter Without Property File: ' + command);
                    return [3 /*break*/, 13];
                case 11:
                    logInformation('Running Replace Tokens for file ' + jmeterPropertyFileName + ' Current Working directory: ' + process.cwd());
                    return [4 /*yield*/, replaceTokens(jmeterPropertyFileName)];
                case 12:
                    _b.sent();
                    logInformation('Completed Replace Tokens');
                    command = 'jmeter -q ' + jmeterPropertyFileName + ' -n -t ' + jmeterJMXFileName + '  -l ' + CurrentLogJTLFile + ' -j ' + CurrentLogLogFile + ' -f -e -o ' + jmeterReportFolder;
                    logInformation('Running JMeter with property file ' + command);
                    _b.label = 13;
                case 13:
                    exec2 = util.promisify(require('child_process').exec);
                    promise2 = exec2(command);
                    promise = exec(command);
                    tl.warning('promise');
                    tl.warning(promise);
                    tl.warning('promise2');
                    tl.warning(promise2);
                    child = promise.child;
                    child2 = promise.child2;
                    tl.warning('child');
                    tl.warning(child);
                    tl.warning('child2');
                    tl.warning(child2);
                    if (null != child) {
                        child.stdout.on('data', function (data) {
                            logInformation(' stdout: ' + data);
                        });
                        child.stderr.on('data', function (data) {
                            logInformation(' stderr: ' + data);
                        });
                        child.on('close', function (code) {
                            logInformation(' closing code: ' + code);
                        });
                    }
                    return [4 /*yield*/, promise2];
                case 14:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    copyToBlob = tl.getBoolInput(InputVariables.COPY_RESULT_TO_AZURE_BLOB_STORAGE, true);
                    if (copyToBlob) {
                        logInformation('Copying Test Results to Azure blob storage.');
                        copyResultsToAzureBlob(jmeterReportFolder, jmeterLogFolder);
                    }
                    logInformation('Task Completed.');
                    return [3 /*break*/, 16];
                case 15:
                    err_1 = _b.sent();
                    logInformation(err_1);
                    tl.setResult(tl.TaskResult.Failed, err_1 === null || err_1 === void 0 ? void 0 : err_1.message);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function replaceTokens(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var errCount, sourcePath, warningsAsErrors, tokenRegex, warning, files, i, file, contents, reg, match, newContents, vName, vIsArray, vValue, msg;
        return __generator(this, function (_a) {
            errCount = 0;
            try {
                logInformation("Starting Replace Tokens task for file: " + fileName);
                sourcePath = fileName;
                if (!sourcePath || sourcePath.length === 0) {
                    tl.setResult(tl.TaskResult.Failed, "No File Found to replace token");
                    return [2 /*return*/];
                }
                // clear leading and trailing quotes for paths with spaces
                sourcePath = sourcePath.replace(/"/g, "");
                // remove trailing slash
                if (sourcePath.endsWith("\\") || sourcePath.endsWith("/")) {
                    logInformation("Trimming separator off sourcePath");
                    sourcePath = sourcePath.substr(0, sourcePath.length - 1);
                }
                tl.checkPath(sourcePath, "sourcePath");
                warningsAsErrors = true;
                tokenRegex = tl.getInput(InputVariables.TOKEN_REGEX, true);
                warning = warningsAsErrors ?
                    function (message) { tl.error(message); errCount++; } :
                    function (message) { return tl.warning(message); };
                logInformation("sourcePath: [".concat(sourcePath, "]"));
                logInformation("tokenRegex: [".concat(tokenRegex, "]"));
                if (!tokenRegex || tokenRegex.length === 0) {
                    tokenRegex = "__(\\w+)__";
                }
                files = [sourcePath];
                for (i = 0; i < files.length; i++) {
                    file = files[i];
                    logInformation("Starting regex replacement in [".concat(file, "]"));
                    contents = fs.readFileSync(file).toString();
                    reg = new RegExp(tokenRegex, "g");
                    newContents = contents;
                    while ((match = reg.exec(contents)) !== null) {
                        vName = match[1];
                        vIsArray = vName.endsWith("[]");
                        if (vIsArray) {
                            vName = vName.substring(0, vName.length - 2);
                            logInformation("Detected that ".concat(vName, " is an array token"));
                        }
                        vValue = tl.getVariable(vName);
                        if (typeof vValue === 'undefined') {
                            warning("Token [".concat(vName, "] does not have an environment value"));
                        }
                        else {
                            if (vIsArray) {
                                newContents = newContents.replace(match[0], vValue.replace(/,/g, "\",\""));
                            }
                            else {
                                newContents = newContents.replace(match[0], vValue);
                            }
                            logInformation("Replaced token [".concat(vName, "]"));
                        }
                    }
                    logInformation("Writing new values to file");
                    sh.chmod(666, file);
                    fs.writeFileSync(file, newContents);
                }
            }
            catch (err) {
                msg = err;
                if (err.message) {
                    msg = err.message;
                }
                tl.setResult(tl.TaskResult.Failed, msg);
            }
            if (errCount > 0) {
                tl.setResult(tl.TaskResult.Failed, "Errors were encountered - please check logs for details.");
            }
            logInformation("Leaving Replace Tokens task");
            return [2 /*return*/];
        });
    });
}
exports.replaceTokens = replaceTokens;
function copyResultsToAzureBlob(reportFolderName, logFolderName) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var connectedServiceName, storageAccountName, azureEndpoint, storageArmClient, storageAccount, storageAccountResourceGroupName, accessKeys, accessKey, storageAccountURI, cert, blobServiceClient, destContainerName, destContainerClient, blobPrefix, reportFolderABSPath, logFolderABSPath, outputStorageUri, REPORT_URL, JTL_URL, LOG_URL;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logInformation('Starting copyResultsToAzureBlob');
                    connectedServiceName = tl.getInput(InputVariables.CONNECTED_SERVICE_ARM_NAME, true);
                    storageAccountName = tl.getInput(InputVariables.STORAGE_ACCOUNT_RM, true);
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
                    storageAccountURI = AZURE_STORAGE_ACCOUNT_URI.replace(AZURE_STORAGE_ACCOUNT_NAME_PLACEHOLDER, storageAccountName);
                    cert = new StorageSharedKeyCredential(storageAccountName, accessKey);
                    blobServiceClient = new BlobServiceClient(storageAccountURI, cert);
                    destContainerName = tl.getInput(InputVariables.CONTAINER_NAME);
                    if (!destContainerName || destContainerName.length == 0) {
                        logInformation('Missing required variable: ' + InputVariables.CONTAINER_NAME);
                        tl.setResult(tl.TaskResult.Failed, "Missing required variable: " + InputVariables.CONTAINER_NAME);
                    }
                    destContainerClient = blobServiceClient.getContainerClient(destContainerName);
                    blobPrefix = tl.getInput(InputVariables.BLOB_PREFIX);
                    reportFolderABSPath = Path.join(process.cwd(), reportFolderName);
                    logInformation('Uploading Reports to Blob Storage from path: ' + reportFolderABSPath + ' to BlobStorageAccount: ' + storageAccountName + ' and container Name: ' + destContainerName + " at path: " + Path.join(blobPrefix, reportFolderName));
                    return [4 /*yield*/, uploadBlob(reportFolderABSPath, reportFolderName, blobPrefix, destContainerClient)];
                case 4:
                    _b.sent();
                    logFolderABSPath = Path.join(process.cwd(), logFolderName);
                    logInformation('Uploading Logs to Blob Storage from path: ' + logFolderABSPath + ' to BlobStorageAccount: ' + storageAccountName + ' and container Name: ' + destContainerName + " at path: " + Path.join(blobPrefix, logFolderName));
                    return [4 /*yield*/, uploadBlob(logFolderABSPath, logFolderName, blobPrefix, destContainerClient)];
                case 5:
                    _b.sent();
                    outputStorageUri = tl.getInput(InputVariables.OUTPUT_STORAGE_URI);
                    if (!outputStorageUri || outputStorageUri.length == 0) {
                        logInformation('No Output Storage URL Provided. Hence unable to create performance test Result.');
                    }
                    else {
                        if (!outputStorageUri.endsWith(URL_SEPERATOR)) {
                            outputStorageUri = outputStorageUri + URL_SEPERATOR;
                        }
                        if (!blobPrefix.endsWith(URL_SEPERATOR)) {
                            blobPrefix = blobPrefix + URL_SEPERATOR;
                        }
                        REPORT_URL = outputStorageUri + blobPrefix + reportFolderName + URL_SEPERATOR + JMETER_REPORT_INDEX_FILE_NAME;
                        JTL_URL = outputStorageUri + blobPrefix + logFolderName + URL_SEPERATOR + LOG_JTL_FILE_NAME;
                        LOG_URL = outputStorageUri + blobPrefix + logFolderName + URL_SEPERATOR + JMETER_LOG_FILE_NAME;
                        logInformation(' Performance Test Result Available at: ' + REPORT_URL);
                        logInformation(' JMeter JTL File Available at: ' + JTL_URL);
                        logInformation(' JMeter Log File Available at: ' + LOG_URL);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function uploadBlob(src, uploadFolderName, blobPrefix, destContainerClient) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readdir(src, { withFileTypes: true }, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, files_2, entry, srcPath, uploadFileName, path, blockBlobClient;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!err) return [3 /*break*/, 1];
                                    logInformation(err);
                                    return [3 /*break*/, 7];
                                case 1:
                                    _i = 0, files_2 = files;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < files_2.length)) return [3 /*break*/, 7];
                                    entry = files_2[_i];
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
function getResourceGroupNameFromUri(resourceUri) {
    if (isNonEmpty(resourceUri)) {
        resourceUri = resourceUri.toLowerCase();
        return resourceUri.substring(resourceUri.indexOf("resourcegroups/") + "resourcegroups/".length, resourceUri.indexOf("/providers"));
    }
    return "";
}
function isEmpty(str) {
    return (!str || str.length == 0);
}
function isNonEmpty(str) {
    return !isEmpty(str);
}
function logInformation(data) {
    var formattedDate = (moment(Date.now())).format(DATE_FORMAT);
    console.log(formattedDate + ":  " + data);
    tl.debug(formattedDate + ":  " + data);
}
main();
