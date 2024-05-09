---
layout: page
title: AccessTokenResponse
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/accesstokenresponse
---

## AccessTokenResponse
The expected shape of the `/auth/accessTokenRequest` response.

#### Related
- [`/auth/accessTokenRequest`]({{site.baseurl}}/all-ops/auth/accesstokenrequest)
- [`/auth/renewAccessToken`]({{site.baseurl}}/all-ops/auth/renewaccesstoken)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `errorText` | `none`{: .label } | string | Should the request succeed at the HTTP level, but fail to pass a check on the Tradovate Server this field should be populated.
| `accessToken` | `none`{: .label } | string | Upon successful response, this field represents the access token that you will use to satisfy the Authentication header in your HTTP requests, and to authenticate WebSockets via the open response.
| `expirationTime` | `none`{: .label } | Date string | The time after which the access token will be considered 'expired'. Prior to this time, you can renew your access token using the `/auth/renewAccessToken` operation
| `passwordExpirationTime` | `none`{: .label } | Date string | 
| `userStatus` | `none`{: .label } | `"Active"` `"Closed"` `"Initiated"` `"TemporaryLocked"` `"UnconfirmedEmail"` | Used to determine the state of a [User]({{site.baseurl}}/entity-system/entity-index/User).
| `userId` | `none`{: .label } | number | The ID of the [User]({{site.baseurl}}/entity-system/entity-index/User) to whom the API Key is registered.
| `name` | `none`{: .label } | string | This field can be used for the `accountSpec` field in the `/order/placeOrder` (and family of) operation(s). Mainly used to identify what user is trading an account (multiple users can trade an account given that they have permission to do so).
| `hasLive` | `none`{: .label } | boolean | Does this user have a funded LIVE account? `true` if yes.