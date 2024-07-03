---
layout: default
title: How to Use Device IDs
permalink: /rest-guide/device-id/
parent: REST Guide
nav_order: 3
scripts: js/crypto-browserify.js
load_js: true
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
                sec: 'API_Secret',
                deviceId: 'generate_me!'
            }
        });
    });
</script>

# How to Use Device IDs Properly
You may have noticed the `deviceId` field in the body of `/auth/accessTokenRequest`. This is a very important part of obtaining an access token - on simulation mode, device IDs aren't strictly enforced - you can trade with an Access Token that was acquired with an unverified/no device ID; LIVE mode strictly enforces that you use a verified device for trading (so that some stranger with your credentials can't place trades using an account you own). This is a good thing!

To understand device IDs, let's discuss their properties and usage.

## Properties of a Device ID
A proper Device ID must possess two qualities:
1. The ID must be unique. No other device can possess the same ID. 
2. The ID must always be the same for a given device. PC `A` must always have the same ID, but unique from from PC `B`'s ID.

These traits are understandable - each device must be identifiable in order to be eligible for authorization to make real-money trades.

## How Can I Create a Device ID?
There are several ways that we can create device IDs. Here are a two that rely on the third party softwares `device-uuid` ([here](https://www.npmjs.com/package/device-uuid)) and `crypto-browserify` ([here](https://www.npmjs.com/package/crypto-browserify)) respectively.

### Using `device-uuid`
```js
/**
 * Derive a device ID from credentials and app secret using the device-uuid package.
 * @returns {Promise<string>}
 */
async function createDeviceId_DeviceUUID(mySecret, credentials) {
    const deviceId = new DeviceUUID()
    return deviceId.get({ 
        secret: mySecret, 
        name: credentials.name,
        password: credentials.password
    })
}
```

### Using `crypto-browserify`
```js
/**
 * Derive a device ID from credentials and app secret using the crypto-browserify package.
 * @returns {Promise<string>}
 */
async function createDeviceId_CryptoBrowserify(mySecret, credentials) {
    return createHash('sha256')
        .update(mySecret)
        .update(credentials.name)
        .update(credentials.password)   
        .digest('hex')
}
```

### Usage with Credentials
We can mix our Device ID into our `credentials` object before we send the `accessTokenRequest`:
```js
//a value unique to your application that we can use to hash our device IDs
//this will always have the same value (unless you change the phrase)
const mySecret = createHash('sha256')
    .update('My Special Pass-Phrase')
    .digest('hex') 

const deviceId = await createDeviceId_CryptoBrowserify(credentials)

const credsWithId = { ...credentials, deviceId }

const userAccessData = API.auth.accessTokenRequest({ credentials: credsWithId })
```

### Try it! Generate an ID
*\*Uses the `device-uuid` package.*{: .fs-2 }
<script src="{{ 'assets/js/gen-id.js' | relative_url }}"></script>

---
[{% include chev-left.html %} How to Construct Headers]({{site.baseurl}}/rest-guide/construct-headers){: .btn .btn-blue .text-grey-lt-000 }
[Renewing Your Access Token {% include chev-right.html %}]({{site.baseurl}}/rest-guide/renewing-access){: .btn .float-right .btn-blue .text-grey-lt-000 }

---
