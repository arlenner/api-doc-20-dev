---
layout: page
title: EntitlementSubscription
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/entitlementsubscription
---

## EntitlementSubscription

#### Related
- [Entitlement]({{site.baseurl}}/entity-system/entity-index/Entitlement)
- [EntitlementSubscriptionResponse]({{site.baseurl}}/entity-system/entity-index/EntitlementSubscriptionResponse)
- [`/userPlugin/addEntitlementSubscription`]({{site.baseurl}}/all-ops/userPlugin/addEntitlementSubscription)


### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `userId` | `required`{: .label .label-red } | number, `int64` | 
| `timestamp` | `required`{: .label .label-red } | Date string | Creation timestamp.
| `planPrice` | `required`{: .label .label-red } | number, double | 
| `creditCardTransactionId` | `label`{: .label } | number, `int64` | Non-null if a credit card was used to purchase this entitlement.
| `cashBalanceLogId` | `label`{: .label } | number, `int64` | Non-null if a Tradovate account was used to purchase this entitlement.
| `creditCardId` | `label`{: .label } | number, `int64` | Non-null if a credit card was used to purchase this entitlement. 
| `accountId` | `label`{: .label } | number, `int64` | Non-null if a Tradovate account was used to purchase this entitlement.
| `pluginName` | `required`{: .label .label-red } | string <= 64 chars | Name of the [UserPlugin]({{site.baseurl}}/entity-system/entity-index/UserPlugin) that this entitlement grants.
| `approval` | `required`{: .label .label-red } | boolean | `true` when the entitlement is active.
| `entitlementId` | `label`{: .label } | number, `int64` | [Entitlement]({{site.baseurl}}/entity-system/entity-index/Entitlement)
| `startDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/TradeDate) | Purchase date as a [TradeDate]({{site.baseurl}}/entity-system/entity-index/TradeDate) object.
| `expirationDate` | `label`{: .label } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/TradeDate) | Expiration date as a [TradeDate]({{site.baseurl}}/entity-system/entity-index/TradeDate) object. Null implies no expiration.
| `paidAmount` | `required`{: .label .label-red } | number, double | Paid price for this entitlement.
| `autorenewal` | `label`{: .label } | boolean | `true` if this entitlement subscription automatically renews.
| `planCategories` | `label`{: .label } | string <= 8192 chars | `;` delimited string of plans that are allowed to purchase this entitlement.