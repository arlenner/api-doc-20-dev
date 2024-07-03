---
layout: default
title: WebSocket Guide
permalink: /wss-guide/
nav_order: 5
has_children: true
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
