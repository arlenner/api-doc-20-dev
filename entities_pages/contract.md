---
layout: page
title: Contract
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/contract
---

## Contract
Simple object to represent a Contract. 

#### Related
- [Product]({{site.baseurl}}/entity-system/index/product)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:--------
| `id` | `none`{: .label } | number, `int64` | 
| `name` | `required`{: .label .label-red } | string <= 64 chars | Name of this contract, consists of Product Code (like ES or NQ) and expiration code (M2, Z4, H1, etc). So for example for an ES contract expiring June of 2027 we would use ESM7 for its contract `name`.
| `contractMaturityId` | `required`{: .label .label-red } | number, `int64` | 