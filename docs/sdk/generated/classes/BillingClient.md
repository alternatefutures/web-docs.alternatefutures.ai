[@alternatefutures/sdk](../README.md) / BillingClient

# Class: BillingClient

## Table of contents

### Constructors

- [constructor](BillingClient.md#constructor)

### Methods

- [addPaymentMethod](BillingClient.md#addpaymentmethod)
- [cancelSubscription](BillingClient.md#cancelsubscription)
- [createConnectedAccount](BillingClient.md#createconnectedaccount)
- [createCryptoPayment](BillingClient.md#createcryptopayment)
- [createDashboardLink](BillingClient.md#createdashboardlink)
- [createOnboardingLink](BillingClient.md#createonboardinglink)
- [createSubscription](BillingClient.md#createsubscription)
- [createTransfer](BillingClient.md#createtransfer)
- [deleteConnectedAccount](BillingClient.md#deleteconnectedaccount)
- [generateInvoice](BillingClient.md#generateinvoice)
- [getActiveSubscription](BillingClient.md#getactivesubscription)
- [getConnectedAccount](BillingClient.md#getconnectedaccount)
- [getCurrentUsage](BillingClient.md#getcurrentusage)
- [getCustomer](BillingClient.md#getcustomer)
- [getInvoice](BillingClient.md#getinvoice)
- [getPlatformBalance](BillingClient.md#getplatformbalance)
- [getSubscriptionPlans](BillingClient.md#getsubscriptionplans)
- [getUsageHistory](BillingClient.md#getusagehistory)
- [listConnectedAccounts](BillingClient.md#listconnectedaccounts)
- [listInvoices](BillingClient.md#listinvoices)
- [listPaymentMethods](BillingClient.md#listpaymentmethods)
- [listPayments](BillingClient.md#listpayments)
- [listSubscriptions](BillingClient.md#listsubscriptions)
- [listTransfers](BillingClient.md#listtransfers)
- [processPayment](BillingClient.md#processpayment)
- [recordCryptoPayment](BillingClient.md#recordcryptopayment)
- [recordUsage](BillingClient.md#recordusage)
- [removePaymentMethod](BillingClient.md#removepaymentmethod)
- [setDefaultPaymentMethod](BillingClient.md#setdefaultpaymentmethod)
- [updateCustomer](BillingClient.md#updatecustomer)
- [updateSubscriptionSeats](BillingClient.md#updatesubscriptionseats)

## Constructors

### constructor

• **new BillingClient**(`options`): [`BillingClient`](BillingClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `BillingClientOptions` |

#### Returns

[`BillingClient`](BillingClient.md)

#### Defined in

[src/clients/billing.ts:163](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L163)

## Methods

### addPaymentMethod

▸ **addPaymentMethod**(`input`): `Promise`\<[`PaymentMethod`](../README.md#paymentmethod)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.blockchain?` | `string` |
| `input.paymentMethodId?` | `string` |
| `input.provider?` | ``"stripe"`` \| ``"stax"`` |
| `input.setDefault?` | `boolean` |
| `input.walletAddress?` | `string` |

#### Returns

`Promise`\<[`PaymentMethod`](../README.md#paymentmethod)\>

#### Defined in

[src/clients/billing.ts:214](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L214)

___

### cancelSubscription

▸ **cancelSubscription**(`«destructured»`): `Promise`\<[`Subscription`](../README.md#subscription)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | `undefined` |
| › `id` | `string` | `undefined` |
| › `immediately?` | `boolean` | `false` |

#### Returns

`Promise`\<[`Subscription`](../README.md#subscription)\>

#### Defined in

[src/clients/billing.ts:291](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L291)

___

### createConnectedAccount

▸ **createConnectedAccount**(`input`): `Promise`\<`ConnectedAccount`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.accountType?` | ``"standard"`` \| ``"express"`` \| ``"custom"`` |
| `input.businessName?` | `string` |
| `input.country?` | `string` |
| `input.email` | `string` |
| `input.provider?` | ``"stripe"`` \| ``"stax"`` |

#### Returns

`Promise`\<`ConnectedAccount`\>

#### Defined in

[src/clients/billing.ts:444](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L444)

___

### createCryptoPayment

▸ **createCryptoPayment**(`«destructured»`): `Promise`\<`CryptoPaymentRequest`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | `undefined` |
| › `chainId?` | `number` | `1` |
| › `invoiceId` | `string` | `undefined` |
| › `tokenSymbol?` | `string` | `'usdc'` |

#### Returns

`Promise`\<`CryptoPaymentRequest`\>

#### Defined in

[src/clients/billing.ts:405](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L405)

___

### createDashboardLink

▸ **createDashboardLink**(`accountId`): `Promise`\<\{ `url`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountId` | `string` |

#### Returns

`Promise`\<\{ `url`: `string`  }\>

#### Defined in

[src/clients/billing.ts:482](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L482)

___

### createOnboardingLink

▸ **createOnboardingLink**(`«destructured»`): `Promise`\<\{ `expiresAt`: `number` ; `url`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `accountId` | `string` |
| › `refreshUrl` | `string` |
| › `returnUrl` | `string` |

#### Returns

`Promise`\<\{ `expiresAt`: `number` ; `url`: `string`  }\>

#### Defined in

[src/clients/billing.ts:463](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L463)

___

### createSubscription

▸ **createSubscription**(`input`): `Promise`\<[`Subscription`](../README.md#subscription)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.paymentMethodId?` | `string` |
| `input.planId` | `string` |
| `input.seats?` | `number` |

#### Returns

`Promise`\<[`Subscription`](../README.md#subscription)\>

#### Defined in

[src/clients/billing.ts:279](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L279)

___

### createTransfer

▸ **createTransfer**(`input`): `Promise`\<`Transfer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.amount` | `number` |
| `input.connectedAccountId` | `string` |
| `input.currency?` | `string` |
| `input.description?` | `string` |
| `input.sourcePaymentId?` | `string` |

#### Returns

`Promise`\<`Transfer`\>

#### Defined in

[src/clients/billing.ts:505](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L505)

___

### deleteConnectedAccount

▸ **deleteConnectedAccount**(`id`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/clients/billing.ts:489](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L489)

___

### generateInvoice

▸ **generateInvoice**(): `Promise`\<[`Invoice`](../README.md#invoice)\>

#### Returns

`Promise`\<[`Invoice`](../README.md#invoice)\>

#### Defined in

[src/clients/billing.ts:343](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L343)

___

### getActiveSubscription

▸ **getActiveSubscription**(): `Promise`\<``null`` \| [`Subscription`](../README.md#subscription)\>

#### Returns

`Promise`\<``null`` \| [`Subscription`](../README.md#subscription)\>

#### Defined in

[src/clients/billing.ts:269](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L269)

___

### getConnectedAccount

▸ **getConnectedAccount**(`id`): `Promise`\<``null`` \| `ConnectedAccount`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<``null`` \| `ConnectedAccount`\>

#### Defined in

[src/clients/billing.ts:458](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L458)

___

### getCurrentUsage

▸ **getCurrentUsage**(): `Promise`\<``null`` \| [`CurrentUsage`](../README.md#currentusage)\>

#### Returns

`Promise`\<``null`` \| [`CurrentUsage`](../README.md#currentusage)\>

#### Defined in

[src/clients/billing.ts:354](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L354)

___

### getCustomer

▸ **getCustomer**(): `Promise`\<``null`` \| [`Customer`](../README.md#customer)\>

#### Returns

`Promise`\<``null`` \| [`Customer`](../README.md#customer)\>

#### Defined in

[src/clients/billing.ts:192](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L192)

___

### getInvoice

▸ **getInvoice**(`«destructured»`): `Promise`\<``null`` \| [`Invoice`](../README.md#invoice)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `id` | `string` |

#### Returns

`Promise`\<``null`` \| [`Invoice`](../README.md#invoice)\>

#### Defined in

[src/clients/billing.ts:338](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L338)

___

### getPlatformBalance

▸ **getPlatformBalance**(): `Promise`\<\{ `available`: `number` ; `currency`: `string` ; `pending`: `number`  }[]\>

#### Returns

`Promise`\<\{ `available`: `number` ; `currency`: `string` ; `pending`: `number`  }[]\>

#### Defined in

[src/clients/billing.ts:519](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L519)

___

### getSubscriptionPlans

▸ **getSubscriptionPlans**(): `Promise`\<`SubscriptionPlan`[]\>

#### Returns

`Promise`\<`SubscriptionPlan`[]\>

#### Defined in

[src/clients/billing.ts:274](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L274)

___

### getUsageHistory

▸ **getUsageHistory**(`limit?`): `Promise`\<[`UsageRecord`](../README.md#usagerecord)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `100` |

#### Returns

`Promise`\<[`UsageRecord`](../README.md#usagerecord)[]\>

#### Defined in

[src/clients/billing.ts:359](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L359)

___

### listConnectedAccounts

▸ **listConnectedAccounts**(): `Promise`\<`ConnectedAccount`[]\>

#### Returns

`Promise`\<`ConnectedAccount`[]\>

#### Defined in

[src/clients/billing.ts:439](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L439)

___

### listInvoices

▸ **listInvoices**(`«destructured»?`): `Promise`\<[`Invoice`](../README.md#invoice)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | `{}` |
| › `limit?` | `number` | `50` |
| › `status?` | `string` | `undefined` |

#### Returns

`Promise`\<[`Invoice`](../README.md#invoice)[]\>

#### Defined in

[src/clients/billing.ts:323](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L323)

___

### listPaymentMethods

▸ **listPaymentMethods**(): `Promise`\<[`PaymentMethod`](../README.md#paymentmethod)[]\>

#### Returns

`Promise`\<[`PaymentMethod`](../README.md#paymentmethod)[]\>

#### Defined in

[src/clients/billing.ts:209](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L209)

___

### listPayments

▸ **listPayments**(`limit?`): `Promise`\<[`Payment`](../README.md#payment)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `50` |

#### Returns

`Promise`\<[`Payment`](../README.md#payment)[]\>

#### Defined in

[src/clients/billing.ts:380](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L380)

___

### listSubscriptions

▸ **listSubscriptions**(): `Promise`\<[`Subscription`](../README.md#subscription)[]\>

#### Returns

`Promise`\<[`Subscription`](../README.md#subscription)[]\>

#### Defined in

[src/clients/billing.ts:264](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L264)

___

### listTransfers

▸ **listTransfers**(`connectedAccountId?`, `limit?`): `Promise`\<`Transfer`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `connectedAccountId?` | `string` | `undefined` |
| `limit` | `number` | `50` |

#### Returns

`Promise`\<`Transfer`[]\>

#### Defined in

[src/clients/billing.ts:496](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L496)

___

### processPayment

▸ **processPayment**(`«destructured»`): `Promise`\<[`Payment`](../README.md#payment) & \{ `clientSecret?`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `amount?` | `number` |
| › `invoiceId` | `string` |
| › `paymentMethodId?` | `string` |

#### Returns

`Promise`\<[`Payment`](../README.md#payment) & \{ `clientSecret?`: `string`  }\>

#### Defined in

[src/clients/billing.ts:385](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L385)

___

### recordCryptoPayment

▸ **recordCryptoPayment**(`input`): `Promise`\<[`Payment`](../README.md#payment)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.amount` | `number` |
| `input.blockchain` | `string` |
| `input.fromAddress` | `string` |
| `input.invoiceId` | `string` |
| `input.txHash` | `string` |

#### Returns

`Promise`\<[`Payment`](../README.md#payment)\>

#### Defined in

[src/clients/billing.ts:421](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L421)

___

### recordUsage

▸ **recordUsage**(`input`): `Promise`\<[`UsageRecord`](../README.md#usagerecord)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.metricType` | ``"storage"`` \| ``"bandwidth"`` \| ``"compute"`` \| ``"requests"`` |
| `input.quantity` | `number` |
| `input.timestamp?` | `number` |

#### Returns

`Promise`\<[`UsageRecord`](../README.md#usagerecord)\>

#### Defined in

[src/clients/billing.ts:364](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L364)

___

### removePaymentMethod

▸ **removePaymentMethod**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/clients/billing.ts:246](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L246)

___

### setDefaultPaymentMethod

▸ **setDefaultPaymentMethod**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/clients/billing.ts:253](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L253)

___

### updateCustomer

▸ **updateCustomer**(`data`): `Promise`\<[`Customer`](../README.md#customer)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.email?` | `string` |
| `data.name?` | `string` |

#### Returns

`Promise`\<[`Customer`](../README.md#customer)\>

#### Defined in

[src/clients/billing.ts:197](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L197)

___

### updateSubscriptionSeats

▸ **updateSubscriptionSeats**(`«destructured»`): `Promise`\<[`Subscription`](../README.md#subscription)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `id` | `string` |
| › `seats` | `number` |

#### Returns

`Promise`\<[`Subscription`](../README.md#subscription)\>

#### Defined in

[src/clients/billing.ts:305](https://github.com/alternatefutures/package-cloud-sdk/blob/273a62c96e00913c611937c569246427892cbf80/src/clients/billing.ts#L305)
