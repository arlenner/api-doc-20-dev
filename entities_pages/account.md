---
layout: page
title: Account
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/account
---

## Account
This entity represents a source of equity. A User may have ownership of multiple Account entities.

#### Related
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog)
- [User]({{site.baseurl}}/entity-system/entity-index/user)
- [MarginSnapshot]({{site.baseurl}}/entity-system/entity-index/marginsnapshot)
- [AccountRiskStatus]({{site.baseurl}}/entity-system/entity-index/accountriskstatus)
- [UserAccountAutoLiq]({{site.baseurl}}/entity-system/entity-index/useraccountautoliq)
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/Useraccountpositionlimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/UserAccountRiskParameter)

### Definition

| Property         |Tags      | Type      | Remarks
|:----------------|:------|:--------------------------------------------------|:----------------------------------------------------
| `id` |     `none`{: .label }              | number, `int64`                                            | Account Entity ID. 
| `name` |`required`{: .label .label-red}       | string, <= 64 chars                                           | Always all-caps with optional underscores and trailing digits.
| `userId` | `required`{: .label .label-red}      | number, `int64`                                            | Related User Entity ID.
| `accountType` | `required`{: .label .label-red} | string enum, `"Customer"`, `"Giveup"`, `"House"`, `"Omnibus"`, `"Wash"`  | 
| `active`  | `required`{: .label .label-red}  | boolean | 
| `clearingHouseId` | `required`{: .label .label-red}  | number, `int64` | 
| `riskCategoryId` | `required`{: .label .label-red}  | number, `int64` | The related Risk Category. Typical retail users won't use this.
| `autoLiqProfileId` | `required`{: .label .label-red}  | number, `int64` | The [UserAccountAutoLiq]({{site.baseurl}}/entity-system/entity-index/UserAccountAutoLiq) (Auto Liquidation profile) associated with this account. The Auto Liq profile actually shares the same entity ID as the account since they have a 1:1 relationship.
| `marginAccountType` | `required`{: .label .label-red}  | string enum, `"Hedger"`, `"Speculator"` | 
| `legalStatus` | `required`{: .label .label-red}  | string enum, `"Corporation"`, `"GP"`, `"IRA"`, `"Individual"`, `"LLC"`, `"LLP"`, `"LP"`, `"Trust"`, `"Joint"` | Typically, retail users are `"Individual"`
| `timestamp` |`required`{: .label .label-red}  | Date string | 
| `readonly` | `none`{: .label } | boolean |
