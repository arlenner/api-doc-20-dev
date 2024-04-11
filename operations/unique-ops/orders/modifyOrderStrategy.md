---
layout: page
title: /orderStrategy/modifyOrderStrategy
parent: Orders
grand_parent: API Operations
permalink: /all-ops/orderstrategy/modifyorderstrategy
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'modifyOrderStrategy',
            endpoint: '/orderStrategy/modifyOrderStrategy',
            method: 'POST',
            params: {
                orderStrategyId: 0,
                command: "{\"\":\"\"}",
                customTag50: 'custom_label'
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>