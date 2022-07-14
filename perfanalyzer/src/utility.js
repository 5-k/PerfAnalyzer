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
exports.isNonEmpty = exports.isEmpty = exports.copyDirectoryRecursiveSync = exports.copyFileToDirectory = exports.unzipBinary = exports.downloadFile = exports.logInformation = void 0;
var moment = require("moment");
var constant_1 = require("./constant");
var tl = require('azure-pipelines-task-lib/task');
var fs = require('fs');
var https = require('https');
var Path = require('path');
var tar = require('tar');
function logInformation(data, printDate) {
    if (printDate === void 0) { printDate = true; }
    if (printDate) {
        var formattedDate = (moment(Date.now())).format(constant_1.DATE_FORMAT);
        console.log(formattedDate + ":  " + data);
        tl.debug(formattedDate + ":  " + data);
    }
    else {
        console.log(data);
        tl.debug(data);
    }
}
exports.logInformation = logInformation;
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
exports.downloadFile = downloadFile;
function unzipBinary(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tar.x({ file: fileName })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.unzipBinary = unzipBinary;
function copyFileToDirectory(sourcefilePath, destinationFilePath) {
    logInformation('Start Copying File to destination ' + destinationFilePath + ' from source ' + sourcefilePath);
    fs.copyFileSync(sourcefilePath, destinationFilePath, function (err) {
        if (err)
            throw err;
        logInformation('Completed ' + sourcefilePath + ' was copied to ' + destinationFilePath);
    });
}
exports.copyFileToDirectory = copyFileToDirectory;
function copyDirectoryRecursiveSync(source, target, move) {
    if (!fs.lstatSync(source).isDirectory())
        return [];
    var files = [];
    var operation = move ? fs.renameSync : fs.copyFileSync;
    fs.readdirSync(source).forEach(function (itemName) {
        var sourcePath = Path.join(source, itemName);
        var targetPath = Path.join(target, itemName);
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectoryRecursiveSync(sourcePath, target, false);
        }
        else {
            operation(sourcePath, targetPath);
            files.push(sourcePath);
        }
    });
    return files;
}
exports.copyDirectoryRecursiveSync = copyDirectoryRecursiveSync;
function isEmpty(str) {
    return (!str || str.length == 0);
}
exports.isEmpty = isEmpty;
function isNonEmpty(str) {
    return !isEmpty(str);
}
exports.isNonEmpty = isNonEmpty;
