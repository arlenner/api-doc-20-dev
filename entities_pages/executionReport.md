---
layout: page
title: ExecutionReport
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/executionreport
---

## ExecutionReport
An object that represents the Execution of a [Command]({{site.baseurl}}/entity-system/index/command).

#### Related
- [Command]({{site.baseurl}}/entity-system/index/command)
- [CommandReport]({{site.baseurl}}/entity-system/index/commandreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `commandId` | `required`{: .label .label-red } | number, `int64` | The entity ID of the associated [Command]({{site.baseurl}}/entity-system/index/command).
| `name` | `required`{: .label .label-red } | string <= 64 chars | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | The entity ID of the associated [Account]({{site.baseurl}}/entity-system/index/account).
| `contractId` | `required`{: .label .label-red } | number, `int64` | The entity ID of the associated [Contract]({{site.baseurl}}/entity-system/index/contract).
| `timestamp` | `required`{: .label .label-red } | Date string | 
| `tradeDate` | `none`{: .label } | [TradeDate]({{site.baseurl}}/entity-system/index/tradedate) | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | The entity ID of the associated [Order]({{site.baseurl}}/entity-system/index/order)
| `execType` | `required`{: .label .label-red } | `"Canceled"` `"Completed"` `"DoneForDay"` `"Expired"` `"New"` `"OrderStatus"` `"PendingCancel"` `"PendingNew"` `"PendingReplace"` `"Rejected"` `"Replaced"` `"Stopped"` `"Suspended"` `"Trade"` `"TradeCancel"` `"TradeCorrect"` | 
| `execRefId` | `none`{: .label } | string <= 64 chars | 
| `ordStatus` | `none`{: .label } | string enum, `"Canceled"` `"Completed"` `"Expired"` `"Filled"` `"PendingCancel"` `"PendingNew"` `"PendingReplace"` `"Rejected"` `"Suspended"` `"Unknown"` `"Working"` | Status of the associated [Order]({{site.baseurl}}/entity-system/index/order).
| `action` | `required`{: .label .label-red } | string enum, `"Buy"` `"Sell"` | 
| `cumQty` | `none`{: .label } | number, `int32` | 
| `avgPx` | `none`{: .label } | number, double | 
| `lastQty` | `none`{: .label } | number, `int32` | 
| `lastPx` | `none`{: .label } | number, double | 
| `rejectReason` | `none`{: .label } | string enum, `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `text` | `none`{: .label } | string <= 8192 chars | 
| `exchangeOrderId` | `none`{: .label } | string <= 64 chars | 