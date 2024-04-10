---
layout: page
title: /list
permalink: /all-ops/shared/list
parent: Shared
grand_parent: API Operations
op: true
---
<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: '/list',
            dynamic: true,
            endpoint: '/list',
            method: 'GET',
            exclude: ['contract', 'contractMaturity', 'userAccountPositionLimit', 'userAccountRiskParameter']
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/{entity}/list`
This operation is used to look up all the entities that exist within your User's permissions scope.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/list

  OR

https://demo.tradovateapi.com/v1/{entity}/list
```

And for WebSocket requests:

```
<entity>/list
<msg_id>


```

Example Usage:
```js
async function entityList(entityType) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/list`
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityList('account')
//=>
// [
//     {
//         "id": 0,
//         "name": "string",
//         "userId": 0,
//         "accountType": "Customer",
//         "active": true,
//         "clearingHouseId": 0,
//         "riskCategoryId": 0,
//         "autoLiqProfileId": 0,
//         "marginAccountType": "Speculator",
//         "legalStatus": "Individual",
//         "timestamp": "2019-08-24T14:15:22Z",
//         "readonly": true
//     }
// ]
```