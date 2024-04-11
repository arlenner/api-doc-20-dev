---
layout: page
title: /fundTransaction/adjustCash
parent: Accounting
grand_parent: API Operations
permalink: /all-ops/fundtransaction/adjustcash
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'AdjustCash',
            endpoint: '/fundTransaction/adjustCash',
            method: 'POST',
            params: {
                accountId: 0,
                cashChange: 0,
                cashChangeType: "ManualAdjustment",
                comment: "Manual cash adjustment triggered by API.", 
                currencyId: 1
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>

<div id="vendor-warning"></div>