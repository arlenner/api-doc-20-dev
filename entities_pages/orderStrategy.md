---
layout: page
title: OrderStrategy
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/orderstrategy
---

## OrderStrategy

#### Related

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | ID of related [Account]({{site.baseurl}}/entity-system/entity-index/Account) entity.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this Order Strategy instance was generated.
| `contractId` | `required`{: .label .label-red } | number, `int64` | ID of related [Contract]({{site.baseurl}}/entity-system/entity-index/Contract) entity.
| `orderStrategyTypeId` | `required`{: .label .label-red } | number, `int64` | This is the ID of the [OrderStrategyType]({{site.baseurl}}/entity-system/entity-index/OrderStrategyType) entity that this OrderStrategy will utilize. To find the available Order Strategies it is advised that you use the User Sync operation's initial response, which contains an array of OrderStrategyTypes available to your user.
| `initiatorId` | `none`{: .label } | number, `int64` | Entity ID of the User that initiated this OrderStrategy.
| `action` | `required`{: .label .label-red } | string enum, `"Buy"` `"Sell"` | 
| `params` | `JSON`{: .label } | string <= 8192 chars | This should be a JSON string with the schema defined in the Notes section below.
| `uuid` | `none`{: .label } | string <= 64 chars | UUID to identify this OrderStrategy.
| `status` | `required`{: .label .label-red } | string enum, `"ActiveStrategy"` `"ExecutionFailed"` `"ExecutionFinished"` `"ExecutionInterrupted"` `"InactiveStrategy"` `"NotEnoughLiquidity"` `"StoppedByUser"` |
| `failureMessage` | `none`{: .label } | string <= 512 chars | 
| `senderId` | `none`{: .label } | number, `int64` | ID of the User who initialized the OrderStrategy.
| `customTag50` | `none`{: .label } | string <= 64 chars | Optional descriptive string fewer than 50 characters long (for certain UI display).
| `userSessionId` | `none`{: .label } | number, `int64` | 


### Notes
- The `params` string should be a JSON string. The schema of the original object should look like this before it is stringified or after it is decoded:
```js
//params field shape
{
    entryVersion: {
        orderQty: number,
        orderType: "Limit" | "MIT" | "Market" | "Stop" | "StopLimit" | "TrailingStop" | "TrailingStopLimit"
    },
    brackets: {
        qty: number,
        profitTarget?: number,
        stopLoss?: number,
        trailingStop?: boolean
    }[]
}
```