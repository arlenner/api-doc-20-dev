---
layout: page
title: /userPlugin/addEntitlementSubscription
parent: Users
grand_parent: API Operations
permalink: /all-ops/userplugin/addentitlementsubscription
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;

        window[TDV].defineTryit({
            name: 'AddEntitlementSubscription',
            endpoint: '/userPlugin/addEntitlementSubscription',
            method: 'POST',
            params: {
                entitlementId: 0,
                '// creditCardId': 0,
                '// accountId': 0,
                '// userId': 0,
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>

<div id="vendor-warning"></div>

## `/userPlugin/addEntitlementSubscription`
This operation is used to add an entitlement to an organization member.

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `entitlementId` | `required`{: .label .label-red } | number, `int64` | The ID of the Entitlement to add. For things like TradingView, for example, a team member will assist by creating an entitlement unique to your organization for the given Entitlement.
| `creditCardId` | `none`{: .label } | number, `int64` | ID of credit card to use for the transaction. Unless users are footing the bill, this should probably not be present.
| `accountId` | `none`{: .label } | number, `int64` | ID of account to use for the transaction. This should be the ID of a LIVE organization `DATA` account.
| `userId` | `none`{: .label } | number, `int64` | User to add the entitlement to. If not specified, this will default to your admin user. Typically, the intention is to add it for a user, so in practice the ID is required.

### Response
[AccessTokenResponse]({{site.baseurl}}/entity-system/entity-index/AccessTokenResponse)

