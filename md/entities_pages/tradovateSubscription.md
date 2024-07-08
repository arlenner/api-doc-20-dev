---
layout: default
title: TradovateSubscription
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/tradovatesubscription
---

## TradovateSubscription
An object that represents an instance of a subscription defined by a [TradovateSubscriptionPlan]({{site.baseurl}}/entity-system/entity-index/tradovatesubscriptionplan) entity.

#### Related
- [TradovateSubscriptionPlan]({{site.baseurl}}/entity-system/entity-index/tradovatesubscriptionplan)
- [`/user/addTradovateSubscription`]({{site.baseurl}}/all-ops/user/addtradovatesubscription)
- [`/user/cancelTradovateSubscription`]({{site.baseurl}}/all-ops/user/canceltradovatesubscription)


### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `userId` | `required`{: .label .label-red } | number, `int64` | ID of the [User]({{site.baseurl}}/entity-system/entity-index/user) holding this TradovateSubscription.
| `timestamp` | `required`{: .label .label-red } | string Date | JSON encoded Date string representing the creation time.
| `planPrice` | `required`{: .label .label-red } | number, `double` | Price value of the TradovateSubscription.
| `tradovateSubscriptionPlanId` | `required`{: .label .label-red } | number, `int64` | ID of the [TradovateSubscriptionPlan]({{site.baseurl}}/entity-system/entity-index/tradovatesubscriptionplan) entity associated with this TradovateSubscription instance.
| `startDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | The [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) date object representing the day, month, and year that this TradovateSubscription started.
| `expirationDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | The [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) date object representing the day, month, and year that this TradovateSubscription ended or will end.
| `paidAmount` | `required`{: .label .label-red } | number, `double` | Amount representing the value invested in the subscription's purchase. For Vendor subscriptions, this value will typically be 0. This is because of the way we measure monthly active users, and instead a statement is generated monthly.
| `creditCardTransactionId` | `none`{: .label } | number, `int64` | ID of the corresponding credit card transaction, if applicable.
| `cashBalanceLogId` | `none`{: .label } | number, `int64` | If a Tradovate account was used to make this purchase, a [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog) will be generated.
| `creditCardId` | `none`{: .label } | number, `int64` | If a credit card was used to make the purchase of this plan, its ID will be non-null.
| `accountId` | `none`{: .label } | number, `int64` | If a Tradovate account was used to make this purchase, the [Account]({{site.baseurl}}/entity-system/entity-index/account) entity's ID will be non-null.
| `cancelledRenewal` | `none`{: .label } | boolean | `true` when the auto-renewal has been cancelled for this subscription.
| `cancelReason` | `none`{: .label } | string | A provided text reason for the cancellation, provided when calling [`/user/cancelTradovateSubscription`]({{site.baseurl}}/all-ops/user/canceltradovatesubscription).
