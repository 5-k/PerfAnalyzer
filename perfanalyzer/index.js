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
var constant_1 = require("./src/constant");
var replaceToken_1 = require("./src/replaceToken");
var azure_task_lib_utility_1 = require("./src/azure-task-lib.utility");
var utility_1 = require("./src/utility");
var blob_utils_1 = require("./src/blob-utils");
var jmeter_utils_1 = require("./src/jmeter-utils");
var tl = require('azure-pipelines-task-lib/task');
var Path = require('path');
var exec = require('child_process').exec;
function PostResults(jmeterReportFolder, jmeterLogFolder, JMETER_ABS_BIN_Folder) {
    return __awaiter(this, void 0, void 0, function () {
        var copyToBlob, ReportABSPath, LogABSPath, publishResultsToBuildArtifact, artifactReport, artifactLOG, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        copyToBlob = tl.getBoolInput(constant_1.InputVariables.COPY_RESULT_TO_AZURE_BLOB_STORAGE, true);
                        if (copyToBlob) {
                            (0, utility_1.logInformation)('Copying Test Results to Azure blob storage.');
                            (0, blob_utils_1.copyResultsToAzureBlob)(jmeterReportFolder, jmeterLogFolder);
                        }
                    }
                    catch (e) {
                        (0, utility_1.logInformation)('Error Publishing report to blob storage: ' + (e === null || e === void 0 ? void 0 : e.message));
                        tl.error(e);
                        (0, utility_1.logInformation)(constant_1.ERROR_DEFAULT_MSG);
                    }
                    ReportABSPath = Path.join(JMETER_ABS_BIN_Folder, jmeterReportFolder);
                    LogABSPath = Path.join(JMETER_ABS_BIN_Folder, jmeterReportFolder);
                    publishResultsToBuildArtifact = tl.getBoolInput(constant_1.InputVariables.PUBLISH_RESULTS_TO_BUILD_ARTIFACT, true);
                    if (!publishResultsToBuildArtifact) return [3 /*break*/, 8];
                    artifactReport = tl.getInput(constant_1.InputVariables.ARTIFACT_NAME_REPORT, true);
                    artifactLOG = tl.getInput(constant_1.InputVariables.ARTIFACT_NAME_LOG, true);
                    (0, utility_1.logInformation)('Publishing data to build artifacts: Log ');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, azure_task_lib_utility_1.publishData)(LogABSPath, artifactLOG)];
                case 2:
                    _a.sent();
                    (0, utility_1.logInformation)('Completed: Publishing data to build artifacts: Log ');
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    tl.error(e_1);
                    (0, utility_1.logInformation)('Error Publishing log: ' + (e_1 === null || e_1 === void 0 ? void 0 : e_1.message));
                    (0, utility_1.logInformation)('Artifacts {LOG} are present at location: ' + LogABSPath);
                    (0, utility_1.logInformation)(constant_1.ERROR_DEFAULT_MSG);
                    return [3 /*break*/, 4];
                case 4:
                    (0, utility_1.logInformation)('Publishing data to build artifacts: Report ');
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, azure_task_lib_utility_1.publishData)(ReportABSPath, artifactReport)];
                case 6:
                    _a.sent();
                    (0, utility_1.logInformation)('Completed: Publishing data to build artifacts: Report ');
                    return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    tl.error(e_2);
                    (0, utility_1.logInformation)('Error Publishing report: ' + (e_2 === null || e_2 === void 0 ? void 0 : e_2.message));
                    (0, utility_1.logInformation)('Artifacts {Report} are present at location: ' + ReportABSPath);
                    (0, utility_1.logInformation)(constant_1.ERROR_DEFAULT_MSG);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var JMETER_URL, JMETER_FILE_Folder, JMETER_BIN_Folder, JMETER_ABS_BIN_Folder_1, jmeterJMXFileName, jmxPropertySource, jmxInputFilesSource, jmeterPropertyFileName, jmeterInputFileNames, jmeterLogFolder_1, jmeterReportFolder_1, command, CurrentLogJTLFile, CurrentLogLogFile, child, _a, stdout, stderr, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 15, , 16]);
                    JMETER_URL = tl.getInput(constant_1.InputVariables.JMX_BINARY_URI, true);
                    JMETER_FILE_Folder = tl.getInput(constant_1.InputVariables.JMETER_FOLDER_NAME, true);
                    JMETER_BIN_Folder = Path.join(JMETER_FILE_Folder, constant_1.JMETER_BIN_Folder_NAME);
                    JMETER_ABS_BIN_Folder_1 = Path.join(process.cwd(), JMETER_FILE_Folder, constant_1.JMETER_BIN_Folder_NAME);
                    (0, utility_1.logInformation)('Current Working directory: ' + process.cwd());
                    (0, utility_1.logInformation)('JMETER_URL ' + JMETER_URL);
                    (0, utility_1.logInformation)('JMETER_FILE_Folder ' + JMETER_FILE_Folder);
                    (0, utility_1.logInformation)('JMETER_BIN_Folder ' + JMETER_BIN_Folder);
                    (0, utility_1.logInformation)('JMETER_ABS_BIN_Folder ' + JMETER_ABS_BIN_Folder_1);
                    (0, utility_1.logInformation)('Current Working directory: ' + process.cwd());
                    (0, utility_1.logInformation)('Start Downloading JMeter Binary');
                    return [4 /*yield*/, (0, utility_1.downloadFile)(JMETER_URL, constant_1.JMETER_FILE_NAME)];
                case 1:
                    _b.sent();
                    (0, utility_1.logInformation)('Completed Downloading JMeter Binary');
                    (0, utility_1.logInformation)('Start Unzipping JMeter Binary');
                    return [4 /*yield*/, (0, utility_1.unzipBinary)(constant_1.JMETER_FILE_NAME)];
                case 2:
                    _b.sent();
                    (0, utility_1.logInformation)('Completed Unzipping JMeter Binary');
                    return [4 /*yield*/, process.chdir(JMETER_ABS_BIN_Folder_1)];
                case 3:
                    _b.sent();
                    (0, utility_1.logInformation)('Change Directory to JMeter Bin Path ' + JMETER_ABS_BIN_Folder_1 + ' completed. Current Working Directory: ' + process.cwd());
                    (0, utility_1.logInformation)('Start handleJMeterJMXFile. Current Working directory' + process.cwd());
                    return [4 /*yield*/, (0, jmeter_utils_1.handleJMeterJMXFile)(JMETER_ABS_BIN_Folder_1)];
                case 4:
                    jmeterJMXFileName = _b.sent();
                    (0, utility_1.logInformation)('Completed handleJMeterJMXFile JMXFileName: ' + jmeterJMXFileName);
                    jmxPropertySource = tl.getInput(constant_1.InputVariables.JMX_PROPERTY_FILE_SOURCE, true);
                    jmxInputFilesSource = tl.getInput(constant_1.InputVariables.JMX_INPUT_FILE_SOURCE, true);
                    jmeterPropertyFileName = null;
                    if (!(jmxPropertySource == constant_1.InputVariableType.None)) return [3 /*break*/, 5];
                    (0, utility_1.logInformation)('No Property File Configuration Enabled. Skipping Property Configuration Step.');
                    return [3 /*break*/, 7];
                case 5:
                    (0, utility_1.logInformation)('Start Handle Property Files. Current Working directory: ' + process.cwd());
                    return [4 /*yield*/, (0, jmeter_utils_1.handleJMeterPropertyFile)(JMETER_ABS_BIN_Folder_1)];
                case 6:
                    jmeterPropertyFileName = _b.sent();
                    if ((0, utility_1.isEmpty)(jmeterPropertyFileName)) {
                        (0, utility_1.logInformation)('No Property Input Files Found to Use In Pipeline');
                        tl.setResult(tl.TaskResult.Failed, 'No Property Input Files Found to Use In Pipeline');
                        return [2 /*return*/];
                    }
                    (0, utility_1.logInformation)('Completed Handle Property Files jmeterPropertyFileName: ' + jmeterPropertyFileName);
                    _b.label = 7;
                case 7:
                    if (!(jmxInputFilesSource == constant_1.InputVariableType.None)) return [3 /*break*/, 8];
                    (0, utility_1.logInformation)('No Input File Configuration Enabled. Skipping Input File Configuration Step.');
                    return [3 /*break*/, 10];
                case 8:
                    (0, utility_1.logInformation)('Start Handle Input Files. Current Working directory: ' + process.cwd());
                    return [4 /*yield*/, (0, jmeter_utils_1.handleJMeterInputFile)(JMETER_ABS_BIN_Folder_1)];
                case 9:
                    jmeterInputFileNames = _b.sent();
                    (0, utility_1.logInformation)('Completed Handle Input Files. FileCount: ' + ((null != jmeterInputFileNames) ? jmeterInputFileNames === null || jmeterInputFileNames === void 0 ? void 0 : jmeterInputFileNames.length : 0));
                    _b.label = 10;
                case 10:
                    jmeterLogFolder_1 = tl.getInput(constant_1.InputVariables.JMETER_LOG_FOLDER, true);
                    jmeterReportFolder_1 = tl.getInput(constant_1.InputVariables.JMETER_REPORT_FOLDER, true);
                    if ((0, utility_1.isEmpty)(jmeterLogFolder_1)) {
                        jmeterLogFolder_1 = constant_1.DEFAULT_JMETER_LOG_DIR_NAME;
                        (0, utility_1.logInformation)('Missing JMeter Log Folder Name. Using ' + constant_1.DEFAULT_JMETER_LOG_DIR_NAME + ' as default name.');
                    }
                    if ((0, utility_1.isEmpty)(jmeterReportFolder_1)) {
                        jmeterReportFolder_1 = constant_1.DEFAULT_JMETER_REPORT_DIR_NAME;
                        (0, utility_1.logInformation)('Missing JMeter Report Folder Name. Using ' + constant_1.DEFAULT_JMETER_REPORT_DIR_NAME + ' as default name.');
                    }
                    command = '';
                    CurrentLogJTLFile = Path.join(jmeterLogFolder_1, constant_1.LOG_JTL_FILE_NAME);
                    CurrentLogLogFile = Path.join(jmeterLogFolder_1, constant_1.JMETER_LOG_FILE_NAME);
                    if (!(jmxPropertySource == 'none')) return [3 /*break*/, 11];
                    command = 'jmeter -n -t ' + jmeterJMXFileName + '  -l ' + CurrentLogJTLFile + ' -j ' + CurrentLogLogFile + ' -f -e -o ' + jmeterReportFolder_1;
                    (0, utility_1.logInformation)('Running JMeter Without Property File: ' + command);
                    return [3 /*break*/, 13];
                case 11:
                    (0, utility_1.logInformation)('Running Replace Tokens for file ' + jmeterPropertyFileName + ' Current Working directory: ' + process.cwd());
                    return [4 /*yield*/, (0, replaceToken_1.replaceTokens)(jmeterPropertyFileName)];
                case 12:
                    _b.sent();
                    (0, utility_1.logInformation)('Completed Replace Tokens');
                    command = '.\\jmeter -q ' + jmeterPropertyFileName + ' -n -t ' + jmeterJMXFileName + '  -l ' + CurrentLogJTLFile + ' -j ' + CurrentLogLogFile + ' -f -e -o ' + jmeterReportFolder_1;
                    (0, utility_1.logInformation)('Running JMeter with property file ' + command);
                    _b.label = 13;
                case 13:
                    child = exec(command);
                    (0, jmeter_utils_1.promiseFromChildProcess)(child).then(function (result) {
                        (0, utility_1.logInformation)('promise complete: ' + result);
                        PostResults(jmeterReportFolder_1, jmeterLogFolder_1, JMETER_ABS_BIN_Folder_1);
                        (0, utility_1.logInformation)('Task Completed.');
                    }, function (err) {
                        tl.error(err);
                        (0, utility_1.logInformation)('promise rejected: ' + err);
                    });
                    child.stdout.on('data', function (data) {
                        (0, utility_1.logInformation)(data, false);
                    });
                    child.stderr.on('data', function (data) {
                        (0, utility_1.logInformation)('stderr: ' + data, false);
                    });
                    child.on('close', function (code) {
                        (0, utility_1.logInformation)('closing code: ' + code);
                    });
                    return [4 /*yield*/, child];
                case 14:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    return [3 /*break*/, 16];
                case 15:
                    err_1 = _b.sent();
                    tl.error(err_1);
                    (0, utility_1.logInformation)(err_1);
                    (0, utility_1.logInformation)(constant_1.ERROR_DEFAULT_MSG);
                    tl.setResult(tl.TaskResult.Failed, err_1 === null || err_1 === void 0 ? void 0 : err_1.message);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
main();
