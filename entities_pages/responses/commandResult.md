---
layout: page
title: CommandResult
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/commandresult
---

## CommandResult
Response from `order/cancelOrder` or `order/modifyOrder` operations.

#### Related
- [Command]({{site.baseurl}}/entity-system/index/Command)
- [CommandReport]({{site.baseurl}}/entity-system/index/CommandReport)
- [ExecutionReport]({{site.baseurl}}/entity-system/index/ExecutionReport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `failureReason` | `none`{: .label } | `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `failureText` | `none`{: .label } | string | Non-empty if the request passed at the HTTP level, but failed a check on the server.
| `commandId` | `none`{: .label } | number | Non-empty if the [Command]({{site.baseurl}}/entity-system/index/Command) succeeded.