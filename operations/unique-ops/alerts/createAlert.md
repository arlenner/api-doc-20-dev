---
layout: page
title: /alert/createAlert
parent: Alerts
grand_parent: API Operations
permalink: /all-ops/alert/createalert
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'createAlert',
            endpoint: '/alert/createAlert',
            method: 'POST',
            params: {
                expression: "{\"conjuction\":\"AND\",\"conditions\":[{\"l\":\"lastPrice\",\"op\":\"<=\",\"r\":\"4008\",\"rf\":\"4008.00\",\"subj\":\"ESH3\"}]}",
                message: "Alert triggered!"

            }
        });
        window[TDV].buildCallouts(window[TDV].buildCallouts.defaultAuthWarning);
    });
</script>

### Notes
Example `expression`:
```
{
    "conjuction":"OR",
    "conditions":[
        {
            "l":"percentChange",
            "op":">",
            "r":"0.27506876719179796",
            "rf":"0.28",
            "subj":"ESH3"
        },
        {
            "l":"posOpenPLUsd",
            "op":">",
            "r":"100",
            "subj":"[object Object]|ESH3"
        },
        {
            "l":"cashAmount",
            "op":"<",
            "r":"47400",
            "subj":"DEMO15460"
        }
    ]
}
```