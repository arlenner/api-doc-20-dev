---
layout: page
title: /order/modifyOrder
parent: Orders
grand_parent: API Operations
permalink: /all-ops/order/modifyorder
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'modifyOrder',
            endpoint: '/order/modifyOrder',
            method: 'POST',
            params: {
                orderId: 0,
                orderQty: 1,
                orderType: 'Market',
                price: 0,
                stopPrice: 0,
                maxShow: 0,
                pegDifference: 0,
                timeInForce: 'Day',
                expireTime: new Date(Date.now() + 100000).toJSON(),
                text: "string",
                activationTime: new Date().toJSON(),
                customTag50: 'custom_label',
                isAutomated: true
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>