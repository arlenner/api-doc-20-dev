---
layout: page
title: AccountRiskStatus
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/accountriskstatus
---

## AccountRiskStatus
This entity represents the current Risk Status of an account. This entity can be useful to help you determine if an account is in a iquidation only state.

#### Related
- [AccountPositionLimit]({{site.baseurl}}/entity-system/index/accountpositionlimit)
- [AccountRiskParameter]({{site.baseurl}}/entity-system/index/accountriskparameter)
- [Account]({{site.baseurl}}/entity-system/index/account)

### Definition

| Property | Tags | Type | Remarks
|:----|:---|:---|:---
| `id` | `none`{: .label } | number, `int64` |
| `adminAction` | `none`{: .label } | `"AgreedOnLiqOnlyModeByAutoLiq"`, `"AgreedOnAutoLiquidationByAutoLiq"`, `"DisableAutoLiq"`, `"LiquidateImmediately"`, `"LiquidateOnlyModeImmediately"`, `"LockTradingImmediately"`, `"Normal"`, `"PlaceAutoLiqOnHold"` |
| `adminTimestamp` | `none`{: .label } | Date string |
| `liquidateOnly` | `none`{: .label } | Date string |
| `userTriggeredLiqOnly` | `none`{: .label } | boolean |