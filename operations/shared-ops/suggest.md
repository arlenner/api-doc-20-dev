---
layout: page
title: /suggest
permalink: /all-ops/shared/suggest
parent: Shared
grand_parent: API Operations
op: true
---
<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: '/suggest',
            dynamic: true,
            endpoint: '/suggest',
            method: 'GET',
            query: {
                l: 'max_length_integer',
                t: 'search_text'
            },
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/{entity}/suggest`
The `/suggest` operation returns up to `l` entities that match the query text `t`. This is useful for when you want to make a choice, or find out what is available, eg. `/contract/suggest?t=ES&l=10` will return the 10 most relevant ES contracts.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/suggest?l=<max_results>&t=<query_text>

  OR

https://demo.tradovateapi.com/v1/{entity}/suggest?l=<max_results>&t=<query_text>
```

And for WebSocket requests:

```
<entity>/suggest
<msg_id>
l=<max_results>&t=<query_text>

```

Example Usage:
```js
async function entitySuggest(entityType, text, maxLength = 10) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/suggest?t=${text}&l=${maxLength}`
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entitySuggest('contract', 'ES')
//=>
// [
//   {
//     "id": 2710963,
//     "name": "ESM2",
//     "contractMaturityId": 46104,
//     "status": "DefinitionChecked",
//     "providerTickSize": 0.25
//   },
//   {
//     "id": 2830505,
//     "name": "ESU2",
//     "contractMaturityId": 46575,
//     "status": "DefinitionChecked",
//     "providerTickSize": 0.25
//   },
//   {
//     "id": 2830506,
//     "name": "ESZ2",
//     "contractMaturityId": 46576,
//     "status": "DefinitionChecked",
//     "providerTickSize": 0.25
//   },
//   //...
// ]
```