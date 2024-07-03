---
layout: default
title: CashBalanceLog
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/cashbalancelog
---

## CashBalanceLog
Represents a transactional change in an [Account]({{site.basurl}}/entity-system/entity-index/account)'s [CashBalance]({{site.basurl}}/entity-system/entity-index/cashbalance).

#### Related
- [Account]({{site.basurl}}/entity-system/entity-index/account)
- [CashBalance]({{site.basurl}}/entity-system/entity-index/cashbalance)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `accountId` | `required`{: .label .label-red } | number, `int64` | ID of the associated [Account]({{site.baseurl}}/entity-system/entity-index/account) entity.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this log was generated.
| `tradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) |
| `currencyId` | `required`{: .label .label-red } | number, `int64` |
| `amount` | `required`{: .label .label-red } | number, double | The decimal amount in [Currency]({{site.baseurl}}/entity-system/entity-index/currency) of type `currencyId` that the associated [Account]({{site.baseurl}}/entity-system/entity-index/account) is holding.
| `realizedPnL` | `none`{: .label } | number, double | Realized profits & losses for the current session at the time this log was generated. Resets daily between 5-6PM EST
| `weekRealizedPnL` | `none`{: .label } | number, double | Realized profits & losses for the trading week at the time this log was generated. Resets Sunday 6PM EST.
| `cashChangeType` | `required`{: .label .label-red } | string enum, `"AutomaticReconciliation"` `"BrokerageFee"` `"CancelledPairedTrade"` `"ClearingFee"` `"Commission"` `"DeskFee"` `"EntitlementSubscription"` `"ExchangeFee"` `"FundTransaction"` `"FundTransactionFee"` `"IPFee"` `"LiquidationFee"` `"ManualAdjustment"` `"MarketDataSubscription"` `"NewSession"` `"NfaFee"` `"OptionsTrade"` `"OrderRoutingFee"` `"TradePaired"` `"TradovateSubscription"` | The type of transaction or fee that this log represents or was generated for.
| `fillPairId` | `none`{: .label } | number, `int64` | If this log was generated as the result of a [Fill]({{site.baseurl}}/entity-system/entity-index/fill) being paired (position closing) this field will be present and its value will be equal to the ID of the related [FillPair]({{site.baseurl}}/entity-system/entity-index/fillpair) entity. 
| `fillId` | `none`{: .label } | number, `int64` | If this log was generated as the result of a order being filled, this field will be present and its value will be equal to the ID of the related [Fill]({{site.baseurl}}/entity-system/entity-index/fill) entity.
| `fundTransactionId` | `none`{: .label } | number, `int64` |
| `delta` | `required`{: .label .label-red } | number, double | A decimal representing the change in [Currency]({{site.baseurl}}/entity-system/entity-index/currency) of type `currencyId` that this transaction or fee represents. Negative values represent negative change, and vice versa.
| `senderId` | `none`{: .label } | number, `int64` |
| `comment` | `label`{: .label } | string <= 64 chars | 