---
layout: default
title: /accountRiskStatus/switchRiskCategory
parent: AccountRiskStatus
grand_parent: API Operations
permalink: /all-ops/accountriskstatus/switchriskcategory
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'SwitchRiskCategory',
            endpoint: '/accountRiskCategory/switchRiskCategory',
            method: 'POST',
            params: {
                accountIds: [],
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