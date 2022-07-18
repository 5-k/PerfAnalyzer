import { APPINSIGHTS_CONNECTION_STRING } from "./appInsightsConnectionString";
import { logInformation } from "./utility";

const fs = require('fs');
let appInsights = require('applicationinsights');
export let TelemetryClient: any;
export let AppInsights: any;
let appInsightsClient = appInsights.defaultClient;
const tl = require('azure-pipelines-task-lib/task');
const globalAny:any = global;

export function enableAppInsights() { 
    try {
        
        appInsights.setup(APPINSIGHTS_CONNECTION_STRING)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(true)
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
        .start();
        appInsightsClient = appInsights.defaultClient;
    } catch(e) {
        logInformation('Application insights could not be started: ' + e?.message);
    }
} 

export function LogEvent(eventName: string) {
    try {
        appInsightsClient.trackEvent({name: eventName, properties: GetDefaultProps()});
    } catch(e) {
       console.log('[Ignore] Telemetry LogEvent Error: ' + e?.message,e ) 
    }
    
}
export function trackTrace(message: string) {
    try {
        appInsightsClient.trackTrace({message: message, properties: GetDefaultProps()});
    } catch(e) {
       console.log('[Ignore] Telemetry trackTrace Error: ' + e?.message,e ) 
    }
    
}
export function trackException(message: string) {
    try {
        const error = new MyError(message);
        appInsightsClient.trackException({ exception: error , properties: GetDefaultProps()});
    } catch(e) {        
       console.log('[Ignore] Telemetry trackTrace Error: ' + e?.message,e )     
    }
    
}

function GetDefaultProps() {
    let props = {
        systemHostType: getSystemProps('system.hostType'),
        systemDefinitionId: getSystemProps('system.DefinitionId'),
        systemJobDisplayName: getSystemProps('system.JobDisplayName'),
        systemCollectionId: getSystemProps ('system.CollectionId'),
        buildQueuedBy	: getSystemProps ('Build.QueuedBy'),
        buildQueuedById: getSystemProps ('Build.QueuedById'),
        buildReason: getSystemProps ('Build.Reason'),
        buildRepositoryLocalPath: getSystemProps ('Build.ReasonBuild.Repository.LocalPath'),
        buildRepositoryName: getSystemProps ('Build.Repository.Name'),
        buildRepositoryURI: getSystemProps ('Build.Repository.Uri'),
		releaseEnvironmentUri: getSystemProps ('Release.EnvironmentUri'),
		releaseReleaseName	: getSystemProps ('Release.ReleaseName'),
		releaseReleaseURI	: getSystemProps ('Release.ReleaseUri'),
		releaseRequestedForEmail: getSystemProps ('Release.RequestedForEmail'),	
        guid: globalAny.UNIQUE_RUN_ID
    }
    return props;
}
class MyError extends Error {
    constructor (msg) {
      super(msg)
      this.name = 'MyError'
    }
}

function getSystemProps(prop: string) {
    try {
        return  tl.getVariable(prop);
    } catch (e) {
        trackTrace('[Ignore] Telemetry System props Unable to fetch : '+ prop + ' Warning: '+ e?.message )     
    }
}