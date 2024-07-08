---
layout: default
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
| [`Account`]({{site.baseurl}}/entity-system/entity-index/account) | [`CashBalance`]({{site.baseurl}}/entity-system/entity-index/cashbalance) [`CashBalanceLog`]({{site.baseurl}}/entity-system/entity-index/cashbalancelog) [`MarginSnapshot`]({{site.baseurl}}/entity-system/entity-index/marginsnapshot) [`AccountRiskStatus`]({{site.baseurl}}/entity-system/entity-index/accountriskstatus) [`UserAccountAutoLiq`]({{site.baseurl}}/entity-system/entity-index/useraccountautoliq) [`Position`]({{site.baseurl}}/entity-system/entity-index/position) [`Order`]({{site.baseurl}}/entity-system/entity-index/order) [`OrderStrategy`]({{site.baseurl}}/entity-system/entity-index/orderstrategy) [`User`]({{site.baseurl}}/entity-system/entity-index/user) [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit) 
| [`Command`]({{site.baseurl}}/entity-system/entity-index/command) | [`CommandReport`]({{site.baseurl}}/entity-system/entity-index/CommandReport) [`ExecutionReport`]({{site.baseurl}}/entity-system/entity-index/executionreport)
| [`Contract`]({{site.baseurl}}/entity-system/entity-index/contract) | [`ContractMaturity`]({{site.baseurl}}/entity-system/entity-index/contractmaturity)
| [`Product`]({{site.baseurl}}/entity-system/entity-index/product) | [`ProductMargin`]({{site.baseurl}}/entity-system/entity-index/productmargin) [`ContractMaturity`]({{site.baseurl}}/entity-system/entity-index/contractmaturity) `ProductSession`
| [`Order`]({{site.baseurl}}/entity-system/entity-index/order) | [`Command`]({{site.baseurl}}/entity-system/entity-index/command) [`OrderVersion`]({{site.baseurl}}/entity-system/entity-index/orderversion) [`Fill`]({{site.baseurl}}/entity-system/entity-index/fill)
| [`Exchange`]({{site.baseurl}}/entity-system/entity-index/Exchange) | [`Product`]({{site.baseurl}}/entity-system/entity-index/product)
| [`OrderStrategy`]({{site.baseurl}}/entity-system/entity-index/orderstrategy) | [`OrderStrategyLink`]({{site.baseurl}}/entity-system/entity-index/orderstrategylink)
| [`Fill`]({{site.baseurl}}/entity-system/entity-index/fill) | `FillFee` 
| [`Position`]({{site.baseurl}}/entity-system/entity-index/position) | [`FillPair`]({{site.baseurl}}/entity-system/entity-index/fillpair)
| [`User`]({{site.baseurl}}/entity-system/entity-index/user) | [`Account`]({{site.baseurl}}/entity-system/entity-index/account) [`TradingPermission`]({{site.baseurl}}/entity-system/entity-index/tradingpermission) [`ContactInfo`]({{site.baseurl}}/entity-system/entity-index/contactinfo)
| [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit) | [`UserAccountRiskParameter`]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)
