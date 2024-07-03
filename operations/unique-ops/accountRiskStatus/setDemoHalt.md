---
layout: default
title: /accountRiskStatus/setDemoHalt
parent: AccountRiskStatus
grand_parent: API Operations
permalink: /all-ops/accountriskstatus/setdemohalt
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'SetDemoHalt',
            endpoint: '/accountRiskCategory/setDemoHalt',
            method: 'POST',
            params: {
                halt: false,
                riskCategoryId: 0
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>

<div id="vendor-warning"></div>