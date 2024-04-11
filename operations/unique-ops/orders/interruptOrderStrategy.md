---
layout: page
title: /orderStrategy/interruptOrderStrategy
parent: Orders
grand_parent: API Operations
permalink: /all-ops/orderstrategy/interruptorderstrategy
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'interruptOrderStrategy',
            endpoint: '/orderStrategy/interruptOrderStrategy',
            method: 'POST',
            params: {
                orderStrategyId: 0
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>