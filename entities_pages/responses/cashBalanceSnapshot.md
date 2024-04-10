---
layout: page
title: CashBalanceSnapshot
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/cashbalancesnapshot
---

## CashBalanceSnapshot
A snapshot of an [Account]({{site.baseurl}}/entity-system/index/Account)'s balance at the time of the request.

#### Related

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Non-empty if the request failed.
| `totalCashValue` | `none`{: .label } | number | 
| `totalPnL` | `none`{: .label } | number | May not be included if none of the other `PnL` fields are filled.
| `initialMargin` | `none`{: .label } | number | 
| `maintenanceMargin` | `none`{: .label } | number | 
| `netLiq` | `none`{: .label } | number | 
| `openPnL` | `none`{: .label } | number | May not be included if you do not have an open position.
| `realizedPnL` | `none`{: .label } | number | May not be included if you have not opened and closed a trade during the session.
| `weekRealizedPnL` | `none`{: .label } | number | May not be included if you have not opened and closed a trade yet this week.