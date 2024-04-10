---
layout: page
title: Currency
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/currency
---

## Currency

#### Related
- [CurrencyRate]({{site.baseurl}}/entity-system/index/CurrencyRate)
- [Account]({{site.baseurl}}/entity-system/index/account)
- [CashBalance]({{site.baseurl}}/entity-system/index/cashbalance)
- [CashBalanceLog]({{site.baseurl}}/entity-system/index/cashbalancelog)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `name` | `required`{: .label .label-red } | string <= 64 chars | 
| `symbol` | `label`{: .label } | string <= 64 chars | 