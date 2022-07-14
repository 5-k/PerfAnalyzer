import {logInformation } from './utility'
const tl = require('azure-pipelines-task-lib/task');
const Path = require('path'); 

export async function publishData(pathToPublish: string, artifactName: string) {
    //logInformation('Started Uploading Artifacts from : ' + pathToPublish + ' to location: ' + pathToPublish);
    //tl.setResourcePath(Path.join(__dirname, 'task.json')); 
    //logInformation('ResourcePath: ' + Path.join(__dirname, 'task.json'));    
    logInformation('Current Working directory: ' +  process.cwd());
    let hostType = tl.getVariable('system.hostType');
    if ((hostType && hostType.toUpperCase() != 'BUILD')) {
        logInformation('Unable to upload Result: ErrorHostTypeNotSupported');
        return;
    }

    let data = {
        artifacttype: 'Container',
        artifactname: artifactName
    };
    data["containerfolder"] = artifactName;

    
    data["localpath"] = pathToPublish;
    tl.command("artifact.upload", data, pathToPublish);
    logInformation('Completed Uploading Artifacts from : ' + pathToPublish + ' to location: ' + pathToPublish);
}

