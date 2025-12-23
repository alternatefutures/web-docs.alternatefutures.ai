# SDK API Reference

> This documentation is auto-generated from the `cloud-sdk` repository using TypeDoc.

@alternatefutures/sdk

# @alternatefutures/sdk

## Table of contents

### Classes

- [AlternateFuturesSdk](./api/classes/AlternateFuturesSdk.md)
- [ApplicationAccessTokenService](./api/classes/ApplicationAccessTokenService.md)
- [PersonalAccessTokenService](./api/classes/PersonalAccessTokenService.md)
- [StaticAccessTokenService](./api/classes/StaticAccessTokenService.md)

### Interfaces

- [ApplicationWhiteLabelDomain](./api/interfaces/ApplicationWhiteLabelDomain.md)
- [ApplicationWhitelistDomain](./api/interfaces/ApplicationWhitelistDomain.md)
- [Client](./api/interfaces/Client.md)

### Type Aliases

- [AFFunction](./api/README.md#affunction)
- [AFFunctionStatus](./api/README.md#affunctionstatus)
- [Application](./api/README.md#application)
- [CurrentUsage](./api/README.md#currentusage)
- [Customer](./api/README.md#customer)
- [Deployment](./api/README.md#deployment)
- [Domain](./api/README.md#domain)
- [DomainStatus](./api/README.md#domainstatus)
- [EnsRecord](./api/README.md#ensrecord)
- [Invoice](./api/README.md#invoice)
- [InvoiceLineItem](./api/README.md#invoicelineitem)
- [IpfsFile](./api/README.md#ipfsfile)
- [IpnsRecord](./api/README.md#ipnsrecord)
- [Payment](./api/README.md#payment)
- [PaymentMethod](./api/README.md#paymentmethod)
- [PrivateGateway](./api/README.md#privategateway)
- [Project](./api/README.md#project)
- [Site](./api/README.md#site)
- [StoragePin](./api/README.md#storagepin)
- [Subscription](./api/README.md#subscription)
- [UploadContentOptions](./api/README.md#uploadcontentoptions)
- [UploadPinResponse](./api/README.md#uploadpinresponse)
- [UploadProgress](./api/README.md#uploadprogress)
- [UsageMetric](./api/README.md#usagemetric)
- [UsageRecord](./api/README.md#usagerecord)
- [Zone](./api/README.md#zone)

### Functions

- [createClient](./api/README.md#createclient)

## Type Aliases

### AFFunction

Ƭ **AFFunction**: `Omit`\<`OriginalAFFunction`, ``"projectId"`` \| ``"site"``\>

#### Defined in

[src/clients/functions.ts:14](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/functions.ts#L14)

___

### AFFunctionStatus

Ƭ **AFFunctionStatus**: ``"ACTIVE"`` \| ``"INACTIVE"``

#### Defined in

node_modules/.pnpm/@alternatefutures+utils-genql-client@0.2.0/node_modules/@alternatefutures/utils-genql-client/dist/schema.ts:551

___

### Application

Ƭ **Application**: `Omit`\<`ApplicationWithRelations`, ``"__typename"`` \| ``"whitelistDomains"``\> & \{ `whitelistDomains`: `string`[]  } & \{ `whiteLabelDomains`: `string`[]  }

#### Defined in

[src/clients/applications.ts:8](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/applications.ts#L8)

___

### CurrentUsage

Ƭ **CurrentUsage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bandwidth` | [`UsageMetric`](README.md#usagemetric) |
| `compute` | [`UsageMetric`](README.md#usagemetric) |
| `periodEnd?` | `number` |
| `periodStart?` | `number` |
| `requests` | [`UsageMetric`](README.md#usagemetric) |
| `storage` | [`UsageMetric`](README.md#usagemetric) |
| `total` | `number` |

#### Defined in

[src/clients/billing.ts:96](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L96)

___

### Customer

Ƭ **Customer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createdAt` | `number` |
| `email?` | `string` |
| `id` | `string` |
| `name?` | `string` |

#### Defined in

[src/clients/billing.ts:9](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L9)

___

### Deployment

Ƭ **Deployment**: `Pick`\<`DeploymentWithRelations`, ``"id"`` \| ``"status"`` \| ``"storageType"`` \| ``"siteId"`` \| ``"cid"`` \| ``"updatedAt"`` \| ``"createdAt"``\>

#### Defined in

[src/clients/sites.ts:22](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/sites.ts#L22)

___

### Domain

Ƭ **Domain**: `Pick`\<`DomainWithRelations`, ``"id"`` \| ``"zone"`` \| ``"hostname"`` \| ``"isVerified"`` \| ``"updatedAt"`` \| ``"createdAt"`` \| ``"dnsConfigs"`` \| ``"status"``\> & \{ `arnsName?`: `string` ; `dnsCheckAttempts?`: `number` ; `dnsVerifiedAt?`: `string` ; `domainType?`: ``"WEB2"`` \| ``"ARNS"`` \| ``"ENS"`` \| ``"IPNS"`` ; `ensName?`: `string` ; `expectedARecord?`: `string` ; `expectedCname?`: `string` ; `ipnsHash?`: `string` ; `lastDnsCheck?`: `string` ; `sslAutoRenew?`: `boolean` ; `sslExpiresAt?`: `string` ; `sslIssuedAt?`: `string` ; `sslStatus?`: ``"NONE"`` \| ``"PENDING"`` \| ``"ACTIVE"`` \| ``"EXPIRED"`` \| ``"FAILED"`` ; `txtVerificationStatus?`: ``"PENDING"`` \| ``"VERIFIED"`` \| ``"FAILED"`` ; `txtVerificationToken?`: `string` ; `verified?`: `boolean`  }

#### Defined in

[src/clients/domains.ts:23](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/domains.ts#L23)

___

### DomainStatus

Ƭ **DomainStatus**: ``"ACTIVE"`` \| ``"CREATED"`` \| ``"CREATING"`` \| ``"CREATING_FAILED"`` \| ``"DELETING"`` \| ``"DELETING_FAILED"`` \| ``"VERIFYING"`` \| ``"VERIFYING_FAILED"``

#### Defined in

node_modules/.pnpm/@alternatefutures+utils-genql-client@0.2.0/node_modules/@alternatefutures/utils-genql-client/dist/schema.ts:375

___

### EnsRecord

Ƭ **EnsRecord**: `Omit`\<`EnsRecordWithRelations`, ``"site"`` \| ``"ipnsRecord"``\> & \{ `ipnsRecord`: `Pick`\<`EnsRecordWithRelations`[``"ipnsRecord"``], ``"id"`` \| ``"name"`` \| ``"hash"``\> & \{ `id`: `string`  } ; `site`: `Pick`\<`EnsRecordWithRelations`[``"site"``], ``"id"``\>  }

#### Defined in

[src/clients/ens.ts:7](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/ens.ts#L7)

___

### Invoice

Ƭ **Invoice**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amountDue` | `number` |
| `amountPaid` | `number` |
| `createdAt` | `number` |
| `currency` | `string` |
| `dueDate?` | `number` |
| `id` | `string` |
| `invoiceNumber` | `string` |
| `lineItems?` | [`InvoiceLineItem`](README.md#invoicelineitem)[] |
| `paidAt?` | `number` |
| `pdfUrl?` | `string` |
| `periodEnd?` | `number` |
| `periodStart?` | `number` |
| `status` | ``"DRAFT"`` \| ``"OPEN"`` \| ``"PAID"`` \| ``"VOID"`` \| ``"UNCOLLECTIBLE"`` |
| `subtotal` | `number` |
| `tax` | `number` |
| `total` | `number` |

#### Defined in

[src/clients/billing.ts:60](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L60)

___

### InvoiceLineItem

Ƭ **InvoiceLineItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `number` |
| `description` | `string` |
| `id` | `string` |
| `quantity` | `number` |
| `unitPrice` | `number` |

#### Defined in

[src/clients/billing.ts:52](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L52)

___

### IpfsFile

Ƭ **IpfsFile**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | `ArrayBuffer` \| `string` |
| `path?` | `string` |

#### Defined in

[src/clients/ipfs.ts:17](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/ipfs.ts#L17)

___

### IpnsRecord

Ƭ **IpnsRecord**: `Pick`\<`IpnsRecordWithRelations`, ``"id"`` \| ``"name"`` \| ``"hash"``\> & \{ `ensRecords`: `Pick`\<`IpnsRecordWithRelations`[``"ensRecords"``][`number`], ``"id"``\>[]  }

#### Defined in

[src/clients/ipns.ts:37](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/ipns.ts#L37)

___

### Payment

Ƭ **Payment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `number` |
| `blockchain?` | `string` |
| `createdAt` | `number` |
| `currency` | `string` |
| `id` | `string` |
| `invoiceId?` | `string` |
| `provider?` | `string` |
| `status` | ``"PENDING"`` \| ``"SUCCEEDED"`` \| ``"FAILED"`` |
| `txHash?` | `string` |

#### Defined in

[src/clients/billing.ts:79](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L79)

___

### PaymentMethod

Ƭ **PaymentMethod**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockchain?` | `string` |
| `cardBrand?` | `string` |
| `cardExpMonth?` | `number` |
| `cardExpYear?` | `number` |
| `cardLast4?` | `string` |
| `createdAt` | `number` |
| `id` | `string` |
| `isDefault` | `boolean` |
| `provider?` | `string` |
| `type` | ``"CARD"`` \| ``"CRYPTO"`` |
| `walletAddress?` | `string` |

#### Defined in

[src/clients/billing.ts:16](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L16)

___

### PrivateGateway

Ƭ **PrivateGateway**: `Omit`\<`PrivateGatewayWithRelations`, ``"project"`` \| ``"domains"`` \| ``"domainsPaginated"`` \| ``"primaryDomain"``\> & \{ `project`: `Pick`\<`Project`, ``"id"``\>  }

#### Defined in

[src/clients/privateGateway.ts:26](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/privateGateway.ts#L26)

___

### Project

Ƭ **Project**: `Omit`\<`ProjectWithRelations`, ``"currentUserMembership"`` \| ``"memberships"`` \| ``"membershipsPaginated"``\>

#### Defined in

[src/clients/projects.ts:26](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/projects.ts#L26)

___

### Site

Ƭ **Site**: `Pick`\<`SiteWithRelations`, ``"id"`` \| ``"name"`` \| ``"slug"``\> & \{ `deployments`: [`Deployment`](README.md#deployment)[] ; `domains`: `Pick`\<`SiteWithRelations`[``"domains"``][`number`], ``"id"`` \| ``"hostname"``\>[] ; `ipnsRecords`: `Pick`\<`SiteWithRelations`[``"ipnsRecords"``][`number`], ``"id"``\>[] ; `primaryDomain?`: `Pick`\<`DomainWithRelations`, ``"id"`` \| ``"hostname"``\> ; `zones`: `Pick`\<`SiteWithRelations`[``"zones"``][`number`], ``"id"`` \| ``"status"``\>[]  }

#### Defined in

[src/clients/sites.ts:27](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/sites.ts#L27)

___

### StoragePin

Ƭ **StoragePin**: `Pick`\<`Pin`, ``"cid"`` \| ``"filename"`` \| ``"extension"`` \| ``"arweavePin"``\> & \{ `arweaveId?`: `string` ; `filecoinDealIds?`: `string`  }

#### Defined in

[src/clients/storage.ts:36](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/storage.ts#L36)

___

### Subscription

Ƭ **Subscription**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `basePricePerSeat` | `number` |
| `cancelAt?` | `number` |
| `createdAt` | `number` |
| `currentPeriodEnd` | `number` |
| `currentPeriodStart` | `number` |
| `id` | `string` |
| `plan` | ``"FREE"`` \| ``"STARTER"`` \| ``"PRO"`` \| ``"ENTERPRISE"`` |
| `seats` | `number` |
| `status` | ``"ACTIVE"`` \| ``"CANCELED"`` \| ``"PAST_DUE"`` \| ``"UNPAID"`` \| ``"TRIALING"`` |
| `trialEnd?` | `number` |
| `usageMarkup` | `number` |

#### Defined in

[src/clients/billing.ts:38](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L38)

___

### UploadContentOptions

Ƭ **UploadContentOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `functionName?` | `string` |
| `siteId?` | `string` |

#### Defined in

[src/clients/uploadProxy.ts:60](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/uploadProxy.ts#L60)

___

### UploadPinResponse

Ƭ **UploadPinResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `duplicate` | `boolean` |
| `pin` | `Pick`\<`Pin`, ``"cid"`` \| ``"size"``\> |

#### Defined in

[src/clients/uploadProxy.ts:65](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/uploadProxy.ts#L65)

___

### UploadProgress

Ƭ **UploadProgress**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `loadedSize` | `number` |
| `totalSize?` | `number` |

#### Defined in

[src/clients/uploadProxy.ts:36](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/uploadProxy.ts#L36)

___

### UsageMetric

Ƭ **UsageMetric**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `number` |
| `quantity` | `number` |

#### Defined in

[src/clients/billing.ts:91](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L91)

___

### UsageRecord

Ƭ **UsageRecord**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `number` |
| `createdAt` | `number` |
| `id` | `string` |
| `metricType` | ``"storage"`` \| ``"bandwidth"`` \| ``"compute"`` \| ``"requests"`` |
| `periodEnd` | `number` |
| `periodStart` | `number` |
| `quantity` | `number` |
| `recordedAt` | `number` |
| `unitPrice` | `number` |

#### Defined in

[src/clients/billing.ts:106](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L106)

___

### Zone

Ƭ **Zone**: `Pick`\<`ZoneWithRelations`, ``"id"`` \| ``"originUrl"`` \| ``"createdAt"`` \| ``"updatedAt"`` \| ``"type"`` \| ``"status"``\>

#### Defined in

[src/clients/domains.ts:53](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/domains.ts#L53)

## Functions

### createClient

▸ **createClient**(`options?`): [`Client`](interfaces/Client.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `ClientOptions` |

#### Returns

[`Client`](interfaces/Client.md)

#### Defined in

node_modules/.pnpm/@alternatefutures+utils-genql-client@0.2.0/node_modules/@alternatefutures/utils-genql-client/dist/index.ts:34
