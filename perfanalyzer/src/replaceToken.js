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
var utility_1 = require("./utility");
var constant_1 = require("./constant");
var tl = require('azure-pipelines-task-lib/task');
var fs = require('fs');
var sh = require('shelljs');
function replaceTokens(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var errCount, sourcePath, warningsAsErrors, tokenRegex, warning, files, i, file, contents, reg, match, newContents, vName, vIsArray, vValue, msg;
        return __generator(this, function (_a) {
            errCount = 0;
            try {
                (0, utility_1.logInformation)("Starting Replace Tokens task for file: " + fileName);
                sourcePath = fileName;
                if (!sourcePath || sourcePath.length === 0) {
                    tl.setResult(tl.TaskResult.Failed, "No File Found to replace token");
                    return [2 /*return*/];
                }
                // clear leading and trailing quotes for paths with spaces
                sourcePath = sourcePath.replace(/"/g, "");
                // remove trailing slash
                if (sourcePath.endsWith("\\") || sourcePath.endsWith("/")) {
                    (0, utility_1.logInformation)("Trimming separator off sourcePath");
                    sourcePath = sourcePath.substr(0, sourcePath.length - 1);
                }
                tl.checkPath(sourcePath, "sourcePath");
                warningsAsErrors = true;
                tokenRegex = tl.getInput(constant_1.InputVariables.TOKEN_REGEX, true);
                warning = warningsAsErrors ?
                    function (message) { tl.error(message); errCount++; } :
                    function (message) { return tl.warning(message); };
                (0, utility_1.logInformation)("sourcePath: [".concat(sourcePath, "]"));
                (0, utility_1.logInformation)("tokenRegex: [".concat(tokenRegex, "]"));
                if (!tokenRegex || tokenRegex.length === 0) {
                    tokenRegex = "__(\\w+)__";
                }
                files = [sourcePath];
                for (i = 0; i < files.length; i++) {
                    file = files[i];
                    (0, utility_1.logInformation)("Starting regex replacement in [".concat(file, "]"));
                    contents = fs.readFileSync(file).toString();
                    reg = new RegExp(tokenRegex, "g");
                    newContents = contents;
                    while ((match = reg.exec(contents)) !== null) {
                        vName = match[1];
                        vIsArray = vName.endsWith("[]");
                        if (vIsArray) {
                            vName = vName.substring(0, vName.length - 2);
                            (0, utility_1.logInformation)("Detected that ".concat(vName, " is an array token"));
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
                            (0, utility_1.logInformation)("Replaced token [".concat(vName, "]"));
                        }
                    }
                    (0, utility_1.logInformation)("Writing new values to file");
                    sh.chmod(666, file);
                    fs.writeFileSync(file, newContents);
                }
            }
            catch (err) {
                tl.error(err);
                (0, utility_1.logInformation)(constant_1.ERROR_DEFAULT_MSG);
                msg = err;
                if (err.message) {
                    msg = err.message;
                }
                tl.setResult(tl.TaskResult.Failed, msg);
            }
            if (errCount > 0) {
                tl.setResult(tl.TaskResult.Failed, "Errors were encountered - please check logs for details.");
            }
            (0, utility_1.logInformation)("Leaving Replace Tokens task");
            return [2 /*return*/];
        });
    });
}
exports.replaceTokens = replaceTokens;
