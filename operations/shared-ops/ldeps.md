---
layout: page
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

| `masterid` Entity Type | Related Entity Types
|:-------|:---------------------
| *(The entity type that should be used for `masterids` parameter)* | *(The operation's returned type)*
| [`Account`]({{site.baseurl}}/entity-system/entity-index/Account) | [`CashBalance`]({{site.baseurl}}/entity-system/entity-index/CashBalance) [`CashBalanceLog`]({{site.baseurl}}/entity-system/entity-index/CashBalanceLog) [`MarginSnapshot`]({{site.baseurl}}/entity-system/entity-index/MarginSnapshot) [`AccountRiskStatus`]({{site.baseurl}}/entity-system/entity-index/AccountRiskStatus) [`UserAccountAutoLiq`]({{site.baseurl}}/entity-system/entity-index/UserAccountAutoLiq) [`Position`]({{site.baseurl}}/entity-system/entity-index/Position) [`Order`]({{site.baseurl}}/entity-system/entity-index/Order) [`OrderStrategy`]({{site.baseurl}}/entity-system/entity-index/OrderStrategy) [`User`]({{site.baseurl}}/entity-system/entity-index/User) [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/entity-index/UserAccountPositionLimit) 
| [`Command`]({{site.baseurl}}/entity-system/entity-index/Command) | [`CommandReport`]({{site.baseurl}}/entity-system/entity-index/CommandReport) [`ExecutionReport`]({{site.baseurl}}/entity-system/entity-index/ExecutionReport)
| [`Contract`]({{site.baseurl}}/entity-system/entity-index/Contract) | [`ContractMaturity`]({{site.baseurl}}/entity-system/entity-index/ContractMaturity)
| [`Product`]({{site.baseurl}}/entity-system/entity-index/Product) | [`ProductMargin`]({{site.baseurl}}/entity-system/entity-index/ProductMargin) [`ContractMaturity`]({{site.baseurl}}/entity-system/entity-index/ContractMaturity) `ProductSession`
| [`Order`]({{site.baseurl}}/entity-system/entity-index/Order) | [`Command`]({{site.baseurl}}/entity-system/entity-index/Command) [`OrderVersion`]({{site.baseurl}}/entity-system/entity-index/OrderVersion) [`Fill`]({{site.baseurl}}/entity-system/entity-index/Fill)
| [`Exchange`]({{site.baseurl}}/entity-system/entity-index/Exchange) | [`Product`]({{site.baseurl}}/entity-system/entity-index/Product)
| [`OrderStrategy`]({{site.baseurl}}/entity-system/entity-index/OrderStrategy) | [`OrderStrategyLink`]({{site.baseurl}}/entity-system/entity-index/OrderStrategyLink)
| [`Fill`]({{site.baseurl}}/entity-system/entity-index/Fill) | `FillFee` 
| [`Position`]({{site.baseurl}}/entity-system/entity-index/Position) | [`FillPair`]({{site.baseurl}}/entity-system/entity-index/FillPair)
| [`User`]({{site.baseurl}}/entity-system/entity-index/User) | [`Account`]({{site.baseurl}}/entity-system/entity-index/Account) [`TradingPermission`]({{site.baseurl}}/entity-system/entity-index/TradingPermission) [`ContactInfo`]({{site.baseurl}}/entity-system/entity-index/ContactInfo)
| [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/entity-index/UserAccountPositionLimit) | [`UserAccountRiskParameter`]({{site.baseurl}}/entity-system/entity-index/UserAccountRiskParameter)
