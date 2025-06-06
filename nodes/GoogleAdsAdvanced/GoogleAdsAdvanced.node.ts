import {
	type INodeTypeDescription,
	INodeType, ICredentialTestFunctions, ICredentialsDecrypted, INodeCredentialTestResult,
	// ICredentialTestFunctions,
	// ICredentialsDecrypted,
	// INodeCredentialTestResult
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { campaignFields, campaignOperations } from './CampaignDescription';

export class GoogleAdsAdvanced implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Ads Advanced',
		name: 'googleAdsAdvanced',
		icon: 'file:googleAds.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Consume the Google Ads API',
		defaults: {
			name: 'Google Ads Advanced',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'googleAdsAdvancedApi',
				required: true,
				testedBy: 'testGoogleAdsTokenAuth',
				displayOptions: {
					show: {
						authentication: ['serviceAccount'],
					},
				},
			},
			{
				name: 'googleAdsOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		requestDefaults: {
			returnFullResponse: true,
			baseURL: 'https://googleads.googleapis.com',
			headers: {
				'developer-token': '={{$credentials.developerToken}}',
			},
		},
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
						name: 'OAuth2 (recommended)',
						value: 'oAuth2',
					},
					{
						name: 'Service Account',
						value: 'serviceAccount',
					},
				],
				default: 'oAuth2',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Campaign',
						value: 'campaign',
					},
				],
				default: 'campaign',
			},
			//-------------------------------
			// Campaign Operations
			//-------------------------------
			...campaignOperations,
			{
				displayName:
					'Divide field names expressed with <i>micros</i> by 1,000,000 to get the actual value',
				name: 'campaigsNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['getAll']
					},
				},
			},
			...campaignFields,
		],
	};


	methods = {
		credentialTest: {
			async testGoogleAdsTokenAuth(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				console.log("credentialTest")
				return {
					status: 'OK',
					message: 'Connection successful!',
				};
			},
		},
	};
}
