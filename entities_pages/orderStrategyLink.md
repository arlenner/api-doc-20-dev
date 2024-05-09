---
layout: page
title: OrderStrategyLink
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/orderstrategylink
---

## OrderStrategyLink

#### Related
- [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/OrderStrategy)
- [Order]({{site.baseurl}}/entity-system/entity-index/Order)
- [OrderStrategyType]({{site.baseurl}}/entity-system/entity-index/OrderStrategyType)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `orderStrategyId` | `required`{: .label .label-red } | number, `int64` | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/Order) entity.
| `label` | `required`{: .label .label-red } | string <= 64 chars | 