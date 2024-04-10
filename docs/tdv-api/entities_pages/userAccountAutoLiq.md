---
layout: page
title: UserAccountAutoLiq
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/index/useraccountautoliq
---

## UserAccountAutoLiq
An object that represents the auto-liquidation rules for an account.

#### Related
- [Account]({{site.baseurl}}/entity-system/index/Account)
- [UserAccountPositionLimit]({{site.baseurl}}/entity-system/index/UserAccountPositionLimit)
- [UserAccountRiskParameter]({{site.baseurl}}/entity-system/index/UserAccountRiskParameter)
- [`/userAccountAutoLiq/update`]({{site.baseurl}}/all-ops/risks/useraccountautoliqupdate)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number, `int64` | 
| `changesLocked` | `none`{: .label } | boolean |
| `marginPercentageAlert` | `none`{: .label } | number, double | Percent Margin consumed before producing an Alert
| `dailyLossPercentageAlert` | `none`{: .label } | number, double | Percent of balance lost before producing an Alert.
| `dailyLossAlert` | `none`{: .label } | number, double | Currency value loss before producing an Alert.
| `marginPercentageLiqOnly` | `none`{: .label } | number, double | Same as `marginPercentageAlert` but puts the [Account]({{site.baseurl}}/entity-system/index/Account) in Liquidate-Only Mode instead of producing an Alert.
| `dailyLossPercentageLiqOnly` | `none`{: .label } | number, double | Same as `dailyLossPercentageAlert` but puts the [Account]({{site.baseurl}}/entity-system/index/Account) in Liquidate-Only Mode instead of producing an Alert.
| `dailyLossLiqOnly` | `none`{: .label } | number, double | Same as `dailyLossAlert` but puts the [Account]({{site.baseurl}}/entity-system/index/Account) in Liquidate-Only Mode instead of producing an Alert.
| `marginPercentAutoLiq` | `none`{: .label } | number, double | Same as `marginPercentageAlert` and `marginPercentageLiqOnly`, but Auto-Liquidates the [Account]({{site.baseurl}}/entity-system/index/Account) instead of producing an Alert or placing the account into Liquidate Only Mode.
| `dailyLossPercentageAutoLiq` | `none`{: .label } | number, double | Same as `dailyLossPercentageAlert` and `dailyLossPercentageLiqOnly`, but Auto-Liquidates the [Account]({{site.baseurl}}/entity-system/index/Account) instead of producing an Alert or placing the account into Liquidate Only Mode.
| `dailyLossAutoLiq` | `none`{: .label } | number, double | Same as `dailyLossAlert` and `dailyLossLiqOnly`, but Auto-Liquidates the [Account]({{site.baseurl}}/entity-system/index/Account) instead of producing an Alert or placing the account into Liquidate Only Mode.
| `weeklyLossAutoLiq` | `none`{: .label } | number, double | Currency value loss during the week required to trigger an Auto-Liquidation.
| `flattenTimestamp` | `none`{: .label } | Date string | This useful risk management parameter can force you into a flat position at the given time. This means regardless of the state of a trade, at time `flattenTimestamp`, your account will attempt to flatten any open positions.
| `trailingMaxDrawdown` | `none`{: .label } | number, double | The maximum currency value below the starting balance that your account will be allowed to fall under before being auto-liquidated. This value trails profit, but stops once the trailing drawdown is equal to the original balance. This means Trailing Max Drawdown always exists within the following range: `(orginalBalance - trailingDDBaseValue) <= trailingDD <= originalBalance`
| `trailingMaxDrawdownLimit` | `none`{: .label } | number, double | Stop drawdown at a certain value. 
| `trailingMaxDrawdownMode` | `none`{: .label } | string enum, `"EOD"` `"Realtime"` | Calculate trailing Max Drawdown at End-of-Day, or in Realtime?
| `dailyProfitAutoLiq` | `none`{: .label } | number, double | Currency value amount of daily profit before Auto-Liquidating the [Account]({{site.baseurl}}/entity-system/index/Account).
| `weeklyProfitAutoLiq` | `none`{: .label } | number, double | Currency value amount of weekly profit before Auto-Liquidating the [Account]({{site.baseurl}}/entity-system/index/Account). 
| `doNotUnlock` | `none`{: .label } | number, double | PERMANENTLY lock the account if auto-liq settings are hit.