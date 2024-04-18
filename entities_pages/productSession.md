---
layout: page
title: ProductSession
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/productsession
---

## ProductSession
Represents the weekly open/close schedule for this product *not* considering holidays.

#### Related
- [Product]({{site.baseurl}}/entity-system/index/Product)
- [ProductMargin]({{site.baseurl}}/entity-system/index/ProductMargin)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `openTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/index/TradeTime) | 
| `startTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/index/TradeTime) | 
| `stopTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/index/TradeTime) | 
| `closeTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/index/TradeTime) | 
| `sundayOpenTime` | `label`{: .label } | [TradeTime]({{site.baseurl}}/entity-system/index/TradeTime) | 