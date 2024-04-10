---
layout: page
title: /adminAlertSignal/completeAlertSignal
parent: Alerts
grand_parent: API Operations
permalink: /all-ops/adminAlertSignal/completeAlertSignal
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'completeAlertSignal',
            endpoint: '/adminAlertSignal/completeAlertSignal',
            method: 'POST',
            params: {
                adminAlertSignalId: 0
            }
        });
        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning
        );
    });
</script>