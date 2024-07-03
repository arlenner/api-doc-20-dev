---
layout: default
title: Currency
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/currency
---

## Currency
Representation of a currency like USD, JPY or EUR.

#### Related
- [CurrencyRate]({{site.baseurl}}/entity-system/entity-index/currencyrate)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `name` | `required`{: .label .label-red } | string <= 64 chars | 
| `symbol` | `label`{: .label } | string <= 64 chars | 