---
layout: default
title: md/getChart
permalink: /wss-guide/market-data/getchart
grand_parent: WebSocket Guide
parent: Realtime Market Data
---

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