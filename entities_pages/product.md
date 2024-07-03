---
layout: default
title: Product
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/product
---

## Product

#### Related
- [Position]({{site.baseurl}}/entity-system/entity-index/position)
- [Contract]({{site.baseurl}}/entity-system/entity-index/contract)
- [ProductMargin]({{site.baseurl}}/entity-system/index/productmargin)

### Definition

| Property | Tag | Type | Remarks
|:---------|:----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `name` | `required`{: .label .label-red } | string <= 64 chars | The name of this product, ex. `ES`, `MES`, `NQ`, `MNQ`, etc. Product names do not include contract expiration codes (ES~M2~, NQ~Z4~, etc.).
| `currencyId` | `required`{: .label .label-red } | number, `int64` | The currency that backs this product. See [Currency]({{site.baseurl}}/entity-system/entity-index/currency).
| `productType` | `required`{: .label .label-red } | string enum, `"CommonStock"`, `"Continuous"`, `"Cryptocurrency"`, `"Futures"`, `"MarketInternals"`, `"Options"`, `"Spread"` | The type of tradable product that this Product entity represents.
| `description` | `required`{: .label .label-red } | string <= 8192 chars | A short description of what this product represents.
| `exchangeId` | `required`{: .label .label-red } | number, `int64` | The [Exchange]({{site.baseurl}}/entity-system/entity-index/exchange) entity that this product is listed as a member of.
| `contractGroupId` | `required`{: .label .label-red } | number, `int64` | 
| `riskDiscountContractGroupId` | `none`{: .label } | number, `int64` |
| `status` | `required`{: .label .label-red } | string enum, `"Inactive"`, `"Locked"`, `"ReadyForContracts"`, `"ReadyToTrade"`, `"Verified"` |
| `months` | `none`{: .label } | string <= 64 chars | The expiration-month codes available for this product. For example, ES uses `H`, `M`, `U`, and `Z` month codes.
| `isSecured` | `none`{: .label } | boolean | 
| `valuePerPoint` | `required`{: .label .label-red } | number, double | This is an important property of the Product entity for calculating real-time P&L, when combined with the `tickSize` field.
| `priceFormatType` | `required`{: .label .label-red } | string enum, `"Decimal"`, `"Fractional"` | 
| `priceFormat` | `required`{: .label .label-red } | number, `int32` | 
| `tickSize` | `required`{: .label .label-red } | number, double | Useful for calculating open P&L in real-time when combined with the `valuePerPoint` field.

### Notes
You can use the Product entity to help you calculate your real-time open P&L. You need the current price, your entry price or net held price, the value-per-point of the product in question, and the net position you are holding. You can determine the net held price by using the position's `netPrice` field. See [Position]({{site.baseurl}}/entity-system/entity-index/position) for more details. You can use this formula to calculate real-time open P&L for a single product:

```
(currentPrice - netHeldPrice) * valuePerPoint * position.netPos
```

To find the net P&L for all products you can simply run this operation for each product that you hold a position for and then sum the results.

