---
layout: page
title: AccountRiskStatus
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/accountriskstatus
---

## AccountRiskStatus
This entity represents the current Risk Status of an account. This entity's `adminAction` field can tell you if the account has a locked status.

#### Related
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)

### Definition

| Property | Tags | Type | Remarks
|:----|:---|:---|:---
| `id` | `none`{: .label } | number, `int64` |
| `adminAction` | `none`{: .label } | `"AgreedOnLiqOnlyModeByAutoLiq"`, `"AgreedOnAutoLiquidationByAutoLiq"`, `"DisableAutoLiq"`, `"LiquidateImmediately"`, `"LiquidateOnlyModeImmediately"`, `"LockTradingImmediately"`, `"Normal"`, `"PlaceAutoLiqOnHold"` |
| `adminTimestamp` | `none`{: .label } | Date string |
| `liquidateOnly` | `none`{: .label } | Date string |
| `userTriggeredLiqOnly` | `none`{: .label } | boolean |