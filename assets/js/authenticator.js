~function() {
    /*SVGs*/
    const svgClosed = (size) => `<svg aria-labelledby="svgTitle" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="${size}" height="${size}" viewBox="0 0 30 30" style="fill:#ffffff;"><title id="svgTitle">Authorize API</title><path d="M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 22 11 L 22 9 C 22 5.2715823 19.036581 2.2685653 15.355469 2.0722656 A 1.0001 1.0001 0 0 0 15 2 z M 15 4 C 17.773666 4 20 6.2263339 20 9 L 20 11 L 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 z"></path></svg>`;    
    const svgOpened = (size) => `<svg aria-labelledby="svgTitle" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="${size}" height="${size}" viewBox="0 0 30 30" style="fill:#ffffff;"><title id="svgTitle">Authorize API</title><path d="M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 C 17.184344 4 19.022854 5.3946656 19.708984 7.3339844 A 1.0001 1.0001 0 1 0 21.59375 6.6660156 C 20.631881 3.9473344 18.037656 2 15 2 z"></path></svg>`;

    const TDV = Symbol.for('tdv-docs');
    window[TDV] = window[TDV] || {};
    const authWorker = window[TDV]._authWorker;
    let LOCK_AUTHENTICATOR = false;

    function Authenticator() {}

    Authenticator.prototype.svgClosed = svgClosed;
    Authenticator.prototype.svgOpened = svgOpened;

    Authenticator.prototype.isAuthenticated = function() {
        const SiteStorage = window[TDV].SiteStorage;
        const accessToken = SiteStorage.getAccessToken();
        const accessTokenExp = SiteStorage.getAccessTokenExp();

        if(accessToken && accessTokenExp) {
            const targetTime = new Date(accessTokenExp).getTime();
            const now = new Date().getTime();
            const diff = (targetTime - now);
            return diff > 0;
        }

        return false;
    }

    Authenticator.prototype.isVendor = function() {
        return window[TDV].SiteStorage.getIsVendor();
    }

    Authenticator.prototype.authenticate = async function(accessToken) {
        let authResponse;
        const SiteStorage = window[TDV].SiteStorage;

        if(this.dispose) this.dispose();

        try {
            // authResponse = await fetch(`https://demo-d.tradovateapi.com/v1/user/find?name=${}`, {
            //     method: 'GET',
            //     headers: {
            //         Accept: 'application/json',
            //         'Content-Type': 'application/json',
            //         Authorization: `Bearer ${accessToken}`
            //     }
            // });
            // authResponse = await authResponse.json();

            authResponse = await fetch(`https://live-d.tradovateapi.com/account/list`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            authResponse = await authResponse.json();

            console.log(authResponse);

            const properties = await fetch('https://live-d.tradovateapi.com/v1/userProperty/deps?masterid='+authResponse[0].userId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const props = await properties.json();

            console.log(props);

            if(props && props.length > 0) {
                const maybeAdminProp = props.find(p => p.propertyId === 8);
                console.log(maybeAdminProp);
                if(maybeAdminProp && maybeAdminProp.value === 'true') {
                    SiteStorage.setIsVendor(true);
                } else {
                    SiteStorage.setIsVendor(false);
                }
            }
            // set session vars
            SiteStorage.setLockedIn(true);
            SiteStorage.setAccessToken(accessToken);
            SiteStorage.setAccessTokenExp(new Date(new Date().getTime() + 75 * 60 * 1000).toJSON());
            if(this.lockElement) {
                this.runHtmlUpdates();
            }

            this.watch();

        } catch {
            authResponse = 'failed';
        }
        
        if(this.lockElement) this.runHtmlUpdates();
        return authResponse !== 'failed';
    }

    Authenticator.prototype.renew = async function() {
        const SiteStorage = window[TDV].SiteStorage;
        const currentAccessToken = SiteStorage.getAccessToken();
        try {
            const { accessToken } = await fetch('https://live-d.tradovateapi.com/v1/auth/renewaccesstoken', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `Bearer ${currentAccessToken}`
                }
            }).then(x => x.json());
            // set session vars
            SiteStorage.setLockedIn(true);
            SiteStorage.setAccessToken(accessToken);
            SiteStorage.setAccessTokenExp(new Date(new Date().getTime() + 75 * 60 * 1000).toJSON());
            if(this.lockElement) {
                this.runHtmlUpdates();
            }
        } catch {
            alert('System timed out. There was an error renewing your access token. Please enter a new valid Access Token.');
            SiteStorage.clear();
        }
    }

    Authenticator.prototype.watch = function() {
        if(this.lockElement) this.runHtmlUpdates();
        
        const SiteStorage = window[TDV].SiteStorage;
        const now = new Date().getTime();
        const expiry = new Date(SiteStorage.getAccessTokenExp()).getTime();
        const timeDiff = expiry - now;
        const secsLeft = timeDiff/1000;
        const minsLeft = Math.floor(timeDiff/60000);

        authWorker.postMessage({ mode: 'on', renewed: false, secsLeft });
        
        console.log(`Authenticator started watching. Renewing token in ~${minsLeft} minutes. Expiration time = ${new Date(SiteStorage.getAccessTokenExp()).toLocaleTimeString()}`);

        authWorker.addEventListener('message', async ({ data: { shouldRenew } }) => {
            if(!LOCK_AUTHENTICATOR) {
                if(shouldRenew) {
                    LOCK_AUTHENTICATOR = true;
                    console.log('Session renewal required. Renewing access token.');
                    await this.renew();
                    const now = new Date().getTime();
                    const expiry = new Date(SiteStorage.getAccessTokenExp()).getTime();
                    const timeDiff = expiry - now;
                    const secsLeft = timeDiff/1000;
                    authWorker.postMessage({mode: 'on', renewed: true, secsLeft });
                    LOCK_AUTHENTICATOR = false;
                }
            }
        });
    }

    Authenticator.prototype.logout = function() {
        SiteStorage.clear();
        this.runHtmlUpdates();
        authWorker.postMessage({ mode: 'off', renew: false, secsLeft: 0 });
    }

    Authenticator.prototype.setLockElement = function(lockElement) { 
        this.lockElement = lockElement;
        if(lockElement.innerHTML === '') {
            lockElement.innerHTML = this.isAuthenticated() ?  svgClosed(30) : svgOpened(30);
        }
        this.runHtmlUpdates();
    }

    Authenticator.prototype.runHtmlUpdates = function() {
        if(!this.lockElement) return;
        
        if(this.isAuthenticated()) {
            this.lockElement.innerHTML = svgClosed(30);
        }
        else {
            this.lockElement.innerHTML = svgOpened(30);
        }
    }

    window.addEventListener('beforeunload', () => {
        if(window[TDV].Authenticator.dispose) window[TDV].Authenticator.dispose()
    });

    window[TDV].Authenticator = new Authenticator();
    if(window[TDV].SiteStorage) {
        const maybeExp = window[TDV].SiteStorage.getAccessTokenExp();
        if(maybeExp) {
            const exp = new Date(maybeExp).getTime();
            const now = new Date().getTime();
            if(exp - now > 0) {
                window[TDV].Authenticator.watch();
            } else {
                alert('Session timed out. Please re-authorize the API with a new Access Token.');
                window[TDV].SiteStorage.clear();
                window[TDV].Authenticator.runHtmlUpdates();
            }
        }
    }
}();