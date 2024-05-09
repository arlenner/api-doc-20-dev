---
layout: page
title: Order
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/order
---

## Order
Represents an Order to buy or sell a [Contract]({{site.baseurl}}/entity-system/entity-index/contract).

#### Related
- [Fill]({{site.baseurl}}/entity-system/entity-index/Fill)
- [FillPair]({{site.baseurl}}/entity-system/entity-index/FillPair)
- [Command]({{site.baseurl}}/entity-system/entity-index/Command)
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/CommandReport)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/ExecutionReport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Account]({{site.baseurl}}/entity-system/entity-index/account) entity which was used to place this order.
| `contractId` | `none`{: .label } | number, `int64` | ID of the related [Contract]({{site.baseurl}}/entity-system/entity-index/contract) entity.
| `spreadDefinitionId` | `none`{: .label } | number, `int64` | ID of the related [SpreadDefinition]({{site.baseurl}}/entity-system/entity-index/spreaddefinition) entity if applicable.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this order was created.
| `action` | `required`{: .label .label-red } | string enum, `"Buy"` `"Sell"` | 
| `ordStatus` | `required`{: .label .label-red } | string enum, `"Canceled"` `"Completed"` `"Expired"` `"Filled"` `"PendingCancel"` `"PendingNew"` `"PendingReplace"` `"Rejected"` `"Suspended"` `"Unknown"` `"Working"` | 
| `executionProviderId` | `none`{: .label } | number, `int64` | Execution environment ID (LIVE or Sim)
| `ocoId` | `none`{: .label } | number, `int64` | ID of related OCO Entry Order, if applicable.
| `parentId` | `none`{: .label } | number, `int64` | ID of related parent Order, if applicable.
| `linkedId` | `label`{: .label } | number, `int64` | ID of OCO Linked Order (order to be canceled on this order's [Fill]({{site.baseurl}}/entity-system/entity-index/Fill)), if applicable.
| `admin` | `required`{: .label .label-red } | boolean | `false` unless you are a Tradovate administrator or are a B2B partner. Will fail if your user does not have administrator status.