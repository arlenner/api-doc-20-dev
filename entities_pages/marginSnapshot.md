---
layout: default
title: MarginSnapshot
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/marginsnapshot
---

## MarginSnapshot
An object that represents a snapshot of a user's Margin status.

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [CashBalanceSnapshot]({{site.baseurl}}/entity-system/entity-index/cashbalancesnapshot)
- [ProductMargin]({{site.baseurl}}/entity-system/entity-index/productmargin)
- [ContractMargin]({{site.baseurl}}/entity-system/entity-index/contractmargin)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this snapshot was produced.
| `riskTimePeriodId` | `required`{: .label .label-red } | number, `int64` | 
| `initialMargin` | `required`{: .label .label-red } | number, double | 
| `maintenanceMargin` | `required`{: .label .label-red } | number, double | 
| `autoLiqLevel` | `none`{: .label } | number, double | 
| `liqOnlyLevel` | `none`{: .label } | number, double | 
| `totalUsedMargin` | `required`{: .label .label-red } | number, double | 
| `fullInitialMargin` | `required`{: .label .label-red } | number, double | 