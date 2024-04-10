---
layout: page
title: UserAccountRiskParameter
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/useraccountriskparameter
---

## UserAccountRiskParameter
This entity is used to parameterize an [UserAccountPositionLimit]({{site.baseurl}}/entity-system/index/useraccountpositionlimit).

#### Related
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/index/useraccountpositionlimit)
- [AccountRiskStatus]({{site.baseurl}}/entity-system/index/accountriskstatus)
- [Account]({{site.baseurl}}/entity-system/index/account)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | AccountRiskParameter entity ID.
| `contractId` | `none`{: .label } | number, `int64` | Used to declare that this risk parameter should be applied to the [Contract]({{site.baseurl}}/entity-system/index/contract) with this ID.
| `productId` | `none`{: .label } | number, `int64` | Used to declare that this risk parameter should be applied to the [Product]({{site.baseurl}}/entity-system/index/product) with this ID.
| `exchangeId` | `none`{: .label } | number, `int64` | Used to declare that this risk parameter should be applied to the [Exchange]({{site.baseurl}}/entity-system/index/exchange) with this ID.
| `productType` | `none`{: .label } | string enum, `"CommonStock"`, `"Continuous"`, `"Cryptocurrency"`, `"Futures"`, `"MarketInternals"`, `"Options"`, `"Spread"` | Overarching Product Type that is the target for this risk parameter. See [Product]({{site.baseurl}}/entity-system/index/product).
| `riskDiscountContractGroupId` | `none`{: .label } | number, `int64` | 
| `productVerificationStatus` | `none`{: .label } | string enum, `"Inactive"`, `"Locked"`, `"ReadyForContracts"`, `"ReadyToTrade"`, `"Verified"` |
| `contractGroupId` | `none`{: .label } | number, `int64` | 
| `maxOpeningOrderQty` | `none`{: .label } | number, `int32` | Controls the number of positions that can be opened at a time. For example a `maxOpeningOrderQty` of 1 would only allow the user place 1 order at a time, but up to whatever the `exposedLimit`, `longLimit` or `shortLimit` on the Position Limit entity is. For a user in the default risk category the `maxOpeningOrderQty` defaults to 100, allowing a user to place up to 100 orders in a single move if that user has margin eligibility to do so for the contract being traded.
| `maxClosingOrderQty` | `none`{: .label } | number, `int32` | Works just like `maxOpeningOrderQty`, but instead for placing orders to close positions. This value also defaults to 100 for default risk category users.
| `maxBackMonth` | `none`{: .label } | number, `int32` | Controls the maximum number of months prior to the expiration of a contract that you can trade that contract.
| `preExpirationDays` | `none`{: .label } | number, `int32` | Controls the maximum number of days before a contract's expiration before you must roll forward. Does not mandate that you roll forward but you will fail to pass risk settings when trying to place a trade in fewer than `preExpirationDays` days prior to the contract's expiration.
| `marginPercentage` | `none`{: .label } | number, double | The maximum percentage of your available margin that you may consume before failing risk on new orders.
| `marginDollarValue` | `none`{: .label } | number, double | The maximum currency value that you will be allowed to margin for trades, after which you will fail at risk on new orders.
| `hardLimit` | `none`{: .label } | boolean | 
| `userAccountPositionLimitId` | `required`{: .label .label-red } | number, `int64` | The ID of the associated [UserAccountPositionLimit]({{site.baseurl}}/entity-system/index/useraccountpositionlimit) entity for this Risk parameter. 