---
layout: page
title: RestrainedOrderVersion
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/restrainedorderversion
---

## RestrainedOrderVersion

#### Related
- [Order]({{site.baseurl}}/entity-system/entity-index/Order)
- [OrderVersion]({{site.baseurl}}/entity-system/entity-index/OrderVersion)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `action` | `required`{: .label .label-red } | string enum, `"Buy"` `"Sell"` | 
| `clOrdId` | `none`{: .label } | string <= 64 chars | 
| `orderType` | `required`{: .label .label-red } | string enum, `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | 
| `price` | `none`{: .label } | number, double | 
| `stopPrice` | `none`{: .label } | number, double | Required for the `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number, `int32` | 
| `pegDifference` | `none`{: .label } | number, double | 
| `timeInForce` | `none`{: .label } | string enum, `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | 
| `expireTime` | `none`{: .label } | Date string | Required for `"GTD"` type time-in-force property.
| `text` | `none`{: .label } | string <= 64 chars | 
