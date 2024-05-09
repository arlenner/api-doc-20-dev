---
layout: page
title: ContactInfo
parent: Entities Index
grand_parent: The Entity System
permalink: /entity-system/entity-index/contactinfo
---

## ContactInfo
An entity to hold a [User]({{site.baseurl}}/entity-system/entity-index/User)'s Contact Information. A user's contact information shouldn't contain any special characters.

#### Related
- [User]({{site.baseurl}}/entity-system/entity-index/User)

### Definition

| Property | Tags | Type | Remarks
|:---------|:-----|:-----|:-------
| `id` | `none`{: .label } | number | 
| `userId` | `required`{: .label .label-red } | number | ID of related [User]({{site.baseurl}}/entity-system/entity-index/User) entity.
| `firstName` | `required`{: .label .label-red } | string | Up to 64 characters.
| `lastName` | `required`{: .label .label-red } | string | Between 2 and 64 characters.
| `streetAddress1` | `required`{: .label .label-red } | string | Between 3 and 61 characters.
| `streetAddress2` | `none`{: .label } | string | Up to 61 characters.
| `city` | `required`{: .label .label-red } | string | 2 to 35 characters.
| `state` | `none`{: .label } | string | 2 to 64 characters.
| `postCode` | `none`{: .label } | string | 4 to 11 characters.
| `country` | `required`{: .label .label-red } | string | 2 character country code.
| `phone` | `required`{: .label .label-red } | string | 10-21 characters.
| `mailingIsDifferent` | `none`{: .label } | boolean | Indicates the User's mailing address is not their provided street address.
| `mailingStreetAddress1` | `none`{: .label } | string | 
| `mailingStreetAddress2` | `none`{: .label } | string | 
| `mailingCity` | `none`{: .label } | string | 
| `mailingState` | `none`{: .label } | string | 
| `mailingPostCode` | `none`{: .label } | string | 
| `mailingCountry` | `none`{: .label } | string | 