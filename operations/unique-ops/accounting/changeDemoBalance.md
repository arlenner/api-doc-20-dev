---
layout: page
title: /cashBalance/changeDemoBalance
parent: Accounting
grand_parent: API Operations
permalink: /all-ops/cashBalance/changeDemoBalance
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
                message: `Keep in mind, you can only call this endpoint once daily. If you are using this to perform some kind of account reset you will be limited to one daily adjustment.`,
                showWhen() {
                    return !window[TDV].SiteStorage.getIsVendor();
                }
            }
        );
    });
</script>

## `/cashBalance/changeDemoBalance`
Change a Simulation [Account]({{site.baseurl}}/entity-system/index/Account)'s cash balance.

#### Related
- [CashBalance]({{site.baseurl}}/entity-system/index/CashBalance)
- [`/userAccountAutoLiq/update`]({{site.baseurl}}/all-/userAccountAutoLiq/update)

### Request

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `accountId` | `required`{: .label .label-red } | number, `int64` | SIM [Account]({{site.baseurl}}/entity-system/index/Account) to change.
| `cashChange` | `required`{: .label .label-red } | number, double | Cash amount to change balance by. Accepts negative numbers for negative balance changes.

### Notes
<div id="once-daily-warning"></div>

- In combination with [`/userAccountAutoLiq/update`]({{site.baseurl}}/all-ops/userAccountAutoLiq/update), you can use this operation to perform a 'soft-reset'. Use the AutoLiq's Update operation to set a blank policy, then perform your balance change and set the new AutoLiq policy. 