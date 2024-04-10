---
layout: page
title: OrderStrategyStatusResponse
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/orderStrategyStatusResponse
---

## OrderStrategyStatusResponse
Expected response from the [OrderStrategy]({{site.baseurl}}/entity-system/index/OrderStrategy)'s `start`, `modify`, and `interrupt` operations.

#### Related
- [OrderStrategy]({{site.baseurl}}/entity-system/index/OrderStrategy)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Non-empty if the request failed.
| `orderStrategy` | `none`{: .label } | [OrderStrategy]({{site.baseurl}}/entity-system/index/OrderStrategy) |