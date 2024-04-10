---
layout: page
title: Storing User Data
permalink: /rest-guide/storing-user-data/
parent: REST Guide
nav_order: 5
---

# Storing User Data
Whether you're writing a NodeJS application or a browser-based application, you will eventually want to cache some of the data you gather from the API locally. This makes sense with many retrieved entities actually, but we'll make a case out of general session and user data - we want to store our Access Token and our Account information. Having these values on hand is very helpful when making a lot of API requests.

The method that I use for storage in this guide is quite simple, but effective. As a bonus it will work in a Node terminal or a browser, even in incognito mode. Here's the code:

```js
// define keys for accessing the storage bank
const USER_DATA_KEY = 'tradovate-session-user-data',
      USER_ACCT_KEY = 'tradovate-session-acct-data'

// a simple object will do for our storage helper
const SYSTEM = {}

// these internal accessors will determine the correct 
// storage source for the environment we're running
SYSTEM.set = (k, item) => {
    if(window && window.sessionStorage) {
        sessionStorage.setItem(k, item)
    } else {
        process.env[k] = JSON.stringify(item)
    }
}

SYSTEM.get = k => {
    let r;
    if(window && window.sessionStorage) {
        r = sessionStorage.getItem(k)
    } else {
        r = process.env[k]
    }
    try {
        r = JSON.parse(r)
        return r
    } catch(err) {
        console.error(err)
    }
}

// export the storage accessors
export const Storage = {
    setUserData(data) {
        SYSTEM.set(USER_DATA_KEY, data)
    },
    getUserData() {
        return SYSTEM.get(USER_DATA_KEY)
    },

    setAccounts(accts) {
        SYSTEM.set(USER_ACCT_KEY, accts)
    },
    getAccounts() {
        return SYSTEM.get(USER_ACCT_KEY)
    },
    
}
```

As your application expands, you can add more storage keys and accessors as necessary. Remember *NEVER STORE USER CREDENTIALS*. Don't expose yourself or others to web security threats!

### Usage
Using this simple storage system is easy. After you've retrieved your token and user info, you can set the data to the storage system like so:

```js
import { API } from '../../../shared/api'
import { Storage } from '../../../storage'

async function startSession(credentials) {
    const userData = await API.auth.accessTokenRequest({ credentials })
    Storage.setUserData(userData)

    const accounts = await API.account.list()
    Storage.setAccounts(accounts)
}
```

---
[{% include chev-left.html %} Renewing Your Access Token]({{site.baseurl}}/rest-guide/renewing-access){: .btn .btn-blue .text-grey-lt-000 }
[Place An Order {% include chev-right.html %}]({{site.baseurl}}/rest-guide/place-an-order){: .btn .float-right .btn-blue .text-grey-lt-000 }

---