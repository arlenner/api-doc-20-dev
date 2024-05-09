---
layout: page
title: CommandReport
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/commandreport
---

## CommandReport
Once a [Command]({{site.baseurl}}/entity-system/entity-index/command) has been sent by a client, the server begins processing that request. As the command is processed, its status is updated. The CommandReport entity can be used as a mechanism for digesting those updates.

#### Related
- [Command]({{site.baseurl}}/entity-system/entity-index/command)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `commandId` | `required`{: .label .label-red } | number, `int64` | ID of the associated [Command]({{site.baseurl}}/entity-system/entity-index/command) entity.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this CommandReport was generated.
| `commandStatus` | `required`{: .label .label-red } | string enum, `"AtExecution"` `"ExecutionRejected"` `"ExecutionStopped"` `"ExecutionSuspended"` `"OnHold"` `"Pending"` `"PendingExecution"` `"Replaced"` `"RiskPassed"` `"RiskRejected"` | Use this status to determine the status of a Command. 
| `rejectReason` | `none`{: .label } | string enum, `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | Can help to determine why a Command failed.
| `text` | `none`{: .label } | string <= 8192 chars | Optional descriptive text associated with the Command.
| `ordStatus` | `none`{: .label } | string enum, `"Canceled"` `"Completed"` `"Expired"` `"Filled"` `"PendingCancel"` `"PendingNew"` `"PendingReplace"` `"Rejected"` `"Suspended"` `"Unknown"` `"Working"` | You can use this field to determine the status of a related order.
