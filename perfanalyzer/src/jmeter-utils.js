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
exports.analyzeJTL = exports.promiseFromChildProcess = exports.handleJMeterInputFile = exports.handleJMeterPropertyFile = exports.handleJMeterJMXFile = void 0;
var utility_1 = require("./utility");
var constant_1 = require("./constant");
var csv = require('csv-parser');
var fs = require('fs');
var tl = require('azure-pipelines-task-lib/task');
var Path = require('path');
function handleJMeterJMXFile(JMETER_BIN_Folder) {
    return __awaiter(this, void 0, void 0, function () {
        var jmxSourceInput, jmxSourceRunFilePath, fileName, destinationFilePath, jmxSourceRunFileURL, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jmxSourceInput = tl.getInput(constant_1.InputVariables.JMX_SOURCE, true);
                    if (!(jmxSourceInput == constant_1.InputVariableType.SourceCode)) return [3 /*break*/, 2];
                    jmxSourceRunFilePath = tl.getInput(constant_1.InputVariables.JMX_SOURCE_RUN_FILE_SOURCE_PATH, true);
                    if ((0, utility_1.isEmpty)(jmxSourceRunFilePath)) {
                        tl.setResult(tl.TaskResult.Failed, "Missing Source File Path");
                        return [2 /*return*/, null];
                    }
                    fileName = Path.parse(jmxSourceRunFilePath).base;
                    destinationFilePath = Path.join(JMETER_BIN_Folder, fileName);
                    (0, utility_1.logInformation)('Copying JMX Source File from Source: ' + jmxSourceRunFilePath + " to destination: " + destinationFilePath);
                    return [4 /*yield*/, (0, utility_1.copyFileToDirectory)(jmxSourceRunFilePath, destinationFilePath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, fileName];
                case 2:
                    jmxSourceRunFileURL = tl.getInput(constant_1.InputVariables.JMX_SOURCE_RUN_FILE_URL, true);
                    if ((0, utility_1.isEmpty)(jmxSourceRunFileURL)) {
                        tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX From External URL");
                        return [2 /*return*/, null];
                    }
                    jmxSourceRunFileURL = jmxSourceRunFileURL.trim();
                    fileName = Path.parse(jmxSourceRunFileURL).base;
                    (0, utility_1.logInformation)('Downloading File from source ' + jmxSourceRunFileURL + ' to destination' + fileName + ' at location preloaded: ' + JMETER_BIN_Folder);
                    return [4 /*yield*/, (0, utility_1.downloadFile)(jmxSourceRunFileURL, fileName)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, fileName];
            }
        });
    });
}
exports.handleJMeterJMXFile = handleJMeterJMXFile;
function handleJMeterPropertyFile(JMETER_BIN_Folder) {
    return __awaiter(this, void 0, void 0, function () {
        var jmxPropertySource, jmxPropertyFilePath, fileName, destinationFilePath, jmxPropertyFileURL, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jmxPropertySource = tl.getInput(constant_1.InputVariables.JMX_PROPERTY_FILE_SOURCE, true);
                    if (!(jmxPropertySource == constant_1.InputVariableType.None)) return [3 /*break*/, 1];
                    (0, utility_1.logInformation)("No Property File Input");
                    return [2 /*return*/, null];
                case 1:
                    if (!(jmxPropertySource == constant_1.InputVariableType.SourceCode)) return [3 /*break*/, 3];
                    jmxPropertyFilePath = tl.getInput(constant_1.InputVariables.JMX_PROPERTY_FILE_SOURCE_PATH, true);
                    if ((0, utility_1.isEmpty)(jmxPropertyFilePath)) {
                        tl.setResult(tl.TaskResult.Failed, "Missing Property File Path");
                        return [2 /*return*/, null];
                    }
                    fileName = Path.parse(jmxPropertyFilePath).base;
                    destinationFilePath = Path.join(JMETER_BIN_Folder, fileName);
                    (0, utility_1.logInformation)('Copying JMX Property File from Source: ' + jmxPropertyFilePath + " to destination: " + destinationFilePath);
                    return [4 /*yield*/, (0, utility_1.copyFileToDirectory)(jmxPropertyFilePath, destinationFilePath)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, fileName];
                case 3:
                    jmxPropertyFileURL = tl.getInput(constant_1.InputVariables.JMX_PROPERTY_FILE_URL, true);
                    if ((0, utility_1.isEmpty)(jmxPropertyFileURL)) {
                        tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX Property File From External URL");
                        return [2 /*return*/];
                    }
                    jmxPropertyFileURL = jmxPropertyFileURL.trim();
                    fileName = Path.parse(jmxPropertyFileURL).base;
                    (0, utility_1.logInformation)('Downloading File from source ' + jmxPropertyFileURL + ' to destination' + fileName + ' at location preloaded: ' + JMETER_BIN_Folder);
                    return [4 /*yield*/, (0, utility_1.downloadFile)(jmxPropertyFileURL, fileName)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, fileName];
            }
        });
    });
}
exports.handleJMeterPropertyFile = handleJMeterPropertyFile;
function handleJMeterInputFile(JMETER_BIN_Folder) {
    return __awaiter(this, void 0, void 0, function () {
        var jmxInputFilesSource, jmxInputFolderSourcePath, jmxInputFolderSourceUrls, fileNames, count, _i, jmxInputFolderSourceUrls_1, file, fileName, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jmxInputFilesSource = tl.getInput(constant_1.InputVariables.JMX_INPUT_FILE_SOURCE, true);
                    if (!(jmxInputFilesSource == constant_1.InputVariableType.None)) return [3 /*break*/, 1];
                    (0, utility_1.logInformation)('Not downloading files');
                    return [2 /*return*/, null];
                case 1:
                    if (!(jmxInputFilesSource == constant_1.InputVariableType.SourceCode)) return [3 /*break*/, 2];
                    jmxInputFolderSourcePath = tl.getInput(constant_1.InputVariables.JMX_INPUT_FOLDER_SOURCE_PATH, true);
                    if (!jmxInputFolderSourcePath || jmxInputFolderSourcePath.length == 0) {
                        tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX Input File From Source");
                        return [2 /*return*/, null];
                    }
                    (0, utility_1.logInformation)('Downloading Input File(s) from source ' + jmxInputFolderSourcePath + ' to destination' + JMETER_BIN_Folder);
                    return [2 /*return*/, (0, utility_1.copyDirectoryRecursiveSync)(jmxInputFolderSourcePath, JMETER_BIN_Folder, false)];
                case 2:
                    jmxInputFolderSourceUrls = tl.getDelimitedInput(constant_1.InputVariables.JMX_INPUT_FILES_URL, ',', true);
                    if ((0, utility_1.isEmpty)(jmxInputFolderSourceUrls)) {
                        tl.setResult(tl.TaskResult.Failed, "Missing User Input External URLs");
                        return [2 /*return*/, null];
                    }
                    fileNames = [];
                    count = 0;
                    _i = 0, jmxInputFolderSourceUrls_1 = jmxInputFolderSourceUrls;
                    _a.label = 3;
                case 3:
                    if (!(_i < jmxInputFolderSourceUrls_1.length)) return [3 /*break*/, 8];
                    file = jmxInputFolderSourceUrls_1[_i];
                    if ((0, utility_1.isEmpty)(file)) {
                        (0, utility_1.logInformation)('Skipping File');
                        return [3 /*break*/, 7];
                    }
                    count++;
                    file = file.trim();
                    fileName = Path.parse(file).base;
                    (0, utility_1.logInformation)('Downloading (' + count + '/' + jmxInputFolderSourceUrls.length + '). File from source ' + file + ' to destination' + fileName + ' to preloaded location: ' + JMETER_BIN_Folder);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, utility_1.downloadFile)(file, fileName)];
                case 5:
                    _a.sent();
                    fileNames.push(fileName);
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    (0, utility_1.logInformation)('Could not download File: ' + file);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: return [2 /*return*/, fileNames];
            }
        });
    });
}
exports.handleJMeterInputFile = handleJMeterInputFile;
function promiseFromChildProcess(child) {
    return new Promise(function (resolve, reject) {
        child.addListener("error", reject);
        child.addListener("exit", resolve);
    });
}
exports.promiseFromChildProcess = promiseFromChildProcess;
function analyzeJTL(fileNameAndPath, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.createReadStream(fileNameAndPath)
                        .pipe(csv())
                        .on('data', function (row) {
                        res.count++;
                        if ((row === null || row === void 0 ? void 0 : row.success) == 'true') {
                            res.successCount++;
                        }
                        else {
                            res.failureCount++;
                        }
                    })
                        .on('end', function () {
                        console.log('Data loaded');
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.analyzeJTL = analyzeJTL;
