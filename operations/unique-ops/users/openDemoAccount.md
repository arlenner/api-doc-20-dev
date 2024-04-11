---
layout: page
title: /user/openDemoAccount
parent: Users
grand_parent: API Operations
permalink: /all-ops/user/opendemoaccount
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'OpenDemoAccount',
            endpoint: '/user/openDemoAccount',
            method: 'POST',
            params: {
                name: 'MYACCOUNT12345',
                initialBalance: 50000,
                '// templateAccountId': 123456,
                '// defaultAutoLiq': { }
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>