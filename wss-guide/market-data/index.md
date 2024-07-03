---
layout: default
title: Realtime Market Data
permalink: /wss-guide/market-data
nav_order: 6
has_children: true
parent: WebSocket Guide
---

<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

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
