---
layout: page
title: Renewing Your Access Token
permalink: /rest-guide/renewing-access/
parent: REST Guide
nav_order: 4
---
<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'RenewAccessToken',
            endpoint: '/auth/renewaccesstoken',
            method: 'GET'
        });
    });
</script>

# Renewing Your Access Token
Over the course of the development process, you'll eventually encounter your token reaching it's expiration time. Once a token has exceeded its expiration, REST calls made using it will return 400 or 401 errors. If the token is within a few minutes of expiration we should call [`/auth/renewAccessToken`]({{site.baseurl}}/all-ops/auth/renewAccessToken).

### Calling `/auth/renewAccessToken` 
Renewing your access token is much easier than retrieving the original. It's a simple `GET` request with no parameters, it simply relies on including the token in the Authorization header of the request. We can use the `buildHeaders` function which we defined in a [previous auth section]({{site.baseurl}}/rest-guide/construct-headers/#buildheaders-helper-function) to create the expected headers.
```js
async function renewAccessProcedure(token) {
    const headers = buildHeaders(token)
    let response

    try {
        response = await fetch('https://demo.tradovateapi.com/v1/auth/renewAccessToken', {
            method: 'GET',
            headers 
        })
        response = await response.json()
    } catch(err) {
        console.error(err)
    }

    return response
}
```

Even simpler than this, however, would be to use the API Object that comes built-in as a reusable piece of this library.

```js
import { API } from '../../../shared/api'

//mostly-pointless wrapper function, just call API.auth.renewAccessToken in the wild.
const renewAccess = async () => await API.auth.renewAccessToken()
```

---

[{% include chev-left.html %} Using Device IDs]({{site.baseurl}}/rest-guide/device-id){: .btn .btn-blue .text-grey-lt-000 }
[Place An Order {% include chev-right.html %}]({{site.baseurl}}/rest-guide/place-an-order){: .btn .float-right .btn-blue .text-grey-lt-000 }