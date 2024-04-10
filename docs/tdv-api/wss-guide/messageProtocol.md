---
layout: page
title: Message Protocol
permalink: /wss-guide/message-protocol
nav_order: 1
parent: WebSocket Guide
---

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