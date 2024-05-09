---
layout: page
title: EntitlementSubscriptionResponse
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/entitlementsubscriptionresponse
---

## EntitlementSubscriptionResponse
Expected response from the [`/userPlugin/addEntitlementSubscription`]({{site.baseurl}}/all-ops/userPlugin/addEntitlementSubscription) operation.

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string <= 8192 chars | Non-empty if the request failed.
| `errorCode` | `none`{: .label } | Enum, `"ConflictWithExisting"` `"DowngradeNotAllowed"` `"IncompatibleCMEMarketDataSubscriptionPlans"` `"IncorrectPaymentMethod"` `"InsufficientFunds"` `"PaymentProviderError"` `"PlanDiscontinued"` `"SingleTrialOnly"` `"Success"` `"UnknownError"` |
| `entitlementSubscription` | `none`{: .label } | [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/entitlementSubscription) | 