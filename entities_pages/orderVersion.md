---
layout: page
title: OrderVersion
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/orderversion
---

## OrderVersion

#### Related

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/index/Order) entity.
| `orderQty` | `required`{: .label .label-red } | number, `int32` | Number of [Contract]({{site.baseurl}}/entity-system/index/Contract)s traded by this Order request.
| `orderType` | `required`{: .label .label-red } | string enum, `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | 
| `price` | `none`{: .label } | number, double | 
| `stopPrice` | `none`{: .label } | number, double | Required for the `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number, `int32` | 
| `pegDifference` | `none`{: .label } | number, double | 
| `timeInForce` | `none`{: .label } | string enum, `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | 
| `expireTime` | `none`{: .label } | Date string | Required for `"GTD"` type time-in-force property.
| `text` | `none`{: .label } | string <= 64 chars | 

### Notes
Time-in-force explanations:
- `"Day"`: Good for the current trading session, but cancelled at the end of the day. Be careful not to rely on this for long running stops or take-profit points.
- `"FOK"`: Fill-or-kill, the entire order must execute as soon as it becomes available or it is cancelled. Good to avoid multiple purchase prices.
- `"GTC"`: Good 'til canceled, the order will not expire unless manually canceled by you.
- `"GTD"`: Good 'til date, the order will be working until `expireTime`.
- `"IOC"`: Immediate or cancel, this order type will fill as much as it can immediately and cancel the remainder. Good for making a move for the maximum available volume at a given price. Ex, say a trader wants to buy 500 contracts at exactly 4100 pts, but if 500 aren't available at 4100 that trader will take whatever is immediately available for fill by their broker and nothing more, canceling the remainder of the order.