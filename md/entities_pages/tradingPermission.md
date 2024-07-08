---
layout: default
title: TradingPermission
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/tradingpermission
---

## TradingPermission
An object that represents a permission that has been granted from one [User]({{site.baseurl}}/entity-system/entity-index/user) to another to trade that user's [Account]({{site.baseurl}}/entity-system/entity-index/account).

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [`/user/requestTradingPermission`]({{site.baseurl}}/all-ops/user/requesttradingpermission)
- [`/user/acceptTradingPermission`]({{site.baseurl}}/all-ops/user/accepttradingpermission)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `userId` | `required`{: .label .label-red } | number, `int64` | [User]({{site.baseurl}}/entity-system/entity-index/user) to grant the TradingPermission.
| `accountId` | `required`{: .label .label-red } | number, `int64` | [Account]({{site.baseurl}}/entity-system/entity-index/account) entity owned by the caller for which to grant permission.
| `accountHolderContact` | `required`{: .label .label-red } | string <= 64 chars | Full name of the original [Account]({{site.baseurl}}/entity-system/entity-index/account) holder.
| `accountHolderEmail` | `required`{: .label .label-red } | string <= 64 chars | Email address of the original [Account]({{site.baseurl}}/entity-system/entity-index/account) holder.
| `ctaContact` | `required`{: .label .label-red } | string <= 64 chars | Full name of the user being granted permission.
| `ctaEmail` | `required`{: .label .label-red } | string <= 64 chars | Email address of the user being granted permission.
| `updated` | `none`{: .label } | Date string | 
| `approvedById` | `none`{: .label } | number, `int64` | ID of approving [User]({{site.baseurl}}/entity-system/entity-index/user). 