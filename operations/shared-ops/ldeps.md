---
layout: default
title: /ldeps
permalink: /all-ops/shared/ldeps
parent: Shared
grand_parent: API Operations
op: true
---
<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: '/ldeps',
            dynamic: true,
            endpoint: '/ldeps',
            method: 'GET',
            query: {
                masterids: 0
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/{entity}/ldeps`
This operation is used to look up entities of this type that are dependent on other 'master' entities.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/ldeps?masterids={item_id_a},{item_id_b},...

  OR

https://demo.tradovateapi.com/v1/{entity}/ldeps?masterids={item_id_a},{item_id_b},...
```

And for WebSocket requests:

```
<entity>/deps
<msg_id>
masterids=<entity_id_a>,<entity_id_b>,...

```

Example Usage:
```js
async function entityLDeps(entityType, masterids) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/ldeps?masterids=${masterids.join(',')}`

    const config = {
        
    }
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityLDeps('productMargin', [814, 799])
//=>
// [
//   {
//     "id": 814,
//     "initialMargin": 17050,
//     "maintenanceMargin": 15500,
//     "timestamp": "2022-04-21T00:09:12.512Z"
//   },
//   {
//     "id": 799,
//     "initialMargin": 12320,
//     "maintenanceMargin": 11200,
//     "timestamp": "2022-04-21T00:09:12.511Z"
//   }
// ]
```

### Notes

| `masterids` Entity Type | Related Entity Types
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
