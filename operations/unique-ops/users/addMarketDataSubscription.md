---
layout: default
title: /user/addMarketDataSubscription
parent: Users
grand_parent: API Operations
permalink: /all-ops/user/addmarketdatasubscription
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'AddMarketDataSubscription',
            endpoint: '/user/addMarketDataSubscription',
            method: 'POST',
            params: {
                marketDataSubscriptionPlanIds: [0],
                year: new Date().getYear(),
                month: new Date().getMonth() + 1,
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

<div id="vendor-warning"></div>

## `/user/addMarketDataSubscription`
This operation is used to:
- Cancel [TradovateSubscription]({{site.baseurl}}/entity-system/entity-index/TradovateSubscription)s, [MarketDataSubscription]({{site.baseurl}}/entity-system/entity-index/marketdatasubscription)

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `userId` | `required`{: .label .label-red } | number, `int64` | The ID of the associated [User]({{site.baseurl}}/entity-system/entity-index/user) to assign the permission to.
| `accountId` | `required`{: .label .label-red } | number, `int64` | The ID of the simulation [Account]({{site.baseurl}}/entity-system/entity-index/account) to assign permission.


### Response

#### Object

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `tradingPermission` | `required`{: .label .label-red } | [TradingPermission]({{site.baseurl}}/entity-system/entity-index/tradingpermission) | Created trading permission.