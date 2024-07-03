---
layout: default
title: Heartbeats
permalink: /wss-guide/heartbeats
nav_order: 2
parent: WebSocket Guide
---

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