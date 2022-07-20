import { APPINSIGHTS_CONNECTION_STRING } from "./appInsightsConnectionString";
import { logInformation } from "./utility";

const fs = require('fs');
let appInsights = require('applicationinsights');
export let TelemetryClient: any;
export let AppInsights: any;
let appInsightsClient = appInsights.defaultClient;
let telemetryProps:{} = null;
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
    if(null != telemetryProps && Object.keys(telemetryProps).length > 0) {
      logInformation('Using Telemetry Props Count: ' + Object.keys(telemetryProps).length);
      return telemetryProps;
    }
    let props = {

        buildQueuedBy	: getSystemProps ('Build.QueuedBy'),
        buildQueuedById: getSystemProps ('Build.QueuedById'),
        buildReason: getSystemProps ('Build.Reason'),
        buildRepositoryLocalPath: getSystemProps ('Build.ReasonBuild.Repository.LocalPath'),
        buildRepositoryName: getSystemProps ('Build.Repository.Name'),
        buildRepositoryURI: getSystemProps ('Build.Repository.Uri'),
        buildDefinitionName: getSystemProps ('Build.DefinitionName'),
    		buildId: getSystemProps ('Build.BuildId'),
        buildArtifactStagingDirectory: getSystemProps('Build.ArtifactStagingDirectory'),
        buildNumber: getSystemProps('Build.BuildNumber'),
        buildRequestedFor	: getSystemProps('Build.RequestedFor'),
        buildRequestedForEmail	: getSystemProps('Build.RequestedForEmail'),
        buildRequestedForId	: getSystemProps('Build.RequestedForId'),
        buildSourceBranch	: getSystemProps('Build.SourceBranch'),

    		agentId: getSystemProps ('Agent.Id'),
    		agentOS: getSystemProps ('Agent.OS'),
    		agentName: getSystemProps ('Agent.Name'),
        agentOSArchitecture: getSystemProps ('Agent.OSArchitecture'),
    		agentMachineName: getSystemProps ('Agent.MachineName'),

        systemHostType: getSystemProps('system.hostType'),
        systemDefinitionId: getSystemProps('system.DefinitionId'),
        systemJobDisplayName: getSystemProps('system.JobDisplayName'),
        systemCollectionId: getSystemProps ('system.CollectionId'),
        systemJobId: getSystemProps ('System.JobId'),
        systemJobAttempt: getSystemProps ('System.JobAttempt'),

    		environmentName: getSystemProps ('Environment.Name'),
        environmentId: getSystemProps ('Environment.Id'),
        environmentResourceName: getSystemProps ('Environment.ResourceName'),
        environmentResourceId: getSystemProps ('Environment.ResourceId'),
        strategyName: getSystemProps ('Strategy.Name'),

        releaseEnvironmentUri: getSystemProps ('Release.EnvironmentUri'),
    		releaseName	: getSystemProps ('Release.ReleaseName'),
    		releaseURI	: getSystemProps ('Release.ReleaseUri'),
    		releaseRequestedForEmail: getSystemProps ('Release.RequestedForEmail'),
    		releaseDeploymentID: getSystemProps ('Release.DeploymentID'),
    		releaseDefinitionId: getSystemProps ('Release.DefinitionId'),
    		releaseDefinitionName: getSystemProps ('Release.DefinitionName'),
        releaseDeploymentRequestedFor: getSystemProps ('Release.Deployment.RequestedFor'),
        releaseDeploymentRequestedForEmail: getSystemProps ('Release.Deployment.RequestedForEmail'),
        releaseEnvironmentName: getSystemProps ('Release.EnvironmentName'),
        releaseReleaseId: getSystemProps ('Release.ReleaseId'),
        releaseRequestedFor: getSystemProps ('Release.RequestedFor')
    }
    telemetryProps = props;
    logInformation('Created Telemetry Props Count: ' + Object.keys(props).length);
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
