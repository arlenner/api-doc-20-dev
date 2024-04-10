---
layout: page
title: /user/cancelEverything
parent: Users
grand_parent: API Operations
permalink: /all-ops/user/cancelEverything
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'CancelEverything',
            endpoint: '/user/cancelEverything',
            method: 'POST',
            params: {
                'userId': 0,
                'accountId': 0
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>

<div id="vendor-warning"></div>

## `/user/cancelEverything`
This operation is used to:
- Cancel [TradovateSubscription]({{site.baseurl}}/entity-system/index/TradovateSubscription)s, [MarketDataSubscription]({{site.baseurl}}/entity-system/index/MarketDataSubscription)s, and [UserPlugin]({{site.baseurl}}/entity-system/index/UserPlugin)s from the LIVE environment.
- Cancel [TradingPermission]({{site.baseurl}}/entity-system/index/TradingPermission)s from the Simulation environment.

### Request Body

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `userIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | An array of IDs of each [User]({{site.baseurl}}/entity-system/index/User) entity to cancel.

### Response
#### Object

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `tradingPermissionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [TradingPermission]({{site.baseurl}}/entity-system/index/TradingPermission)s were cancelled. Should be populated from Simulation requests only.
| `marketDataSubscriptionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [MarketDataSubscription]({{site.baseurl}}/entity-system/index/MarketDataSubscription)s were cancelled. Should be populated from LIVE requests only.
| `tradovateSubscriptionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [TradovateSubscription]({{site.baseurl}}/entity-system/index/TradovateSubscription)s were cancelled. Should be populated from LIVE requests only.
| `userPluginIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [UserPlugin]({{site.baseurl}}/entity-system/index/UserPlugin)s were cancelled. Should be populated from LIVE requests only.
