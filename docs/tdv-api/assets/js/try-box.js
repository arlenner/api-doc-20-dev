~function() {
    const ENTITY_TYPES = [
        'account', 'accountRiskStatus', 'cashBalance', 'command', 'commandReport', 'contactInfo', 'contract', 'contractGroup', 'contractMaturity',
        'currency', 'executionReport', 'fill', 'fillPair', 'marketDataSubscription', 'order', 'orderStrategy', 'orderStrategyLink', 
        'orderStrategyType', 'orderVersion', 'position', 'product', 'tradingPermission', 'tradovateSubscription', 'user', 'userProperty',
        'userAccountPositionLimit', 'userAccountRiskParameter', 'userAccountAutoLiq', 'userSession', 'exchange', 'productSession',
        'alertSignal'
    ];

    const VENDOR_ENTITY_TYPES = [
        'adminAlertSignal', 'organization', 'tradovateSubscriptionPlan', 'marketDataSubscriptionPlan', 'entitlement', 'userPlugin', 'adminAlert' 
    ];

    const PREFER_LIVE = [
        '/auth/accessTokenRequest', '/user/signupOrganizationMember', '/userPlugin/addEntitlementSubscription', '/user/addMarketDataSubscription',
        '/user/addTradovateSubscription',
    ].map(x => x.toLowerCase());

    const TDV = Symbol.for('tdv-docs');
    const shouldRenderPlayBtn = () => window.innerWidth <= 1400;
    const mdSize = 800;

    function buildTryit(config) {
        const mainContent = document.querySelector('.main-content');
        const mainHeader = document.getElementById('main-header');
        const lock = document.getElementById('tdv-lock');
        const { endpoint, name, excerpt = '', method, query, params, dynamic = false, exclude, excerptOnly = false } = config 
        let baseURL = 'https://demo-d.tradovateapi.com/v1';
        let extURL = endpoint;
        let entity = '';

        const rightbar = document.querySelector('.tdv-rightbar');

        const container = document.createElement('div');

        const inputContainer = document.createElement('div');
        const title = document.createElement('h3');
        title.innerHTML = name;
        const notes = document.createElement('p');
        notes.innerHTML = excerpt;
        notes.style.marginLeft = '1em';
        const epName = document.createElement('code');
        if(!excerptOnly) {
            epName.textContent = entity+endpoint;
            epName.style.marginLeft = '1em';
        }
        const paramLabel = document.createElement('label');
        paramLabel.innerHTML = params ? 'PARAMETERS' : query ? 'QUERY' : '<em>(No Parameters)</em>';
        const paramBox = document.createElement('figure');
        const paramText = document.createElement('pre');
        if(params || query) {
            paramBox.classList.add('highlight', 'spp');
            paramBox.appendChild(paramText);
            paramText.style.overflow = 'auto';
    
            //PARAMS SETUP
            paramText.contentEditable = true;
            if(params) {
                const c = document.createElement('code');
                c.style.overflow = 'auto';
                c.classList.add('language-JS');
                if(sessionStorage.getItem(endpoint)) {
                    c.textContent = sessionStorage.getItem(endpoint);
                } else {
                    c.textContent = JSON.stringify(params, null, 2);
                }
                paramText.appendChild(c);
            }
            if(query) {
                const c = document.createElement('code');
                c.style.overflow = 'auto';
                c.classList.add('language-JS');
                c.textContent = Object.entries(query).reduce((acc, [k, v], i, arr) => {
                    let q = acc + k + '=' + v;
                    if(i !== arr.length-1) {
                        q += '&';
                    }
                    return q;
                }, '?');
                paramText.appendChild(c);
            }
        }
        const goButton = document.createElement('button');
        const urlPicker = document.createElement('select');
        const simUrl = document.createElement('option');
        simUrl.textContent = 'SIM';
        const liveUrl = document.createElement('option');
        liveUrl.textContent = 'LIVE';
        urlPicker.add(simUrl);
        urlPicker.add(liveUrl);
        urlPicker.addEventListener('change', e => {
            baseURL = urlPicker.selectedIndex === 0
                ? 'https://demo-d.tradovateapi.com/v1'
                : 'https://live-d.tradovateapi.com/v1';
            console.log('Selected URL changed:', baseURL);
        });
        if(endpoint && PREFER_LIVE.includes(endpoint.toLowerCase())) {
            urlPicker.selectedIndex = 1;
        }
        const buttonBox = document.createElement('div');
        buttonBox.classList.add('tdv-btn-box');
        goButton.classList.add('btn');
        goButton.style.zIndex = 2;
        goButton.textContent = 'Go!';
        buttonBox.appendChild(goButton);
        buttonBox.appendChild(urlPicker);
        
        const resultContainer = document.createElement('div');        
        const statusLabel = document.createElement('label');
        const statusBox = document.createElement('h3');
        const responseLabel = document.createElement('label');
        const responseBox = document.createElement('figure');
        const responseText = document.createElement('pre');
        responseText.style.overflow = 'auto';
        if(!excerptOnly) {
            resultContainer.id = 'op'+endpoint.split('/').join('');
            statusLabel.textContent = 'STATUS';
            responseLabel.textContent = 'RESPONSE';
            responseBox.classList.add('highlight', 'spp');
            responseBox.appendChild(responseText);
        }

        container.classList.add('tdv-rightbar-item');
        container.style.marginTop = mainHeader.getBoundingClientRect().height + 'px';
        inputContainer.classList.add('tdv-op-container');
        paramBox.classList.add('tdv-op-param-box');
        resultContainer.classList.add('tdv-op-container');

        let tryBtn;
        if(shouldRenderPlayBtn()) {
            rightbar.style.width = 0;
            rightbar.style.height = 0;
            tryBtn = document.createElement('button');
            tryBtn.dataset.role = 'try-it';
            tryBtn.classList.add('btn', 'btn-green');
            tryBtn.style.zIndex = 99;
            tryBtn.style.position = 'absolute';
            tryBtn.style.top = window.innerWidth < mdSize ? '72px' : '12px';
            tryBtn.style.right = window.innerWidth < mdSize ? '48px' : '128px';
            tryBtn.textContent = '▶';
            tryBtn.addEventListener('click', () => {
                
                // lock.style.position = lock.style.position === 'absolute' ? 'fixed' : 'absolute';
                rightbar.style.width = rightbar.style.width === '' ? 0 : '';
                rightbar.style.height = rightbar.style.height === '' ? 0 : '';
                rightbar.style.right = 0;
                for(const node of rightbar.querySelectorAll('.tdv-rightbar-item')) {
                    node.classList.contains('fade-in') ? node.classList.remove('fade-in') : node.classList.add('fade-in');
                }
                if(rightbar.contains(tryBtn)) {
                    rightbar.removeChild(tryBtn);
                    mainContent.append(tryBtn);
                    rightbar.removeChild(lock);
                    mainContent.append(lock);
                } else {
                    mainContent.removeChild(tryBtn);
                    rightbar.append(tryBtn);
                    mainContent.removeChild(lock);
                    rightbar.append(lock);
                }
                tryBtn.textContent = tryBtn.textContent === '▶' ? '❌' : '▶';
            });
            mainContent.append(tryBtn);
        }


        window.addEventListener('resize', () => {
            if(shouldRenderPlayBtn() && tryBtn) {
                tryBtn.style.display = '';
                rightbar.style.width = 0;
                rightbar.style.height = 0;
                tryBtn.style.top = window.innerWidth < mdSize ? '72px' : '12px';
                tryBtn.style.right = window.innerWidth < mdSize ? '48px' : '128px';
            }
            if(!shouldRenderPlayBtn() && tryBtn) {
                tryBtn.style.display = 'none';
            }
        });

        inputContainer.appendChild(title);
        if(dynamic) {
            let allEntTypes = [...ENTITY_TYPES];
            if(window[TDV].SiteStorage.getIsVendor()) {
                allEntTypes = allEntTypes.concat(...VENDOR_ENTITY_TYPES);
            }
            const dropdown = document.createElement('select');
            allEntTypes.filter(x => exclude ? !exclude.includes(x) : true).forEach(et => {
                let option = document.createElement('option');
                option.text = et;
                dropdown.add(option);
            });
            entity = 'account';
            extURL = `/${entity}${endpoint}`;
            epName.textContent = '/'+entity+endpoint;

            dropdown.addEventListener('change', (e) => {
                const value = e.target.value;
                entity = value;
                epName.textContent = '/'+entity+endpoint;
                extURL = '/'+entity+endpoint;
            })

            inputContainer.appendChild(dropdown);
        }
        if(!excerptOnly) {
            inputContainer.appendChild(epName);
        }
        inputContainer.appendChild(notes);
        if(!excerptOnly) {
            inputContainer.appendChild(document.createElement('hr'));
            inputContainer.appendChild(paramLabel);
            inputContainer.appendChild(paramBox);
            inputContainer.appendChild(buttonBox);
        }

        resultContainer.appendChild(statusLabel);
        resultContainer.appendChild(statusBox);
        resultContainer.appendChild(responseLabel);
        resultContainer.appendChild(responseBox);
        
        container.appendChild(inputContainer);
        if(!excerptOnly) {
            container.appendChild(document.createElement('hr'));
        }
        // container.appendChild(resultContainer);

        //events
        if(!excerptOnly) {
            // let sinceLastKey;
            paramText.addEventListener('keyup', () => {                
                sessionStorage.setItem(endpoint, paramText.textContent);
            });

            goButton.addEventListener('click', async _ => {            
                let response;
                let c = responseText.querySelector('code');
                if(!c) {
                    c = document.createElement('code');
                    c.classList.add('language-JS');
                }
                c.textContent = '--';
                responseText.appendChild(c);
    
                const accessToken = sessionStorage.getItem('tradovate.accessToken');
                if(!accessToken && endpoint !== '/auth/accesstokenrequest') {
                    alert('Authorize your Access Token first. Click the lock icon!');
                }
                let bod = "{}", qy = '';
                if(params) {
                    let lines = paramBox.textContent.split('\n').map((line, i, arr) => {
                        let result = '';
                        let trimmed = line.trim()
                        if(line.startsWith('"//')) {
                            return result;
                        }
                        else if(line.includes('"//')) {
                            result = trimmed.split('"//')[0].trim();
                        }
                        else result = trimmed;
                        return result;
                    })
                    .filter(x => x)
                    .map((line, i, arr) => {
                        let result = line;
                        if(i < arr.length-1) {
                            if(line.trim().endsWith(',') && arr[i+1].trim().startsWith('}')) {
                                result = line.slice(0, line.length-1);
                            }
                        }
                        return result;
                    });
                    // console.log(lines);
                    lines = lines.join('').trim();
                    bod = lines;
                } else if(query) {
                    qy = paramBox.textContent.trim();
                }
                const body = {};
                if(method === 'POST') {
                    body.body = bod;
                }
    
                let auth = {};
                let text = '';
    
                if(endpoint !== `/auth/accesstokenrequest`) {
                    auth = { Authorization: `Bearer ${accessToken}` };
                }
    
                try {
                    response = await fetch(baseURL + extURL + qy, {
                        method,
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            ...auth
                        },
                        ...body
                    });
                    statusBox.textContent = response.status;
                    if(response.status === 200) {
                        text = JSON.stringify(await response.json(), null, 2);
                    } else {
                        text = await response.text();
                    }
                    
                } catch(err) {
                    statusBox.textContent = response.status;
                    text = err;
                }
                
                c.textContent = text;
    
                container.appendChild(resultContainer);
                
            });
        }

        rightbar.appendChild(container);
    }

    window[TDV].defineTryit = buildTryit;
}();
 