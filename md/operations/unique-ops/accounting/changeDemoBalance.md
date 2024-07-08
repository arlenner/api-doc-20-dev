---
layout: default
title: /cashBalance/changeDemoBalance
parent: Accounting
grand_parent: API Operations
permalink: /all-ops/cashbalance/changedemobalance
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'ChangeDemoBalance',
            endpoint: '/cashBalance/changeDemoBalance',
            method: 'POST',
            params: {
                accountId: 0,
                cashChange: 0.00,
            }
        });
        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            {
                selector: '#once-daily-warning',
                theme: 'grey',
                title: 'WARNING:',
                message: `Keep in mind, retail API users can only call this endpoint once daily. If you are using this to perform some kind of account reset you will be limited to one daily adjustment.`,
                showWhen() {
                    return !window[TDV].SiteStorage.getIsVendor();
                }
            }
        );
    });
</script>

## `/cashBalance/changeDemoBalance`
Change a Simulation [Account]({{site.baseurl}}/entity-system/entity-index/account)'s cash balance.

#### Related
- [CashBalance]({{site.baseurl}}/entity-system/entity-index/cashbalance)
- [`/userAccountAutoLiq/update`]({{site.baseurl}}/all-ops/useraccountautoliq/update)

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountId` | `required`{: .label .label-red } | number, `int64` | SIM [Account]({{site.baseurl}}/entity-system/entity-index/account) to change.
| `cashChange` | `required`{: .label .label-red } | number, double | Cash amount to change balance by. Accepts negative numbers for negative balance changes.

### Notes
<div id="once-daily-warning"></div>

- When using this operation, be aware that the associated [AccountRiskStatus]({{site.baseurl}}/entity-system/entity-index/accountriskstatus)'s `maxNetLiq` field will be affected by this change. If you add $1,000.00 to an account with a Trailing Max Drawdown applied, the drawdown level will move accordingly.