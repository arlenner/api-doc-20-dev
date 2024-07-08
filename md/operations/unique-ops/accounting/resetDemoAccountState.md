---
layout: default
title: /account/resetDemoAccountState
parent: Accounting
grand_parent: API Operations
permalink: /all-ops/account/resetdemoaccountstate
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        const SiteStorage = window[TDV].SiteStorage;
        const date = new Date();

        window[TDV].defineTryit({
            name: 'ResetDemoAccountState',
            endpoint: '/account/resetdemoaccountstate',
            method: 'POST',
            params: {  
                accountIds: [0],  
                resetTradeDate: {    
                    day: date.getDate(),
                    month: date.getMonth() + 1,    
                    year: date.getFullYear()
                }
            }
        });

        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            window[TDV].buildCallouts.defaultVendorWarning,
        );
    });

</script>

<div id="vendor-warning"></div>

## `/account/resetDemoAccountState`
Reset one or more accounts' state to its Start-of-day state on a given [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate)

#### Related
- [cashbalance/changeDemoBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance/changedemobalance)

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountIds` | `required`{: .label .label-red } | Array<int> | A list of [Account]({{site.baseurl}}/entity-system/entity-index/account) IDs to reset.
| `resetTradeDate` | `required`{: .label .label-red } | [TradeDate]({{site.baseurl}}/entity-system/entity-index/tradedate) | The [TradeDate]({{site.baseurl}}/entity-system/entity-index/TradeDate) session you want to reset these accounts' states to.