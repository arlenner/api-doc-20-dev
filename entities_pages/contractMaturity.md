---
layout: page
title: ContractMaturity
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/contractmaturity
---

## ContractMaturity
Object that represents a contract's maturity information, including the expiration month and specific date, product ID, and whether or not this is the front-month contract.

#### Related
- [Contract]({{site.baseurl}}/entity-system/entity-index/contract)
- [ContractMargin]({{site.baseurl}}/entity-system/entity-index/contractmargin)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `productId` | `required`{: .label .label-red } | number, `int64` |
| `expirationMonth` | `required`{: .label .label-red } | number, [1..12] |
| `expirationDate` | `required`{: .label .label-red } | Date string |
| `firstIntentDate` | `none`{: .label } | Date string |
| `underlyingId` | `none`{: .label } | number, `int64` |
| `isFront` | `required`{: .label .label-red } | boolean | This may seem very useful at a glance for determining which contract to trade in an automated strategy, however this value will not change until the current front-month contract expires. Instead use the `/<entity>/suggest` operation.
