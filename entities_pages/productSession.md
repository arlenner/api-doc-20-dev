---
layout: page
title: ProductSession
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/productsession
---

## ProductSession
Represents the weekly open/close schedule for this product *not* considering holidays.

#### Related
- [Product]({{site.baseurl}}/entity-system/entity-index/Product)
- [ProductMargin]({{site.baseurl}}/entity-system/entity-index/ProductMargin)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `openTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/TradeTime) | 
| `startTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/TradeTime) | 
| `stopTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/TradeTime) | 
| `closeTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/TradeTime) | 
| `sundayOpenTime` | `label`{: .label } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/TradeTime) | 