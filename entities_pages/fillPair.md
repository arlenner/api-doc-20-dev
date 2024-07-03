---
layout: default
title: FillPair
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/fillpair
---

## FillPair
An entity that represents the pair of [Fill]({{site.baseurl}}/entity-system/entity-index/fill)s that opened and ultimately close an [Order]({{site.baseurl}}/entity-system/entity-index/order).

#### Related
- [Fill]({{site.baseurl}}/entity-system/entity-index/fill)
- [Order]({{site.baseurl}}/entity-system/entity-index/order)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `positionId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Position]({{site.baseurl}}/entity-system/entity-index/position) entity 
| `buyFillId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity that had the `"Buy"` action.
| `sellFillId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity that had the `"Sell"` action.
| `qty` | `required`{: .label .label-red } | number, `int32` | The quantity of contracts opened and closed by this FillPair.
| `buyPrice` | `required`{: .label .label-red } | number, double | Price of the [Order]({{site.baseurl}}/entity-system/entity-index/order) with the `"Buy"` action.
| `sellPrice` | `required`{: .label .label-red } | number, double | Price of the [Order]({{site.baseurl}}/entity-system/entity-index/order) with the `"Sell"` action.
| `active` | `required`{: .label .label-red } | boolean | 