---
layout: default
title: OrderStrategyStatusResponse
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/orderstrategystatusresponse
---

## OrderStrategyStatusResponse
Expected response from the [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/orderstrategy)'s `start`, `modify`, and `interrupt` operations.

#### Related
- [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/orderstrategy)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Non-empty if the request failed.
| `orderStrategy` | `none`{: .label } | [OrderStrategy]({{site.baseurl}}/entity-system/entity-index/orderstrategy) |