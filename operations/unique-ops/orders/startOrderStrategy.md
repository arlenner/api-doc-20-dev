---
layout: page
title: /orderStrategy/startOrderStrategy
parent: Orders
grand_parent: API Operations
permalink: /all-ops/orderstrategy/StartOrderStrategy
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'startOrderStrategy',
            endpoint: '/orderStrategy/startOrderStrategy',
            method: 'POST',
            params: {
                accountId: 0,
                accountSpec: "accountName",
                symbol: "ES...",
                orderStrategyTypeId: 2,
                action: 'Buy',
                params: JSON.stringify({
                    entryVersion: { 
                        orderQty: 1, 
                        orderType: 'Limit', 
                        price: 3900 
                    },
                    brackets: [{
                        qty: 1,
                        profitTarget: 25,
                        stopLoss: -12,
                        trailingStop: false
                    }]
                }),
                '// uuid': "",
                '// customTag50': ""
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>