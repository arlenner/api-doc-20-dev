---
layout: default
title: Market Replay
permalink: /wss-guide/market-replay
nav_order: 5
has_children: true
parent: WebSocket Guide
---

# Market Replay
Market Replay service allows an API subscriber to start a replay session. A replay session picks a time from the past and plays back the market as it happened at up to 400% of real-time. Additionally, each replay session has an associated sim account generated for the session that you can use for backtesting a strategy, or playing back and analyzing your own trades.

This service is available by connecting a WebSocket to `wss://replay.tradovateapi.com/v1/websocket`.

## Notes
- The Replay Socket is heavily tied to the Market Data socket protocol, as this is where the historic market data you are analyzing will be made available via API. In order to utilize market data through the API, you must first become a registered subvendor of CME Market Data.
- A Replay Socket follows the same protocols and authorization procedure as a Live/Demo socket or an MD socket.
- You should treat a WebSocket connected to the Replay API as if it were connected to both a Live or Demo WebSocket and a Market Data WebSocket. This means you can send both REST-like requests and MD requests to the same Replay socket instance.