---
layout: page
title: The Entity System
permalink: /entity-system/
has_children: true
nav_order: 5
---

# The Entity System
## Understanding the Tradovate API Entity System
The Tradovate API's backend is a well organized and fine-tuned market data processing machine (and more). To keep things in order, we employ an Entity System defining all the possible types of 'things' that can exist within the application-space. As we are a futures-trading platform, we have such entities as [Order]({{site.baseurl}}/entity-system/entity-index/Order), [Contract]({{site.baseurl}}/entity-system/entity-index/Contract), [ContractMaturity]({{site.baseurl}}/entity-system/entity-index/ContractMaturity), [CashBalance]({{site.baseurl}}/entity-system/entity-index/CashBalance), [Account]({{site.baseurl}}/entity-system/entity-index/Account), and so on. Each of these entities has a different *interface*, or shape. Entities can be related, and they also share a set of common operations that will work (mostly) for all entity types. As we send and receive data from the Tradovate servers, we will be encountering and utilizing objects of these types.

---

[Explore Entities]({{site.baseurl}}/entity-system/index){: .btn .btn-blue .text-grey-lt-000 }
[Entities Are Related {% include chev-right.html %}]({{site.baseurl}}/entity-system/entities-are-related){: .btn .btn-blue .text-grey-lt-000 .float-right }