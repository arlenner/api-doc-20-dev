---
layout: default
title: Position
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/position
---

## Position
An entity that is used to describe a Position held over a certain [Contract]({{site.baseurl}}/entity-system/entity-index/contract) for a given [Account]({{site.baseurl}}/entity-system/entity-index/account).

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [Contract]({{site.baseurl}}/entity-system/entity-index/contract)
- [Fill]({{site.baseurl}}/entity-system/entity-index/fill)
- [FillPair]({{site.baseurl}}/entity-system/entity-index/fillpair)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Account]({{site.baseurl}}/entity-system/entity-index/account) entity for which this Position is held.
| `contractId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Contract]({{site.baseurl}}/entity-system/entity-index/contract) entity that this Position was taken for.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this Position was created.
| `tradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | Trading Session Date on which this Position was created.
| `netPos` | `required`{: .label .label-red } | number, `int32` | The net position or number of instances you hold of the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract).
| `netPrice` | `none`{: .label } | number, double | The total combined price that was paid for the [Contract]({{site.baseurl}}/entity-system/entity-index/contract) instances that make up this Position.
| `bought` | `required`{: .label .label-red } | number, `int32` | The number of times you placed Buy orders for the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract) during this Trading Session that accounted for this Position.
| `boughtValue` | `required`{: .label .label-red } | number, double | The combined value of all of the Buy orders you placed for the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract) over the course of this Trading Session.
| `sold` | `required`{: .label .label-red } | number, `int32` | The number of times you placed Sell orders for the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract) during this Trading Session that accounted for this Position.
| `soldValue` | `required`{: .label .label-red } | number, double | The combined value of all the Sell orders you placed for the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract) over the course of this Trading Session.
| `prevPos` | `required`{: .label .label-red } | number, `int32` | Position previously held during this Trading Week.
| `prevPrice` | `none`{: .label } | number, double | Last known price for your previously held Position.