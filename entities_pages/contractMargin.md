---
layout: page
title: ContractMargin
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/contractmargin
---

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