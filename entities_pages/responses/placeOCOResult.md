---
layout: page
title: PlaceOcoResult
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/placeocoresult
---

## PlaceOcoResult
Expected result object from a request to `/order/placeOCO`.

#### Related
- [Order]({{site.baseurl}}/entity-system/entity-index/Order)
- [Command]({{site.baseurl}}/entity-system/entity-index/Command)
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/CommandReport)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/ExecutionReport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `failureReason` | `none`{: .label } | `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `failureText` | `none`{: .label } | string | Non-empty if the request passed at the HTTP level, but failed a check on the server.
| `orderId` | `none`{: .label } | number | Linked [Order]({{site.baseurl}}/entity-system/entity-index/Order).
| `ocoId` | `none`{: .label } | number | `other` linked [Order]({{site.baseurl}}/entity-system/entity-index/Order).