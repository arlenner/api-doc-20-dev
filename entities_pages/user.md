---
layout: page
title: User
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/user
---

## User
Represents a Tradovate User. 

### Definition

| Property | Tags | Type | Remarks
|:---|:---|:---|:---
| `id` | `none`{: .label } | number, `int64` | This is probably the most useful property for a typical client. You'll need your `userId` to call other endpoints.
| `name` | `required`{: .label .label-red } | string [3..64] chars | 
| `timestamp` | `required`{: .label .label-red} | Date string | 
| `email` | `required`{: .label .label-red } | string <= 64 chars | 
| `status` | `required`{: .label .label-red } | string enum, `"Active"` `"Closed"` `"Initiated"` `"TemporaryLocked"` `"UnconfirmedEmail"` |
| `professional` | `required`{: .label .label-red } | boolean | 
| `organizationId` | `none`{: .label } | number, `int64` |
| `linkedUserId` | `none`{: .label } | number, `int64`|
| `foreignIntroducingBrokerId` | `none`{: .label } | number, `int64` |
