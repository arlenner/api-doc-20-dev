---
layout: page
title: Common Operations
permalink: /entity-system/shared-ops/
parent: The Entity System
nav_order: 2
---

# Common Entity Operations

> *Please see the [API Operations]({{site.baseurl}}/all-ops) section to see details about each of the shared API operations.*

Although there are many *unique* operations available via API, all entities share seven basic operations. These operations are valid (with a few exceptions) for any entity you call them on. The format of these calls via HTTP looks like this:

```
https://<prefix>.tradovateapi.com/v1/<entity>/<operation>
```
Where `<prefix>` is either 'live' or 'demo', `<entity>` would be replaced with a valid entity type name (`cashBalance`, `account`, `productMargin`, etc.), and `<operation>` is one of the following seven operations.

---

## [`/list`]({{site.baseurl}}/all-ops/shared/list)
`/list` is the simplest request to make, as it has no parameters. Simply by having a valid `accessToken` in the header, we will be able to retrieve lists of the given entity with a `GET` request. `/list` will return every entity of the given type within the scope of your [User]({{site.baseurl}}/entity-system/entity-index/User)'s permissions. So if we call `/account/list` we will retrieve a list of [Account]({{site.baseurl}}/entity-system/entity-index/Account) entities associated with the User making that request.

---

## [`/find`]({{site.baseurl}}/all-ops/shared/find)
The `/find` operation is used for finding entities that have a `name` field. It will 'work' on entities that don't have a `name` field, but it will never return anything. So, if you're having trouble with this operation, ensure the entity type you are searching has a `name`. The `/find` operation takes a single query parameter, `name` formatted like so - `/find?name=<entity_name>`. To find the ES contract expiring June 2022, we would use `/contract/find?name=ESM2`.

---

## [`/item`]({{site.baseurl}}/all-ops/shared/item)
The `/item` operation is useful for finding an entity for which you already know the entity ID. A common example would be looking up the [Contract]({{site.baseurl}}/entity-system/entity-index/Contract) related to an [Order]({{site.baseurl}}/entity-system/entity-index/Order). The [Order]({{site.baseurl}}/entity-system/entity-index/Order) entity has a field called `contractId` that we would use `/contract/item?id=<contractId>` to retrieve the [Contract]({{site.baseurl}}/entity-system/entity-index/Contract) instance.

---

## [`/items`]({{site.baseurl}}/all-ops/shared/items)
Just like `/item` except instead of using the singular `id` as a parameter, we have `ids`. `ids` should consist of a comma-separated list of integer IDs, eg. `12345,23456,34567`. This is most useful when you want to get several entities of the same type by their IDs in a single API call.

---

## [`/deps`]({{site.baseurl}}/all-ops/shared/deps)
`/deps` is an operation that retrieves entities of a given type related to a 'master' entity of another type. For more info on which entities are related, see the [Notes]({{site.baseurl}}/all-ops/shared/deps#notes) section of the [`/deps`]({{site.baseurl}}/all-ops/shared/deps) page.

---

## [`/ldeps`]({{site.baseurl}}/all-ops/shared/ldeps)
Just like `/deps` except instead of the singular `masterid` parameter, we need to use the plural `masterids` parameter. Much like `/items`, `/ldeps` takes the `masterids` as a comma-separated list of integer IDs.

---

## [`/suggest`]({{site.baseurl}}/all-ops/shared/suggest)
When you want to find out what entities are available or search for choices, you can use the `/suggest` operation. It takes two query parameters, `t` and `l`. `t` is the text to search and `l` is the maximum number of results to return. Useful for things like searching for available contract expirations.

---
[{% include chev-left.html %} Entities are Related]({{site.baseurl}}/entity-system/entities-are-related){: .btn .btn-blue .text-grey-lt-000 }
[Next]({{site.baseurl}}/nextLink){: .btn .btn-blue .text-grey-lt-000 .float-right }

---
