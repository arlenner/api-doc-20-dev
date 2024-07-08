---
layout: default
title: UserAccountPositionLimit
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/useraccountpositionlimit
---

## UserAccountPositionLimit
An object that represents a Position Limit. This object can be parameterized by its sister-object, [AccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/accountriskparameter).

#### Related
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)
- [AccountRiskStatus]({{site.baseurl}}/entity-system/entity-index/accountriskstatus)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `contractId` | `none`{: .label } | number, `int64` | Entity ID of a [Contract]({{site.baseurl}}/entity-system/entity-index/contract) that this Position Limit should apply to.
| `productId` | `none`{: .label } | number, `int64` | Entity ID of a [Product]({{site.baseurl}}/entity-system/entity-index/product) that this Position Limit should apply to.
| `exchangeId` | `none`{: .label } | number, `int64` | Entity ID of an [Exchange]({{site.baseurl}}/entity-system/entity-index/exchange) that this Position Limit should apply to.
| `productType` | `none`{: .label } | string enum, `"CommonStock"`, `"Continuous"`, `"Cryptocurrency"`, `"Futures"`, `"MarketInternals"`, `"Options"`, `"Spread"` |
| `riskDiscountContractGroupId` | `none`{: .label } | number, `int64` |
| `productVerificationStatus` | `none`{: .label } | string enum, `"Inactive"`, `"Locked"`, `"ReadyForContracts"`, `"ReadyToTrade"`, `"Verified"` |
| `contractGroupId` | `none`{: .label } | number, `int64` |
| `active` | `required`{: .label .label-red } | boolean |
| `riskTimePeriodId` | `none`{: .label } | number, `int64` |
| `totalBy` | `required`{: .label .label-red } | string enum, `"Contract"`, `"ContractGroup"`, `"DiscountGroup"`, `"Exchange"`, `"Overall"`, `"Product"`, `"ProductType"` | The method used to total this Position Limit's `longLimit`, `shortLimit` or total `exposedLimit` fields. If using `"Contract"` for example, an `exposedLimit` of 10 would allow you to to hold a max position of +/- 10 contracts.
| `shortLimit` | `none`{: .label } | number, `int32` |
| `longLimit` | `none`{: .label } | number, `int32` |
| `exposedLimit` | `none`{: .label } | number, `int32` |
| `description` | `none`{: .label } | string <= 64 chars | Optional string to describe this Position Limit.
| `accountId` | `required`{: .label .label-red } | number, `int64`