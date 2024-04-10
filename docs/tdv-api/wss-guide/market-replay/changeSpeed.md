---
layout: page
title: replay/changeSpeed
permalink: /wss-guide/market-replay/change-speed
grand_parent: WebSocket Guide
parent: Market Replay
---

## `replay/changeSpeed`
- This operation is used to change the speed of a Market Replay session.
- The operation is only valid when using a Market Replay Socket (a WebSocket connected to the Market Replay URL, `wss://replay.tradovateapi.com/v1/websocket`)
- Can be useful to reset a throttled replay session.
- The maximum replay speed available is 400% original speed. 

### Example

```js

const myReplaySocket = new WebSocket('wss://replay.tradovateapi.com/v1/websocket')
let msg_i = 0
//...
//perform the auth procedure. See the WebSockets Authorization Procedure for more details
//...
myReplaySocket.onmessage = msg => {
    const T = msg.data.split(0,1) //first char is frame type
    let data = msg.data.split(1) //data is rest
    if(data) {
        //parse to JSON, all data arrives as a string representation of a JSON array
        data = JSON.parse(data)
    }

    //'a' is the data frame type
    if(T === 'a') {
        const { e, d } = data
        //clock events synchronize replay time w client
        if(e === 'clock') {
            //clock event data is a JSON string
            const { s, t } = JSON.parse(d)
            //'s' is the speed, 't' is the timestamp. If 's' is 0 the speed has been throttled.
            if(s === 0) {
                const msg = `replay/changeSpeed\n${msg_i++}\n\n${JSON.stringify({speed:400})}`
                myReplaySocket.send(msg)
            }
        }
    }
}
```