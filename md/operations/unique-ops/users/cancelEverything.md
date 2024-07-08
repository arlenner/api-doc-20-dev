---
layout: default
title: /user/cancelEverything
parent: Users
grand_parent: API Operations
permalink: /all-ops/user/canceleverything
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'CancelEverything',
            endpoint: '/user/cancelEverything',
            message: `Behavior is different when called in LIVE vs SIM environments - ensure that you are calling from both LIVE and SIM if you want to truly cancel all subscriptions, plugins, and tradingPermissions.`,
            method: 'POST',
            params: {
                'userIds': [0]
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
- Cancel [TradovateSubscription]({{site.baseurl}}/entity-system/entity-index/tradovatesubscription)s, [MarketDataSubscription]({{site.baseurl}}/entity-system/entity-index/MarketDataSubscription)s, and [UserPlugin]({{site.baseurl}}/entity-system/entity-index/userplugin)s from the LIVE environment.
- Cancel [TradingPermission]({{site.baseurl}}/entity-system/entity-index/tradingpermission)s from the Simulation environment.

### Request Body

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `userIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | An array of IDs of each [User]({{site.baseurl}}/entity-system/entity-index/user) entity to cancel.

### Response
#### Object

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `tradingPermissionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [TradingPermission]({{site.baseurl}}/entity-system/entity-index/tradingpermission)s were cancelled. Should be populated from Simulation requests only.
| `marketDataSubscriptionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [MarketDataSubscription]({{site.baseurl}}/entity-system/entity-index/marketdatasubscription)s were cancelled. Should be populated from LIVE requests only.
| `tradovateSubscriptionIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [TradovateSubscription]({{site.baseurl}}/entity-system/entity-index/tradovatesubscription)s were cancelled. Should be populated from LIVE requests only.
| `userPluginIds` | `required`{: .label .label-red } | Array<number>, `int64[]` | Empty when no [UserPlugin]({{site.baseurl}}/entity-system/entity-index/userplugin)s were cancelled. Should be populated from LIVE requests only.
