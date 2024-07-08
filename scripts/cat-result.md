




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






## Client Heartbeats
Even WebSockets have built-in pings. As mentioned in the [Message Protocol]({{site.baseurl}}/wss-guide/message-protocol) section, a client is responsible to send heartbeats every 2.5 seconds to avoid closing by server due to inactivity. 

A heartbeat should be a frame with `"[]"` (empty array) as its text, which you can send using the `WebSocket.send` method. It is best to adopt a mechanism that doesn't rely on `setInterval` when developing for web - this function can be throttled by the browser leading to disconnection when running in a background tab. Instead generate a timestamp (`new Date().getTime()` will do) with each received message. Check that against the timestamp of the last message received, and if the time has exceeded 2500ms send a heartbeat frame. 
> Note: A server that is actively streaming live data (such as a market data subscription) will _not_ send heartbeats while outputting messages. So long as the developer ensures that the client sends heartbeats every 2.5 seconds, the connection will stay alive.

Here is an example of how to check a heartbeat without relying on `setInterval` or `setTimeout` that would be suitable for a browser.
```js
let lastTime;
function checkHeartbeat(ws, verbose = false) {
    //on first run, lastTime is undefined
    if(!lastTime) {
        lastTime = new Date().getTime();
    }
    const now = new Date().getTime();
    if(now - lastTime >= 2500) {
        if(verbose) {
            console.log('[]');
        }
        ws.send('[]');
        lastTime = now;
    }
}
```

---

[{% include chev-left.html %} Message Protocol]({{site.baseurl}}/wss-guide/message-protocol){: .btn .btn-blue }
[Heartbeats {% include chev-right.html %}]({{site.baseurl}}/wss-guide/){: .btn .btn-blue .text-grey-lt-000 .float-right }

---


# WebSocket Guide

## Introduction
You'll need to create a WebSocket instance using one of the real-time API URL's. However, instead of using the `https://` prefix we will use the `wss://` WebSocket protocol prefix. Here's an example using our demo API URL:

`wss://demo.tradovateapi.com/v1/websocket`

WebSockets are supported in all browsers, natively, and in many other contexts such as NodeJS. Instantiating and connecting a new WebSocket is as simple as this:
```js
const mySocket = new WebSocket('wss://demo.tradovateapi.com/v1/websocket');
```
Of course, this socket is not authorized and cannot complete any calls yet. You can see how to perform this procedure on the [Authorization Procedure]({{site.baseurl}}/wss-guide/authorize) page.

For those who like to learn by doing, see our [WebSocket Playground]({{site.baseurl}}/all-ops/websockets/play).

---
[Resources]({{site.baseurl}}/resources){: .btn .btn-blue }
[Message Protocol {% include chev-right.html %}]({{site.baseurl}}/wss-guide/message-protocol){: .btn .btn-blue .text-grey-lt-000 .float-right }




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



# Server Frames
The WebSocket server communicates in _frames_. A frame consists of two parts - a 'type' prefix character and an array of JSON data. These two parts are concatenated into a string, and we will be responsible for creating the logic to deconstruct such messages on the client. The following are the message types supported and sent by the Tradovate WebSocket:


- `'o'`: Open frame. Every time a new session is established, the server must immediately send the open frame. This is required, as some protocols (mostly polling) can't distinguish between a properly established connection and a broken one - we must convince the client that it is indeed a valid URL and it can be expecting further messages in the future via that URL.

- `'h'`: Heartbeat frame. Most loadbalancers have arbitrary timeouts on connections. In order to keep connections from breaking, the server must send a heartbeat frame every now and then. The server sends a heartbeat about every 2.5 seconds, and to keep the connection alive the client must also send a response beat in the form of an empty array, stringified (`'[]'`)

- `'a'`: A string containing an Array of JSON-encoded messages. For example: `'a[{"data": "value"}]'`.

- `'c'`: Close frame. This frame is send to the browser every time the client asks for data on closed connection. This may happen multiple times. Close frame contains a code and a string explaining a reason of closure, like: `c[3000, "Go away!"]`.

## Decoding Server Frames

Tradovate uses 'a' frames as a backbone for its own message protocol. Below are a few bits of example data.
```
a[{"s":200,"i":23,"d":{"id":65543,"name":"CLZ6","contractMaturityId":6727}}]
a[{"e":"props","d":{"entityType":"order","eventType":"Created","entity":{"id":210518,"accountId":25,"contractId":560901,"timestamp":"2016-11-04T00:02:36.626Z","action":"Sell","ordStatus":"PendingNew","admin":false}}}]
```

You can quickly parse frames into more consumable data using a function such as the `decodeMessage` example below. It will turn the string message into a tuple that you can destructure.

```js
function decodeMessage(msg) {
    const T = msg.data.slice(0, 1);
    let payload = null;
    const data = msg.data.slice(1);
    if(data) {
        payload = JSON.parse(data);
    }
    return [T, payload];
}

//usage:
mySocket.onmessage = msg => {
    //data may be null
    const [T, data] = decodeMessage(msg);
    switch(T) {
        case 'a': {
            //react to data
            break;
        }
    }
}
```
# Message Types
There are a variety of message types that can be sent by the WebSocket. The message types can be sorted into two overarching message categories - Server Events and Client Responses.

## Server Event Message
A Server Event Message is sent from the server, not regarding an outgoing request initiated by the client. These messages come in a few varieties. In each response object, the `"e"` field specifies the server event type:

### `"props"` Server Event
```js
{
    "e":"props",
    "d":{
        "entityType":"order",
        "eventType":"Created",
        "entity":{
            "id":210518,
            "accountId":25,
            "contractId":560901,
            "timestamp":"2016-11-04T00:02:36.626Z",
            "action":"Sell",
            "ordStatus":"PendingNew",
            "admin":false
        }
    }
}
```
This is a notification that an entity was created, updated or deleted. The `"d"` field specifies details of the event. Each `"props"` type event will have the following fields:
- `"entityType"` - defines the type of the entity that triggered the event.
- `"entity"` - The actual entity object as JSON. For more details on the structure of various entity objects, explore the [Enitities Index]({{site.baseurl}}/entity-system/index) pages.
- `"eventType"` - `"Created"`, `"Updated"` or `"Deleted"`. Represents the action that ocurred with this entity as the target.

### `"shutdown"` Server Event
```js
{
    "e":"shutdown",
    "d":{
        "reasonCode": "Maintenance" | "ConnectionQuotaReached" | "IPQuotaReached",
        "reason": string //may not always be present
    }
}
```
A notification before graceful shutdown of the socket connection. The `"d"` field specifies details:
  * `"reasonCode"` field with options "Maintenance", "ConnectionQuotaReached", "IPQuotaReached"
  * `"reason"` field is optional and may contain a readable explanation

### `"md"` Server Event (Market Data)
```js
{
    "e":"md",
    "d": {
        "quotes": [
            {
                "timestamp":"2021-04-13T04:59:06.588Z",
                "contractId":123456,
                "entries": {
                    "Bid": { "price":18405.123, "size":7.123 },
                    "TotalTradeVolume": { "size":4118.123 },
                    "Offer": { "price":18410.012, "size":12.35 },
                    "LowPrice": { "price":18355.23 },
                    "Trade": { "price":18405.023, "size":2.10 },
                    "OpenInterest": { "size":40702.024 },
                    "OpeningPrice": { "price":18515.123 },
                    "HighPrice": { "price":18520.125 },
                    "SettlementPrice": { "price":18520.257 }
                }
            }
        ]
    }
}
  ```
These notifications are used by market data feed services only. Market Data is an advance API feature that requires CME Market Data Subvendor status in order to use. See the Market Data section for more details.

### `"clock"` Server Event (Replay)
```js
{
    "e": "clock",
    //the "d" field is JSON, you must decode it.    
    "d": "{\"t\":\"2019-08-26T16:43:08.599Z\",\"s\":20}" 
} 

```
Market Replay clock synchronization message. See the Market Replay section for more details.

## Client Response Message

A Client Response Message is issued when a client makes a request. These messages are intended to mimic REST API responses and have the following structure:

```js
{
    "i":26,
    "s":200,
    "d":{
        "id":478866,
        "name":"6EZ6",
        "contractMaturityId":23574
    }
}
```
- `"i"` field is a id of corresponding client request (see "Client requests" below). A responses id will always match the id of the request that generated it.
- `"s"` field is a HTTP status code of response
- `"d"` field is a content of response. If HTTP status is 2xx, this field contains JSON response as defined in Swagger specification of the corresponding request. Otherwise, `"d"` is a string representation of error text.

## Client Requests
We use standard text documents for our client request protocol, with lines delimited by `\n` newline characters.

Each document sent by the client contains exactly one request. The frame consists of four fields:
- An endpoint name as defined in the spec. These are any of the endpoints that you could request from the standard REST API.
- A unique integer ID of the request. The ID should be unique in the scope of the current connection. This ID will be used as a reference by the server in the response messages (see "Response Message" above)
- an optional field with parameters identical to query parameters of REST API
- an optional field that is identical to a body parameter of REST API

The four fields _must be_ separated by the `'\n'` ("new line") character. This is how message parameters are delimited when they get decoded.


### Request Examples
An example of a request without query or body:

```
executionReport/list
4

```

An example of a request with a query parameter:

```
tradingPermission/ldeps
8
masterids=1
```

An example of a request with a body:

```
contract/rollcontract
33

{"name":"YMZ6","forward":true,"ifExpired":true}
```

---

[{% include chev-left.html %} Introduction]({{site.baseurl}}/wss-guide/){: .btn .btn-blue }
[Heartbeats {% include chev-right.html %}]({{site.baseurl}}/wss-guide/heartbeats){: .btn .btn-blue .text-grey-lt-000 .float-right }

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

### Notes
- If you are a B2B Organization Vendor, please be sure to add the `splitResponses` field to your request body! Failure to do so will result in the connection being immediately terminated without obvious logging.
```js
mySocket.send(`user/syncrequest\n1\n\n${JSON.stringify({ users: [orgAdminId], splitResponses: true })}`)
```



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




# Market Replay
Market Replay service allows an API subscriber to start a replay session. A replay session picks a time from the past and plays back the market as it happened at up to 400% of real-time. Additionally, each replay session has an associated sim account generated for the session that you can use for backtesting a strategy, or playing back and analyzing your own trades.

This service is available by connecting a WebSocket to `wss://replay.tradovateapi.com/v1/websocket`.

## Notes
- The Replay Socket is heavily tied to the Market Data socket protocol, as this is where the historic market data you are analyzing will be made available via API. In order to utilize market data through the API, you must first become a registered subvendor of CME Market Data.
- A Replay Socket follows the same protocols and authorization procedure as a Live/Demo socket or an MD socket.
- You should treat a WebSocket connected to the Replay API as if it were connected to both a Live or Demo WebSocket and a Market Data WebSocket. This means you can send both REST-like requests and MD requests to the same Replay socket instance.



# Market Data
The most interesting benefit of using the WebSocket client is getting access to data in real-time.

This service is available by connecting a WebSocket to `wss://md.tradovateapi.com/v1/websocket`.

## Accessing Market Data
The Tradovate Market Data API provides a way to access market data such as quotes, DOM, charts and histograms. The API uses JSON format for request bodies and response data. The exchange of requests and responses are transmitted via the Tradovate WebSocket protocol.

Typical usage of the Market Data API consists of the following steps:

### 1. Acquire An Access Token Using Credentials
Client uses the standard Access procedure to acquire an Access Token.

### 2. Open a WebSocket and Get Authorized
Client opens a WebSocket connection and sends their access token using the authorization procedure noted in the WebSockets section.

### 3. Build a Request
Request parameters are an object in JSON format. Each request for real-time data requires a symbol parameter that specifies the contract for which market data is requested. Contract can be specified either by the contract symbol string or by the contract ID integer:

```js
{
    "symbol":"ESM7" // Contract is specified by contract symbol (contract.name)
    ...
}
// or
{
    "symbol":123456 // Contract is specified by contract ID (contract.id)
    ...
}
```

Requests may have additional parameters, which are described in the corresponding sections.

## Notes
- In order to utilize market data via API, you must first become a registered subvendor of CME Market Data.
- A Market Data Socket follows the same protocols and authorization procedure as a Live/Demo realtime user data socket.






## `md/getChart`

You can use this endpoint via Market Data socket to receive bar or tick chart data. 

## Request
In the Tradovate WebSocket protocol, this is how you would structure your request:

```
md/getchart
0

{"symbol":"ESZ4","chartDescription":{"underlyingType":"MinuteBar","elementSize":1,"elementSizeUnit":"UnderlyingUnits","withHistogram":false},"timeRange":{"asMuchAsElements":100}}
```

#### Remarks

Below is an example of all the available parameters in the request body:

```
{
  "symbol":"ESM7" | 123456,
  "chartDescription": {
    "underlyingType":"MinuteBar", // Available values: Tick, DailyBar, MinuteBar, Custom, DOM
    "elementSize":15,
    "elementSizeUnit":"UnderlyingUnits", // Available values: Volume, Range, UnderlyingUnits, Renko, MomentumRange, PointAndFigure, OFARange
    "withHistogram": true | false
  },
  "timeRange": {
    // All fields in "timeRange" are optional, but at least any one is required
    "closestTimestamp":"2017-04-13T11:33Z",
    "closestTickId":123,
    "asFarAsTimestamp":"2017-04-13T11:33Z",
    "asMuchAsElements":66
  },
}
```

You can determine what fields and values to use based on the following tables:

#### ChartDescription Usage

| `chartDescripton` Field | Type | Remarks
|:---------|:-----|:-----|:-------
| `underlyingType` | `"Tick"`, `"DailyBar"`, `"MinuteBar"`, `"Custom"`, `"DOM"` | 
| `elementSize` | int | This is the size of a bar for the requested chart, in `elementSizeUnit` units.
| `elementSizeUnit` | `"Volume"`, `"Range"`, `"UnderlyingUnits"`, `"Renko"`, `"MomentumRange"`, `"PointAndFigure"`, `"OFARange"`

#### TimeRange Field Types

| `timeRange` Field | Type | Remarks
|:---------|:-----|:-----|:-------
| `` | number | 



## Response

```
{
    "bars": [ // "bars" may contain multiple bar objects
        {
            "timestamp":"2017-04-13T11:00:00.000Z",
            "open":2334.25,
            "high":2334.5,
            "low":2333,
            "close":2333.75,
            "upVolume":4712,
            "downVolume":201,
            "upTicks":1333,
            "downTicks":82,
            "bidVolume":2857,
            "offerVolume":2056
        }
    ]
}
```

















# Retrieving an Access Token
To retrieve an Access Token we will need to make a request to the API. Below is the URL that you could use to initiate an `accessTokenRequest` operation on the Demo (simulation) environment:

```js
const URL = 'https://demo.tradovateapi.com/v1/auth/accessTokenRequest';
```

You'll need your login credentials and API Key information to make the request successfully. They will look like this:

```js
const credentials = {
    "name": "your_username",
    "password": "your_password_or_api_dedicated_password",
    "appId": "your_app_nickname",
    "appVersion": "1.0",
    "cid": 0,
    "sec": "your_api_secret"
}
```

Many of these are self-explanatory. In the case of dedicated API passwords, this is an API Key Config option you set when you setup your key. It is used to protect your real password, should the credentials become compromised. You can edit most of your key's settings later from the API Access section of the Trader Application, so don't worry too much about this yet. It is advised for testing, however, that you set your key's permissions to the highest available levels for each setting. You can always drop permissions you don't need later.

## Calling the `accessTokenRequest` Operation

The simplest way to try this with no overhead is by using cURL:

```
curl -X 'POST' \
  'https://demo.tradovateapi.com/v1/auth/accesstokenrequest' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "string",
  "password": "string",
  "appId": "string",
  "appVersion": "string",
  "deviceId": "string",
  "cid": 0,
  "sec": "string"
}'
```

But many applications use JavaScript:

```js
/**
 * Call the `/auth/accessTokenRequest` endpoint.
 * 
 * @param {{ name: string, password: string, appId: string, appVersion: string, deviceId: string, cid: number, sec: string }} credentials 
 * @returns {Promise<{ errorText: string } | { accessToken: string, expirationTime: string, passwordExpirationTime: string, userStatus: 'Active' | 'Closed' | 'Initiated' | 'TemporarilyLocked' | 'UnconfirmedEmail', userId: number, name: string, hasLive: boolean }>}
 */
async function accessTokenRequest(credentials) {
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }

    let response

    try {
        response = await fetch('https://demo.tradovateapi.com/v1/auth/accesstokenrequest', config)
        response = await response.json()
    } catch (err) {
        console.error(err)
    }

    return response
}
```

---

[{% include chev-left.html %} REST Guide]({{site.baseurl}}/rest-guide/){: .btn .btn-blue .text-grey-lt-000 }
[Constructing Headers {% include chev-right.html %}]({{site.baseurl}}/rest-guide/construct-headers){: .btn .float-right .btn-blue .text-grey-lt-000 }

---



# How to Construct Your HTTP Headers
Aside from the [`/auth/accessTokenRequest`]({{site.baseurl}}/all-ops/auth/accesstokenrequest) operation, the API should know how to construct our HTTP headers. Luckily this is very simple. Let's strip away the pre-built implementation and work with the browser's built in `fetch` function.

```js
aysnc function main() {
    const resp = await fetch('https://demo.tradovateapi.com/v1/auth/accessTokenRequest', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })

    const json = await resp.json()

    console.log(json)
}
```

This is an expansion of what the `accessTokenRequest` built-in function actually does. As we see, the `fetch` method takes a config object as its second parameter. In this object you may specify the `headers` field to include the headers necessary to complete your requests.

## Authorization
For the Access Token request, we don't need to include any Authorization headers. But for nearly every other API call, we will need to include our Access Token as a part of the Authorization header.

```js
async function main() {
    const resp = await fetch('https://demo.tradovateapi.com/v1/account/list', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myAccessToken}`
        }
    })

    const json = await resp.json()

    console.log(json)
}
```

We must use the 'Bearer' schema for our Authorization header. For every call other than the initial `accessTokenRequest`, we should use these headers. Here's a helper function to construct these headers with a single call. It will also only include the Authorization header if an `accessToken` is provided.

### `buildHeaders` Helper Function

```js
export function buildHeaders(accessToken) {
    let auth = {}
    if(accessToken) {
        auth = { Authorization: `Bearer ${accessToken}` }
    }

    return {
        headers: {
            ...auth,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
}
```

---

[{% include chev-left.html %} Requesting API Access]({{site.baseurl}}/rest-guide/access-token-request){: .btn .btn-blue .text-grey-lt-000 }
[Device IDs {% include chev-right.html %}]({{site.baseurl}}/rest-guide/device-id){: .btn .float-right .btn-blue .text-grey-lt-000 }

---





# How to Use Device IDs Properly
You may have noticed the `deviceId` field in the body of `/auth/accessTokenRequest`. This is a very important part of obtaining an access token - on simulation mode, device IDs aren't strictly enforced - you can trade with an Access Token that was acquired with an unverified/no device ID; LIVE mode strictly enforces that you use a verified device for trading (so that some stranger with your credentials can't place trades using an account you own). This is a good thing!

To understand device IDs, let's discuss their properties and usage.

## Properties of a Device ID
A proper Device ID must possess two qualities:
1. The ID must be unique. No other device can possess the same ID. 
2. The ID must always be the same for a given device. PC `A` must always have the same ID, but unique from from PC `B`'s ID.

These traits are understandable - each device must be identifiable in order to be eligible for authorization to make real-money trades.

## How Can I Create a Device ID?
There are several ways that we can create device IDs. Here are a two that rely on the third party softwares `device-uuid` ([here](https://www.npmjs.com/package/device-uuid)) and `crypto-browserify` ([here](https://www.npmjs.com/package/crypto-browserify)) respectively.

### Using `device-uuid`
```js
/**
 * Derive a device ID from credentials and app secret using the device-uuid package.
 * @returns {Promise<string>}
 */
async function createDeviceId_DeviceUUID(mySecret, credentials) {
    const deviceId = new DeviceUUID()
    return deviceId.get({ 
        secret: mySecret, 
        name: credentials.name,
        password: credentials.password
    })
}
```

### Using `crypto-browserify`
```js
/**
 * Derive a device ID from credentials and app secret using the crypto-browserify package.
 * @returns {Promise<string>}
 */
async function createDeviceId_CryptoBrowserify(mySecret, credentials) {
    return createHash('sha256')
        .update(mySecret)
        .update(credentials.name)
        .update(credentials.password)   
        .digest('hex')
}
```

### Usage with Credentials
We can mix our Device ID into our `credentials` object before we send the `accessTokenRequest`:
```js
//a value unique to your application that we can use to hash our device IDs
//this will always have the same value (unless you change the phrase)
const mySecret = createHash('sha256')
    .update('My Special Pass-Phrase')
    .digest('hex') 

const deviceId = await createDeviceId_CryptoBrowserify(credentials)

const credsWithId = { ...credentials, deviceId }

const userAccessData = API.auth.accessTokenRequest({ credentials: credsWithId })
```

### Try it! Generate an ID
*\*Uses the `device-uuid` package.*{: .fs-2 }
<script src="{{ 'assets/js/gen-id.js' | relative_url }}"></script>

---
[{% include chev-left.html %} How to Construct Headers]({{site.baseurl}}/rest-guide/construct-headers){: .btn .btn-blue .text-grey-lt-000 }
[Renewing Your Access Token {% include chev-right.html %}]({{site.baseurl}}/rest-guide/renewing-access){: .btn .float-right .btn-blue .text-grey-lt-000 }

---





# Place An Order via REST API
The most straightforward way to place an order is to just use the `fetch` function built-in to any browser.

```js
async function placeOrder(config) {
    const { accessToken } = Storage.getUserData()
    const { accountSpec, accountId, symbol, orderQty, isAutomated, action, orderType } = config

    let response

    try {
        await response = fetch('https://demo.tradovateapi.com/v1/order/placeOrder', {
            method: 'POST',
            headers: buildHeaders(accessToken),
            body: JSON.stringify({
                accountSpec,
                accountId,
                symbol,
                orderQty,
                isAutomated,
                action,
                orderType
            })
        }) 
        response = await response.json()
    } catch(err) {
        console.error(err)
    }

    return response
} 
```


---

[{% include chev-left.html %} Storing User Data]({{site.baseurl}}/rest-guide/storing-user-data){: .btn .btn-blue .text-grey-lt-000 }
[Entity System {% include chev-right.html %}]({{site.baseurl}}/entity-system){: .btn .float-right .btn-blue .text-grey-lt-000 }

---




# Renewing Your Access Token
Over the course of the development process, you'll eventually encounter your token reaching it's expiration time. Once a token has exceeded its expiration, REST calls made using it will return 400 or 401 errors. If the token is within a few minutes of expiration we should call [`/auth/renewAccessToken`]({{site.baseurl}}/all-ops/auth/renewaccesstoken).

### Calling `/auth/renewAccessToken` 
Renewing your access token is much easier than retrieving the original. It's a simple `GET` request with no parameters, it simply relies on including the token in the Authorization header of the request. We can use the `buildHeaders` function which we defined in a [previous auth section]({{site.baseurl}}/rest-guide/construct-headers/#buildheaders-helper-function) to create the expected headers.

```js
async function renewAccessProcedure(token) {
    const headers = buildHeaders(token)
    let response

    try {
        response = await fetch('https://demo.tradovateapi.com/v1/auth/renewAccessToken', {
            method: 'GET',
            headers 
        })
        response = await response.json()
    } catch(err) {
        console.error(err)
    }

    return response
}
```

[{% include chev-left.html %} Using Device IDs]({{site.baseurl}}/rest-guide/device-id){: .btn .btn-blue .text-grey-lt-000 }
[Place An Order {% include chev-right.html %}]({{site.baseurl}}/rest-guide/place-an-order){: .btn .float-right .btn-blue .text-grey-lt-000 }



# REST Guide
## Introduction
In this section we'll be discussing the endpoints related to gaining Access to the API, and using the REST portion of the API. Before we can begin calling operative endpoints on the API, we will need to ask the API for an Access Token. We need to understand how Device IDs work, and how to construct our HTTP headers. We'll also need to periodically renew our Access Token for sessions that range beyond its original expiration.

## REST API Facts
Before you begin using the Tradovate REST API, there are a few things you should keep in mind:
- Our API does not mandate method protocols. However, we do recommend the `GET` method for requests with query parameters (or no parameters), and the `POST` method for requests with JSON bodies. 
- Both `'Accept'` and `'Content-Type'` headers can be set to the `'application/json'` MIME type. We'll discuss the `'Authorization'` header soon.
- We offer an OpenAPI Specification for the REST API. Look at the [main page's download buttons]({{site.baseurl}}/#download-the-openapi-spec) - we have both JSON and YAML versions available.
- The REST API is partitioned into two parts - DEMO and LIVE. They are virtually identical but each correspond to their respective trading environment. You can access a different environment via API by changing the prefix on the `tradovateapi.com` domain (`demo.tradovateapi.com`, `live.tradovateapi.com`).

## Common Pitfalls
- Always 404 for entities you know exist? Double check your URL prefix. It is likely you're accessing the wrong environment.
- Always 401 beyond `accessTokenRequest`? Check your API Key permissions in the Trader Application's API Settings tab. The default settings for API Keys is to have each permission domain set to be inaccessible.

---

[{% include chev-left.html %} Getting Started]({{site.baseurl}}/getting-started){: .btn .btn-blue .text-grey-lt-000 }
[Access Token Request {% include chev-right.html %}]({{site.baseurl}}/rest-guide/access-token-request){: .btn .float-right .btn-blue .text-grey-lt-000 }











# All Operations




## Auth Operations



## Cash Balance











Here you can find all of the operations that are shared across Entity types. With some limitations, these endpoints are valid for any Entity. See the detail-pages and the [Entities' Shared Ops]({{site.baseurl}}/entity-system/shared-ops) section of the guide for more info about using the shared operations.









## WebSocket Playground
<div id="tdv-playground" class="tdv-socket-box">
    <select id="url-selector">
        <option>wss://demo-d.tradovateapi.com/v1/websocket</option>
        <option>wss://live-d.tradovateapi.com/v1/websocket</option>
        <option>wss://md-d.tradovateapi.com/v1/websocket</option>
        <option>wss://replay-d.tradovateapi.com/v1/websocket</option>
    </select>
    <button id="start-socket-btn" style="font-family: Montserrat, sans-serif;" class="btn btn-red">Connect</button>
    
    <label><h4 style="border-bottom: 1px solid #eeebee;">OUTPUT</h4></label>
    <div class="tdv-msg-output">
        <figure class="tdv-msgs">
            <pre>
                <ul id="tdv-responses-list">
                </ul>
            </pre>
        </figure>
    </div>

    <label for="send-text"><h4 style="border-bottom: 1px solid #eeebee;">INPUT</h4></label>
    <div class="tdv-msg-input">
        <figure>
            <pre id="send-text" contentEditable>



            </pre>
        </figure>
        <hr/>
        <button id="build-btn" style="font-family: Montserrat, sans-serif;" class="btn" disabled>Generate Message</button>
        <button id="send-btn" style="font-family: Montserrat, sans-serif;" class="btn btn-green">Send</button>
        <label class="checker" style="font-family: Montserrat, sans-serif;" for="show-heartbeats">Show Heartbeats
            <input id="show-heartbeats" type="checkbox" checked="checked" />
            <span class="checker-inner"></span>
        </label>
    </div>
    
    <div id="palette" class="tdv-ws-palette">
        <h4 style="border-bottom: 1px solid #eeebee;">PARAMS</h4>
        <section id="palette-buttons"></section>
        <h4>COMMAND PALETTE</h4>
        <section id="palette-options"></section>
    </div>
</div>

<script src="{{ '/assets/js/playground.js' | relative_url }}"></script>






<div id="vendor-warning"></div>

## `/userPlugin/addEntitlementSubscription`
This operation is used to add an entitlement to an organization member.

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `entitlementId` | `required`{: .label .label-red } | number, `int64` | The ID of the Entitlement to add. For things like TradingView, for example, a team member will assist by creating an entitlement unique to your organization for the given Entitlement.
| `creditCardId` | `none`{: .label } | number, `int64` | ID of credit card to use for the transaction. Unless users are footing the bill, this should probably not be present.
| `accountId` | `none`{: .label } | number, `int64` | ID of account to use for the transaction. This should be the ID of a LIVE organization `DATA` account.
| `userId` | `none`{: .label } | number, `int64` | User to add the entitlement to. If not specified, this will default to your admin user. Typically, the intention is to add it for a user, so in practice the ID is required.

### Response
[AccessTokenResponse]({{site.baseurl}}/entity-system/entity-index/accesstokenrequest)







<div id="vendor-warning"></div>

## `/user/addMarketDataSubscription`
This operation is used to:
- Cancel [TradovateSubscription]({{site.baseurl}}/entity-system/entity-index/TradovateSubscription)s, [MarketDataSubscription]({{site.baseurl}}/entity-system/entity-index/marketdatasubscription)

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `userId` | `required`{: .label .label-red } | number, `int64` | The ID of the associated [User]({{site.baseurl}}/entity-system/entity-index/user) to assign the permission to.
| `accountId` | `required`{: .label .label-red } | number, `int64` | The ID of the simulation [Account]({{site.baseurl}}/entity-system/entity-index/account) to assign permission.


### Response

#### Object

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `tradingPermission` | `required`{: .label .label-red } | [TradingPermission]({{site.baseurl}}/entity-system/entity-index/tradingpermission) | Created trading permission.










<div id="vendor-warning"></div>

## `/user/cancelEverything`
This operation is used to:
- Cancel [TradovateSubscription]({{site.baseurl}}/entity-system/entity-index/tradovatesubscription)s, [MarketDataSubscription]({{site.baseurl}}/entity-system/entity-index/MarketDataSubscription)s, and [UserPlugin]({{site.baseurl}}/entity-system/entity-index/userplugin)s from the LIVE environment.
- Cancel [TradingPermission]({{site.baseurl}}/entity-system/entity-index/tradingpermission)s from the Simulation environment.

### Request Body

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `userIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | An array of IDs of each [User]({{site.baseurl}}/entity-system/entity-index/user) entity to cancel.

### Response
#### Object

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `tradingPermissionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [TradingPermission]({{site.baseurl}}/entity-system/entity-index/tradingpermission)s were cancelled. Should be populated from Simulation requests only.
| `marketDataSubscriptionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [MarketDataSubscription]({{site.baseurl}}/entity-system/entity-index/marketdatasubscription)s were cancelled. Should be populated from LIVE requests only.
| `tradovateSubscriptionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [TradovateSubscription]({{site.baseurl}}/entity-system/entity-index/tradovatesubscription)s were cancelled. Should be populated from LIVE requests only.
| `userPluginIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [UserPlugin]({{site.baseurl}}/entity-system/entity-index/userplugin)s were cancelled. Should be populated from LIVE requests only.











<div id="vendor-warning"></div>





<div id="vendor-warning"></div>

## `/user/createTradingPermission`
This operation is used to create a [TradingPermission]({{site.baseurl}}/entity-system/entity-index/tradingpermission) from a `userId` and and `accountId`.

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `userId` | `required`{: .label .label-red } | number, `int64` | The ID of the associated [User]({{site.baseurl}}/entity-system/entity-index/user) to assign the permission to.
| `accountId` | `required`{: .label .label-red } | number, `int64` | The ID of the simulation [Account]({{site.baseurl}}/entity-system/entity-index/account) to assign permission.


### Response

#### Object

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `tradingPermission` | `required`{: .label .label-red } | [TradingPermission]({{site.baseurl}}/entity-system/entity-index/tradingpermission) | Created trading permission.




















<div id="vendor-warning"></div>





<div id="vendor-warning"></div>









## `/userAccountAutoLiq/update`
































## `/order/placeOCO`
Use this operation to place an OCO type order (AKA. order-cancels-order, one-cancels-other).

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountSpec` | `none`{: .label } | string | This should be the name of the [Account]({{site.baseurl}}/entity-system/entity-index/account) placing the trade.
| `accountId` | `none`{: .label } `required`{: .label .label-yellow } | number | This is the Entity ID of the [Account]({{site.baseurl}}/entity-system/entity-index/account) being used to place the trade. Optional by the specification, however in practice this is a required field.
| `clOrdId` | `none`{: .label } | string | 
| `action` | `required`{: .label .label-red } | `"Buy"` `"Sell"` | Basic type of action this order represents.
| `symbol` | `required`{: .label .label-red } | string | The [Contract]({{site.baseurl}}/entity-system/entity-index/contract) symbol in regards to which this order is being placed.
| `orderQty` | `required`{: .label .label-red } | number | The number of contracts to buy or sell.
| `orderType` | `required`{: .label .label-red } | `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | The specific type of order being placed. More details on these below.
| `price` | `none`{: .label } | number | This is required for non-`"Market"` type orders.
| `stopPrice` | `none`{: .label } | number | Required for `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number | 
| `pegDifference` | `none`{: .label } | number | 
| `timeInForce` | `none`{: .label } | `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | The time that this order is valid for. See [this section]({{site.baseurl}}/entity-system/entity-index/orderversion#notes) for more details.
| `expireTime` | `none`{: .label } | Date string | Required for orders using the `"GTD"` `timeInForce` property.
| `activationTime` | `none`{: .label } | Date string | 
| `customTag50` | `none`{: .label } | string | Used by the Trader UI to show custom descriptions.
| `isAutomated` | `none`{: .label } | boolean | Must be `true` if the order was not placed by a human clicking a button.
| `other` | `required`{: .label .label-red } | [RestrainedOrderVersion]({{site.baseurl}}/entity-system/entity-index/restrainedorderversion) | The paired order - if the entry order is filled the `other` will be cancelled, and vice-versa.

### Response
[PlaceOCOResult]({{site.baseurl}}/entity-system/entity-index/placeocoresult)

### Example






## `/order/placeOrder`
Use this operation to make a request to place an order. 

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountSpec` | `none`{: .label } | string | This should be the name of the [Account]({{site.baseurl}}/entity-system/entity-index/account) placing the trade.
| `accountId` | `none`{: .label } `required`{: .label .label-yellow } | number | This is the Entity ID of the [Account]({{site.baseurl}}/entity-system/entity-index/account) being used to place the trade. Optional by the specification, however in practice this is a required field.
| `clOrdId` | `none`{: .label } | string | 
| `action` | `required`{: .label .label-red } | `"Buy"` `"Sell"` | Basic type of action this order represents.
| `symbol` | `required`{: .label .label-red } | string | The [Contract]({{site.baseurl}}/entity-system/entity-index/contract) symbol in regards to which this order is being placed.
| `orderQty` | `required`{: .label .label-red } | number | The number of contracts to buy or sell.
| `orderType` | `required`{: .label .label-red } | `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | The specific type of order being placed. More details on these below.
| `price` | `none`{: .label } | number | This is required for non-`"Market"` type orders.
| `stopPrice` | `none`{: .label } | number | Required for `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number | 
| `pegDifference` | `none`{: .label } | number | 
| `timeInForce` | `none`{: .label } | `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | The time that this order is valid for. See [this section]({{site.baseurl}}/entity-system/entity-index/orderversion#notes) for more details.
| `expireTime` | `none`{: .label } | Date string | Required for orders using the `"GTD"` `timeInForce` property.
| `activationTime` | `none`{: .label } | Date string | 
| `customTag50` | `none`{: .label } | string | Used by the Trader UI to show custom descriptions.
| `isAutomated` | `none`{: .label } | boolean | Must be `true` if the order was not placed by a human clicking a button.

### Response
[PlaceOrderResult]({{site.baseurl}}/entity-system/entity-index/placeorderresult)

### Example

```js
const URL = 'https://demo.tradovateapi.com/v1' //or live

//here are some props we can share across our orders for this example
const baseBody = {
    accountSpec: yourAcctName,  //controls the label in the Trader UI 
    accountId: yourAcctId,      //ID of Account to trade
    symbol: "ESU3",             //contract symbol
    orderQty: 1,                //number of contracts to trade
    isAutomated: true           //must be true if this isn't an order made directly by a human
}

//market order requires none of the optional parameters
const marketBody = {
    ...baseBody,
    action: 'Buy',
    orderType: 'Market'
} 

//we need a stopPrice for a stop order
const stopBody = {
    ...baseBody,
    action: 'Sell',
    orderType: 'Stop',
    stopPrice: 3888.25
}

//just the same as Stop order, but orderType matches
const trailingStopBody = {
    ...baseBody,
    action: 'Stop',
    orderType: 'TrailingStop',
    stopPrice: 3888.25          //will keep a max distance of (positionPrice - stopPrice)
}

//use the price parameter for limit orders
const limitBody = {
    ...baseBody,    
    action: 'Sell',
    orderType: 'Limit',
    price: 3891.25,             //use for single value like limit or stop
    
}

const response = await fetch(URL + '/order/placeorder', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${myAccessToken}`,
    },
    body: JSON.stringify(marketBody) //replace with any of above request bodies
})

const json = await response.json() //=> { orderId: 0000000 }

```

#### Related
- [`/order/modifyOrder`]({{site.baseurl}}/all-ops/order/modifyorder)
- [`/order/cancelOrder`]({{site.baseurl}}/all-ops/order/cancelorder)
- [`/order/liquidatePosition`]({{site.baseurl}}/all-ops/order/liquidateposition)





## `/order/placeOSO`
Use this operation to place an OSO type order (AKA. order-sends-order, one-sends-other).

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountSpec` | `none`{: .label } | string | This should be the name of the [Account]({{site.baseurl}}/entity-system/entity-index/account) placing the trade.
| `accountId` | `none`{: .label } `required`{: .label .label-yellow } | number | This is the Entity ID of the [Account]({{site.baseurl}}/entity-system/entity-index/account) being used to place the trade. Optional by the specification, however in practice this is a required field.
| `clOrdId` | `none`{: .label } | string | 
| `action` | `required`{: .label .label-red } | `"Buy"` `"Sell"` | Basic type of action this order represents.
| `symbol` | `required`{: .label .label-red } | string | The [Contract]({{site.baseurl}}/entity-system/entity-index/contract) symbol in regards to which this order is being placed.
| `orderQty` | `required`{: .label .label-red } | number | The number of contracts to buy or sell.
| `orderType` | `required`{: .label .label-red } | `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | The specific type of order being placed. More details on these below.
| `price` | `none`{: .label } | number | This is required for non-`"Market"` type orders.
| `stopPrice` | `none`{: .label } | number | Required for `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number | 
| `pegDifference` | `none`{: .label } | number | 
| `timeInForce` | `none`{: .label } | `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | The time that this order is valid for. See [this section]({{site.baseurl}}/entity-system/entity-index/orderversion#notes) for more details.
| `expireTime` | `none`{: .label } | Date string | Required for orders using the `"GTD"` `timeInForce` property.
| `activationTime` | `none`{: .label } | Date string | 
| `customTag50` | `none`{: .label } | string | Used by the Trader UI to show custom descriptions.
| `isAutomated` | `none`{: .label } | boolean | Must be `true` if the order was not placed by a human clicking a button.
| `bracket1` | `required`{: .label .label-red } | [RestrainedOrderVersion]({{site.baseurl}}/entity-system/entity-index/restrainedorderversion) |
| `bracket2` | `none`{: .label } | [RestrainedOrderVersion]({{site.baseurl}}/entity-system/entity-index/restrainedorderversion) | Optional bracket. Use a single bracket for only stop-loss or take-profit alone. Use both brackets to set up stop-loss and take-profit orders.

### Response
[PlaceOSOResult]({{site.baseurl}}/entity-system/entity-index/placeosoresult)

### Notes

















## `/auth/accessTokenRequest`
This operation is used to retrieve an access token using your API Key and Tradovate credentials.

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `name` | `required`{: .label .label-red } | string | Your Tradovate Username.
| `password` | `required`{: .label .label-red } | string | Your Tradovate Password.
| `appId` | `required`{: .label .label-red } | string | This should match the application nickname you chose when you created your API key
| `appVersion` | `required`{: .label .label-red } | string | Arbitrary string that you can use to track your software version
| `cid` | `required`{: .label .label-red } | number | The entity ID of your Client Application API Key. This will be displayed upon key creation, and above the corresponding API key in the Trader UI.
| `sec` | `required`{: .label .label-red } | string | The API Secret, displayed only one time upon key creation. If you fail to record this value or lose this value it cannot be recovered, and you must create a new API Key. 
| `deviceId` | `none`{: .label } | string | Important value that identifies the device used to make this login attempt. Although any device may request an access token, only approved devices may trade Live Accounts. See the [Device ID]({{site.baseurl}}/auth-guide/device-id) section for more details.

### Response
[AccessTokenResponse]({{site.baseurl}}/entity-system/entity-index/accesstokenresponse)

### Example
```js
const credentials = {
    name: 'Your Tradovate Username',
    password: 'Your Tradovate Password',
    appId: 'Sample App',
    appVersion: '1.0',
    cid: 0,
    sec: '12345-abcde-...'
}

async function accessTokenRequest() {
    let response, data
    try {
        response = await fetch('https://live.tradovateapi.com/v1/auth/accessTokenRequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
}
```





# Using OAuth for Your Tradovate Application's Authentication
In this short tutorial, we will cover using the OAuth service to authenticate users for your application. Authenticating your application
via OAuth for Tradovate is a three step process.

1. We navigate to a special OAuth URL using our client id and client secret, which will be supplied by Tradovate. We present our 
Tradovate credentials here.
2. After presenting our credentials, we will be redirected to a supplied redirect URL, but a single-use code will be in the URL query.
Our server must extract the code from the query so we can use it in step 3.
3. We exchange the extracted code for our access token, and we are officially an authenticated entity.

# Getting Setup
We will be starting this project from scratch, however the complete solution is also provided in this repo so feel free to run it.
If you're following along from scratch, boot up a command terminal and navigate to a directory of your choosing. Run the following commands:

```sh
mkdir oauth-example
cd oauth-example
yarn init
```

Follow the prompts after `init`. There's nothing wrong with simply using the defaults. We will need some utilities to help us complete
this project. Let's add those as well:

```sh
yarn add dotenv express express-session node-cache request request-promise-native
```

This seems like a lot, but it's actually quite bare-bones.
* `dotenv` allows us to store some variables locally. I'll be using it to show how to hide our client secret.
* `express` and `express-session` are mainstream server-components. Express gives our server typical routing capabilities. `express-session`
allows us to use user-specific session data in our express routes.
* `node-cache` is a simple stand-in for a database (for our dev purposes, in reality use a database).
* Finally `request` and `request-promise-native` allow us to send requests from the backend asynchronously like we would on the front end.

Now that our dependencies are in order, let's add our environment variables file. Create a new file called `.env`.

```
CLIENT_ID=1
CLIENT_SECRET='your_client_secret'
```

Replace the values with your special client variables, provided to you by Tradovate.

Next we'll add our `index.js` file:

```js
//index.js
require('dotenv').config()
const express = require('express')
const request = require('request-promise-native')
const NodeCache = require('node-cache')
const session = require('express-session')
const app = express()

const PORT = 3030

//this is a replacement for a database in this example. 
//Use a database or some storage solution in a real world app.
const all_tokens = new NodeCache({ deleteOnExpire: true })

//in order to use process.env, we must also create a .env file. 
//This is not included in the example code for security reasons. 
//See the tutorial for details on how to format the variables in the .env file.
const CLIENT_ID     = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI  = `http://localhost:3030/oauth/tradovate/callback`
const EXCHANGE_URL  = `https://live.tradovateapi.com/auth/oauthtoken`
const AUTH_URL      = `https://trader.tradovate.com/oauth`

// ROUTES ---------------------------------------------------------------------

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.write(`<h2>Tradovate OAuth</h2>`)
    res.end()
})

// ENTRY ----------------------------------------------------------------------

app.listen(PORT, () => console.log(`Starting your app on http://localhost:${PORT}`))

```

We import our dependencies using the standard node `require`. We'll be using port 3030 for our examples. We also initialize
our node-cache database stand-in. Then we pull our data from the `.env` file using node's `process.env` property. This allows us
to obfuscate our client id and client secret - if you add `.env` to your `.gitignore` ledger, it won't even show up on github. Now
nobody can steal our credentials. 

In the `ROUTES` section, we setup a simple home route that just sends back an HTML heading with our title inside. We will use this route 
later to fork our login logic, but for now this will suffice. Finally, we start the app up by `listen`ing on port 3030. 

To run the app, we could call `node index.js` from the terminal. But if you'd rather call `yarn start`, add this script to your `package.json`:

```js
{
//...
    "scripts": {
        "start": "node index.js"
    },
//...
}
```
Now we can start our app by calling `yarn start`. We should see 'Starting your app on http://localhost:3030' logged to the terminal, and navigating to
`localhost:3030` should yield your 'Tradovate OAuth' heading if it works.

# Starting the OAuth Flow
In order to start the OAuth flow, we must first redirect our users to a constructed OAuth link. This link needs to contain our client id
and a redirect URI - the URI for our server's OAuth callback. Let's build our URL now:

```js
//construct our authorization code request URL
const authUrl =
    AUTH_URL 
    + `?response_type=code` 
    + `&client_id=${encodeURIComponent(CLIENT_ID)}` 
    + `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`

```
Now we need to change our route code. Add a new route for `'/auth'`:

```js
app.get('/auth', (_, res) => {
    res.redirect(authUrl)
})
```

We perform a simple redirect to our constructed `authUrl`. Then in the `'/'` route:

```js
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.write(`<h2>Tradovate OAuth</h2>`)
    res.write(`<a href="/auth"><h3>Click to Authenticate</h3></a>) //<-- add this link

    res.end() 
})
```
We've added an anchor element to our response HTML that will hit the `'/auth'` endpoint that we just created.

# The Callback
When we run the code we created, our flow will go like this:

* The page loads, we hit the `'/'` endpoint. Our heading and anchor render.
* We click the anchor, which hits the `'/auth'` endpoint. This redirects us to the constructed OAuth URL.
* We see the Tradovate Login screen! So far so good. We present our credentials. And...

Nothing ever happens. Or we get an error from express saying `cannot /GET`. That's because we never setup a route
for our callback. 

What happens when we present our Tradovate credentials is basically this - your app asks for confirmation that your web identity is accurate. If your user can satisfy the request, the client will receive a single-use code as a response. The response is sent to the `REDIRECT_URI` address that we specified at the top of the file. The actual `code` parameter comes to us in the form of the URL query. We can access this using the express Request object (any `req` parameter within in a route callback).

Back in our `ROUTES` section, add a new route:

```js
app.get('/oauth/tradovate/callback', async (req, res) => {
    if (req.query.code) {
        //req.query.code is the data we've extracted from the URL
        const credentials = {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: req.query.code
        }

        //Alright we have a code. How can we exchange our credentials?

    }
})
```

We use the `req` callback parameter's `query` field to access parts of the URL query from code. If it's there, we can easily extract it and  put it into an object. We will use these `credentials` in our exchange. Now how can we go about doing that?

We're provided with a URL to exchange our code for a token, https://live.tradovate.com/auth/oauthtoken. We can send a POST request to that address with our `credentials` object in the request form. If all is well, we should be granted an access token. We'll write a utility function to help us exchange our code:

```js
const exchangeCode = async (userId, form) => {
    try {
        //make a post request with our credentials as the form to the tradovate oauth token exchange endpoint
        const responseBody = await request.post(EXCHANGE_URL, { form })
        
        //if we got a token
        const token_data = JSON.parse(responseBody)
        //check it for errors
        if(token_data.error) {
            console.error(`Code Exchange Error: [${token_data.error}] ${token_data.error_description}`)
            return
        }
        //else save the token and expiry
        all_tokens.set(userId, token_data.access_token, token_data.expires_in)
    } catch (e) {
        //catch non-internal errs
        console.error(`Code Exchange failed.`)
        return JSON.parse(e.response.body)
    }
}
```

Our `exchangeCode` function is an asynchronous function, meaning we can use it with the async/await API. It takes two parameters. `userId` is the `sessionID` field of our request. This is preset for us via `express-session` middleware that we setup in the Getting Setup section. The `form` parameter will be the `credentials` object we created in our callback route.

We use another of our modules, the `request` module, to make our POST request. This is where we pass in our URL and our `form` parameter. We `try` to parse the response JSON. If we got a standard response, it could have one of two formats. Either we got a token and it has the `access_token` and `expires_in` fields, or we received the error form with `error` and `error_description` fields. We can account for both here. If we did have a token, we will save the token to our pseudo-database (keep in mind this cache is cleared on each restart). If there was some other unrelated error, it will be caught in the `catch` block.

Now let's utilize that function in our callback:

```js
app.get('/oauth/tradovate/callback', async (req, res) => {
    if (req.query.code) {
        //req.query.code is the data we've extracted from the URL
        const credentials = {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: req.query.code
        }

        //Now we know what to do...
        //exchange the retrieved code for our real token and store it
        await exchangeCode(req.sessionID, credentials)

        //if all is well, we should be authorized to see the authenticated home screen now, so redirect to origin
        res.redirect(`/`)
    }
})
```

If we run the program now, we'll have our typical flow. But when we submit our credentials, we will be redirected to the home page. There's
only one problem with that - we haven't forked our logic for the authorized and unauthorized use cases. We'll simply be presented with the 
click-to-authenticate screen again. Let's fix that by splitting up our logic. We can write a helper to cover the case that we're authenticated:

```js
//write out HTML to display the result of `/me` endpoint
const showMe = async (_, res, accessToken) => {
    const me = JSON.parse(await request('https://live-api-d.tradovate.com/auth/me', {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    }))

    //in case of a non trivial amount of HTML, use a template file or one of node's many supported rendering engines.
    res.write(`<h2>Welcome, ${me.fullName}</h2>`)
    res.write(`<p>ID: ${me.userId}</p>`)
    res.write(`<p>email: ${me.email}</p>`)
    res.write(`<p>verified?: ${me.emailVerified}</p>`)
    res.write(`<p>trial?: ${me.isTrial}</p>`)
}
```

To determine if we're authenticated, let's write another helper to get our token:

```js
//retrieve stored token by sessionID, in reality hit the database for this info (this is why we sim async for sync operation)
const getAccessToken = async (userId) => {
    return all_tokens.get(userId)
}
```
Normally, you'd want to store and retrieve this info with a database, which is why I've chosen to simulate this as an asynchronous
operation (even though accessing our cache is synchronous). 

Now we're equipped to split our home page logic for authorized and unauthorized users:

```js
app.get('/', async (req, res) => {

    // we're sending HTML
    res.setHeader('Content-Type', 'text/html')
    res.write(`<h2>Tradovate OAuth</h2>`)

    //check our token
    const accessToken = await getAccessToken(req.sessionID)

    if (accessToken) {
        //I have a token! Show me `/me`
        await showMe(req, res, accessToken)
    } else {
        //I don't have a token. Show me how to get one.
        res.write(`<a href="/auth"><h3>Click to Authenticate</h3></a>`)
    }

    //done writing
    res.end()
})
```
If we run through our usual flow, we'll get a response and be redirected home. Our logic should now be properly split and will show the results of `'/me'` from
the Tradovate backend.

# Logout
There's just one loose end left to take care of. We need to add some logout logic. Let's add one more route:

```js
app.get('/logout', (req, res) => {
    all_tokens.del(req.sessionID)
    res.redirect('/')
})
```

In a real world app, you'd probably clear the token from your database. In our example we can simply delete the token associated with the client's `sessionID`.
Now we just need to add an extra line to our `showMe` function:

```js
const showMe = async (req, res, accessToken) => {
    //...
    res.write(`<h2>Tradovate OAuth</h2>`)
    res.write(`<a href="/logout"><h3>Logout</h3></a>`) //<-- add this
    //...
}
```
We can successfully logout using this new anchor after our usual flow.







## `/auth/renewAccessToken`
This operation is used to renew an API session's expiration time.

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
|  `<none>`| `none`{: .label } | `<none>` | *(Simple GET request)*

### Response
[AccessTokenResponse]({{site.baseurl}}/entity-system/entity-index/accesstokenresponse)

### Example

```js
async function renewAccessToken() {
    let response, data
    try {
        //you'll need to have an access token stored that you want to renew
        const accessToken = myRetrieveAccessTokenFromStorageFn()
        response = await fetch('https://live.tradovateapi.com/v1/auth/renewAccessToken', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`.
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
}
```









### Notes
Example `expression`:
```
{
    "conjuction":"OR",
    "conditions":[
        {
            "l":"percentChange",
            "op":">",
            "r":"0.27506876719179796",
            "rf":"0.28",
            "subj":"ESH3"
        },
        {
            "l":"posOpenPLUsd",
            "op":">",
            "r":"100",
            "subj":"[object Object]|ESH3"
        },
        {
            "l":"cashAmount",
            "op":"<",
            "r":"47400",
            "subj":"DEMO15460"
        }
    ]
}
```

















<div id="vendor-warning"></div>





<div id="vendor-warning"></div>





<div id="vendor-warning"></div>





## `/cashBalance/changeDemoBalance`
Change a Simulation [Account]({{site.baseurl}}/entity-system/entity-index/account)'s cash balance.

#### Related
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [`/userAccountAutoLiq/update`]({{site.baseurl}}/all-ops/useraccountautoliq/update)

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountId` | `required`{: .label .label-red } | number, `int64` | SIM [Account]({{site.baseurl}}/entity-system/entity-index/account) to change.
| `cashChange` | `required`{: .label .label-red } | number, double | Cash amount to change balance by. Accepts negative numbers for negative balance changes.

### Notes
<div id="once-daily-warning"></div>

- When using this operation, be aware that the associated [AccountRiskStatus]({{site.baseurl}}/entity-system/entity-index/accountriskstatus)'s `maxNetLiq` field will be affected by this change. If you add $1,000.00 to an account with a Trailing Max Drawdown applied, the drawdown level will move accordingly.





## `/cashBalance/getcashbalancesnapshot`
Get a snapshot of an [Account]({{site.baseurl}}/entity-system/entity-index/account)'s cashbalance. This call is best suited for one-shot requests to display some instant data, but not for developing a real-time stream.
<div id="no-polling"></div>





<div id="vendor-warning"></div>

## `/account/resetDemoAccountState`
Reset one or more accounts' state to its Start-of-day state on a given [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate)

#### Related
- [cashbalance/changeDemoBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance/changedemobalance)

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountIds` | `required`{: .label .label-red } | Array<int> | A list of [Account]({{site.baseurl}}/entity-system/entity-index/account) IDs to reset.
| `resetTradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | The [TradeDate]({{site.baseurl}}/entity-system/entity-index/TradeDate) session you want to reset these accounts' states to.





## `/{entity}/deps`
This operation is used to look up entities of this type that are dependent on another 'master' entity.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/deps?masterid={item_id}

  OR

https://demo.tradovateapi.com/v1/{entity}/deps?masterid={item_id}
```

And for WebSocket requests:

```
<entity>/deps
<msg_id>
masterid=<entity_id>

```

Example Usage:
```js
async function entityDeps(entityType, masterid) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/deps?masterid=${masterid}`

    const config
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityDeps('contractMaturity', 814)
//=>
// [
//   {
//     "id": 37215,
//     "productId": 814,
//     "expirationMonth": 201712,
//     "expirationDate": "2017-12-15T22:29Z",
//     "archived": false,
//     "seqNo": 10,
//     "isFront": false
//   },
//   {
//     "id": 37417,
//     "productId": 814,
//     "expirationMonth": 201803,
//     "expirationDate": "2018-03-16T21:29Z",
//     "archived": false,
//     "seqNo": 11,
//     "isFront": false
//   },
//   //...
// ]
```

### Notes

| `masterid` Entity Type | Related Entity Types
|:-------|:---------------------
| *(The entity type that should be used for `masterid` parameter)* | *(The operation's returned type)*
| [`Account`]({{site.baseurl}}/entity-system/entity-index/account) | [`CashBalance`]({{site.baseurl}}/entity-system/entity-index/cashbalance) [`CashBalanceLog`]({{site.baseurl}}/entity-system/entity-index/cashbalancelog) [`MarginSnapshot`]({{site.baseurl}}/entity-system/entity-index/marginsnapshot) [`AccountRiskStatus`]({{site.baseurl}}/entity-system/entity-index/accountriskstatus) [`UserAccountAutoLiq`]({{site.baseurl}}/entity-system/entity-index/useraccountautoliq) [`Position`]({{site.baseurl}}/entity-system/entity-index/position) [`Order`]({{site.baseurl}}/entity-system/entity-index/order) [`OrderStrategy`]({{site.baseurl}}/entity-system/entity-index/orderstrategy) [`User`]({{site.baseurl}}/entity-system/entity-index/user) [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit) 
| [`Command`]({{site.baseurl}}/entity-system/entity-index/command) | [`CommandReport`]({{site.baseurl}}/entity-system/entity-index/CommandReport) [`ExecutionReport`]({{site.baseurl}}/entity-system/entity-index/executionreport)
| [`Contract`]({{site.baseurl}}/entity-system/entity-index/contract) | [`ContractMaturity`]({{site.baseurl}}/entity-system/entity-index/contractmaturity)
| [`Product`]({{site.baseurl}}/entity-system/entity-index/product) | [`ProductMargin`]({{site.baseurl}}/entity-system/entity-index/productmargin) [`ContractMaturity`]({{site.baseurl}}/entity-system/entity-index/contractmaturity) `ProductSession`
| [`Order`]({{site.baseurl}}/entity-system/entity-index/order) | [`Command`]({{site.baseurl}}/entity-system/entity-index/command) [`OrderVersion`]({{site.baseurl}}/entity-system/entity-index/orderversion) [`Fill`]({{site.baseurl}}/entity-system/entity-index/fill)
| [`Exchange`]({{site.baseurl}}/entity-system/entity-index/Exchange) | [`Product`]({{site.baseurl}}/entity-system/entity-index/product)
| [`OrderStrategy`]({{site.baseurl}}/entity-system/entity-index/orderstrategy) | [`OrderStrategyLink`]({{site.baseurl}}/entity-system/entity-index/orderstrategylink)
| [`Fill`]({{site.baseurl}}/entity-system/entity-index/fill) | `FillFee` 
| [`Position`]({{site.baseurl}}/entity-system/entity-index/position) | [`FillPair`]({{site.baseurl}}/entity-system/entity-index/fillpair)
| [`User`]({{site.baseurl}}/entity-system/entity-index/user) | [`Account`]({{site.baseurl}}/entity-system/entity-index/account) [`TradingPermission`]({{site.baseurl}}/entity-system/entity-index/tradingpermission) [`ContactInfo`]({{site.baseurl}}/entity-system/entity-index/contactinfo)
| [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit) | [`UserAccountRiskParameter`]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)






## `/{entity}/find`
This operation is used to look up an entity that has a `name` field. Note that this operation will *only* work for entities with a `name` field. For example, `/position/find` is technically a valid operation but it will never return anything because [Position]({{site.baseurl}}/entity-system/entity-index/position) entities do not have a `name` field.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/find?name={entity_name}

  OR

https://demo.tradovateapi.com/v1/{entity}/find?name={entity_name}
```

And for WebSocket requests:

```
<entity>/find
<msg_id>
name=<entity_name>

```

Example Usage:
```js
async function entityFind(entityType, name) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/find?name=${name}`
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityFind('product', 'NQ')
//=>
// {
//   "id": 814,
//   "name": "NQ",
//   "currencyId": 1,
//   "productType": "Futures",
//   "description": "E-Mini NASDAQ 100",
//   "exchangeId": 2,
//   "exchangeChannelId": 4,
//   "contractGroupId": 20,
//   "riskDiscountContractGroupId": 1,
//   "status": "Verified",
//   "months": "HMUZ",
//   "valuePerPoint": 20,
//   "priceFormatType": "Decimal",
//   "priceFormat": -2,
//   "tickSize": 0.25,
//   "allowProviderContractInfo": false,
//   "isMicro": false,
//   "marketDataSource": "Auto",
//   "lookupWeight": 64,
//   "hasReplay": true
// }
```






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




## `/{entity}/ldeps`
This operation is used to look up entities of this type that are dependent on other 'master' entities.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/ldeps?masterids={item_id_a},{item_id_b},...

  OR

https://demo.tradovateapi.com/v1/{entity}/ldeps?masterids={item_id_a},{item_id_b},...
```

And for WebSocket requests:

```
<entity>/deps
<msg_id>
masterids=<entity_id_a>,<entity_id_b>,...

```

Example Usage:
```js
async function entityLDeps(entityType, masterids) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/ldeps?masterids=${masterids.join(',')}`

    const config = {
        
    }
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityLDeps('productMargin', [814, 799])
//=>
// [
//   {
//     "id": 814,
//     "initialMargin": 17050,
//     "maintenanceMargin": 15500,
//     "timestamp": "2022-04-21T00:09:12.512Z"
//   },
//   {
//     "id": 799,
//     "initialMargin": 12320,
//     "maintenanceMargin": 11200,
//     "timestamp": "2022-04-21T00:09:12.511Z"
//   }
// ]
```

### Notes

| `masterids` Entity Type | Related Entity Types
|:-------|:---------------------
| *(The entity type that should be used for `masterid` parameter)* | *(The operation's returned type)*
| [`Account`]({{site.baseurl}}/entity-system/entity-index/account) | [`CashBalance`]({{site.baseurl}}/entity-system/entity-index/cashbalance) [`CashBalanceLog`]({{site.baseurl}}/entity-system/entity-index/cashbalancelog) [`MarginSnapshot`]({{site.baseurl}}/entity-system/entity-index/marginsnapshot) [`AccountRiskStatus`]({{site.baseurl}}/entity-system/entity-index/accountriskstatus) [`UserAccountAutoLiq`]({{site.baseurl}}/entity-system/entity-index/useraccountautoliq) [`Position`]({{site.baseurl}}/entity-system/entity-index/position) [`Order`]({{site.baseurl}}/entity-system/entity-index/order) [`OrderStrategy`]({{site.baseurl}}/entity-system/entity-index/orderstrategy) [`User`]({{site.baseurl}}/entity-system/entity-index/user) [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit) 
| [`Command`]({{site.baseurl}}/entity-system/entity-index/command) | [`CommandReport`]({{site.baseurl}}/entity-system/entity-index/CommandReport) [`ExecutionReport`]({{site.baseurl}}/entity-system/entity-index/executionreport)
| [`Contract`]({{site.baseurl}}/entity-system/entity-index/contract) | [`ContractMaturity`]({{site.baseurl}}/entity-system/entity-index/contractmaturity)
| [`Product`]({{site.baseurl}}/entity-system/entity-index/product) | [`ProductMargin`]({{site.baseurl}}/entity-system/entity-index/productmargin) [`ContractMaturity`]({{site.baseurl}}/entity-system/entity-index/contractmaturity) `ProductSession`
| [`Order`]({{site.baseurl}}/entity-system/entity-index/order) | [`Command`]({{site.baseurl}}/entity-system/entity-index/command) [`OrderVersion`]({{site.baseurl}}/entity-system/entity-index/orderversion) [`Fill`]({{site.baseurl}}/entity-system/entity-index/fill)
| [`Exchange`]({{site.baseurl}}/entity-system/entity-index/Exchange) | [`Product`]({{site.baseurl}}/entity-system/entity-index/product)
| [`OrderStrategy`]({{site.baseurl}}/entity-system/entity-index/orderstrategy) | [`OrderStrategyLink`]({{site.baseurl}}/entity-system/entity-index/orderstrategylink)
| [`Fill`]({{site.baseurl}}/entity-system/entity-index/fill) | `FillFee` 
| [`Position`]({{site.baseurl}}/entity-system/entity-index/position) | [`FillPair`]({{site.baseurl}}/entity-system/entity-index/fillpair)
| [`User`]({{site.baseurl}}/entity-system/entity-index/user) | [`Account`]({{site.baseurl}}/entity-system/entity-index/account) [`TradingPermission`]({{site.baseurl}}/entity-system/entity-index/tradingpermission) [`ContactInfo`]({{site.baseurl}}/entity-system/entity-index/contactinfo)
| [`UserAccountPositionLimit`]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit) | [`UserAccountRiskParameter`]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)





## `/{entity}/list`
This operation is used to look up all the entities that exist within your User's permissions scope.

## Format
For HTTP requests, we can use this format:

```
https://live.tradovateapi.com/v1/{entity}/list

  OR

https://demo.tradovateapi.com/v1/{entity}/list
```

And for WebSocket requests:

```
<entity>/list
<msg_id>


```

Example Usage:
```js
async function entityList(entityType) {
    const URL = `https://demo.tradovateapi.com/v1/${entityType}/list`
    
    let response, data
    try {
        response = await fetch(URL)
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
    
}

await entityList('account')
//=>
// [
//     {
//         "id": 0,
//         "name": "string",
//         "userId": 0,
//         "accountType": "Customer",
//         "active": true,
//         "clearingHouseId": 0,
//         "riskCategoryId": 0,
//         "autoLiqProfileId": 0,
//         "marginAccountType": "Speculator",
//         "legalStatus": "Individual",
//         "timestamp": "2019-08-24T14:15:22Z",
//         "readonly": true
//     }
// ]
```




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





# Getting Started
**So, you've made the plunge into the Tradovate API - don't worry, we're here to help!** This site is Tradovate's official API Education center. Here, you'll learn all the skills you need to begin creating applications that utilize the Tradovate API. Use what you learn to create utility applications for trading, automate a trading strategy, or even create a large scale, multi-user application. If you can dream it, you can build it.

## Prerequisites
In order to access the Tradovate API, you'll need to subscribe to API Access and create an API Key. Once you've created your first API Key, you'll be able to utilize all of the features in this guide. Follow the link below to learn how to access the Tradovate API today.

[Learn How to Access the API](https://community.tradovate.com/t/how-do-i-access-the-api/2380){: .btn .btn-blue .fs-5 } [B2B Partners](){: .btn .fs-5 }

## Using Interactive Features
Take a look at the top of the page - see the {% include lock-small.html %} icon? Any time that you have a valid Access Token, you can click this icon and paste the token's string value into the form that appears. If the token was valid, you'll notice the lock icon changes to a "closed" state. Once in this state, you can use any of the REST API Try It boxes located on the right bar of the site (or by clicking the <button>▶</button>{: .btn .btn-green .fs-2 } button on mobile). Add custom JSON bodies to the requests and test them right here with zero overhead!

## WebSocket Playground
We also offer a playground for our WebSocket APIs. Simply select a URL and click <button>Connect</button>{: .btn .btn-blue .text-grey-lt-000 .fs-2 }. Once you receive the `o` open frame, you can use the Command Palette to parameterize an `authorize` message. When the socket has been successfully authorized, its connection is good until cancelled and you can use the Command Palette options to parameterize and generate most message types.

[Visit WebSocket Playground]({{site.baseurl}}/all-ops/websockets/play){: .btn .btn-blue .text-grey-lt-000 } [WebSocket Guide]({{site.baseurl}}/wss-guide/){: .btn }

---

[Resources]({{site.baseurl}}/resources){: .btn .btn-blue .text-grey-lt-000 }
[Architecture Overview {% include chev-right.html %}]({{site.baseurl}}/architecture-overview){: .btn .btn-blue .text-grey-lt-000 .float-right }

---




# Welcome to the Tradovate API
## Opening Doors to Futures Trading on the Web

<img src="{{ '/assets/images/free-stocks-photo.jpg' | relative_url }}" />

From automating a strategy to building an enterprise application, the Tradovate Web APIs offer everything that you'll need to start building something special.

[Get Started Now]({{site.baseurl}}/getting-started){: .btn .btn-blue .text-grey-lt-000 .fs-6 }

---

### *Download the OpenAPI Spec*
Available as JSON or YAML.

<a class="btn fs-4" download="tdv_spec.json" target="_blank" href="{{ 'assets/files/swagger.json' | relative_url }}">JSON</a> <a class="btn fs-4" download="tdv_spec.yaml" target="_blank" href="{{ 'assets/files/swagger.yaml' | relative_url }}">YAML</a>

---



# Architecture Overview

<img id="main-frame" src="{{'/assets/images/SV_ArchitectureOverview.png' | relative_url }}">

### Tradovate API
The Tradovate API is an amalgamation of all of our public facing systems. From the API you can access Trade Data, Market Data, and Replay Sessions.

### Middleware
This is where you, the developers, come in. Your Middlewares will interface with our API to do things. For Retail users, this may be a robot that listens to Market Data streams and waits for certain conditions to take an action. For Vendors, this will be a way to watch your organization members' actions in real-time.

### User Entry Points
For Retail users and Vendors alike, the best way to interact with our system is to use one of our client applications. Both the Tradovate or Tradovate applications are available on mobile, web, and desktop. Of course, you could build your own front end using our API, as well - the Tradovate web, mobile, and desktop applications are all built using these same tools.

---

[{% include chev-left.html %} Getting Started]({{site.baseurl}}/getting-started){: .btn .btn-blue .text-grey-lt-000 }
[REST Guide {% include chev-right.html %}]({{site.baseurl}}/rest-guide){: .btn .btn-blue .text-grey-lt-000 .float-right }

---



# Resources
Here, you will find additional suggested content and resources to help you learn the Tradovate API.

### WebSocket Playground
Connect to any of the Tradovate WebSocket servers and interact with real-time data right here on this site.

[WebSocket Playground]({{site.baseurl}}/all-ops/websockets/play){: .btn .btn-blue .text-grey-lt-000 }

---

### All Tradovate API Operations
An index of all the operations you can call from the Tradovate REST and WebSocket APIs.

[All Operations]({{site.baseurl}}/all-ops){: .btn .btn-blue .text-grey-lt-000 }

---

### All Tradovate Entity Types
An index of every entity type that you could encounter while using the Tradovate REST and WebSocket APIs.

[Entities Index]({{site.baseurl}}/entity-system/index){: .btn .btn-blue .text-grey-lt-000 }

---


### Official API Docs
Tradovate's official API documentation.

[API Docs](https://api.tradovate.com){: .btn .btn-blue .text-grey-lt-000 }

---

### API FAQ
Repository for API-related frequently asked questions and example code.

[API FAQ](https://github.com/tradovate/example-api-faq){: .btn .btn-blue .text-grey-lt-000 } 

---

### Tradovate Community
When you just can't find what you're looking for, sometimes the community is the best place to go. You may even get help from the author of this guide!

[Tradovate Community](https://community.tradovate.com){: .btn .btn-blue .text-grey-lt-000 }







# Entities Are Related
Many entities are related to other entities. You can usually tell when an entity has a relationship with another based on its fields - an entity with relationships will typically store the IDs of the related entities in its own fields. For example, if you look at the [Account]({{site.baseurl}}/entity-system/entity-index/account) entity, you'll see there is a `userId` field for the related User entity, a `clearingHouseId` for whatever clearing house the account uses, `riskCategoryId` for the risk category that this Account belongs to, and an `autoLiqProfileId` for the related Auto-Liquidation Profile.

Understanding how entities relate to one another can be very helpful for understanding how the API works in general. Please refer to the [Entities Index]({{site.baseurl}}/entity-system/index) for a dictionary of Tradovate API Entities and response object schemas.

Here is an example of how to get all of the [Order]({{site.baseurl}}/entity-system/entity-index/order) entities related to a given [Account]({{site.baseurl}}/entity-system/entity-index/account).

```js
async function findRelatedOrders(accountId) {
    const { accessToken } = Storage.getUserData()

    let response

    try {
        response = await fetch(`https://demo.tradovateapi.com/v1/order/deps?masterid=${accountId}`, {
            method: 'GET',
            headers: buildHeaders(accessToken)
        })
        response = await response.json()
    } catch(err) {
        console.error(err)
    }

    return response
}
```

---

[{% include chev-left.html %} The Entity System]({{site.baseurl}}/entity-system){: .btn .btn-blue .text-grey-lt-000 }
[Shared Operations {% include chev-right.html %}]({{site.baseurl}}/entity-system/shared-ops){: .btn .btn-blue .text-grey-lt-000 .float-right }



# Common Entity Operations

> *Please see the [API Operations]({{site.baseurl}}/all-ops) section to see details about each of the shared API operations.*

Although there are many *unique* operations available via API, all entities share seven basic operations. These operations are valid (with a few exceptions) for any entity you call them on. The format of these calls via HTTP looks like this:

```
https://<prefix>.tradovateapi.com/v1/<entity>/<operation>
```
Where `<prefix>` is either 'live' or 'demo', `<entity>` would be replaced with a valid entity type name (`cashBalance`, `account`, `productMargin`, etc.), and `<operation>` is one of the following seven operations.

---

## [`/list`]({{site.baseurl}}/all-ops/shared/list)
`/list` is the simplest request to make, as it has no parameters. Simply by having a valid `accessToken` in the header, we will be able to retrieve lists of the given entity with a `GET` request. `/list` will return every entity of the given type within the scope of your [User]({{site.baseurl}}/entity-system/entity-index/user)'s permissions. So if we call `/account/list` we will retrieve a list of [Account]({{site.baseurl}}/entity-system/entity-index/account) entities associated with the User making that request.

---

## [`/find`]({{site.baseurl}}/all-ops/shared/find)
The `/find` operation is used for finding entities that have a `name` field. It will 'work' on entities that don't have a `name` field, but it will never return anything. So, if you're having trouble with this operation, ensure the entity type you are searching has a `name`. The `/find` operation takes a single query parameter, `name` formatted like so - `/find?name=<entity_name>`. To find the ES contract expiring June 2022, we would use `/contract/find?name=ESM2`.

---

## [`/item`]({{site.baseurl}}/all-ops/shared/item)
The `/item` operation is useful for finding an entity for which you already know the entity ID. A common example would be looking up the [Contract]({{site.baseurl}}/entity-system/entity-index/contract) related to an [Order]({{site.baseurl}}/entity-system/entity-index/order). The [Order]({{site.baseurl}}/entity-system/entity-index/order) entity has a field called `contractId` that we would use `/contract/item?id=<contractId>` to retrieve the [Contract]({{site.baseurl}}/entity-system/entity-index/contract) instance.

---

## [`/items`]({{site.baseurl}}/all-ops/shared/items)
Just like `/item` except instead of using the singular `id` as a parameter, we have `ids`. `ids` should consist of a comma-separated list of integer IDs, eg. `12345,23456,34567`. This is most useful when you want to get several entities of the same type by their IDs in a single API call.

---

## [`/deps`]({{site.baseurl}}/all-ops/shared/deps)
`/deps` is an operation that retrieves entities of a given type related to a 'master' entity of another type. For more info on which entities are related, see the [Notes]({{site.baseurl}}/all-ops/shared/deps#notes) section of the [`/deps`]({{site.baseurl}}/all-ops/shared/deps) page.

---

## [`/ldeps`]({{site.baseurl}}/all-ops/shared/ldeps)
Just like `/deps` except instead of the singular `masterid` parameter, we need to use the plural `masterids` parameter. Much like `/items`, `/ldeps` takes the `masterids` as a comma-separated list of integer IDs.

---

## [`/suggest`]({{site.baseurl}}/all-ops/shared/suggest)
When you want to find out what entities are available or search for choices, you can use the `/suggest` operation. It takes two query parameters, `t` and `l`. `t` is the text to search and `l` is the maximum number of results to return. Useful for things like searching for available contract expirations.

---
[{% include chev-left.html %} Entities are Related]({{site.baseurl}}/entity-system/entities-are-related){: .btn .btn-blue .text-grey-lt-000 }

---




# The Entity System
## Understanding the Tradovate API Entity System
The Tradovate API's backend is a well organized and fine-tuned market data processing machine (and more). To keep things in order, we employ an Entity System defining all the possible types of 'things' that can exist within the application-space. As we are a futures-trading platform, we have such entities as [Order]({{site.baseurl}}/entity-system/entity-index/order), [Contract]({{site.baseurl}}/entity-system/entity-index/contract), [ContractMaturity]({{site.baseurl}}/entity-system/entity-index/contractmaturity), [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance), [Account]({{site.baseurl}}/entity-system/entity-index/account), and so on. Each of these entities has a different *interface*, or shape. Entities can be related, and they also share a set of common operations that will work (mostly) for all entity types. As we send and receive data from the Tradovate servers, we will be encountering and utilizing objects of these types.

---

[Explore Entities]({{site.baseurl}}/entity-system/index){: .btn .btn-blue .text-grey-lt-000 }
[Entities Are Related {% include chev-right.html %}]({{site.baseurl}}/entity-system/entities-are-related){: .btn .btn-blue .text-grey-lt-000 .float-right }



# Entities Index

This section contains a list of Tradovate Entities' definitions and usage assistance.





## Account
This entity represents a source of equity. A User may have ownership of multiple Account entities.

#### Related
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog)
- [User]({{site.baseurl}}/entity-system/entity-index/user)
- [MarginSnapshot]({{site.baseurl}}/entity-system/entity-index/marginsnapshot)
- [AccountRiskStatus]({{site.baseurl}}/entity-system/entity-index/accountriskstatus)
- [UserAccountAutoLiq]({{site.baseurl}}/entity-system/entity-index/useraccountautoliq)
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)

### Definition

| Property         |Tags      | Type      | Remarks
|:----------------|:------|:--------------------------------------------------|:----------------------------------------------------
| `id` |     `none`{: .label }              | number, `int64`                                            | Account Entity ID. 
| `name` |`required`{: .label .label-red}       | string, <= 64 chars                                           | Always all-caps with optional underscores and trailing digits.
| `userId` | `required`{: .label .label-red}      | number, `int64`                                            | Related User Entity ID.
| `accountType` | `required`{: .label .label-red} | string enum, `"Customer"`, `"Giveup"`, `"House"`, `"Omnibus"`, `"Wash"`  | 
| `active`  | `required`{: .label .label-red}  | boolean | 
| `clearingHouseId` | `required`{: .label .label-red}  | number, `int64` | 
| `riskCategoryId` | `required`{: .label .label-red}  | number, `int64` | The related Risk Category. Typical retail users won't use this.
| `autoLiqProfileId` | `required`{: .label .label-red}  | number, `int64` | The [UserAccountAutoLiq]({{site.baseurl}}/entity-system/entity-index/useraccountautoliq) (Auto Liquidation profile) associated with this account. The Auto Liq profile actually shares the same entity ID as the account since they have a 1:1 relationship.
| `marginAccountType` | `required`{: .label .label-red}  | string enum, `"Hedger"`, `"Speculator"` | 
| `legalStatus` | `required`{: .label .label-red}  | string enum, `"Corporation"`, `"GP"`, `"IRA"`, `"Individual"`, `"LLC"`, `"LLP"`, `"LP"`, `"Trust"`, `"Joint"` | Typically, retail users are `"Individual"`
| `timestamp` |`required`{: .label .label-red}  | Date string | 
| `readonly` | `none`{: .label } | boolean |




## AccountRiskStatus
This entity represents the current Risk Status of an account. This entity's `adminAction` field can tell you if the account has a locked status.

#### Related
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)

### Definition

| Property | Tags | Type | Remarks
|:----|:---|:---|:---
| `id` | `none`{: .label } | number, `int64` |
| `adminAction` | `none`{: .label } | `"AgreedOnLiqOnlyModeByAutoLiq"`, `"AgreedOnAutoLiquidationByAutoLiq"`, `"DisableAutoLiq"`, `"LiquidateImmediately"`, `"LiquidateOnlyModeImmediately"`, `"LockTradingImmediately"`, `"Normal"`, `"PlaceAutoLiqOnHold"` |
| `adminTimestamp` | `none`{: .label } | Date string |
| `liquidateOnly` | `none`{: .label } | Date string |
| `userTriggeredLiqOnly` | `none`{: .label } | boolean |



## CashBalance
An entity that represents a snapshot of an [Account]({{site.baseurl}}/entity-system/entity-index/account)'s current balance, daily realized profits/losses and weekly realized profits and losses.

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog) 

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:--------------------
| `id` | `none`{: .label } | number, `int64` | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | The account associated with this CashBalance entity.
| `timestamp` | `required`{: .label .label-red } | Date string |
| `tradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | 
| `currencyId` | `required`{: .label .label-red } | number, `int64` |
| `amount` | `required`{: .label .label-red } | number, double | The value in currency of type `currencyId` represented by this CashBalance entity.
| `realizedPnL` | `none`{: .label } | number, double | The realized P&L for the current session, resets between session close and open.
| `weekRealizedPnL` | `none`{: .label} | number, double | The realized P&L for the week resetting at week open (for ES and similar, Sunday 6PM - Friday 5PM).



## CashBalanceLog
Represents a transactional change in an [Account]({{site.basurl}}/entity-system/entity-index/account)'s [CashBalance]({{site.basurl}}/entity-system/entity-index/cashbalance).

#### Related
- [Account]({{site.basurl}}/entity-system/entity-index/account)
- [CashBalance]({{site.basurl}}/entity-system/entity-index/cashbalance)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `accountId` | `required`{: .label .label-red } | number, `int64` | ID of the associated [Account]({{site.baseurl}}/entity-system/entity-index/account) entity.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this log was generated.
| `tradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) |
| `currencyId` | `required`{: .label .label-red } | number, `int64` |
| `amount` | `required`{: .label .label-red } | number, double | The decimal amount in [Currency]({{site.baseurl}}/entity-system/entity-index/currency) of type `currencyId` that the associated [Account]({{site.baseurl}}/entity-system/entity-index/account) is holding.
| `realizedPnL` | `none`{: .label } | number, double | Realized profits & losses for the current session at the time this log was generated. Resets daily between 5-6PM EST
| `weekRealizedPnL` | `none`{: .label } | number, double | Realized profits & losses for the trading week at the time this log was generated. Resets Sunday 6PM EST.
| `cashChangeType` | `required`{: .label .label-red } | string enum, `"AutomaticReconciliation"` `"BrokerageFee"` `"CancelledPairedTrade"` `"ClearingFee"` `"Commission"` `"DeskFee"` `"EntitlementSubscription"` `"ExchangeFee"` `"FundTransaction"` `"FundTransactionFee"` `"IPFee"` `"LiquidationFee"` `"ManualAdjustment"` `"MarketDataSubscription"` `"NewSession"` `"NfaFee"` `"OptionsTrade"` `"OrderRoutingFee"` `"TradePaired"` `"TradovateSubscription"` | The type of transaction or fee that this log represents or was generated for.
| `fillPairId` | `none`{: .label } | number, `int64` | If this log was generated as the result of a [Fill]({{site.baseurl}}/entity-system/entity-index/fill) being paired (position closing) this field will be present and its value will be equal to the ID of the related [FillPair]({{site.baseurl}}/entity-system/entity-index/fillpair) entity. 
| `fillId` | `none`{: .label } | number, `int64` | If this log was generated as the result of a order being filled, this field will be present and its value will be equal to the ID of the related [Fill]({{site.baseurl}}/entity-system/entity-index/fill) entity.
| `fundTransactionId` | `none`{: .label } | number, `int64` |
| `delta` | `required`{: .label .label-red } | number, double | A decimal representing the change in [Currency]({{site.baseurl}}/entity-system/entity-index/currency) of type `currencyId` that this transaction or fee represents. Negative values represent negative change, and vice versa.
| `senderId` | `none`{: .label } | number, `int64` |
| `comment` | `label`{: .label } | string <= 64 chars | 



## Command
Whenever a user places an order, what they're actually doing is creating a Command to place that order. A Command entity represents an attempt to take a trading action.

#### Related
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/commandreport)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)
- [Order]({{site.baseurl}}/entity-system/entity-index/order)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `orderId` | `required`{: .label .label-red } | number, `int64` | ID of the associated [Order]({{site.baseurl}}/entity-system/entity-index/order) entity that this command was generated for.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this Command was generated.
| `clOrdId` | `none`{: .label } | string | 
| `commandType` | `required`{: .label .label-red } | string enum, `"Cancel"` `"Modify"` `"New"` | The three actions basic actions that a Command can represent for an order.
| `commandStatus` | `required`{: .label .label-red } | string enum, `"AtExecution"` `"ExecutionRejected"` `"ExecutionStopped"` `"ExecutionSuspended"` `"OnHold"` `"Pending"` `"PendingExecution"` `"Replaced"` `"RiskPassed"` `"RiskRejected"` | The current status of a Command. Please use [CommandReport]({{site.baseurl}}/entity-system/entity-index/commandreport)s to monitor the Command's lifecycle instead of using this property directly.
| `senderId` | `none`{: .label } | number, `int64` | User ID of sending user, if applicable.
| `userSessionId` | `none`{: .label } | number, `int64` |
| `activationTime` | `none`{: .label } | Date string | Optional time that this Command is set to fire, otherwise fires ASAP.
| `customTag50` | `none`{: .label } | string <= 50 chars | Optional string up to 50 characters to describe this Command.
| `isAutomated` | `none`{: .label } | boolean | If the Command was generated by an application without the intervention of a human, `isAutomated` must be true.



## CommandReport
Once a [Command]({{site.baseurl}}/entity-system/entity-index/command) has been sent by a client, the server begins processing that request. As the command is processed, its status is updated. The CommandReport entity can be used as a mechanism for digesting those updates.

#### Related
- [Command]({{site.baseurl}}/entity-system/entity-index/command)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `commandId` | `required`{: .label .label-red } | number, `int64` | ID of the associated [Command]({{site.baseurl}}/entity-system/entity-index/command) entity.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this CommandReport was generated.
| `commandStatus` | `required`{: .label .label-red } | string enum, `"AtExecution"` `"ExecutionRejected"` `"ExecutionStopped"` `"ExecutionSuspended"` `"OnHold"` `"Pending"` `"PendingExecution"` `"Replaced"` `"RiskPassed"` `"RiskRejected"` | Use this status to determine the status of a Command. 
| `rejectReason` | `none`{: .label } | string enum, `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | Can help to determine why a Command failed.
| `text` | `none`{: .label } | string <= 8192 chars | Optional descriptive text associated with the Command.
| `ordStatus` | `none`{: .label } | string enum, `"Canceled"` `"Completed"` `"Expired"` `"Filled"` `"PendingCancel"` `"PendingNew"` `"PendingReplace"` `"Rejected"` `"Suspended"` `"Unknown"` `"Working"` | You can use this field to determine the status of a related order.




## ContactInfo
An entity to hold a [User]({{site.baseurl}}/entity-system/entity-index/user)'s Contact Information. A user's contact information shouldn't contain any special characters.

#### Related
- [User]({{site.baseurl}}/entity-system/entity-index/user)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number | 
| `userId` | `required`{: .label .label-red } | number | ID of related [User]({{site.baseurl}}/entity-system/entity-index/user) entity.
| `firstName` | `required`{: .label .label-red } | string | Up to 64 characters.
| `lastName` | `required`{: .label .label-red } | string | Between 2 and 64 characters.
| `streetAddress1` | `required`{: .label .label-red } | string | Between 3 and 61 characters.
| `streetAddress2` | `none`{: .label } | string | Up to 61 characters.
| `city` | `required`{: .label .label-red } | string | 2 to 35 characters.
| `state` | `none`{: .label } | string | 2 to 64 characters.
| `postCode` | `none`{: .label } | string | 4 to 11 characters.
| `country` | `required`{: .label .label-red } | string | 2 character country code.
| `phone` | `required`{: .label .label-red } | string | 10-21 characters.
| `mailingIsDifferent` | `none`{: .label } | boolean | Indicates the User's mailing address is not their provided street address.
| `mailingStreetAddress1` | `none`{: .label } | string | 
| `mailingStreetAddress2` | `none`{: .label } | string | 
| `mailingCity` | `none`{: .label } | string | 
| `mailingState` | `none`{: .label } | string | 
| `mailingPostCode` | `none`{: .label } | string | 
| `mailingCountry` | `none`{: .label } | string | 



## Contract
Simple object to represent a Contract. 

#### Related
- [Product]({{site.baseurl}}/entity-system/entity-index/product)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:--------
| `id` | `none`{: .label } | number, `int64` | 
| `name` | `required`{: .label .label-red } | string <= 64 chars | Name of this contract, consists of Product Code (like ES or NQ) and expiration code (M2, Z4, H1, etc). So for example for an ES contract expiring June of 2027 we would use ESM7 for its contract `name`.
| `contractMaturityId` | `required`{: .label .label-red } | number, `int64` | 



## ContractGroup
Simple object to represent a category of [Contract]({{site.baseurl}}/entity-system/entity-index/contract).

#### Related

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `name` | `required`{: .label .label-red } | string <= 64 chars |



## ContractMargin
Simple object to represent a [Contract]({{site.baseurl}}/entity-system/entity-index/contract)'s margin requirements.

#### Related
- [Contract]({{site.baseurl}}/entity-system/entity-index/contract)
- [ContractMaturity]({{site.baseurl}}/entity-system/entity-index/contractmaturity)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `initialMargin` | `required`{: .label .label-red } | number, double |
| `maintenanceMargin` | `required`{: .label .label-red } | number, double |
| `timestamp` | `required`{: .label .label-red } | Date string |



## ContractMaturity
Object that represents a contract's maturity information, including the expiration month and specific date, product ID, and whether or not this is the front-month contract.

#### Related
- [Contract]({{site.baseurl}}/entity-system/entity-index/contract)
- [ContractMargin]({{site.baseurl}}/entity-system/entity-index/contractmargin)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `productId` | `required`{: .label .label-red } | number, `int64` |
| `expirationMonth` | `required`{: .label .label-red } | number, [1..12] |
| `expirationDate` | `required`{: .label .label-red } | Date string |
| `firstIntentDate` | `none`{: .label } | Date string |
| `underlyingId` | `none`{: .label } | number, `int64` |
| `isFront` | `required`{: .label .label-red } | boolean | This may seem very useful at a glance for determining which contract to trade in an automated strategy, however this value will not change until the current front-month contract expires. Instead use the `/<entity>/suggest` operation.




## Currency
Representation of a currency like USD, JPY or EUR.

#### Related
- [CurrencyRate]({{site.baseurl}}/entity-system/entity-index/currencyrate)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `name` | `required`{: .label .label-red } | string <= 64 chars | 
| `symbol` | `label`{: .label } | string <= 64 chars | 



## CurrencyRate

#### Related
- [Currency]({{site.baseurl}}/entity-system/entity-index/currency)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `timestamp` | `required`{: .label .label-red } | Date string | 
| `rate` | `required`{: .label .label-red } | number, double | 



## Entitlement
Object to represent an Entitlement. This is the basis of a [UserPlugin]({{site.baseurl}}/entity-system/entity-index/userplugin).

#### Related
- [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/entitlementsubscription)
- [EntitlementSubscriptionResponse]({{site.baseurl}}/entity-system/entity-index/entitlementsubscriptionresponse)
- [UserPlugin]({{site.baseurl}}/entity-system/entity-index/userplugin)
- [`/userPlugin/addEntitlementSubscription`]({{site.baseurl}}/all-ops/userPlugin/addentitlementsubscription)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `title` | `required`{: .label .label-red } | string <= 64 chars | Display name for this Entitlement.
| `price` | `required`{: .label .label-red } | number, double | Price of the Entitlement.
| `startDate` | `label`{: .label } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | Represents the date that this Entitlement was or will become available.
| `discontinuedDate` | `label`{: .label } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | Represents the date that this Entitlement was discontinued and made no longer available. Requests to add a discontinued Entitlement will fail.
| `name` | `required`{: .label .label-red } | string <= 64 chars | Reference name for this Entitlement, used for things like the [`/find`]({{site.baseurl}}/all-ops/shared/find) operation.
| `duration` | `label`{: .label } | number, `int32` | Duration in `durationUnits` that a paid-period for the associated [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/entitlementsubscription) should last.
| `durationUnits` | `label`{: .label } | string enum, `"Month"` `"Quarter"` `"Week"` `"Year"` | Unit by which `duration` should be measured.
| `autorenewal` | `label`{: .label } | boolean | `true` if the associated [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/entitlementsubscription) should automatically renew.



## EntitlementSubscription

#### Related
- [Entitlement]({{site.baseurl}}/entity-system/entity-index/entitlement)
- [EntitlementSubscriptionResponse]({{site.baseurl}}/entity-system/entity-index/entitlementsubscriptionresponse)
- [`/userPlugin/addEntitlementSubscription`]({{site.baseurl}}/all-ops/userPlugin/addentitlementsubscription)


### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `userId` | `required`{: .label .label-red } | number, `int64` | 
| `timestamp` | `required`{: .label .label-red } | Date string | Creation timestamp.
| `planPrice` | `required`{: .label .label-red } | number, double | 
| `creditCardTransactionId` | `label`{: .label } | number, `int64` | Non-null if a credit card was used to purchase this entitlement.
| `cashBalanceLogId` | `label`{: .label } | number, `int64` | Non-null if a Tradovate account was used to purchase this entitlement.
| `creditCardId` | `label`{: .label } | number, `int64` | Non-null if a credit card was used to purchase this entitlement. 
| `accountId` | `label`{: .label } | number, `int64` | Non-null if a Tradovate account was used to purchase this entitlement.
| `pluginName` | `required`{: .label .label-red } | string <= 64 chars | Name of the [UserPlugin]({{site.baseurl}}/entity-system/entity-index/userplugin) that this entitlement grants.
| `approval` | `required`{: .label .label-red } | boolean | `true` when the entitlement is active.
| `entitlementId` | `label`{: .label } | number, `int64` | [Entitlement]({{site.baseurl}}/entity-system/entity-index/entitlement)
| `startDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | Purchase date as a [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) object.
| `expirationDate` | `label`{: .label } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | Expiration date as a [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) object. Null implies no expiration.
| `paidAmount` | `required`{: .label .label-red } | number, double | Paid price for this entitlement.
| `autorenewal` | `label`{: .label } | boolean | `true` if this entitlement subscription automatically renews.
| `planCategories` | `label`{: .label } | string <= 8192 chars | `;` delimited string of plans that are allowed to purchase this entitlement.



## ExecutionReport
An object that represents the Execution of a [Command]({{site.baseurl}}/entity-system/entity-index/command).

#### Related
- [Command]({{site.baseurl}}/entity-system/entity-index/command)
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/commandreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `commandId` | `required`{: .label .label-red } | number, `int64` | The entity ID of the associated [Command]({{site.baseurl}}/entity-system/entity-index/command).
| `name` | `required`{: .label .label-red } | string <= 64 chars | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | The entity ID of the associated [Account]({{site.baseurl}}/entity-system/entity-index/account).
| `contractId` | `required`{: .label .label-red } | number, `int64` | The entity ID of the associated [Contract]({{site.baseurl}}/entity-system/entity-index/contract).
| `timestamp` | `required`{: .label .label-red } | Date string | 
| `tradeDate` | `none`{: .label } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | The entity ID of the associated [Order]({{site.baseurl}}/entity-system/entity-index/order)
| `execType` | `required`{: .label .label-red } | `"Canceled"` `"Completed"` `"DoneForDay"` `"Expired"` `"New"` `"OrderStatus"` `"PendingCancel"` `"PendingNew"` `"PendingReplace"` `"Rejected"` `"Replaced"` `"Stopped"` `"Suspended"` `"Trade"` `"TradeCancel"` `"TradeCorrect"` | 
| `execRefId` | `none`{: .label } | string <= 64 chars | 
| `ordStatus` | `none`{: .label } | string enum, `"Canceled"` `"Completed"` `"Expired"` `"Filled"` `"PendingCancel"` `"PendingNew"` `"PendingReplace"` `"Rejected"` `"Suspended"` `"Unknown"` `"Working"` | Status of the associated [Order]({{site.baseurl}}/entity-system/entity-index/order).
| `action` | `required`{: .label .label-red } | string enum, `"Buy"` `"Sell"` | 
| `cumQty` | `none`{: .label } | number, `int32` | 
| `avgPx` | `none`{: .label } | number, double | 
| `lastQty` | `none`{: .label } | number, `int32` | 
| `lastPx` | `none`{: .label } | number, double | 
| `rejectReason` | `none`{: .label } | string enum, `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `text` | `none`{: .label } | string <= 8192 chars | 
| `exchangeOrderId` | `none`{: .label } | string <= 64 chars | 



## Fill
An entity that represents the Fill of an [Order]({{site.baseurl}}/entity-system/entity-index/order).

#### Related
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [FillPair]({{site.baseurl}}/entity-system/entity-index/fillpair)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity.
| `contractId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Contract]({{site.baseurl}}/entity-system/entity-index/contract) entity.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that the fill was created.
| `tradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | The date of the trading session that this fill occurred.
| `action` | `required`{: .label .label-red } | `"Buy"` `"Sell"` | 
| `qty` | `required`{: .label .label-red } | number, `int32` | The number of contracts filled.
| `price` | `required`{: .label .label-red } | number, double | Price at which the order was filled.
| `active` | `required`{: .label .label-red } | boolean | 
| `finallyPaired` | `required`{: .label .label-red } | number, `int32` | 




## FillFee

#### Related
- [Fill]({{site.baseurl}}/entity-system/entity-index/fill)
- [FillPair]({{site.baseurl}}/entity-system/entity-index/fillpair)
- [Order]({{site.baseurl}}/entity-system/entity-index/order)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `clearingFee` | `label`{: .label } | number, double | 
| `clearingCurrencyId` | `label`{: .label } | number, `int64` | 
| `exchangeFee` | `label`{: .label } | number, double | 
| `exchangeCurrencyId` | `label`{: .label } | number, `int64` | 
| `nfaFee` | `label`{: .label } | number, double | 
| `nfaCurrencyId` | `label`{: .label } | number, `int64` | 
| `brokerageFee` | `label`{: .label } | number, double | 
| `brokerageCurrencyId` | `label`{: .label } | number, `int64` | 
| `ipFee` | `label`{: .label } | number, double | 
| `ipCurrencyId` | `label`{: .label } | number, `int64` | 
| `commissionFee` | `label`{: .label } | number, double | 
| `commissionCurrencyId` | `label`{: .label } | number, `int64` | 
| `orderRoutingFee` | `label`{: .label } | number, double | 
| `orderRoutingCurrencyId` | `label`{: .label } | number, `int64` | 



## FillPair
An entity that represents the pair of [Fill]({{site.baseurl}}/entity-system/entity-index/fill)s that opened and ultimately close an [Order]({{site.baseurl}}/entity-system/entity-index/order).

#### Related
- [Fill]({{site.baseurl}}/entity-system/entity-index/fill)
- [Order]({{site.baseurl}}/entity-system/entity-index/order)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `positionId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Position]({{site.baseurl}}/entity-system/entity-index/position) entity 
| `buyFillId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity that had the `"Buy"` action.
| `sellFillId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity that had the `"Sell"` action.
| `qty` | `required`{: .label .label-red } | number, `int32` | The quantity of contracts opened and closed by this FillPair.
| `buyPrice` | `required`{: .label .label-red } | number, double | Price of the [Order]({{site.baseurl}}/entity-system/entity-index/order) with the `"Buy"` action.
| `sellPrice` | `required`{: .label .label-red } | number, double | Price of the [Order]({{site.baseurl}}/entity-system/entity-index/order) with the `"Sell"` action.
| `active` | `required`{: .label .label-red } | boolean | 



## MarginSnapshot
An object that represents a snapshot of a user's Margin status.

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [CashBalanceSnapshot]({{site.baseurl}}/entity-system/entity-index/cashbalancesnapshot)
- [ProductMargin]({{site.baseurl}}/entity-system/entity-index/productmargin)
- [ContractMargin]({{site.baseurl}}/entity-system/entity-index/contractmargin)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this snapshot was produced.
| `riskTimePeriodId` | `required`{: .label .label-red } | number, `int64` | 
| `initialMargin` | `required`{: .label .label-red } | number, double | 
| `maintenanceMargin` | `required`{: .label .label-red } | number, double | 
| `autoLiqLevel` | `none`{: .label } | number, double | 
| `liqOnlyLevel` | `none`{: .label } | number, double | 
| `totalUsedMargin` | `required`{: .label .label-red } | number, double | 
| `fullInitialMargin` | `required`{: .label .label-red } | number, double | 



## Order
Represents an Order to buy or sell a [Contract]({{site.baseurl}}/entity-system/entity-index/contract).

#### Related
- [Fill]({{site.baseurl}}/entity-system/entity-index/fill)
- [FillPair]({{site.baseurl}}/entity-system/entity-index/fillpair)
- [Command]({{site.baseurl}}/entity-system/entity-index/command)
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/commandreport)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Account]({{site.baseurl}}/entity-system/entity-index/account) entity which was used to place this order.
| `contractId` | `none`{: .label } | number, `int64` | ID of the related [Contract]({{site.baseurl}}/entity-system/entity-index/contract) entity.
| `spreadDefinitionId` | `none`{: .label } | number, `int64` | ID of the related [SpreadDefinition]({{site.baseurl}}/entity-system/entity-index/spreaddefinition) entity if applicable.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this order was created.
| `action` | `required`{: .label .label-red } | string enum, `"Buy"` `"Sell"` | 
| `ordStatus` | `required`{: .label .label-red } | string enum, `"Canceled"` `"Completed"` `"Expired"` `"Filled"` `"PendingCancel"` `"PendingNew"` `"PendingReplace"` `"Rejected"` `"Suspended"` `"Unknown"` `"Working"` | 
| `executionProviderId` | `none`{: .label } | number, `int64` | Execution environment ID (LIVE or Sim)
| `ocoId` | `none`{: .label } | number, `int64` | ID of related OCO Entry Order, if applicable.
| `parentId` | `none`{: .label } | number, `int64` | ID of related parent Order, if applicable.
| `linkedId` | `label`{: .label } | number, `int64` | ID of OCO Linked Order (order to be canceled on this order's [Fill]({{site.baseurl}}/entity-system/entity-index/fill)), if applicable.
| `admin` | `required`{: .label .label-red } | boolean | `false` unless you are a Tradovate administrator or are a B2B partner. Will fail if your user does not have administrator status.



## OrderStrategy

#### Related

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | ID of related [Account]({{site.baseurl}}/entity-system/entity-index/account) entity.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this Order Strategy instance was generated.
| `contractId` | `required`{: .label .label-red } | number, `int64` | ID of related [Contract]({{site.baseurl}}/entity-system/entity-index/contract) entity.
| `orderStrategyTypeId` | `required`{: .label .label-red } | number, `int64` | This is the ID of the [OrderStrategyType]({{site.baseurl}}/entity-system/entity-index/orderstrategytype) entity that this OrderStrategy will utilize. To find the available Order Strategies it is advised that you use the User Sync operation's initial response, which contains an array of OrderStrategyTypes available to your user.
| `initiatorId` | `none`{: .label } | number, `int64` | Entity ID of the User that initiated this OrderStrategy.
| `action` | `required`{: .label .label-red } | string enum, `"Buy"` `"Sell"` | 
| `params` | `JSON`{: .label } | string <= 8192 chars | This should be a JSON string with the schema defined in the Notes section below.
| `uuid` | `none`{: .label } | string <= 64 chars | UUID to identify this OrderStrategy.
| `status` | `required`{: .label .label-red } | string enum, `"ActiveStrategy"` `"ExecutionFailed"` `"ExecutionFinished"` `"ExecutionInterrupted"` `"InactiveStrategy"` `"NotEnoughLiquidity"` `"StoppedByUser"` |
| `failureMessage` | `none`{: .label } | string <= 512 chars | 
| `senderId` | `none`{: .label } | number, `int64` | ID of the User who initialized the OrderStrategy.
| `customTag50` | `none`{: .label } | string <= 64 chars | Optional descriptive string fewer than 50 characters long (for certain UI display).
| `userSessionId` | `none`{: .label } | number, `int64` | 


### Notes
- The `params` string should be a JSON string. The schema of the original object should look like this before it is stringified or after it is decoded:
```js
//params field shape
{
    entryVersion: {
        orderQty: number,
        orderType: "Limit" | "MIT" | "Market" | "Stop" | "StopLimit" | "TrailingStop" | "TrailingStopLimit"
    },
    brackets: {
        qty: number,
        profitTarget?: number,
        stopLoss?: number,
        trailingStop?: boolean
    }[]
}
```



## OrderStrategyLink

#### Related
- [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/orderstrategy)
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [OrderStrategyType]({{site.baseurl}}/entity-system/entity-index/orderstrategytype)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `orderStrategyId` | `required`{: .label .label-red } | number, `int64` | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity.
| `label` | `required`{: .label .label-red } | string <= 64 chars | 



## OrderStrategyType

#### Related

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `name` | `required`{: .label .label-red } | string <= 64 chars | 
| `enabled` | `required`{: .label .label-red } | boolean | 



## OrderVersion

#### Related

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `orderId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity.
| `orderQty` | `required`{: .label .label-red } | number, `int32` | Number of [Contract]({{site.baseurl}}/entity-system/entity-index/contract)s traded by this Order request.
| `orderType` | `required`{: .label .label-red } | string enum, `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | 
| `price` | `none`{: .label } | number, double | 
| `stopPrice` | `none`{: .label } | number, double | Required for the `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number, `int32` | 
| `pegDifference` | `none`{: .label } | number, double | 
| `timeInForce` | `none`{: .label } | string enum, `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | 
| `expireTime` | `none`{: .label } | Date string | Required for `"GTD"` type time-in-force property.
| `text` | `none`{: .label } | string <= 64 chars | 

### Notes
Time-in-force explanations:
- `"Day"`: Good for the current trading session, but cancelled at the end of the day. Be careful not to rely on this for long running stops or take-profit points.
- `"FOK"`: Fill-or-kill, the entire order must execute as soon as it becomes available or it is cancelled. Good to avoid multiple purchase prices.
- `"GTC"`: Good 'til canceled, the order will not expire unless manually canceled by you.
- `"GTD"`: Good 'til date, the order will be working until `expireTime`.
- `"IOC"`: Immediate or cancel, this order type will fill as much as it can immediately and cancel the remainder. Good for making a move for the maximum available volume at a given price. Ex, say a trader wants to buy 500 contracts at exactly 4100 pts, but if 500 aren't available at 4100 that trader will take whatever is immediately available for fill by their broker and nothing more, canceling the remainder of the order.



## Position
An entity that is used to describe a Position held over a certain [Contract]({{site.baseurl}}/entity-system/entity-index/contract) for a given [Account]({{site.baseurl}}/entity-system/entity-index/account).

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [Contract]({{site.baseurl}}/entity-system/entity-index/contract)
- [Fill]({{site.baseurl}}/entity-system/entity-index/fill)
- [FillPair]({{site.baseurl}}/entity-system/entity-index/fillpair)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `accountId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Account]({{site.baseurl}}/entity-system/entity-index/account) entity for which this Position is held.
| `contractId` | `required`{: .label .label-red } | number, `int64` | ID of the related [Contract]({{site.baseurl}}/entity-system/entity-index/contract) entity that this Position was taken for.
| `timestamp` | `required`{: .label .label-red } | Date string | Time that this Position was created.
| `tradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | Trading Session Date on which this Position was created.
| `netPos` | `required`{: .label .label-red } | number, `int32` | The net position or number of instances you hold of the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract).
| `netPrice` | `none`{: .label } | number, double | The total combined price that was paid for the [Contract]({{site.baseurl}}/entity-system/entity-index/contract) instances that make up this Position.
| `bought` | `required`{: .label .label-red } | number, `int32` | The number of times you placed Buy orders for the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract) during this Trading Session that accounted for this Position.
| `boughtValue` | `required`{: .label .label-red } | number, double | The combined value of all of the Buy orders you placed for the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract) over the course of this Trading Session.
| `sold` | `required`{: .label .label-red } | number, `int32` | The number of times you placed Sell orders for the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract) during this Trading Session that accounted for this Position.
| `soldValue` | `required`{: .label .label-red } | number, double | The combined value of all the Sell orders you placed for the given [Contract]({{site.baseurl}}/entity-system/entity-index/contract) over the course of this Trading Session.
| `prevPos` | `required`{: .label .label-red } | number, `int32` | Position previously held during this Trading Week.
| `prevPrice` | `none`{: .label } | number, double | Last known price for your previously held Position.



## Product

#### Related
- [Position]({{site.baseurl}}/entity-system/entity-index/position)
- [Contract]({{site.baseurl}}/entity-system/entity-index/contract)
- [ProductMargin]({{site.baseurl}}/entity-system/entity-index/productmargin)

### Definition

| Property | Tag | Type | Remarks
|:---------|:----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `name` | `required`{: .label .label-red } | string <= 64 chars | The name of this product, ex. `ES`, `MES`, `NQ`, `MNQ`, etc. Product names do not include contract expiration codes (ES~M2~, NQ~Z4~, etc.).
| `currencyId` | `required`{: .label .label-red } | number, `int64` | The currency that backs this product. See [Currency]({{site.baseurl}}/entity-system/entity-index/currency).
| `productType` | `required`{: .label .label-red } | string enum, `"CommonStock"`, `"Continuous"`, `"Cryptocurrency"`, `"Futures"`, `"MarketInternals"`, `"Options"`, `"Spread"` | The type of tradable product that this Product entity represents.
| `description` | `required`{: .label .label-red } | string <= 8192 chars | A short description of what this product represents.
| `exchangeId` | `required`{: .label .label-red } | number, `int64` | The [Exchange]({{site.baseurl}}/entity-system/entity-index/exchange) entity that this product is listed as a member of.
| `contractGroupId` | `required`{: .label .label-red } | number, `int64` | 
| `riskDiscountContractGroupId` | `none`{: .label } | number, `int64` |
| `status` | `required`{: .label .label-red } | string enum, `"Inactive"`, `"Locked"`, `"ReadyForContracts"`, `"ReadyToTrade"`, `"Verified"` |
| `months` | `none`{: .label } | string <= 64 chars | The expiration-month codes available for this product. For example, ES uses `H`, `M`, `U`, and `Z` month codes.
| `isSecured` | `none`{: .label } | boolean | 
| `valuePerPoint` | `required`{: .label .label-red } | number, double | This is an important property of the Product entity for calculating real-time P&L, when combined with the `tickSize` field.
| `priceFormatType` | `required`{: .label .label-red } | string enum, `"Decimal"`, `"Fractional"` | 
| `priceFormat` | `required`{: .label .label-red } | number, `int32` | 
| `tickSize` | `required`{: .label .label-red } | number, double | Useful for calculating open P&L in real-time when combined with the `valuePerPoint` field.

### Notes
You can use the Product entity to help you calculate your real-time open P&L. You need the current price, your entry price or net held price, the value-per-point of the product in question, and the net position you are holding. You can determine the net held price by using the position's `netPrice` field. See [Position]({{site.baseurl}}/entity-system/entity-index/position) for more details. You can use this formula to calculate real-time open P&L for a single product:

```
(currentPrice - netHeldPrice) * valuePerPoint * position.netPos
```

To find the net P&L for all products you can simply run this operation for each product that you hold a position for and then sum the results.





## ProductMargin
You can use this object to find the margin requirements for a product.

#### Related
- [Product]({{site.baseurl}}/entity-system/entity-index/product)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `initialMargin` | `required`{: .label .label-red } | number, double | 
| `maintenanceMargin` | `required`{: .label .label-red } | number, double | 
| `timestamp` | `required`{: .label .label-red } | Date string |  



## ProductSession
Represents the weekly open/close schedule for this product *not* considering holidays.

#### Related
- [Product]({{site.baseurl}}/entity-system/entity-index/product)
- [ProductMargin]({{site.baseurl}}/entity-system/entity-index/productmargin)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `openTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 
| `startTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 
| `stopTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 
| `closeTime` | `required`{: .label .label-red } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 
| `sundayOpenTime` | `label`{: .label } | [TradeTime]({{site.baseurl}}/entity-system/entity-index/tradetime) | 



## RestrainedOrderVersion

#### Related
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [OrderVersion]({{site.baseurl}}/entity-system/entity-index/orderversion)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `action` | `required`{: .label .label-red } | string enum, `"Buy"` `"Sell"` | 
| `clOrdId` | `none`{: .label } | string <= 64 chars | 
| `orderType` | `required`{: .label .label-red } | string enum, `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | 
| `price` | `none`{: .label } | number, double | 
| `stopPrice` | `none`{: .label } | number, double | Required for the `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number, `int32` | 
| `pegDifference` | `none`{: .label } | number, double | 
| `timeInForce` | `none`{: .label } | string enum, `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | 
| `expireTime` | `none`{: .label } | Date string | Required for `"GTD"` type time-in-force property.
| `text` | `none`{: .label } | string <= 64 chars | 




## TradeDate
An object that represents the date of a trade session by its `year`, `month` and `day`.

#### Related
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)
- [Fill]({{site.baseurl}}/entity-system/entity-index/fill)
- [Position]({{site.baseurl}}/entity-system/entity-index/position)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `year` | `required`{: .label .label-red } | number, `int32` |
| `month` | `required`{: .label .label-red } | number, `int32` |
| `day` | `required`{: .label .label-red } | number, `int32` | 



## TradeTime
Object that represents an open or close time for a market by its hour and minute values.

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:------|
| `hour` | `required`{: .label .label-red } | number, `int32` |
| `minute` | `required`{: .label .label-red } | number, `int32` | 



## TradingPermission
An object that represents a permission that has been granted from one [User]({{site.baseurl}}/entity-system/entity-index/user) to another to trade that user's [Account]({{site.baseurl}}/entity-system/entity-index/account).

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [`/user/requestTradingPermission`]({{site.baseurl}}/all-ops/user/requesttradingpermission)
- [`/user/acceptTradingPermission`]({{site.baseurl}}/all-ops/user/accepttradingpermission)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `userId` | `required`{: .label .label-red } | number, `int64` | [User]({{site.baseurl}}/entity-system/entity-index/user) to grant the TradingPermission.
| `accountId` | `required`{: .label .label-red } | number, `int64` | [Account]({{site.baseurl}}/entity-system/entity-index/account) entity owned by the caller for which to grant permission.
| `accountHolderContact` | `required`{: .label .label-red } | string <= 64 chars | Full name of the original [Account]({{site.baseurl}}/entity-system/entity-index/account) holder.
| `accountHolderEmail` | `required`{: .label .label-red } | string <= 64 chars | Email address of the original [Account]({{site.baseurl}}/entity-system/entity-index/account) holder.
| `ctaContact` | `required`{: .label .label-red } | string <= 64 chars | Full name of the user being granted permission.
| `ctaEmail` | `required`{: .label .label-red } | string <= 64 chars | Email address of the user being granted permission.
| `updated` | `none`{: .label } | Date string | 
| `approvedById` | `none`{: .label } | number, `int64` | ID of approving [User]({{site.baseurl}}/entity-system/entity-index/user). 



## TradovateSubscription
An object that represents an instance of a subscription defined by a [TradovateSubscriptionPlan]({{site.baseurl}}/entity-system/entity-index/tradovatesubscriptionplan) entity.

#### Related
- [TradovateSubscriptionPlan]({{site.baseurl}}/entity-system/entity-index/tradovatesubscriptionplan)
- [`/user/addTradovateSubscription`]({{site.baseurl}}/all-ops/user/addtradovatesubscription)
- [`/user/cancelTradovateSubscription`]({{site.baseurl}}/all-ops/user/canceltradovatesubscription)


### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `userId` | `required`{: .label .label-red } | number, `int64` | ID of the [User]({{site.baseurl}}/entity-system/entity-index/user) holding this TradovateSubscription.
| `timestamp` | `required`{: .label .label-red } | string Date | JSON encoded Date string representing the creation time.
| `planPrice` | `required`{: .label .label-red } | number, `double` | Price value of the TradovateSubscription.
| `tradovateSubscriptionPlanId` | `required`{: .label .label-red } | number, `int64` | ID of the [TradovateSubscriptionPlan]({{site.baseurl}}/entity-system/entity-index/tradovatesubscriptionplan) entity associated with this TradovateSubscription instance.
| `startDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | The [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) date object representing the day, month, and year that this TradovateSubscription started.
| `expirationDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | The [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) date object representing the day, month, and year that this TradovateSubscription ended or will end.
| `paidAmount` | `required`{: .label .label-red } | number, `double` | Amount representing the value invested in the subscription's purchase. For Vendor subscriptions, this value will typically be 0. This is because of the way we measure monthly active users, and instead a statement is generated monthly.
| `creditCardTransactionId` | `none`{: .label } | number, `int64` | ID of the corresponding credit card transaction, if applicable.
| `cashBalanceLogId` | `none`{: .label } | number, `int64` | If a Tradovate account was used to make this purchase, a [CashBalanceLog]({{site.baseurl}}/entity-system/entity-index/cashbalancelog) will be generated.
| `creditCardId` | `none`{: .label } | number, `int64` | If a credit card was used to make the purchase of this plan, its ID will be non-null.
| `accountId` | `none`{: .label } | number, `int64` | If a Tradovate account was used to make this purchase, the [Account]({{site.baseurl}}/entity-system/entity-index/account) entity's ID will be non-null.
| `cancelledRenewal` | `none`{: .label } | boolean | `true` when the auto-renewal has been cancelled for this subscription.
| `cancelReason` | `none`{: .label } | string | A provided text reason for the cancellation, provided when calling [`/user/cancelTradovateSubscription`]({{site.baseurl}}/all-ops/user/canceltradovatesubscription).




## User
Represents a Tradovate User. 

### Definition

| Property | Tags | Type | Remarks
|:---|:---|:---|:---
| `id` | `none`{: .label } | number, `int64` | This is probably the most useful property for a typical client. You'll need your `userId` to call other endpoints.
| `name` | `required`{: .label .label-red } | string [3..64] chars | 
| `timestamp` | `required`{: .label .label-red} | Date string | 
| `email` | `required`{: .label .label-red } | string <= 64 chars | 
| `status` | `required`{: .label .label-red } | string enum, `"Active"` `"Closed"` `"Initiated"` `"TemporaryLocked"` `"UnconfirmedEmail"` |
| `professional` | `required`{: .label .label-red } | boolean | 
| `organizationId` | `none`{: .label } | number, `int64` |
| `linkedUserId` | `none`{: .label } | number, `int64`|
| `foreignIntroducingBrokerId` | `none`{: .label } | number, `int64` |




## UserAccountAutoLiq
An object that represents the auto-liquidation rules for an account.

#### Related
- [Account]({{site.baseurl}}/entity-system/entity-index/account)
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)
- [`/userAccountAutoLiq/update`]({{site.baseurl}}/all-ops/risks/useraccountautoliqupdate)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `changesLocked` | `none`{: .label } | boolean |
| `marginPercentageAlert` | `none`{: .label } | number, double | Percent Margin consumed before producing an Alert
| `dailyLossPercentageAlert` | `none`{: .label } | number, double | Percent of balance lost before producing an Alert.
| `dailyLossAlert` | `none`{: .label } | number, double | Currency value loss before producing an Alert.
| `marginPercentageLiqOnly` | `none`{: .label } | number, double | Same as `marginPercentageAlert` but puts the [Account]({{site.baseurl}}/entity-system/entity-index/account) in Liquidate-Only Mode instead of producing an Alert.
| `dailyLossPercentageLiqOnly` | `none`{: .label } | number, double | Same as `dailyLossPercentageAlert` but puts the [Account]({{site.baseurl}}/entity-system/entity-index/account) in Liquidate-Only Mode instead of producing an Alert.
| `dailyLossLiqOnly` | `none`{: .label } | number, double | Same as `dailyLossAlert` but puts the [Account]({{site.baseurl}}/entity-system/entity-index/account) in Liquidate-Only Mode instead of producing an Alert.
| `marginPercentAutoLiq` | `none`{: .label } | number, double | Same as `marginPercentageAlert` and `marginPercentageLiqOnly`, but Auto-Liquidates the [Account]({{site.baseurl}}/entity-system/entity-index/account) instead of producing an Alert or placing the account into Liquidate Only Mode.
| `dailyLossPercentageAutoLiq` | `none`{: .label } | number, double | Same as `dailyLossPercentageAlert` and `dailyLossPercentageLiqOnly`, but Auto-Liquidates the [Account]({{site.baseurl}}/entity-system/entity-index/account) instead of producing an Alert or placing the account into Liquidate Only Mode.
| `dailyLossAutoLiq` | `none`{: .label } | number, double | Same as `dailyLossAlert` and `dailyLossLiqOnly`, but Auto-Liquidates the [Account]({{site.baseurl}}/entity-system/entity-index/account) instead of producing an Alert or placing the account into Liquidate Only Mode.
| `weeklyLossAutoLiq` | `none`{: .label } | number, double | Currency value loss during the week required to trigger an Auto-Liquidation.
| `flattenTimestamp` | `none`{: .label } | Date string | This useful risk management parameter can force you into a flat position at the given time. This means regardless of the state of a trade, at time `flattenTimestamp`, your account will attempt to flatten any open positions.
| `trailingMaxDrawdown` | `none`{: .label } | number, double | The maximum currency value below the starting balance that your account will be allowed to fall under before being auto-liquidated. This value trails profit, but stops once the trailing drawdown is equal to the original balance. This means Trailing Max Drawdown always exists within the following range: `(orginalBalance - trailingDDBaseValue) <= trailingDD <= originalBalance`
| `trailingMaxDrawdownLimit` | `none`{: .label } | number, double | Stop drawdown at a certain value. 
| `trailingMaxDrawdownMode` | `none`{: .label } | string enum, `"EOD"` `"Realtime"` | Calculate trailing Max Drawdown at End-of-Day, or in Realtime?
| `dailyProfitAutoLiq` | `none`{: .label } | number, double | Currency value amount of daily profit before Auto-Liquidating the [Account]({{site.baseurl}}/entity-system/entity-index/account).
| `weeklyProfitAutoLiq` | `none`{: .label } | number, double | Currency value amount of weekly profit before Auto-Liquidating the [Account]({{site.baseurl}}/entity-system/entity-index/account). 
| `doNotUnlock` | `none`{: .label } | number, double | PERMANENTLY lock the account if auto-liq settings are hit.



## UserAccountPositionLimit
An object that represents a Position Limit. This object can be parameterized by its sister-object, [AccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/accountriskparameter).

#### Related
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)
- [AccountRiskStatus]({{site.baseurl}}/entity-system/entity-index/accountriskstatus)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `contractId` | `none`{: .label } | number, `int64` | Entity ID of a [Contract]({{site.baseurl}}/entity-system/entity-index/contract) that this Position Limit should apply to.
| `productId` | `none`{: .label } | number, `int64` | Entity ID of a [Product]({{site.baseurl}}/entity-system/entity-index/product) that this Position Limit should apply to.
| `exchangeId` | `none`{: .label } | number, `int64` | Entity ID of an [Exchange]({{site.baseurl}}/entity-system/entity-index/exchange) that this Position Limit should apply to.
| `productType` | `none`{: .label } | string enum, `"CommonStock"`, `"Continuous"`, `"Cryptocurrency"`, `"Futures"`, `"MarketInternals"`, `"Options"`, `"Spread"` |
| `riskDiscountContractGroupId` | `none`{: .label } | number, `int64` |
| `productVerificationStatus` | `none`{: .label } | string enum, `"Inactive"`, `"Locked"`, `"ReadyForContracts"`, `"ReadyToTrade"`, `"Verified"` |
| `contractGroupId` | `none`{: .label } | number, `int64` |
| `active` | `required`{: .label .label-red } | boolean |
| `riskTimePeriodId` | `none`{: .label } | number, `int64` |
| `totalBy` | `required`{: .label .label-red } | string enum, `"Contract"`, `"ContractGroup"`, `"DiscountGroup"`, `"Exchange"`, `"Overall"`, `"Product"`, `"ProductType"` | The method used to total this Position Limit's `longLimit`, `shortLimit` or total `exposedLimit` fields. If using `"Contract"` for example, an `exposedLimit` of 10 would allow you to to hold a max position of +/- 10 contracts.
| `shortLimit` | `none`{: .label } | number, `int32` |
| `longLimit` | `none`{: .label } | number, `int32` |
| `exposedLimit` | `none`{: .label } | number, `int32` |
| `description` | `none`{: .label } | string <= 64 chars | Optional string to describe this Position Limit.
| `accountId` | `required`{: .label .label-red } | number, `int64`



## UserAccountRiskParameter
This entity is used to parameterize an [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit).

#### Related
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit)
- [AccountRiskStatus]({{site.baseurl}}/entity-system/entity-index/accountriskstatus)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | AccountRiskParameter entity ID.
| `contractId` | `none`{: .label } | number, `int64` | Used to declare that this risk parameter should be applied to the [Contract]({{site.baseurl}}/entity-system/entity-index/contract) with this ID.
| `productId` | `none`{: .label } | number, `int64` | Used to declare that this risk parameter should be applied to the [Product]({{site.baseurl}}/entity-system/entity-index/product) with this ID.
| `exchangeId` | `none`{: .label } | number, `int64` | Used to declare that this risk parameter should be applied to the [Exchange]({{site.baseurl}}/entity-system/entity-index/exchange) with this ID.
| `productType` | `none`{: .label } | string enum, `"CommonStock"`, `"Continuous"`, `"Cryptocurrency"`, `"Futures"`, `"MarketInternals"`, `"Options"`, `"Spread"` | Overarching Product Type that is the target for this risk parameter. See [Product]({{site.baseurl}}/entity-system/entity-index/product).
| `riskDiscountContractGroupId` | `none`{: .label } | number, `int64` | 
| `productVerificationStatus` | `none`{: .label } | string enum, `"Inactive"`, `"Locked"`, `"ReadyForContracts"`, `"ReadyToTrade"`, `"Verified"` |
| `contractGroupId` | `none`{: .label } | number, `int64` | 
| `maxOpeningOrderQty` | `none`{: .label } | number, `int32` | Controls the number of positions that can be opened at a time. For example a `maxOpeningOrderQty` of 1 would only allow the user place 1 order at a time, but up to whatever the `exposedLimit`, `longLimit` or `shortLimit` on the Position Limit entity is. For a user in the default risk category the `maxOpeningOrderQty` defaults to 100, allowing a user to place up to 100 orders in a single move if that user has margin eligibility to do so for the contract being traded.
| `maxClosingOrderQty` | `none`{: .label } | number, `int32` | Works just like `maxOpeningOrderQty`, but instead for placing orders to close positions. This value also defaults to 100 for default risk category users.
| `maxBackMonth` | `none`{: .label } | number, `int32` | Controls the maximum number of months prior to the expiration of a contract that you can trade that contract.
| `preExpirationDays` | `none`{: .label } | number, `int32` | Controls the maximum number of days before a contract's expiration before you must roll forward. Does not mandate that you roll forward but you will fail to pass risk settings when trying to place a trade in fewer than `preExpirationDays` days prior to the contract's expiration.
| `marginPercentage` | `none`{: .label } | number, double | The maximum percentage of your available margin that you may consume before failing risk on new orders.
| `marginDollarValue` | `none`{: .label } | number, double | The maximum currency value that you will be allowed to margin for trades, after which you will fail at risk on new orders.
| `hardLimit` | `none`{: .label } | boolean | 
| `userAccountPositionLimitId` | `required`{: .label .label-red } | number, `int64` | The ID of the associated [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit) entity for this Risk parameter. 



## UserPlugin
An object that represents a purchasable plugin.

#### Related
- [Entitlement]({{site.baseurl}}/entity-system/entity-index/entitlement)
- [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/entitlementsubscription)
- [`/userPlugin/addEntitlementSubscription`]({{site.baseurl}}/all-ops/userPlugin/addentitlementsubscription)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` |
| `userId` | `required`{: .label .label-red } | number, `int64` | 
 



## AccessTokenResponse
The expected shape of the `/auth/accessTokenRequest` response.

#### Related
- [`/auth/accessTokenRequest`]({{site.baseurl}}/all-ops/auth/accesstokenrequest)
- [`/auth/renewAccessToken`]({{site.baseurl}}/all-ops/auth/renewaccesstoken)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Should the request succeed at the HTTP level, but fail to pass a check on the Tradovate Server this field should be populated.
| `accessToken` | `none`{: .label } | string | Upon successful response, this field represents the access token that you will use to satisfy the Authentication header in your HTTP requests, and to authenticate WebSockets via the open response.
| `expirationTime` | `none`{: .label } | Date string | The time after which the access token will be considered 'expired'. Prior to this time, you can renew your access token using the `/auth/renewAccessToken` operation
| `passwordExpirationTime` | `none`{: .label } | Date string | 
| `userStatus` | `none`{: .label } | `"Active"` `"Closed"` `"Initiated"` `"TemporaryLocked"` `"UnconfirmedEmail"` | Used to determine the state of a [User]({{site.baseurl}}/entity-system/entity-index/user).
| `userId` | `none`{: .label } | number | The ID of the [User]({{site.baseurl}}/entity-system/entity-index/user) to whom the API Key is registered.
| `name` | `none`{: .label } | string | This field can be used for the `accountSpec` field in the `/order/placeOrder` (and family of) operation(s). Mainly used to identify what user is trading an account (multiple users can trade an account given that they have permission to do so).
| `hasLive` | `none`{: .label } | boolean | Does this user have a funded LIVE account? `true` if yes.



## CashBalanceSnapshot
A snapshot of an [Account]({{site.baseurl}}/entity-system/entity-index/account)'s balance at the time of the request.

#### Related
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [Account]({{site.baseurl}}/entity-system/entity-index/account)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Non-empty if the request failed.
| `totalCashValue` | `none`{: .label } | number | 
| `totalPnL` | `none`{: .label } | number | May not be included if none of the other `PnL` fields are filled.
| `initialMargin` | `none`{: .label } | number | 
| `maintenanceMargin` | `none`{: .label } | number | 
| `netLiq` | `none`{: .label } | number | 
| `openPnL` | `none`{: .label } | number | May not be included if you do not have an open position.
| `realizedPnL` | `none`{: .label } | number | May not be included if you have not opened and closed a trade during the session.
| `weekRealizedPnL` | `none`{: .label } | number | May not be included if you have not opened and closed a trade yet this week.




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



## CommandResult
Response from `order/cancelOrder` or `order/modifyOrder` operations.

#### Related
- [Command]({{site.baseurl}}/entity-system/entity-index/command)
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/commandreport)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `failureReason` | `none`{: .label } | `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `failureText` | `none`{: .label } | string | Non-empty if the request passed at the HTTP level, but failed a check on the server.
| `commandId` | `none`{: .label } | number | Non-empty if the [Command]({{site.baseurl}}/entity-system/entity-index/command) succeeded.




## DeleteResultResponse
The message received when using either the `userAccountPositonLimit/deleteUserAccountPositionLimit` or `userAccountRiskParameter/deleteUserAccountRiskParameter` operations.

#### Related
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)
- [UserAccountAutoLiq]({{site.baseurl}}/entity-system/entity-index/useraccountautoliq)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Non-empty if the request failed.
| `success` | `none`{: .label } | boolean | 



## EntitlementSubscriptionResponse
Expected response from the [`/userPlugin/addEntitlementSubscription`]({{site.baseurl}}/all-ops/userPlugin/addentitlementsubscription) operation.

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string <= 8192 chars | Non-empty if the request failed.
| `errorCode` | `none`{: .label } | Enum, `"ConflictWithExisting"` `"DowngradeNotAllowed"` `"IncompatibleCMEMarketDataSubscriptionPlans"` `"IncorrectPaymentMethod"` `"InsufficientFunds"` `"PaymentProviderError"` `"PlanDiscontinued"` `"SingleTrialOnly"` `"Success"` `"UnknownError"` |
| `entitlementSubscription` | `none`{: .label } | [EntitlementSubscription]({{site.baseurl}}/entity-system/entity-index/addentitlementsubscription) | 



## OrderStrategyStatusResponse
Expected response from the [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/orderstrategy)'s `start`, `modify`, and `interrupt` operations.

#### Related
- [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/orderstrategy)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Non-empty if the request failed.
| `orderStrategy` | `none`{: .label } | [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/orderstrategy) |



## PlaceOcoResult
Expected result object from a request to `/order/placeOCO`.

#### Related
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [Command]({{site.baseurl}}/entity-system/entity-index/command)
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/commandreport)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `failureReason` | `none`{: .label } | `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `failureText` | `none`{: .label } | string | Non-empty if the request passed at the HTTP level, but failed a check on the server.
| `orderId` | `none`{: .label } | number | Linked [Order]({{site.baseurl}}/entity-system/entity-index/order).
| `ocoId` | `none`{: .label } | number | `other` linked [Order]({{site.baseurl}}/entity-system/entity-index/order).



## PlaceOrderResult
Expected server response object when calling the `/order/placeOrder` operation.

#### Related
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [Command]({{site.baseurl}}/entity-system/entity-index/command)
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/commandreport)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `failureReason` | `none`{: .label } | `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `failureText` | `none`{: .label } | string | Non-empty if the request passed at the HTTP level, but failed a check on the server.
| `orderId` | `none`{: .label } | number | Related [Order]({{site.baseurl}}/entity-system/entity-index/order) entity.



## PlaceOsoResult
Expected server response object when calling the `/order/placeOrder` operation.

#### Related
- [Order]({{site.baseurl}}/entity-system/entity-index/order)
- [Command]({{site.baseurl}}/entity-system/entity-index/command)
- [CommandReport]({{site.baseurl}}/entity-system/entity-index/commandreport)
- [ExecutionReport]({{site.baseurl}}/entity-system/entity-index/executionreport)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `failureReason` | `none`{: .label } | `"AccountClosed"` `"AdvancedTrailingStopUnsupported"` `"AnotherCommandPending"` `"BackMonthProhibited"` `"ExecutionProviderNotConfigured"` `"ExecutionProviderUnavailable"` `"InvalidContract"` `"InvalidPrice"` `"LiquidationOnly"` `"LiquidationOnlyBeforeExpiration"` `"MaxOrderQtyIsNotSpecified"` `"MaxOrderQtyLimitReached"` `"MaxPosLimitMisconfigured"` `"MaxPosLimitReached"` `"MaxTotalPosLimitReached"` `"MultipleAccountPlanRequired"` `"NoQuote"` `"NotEnoughLiquidity"` `"OtherExecutionRelated"` `"ParentRejected"` `"RiskCheckTimeout"` `"SessionClosed"` `"Success"` `"TooLate"` `"TradingLocked"` `"TrailingStopNonOrderQtyModify"` `"Unauthorized"` `"UnknownReason"` `"Unsupported"` | 
| `failureText` | `none`{: .label } | string | Non-empty if the request passed at the HTTP level, but failed a check on the server.
| `orderId` | `none`{: .label } | number | The entry [Order]({{site.baseurl}}/entity-system/entity-index/order) entity.
| `oso1Id` | `none`{: .label } | number | One of up to two linked [Order]({{site.baseurl}}/entity-system/entity-index/order) entities.
| `oso2Id` | `none`{: .label } | number | One of up to two linked [Order]({{site.baseurl}}/entity-system/entity-index/order) entities.










# How is the Tradovate API Partitioned?

A major concept of the API is partitioned functionality. Each base URL represents a different part of the API’s set of features. There are two main paths that we can use the API by:

* **The Tradovate REST API**
* **The Tradovate WebSocket API**

### Rest API
The **REST API** is a classic web API. The client makes HTTP requests to the appropriate URL endpoint, and if the request was formatted correctly it will succeed, possibly returning some relevant data back to the client. 

Here are the base URLs associated with the REST API:

`https://demo.tradovateapi.com/v1`
`https://live.tradovateapi.com/v1`

The difference between these base URLs is which environment the endpoints you call will run in. The **demo** environment runs in simulation mode - this is a demo account; it uses fake money, but the market data is real - whereas the **live** environment uses your real, funded account for making trades. A developer could run his or her tests through simulation mode as long as he or she wants to, allowing a smooth transition to a funded account.

### WebSocket API
The **WebSocket API** is a set of WebSocket-based services that a client may connect to in order to receive real-time data in an event-driven manner. Typically the connected client sends messages via the WebSocket to start or stop real-time subscriptions. However, the WebSocket servers are also designed to mimic the REST API, so a client could send whatever requests are appropriate for the type of WebSocket configured. 

>**Note**: *to use the WebSocket API you still need to be authenticated and retrieve an Access Token using the REST API - these domains are not alternatives to one another, just different features.*

The WebSocket API itself covers three separate domains:

1. The standard **Real-Time API**. This is mainly for listening to the real-time user synchronization subscription (user/syncRequest). This is located at the URL `wss://demo.tradovateapi.com/v1/websocket` or `wss://live.tradovateapi.com/v1/websocket` for simulation or live functionality, respectively.

2. The **Market Data API**. This is located at `wss://md.tradovateapi.com/v1/websocket`. You can subscribe to real-time quotes, DOMs, charts, and histogram data from this type of socket.

3. The **Market Replay API**. This is located at `wss://replay.tradovateapi.com/v1/websocket`. A Market Replay socket allows a client to subscribe to a certain timeframe and ‘replay’ that timeframe. This is not just historical chart data, but all of the DOM and market data for this time period, as well as an interactive session that a client can trade in as if it were live.



# How to Handle Data Size Limits
The Tradovate API imposes flexible data size limits per request. There is no ‘hard-cap’ on data batch size; what may be the limit one day can change on another day. To get more than the maximum batched amount of data per request, you’ll simply have to make more requests. Imagine this scenario:

* A client wants to gather 1-minute chart data over the last 3 years.

* The client authenticates their application, and then authorizes a WebSocket connection to the Market Data URL.

* The client attempts a md/getChart request to retrieve data from dates three years apart, however only the last several months of data arrives. This is because the maximum amount of data transmitted by the response has been reached.

In order to get more data than the maximum amount per request, we must make several requests and track their timestamps to get the complete set of data. Assuming the client is running a WebSocket connected to the Market Data URL, we could solve the problem described above by doing the following:

* However your application catches messages from the WebSocket server, you will need to make sure you add a condition to account for the end-of-history object. It looks like this if you parse it to a JS native object:

```js
{
    id: 123456789 //the realtimeId of the getChart subscription
    eoh: true
}
```

* You’ll also need to keep track of the data you’ve gathered so far. It’s probably a good idea to keep all of the `chart.bars` array data.

* When you receive the end-of-history object, you will need to look at the gathered bars and sort them by timestamp. You need to find the oldest bar, and start a new subscription using its timestamp as the closestTimestamp field in md/getChart’s body.

```js
{
    closestTimestamp: oldestBar.timestamp,
    asFarAsTimestamp: targetDate //in our example, 3 years ago
}
```
* Wait for the next end-of-history object. If the oldest bar’s timestamp is equal to the target date, break out of the loop or resolve the chain of promises with the gathered data. Otherwise repeat the above steps until the oldest bar is your target date.

Also see the [large-chart-request project](https://github.com/tradovate/example-api-faq/tree/main/example-code/large-chart-requests) for an example of how to request large data sets in JavaScript.



# How to Handle Request Limits
It’s likely that at some point, despite your best efforts, you’ll get a time penalty response during the course of writing programs that utilize the Tradovate API. This is perfectly OK, is an intentional response, and can be handled fairly easily. Here is a scenario:

* Your program sends a request to modify a working order’s price based on a condition. By some market movement the programmer may not have accounted for, this condition becomes triggered many times within just a few seconds.

* Instead of the typical response, you receive a response with the `p-ticket` and `p-time` fields. The server has determined that a threshold has been reached and issues the time penalty response. 

>**Note**: *If you receive an object with a `p-captcha` field, this means a third party application cannot complete the request and clients should be directed to try again in an hour.* 

To handle the above scenario, we simply need to use the p-time field to determine the time in seconds before we can make a request again. When we retry the request we should include p-ticket as an additional field in the request body (including the original body fields). 
 
```js
const URL = `https://demo.tradovateapi.com/v1`

//we can simulate too many requests by putting them in a loop
const simulatePenalty = async () => {
    let penaltyResponse, okResponse

    //this would be a really bad idea in a non-demo scenario!
    for(let i = 0; i < 100; i++) {
        penaltyResponse = await fetch(URL + `/order/placeOrder`, {
            accountSpec: yourUserName,
             accountId: yourAcctId,
             action: "Buy",
             symbol: "MYMM1",
             orderQty: 1,
             orderType: "Market",
             isAutomated: true
        })
        if(penaltyResponse["p-ticket"]) {
            break //exit loop on penalty response received
        }
    }
    const pTime    = penaltyResponse["p-time"],
          pTicket  = penaltyResponse["p-ticket"],
          pCaptcha = penaltyResponse["p-captcha"]
    
    if(pCaptcha) {
        console.error("Captcha required. Please try again in 1 hour.")
	   return
    }
    console.log(`Trying again in ${pTime} seconds...`)
    const timeout = setTimeout(() => {
        okResponse = await fetch(URL + `/order/placeOrder`, {
           accountSpec: yourUserName,
            accountId: yourAcctId,
            action: "Buy",
            symbol: "MYMM1",
            orderQty: 1,
            orderType: "Market",
            isAutomated: true,
            "p-ticket": pTicket            
        })
    }, 1000 * pTime)
   
    console.log(okResponse)
}

simulatePenalty()
```



# API Frequently Asked Questions

In this section you will find common questions about API use and workflows.
{: .fs-6 .fw-300 }



# REST API vs WebSocket API

Because the REST and WebSocket APIs are split up by functionality, it follows that the optimal use cases for either API will vary. Here are some common examples of when to choose the REST API and when to choose a WebSocket.

### When to Use the REST API
* Authentication - you can only authenticate your application for API access using the REST API’s auth/accessTokenRequest using your Tradovate credentials and one of your personal secret keys.

* Non-subscribing requests - If you want to place an order, find an entity by ID, or search for an entity by name, it is perfectly acceptable to do so using the REST API. There are even options for batch-loading large requests using the /ldeps endpoints.

* OAuth - If you’d like to opt for authentication via OAuth, you will need to use REST operations to do so, but beyond the OAuth grant you aren't limited to one of REST or WebSocket protocols.

* Changing Account Risk status - creating or modifying risk limits are non-subscribing and can be acceptably called from the REST API.

### When to Use the WebSockets API
* Listening to user property events - anytime we create or modify a user property (entering a position, executing a command, filling an order, changes to cash-balance, and many more) we can listen to them using a Real-Time socket and subscribing to the user/syncRequest endpoint.

* Getting Market Data - when we want to receive quote, DOM, chart, or histogram data in real-time.

* Starting a Market Replay session.

* Finding a change in user data in response to performing an action. Scenario: You’ve placed an order and now you want to find what your new position is. You can try to find the position itself via REST API, but it would be more efficient to listen to the real-time user properties events and wait for a Position update. This way we can be ‘reactive’ to incoming data instead of always looking out and asking in a client-driven manner.
