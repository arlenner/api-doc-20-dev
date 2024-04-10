~function() {

    /* links */
    const accessTokenLink = `tradovate.accessToken`,
          accessTokenExpLink = `tradovate.accessTokenExp`,
          lockedInLink = `tradovate.lockedIn`,
          isVendorLink = `tradovate.isVendor`;

    const TDV = Symbol.for('tdv-docs');
    window[TDV] = window[TDV] || {};

    function SimpleStorage() {}

    SimpleStorage.prototype.setLockedIn = function(value) {
        sessionStorage.setItem(lockedInLink, value);
    }

    SimpleStorage.prototype.getLockedIn = function() {
        return sessionStorage.getItem(lockedInLink);
    }

    SimpleStorage.prototype.setAccessToken = function(value) {
        sessionStorage.setItem(accessTokenLink, value)
    }

    SimpleStorage.prototype.getAccessToken = function() {
        return sessionStorage.getItem(accessTokenLink);
    }

    SimpleStorage.prototype.setAccessTokenExp = function(value) {
        console.log('setting access token expiry', value);
        sessionStorage.setItem(accessTokenExpLink, value)
    }

    SimpleStorage.prototype.getAccessTokenExp = function() {
        return sessionStorage.getItem(accessTokenExpLink);
    }

    SimpleStorage.prototype.setIsVendor = function(value) {
        sessionStorage.setItem(isVendorLink, value)
    }

    SimpleStorage.prototype.getIsVendor = function() {
        return sessionStorage.getItem(isVendorLink) === 'true';
    }

    SimpleStorage.prototype.clear = function() {
        sessionStorage.clear();
    }

    window[TDV].SiteStorage = new SimpleStorage();
}()