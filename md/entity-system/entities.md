---
layout: default
title: The Entity System
permalink: /entity-system/
has_children: true
nav_order: 5
---

# The Entity System
## Understanding the Tradovate API Entity System
The Tradovate API's backend is a well organized and fine-tuned market data processing machine (and more). To keep things in order, we employ an Entity System defining all the possible types of 'things' that can exist within the application-space. As we are a futures-trading platform, we have such entities as [Order]({{site.baseurl}}/entity-system/entity-index/order), [Contract]({{site.baseurl}}/entity-system/entity-index/contract), [ContractMaturity]({{site.baseurl}}/entity-system/entity-index/contractmaturity), [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance), [Account]({{site.baseurl}}/entity-system/entity-index/account), and so on. Each of these entities has a different *interface*, or shape. Entities can be related, and they also share a set of common operations that will work (mostly) for all entity types. As we send and receive data from the Tradovate servers, we will be encountering and utilizing objects of these types.

---

[Explore Entities]({{site.baseurl}}/entity-system/index){: .btn .btn-blue .text-grey-lt-000 }
[Entities Are Related {% include chev-right.html %}]({{site.baseurl}}/entity-system/entities-are-related){: .btn .btn-blue .text-grey-lt-000 .float-right }