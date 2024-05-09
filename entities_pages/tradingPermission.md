---
layout: page
title: TradingPermission
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/tradingpermission
---

## TradingPermission
An object that represents a permission that has been granted from one [User]({{site.baseurl}}/entity-system/entity-index/User) to another to trade that user's [Account]({{site.baseurl}}/entity-system/entity-index/Account).

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/Account)
- [`/user/requestTradingPermission`]({{site.baseurl}}/all-ops/user/requestTradingPermission)
- [`/user/acceptTradingPermission`]({{site.baseurl}}/all-ops/user/acceptTradingPermission)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `userId` | `required`{: .label .label-red } | number, `int64` | [User]({{site.baseurl}}/entity-system/entity-index/User) to grant the TradingPermission.
| `accountId` | `required`{: .label .label-red } | number, `int64` | [Account]({{site.baseurl}}/entity-system/entity-index/Account) entity owned by the caller for which to grant permission.
| `accountHolderContact` | `required`{: .label .label-red } | string <= 64 chars | Full name of the original [Account]({{site.baseurl}}/entity-system/entity-index/Account) holder.
| `accountHolderEmail` | `required`{: .label .label-red } | string <= 64 chars | Email address of the original [Account]({{site.baseurl}}/entity-system/entity-index/Account) holder.
| `ctaContact` | `required`{: .label .label-red } | string <= 64 chars | Full name of the user being granted permission.
| `ctaEmail` | `required`{: .label .label-red } | string <= 64 chars | Email address of the user being granted permission.
| `updated` | `none`{: .label } | Date string | 
| `approvedById` | `none`{: .label } | number, `int64` | ID of approving [User]({{site.baseurl}}/entity-system/entity-index/User). 