---
layout: default
title: DeleteResultResponse
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/deleteresultresponse
---

## DeleteResultResponse
The message received when using either the `userAccountPositonLimit/deleteUserAccountPositionLimit` or `userAccountRiskParameter/deleteUserAccountRiskParameter` operations.

#### Related
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/entity-index/useraccountpositionlimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/entity-index/useraccountriskparameter)
- [UserAccountAutoLiq]({{site.baseurl}}/entity-system/entity-index/useraccountautoliq)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Non-empty if the request failed.
| `success` | `none`{: .label } | boolean | 