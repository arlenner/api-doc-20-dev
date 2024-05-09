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
            {
                selector: '#ws-only',
                title: 'WARNING:',
                theme: 'grey',
                message: `This endpoint should be called via WebSocket.`,
                showWhen() {
                    return true;
                }
            }
        );
    });

</script>

<div id="vendor-warning"></div>

## `/fundTransaction/adjustCash`
<div id="ws-only">
Called via WebSocket. Unlike the [`/cashbalance/changeDemoBalance`]({{site.baseurl}}/all-ops/cashbalance/changeDemoBalance) endpoint, this call should also move the TMD level of an account.