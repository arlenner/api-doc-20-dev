---
layout: page
title: REST Guide
permalink: /rest-guide/
nav_order: 4
has_children: true
---

# REST Guide
## Introduction
In this section we'll be discussing the endpoints related to gaining Access to the API, and using the REST portion of the API. Before we can begin calling operative endpoints on the API, we will need to ask the API for an Access Token. We need to understand how Device IDs work, and how to construct our HTTP headers. We'll also need to periodically renew our Access Token for sessions that range beyond its original expiration.

## REST API Facts
Before you begin using the Tradovate REST API, there are a few things you should keep in mind:
- Our API does not mandate method protocols. However, we do recommend the `GET` method for requests with query parameters (or no parameters), and the `POST` method for requests with JSON bodies. 
- Both `'Accept'` and `'Content-Type'` headers can be set to the `'application/json'` MIME type. We'll discuss the `'Authorization'` header soon.
- We offer an OpenAPI Specification for the REST API. Look at the [main page's download buttons]({{site.baseurl}}/#download-the-openapi-spec) - we have both JSON and YAML versions available.
- The REST API is partitioned into two parts - DEMO and LIVE. They are virtually identical but each correspond to their respective trading environment. You can access a different environment via API by changing the prefix on the `tradovateapi.com` domain (`demo.tradovateapi.com`, `live.tradovateapi.com`).

## Common Pitfalls
- Always 404 for entities you know exist? Double check your URL prefix. It is likely you're accessing the wrong environment.
- Always 401 beyond `accessTokenRequest`? Check your API Key permissions in the Trader Application's API Settings tab. The default settings for API Keys is to have each permission domain set to be inaccessible.

---

[{% include chev-left.html %} Getting Started]({{site.baseurl}}/getting-started){: .btn .btn-blue .text-grey-lt-000 }
[Access Token Request {% include chev-right.html %}]({{site.baseurl}}/rest-guide/access-token-request){: .btn .float-right .btn-blue .text-grey-lt-000 }



