[@alternatefutures/sdk](../README.md) / Client

# Interface: Client

## Table of contents

### Methods

- [mutation](Client.md#mutation)
- [query](Client.md#query)

## Methods

### mutation

▸ **mutation**\<`R`\>(`request`): `Promise`\<`FieldsSelection`\<`Mutation`, `R`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends `MutationGenqlSelection` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `R` & \{ `__name?`: `string`  } |

#### Returns

`Promise`\<`FieldsSelection`\<`Mutation`, `R`\>\>

#### Defined in

node_modules/.pnpm/@alternatefutures+utils-genql-client@0.2.0/node_modules/@alternatefutures/utils-genql-client/dist/index.ts:29

___

### query

▸ **query**\<`R`\>(`request`): `Promise`\<`FieldsSelection`\<`Query`, `R`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends `QueryGenqlSelection` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `R` & \{ `__name?`: `string`  } |

#### Returns

`Promise`\<`FieldsSelection`\<`Query`, `R`\>\>

#### Defined in

node_modules/.pnpm/@alternatefutures+utils-genql-client@0.2.0/node_modules/@alternatefutures/utils-genql-client/dist/index.ts:25
