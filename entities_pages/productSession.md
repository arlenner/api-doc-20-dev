---
layout: default
title: ProductSession
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/productsession
---

## ProductSession
Represents the weekly open/close schedule for this product *not* considering holidays.

#### Related
- [Product]({{site.baseurl}}/entity-system/entity-index/product)
- [ProductMargin]({{site.baseurl}}/entity-system/entity-index/productmargin)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `openTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 
| `startTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 
| `stopTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 
| `closeTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 
| `sundayOpenTime` | `label`{: .label } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 