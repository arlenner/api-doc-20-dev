---
layout: default
title: /auth/accesstokenrequest
parent: Auth
grand_parent: API Operations
permalink: /all-ops/auth/accesstokenrequest
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'AccessTokenRequest',
            endpoint: '/auth/accesstokenrequest',
            method: 'POST',
            params: {
                name: 'username',
                password: 'password',
                appId: 'your_API_Key_name',
                appVersion: '1.0',
                cid: 0,
                sec: 'API_Secret',
                '// deviceId': 'my_device_id'
            }
        });
    });
</script>

## `/auth/accessTokenRequest`
This operation is used to retrieve an access token using your API Key and Tradovate credentials.

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `name` | `required`{: .label .label-red } | string | Your Tradovate Username.
| `password` | `required`{: .label .label-red } | string | Your Tradovate Password.
| `appId` | `required`{: .label .label-red } | string | This should match the application nickname you chose when you created your API key
| `appVersion` | `required`{: .label .label-red } | string | Arbitrary string that you can use to track your software version
| `cid` | `required`{: .label .label-red } | number | The entity ID of your Client Application API Key. This will be displayed upon key creation, and above the corresponding API key in the Trader UI.
| `sec` | `required`{: .label .label-red } | string | The API Secret, displayed only one time upon key creation. If you fail to record this value or lose this value it cannot be recovered, and you must create a new API Key. 
| `deviceId` | `none`{: .label } | string | Important value that identifies the device used to make this login attempt. Although any device may request an access token, only approved devices may trade Live Accounts. See the [Device ID]({{site.baseurl}}/auth-guide/device-id) section for more details.

### Response
[AccessTokenResponse]({{site.baseurl}}/entity-system/entity-index/accesstokenresponse)

### Example
```js
const credentials = {
    name: 'Your Tradovate Username',
    password: 'Your Tradovate Password',
    appId: 'Sample App',
    appVersion: '1.0',
    cid: 0,
    sec: '12345-abcde-...'
}

async function accessTokenRequest() {
    let response, data
    try {
        response = await fetch('https://live.tradovateapi.com/v1/auth/accessTokenRequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return data
}
```