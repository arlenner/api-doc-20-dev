---
layout: default
title: /contract/getProductFeeParams
parent: Contract Library
grand_parent: API Operations
permalink: /all-ops/contract/getproductfeeparams
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'getProductFeeParams',
            endpoint: '/contract/getProductFeeParams',
            method: 'POST',
            params: {
                productIds: [0]
            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>