---
layout: page
title: /cashBalance/changeDemoBalance
parent: Cash Balance
grand_parent: API Operations
permalink: /all-ops/cashbalance/changedemobalance
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'ChangeDemoBalance',
            endpoint: '/cashBalance/changeDemoBalance',
            method: 'POST',
            params: {
                accountId: 0,
                maxNetLiq: 0
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>