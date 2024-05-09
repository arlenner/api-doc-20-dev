---
layout: page
title: /auth/renewAccessToken
parent: Auth
grand_parent: API Operations
permalink: /all-ops/auth/renewaccesstoken
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'RenewAccessToken',
            endpoint: '/auth/renewaccesstoken',
            method: 'GET'
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/auth/renewAccessToken`
This operation is used to renew an API session's expiration time.

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
|  `<none>`| `none`{: .label } | `<none>` | *(Simple GET request)*

### Response
[AccessTokenResponse]({{site.baseurl}}/entity-system/entity-index/AccessTokenResponse)

### Example

```js
async function renewAccessToken() {
    let response, data
    try {
        //you'll need to have an access token stored that you want to renew
        const accessToken = myRetrieveAccessTokenFromStorageFn()
        response = await fetch('https://live.tradovateapi.com/v1/auth/renewAccessToken', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`.
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
}
```