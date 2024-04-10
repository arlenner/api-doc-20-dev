---
layout: page
title: PlaceOsoResult
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/PlaceOsoResult
---

## PlaceOsoResult
Expected server response object when calling the `/order/placeOrder` operation.

#### Related
- [Order]({{site.baseurl}}/entity-system/index/Order)
- [Command]({{site.baseurl}}/entity-system/index/Command)
- [CommandReport]({{site.baseurl}}/entity-system/index/CommandReport)
- [ExecutionReport]({{site.baseurl}}/entity-system/index/ExecutionReport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `failureReason` | `none`{: .label } | `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `failureText` | `none`{: .label } | string | Non-empty if the request passed at the HTTP level, but failed a check on the server.
| `orderId` | `none`{: .label } | number | The entry [Order]({{site.baseurl}}/entity-system/index/Order) entity.
| `oso1Id` | `none`{: .label } | number | One of up to two linked [Order]({{site.baseurl}}/entity-system/index/Order) entities.
| `oso2Id` | `none`{: .label } | number | One of up to two linked [Order]({{site.baseurl}}/entity-system/index/Order) entities.