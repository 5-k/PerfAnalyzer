import * as moment from 'moment'; 
import { DATE_FORMAT } from './constant'

const tl = require('azure-pipelines-task-lib/task'); 
const fs = require('fs');
const https = require('https');
const Path = require('path'); 
var tar = require('tar');

export function logInformation(data: any, printDate: boolean = true) {
    if(printDate) {
        let formattedDate = (moment(Date.now())).format(DATE_FORMAT)
        console.log(formattedDate + ":  " + data);
        tl.debug(formattedDate + ":  " + data)
    } else {
        console.log(data);
        tl.debug(data)
    }
    
}

export async function downloadFile(fileSource: string, destinationFilePath: string) {
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


export async function unzipBinary(fileName: string) {    
    await tar.x({file: fileName});
}


export function copyFileToDirectory(sourcefilePath: string, destinationFilePath: string) {   
    logInformation('Start Copying File to destination ' + destinationFilePath + ' from source ' + sourcefilePath)
    fs.copyFileSync(sourcefilePath, destinationFilePath, (err: any) => {
        if (err) throw err;
        logInformation('Completed '+ sourcefilePath + ' was copied to ' + destinationFilePath);
      });   
}

export function copyDirectoryRecursiveSync(source, target, move): string[] {
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



export function isEmpty(str: string|undefined|null): boolean {
    return (!str || str.length == 0) 
}
export function isNonEmpty(str: string|undefined|null): boolean {
    return !isEmpty(str);
}