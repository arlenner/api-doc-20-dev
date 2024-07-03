---
layout: default
title: Listen to Message Events
permalink: /all-ops/websockets/messages
grand_parent: API Operations
parent: WebSockets
---

## Message Events
WebSockets communicate asynchronously between the WebSocket Client and a WebSocket Server. When a message is received by the client, an event is raised. We can listen to these events using one of two methods.

```js
const mySocket = new WebSocket(oneOfTradovateWSSUrls)

//named event hooks
mySocket.onopen = _ => { /*auth procedure*/ }
mySocket.onmessage = msg => {}
mySocket.onclose = msg => {}

//or event listener interface
mySocket.addEventListener('message', msg => {
    //...
})
```

## Decoding Messages
Messages come as plain strings. In order to use the data, we need to decode it first. Here's a simple helper that you can use to decode messages you receive from a Tradovate WebSocket server.

```js
/**
 * Takes a raw WebSocket message and maps it to a tuple of `[frameType, data]`
 * @returns {[T:string, data:{e?: string, i?: number, s?: number, d?: {[k:string]:any}} | null]}
 */
function prepareMessage(msg) {
    const T = msg.data.slice(0,1)
    let data = msg.data.slice(1)

    if(data) {
        data = JSON.parse(data)
    }

    return [T, data]
}
```

## WebSocket as an Observable
You can turn your WebSockets' events into functional data streams using the popular RXJS package.
```js
//imports if using node
const WebSocket = require('ws')
const { BehaviorSubject } = require('rxjs')

//imports if using browser
import { BehaviorSubject } from 'rxjs'

/**
 * Class to represent an Observable WebSocket.
 */ 
class ObservableSocket {
    constructor() {
        this.socket = null
        this.counter = 0
        //BehaviorSubject lets us push values, can stay private.
        this._messages = new BehaviorSubject()
        //Observable does not, so we want this.messages to be public
        this.messages = this._messages.asObservable()
    }

    send({url, query, body}) {
        const message = `${url}\n${this.counter++}\n${query || ''}\n${body ? JSON.stringify(body) : ''}`
        this.socket.send(message)
    }

    connect(url, accessToken) {
        this.socket = new WebSocket(url)

        this.socket.onopen = _ => {
            const msg = `auth\n${this.counter++}\n\n${accessToken}`
        }
        
        this.socket.onmessage = msg => {
            const [T, data] = prepareMessage(msg)
            this._messages.next({ type: T, data })
        }
    }

    subscribe(subscriber) {
        return this.messages.subscribe(subscriber)
    }

    pipe(fns) {
        return this.messages.pipe(...fns)
    }
} 

```

Usage:

```js
import { map, filter } from 'rxjs'

const mySocket = new ObservableSocket()

//made up implementation of accessToken call
const { accessToken } = await accessTokenRequest(credentials)

mySocket.connect('wss://md.tradovateapi.com/v1/websocket')

//easily and functionally filter and transform the data
const quotes = mySocket.pipe(
    filter(m => m.e && m.e === 'md' && m.d && m.d.quotes),
    map(m => m.d.quotes)
)

//subscribe to the quotes stream
const subscription = quotes.subscribe(quote => {
    /* do things with quote */ 
})

//send the actual quote subscription request
mySocket.send({
    url: 'md/subscribeQuote',
    body: { symbol: 'ESM2' }
})
```