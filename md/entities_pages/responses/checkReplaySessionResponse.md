---
layout: default
title: CheckReplaySessionResponse
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/checkreplaysessionresponse
---

## CheckReplaySessionResponse
The server response when calling the `replay/checkReplaySession` operation. *This operation is only available for and intended for use with the Tradovate WebSocket APIs.*

#### Related

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `checkStatus` | `required`{: .label .label-red } | `"Ineligible"` `"OK"` `"StartTimestampAdjusted"` | 
| `startTimestamp` | `none`{: .label } | Date string | Not included if the `checkStatus === "OK"`.

### Notes
- You should call this function before you make a call to `replay/initializeClock`.
- If the timestamp is adjusted, be sure to make note of it and handle it in your code. Problems can occur when the adjusted timestamp is more recent than the time you want your replay session to end. In this scenario, you'll likely never receive the correct `clock` event you need to determine the session should end, or your session will be ended immediately since it will receive an initial `clock` response beyond your provided end time.

### Example Usage
```js
const URL = 'wss://replay.tradovateapi.com/v1/websocket'

const myMarketReplaySocket = new WebSocket(URL)

//simple WebSocket authorization procedure
myMarketReplaySocket.onopen = function() {
    myMarketReplaySocket.send(`authorize\n0\n\n${accessToken}`)
}

//JSON string for midnight April 30th 2018
const startTimestamp = new Date('2018-04-30').toJSON()
myMarketReplaySocket.send(`replay/checkreplaysession\n1\n\n${JSON.stringify({startTimestamp})}`)

//listen for response
myMarketReplaySocket.addEventListener('message', msg => {
    const datas = JSON.parse(msg.data.slice(1)) //chop off leading 'frame' char
    //datas looks like this [{s: 200, i: 1, d: { checkStatus: 'OK' } }]
    if(datas) {
        datas.forEach(({i, d}) => {
            if(i && i === 1)  { //id of our sent message is 1, response's `i` field will be 1.
                console.log(d) //=> { checkStatus: 'OK' }
                //if the status is OK we can send the initializeClock message
            }
        })
    } 
})
```