---
layout: page
title: Getting Started
permalink: /getting-started
nav_order: 2
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const Authenticator = window[TDV].Authenticator;
        window[TDV].defineTryit({
            name: 'Hey, reader! 👋',
            excerptOnly: true,
            excerpt: `<p><strong>This is the Try-It section!</strong> You will find points of interaction here. You can click on the ${Authenticator.svgOpened(16)} icon at any time to Authorize this page with a valid Access Token. Doing so will improve your experience, allowing you to use the various interactive features found across this website.</p>`
        });
    });
</script>

# Getting Started
**So, you've made the plunge into the Tradovate API - don't worry, we're here to help!** This site is Tradovate's official API Education center. Here, you'll learn all the skills you need to begin creating applications that utilize the Tradovate API. Use what you learn to create utility applications for trading, automate a trading strategy, or even create a large scale, multi-user application. If you can dream it, you can build it.

## Prerequisites
In order to access the Tradovate API, you'll need to subscribe to API Access and create an API Key. Once you've created your first API Key, you'll be able to utilize all of the features in this guide. Follow the link below to learn how to access the Tradovate API today.

[Learn How to Access the API](https://community.tradovate.com/t/how-do-i-access-the-api/2380){: .btn .btn-blue .fs-5 } [B2B Partners](){: .btn .fs-5 }

## Using Interactive Features
Take a look at the top of the page - see the {% include lock-small.html %} icon? Any time that you have a valid Access Token, you can click this icon and paste the token's string value into the form that appears. If the token was valid, you'll notice the lock icon changes to a "closed" state. Once in this state, you can use any of the REST API Try It boxes located on the right bar of the site (or by clicking the <button>▶</button>{: .btn .btn-green .fs-2 } button on mobile). Add custom JSON bodies to the requests and test them right here with zero overhead!

## WebSocket Playground
We also offer a playground for our WebSocket APIs. Simply select a URL and click <button>Connect</button>{: .btn .btn-blue .text-grey-lt-000 .fs-2 }. Once you receive the `o` open frame, you can use the Command Palette to parameterize an `authorize` message. When the socket has been successfully authorized, its connection is good until cancelled and you can use the Command Palette options to parameterize and generate most message types.

[Visit WebSocket Playground]({{site.baseurl}}/all-ops/websockets/play){: .btn .btn-blue .text-grey-lt-000 } [WebSocket Guide]({{site.baseurl}}/wss-guide/){: .btn }

---

[Resources]({{site.baseurl}}/resources){: .btn .btn-blue .text-grey-lt-000 }
[Architecture Overview {% include chev-right.html %}]({{site.baseurl}}/architecture-overview){: .btn .btn-blue .text-grey-lt-000 .float-right }

---