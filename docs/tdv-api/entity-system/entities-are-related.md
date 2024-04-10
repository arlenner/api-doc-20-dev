---
layout: page
title: Entities are Related
permalink: /entity-system/entities-are-related/
parent: The Entity System
nav_order: 1
---

# Entities Are Related
Many entities are related to other entities. You can usually tell when an entity has a relationship with another based on its fields - an entity with relationships will typically store the IDs of the related entities in its own fields. For example, if you look at the [Account]({{site.baseurl}}/entity-system/index/account) entity, you'll see there is a `userId` field for the related User entity, a `clearingHouseId` for whatever clearing house the account uses, `riskCategoryId` for the risk category that this Account belongs to, and an `autoLiqProfileId` for the related Auto-Liquidation Profile.

Understanding how entities relate to one another can be very helpful for understanding how the API works in general. Please refer to the [Entities Index]({{site.baseurl}}/entity-system/index) for a dictionary of Tradovate API Entities and response object schemas.

Here is an example of how to get all of the [Order]({{site.baseurl}}/entity-system/index/Order) entities related to a given [Account]({{site.baseurl}}/entity-system/index/Account).

```js
async function findRelatedOrders(accountId) {
    const { accessToken } = Storage.getUserData()

    let response

    try {
        response = await fetch(`https://demo.tradovateapi.com/v1/order/deps?masterid=${accountId}`, {
            method: 'GET',
            headers: buildHeaders(accessToken)
        })
        response = await response.json()
    } catch(err) {
        console.error(err)
    }

    return response
}
```

Or you can use the built-in API Object:

```js
import { API } from '../../../shared/api'

async function findRelatedOrders(accountId) {
    return await API.order.deps(accountId)
}
```

---

[{% include chev-left.html %} The Entity System]({{site.baseurl}}/entity-system){: .btn .btn-blue .text-grey-lt-000 }
[Shared Operations {% include chev-right.html %}]({{site.baseurl}}/entity-system/shared-ops){: .btn .btn-blue .text-grey-lt-000 .float-right }