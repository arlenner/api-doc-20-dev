---
layout: page
title: /item
permalink: /all-ops/shared/item
parent: Shared
grand_parent: API Operations
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: '/item',
            dynamic: true,
            endpoint: '/item',
            method: 'GET',
            query: {
                id: ''
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>


## `/{entity}/item`
This operation is used to look up an entity that you already have the ID for.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/item?id={item_id}

  OR

https://demo.tradovateapi.com/v1/{entity}/item?id={item_id}
```

And for WebSocket requests:

```
<entity>/item
<msg_id>
id=<entity_id>

```

Example Usage:
```js
async function entityItem(entityType, id) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/item?id=${id}`
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityItem('contract', 2710963)
//=>
// {
//     "id": 2710963,
//     "name": "ESM2",
//     "contractMaturityId": 46104,
//     "status": "DefinitionChecked",
//     "providerTickSize": 0.25
// }
```