---
layout: page
title: Fill
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/fill
---

## Fill
An entity that represents the Fill of an [Order]({{site.baseurl}}/entity-system/entity-index/order).

#### Related
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [FillPair]({{site.baseurl}}/entity-system/entity-index/fillpair)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity.
| `contractId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Contract]({{site.baseurl}}/entity-system/entity-index/contract) entity.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that the fill was created.
| `tradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | The date of the trading session that this fill occurred.
| `action` | `required`{: .label .label-red } | `"Buy"` `"Sell"` | 
| `qty` | `required`{: .label .label-red } | number, `int32` | The number of contracts filled.
| `price` | `required`{: .label .label-red } | number, double | Price at which the order was filled.
| `active` | `required`{: .label .label-red } | boolean | 
| `finallyPaired` | `required`{: .label .label-red } | number, `int32` | 
