---
layout: page
title: /user/changePluginPermission
parent: Users
grand_parent: API Operations
permalink: /all-ops/user/changepluginpermission
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'ChangePluginPermission',
            endpoint: '/user/changePluginPermission',
            method: 'POST',
            params: {
                '// userId': 0,
                pluginName: 'tradingView',
                approval: true,
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>

<div id="vendor-warning"></div>