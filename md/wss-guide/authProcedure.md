---
layout: default
title: Authorization Procedure
permalink: /all-ops/websockets/auth
grand_parent: API Operations
parent: WebSockets
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'Authorize Procedure',
            excerptOnly: true,
            excerpt: `<p>Try it on the WebSocket Playground:</p><a class="btn btn-red" href="{{site.baseurl}}/all-ops/websockets/play">WebSocket Playground</button>`
        });
    });
</script>

## `authorize`
- The `authorize` operation should be called from a WebSocket immediately after it receives the `'o'` or 'open' frame from the server. 
- Unlike the HTTP/REST portion of our API, the WebSocket only needs to be authorized one time. After this point, the connection may be used until closed. 
- Even after the token expires, the socket will be remain open. However, in case your connection is lost it is a good idea to have some kind of re-connect routine in place.
- [Try It]({{site.baseurl}}/all-ops/websockets/play) on our WebSocket Playground!

### Example

```js
//if using node, use node-fetch or axios
//retrieve the accessToken from the accessTokenResponse
const response = await fetch((TdvLiveURL || TdvDemoUrl) + '/auth/accessTokenRequest')
const { accessToken } = await response.json()

//if using node, you must add the 'ws' package, from a console: 
//  yarn add ws
//      or
//  npm install -s ws
const mySocket = new WebSocket(oneOfTradovateWssURLs)
let msg_i = 0

mySocket.onopen = _ => {
    const authMsg = `authorize\n${msg_i++}\n\n${accessToken}`
    mySocket.send(authMsg)
}
```
