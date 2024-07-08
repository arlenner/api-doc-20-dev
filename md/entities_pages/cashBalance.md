---
layout: default
title: CashBalance
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/cashbalance
---

## CashBalance
An entity that represents a snapshot of an [Account]({{site.baseurl}}/entity-system/entity-index/account)'s current balance, daily realized profits/losses and weekly realized profits and losses.

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog) 

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:--------------------
| `id` | `none`{: .label } | number, `int64` | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | The account associated with this CashBalance entity.
| `timestamp` | `required`{: .label .label-red } | Date string |
| `tradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | 
| `currencyId` | `required`{: .label .label-red } | number, `int64` |
| `amount` | `required`{: .label .label-red } | number, double | The value in currency of type `currencyId` represented by this CashBalance entity.
| `realizedPnL` | `none`{: .label } | number, double | The realized P&L for the current session, resets between session close and open.
| `weekRealizedPnL` | `none`{: .label} | number, double | The realized P&L for the week resetting at week open (for ES and similar, Sunday 6PM - Friday 5PM).