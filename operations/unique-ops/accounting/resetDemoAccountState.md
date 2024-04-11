---
layout: page
title: /account/resetDemoAccountState
parent: Accounting
grand_parent: API Operations
permalink: /all-ops/account/resetdemoaccountstate
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;
        const date = new Date();

        window[TDV].defineTryit({
            name: 'ResetDemoAccountState',
            endpoint: '/account/resetdemoaccountstate',
            method: 'POST',
            params: {  
                accountIds: [0],  
                resetTradeDate: {    
                    day: date.getDate(),
                    month: date.getMonth() + 1,    
                    year: date.getFullYear()
                }
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>

<div id="vendor-warning"></div>