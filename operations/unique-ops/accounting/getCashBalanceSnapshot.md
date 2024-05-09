---
layout: page
title: /account/getCashBalanceSnapshot
parent: Accounting
grand_parent: API Operations
permalink: /all-ops/cashbalance/getcashbalancesnapshot
op: true
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'getCashBalanceSnapshot',
            endpoint: '/account/getCashBalanceSnapshot',
            method: 'POST',
            params: {
                accountId: 0
            }
        });
        window[TDV].buildCallouts(
            window[TDV].buildCallouts.defaultAuthWarning,
            {
                selector: '#no-polling',
                title: 'WARNING:',
                theme: 'grey',
                message: `Although it may be tempting to poll this endpoint to find an account's Open P&L, this is an anti-pattern. Because we limit requests by frequency, eventually polling for P&L <em>will</em> break your application. This operation should be used sparingly, to fill out a one-time report for an account, or to peek at an account's balance in a manner that would be called infrequently.<br/>If you want to track Open P&L in real-time, see <a style="color:black;" href="{{site.baseurl}}">this operation</a>`,
                showWhen() {
                    return true;
                }
            }
        );
    });
</script>

## `/cashBalance/getcashbalancesnapshot`
Get a snapshot of an [Account]({{site.baseurl}}/entity-system/entity-index/Account)'s cashbalance. This call is best suited for one-shot requests to display some instant data, but not for developing a real-time stream.
<div id="no-polling"></div>