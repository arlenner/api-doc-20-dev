~function() {
    const TDV = Symbol.for('tdv-docs');
    const authWorker = window[TDV]._authWorker;

    const colors = {
        red: {
            border: '#dd2e2e',
            body: 'rgba(247, 126, 126, 0.2)'
        },
        grey: {
            border: 'lightgrey',
            body: '#959396'
        }        
    }

    const common = {
        paddingLeft: '1em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        borderRadius: '4px',
        boxShadow: `0 1px 2px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08)`
    }

    const themes = {
        red: {
            container: {
                borderLeft: `.25em solid ${colors.red.border}`,
                backgroundColor: colors.red.body
            },
            heading: {
                color: colors.red.border
            }
        },
        grey: {
            container: {
                borderLeft: `.25em solid ${colors.grey.border}`,
                backgroundColor: colors.grey.body
            },
            heading: {
                color: 'black'
            }
        }        
    }

    function buildCallouts(...calloutDefs) {
        calloutDefs.forEach(def => {
            const { selector, theme, message, title, showWhen } = def;    

            console.log('building callout for ', selector);
            if(showWhen) {                
                if(!showWhen()) { 
                    const foundTarget = document.querySelector(selector);
                    if(foundTarget) {
                        console.log(`found ${selector}, removing...`);
                        foundTarget.remove();
                    } else {
                        console.warn(`'buildCallout;non-render-condition' => No target element found for selector '${selector}'.`);
                    }
                    return; 
                }
            }

            const container = document.createElement('div');
            container.id = selector.slice(1);
            const callout = document.createElement('p');
            const heading = document.createElement('h4');

            container.style.marginTop = '.5em';
            

            callout.innerHTML = message;
            heading.textContent = title;
            heading.classList.add('fs-5');

            Object.keys(common).forEach(k => {
                container.style[k] = common[k];
            });

            if(theme in themes) {
                Object.keys(themes[theme].container).forEach(ck => {
                    container.style[ck] = themes[theme].container[ck];

                });
                Object.keys(themes[theme].heading).forEach(hk => {
                    heading.style[hk] = themes[theme].heading[hk];

                });                
            } else {            
                Object.keys(themes.grey.container).forEach(ck => {
                    container.style[ck] = themes.grey.container[ck];

                });
                Object.keys(themes[theme].header).forEach(hk => {
                    heading.style[hk] = themes.grey.heading[hk];

                });                
            }

            container.appendChild(heading);
            container.appendChild(callout);

            authWorker.addEventListener('message', ({ data: { shouldUpdate } }) => {
                if(shouldUpdate) {
                    if(showWhen) {                
                        if(!showWhen()) { 
                            const foundTarget = document.querySelector(selector);
                            if(foundTarget) {
                                console.log(`found ${selector}, removing...`);
                                foundTarget.remove();
                            } else {
                                console.warn(`'buildCallout;non-render-condition#2' => No target element found for selector '${selector}'.`);
                            }
                            return; 
                        }
                    } else {
                        if(foundTarget) {
                            console.log(`found ${selector}, replacing...`);
                            foundTarget.replaceWith(container);
                        } else {
                            console.warn(`'buildCallout#2' => No target element found for selector '${selector}'.`);
                        }
                    }
                }
            });

            const foundTarget = document.querySelector(selector);
            if(foundTarget) {
                console.log(`found ${selector}, replacing...`);
                foundTarget.replaceWith(container);
            } else {
                console.warn(`'buildCallout' => No target element found for selector '${selector}'.`);
            }
        });
    }

    buildCallouts.defaultAuthWarning = {
        selector: '#auth-warning',
        theme: 'grey',
        title: 'HEADS UP:',
        message: `You haven't Authorized the API with an Access Token yet. To do so, click the ${window[TDV].Authenticator.svgOpened(16)} icon at the top of the page and enter a valid Access Token!`,
        showWhen() {
            return !window[TDV].Authenticator.isAuthenticated();
        }
    }

    buildCallouts.defaultVendorWarning = {
        selector: '#vendor-warning',
        theme: 'red',
        title: 'WARNING:',
        message: `This endpoint is intended to be used by B2B Partner Vendors - don't be surprised if it doesn't work for you!`,
        showWhen() {
            return !SiteStorage.getIsVendor();
        }
    }

    window[TDV].buildCallouts = buildCallouts;
}();