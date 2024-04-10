---
layout: page
title: Requesting API Access
permalink: /rest-guide/access-token-request/
parent: REST Guide
nav_order: 1
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
                appId: 'keyName',
                appVersion: '1.0',
                cid: 0,
                sec: 'API_Secret'
            }
        });
    });
</script>

# Retrieving an Access Token
To retrieve an Access Token we will need to make a request to the API. Below is the URL that you could use to initiate an `accessTokenRequest` operation on the Demo (simulation) environment:

```js
const URL = 'https://demo.tradovateapi.com/v1/auth/accessTokenRequest';
```

You'll need your login credentials and API Key information to make the request successfully. They will look like this:

```js
const credentials = {
    "name": "your_username",
    "password": "your_password_or_api_dedicated_password",
    "appId": "your_app_nickname",
    "appVersion": "1.0",
    "cid": 0,
    "sec": "your_api_secret"
}
```

Many of these are self-explanatory. In the case of dedicated API passwords, this is an API Key Config option you set when you setup your key. It is used to protect your real password, should the credentials become compromised. You can edit most of your key's settings later from the API Access section of the Trader Application, so don't worry too much about this yet. It is advised for testing, however, that you set your key's permissions to the highest available levels for each setting. You can always drop permissions you don't need later.

## Calling the `accessTokenRequest` Operation

The simplest way to try this with no overhead is by using cURL:

```
curl -X 'POST' \
  'https://demo.tradovateapi.com/v1/auth/accesstokenrequest' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "string",
  "password": "string",
  "appId": "string",
  "appVersion": "string",
  "deviceId": "string",
  "cid": 0,
  "sec": "string"
}'
```

But many applications use JavaScript:

```js
/**
 * Call the `/auth/accessTokenRequest` endpoint.
 * 
 * @param {{ name: string, password: string, appId: string, appVersion: string, deviceId: string, cid: number, sec: string }} credentials 
 * @returns {Promise<{ errorText: string } | { accessToken: string, expirationTime: string, passwordExpirationTime: string, userStatus: 'Active' | 'Closed' | 'Initiated' | 'TemporarilyLocked' | 'UnconfirmedEmail', userId: number, name: string, hasLive: boolean }>}
 */
async function accessTokenRequest(credentials) {
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }

    let response

    try {
        response = await fetch('https://demo.tradovateapi.com/v1/auth/accesstokenrequest', config)
        response = await response.json()
    } catch (err) {
        console.error(err)
    }

    return response
}
```

---

[{% include chev-left.html %} REST Guide]({{site.baseurl}}/rest-guide/){: .btn .btn-blue .text-grey-lt-000 }
[Constructing Headers {% include chev-right.html %}]({{site.baseurl}}/rest-guide/construct-headers){: .btn .float-right .btn-blue .text-grey-lt-000 }

---