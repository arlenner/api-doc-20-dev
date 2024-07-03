---
layout: default
title: /items
permalink: /all-ops/shared/items
parent: Shared
grand_parent: API Operations
op: true
---
<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: '/items',
            dynamic: true,
            endpoint: '/items',
            method: 'GET',
            query: {
                ids: 0
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/{entity}/items`
This operation is used to look up an entity that you already have the ID for.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/items?ids={item_id_a},{item_id_b}

  OR

https://demo.tradovateapi.com/v1/{entity}/items?ids={item_id_a},{item_id_b}
```

And for WebSocket requests:

```
<entity>/items
<msg_id>
ids=<entity_id>

```

Example Usage:
```js
async function entityItems(entityType, ids) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/items?ids=${ids.join(',')}`
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityItems('contract', [2710963])
//=>
// [
//     {
//         "id": 2710963,
//         "name": "ESM2",
//         "contractMaturityId": 46104,
//         "status": "DefinitionChecked",
//         "providerTickSize": 0.25
//     }   
// ]
```