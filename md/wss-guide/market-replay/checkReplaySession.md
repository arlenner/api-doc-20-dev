---
layout: default
title: replay/checkReplaySession
permalink: /wss-guide/market-replay/check-replay-session
grand_parent: WebSocket Guide
parent: Market Replay
---

## `replay/checkReplaySession`
- The `checkReplaySession` operation is used to determine if a Market Replay session is within the scope of your User's permission to request.
- This operation should be called before attempting to connect to a Market Replay session using the [`replay/initializeClock`]({{site.baseurl}}/all-ops/websocket/initializeclock) operation.

### Example

```js

const myReplaySocket = new WebSocket('wss://replay.tradovateapi.com/v1/websocket')
let msg_i = 0
//...
//perform the auth procedure. See the WebSockets Authorization Procedure for more details
//...

const body = {
    startTimestamp: new Date('2021-05-03Z18:00').toJSON()
}

const msg = `replay/checkReplaySession\n${msg_i++}\n\n${JSON.stringify(body)}`

myReplaySocket.send(msg)
```