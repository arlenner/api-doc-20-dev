---
layout: page
title: DeleteResultResponse
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/deleteresultresponse
---

## DeleteResultResponse
The message received when using either the `userAccountPositonLimit/deleteUserAccountPositionLimit` or `userAccountRiskParameter/deleteUserAccountRiskParameter` operations.

#### Related
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/index/UserAccountPositionLimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/index/UserAccountRiskParameter)
- [UserAccountAutoLiq]({{site.baseurl}}/entity-system/index/UserAccountAutoLiq)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Non-empty if the request failed.
| `success` | `none`{: .label } | boolean | 