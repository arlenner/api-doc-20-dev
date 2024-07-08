---
layout: default
title: Constructing HTTP Headers
permalink: /rest-guide/construct-headers/
parent: REST Guide
nav_order: 2
---

# How to Construct Your HTTP Headers
Aside from the [`/auth/accessTokenRequest`]({{site.baseurl}}/all-ops/auth/accesstokenrequest) operation, the API should know how to construct our HTTP headers. Luckily this is very simple. Let's strip away the pre-built implementation and work with the browser's built in `fetch` function.

```js
aysnc function main() {
    const resp = await fetch('https://demo.tradovateapi.com/v1/auth/accessTokenRequest', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })

    const json = await resp.json()

    console.log(json)
}
```

This is an expansion of what the `accessTokenRequest` built-in function actually does. As we see, the `fetch` method takes a config object as its second parameter. In this object you may specify the `headers` field to include the headers necessary to complete your requests.

## Authorization
For the Access Token request, we don't need to include any Authorization headers. But for nearly every other API call, we will need to include our Access Token as a part of the Authorization header.

```js
async function main() {
    const resp = await fetch('https://demo.tradovateapi.com/v1/account/list', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myAccessToken}`
        }
    })

    const json = await resp.json()

    console.log(json)
}
```

We must use the 'Bearer' schema for our Authorization header. For every call other than the initial `accessTokenRequest`, we should use these headers. Here's a helper function to construct these headers with a single call. It will also only include the Authorization header if an `accessToken` is provided.

### `buildHeaders` Helper Function

```js
export function buildHeaders(accessToken) {
    let auth = {}
    if(accessToken) {
        auth = { Authorization: `Bearer ${accessToken}` }
    }

    return {
        headers: {
            ...auth,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
}
```

---

[{% include chev-left.html %} Requesting API Access]({{site.baseurl}}/rest-guide/access-token-request){: .btn .btn-blue .text-grey-lt-000 }
[Device IDs {% include chev-right.html %}]({{site.baseurl}}/rest-guide/device-id){: .btn .float-right .btn-blue .text-grey-lt-000 }

---