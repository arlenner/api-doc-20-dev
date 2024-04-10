---
layout: page
title: /find
permalink: /all-ops/shared/find
parent: Shared
grand_parent: API Operations
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: '/find',
            dynamic: true,
            endpoint: '/find',
            method: 'GET',
            query: {
                name: ''
            },
            exclude: ['accountRiskStatus', 'position', 'cashBalance', 'command', 'commandReport', 'tradingPermission', 'fill', 'fillPair', 'orderStrategy', 'orderStrategyLink', 'userAccountPositionLimit', 'userAccountRiskParameter']
        });

        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/{entity}/find`
This operation is used to look up an entity that has a `name` field. Note that this operation will *only* work for entities with a `name` field. For example, `/position/find` is technically a valid operation but it will never return anything because [Position]({{site.baseurl}}/entity-system/index/Position) entities do not have a `name` field.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/find?name={entity_name}

  OR

https://demo.tradovateapi.com/v1/{entity}/find?name={entity_name}
```

And for WebSocket requests:

```
<entity>/find
<msg_id>
name=<entity_name>

```

Example Usage:
```js
async function entityFind(entityType, name) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/find?name=${name}`
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityFind('product', 'NQ')
//=>
// {
//   "id": 814,
//   "name": "NQ",
//   "currencyId": 1,
//   "productType": "Futures",
//   "description": "E-Mini NASDAQ 100",
//   "exchangeId": 2,
//   "exchangeChannelId": 4,
//   "contractGroupId": 20,
//   "riskDiscountContractGroupId": 1,
//   "status": "Verified",
//   "months": "HMUZ",
//   "valuePerPoint": 20,
//   "priceFormatType": "Decimal",
//   "priceFormat": -2,
//   "tickSize": 0.25,
//   "allowProviderContractInfo": false,
//   "isMicro": false,
//   "marketDataSource": "Auto",
//   "lookupWeight": 64,
//   "hasReplay": true
// }
```