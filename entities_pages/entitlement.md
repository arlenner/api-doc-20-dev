---
layout: page
title: Entitlement
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/entitlement
---

## Entitlement
Object to represent an Entitlement. This is the basis of a [UserPlugin]({{site.baseurl}}/entity-system/entity-index/UserPlugin).

#### Related
- [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/EntitlementSubscription)
- [EntitlementSubscriptionResponse]({{site.baseurl}}/entity-system/entity-index/EntitlementSubscriptionResponse)
- [UserPlugin]({{site.baseurl}}/entity-system/entity-index/UserPlugin)
- [`/userPlugin/addEntitlementSubscription`]({{site.baseurl}}/all-ops/userPlugin/addEntitlementSubscription)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `title` | `required`{: .label .label-red } | string <= 64 chars | Display name for this Entitlement.
| `price` | `required`{: .label .label-red } | number, double | Price of the Entitlement.
| `startDate` | `label`{: .label } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/TradeDate) | Represents the date that this Entitlement was or will become available.
| `discontinuedDate` | `label`{: .label } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/TradeDate) | Represents the date that this Entitlement was discontinued and made no longer available. Requests to add a discontinued Entitlement will fail.
| `name` | `required`{: .label .label-red } | string <= 64 chars | Reference name for this Entitlement, used for things like the [`/find`]({{site.baseurl}}/all-ops/shared/find) operation.
| `duration` | `label`{: .label } | number, `int32` | Duration in `durationUnits` that a paid-period for the associated [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/EntitlementSubscription) should last.
| `durationUnits` | `label`{: .label } | string enum, `"Month"` `"Quarter"` `"Week"` `"Year"` | Unit by which `duration` should be measured.
| `autorenewal` | `label`{: .label } | boolean | `true` if the associated [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/EntitlementSubscription) should automatically renew.