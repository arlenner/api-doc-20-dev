---
layout: default
title: replay/initializeClock
permalink: /wss-guide/market-replay/initialize-clock
grand_parent: WebSocket Guide
parent: Market Replay
---

## `replay/initializeClock`
- This operation starts the replay session and should be called right away after the socket is authorized.
- The operation is only valid when using a Market Replay Socket (a WebSocket connected to the Market Replay URL, `wss://replay.tradovateapi.com/v1/websocket`)

### Example

```js

const myReplaySocket = new WebSocket('wss://replay.tradovateapi.com/v1/websocket');
let msg_i = 0;

//...
//perform the auth procedure. See the WebSockets Authorization Procedure for more details
//...

const body = {
    startTimestamp: new Date('01/01/2024'),
    speed: 400,
    initialBalance: 50000
};

myReplaySocket.send(`replay/initializeClock\n${++msg_i}\n\n${JSON.stringify(body)}`);
```

### Fields

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `startTimestamp` | `required`{: .label .label-red } | Date string |
| `speed` | `required`{: .label .label-red } | number (0-400) | Represents the percent speed of real-time that the replay market progresses.
| `initialBalance` | `required`{: .label .label-red } | number | The balance that the generated replay account is initialized with.  
