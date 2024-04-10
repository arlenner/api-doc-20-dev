---
layout: page
title: Architecture Overview
permalink: /architecture-overview
nav_order: 3
---

# Architecture Overview

<img id="main-frame" src="{{'/assets/images/SV_ArchitectureOverview.png'}}">

### Tradovate API
The Tradovate API is an amalgamation of all of our public facing systems. From the API you can access Trade Data, Market Data, and Replay Sessions.

### Middleware
This is where you, the developers, come in. Your Middlewares will interface with our API to do things. For Retail users, this may be a robot that listens to Market Data streams and waits for certain conditions to take an action. For Vendors, this will be a way to watch your organization members' actions in real-time.

### User Entry Points
For Retail users and Vendors alike, the best way to interact with our system is to use one of our client applications. Both the Tradovate or Tradovate applications are available on mobile, web, and desktop. Of course, you could build your own front end using our API, as well - the Tradovate web, mobile, and desktop applications are all built using these same tools.

---

[{% include chev-left.html %} Getting Started]({{site.baseurl}}/getting-started){: .btn .btn-blue .text-grey-lt-000 }
[REST Guide {% include chev-right.html %}]({{site.baseurl}}/rest-guide){: .btn .btn-blue .text-grey-lt-000 .float-right }

---