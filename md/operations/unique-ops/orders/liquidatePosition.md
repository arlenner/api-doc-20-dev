---
layout: default
title: /order/liquidatePosition
parent: Orders
grand_parent: API Operations
permalink: /all-ops/order/liquidateposition
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'liquidatePosition',
            endpoint: '/order/liquidatePosition',
            method: 'POST',
            params: {
                accountId: 0,
                contractId: 0,
                admin: false,
                customTag50: 'custom_label'
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>