---
layout: page
title: /user/createTradingPermission
parent: Users
grand_parent: API Operations
permalink: /all-ops/user/createTradingPermission
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'CreateTradingPermission',
            endpoint: '/user/createTradingPermission',
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

## `/user/createTradingPermission`
This operation is used to create a [TradingPermission]({{site.baseurl}}/entity-system/index/TradingPermission) from a `userId` and and `accountId`.

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `userId` | `required`{: .label .label-red } | number, `int64` | The ID of the associated [User]({{site.baseurl}}/entity-system/index/User) to assign the permission to.
| `accountId` | `required`{: .label .label-red } | number, `int64` | The ID of the simulation [Account]({{site.baseurl}}/entity-system/index/Account) to assign permission.


### Response

#### Object

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `tradingPermission` | `required`{: .label .label-red } | [TradingPermission]({{site.baseurl}}/entity-system/index/TradingPermission) | Created trading permission.
