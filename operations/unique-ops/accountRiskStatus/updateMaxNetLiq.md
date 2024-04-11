---
layout: page
title: /accountRiskStatus/updateMaxNetLiq
parent: AccountRiskStatus
grand_parent: API Operations
permalink: /all-ops/accountriskstatus/updatemaxnetliq
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'UpdateMaxNetLiq',
            endpoint: '/accountRiskCategory/updateMaxNetLiq',
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

<div id="vendor-warning"></div>