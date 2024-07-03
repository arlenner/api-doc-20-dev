---
layout: default
title: Place An Order
permalink: /rest-guide/place-an-order/
parent: REST Guide
nav_order: 6
---
<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'PlaceOrder',
            endpoint: '/order/placeorder',
            method: 'POST',
            excerpt: `Place an order via REST API. Below is a template for an ES Market order. Change the accountId to one of your own, and ensure that the symbol is for a valid ticker which hasn't expired.`,
            params: {
                accountSpec: 'accountName',
                accountId: 0,
                action: 'Buy',
                symbol: 'ES...',
                orderQty: 1,
                orderType: 'Market',
                timeInForce: 'GTC',
                isAutomated: true
            }
        });
    });
</script>

# Place An Order via REST API
The most straightforward way to place an order is to just use the `fetch` function built-in to any browser.

```js
async function placeOrder(config) {
    const { accessToken } = Storage.getUserData()
    const { accountSpec, accountId, symbol, orderQty, isAutomated, action, orderType } = config

    let response

    try {
        await response = fetch('https://demo.tradovateapi.com/v1/order/placeOrder', {
            method: 'POST',
            headers: buildHeaders(accessToken),
            body: JSON.stringify({
                accountSpec,
                accountId,
                symbol,
                orderQty,
                isAutomated,
                action,
                orderType
            })
        }) 
        response = await response.json()
    } catch(err) {
        console.error(err)
    }

    return response
} 
```


---

[{% include chev-left.html %} Storing User Data]({{site.baseurl}}/rest-guide/storing-user-data){: .btn .btn-blue .text-grey-lt-000 }
[Entity System {% include chev-right.html %}]({{site.baseurl}}/entity-system){: .btn .float-right .btn-blue .text-grey-lt-000 }

---