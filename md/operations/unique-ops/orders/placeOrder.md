---
layout: default
title: /order/placeOrder
parent: Orders
grand_parent: API Operations
permalink: /all-ops/order/placeorder
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'PlaceOrder',
            endpoint: '/order/placeorder',
            method: 'POST',
            params: {
                accountSpec: "accountName",
                accountId: 0,
                action: 'Buy',
                '// clOrdId': "",
                symbol: "ES...",
                orderQty: 1,
                orderType: 'Market',
                '// price': 0,
                '// stopPrice': 0,
                '// maxShow': 0,
                '// pegDifference': 0,
                timeInForce: 'Day',
                '// expireTime': new Date().toJSON(),
                '// activationTime': new Date().toJSON(),
                '// customTag50': "",
                isAutomated: true,
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/order/placeOrder`
Use this operation to make a request to place an order. 

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountSpec` | `none`{: .label } | string | This should be the name of the [Account]({{site.baseurl}}/entity-system/entity-index/account) placing the trade.
| `accountId` | `none`{: .label } `required`{: .label .label-yellow } | number | This is the Entity ID of the [Account]({{site.baseurl}}/entity-system/entity-index/account) being used to place the trade. Optional by the specification, however in practice this is a required field.
| `clOrdId` | `none`{: .label } | string | 
| `action` | `required`{: .label .label-red } | `"Buy"` `"Sell"` | Basic type of action this order represents.
| `symbol` | `required`{: .label .label-red } | string | The [Contract]({{site.baseurl}}/entity-system/entity-index/contract) symbol in regards to which this order is being placed.
| `orderQty` | `required`{: .label .label-red } | number | The number of contracts to buy or sell.
| `orderType` | `required`{: .label .label-red } | `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | The specific type of order being placed. More details on these below.
| `price` | `none`{: .label } | number | This is required for non-`"Market"` type orders.
| `stopPrice` | `none`{: .label } | number | Required for `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number | 
| `pegDifference` | `none`{: .label } | number | 
| `timeInForce` | `none`{: .label } | `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | The time that this order is valid for. See [this section]({{site.baseurl}}/entity-system/entity-index/orderversion#notes) for more details.
| `expireTime` | `none`{: .label } | Date string | Required for orders using the `"GTD"` `timeInForce` property.
| `activationTime` | `none`{: .label } | Date string | 
| `customTag50` | `none`{: .label } | string | Used by the Trader UI to show custom descriptions.
| `isAutomated` | `none`{: .label } | boolean | Must be `true` if the order was not placed by a human clicking a button.

### Response
[PlaceOrderResult]({{site.baseurl}}/entity-system/entity-index/placeorderresult)

### Example

```js
const URL = 'https://demo.tradovateapi.com/v1' //or live

//here are some props we can share across our orders for this example
const baseBody = {
    accountSpec: yourAcctName,  //controls the label in the Trader UI 
    accountId: yourAcctId,      //ID of Account to trade
    symbol: "ESU3",             //contract symbol
    orderQty: 1,                //number of contracts to trade
    isAutomated: true           //must be true if this isn't an order made directly by a human
}

//market order requires none of the optional parameters
const marketBody = {
    ...baseBody,
    action: 'Buy',
    orderType: 'Market'
} 

//we need a stopPrice for a stop order
const stopBody = {
    ...baseBody,
    action: 'Sell',
    orderType: 'Stop',
    stopPrice: 3888.25
}

//just the same as Stop order, but orderType matches
const trailingStopBody = {
    ...baseBody,
    action: 'Stop',
    orderType: 'TrailingStop',
    stopPrice: 3888.25          //will keep a max distance of (positionPrice - stopPrice)
}

//use the price parameter for limit orders
const limitBody = {
    ...baseBody,    
    action: 'Sell',
    orderType: 'Limit',
    price: 3891.25,             //use for single value like limit or stop
    
}

const response = await fetch(URL + '/order/placeorder', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${myAccessToken}`,
    },
    body: JSON.stringify(marketBody) //replace with any of above request bodies
})

const json = await response.json() //=> { orderId: 0000000 }

```

#### Related
- [`/order/modifyOrder`]({{site.baseurl}}/all-ops/order/modifyorder)
- [`/order/cancelOrder`]({{site.baseurl}}/all-ops/order/cancelorder)
- [`/order/liquidatePosition`]({{site.baseurl}}/all-ops/order/liquidateposition)