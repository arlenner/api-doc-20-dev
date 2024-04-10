---
layout: page
title: /order/placeOSO
parent: Orders
grand_parent: API Operations
permalink: /all-ops/order/PlaceOSO
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'placeOSO',
            endpoint: '/order/placeOSO',
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
                bracket1: {
                    action: 'Sell',
                    '// clOrdId': "",
                    orderType: 'Stop',
                    '// price': 0,
                    stopPrice: 0,
                    '// maxShow': 0,
                    '// pegDifference': 0,
                    '// timeInForce': 'Day',
                    '// expireTime': new Date().toJSON(),
                    '// text': ""
                },
                bracket2: {
                    action: 'Sell',
                    '// clOrdId': "",
                    orderType: 'Limit',
                    '// price': 0,
                    stopPrice: 0,
                    '// maxShow': 0,
                    '// pegDifference': 0,
                    '// timeInForce': 'Day',
                    '// expireTime': new Date().toJSON(),
                    '// text': ""
                }
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

## `/order/placeOSO`
Use this operation to place an OSO type order (AKA. order-sends-order, one-sends-other).

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountSpec` | `none`{: .label } | string | This should be the name of the [Account]({{site.baseurl}}/entity-system/index/Account) placing the trade.
| `accountId` | `none`{: .label } `required`{: .label .label-yellow } | number | This is the Entity ID of the [Account]({{site.baseurl}}/entity-system/index/Account) being used to place the trade. Optional by the specification, however in practice this is a required field.
| `clOrdId` | `none`{: .label } | string | 
| `action` | `required`{: .label .label-red } | `"Buy"` `"Sell"` | Basic type of action this order represents.
| `symbol` | `required`{: .label .label-red } | string | The [Contract]({{site.baseurl}}/entity-system/index/Contract) symbol in regards to which this order is being placed.
| `orderQty` | `required`{: .label .label-red } | number | The number of contracts to buy or sell.
| `orderType` | `required`{: .label .label-red } | `"Limit"` `"MIT"` `"Market"` `"Stop"` `"StopLimit"` `"TrailingStop"` `"TrailingStopLimit"` | The specific type of order being placed. More details on these below.
| `price` | `none`{: .label } | number | This is required for non-`"Market"` type orders.
| `stopPrice` | `none`{: .label } | number | Required for `"Stop"`, `"StopLimit"`, `"TrailingStop"`, and `"TrailingStopLimit"` order types.
| `maxShow` | `none`{: .label } | number | 
| `pegDifference` | `none`{: .label } | number | 
| `timeInForce` | `none`{: .label } | `"Day"` `"FOK"` `"GTC"` `"GTD"` `"IOC"` | The time that this order is valid for. See [this section]({{site.baseurl}}/entity-system/index/orderversion#notes) for more details.
| `expireTime` | `none`{: .label } | Date string | Required for orders using the `"GTD"` `timeInForce` property.
| `activationTime` | `none`{: .label } | Date string | 
| `customTag50` | `none`{: .label } | string | Used by the Trader UI to show custom descriptions.
| `isAutomated` | `none`{: .label } | boolean | Must be `true` if the order was not placed by a human clicking a button.
| `bracket1` | `required`{: .label .label-red } | [RestrainedOrderVersion]({{site.baseurl}}/entity-system/index/RestrainedOrderVersion) |
| `bracket2` | `none`{: .label } | [RestrainedOrderVersion]({{site.baseurl}}/entity-system/index/RestrainedOrderVersion) | Optional bracket. Use a single bracket for only stop-loss or take-profit alone. Use both brackets to set up stop-loss and take-profit orders.

### Response
[PlaceOSOResult]({{site.baseurl}}/entity-system/index/PlaceOSOResult)

### Notes