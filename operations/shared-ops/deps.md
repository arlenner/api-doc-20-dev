---
layout: page
title: /deps
permalink: /all-ops/shared/deps
parent: Shared
grand_parent: API Operations
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: '/deps',
            dynamic: true,
            endpoint: '/deps',
            method: 'GET',
            query: {
                masterid: 0
            }
        });

        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/{entity}/deps`
This operation is used to look up entities of this type that are dependent on another 'master' entity.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/deps?masterid={item_id}

  OR

https://demo.tradovateapi.com/v1/{entity}/deps?masterid={item_id}
```

And for WebSocket requests:

```
<entity>/deps
<msg_id>
masterid=<entity_id>

```

Example Usage:
```js
async function entityDeps(entityType, masterid) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/deps?masterid=${masterid}`

    const config
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityDeps('contractMaturity', 814)
//=>
// [
//   {
//     "id": 37215,
//     "productId": 814,
//     "expirationMonth": 201712,
//     "expirationDate": "2017-12-15T22:29Z",
//     "archived": false,
//     "seqNo": 10,
//     "isFront": false
//   },
//   {
//     "id": 37417,
//     "productId": 814,
//     "expirationMonth": 201803,
//     "expirationDate": "2018-03-16T21:29Z",
//     "archived": false,
//     "seqNo": 11,
//     "isFront": false
//   },
//   //...
// ]
```

### Notes

| `masterid` Entity Type | Related Entity Types
|:-------|:---------------------
| *(The entity type that should be used for `masterid` parameter)* | *(The operation's returned type)*
| [`Account`]({{site.baseurl}}/entity-system/index/Account) | [`CashBalance`]({{site.baseurl}}/entity-system/index/CashBalance) [`CashBalanceLog`]({{site.baseurl}}/entity-system/index/CashBalanceLog) [`MarginSnapshot`]({{site.baseurl}}/entity-system/index/MarginSnapshot) [`AccountRiskStatus`]({{site.baseurl}}/entity-system/index/AccountRiskStatus) [`UserAccountAutoLiq`]({{site.baseurl}}/entity-system/index/UserAccountAutoLiq) [`Position`]({{site.baseurl}}/entity-system/index/Position) [`Order`]({{site.baseurl}}/entity-system/index/Order) [`OrderStrategy`]({{site.baseurl}}/entity-system/index/OrderStrategy) [`User`]({{site.baseurl}}/entity-system/index/User) [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/index/UserAccountPositionLimit) 
| [`Command`]({{site.baseurl}}/entity-system/index/Command) | [`CommandReport`]({{site.baseurl}}/entity-system/index/CommandReport) [`ExecutionReport`]({{site.baseurl}}/entity-system/index/ExecutionReport)
| [`Contract`]({{site.baseurl}}/entity-system/index/Contract) | [`ContractMaturity`]({{site.baseurl}}/entity-system/index/ContractMaturity)
| [`Product`]({{site.baseurl}}/entity-system/index/Product) | [`ProductMargin`]({{site.baseurl}}/entity-system/index/ProductMargin) [`ContractMaturity`]({{site.baseurl}}/entity-system/index/ContractMaturity) `ProductSession`
| [`Order`]({{site.baseurl}}/entity-system/index/Order) | [`Command`]({{site.baseurl}}/entity-system/index/Command) [`OrderVersion`]({{site.baseurl}}/entity-system/index/OrderVersion) [`Fill`]({{site.baseurl}}/entity-system/index/Fill)
| [`Exchange`]({{site.baseurl}}/entity-system/index/Exchange) | [`Product`]({{site.baseurl}}/entity-system/index/Product)
| [`OrderStrategy`]({{site.baseurl}}/entity-system/index/OrderStrategy) | [`OrderStrategyLink`]({{site.baseurl}}/entity-system/index/OrderStrategyLink)
| [`Fill`]({{site.baseurl}}/entity-system/index/Fill) | `FillFee` 
| [`Position`]({{site.baseurl}}/entity-system/index/Position) | [`FillPair`]({{site.baseurl}}/entity-system/index/FillPair)
| [`User`]({{site.baseurl}}/entity-system/index/User) | [`Account`]({{site.baseurl}}/entity-system/index/Account) [`TradingPermission`]({{site.baseurl}}/entity-system/index/TradingPermission) [`ContactInfo`]({{site.baseurl}}/entity-system/index/ContactInfo)
| [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/index/UserAccountPositionLimit) | [`UserAccountRiskParameter`]({{site.baseurl}}/entity-system/index/UserAccountRiskParameter)
