---
layout: default
title: /user/addTradovateSubscription
parent: Users
grand_parent: API Operations
permalink: /all-ops/user/addtradovatesubscription
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'AddTradovateSubscription',
            endpoint: '/user/addTradovateSubscription',
            method: 'POST',
            params: {
                tradovateSubscriptionPlanId: 0,
                '// creditCardId': 0,
                '// accountId': 0,
                '// userId': 0
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>
