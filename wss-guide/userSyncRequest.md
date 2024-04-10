---
layout: page
title: user/syncRequest
permalink: /all-ops/websockets/syncRequest
grand_parent: API Operations
parent: WebSockets
---

## `user/syncRequest`
- This operation is used to open a real-time stream to all user-related actions.
- The opened stream will transmit any updates or changes that have a relationship to your user.

### Example

```js
const mySocket = new WebSocket('wss://demo.tradovateapi.com/v1/websocket')

//...
// perform the auth procedure...
//...

//get your userId whatever way you like, here I use one of the local lib's Storage features.
const { userId } = Storage.getUserData();

mySocket.send(`user/syncrequest\n1\n\n${JSON.stringify({ users: [userId] })}`)

mysocket.onmessage = msg => {
    const T = msg.data.split(0,1) //first char is frame type
    let data = msg.data.split(1) //data is rest
    if(data) {
        //parse to JSON, all data arrives as a string representation of a JSON array
        data = JSON.parse(data)
    }

    //'a' is the data frame type
    if(T === 'a') {
        //if you have dual-connections purchased, it is fun to
        //run this websocket while you make actions on the Trader
        //application. You will see everything you do in real-time!
        console.log(data)
    }
}

```