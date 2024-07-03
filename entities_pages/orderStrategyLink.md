---
layout: default
title: OrderStrategyLink
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/orderstrategylink
---

## OrderStrategyLink

#### Related
- [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/orderstrategy)
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [OrderStrategyType]({{site.baseurl}}/entity-system/entity-index/orderstrategytype)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `orderStrategyId` | `required`{: .label .label-red } | number, `int64` | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity.
| `label` | `required`{: .label .label-red } | string <= 64 chars | 