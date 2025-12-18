[@alternatefutures/sdk](../README.md) / AlternateFuturesSdk

# Class: AlternateFuturesSdk

## Table of contents

### Constructors

- [constructor](AlternateFuturesSdk.md#constructor)

### Methods

- [applications](AlternateFuturesSdk.md#applications)
- [billing](AlternateFuturesSdk.md#billing)
- [domains](AlternateFuturesSdk.md#domains)
- [ens](AlternateFuturesSdk.md#ens)
- [functions](AlternateFuturesSdk.md#functions)
- [getVersion](AlternateFuturesSdk.md#getversion)
- [ipfs](AlternateFuturesSdk.md#ipfs)
- [ipns](AlternateFuturesSdk.md#ipns)
- [privateGateways](AlternateFuturesSdk.md#privategateways)
- [projects](AlternateFuturesSdk.md#projects)
- [sites](AlternateFuturesSdk.md#sites)
- [storage](AlternateFuturesSdk.md#storage)
- [user](AlternateFuturesSdk.md#user)

## Constructors

### constructor

• **new AlternateFuturesSdk**(`«destructured»`): [`AlternateFuturesSdk`](AlternateFuturesSdk.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `AlternateFuturesSdkOptions` |

#### Returns

[`AlternateFuturesSdk`](AlternateFuturesSdk.md)

#### Defined in

[src/AlternateFuturesSdk.ts:69](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L69)

## Methods

### applications

▸ **applications**(): `ApplicationsClient`

#### Returns

`ApplicationsClient`

#### Defined in

[src/AlternateFuturesSdk.ts:182](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L182)

___

### billing

▸ **billing**(): [`BillingClient`](BillingClient.md)

#### Returns

[`BillingClient`](BillingClient.md)

#### Defined in

[src/AlternateFuturesSdk.ts:231](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L231)

___

### domains

▸ **domains**(): `DomainsClient`

#### Returns

`DomainsClient`

#### Defined in

[src/AlternateFuturesSdk.ts:172](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L172)

___

### ens

▸ **ens**(): `EnsClient`

#### Returns

`EnsClient`

#### Defined in

[src/AlternateFuturesSdk.ts:192](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L192)

___

### functions

▸ **functions**(): `FunctionsClient`

#### Returns

`FunctionsClient`

#### Defined in

[src/AlternateFuturesSdk.ts:221](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L221)

___

### getVersion

▸ **getVersion**(): `Promise`\<`Pick`\<\{ `__typename`: ``"Query"`` ; `afFunctionByName`: `AFFunction` ; `afFunctionDeployment`: `AFFunctionDeployment` ; `afFunctionDeployments`: `AFFunctionDeploymentsWithAggregation` ; `afFunctions`: `AFFunctionsWithAggregation` ; `application`: `Application` ; `applicationNameAvailability`: `boolean` ; `applications`: `ApplicationsWithAggregation` ; `billingCycleUsages`: `BillingCycleUsagesWithAggregation` ; `billingPlan`: `BillingPlan` ; `billingPlans`: `BillingPlansWithAggregation` ; `deployment`: `Deployment` ; `deployments`: `DeploymentsWithAggregation` ; `deploymentsQueueLimit`: `boolean` ; `domain`: `Domain` ; `domainAvailability`: `boolean` ; `domainByHostname`: `Domain` ; `domainVerificationInstructions`: `DomainVerificationInstructions` ; `domains`: `DomainsWithAggregation` ; `domainsByZoneId`: `DomainsByZoneIdWithAggregation` ; `emailAvailability`: `boolean` ; `ensNameAvailability`: `boolean` ; `ensRecord`: `EnsRecord` ; `ensRecordByName`: `EnsRecord` ; `ensRecords`: `EnsRecordsWithAggregation` ; `ensRecordsByIpnsId`: `EnsRecordsByIpnsIdWithAggregation` ; `filecoinDeals`: `FilecoinDealsWithAggregation` ; `folder`: `Folder` ; `folderNameAvailabilityInParentFolder`: `boolean` ; `gitApiBranches`: `GitApiBranch`[] ; `gitApiInstallations`: `GitApiInsatallation`[] ; `gitApiIsRepoNameAvailable`: `boolean` ; `gitApiTree`: `GitApiTree`[] ; `gitIntegration`: `GitIntegration` ; `gitProvider`: `GitProvider` ; `gitProviders`: `GitProvider`[] ; `githubAppInstallations`: `GithubAppInstallation`[] ; `invitation`: `InvitationDetail` ; `invitations`: `InvitationsWithAggregation` ; `ipnsRecord`: `IpnsRecord` ; `ipnsRecords`: `IpnsRecordsWithAggregation` ; `listDeploymentBranches`: `string`[] ; `listFolder`: `ListFolderWithAggregation` ; `migrationRequest`: `MigrationRequest` ; `migrationRequests`: `MigrationRequestsWithAggregation` ; `migrationRequestsByToken`: `MigrationRequest`[] ; `migrationScheduledRequest`: ``null`` \| `MigrationScheduledRequest` ; `migrationStatusByTeamId`: ``null`` \| `MigrationStatus` ; `migrationTeamInfosFromToken`: `MigrationTeamInfo`[] ; `notificationSettings`: `NotificationSettings`[] ; `notifications`: `NotificationsWithAggregation` ; `permissionGroups`: `PermissionGroupsWithAggregation` ; `personalAccessTokens`: `PersonalAccessTokensWithAggregation` ; `pin`: `Pin` ; `pinNameAvailabilityInParentFolder`: `boolean` ; `pins`: `PinsWithAggregation` ; `pinsByFilename`: `PinsByFilenameWithAggregation` ; `privateGateway`: `PrivateGateway` ; `privateGatewayBySlug`: `PrivateGateway` ; `privateGatewayNameAvailability`: `boolean` ; `privateGateways`: `PrivateGatewaysWithAggregation` ; `project`: `Project` ; `projectQuota`: `ProjectQuota` ; `projects`: `ProjectsWithAggregation` ; `resolveIpnsName`: `string` ; `secretAvailability`: `boolean` ; `site`: `Site` ; `siteBuildSettings`: `SiteBuildSettings` ; `siteBySlug`: `Site` ; `siteFramework`: `SiteFramework` ; `siteFrameworks`: `SiteFramework`[] ; `siteNameAvailability`: `boolean` ; `siteQuota`: `SiteQuota` ; `sites`: `SitesWithAggregation` ; `slugAvailability`: `boolean` ; `template`: `Template` ; `templateCategories`: `TemplateCategoriesWithAggregation` ; `templateCategory`: `TemplateCategory` ; `templateNameAvailability`: `boolean` ; `templates`: `TemplatesWithAggregation` ; `twoFactorProtectedActions`: `TwoFactorProtectedActionsWithAggregation` ; `user`: `User` ; `userQuota`: `UserQuota` ; `usernameAvailability`: `boolean` ; `version`: `Pick`\<\{ `__typename`: ``"Version"`` ; `commitHash`: `string`  }, ``"__typename"`` \| ``"commitHash"``\> ; `zone`: `Zone` ; `zones`: `ZonesWithAggregation`  }, ``"version"``\>\>

#### Returns

`Promise`\<`Pick`\<\{ `__typename`: ``"Query"`` ; `afFunctionByName`: `AFFunction` ; `afFunctionDeployment`: `AFFunctionDeployment` ; `afFunctionDeployments`: `AFFunctionDeploymentsWithAggregation` ; `afFunctions`: `AFFunctionsWithAggregation` ; `application`: `Application` ; `applicationNameAvailability`: `boolean` ; `applications`: `ApplicationsWithAggregation` ; `billingCycleUsages`: `BillingCycleUsagesWithAggregation` ; `billingPlan`: `BillingPlan` ; `billingPlans`: `BillingPlansWithAggregation` ; `deployment`: `Deployment` ; `deployments`: `DeploymentsWithAggregation` ; `deploymentsQueueLimit`: `boolean` ; `domain`: `Domain` ; `domainAvailability`: `boolean` ; `domainByHostname`: `Domain` ; `domainVerificationInstructions`: `DomainVerificationInstructions` ; `domains`: `DomainsWithAggregation` ; `domainsByZoneId`: `DomainsByZoneIdWithAggregation` ; `emailAvailability`: `boolean` ; `ensNameAvailability`: `boolean` ; `ensRecord`: `EnsRecord` ; `ensRecordByName`: `EnsRecord` ; `ensRecords`: `EnsRecordsWithAggregation` ; `ensRecordsByIpnsId`: `EnsRecordsByIpnsIdWithAggregation` ; `filecoinDeals`: `FilecoinDealsWithAggregation` ; `folder`: `Folder` ; `folderNameAvailabilityInParentFolder`: `boolean` ; `gitApiBranches`: `GitApiBranch`[] ; `gitApiInstallations`: `GitApiInsatallation`[] ; `gitApiIsRepoNameAvailable`: `boolean` ; `gitApiTree`: `GitApiTree`[] ; `gitIntegration`: `GitIntegration` ; `gitProvider`: `GitProvider` ; `gitProviders`: `GitProvider`[] ; `githubAppInstallations`: `GithubAppInstallation`[] ; `invitation`: `InvitationDetail` ; `invitations`: `InvitationsWithAggregation` ; `ipnsRecord`: `IpnsRecord` ; `ipnsRecords`: `IpnsRecordsWithAggregation` ; `listDeploymentBranches`: `string`[] ; `listFolder`: `ListFolderWithAggregation` ; `migrationRequest`: `MigrationRequest` ; `migrationRequests`: `MigrationRequestsWithAggregation` ; `migrationRequestsByToken`: `MigrationRequest`[] ; `migrationScheduledRequest`: ``null`` \| `MigrationScheduledRequest` ; `migrationStatusByTeamId`: ``null`` \| `MigrationStatus` ; `migrationTeamInfosFromToken`: `MigrationTeamInfo`[] ; `notificationSettings`: `NotificationSettings`[] ; `notifications`: `NotificationsWithAggregation` ; `permissionGroups`: `PermissionGroupsWithAggregation` ; `personalAccessTokens`: `PersonalAccessTokensWithAggregation` ; `pin`: `Pin` ; `pinNameAvailabilityInParentFolder`: `boolean` ; `pins`: `PinsWithAggregation` ; `pinsByFilename`: `PinsByFilenameWithAggregation` ; `privateGateway`: `PrivateGateway` ; `privateGatewayBySlug`: `PrivateGateway` ; `privateGatewayNameAvailability`: `boolean` ; `privateGateways`: `PrivateGatewaysWithAggregation` ; `project`: `Project` ; `projectQuota`: `ProjectQuota` ; `projects`: `ProjectsWithAggregation` ; `resolveIpnsName`: `string` ; `secretAvailability`: `boolean` ; `site`: `Site` ; `siteBuildSettings`: `SiteBuildSettings` ; `siteBySlug`: `Site` ; `siteFramework`: `SiteFramework` ; `siteFrameworks`: `SiteFramework`[] ; `siteNameAvailability`: `boolean` ; `siteQuota`: `SiteQuota` ; `sites`: `SitesWithAggregation` ; `slugAvailability`: `boolean` ; `template`: `Template` ; `templateCategories`: `TemplateCategoriesWithAggregation` ; `templateCategory`: `TemplateCategory` ; `templateNameAvailability`: `boolean` ; `templates`: `TemplatesWithAggregation` ; `twoFactorProtectedActions`: `TwoFactorProtectedActionsWithAggregation` ; `user`: `User` ; `userQuota`: `UserQuota` ; `usernameAvailability`: `boolean` ; `version`: `Pick`\<\{ `__typename`: ``"Version"`` ; `commitHash`: `string`  }, ``"__typename"`` \| ``"commitHash"``\> ; `zone`: `Zone` ; `zones`: `ZonesWithAggregation`  }, ``"version"``\>\>

#### Defined in

[src/AlternateFuturesSdk.ts:115](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L115)

___

### ipfs

▸ **ipfs**(): `IpfsClient`

#### Returns

`IpfsClient`

#### Defined in

[src/AlternateFuturesSdk.ts:140](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L140)

___

### ipns

▸ **ipns**(): `IpnsClient`

#### Returns

`IpnsClient`

#### Defined in

[src/AlternateFuturesSdk.ts:132](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L132)

___

### privateGateways

▸ **privateGateways**(): `PrivateGatewayClient`

#### Returns

`PrivateGatewayClient`

#### Defined in

[src/AlternateFuturesSdk.ts:200](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L200)

___

### projects

▸ **projects**(): `ProjectsClient`

#### Returns

`ProjectsClient`

#### Defined in

[src/AlternateFuturesSdk.ts:162](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L162)

___

### sites

▸ **sites**(): `SitesClient`

#### Returns

`SitesClient`

#### Defined in

[src/AlternateFuturesSdk.ts:154](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L154)

___

### storage

▸ **storage**(): `StorageClient`

#### Returns

`StorageClient`

#### Defined in

[src/AlternateFuturesSdk.ts:210](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L210)

___

### user

▸ **user**(): `UserClient`

#### Returns

`UserClient`

#### Defined in

[src/AlternateFuturesSdk.ts:124](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/AlternateFuturesSdk.ts#L124)
