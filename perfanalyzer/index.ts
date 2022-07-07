import sh from 'shelljs'; 
const tl = require('azure-pipelines-task-lib/task'); 
const https = require('https');
const fs = require('fs');
var tar = require('tar');
const Path = require('path'); 
const sh = require('shelljs'); 
const util = require('util');
var exec = require('child_process').exec;
import * as moment from 'moment';

const JMETER_FILE_NAME='apache-jmeter.tgz'
const JMETER_BIN_Folder_NAME= 'bin'  
const armStorage = require('azure-pipelines-tasks-azure-arm-rest-v2/azure-arm-storage');  
import { AzureRMEndpoint } from 'azure-pipelines-tasks-azure-arm-rest-v2/azure-arm-endpoint';
import { AzureEndpoint, StorageAccount } from 'azure-pipelines-tasks-azure-arm-rest-v2/azureModels';
import { BlobServiceClient, StorageSharedKeyCredential, BlockBlobParallelUploadOptions, BlobHTTPHeaders } from "@azure/storage-blob";
const DATE_FORMAT = 'DD-MMM-YYYY HH:mm:ss:SSS ZZ';

const DEFAULT_JMETER_REPORT_DIR_NAME = "CurrentReport";
const DEFAULT_JMETER_LOG_DIR_NAME = "CurrentLog";
const AZURE_STORAGE_ACCOUNT_URI = 'https://${storageAccountName}.blob.core.windows.net';
const AZURE_STORAGE_ACCOUNT_NAME_PLACEHOLDER = '${storageAccountName}';
const LOG_JTL_FILE_NAME = 'log.jtl';
const JMETER_LOG_FILE_NAME = 'jmeter.log'; 
const JMETER_REPORT_INDEX_FILE_NAME = 'index.html';
const URL_SEPERATOR = '/';
enum InputVariables {
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
    TOKEN_REGEX = 'tokenRegex',
    CONNECTED_SERVICE_ARM_NAME = 'ConnectedServiceNameARM',
    STORAGE_ACCOUNT_RM = 'StorageAccountRM',
    CONTAINER_NAME ='ContainerName',
    BLOB_PREFIX = 'BlobPrefix',
    OUTPUT_STORAGE_URI = 'outputStorageUri'
}
enum InputVariableType {
    SourceCode = 'sourceCode',
    Url = 'url',
    Urls = 'urls',
    None = 'none'
}
async function downloadFile(fileSource: string, destinationFilePath: string) {
    logInformation('Downloading File: ' + fileSource + ' to location: ' + destinationFilePath );
    return new Promise<void>((resolve, reject) => {
        https.get(fileSource, (response: { on: (arg0: string, arg1: (reason?: any) => void) => void; pipe: (arg0: any) => void; }) => {            
            let stream = fs.createWriteStream(destinationFilePath);
            response.on("error", reject);

            stream.on("finish", () => {
                stream.close();
                logInformation("Download " + fileSource + " Completed to :" + destinationFilePath);
                resolve();
            }).on("error", reject);

            response.pipe(stream);

        }).on("error", reject);
    });
}

async function unzipJMeterBinary() {    
    await tar.x({file: JMETER_FILE_NAME});
}

function copyFileToDirectory(sourcefilePath: string, destinationFilePath: string) {   
    logInformation('Start Copying File to destination ' + destinationFilePath + ' from source ' + sourcefilePath)
    fs.copyFileSync(sourcefilePath, destinationFilePath, (err: any) => {
        if (err) throw err;
        logInformation('Completed '+ sourcefilePath + ' was copied to ' + destinationFilePath);
      });   
}

function copyDirectoryRecursiveSync(source, target, move): string[] {
    if (!fs.lstatSync(source).isDirectory())
        return [];
    let files: string[] = []
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


async function handleJMeterJMXFile(JMETER_BIN_Folder: string): Promise<string|undefined|null>{
    
    let jmxSourceInput = tl.getInput(InputVariables.JMX_SOURCE,true);
    if(jmxSourceInput==InputVariableType.SourceCode) {
        let jmxSourceRunFilePath = tl.getInput(InputVariables.JMX_SOURCE_RUN_FILE_SOURCE_PATH,true); 
        if(isEmpty(jmxSourceRunFilePath)) {
            tl.setResult(tl.TaskResult.Failed, "Missing Source File Path");
            return null;
        }
        let fileName=Path.parse(jmxSourceRunFilePath).base;
        let destinationFilePath = Path.join(JMETER_BIN_Folder,fileName);
        logInformation('Copying JMX Source File from Source: ' + jmxSourceRunFilePath + " to destination: " + destinationFilePath);
        await copyFileToDirectory(jmxSourceRunFilePath,destinationFilePath);
        return fileName;
    } else {
        let jmxSourceRunFileURL = tl.getInput(InputVariables.JMX_SOURCE_RUN_FILE_URL,true);  
        if(isEmpty(jmxSourceRunFileURL)) {
            tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX From External URL");
            return null;
        }
        jmxSourceRunFileURL= jmxSourceRunFileURL.trim();
        let fileName=Path.parse(jmxSourceRunFileURL).base 
        logInformation('Downloading File from source ' + jmxSourceRunFileURL +  ' to destination' + fileName + ' at location preloaded: ' + JMETER_BIN_Folder);
        await downloadFile(jmxSourceRunFileURL, fileName);
        return fileName;
    }
}
async function handleJMeterPropertyFile(JMETER_BIN_Folder: string): Promise<string|undefined|null>{
    
    let jmxPropertySource = tl.getInput(InputVariables.JMX_PROPERTY_FILE_SOURCE,true);  
    if(jmxPropertySource == InputVariableType.None) {
        logInformation("No Property File Input");
        return null;
    } else if(jmxPropertySource== InputVariableType.SourceCode) {
        let jmxPropertyFilePath = tl.getInput(InputVariables.JMX_PROPERTY_FILE_SOURCE_PATH,true); 
        if(isEmpty(jmxPropertyFilePath)) {
            tl.setResult(tl.TaskResult.Failed, "Missing Property File Path");
            return null;
        }
        let fileName=Path.parse(jmxPropertyFilePath).base;
        let destinationFilePath = Path.join(JMETER_BIN_Folder,fileName);
        logInformation('Copying JMX Property File from Source: ' + jmxPropertyFilePath + " to destination: " + destinationFilePath);
        await copyFileToDirectory(jmxPropertyFilePath,destinationFilePath);
        return fileName;
    } else {
       let jmxPropertyFileURL = tl.getInput(InputVariables.JMX_PROPERTY_FILE_URL,true); 
         
       if(isEmpty(jmxPropertyFileURL)) {
            tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX Property File From External URL");
            return;
        }
        jmxPropertyFileURL= jmxPropertyFileURL.trim();
        let fileName=Path.parse(jmxPropertyFileURL).base
        logInformation('Downloading File from source ' + jmxPropertyFileURL +  ' to destination' + fileName + ' at location preloaded: ' + JMETER_BIN_Folder);
        await downloadFile(jmxPropertyFileURL, fileName);
        return fileName; 
    }
}   

async function handleJMeterInputFile(JMETER_BIN_Folder: string): Promise<string[]|null>{
    let jmxInputFilesSource = tl.getInput(InputVariables.JMX_INPUT_FILE_SOURCE,true);
    
    if(jmxInputFilesSource==InputVariableType.None) {
       logInformation('Not downloading files');
       return null;
    } else if(jmxInputFilesSource==InputVariableType.SourceCode) {
        let jmxInputFolderSourcePath = tl.getInput(InputVariables.JMX_INPUT_FOLDER_SOURCE_PATH,true); 
        if(! jmxInputFolderSourcePath || jmxInputFolderSourcePath.length == 0) {
           tl.setResult(tl.TaskResult.Failed, "Unable to find and download JMX Input File From Source");
           return null;
       }
        logInformation('Downloading Input File(s) from source ' + jmxInputFolderSourcePath +  ' to destination' + JMETER_BIN_Folder);        
        return copyDirectoryRecursiveSync(jmxInputFolderSourcePath, JMETER_BIN_Folder, false);             
    } else {
        let jmxInputFolderSourceUrls= tl.getDelimitedInput(InputVariables.JMX_INPUT_FILES_URL,',',true);
        if(isEmpty(jmxInputFolderSourceUrls)) {
            tl.setResult(tl.TaskResult.Failed, "Missing User Input External URLs");
            return null;
        }
        let fileNames: string[] = [];
        let count = 0;
        
        for(let file of jmxInputFolderSourceUrls) {
           if(isEmpty(file)) {
               logInformation('Skipping File');
               continue;
           }
           count++;
           file= file.trim();
           let fileName = Path.parse(file).base;
           logInformation('Downloading (' + count + '/' + jmxInputFolderSourceUrls.length + '). File from source ' + file + ' to destination' + fileName + ' to preloaded location: ' + JMETER_BIN_Folder );
           try {
            await downloadFile(file, fileName);            
            fileNames.push(fileName);
           } catch(e) {
            logInformation('Could not download File: ' + file)
           }
           
        }
        return fileNames;
    }
}

function promiseFromChildProcess(child) {
    return new Promise(function (resolve, reject) {
        child.addListener("error", reject);
        child.addListener("exit", resolve);
    });
}

async function main() {
    try {
        let JMETER_URL = tl.getInput(InputVariables.JMX_BINARY_URI,true);
        let JMETER_FILE_Folder = tl.getInput(InputVariables.JMETER_FOLDER_NAME,true);
        let JMETER_BIN_Folder = Path.join(JMETER_FILE_Folder, JMETER_BIN_Folder_NAME);
        let JMETER_ABS_BIN_Folder = Path.join( process.cwd(),JMETER_FILE_Folder, JMETER_BIN_Folder_NAME);
        
        
        logInformation('Current Working directory: ' +  process.cwd());
        logInformation('JMETER_URL ' + JMETER_URL);
        logInformation('JMETER_FILE_Folder ' + JMETER_FILE_Folder);
        logInformation('JMETER_BIN_Folder ' + JMETER_BIN_Folder);
        logInformation('JMETER_ABS_BIN_Folder ' + JMETER_ABS_BIN_Folder);
        logInformation('Current Working directory: ' +  process.cwd());

        logInformation('Start Downloading JMeter Binary')
        await downloadFile(JMETER_URL, JMETER_FILE_NAME);
        logInformation('Completed Downloading JMeter Binary')

        logInformation('Start Unzipping JMeter Binary')
        await unzipJMeterBinary();
        logInformation('Completed Unzipping JMeter Binary')

        await process.chdir(JMETER_ABS_BIN_Folder);
        logInformation('Change Directory to JMeter Bin Path ' + JMETER_ABS_BIN_Folder + ' completed. Current Working Directory: ' + process.cwd());

        logInformation('Start handleJMeterJMXFile. Current Working directory' + process.cwd());
        let jmeterJMXFileName:string|null|undefined = await handleJMeterJMXFile(JMETER_ABS_BIN_Folder);
        logInformation('Completed handleJMeterJMXFile JMXFileName: '+ jmeterJMXFileName);        

        let jmxPropertySource = tl.getInput(InputVariables.JMX_PROPERTY_FILE_SOURCE,true);
        let jmxInputFilesSource = tl.getInput(InputVariables.JMX_INPUT_FILE_SOURCE,true);
        let jmeterPropertyFileName:string|null|undefined = null;

        if(jmxPropertySource == InputVariableType.None) {
            logInformation('No Property File Configuration Enabled. Skipping Property Configuration Step.')
        } else {
            logInformation('Start Handle Property Files. Current Working directory: ' + process.cwd());
            jmeterPropertyFileName = await handleJMeterPropertyFile(JMETER_ABS_BIN_Folder);
            if(isEmpty(jmeterPropertyFileName))  {
                logInformation('No Property Input Files Found to Use In Pipeline');
                tl.setResult(tl.TaskResult.Failed, 'No Property Input Files Found to Use In Pipeline');
                return;
            }
            logInformation('Completed Handle Property Files jmeterPropertyFileName: '+ jmeterPropertyFileName)
        }
         
        if(jmxInputFilesSource == InputVariableType.None) {
            logInformation('No Input File Configuration Enabled. Skipping Input File Configuration Step.')
        } else {
            logInformation('Start Handle Input Files. Current Working directory: ' + process.cwd());
            let jmeterInputFileNames:string[]|null = await handleJMeterInputFile(JMETER_ABS_BIN_Folder);
            logInformation('Completed Handle Input Files. FileCount: ' + ((null != jmeterInputFileNames) ? jmeterInputFileNames?.length : 0));
            
        }


        let jmeterLogFolder = tl.getInput(InputVariables.JMETER_LOG_FOLDER,true);
        let jmeterReportFolder = tl.getInput(InputVariables.JMETER_REPORT_FOLDER,true);

        if(isEmpty(jmeterLogFolder)) {
            jmeterLogFolder = DEFAULT_JMETER_LOG_DIR_NAME;
            logInformation('Missing JMeter Log Folder Name. Using ' + DEFAULT_JMETER_LOG_DIR_NAME + ' as default name.');
        }
        
        if(isEmpty(jmeterReportFolder)) {
            jmeterReportFolder = DEFAULT_JMETER_REPORT_DIR_NAME;
            logInformation('Missing JMeter Report Folder Name. Using ' + DEFAULT_JMETER_REPORT_DIR_NAME + ' as default name.');
        }

        let command = '';
        let CurrentLogJTLFile =  Path.join(jmeterLogFolder, LOG_JTL_FILE_NAME);
        let CurrentLogLogFile =  Path.join(jmeterLogFolder, JMETER_LOG_FILE_NAME);

        if(jmxPropertySource=='none') {     
            command = 'jmeter -n -t '+ jmeterJMXFileName + '  -l ' + CurrentLogJTLFile + ' -j '+ CurrentLogLogFile + ' -f -e -o ' + jmeterReportFolder; 
            logInformation('Running JMeter Without Property File: ' + command); 
        } else {
            logInformation('Running Replace Tokens for file ' + jmeterPropertyFileName + ' Current Working directory: ' + process.cwd());
            await replaceTokens(jmeterPropertyFileName)
            logInformation('Completed Replace Tokens');

            command = '.\\jmeter -q ' + jmeterPropertyFileName + ' -n -t ' + jmeterJMXFileName + '  -l ' + CurrentLogJTLFile + ' -j '+ CurrentLogLogFile + ' -f -e -o ' + jmeterReportFolder;
            logInformation('Running JMeter with property file ' + command); 
        }

        var child = exec(command);
        promiseFromChildProcess(child).then(function (result) {
            logInformation('promise complete: ' + result);
            let copyToBlob = tl.getBoolInput(InputVariables.COPY_RESULT_TO_AZURE_BLOB_STORAGE, true);
            if(copyToBlob) {
                logInformation('Copying Test Results to Azure blob storage.')
                copyResultsToAzureBlob(jmeterReportFolder, jmeterLogFolder);
            }
            
            logInformation('Task Completed.')
        }, function (err) {
            logInformation('promise rejected: ' + err);
        });
        
        child.stdout.on('data', function (data) {
            logInformation('stdout: ' + data, false);
        });
        child.stderr.on('data', function (data) {
            logInformation('stderr: ' + data, false);
        });
        child.on('close', function (code) {
            logInformation('closing code: ' + code);
        });
        const { stdout, stderr } = await child;
      
    } catch (err: any) {
        logInformation(err);
        tl.setResult(tl.TaskResult.Failed, err?.message);
    }
    
}


export async function replaceTokens(fileName: string | null | undefined) {
    var errCount = 0;
    
    try {
        logInformation("Starting Replace Tokens task for file: " + fileName);

        // get the task vars
        let sourcePath: string | null | undefined= fileName;
        if (!sourcePath || sourcePath.length === 0) {
           tl.setResult(tl.TaskResult.Failed, "No File Found to replace token");
           return;
        }

        // clear leading and trailing quotes for paths with spaces
        sourcePath = sourcePath.replace(/"/g, "");

        // remove trailing slash
        if (sourcePath.endsWith("\\") || sourcePath.endsWith("/")) {
            logInformation("Trimming separator off sourcePath");
            sourcePath = sourcePath.substr(0, sourcePath.length - 1);
        }
        
        tl.checkPath(sourcePath, "sourcePath");
 
        var warningsAsErrors = true;
        
        var tokenRegex = tl.getInput(InputVariables.TOKEN_REGEX, true); 

        const warning = warningsAsErrors ?
            (message: string) => { tl.error(message); errCount++ } :
            (message: string) => tl.warning(message); 

        logInformation(`sourcePath: [${sourcePath}]`); 
        logInformation(`tokenRegex: [${tokenRegex}]`);
 
        if (!tokenRegex || tokenRegex.length === 0){
            tokenRegex = "__(\\w+)__";
        }  
        let files = [sourcePath];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            logInformation(`Starting regex replacement in [${file}]`);
            
            var contents = fs.readFileSync(file).toString();
            var reg = new RegExp(tokenRegex, "g");
                    
            var match: RegExpExecArray | null;
            var newContents = contents;
            while((match = reg.exec(contents)) !== null) {
                var vName = match[1];
                var vIsArray = vName.endsWith("[]");
                if (vIsArray) {
                    vName = vName.substring(0, vName.length - 2);
                    logInformation(`Detected that ${vName} is an array token`);
                }
                
                // find the variable value in the environment
                var vValue = tl.getVariable(vName);

                if (typeof vValue === 'undefined') {
                    warning(`Token [${vName}] does not have an environment value`);
                } else {
                    if (vIsArray) {
                        newContents = newContents.replace(match[0], vValue.replace(/,/g, "\",\""));
                    } else {
                        newContents = newContents.replace(match[0], vValue);
                    }
                    logInformation(`Replaced token [${vName }]`);
                }           
                
            }
            logInformation("Writing new values to file");
             
            sh.chmod(666, file);
            fs.writeFileSync(file, newContents);
        }

    } catch (err :any) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }

    if (errCount > 0) {
        tl.setResult(tl.TaskResult.Failed, "Errors were encountered - please check logs for details.");
    }

    logInformation("Leaving Replace Tokens task");
}

async function copyResultsToAzureBlob(reportFolderName: string, logFolderName: string) {
    
    logInformation('Starting copyResultsToAzureBlob')
    let connectedServiceName = tl.getInput(InputVariables.CONNECTED_SERVICE_ARM_NAME, true);
    let storageAccountName = tl.getInput(InputVariables.STORAGE_ACCOUNT_RM, true); 
    var azureEndpoint: AzureEndpoint = await new AzureRMEndpoint(connectedServiceName).getEndpoint();
    const storageArmClient = new armStorage.StorageManagementClient(azureEndpoint.applicationTokenCredentials, azureEndpoint.subscriptionID?? '');
    let storageAccount: StorageAccount = await storageArmClient.storageAccounts.get(storageAccountName);
    let storageAccountResourceGroupName = getResourceGroupNameFromUri(storageAccount.id);
    let accessKeys = await storageArmClient.storageAccounts.listKeys(storageAccountResourceGroupName, storageAccountName, null);
    let accessKey: string = accessKeys[0];  
 
    let storageAccountURI = AZURE_STORAGE_ACCOUNT_URI.replace(AZURE_STORAGE_ACCOUNT_NAME_PLACEHOLDER, storageAccountName);
    const cert = new StorageSharedKeyCredential(storageAccountName,accessKey);
    const blobServiceClient = new BlobServiceClient(storageAccountURI, cert) ;
    let destContainerName = tl.getInput(InputVariables.CONTAINER_NAME);
    if(!destContainerName || destContainerName.length == 0) {
        logInformation('Missing required variable: ' + InputVariables.CONTAINER_NAME);
        tl.setResult(tl.TaskResult.Failed, "Missing required variable: " + InputVariables.CONTAINER_NAME);
    }
    const destContainerClient = blobServiceClient.getContainerClient(destContainerName);    

    let blobPrefix = tl.getInput(InputVariables.BLOB_PREFIX);
    
    let reportFolderABSPath = Path.join(process.cwd(), reportFolderName);
    logInformation('Uploading Reports to Blob Storage from path: ' + reportFolderABSPath + ' to BlobStorageAccount: ' + storageAccountName + ' and container Name: ' + destContainerName + " at path: " + Path.join(blobPrefix,reportFolderName));
    await uploadBlob(reportFolderABSPath, reportFolderName, blobPrefix, destContainerClient);
    
    let logFolderABSPath = Path.join(process.cwd(), logFolderName);
    logInformation('Uploading Logs to Blob Storage from path: ' + logFolderABSPath + ' to BlobStorageAccount: ' + storageAccountName + ' and container Name: ' + destContainerName + " at path: " + Path.join(blobPrefix,logFolderName));
    await uploadBlob(logFolderABSPath, logFolderName, blobPrefix, destContainerClient);
    
    let outputStorageUri = tl.getInput(InputVariables.OUTPUT_STORAGE_URI);
    if(!outputStorageUri || outputStorageUri.length == 0) {
        logInformation('No Output Storage URL Provided. Hence unable to create performance test Result.')
    } else {
        if(!outputStorageUri.endsWith(URL_SEPERATOR)) {
            outputStorageUri = outputStorageUri + URL_SEPERATOR;
        }
        if(!blobPrefix.endsWith(URL_SEPERATOR)) {
            blobPrefix = blobPrefix + URL_SEPERATOR;
        }
        let REPORT_URL = outputStorageUri + blobPrefix + reportFolderName + URL_SEPERATOR + JMETER_REPORT_INDEX_FILE_NAME;
        let JTL_URL = outputStorageUri + blobPrefix  + logFolderName + URL_SEPERATOR + LOG_JTL_FILE_NAME;
        let LOG_URL = outputStorageUri + blobPrefix  + logFolderName + URL_SEPERATOR + JMETER_LOG_FILE_NAME;

        logInformation(' Performance Test Result Available at: ' + REPORT_URL);
        logInformation(' JMeter JTL File Available at: ' + JTL_URL);
        logInformation(' JMeter Log File Available at: ' + LOG_URL);
    }
}

async function uploadBlob(src: string, uploadFolderName: string,  blobPrefix: string, destContainerClient: any  ) {
    
    await fs.readdir(src, {withFileTypes: true}, 
        async (err, files) => {
        
        if (err)
          logInformation(err);
        else {
            for(let entry of files) {
                const srcPath = Path.join(src, entry.name);
                let uploadFileName = srcPath.substring(srcPath.indexOf(uploadFolderName)); 
                if(entry.isDirectory()) {
                    await uploadBlob(srcPath, uploadFolderName, blobPrefix, destContainerClient);
                } else {
                    let path: string = '';
                    if(!blobPrefix || blobPrefix.length == 0) {
                        path = uploadFileName
                    } else {
                        path = Path.join(blobPrefix, uploadFileName);
                    }
                    const blockBlobClient = destContainerClient.getBlockBlobClient(path);
                    await blockBlobClient.uploadFile(srcPath, getBlobOptions(uploadFileName));    
                }
            }
        }
    }); 
}

function getBlobOptions(fileName: string) {
    let type= '';
    if(fileName.endsWith('.html') || fileName.endsWith('.htm')) {
        type = 'text/html';
    } else if(fileName.endsWith('.css')) {
        type = 'text/css';
    } else if(fileName.endsWith('.js')) {
        type = 'text/javascript';
    } else if(fileName.endsWith('.png')) {
        type = 'image/png';
    } else if(fileName.endsWith('.svg')) {
        type = 'image/svg+xml';
    } else if(fileName.endsWith('.woff') ) {
        type = 'font/woff';
    } else if(fileName.endsWith('.woff2')) {
        type = 'font/woff2';
    } else if(fileName.endsWith('.ttf')) {
        type = 'font/ttf';
    } else if(fileName.endsWith('.eot')) {
        type = 'font/eot';
    }  else if(fileName.endsWith('.jpg')) {
        type = 'images/jpg';
    } else if(fileName.endsWith('.jpeg')) {
        type = 'images/jpeg';
    } else if(fileName.endsWith('.json') || fileName.endsWith('.md') || fileName.endsWith('.less')) {
        type = 'text/plain';
    } else {
        type = 'text/plain';
    }
    const blobOptions = { blobHTTPHeaders: { blobContentType: type } };
    return blobOptions;
}

function getResourceGroupNameFromUri(resourceUri: string): string {
    if (isNonEmpty(resourceUri)) {
        resourceUri = resourceUri.toLowerCase();
        return resourceUri.substring(resourceUri.indexOf("resourcegroups/") + "resourcegroups/".length, resourceUri.indexOf("/providers"));
    }

    return "";
}

function isEmpty(str: string|undefined|null): boolean {
    return (!str || str.length == 0) 
}
function isNonEmpty(str: string|undefined|null): boolean {
    return !isEmpty(str);
}

function logInformation(data: any, printDate: boolean = true) {
    if(printDate) {
        let formattedDate = (moment(Date.now())).format(DATE_FORMAT)
        console.log(formattedDate + ":  " + data);
        tl.debug(formattedDate + ":  " + data)
    } else {
        console.log(data);
        tl.debug(data)
    }
    
}
 
main();
