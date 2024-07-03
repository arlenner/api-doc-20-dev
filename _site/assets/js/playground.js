
const ENTITY_TYPES = [
    'account', 'accountRiskStatus', 'cashBalance', 'command', 'commandReport', 'contract', 'contractGroup', 'contractMaturity', 'currency',
    'executionReport', 'fill', 'fillPair', 'marketDataSubscriptionPlan', 'marketDataSubscription', 'order', 'orderStrategy', 'orderStrategyLink',
    'orderStrategyType', 'orderVersion', 'position', 'product', 'tradingPermission', 'tradovateSubscription', 'tradovateSubscriptionPlan', 'user',
    'userPlugin', 'userProperty', 'userAccountPositionLimit', 'userAccountRiskParameter', 'userAccountAutoLiq', 'adminAlertSignal'
];

window.addEventListener('load', () => {
    // console.log('running...')
    const TDV = Symbol.for('tdv-docs');
    const playground = document.getElementById('tdv-playground');
    const { Socket } = window[TDV];
    const accessToken = sessionStorage.getItem('tradovate.accessToken');

    let activeSocket = null;
    let counter = 0;

    /** COMMANDS LIST */
    const commands = {
        'authorize'() { 
            return {
                get({token}) { return `authorize\n${counter}\n\n${token || accessToken || 'your_token_here'}`; },
                params: { token: 'token'}
            }
        },
        'custom...'() {
            const isNumber = v => {
                const num = v.includes('.') ? parseFloat(v) : parseInt(v, 10);
                return num !== undefined && num !== null;
            }
            const isBool = v => v === 'true' || v === 'false';
            const parseFields = (params) => {
                let result = '{';
                params.body.fields.forEach((field, i, arr) => {
                    const trimmed = field.trim();
                    const [k, v] = trimmed.split(':');
                    result += `"${k}":`
                    if(isNumber(v) || isBool(v)){
                        result += `${v}`;
                    }
                    else {
                        result += `"${v}"`;
                    }
                    if(arr.length - 1 !== i) {
                        result += ',';
                    } else if(arr.length - 1 === i) {
                        result += "}";
                    }
                });
                return result;
            }
            return {
                get(params) { 
                    console.log(params)
                    return `${params.endpoint}\n${counter}\n${params.query || ''}\n${params.body && params.body.fields ? parseFields(params) : '' }`;
                },
                params: { endpoint: 'string', query: 'string', body: { fields: 'fields'}}
            }
        },
        'user/syncRequest'() {
            return {
                get({users}) { return `user/syncRequest\n${counter}\n\n${JSON.stringify(users)}`},
                params: { users: { users: 'array' }, splitResponses: 'bool' }
            }
        },
        '/list'() { 
            return {
                get({entity}) { return `${entity}/list\n${counter}\n\n`},
                params: { entity: 'Entity'} 
            }
        },
        '/item'() { 
            return {
                get({entity, id}) { return `${entity}/item\n${counter}\nid=${id}\n`},
                params: { entity: 'Entity', id: 0 }
            }
        },
        '/items'() { 
            
            return {
                get({entity, ids}) { const stringIds = ids?.join() || []; return `${entity}/items\n${counter}\nids=${stringIds}\n`},
                params: { entity: 'Entity', ids: 'array' }
            }
        },
        '/find'() { 
            return {
                get({entity, name}) { return `${entity}/find\n${counter}\nname=${name}\n`},
                params: { entity: 'Entity', name: 'string' }
            }
        },
        '/suggest'() { 
            return {
                get({entity, text, length}) { return `${entity}/suggest\n${counter}\nt=${text}&l=${length}\n`},
                params: { entity: 'Entity', text: 'string', length: 0 }
            }
        },
        '/deps'() { 
            return {
                get({entity, masterid}) { return `${entity}/deps\n${counter}\nmasterid=${masterid}\n`},
                params: { entity: 'Entity', masterid: 0 }
            }
        },
        '/ldeps'() { 
            return {
                get({entity, masterids}) { return `${entity}/ldeps\n${counter}\nmasterids=${masterids?.join() || []}\n`},
                params: { entity: 'Entity', masterids: 'array' }
            }
        },
        'order/placeOrder'() {
            return {
                get(params) { return `order/placeOrder\n${counter}\n\n${JSON.stringify(params)}`},
                params: { accountSpec: "string", accountId: 0, action: "action", symbol: "symbol", orderQty: 'number', price: 'price', stopPrice: 'price', orderType: 'orderType', isAutomated: 'bool' }
            }
        },
        'order/liquidatePosition'() {
            return {
                get(params) { return `order/liquidatePosition\n${counter}\n\n${JSON.stringify(params)}`},
                params: { accountId: 0, contractId: 0, admin: 'bool', customTag50: 'string' }
            }
        },
        'order/cancelOrder'() {
            return {
                get(params) { return `order/cancelOrder\n${counter}\n\n${JSON.stringify(params)}`},
                params: { orderId: 0, customTag50: 'string', isAutomated: 'bool' }
            }
        },
        'order/modifyOrder'() {
            return {
                get(params) { return `order/modifyOrder\n${counter}\n\n${JSON.stringify(params)}`},
                params: { orderId: 0, orderQty: 'number', orderType: 'orderType', price: 'price', stopPrice: 'price' }
            }
        },
        'cashBalance/changeDemoBalance'() {
            return {
                get(params) { return `cashBalance/changeDemoBalance\n${counter}\n\n${JSON.stringify(params)}`},
                params: { accountId: 0, cashChange: 0 }
            }
        }
    }

    const mdCommands = {
        'authorize'() { 
            return {
                get({token}) { return `authorize\n${counter}\n\n${token || accessToken || 'your_token_here'}`; },
                params: { token: 'token'}
            }
        },
        'md/subscribeQuote'() {
            return {
                get({symbol}) { return `md/subscribeQuote\n${counter}\n\n${JSON.stringify({ symbol })}`},
                params: { symbol: 'symbol'}
            }
        },
        'md/unsubscribeQuote'() {
            return {
                get({symbol}) { return `md/unsubscribeQuote\n${counter}\n\n${JSON.stringify({ symbol })}`},
                params: { symbol: 'symbol' }
            }
        },
        'md/subscribeDOM'() {
            return {
                get({symbol}) { return `md/subscribeDOM\n${counter}\n\n${JSON.stringify({ symbol })}`},
                params: { symbol: 'symbol'}
            }
        },
        'md/unsubscribeDOM'() {
            return {
                get({symbol}) { return `md/unsubscribeDOM\n${counter}\n\n${JSON.stringify({ symbol })}`},
                params: { symbol: 'symbol' }
            }
        },
        'md/subscribeHistogram'() {
            return {
                get({symbol}) { return `md/subscribeHistogram\n${counter}\n\n${JSON.stringify({ symbol })}`},
                params: { symbol: 'symbol'}
            }
        },
        'md/unsubscribeHistogram'() {
            return {
                get({symbol}) { return `md/unsubscribeHistogram\n${counter}\n\n${JSON.stringify({ symbol })}`},
                params: { symbol: 'symbol'}
            }
        },
        'md/getChart'() {
            return {
                get(params) {
                    let ps; 
                    if(typeof params === 'string') {
                        ps = JSON.parse(params);
                    } else ps = params;
                    return `md/getChart\n${counter}\n\n${JSON.stringify(ps)}`;
                },
                params: { symbol: "symbol", chartDescription: { underlyingType: 'chartType', elementSize: 0, elementSizeUnit: 'sizeUnit', withHistogram: 'bool' },  timeRange: { closestTimestamp: 'date', closestTickId: 0, asFarAsTimestamp: 'date', asMuchAsElements: 0 } }
            }
        },
        'md/cancelChart'() {
            return {
                get({subscriptionId}) { return `md/cancelChart\n${counter}\n\n${JSON.stringify({ subscriptionId })}`},
                params: { subscriptionId: 'number' }
            }
        },
    }

    const replayCommands = {}

    /**
     * Socket Initialization routine, attached to 'Connect' button
     * @param {string} url 
     */
    async function startSocket(url) {
        counter = 0;
        if(activeSocket) { 
            activeSocket.disconnect();
            activeSocket.url = url;
        } else {
            activeSocket = new Socket(url);
        }
        const responses = document.getElementById('tdv-responses-list');
        responses.innerText = '';
        const paletteBtns = document.getElementById('palette-buttons');
        paletteBtns.innerText = '';
        
        await activeSocket.connect();
        switch(url) {
            case 'wss://demo.tradovateapi.com/v1/websocket':
            case 'wss://demo-d.tradovateapi.com/v1/websocket':
            case 'wss://live.tradovateapi.com/v1/websocket':
            case 'wss://live-d.tradovateapi.com/v1/websocket':
                buildPalette(commands);
                break;
            case 'wss://md.tradovateapi.com/v1/websocket':
            case 'wss://md-d.tradovateapi.com/v1/websocket':
                buildPalette(mdCommands);
                break;
            case 'wss://replay.tradovateapi.com/v1/websocket':
            case 'wss://replay-d.tradovateapi.com/v1/websocket':
                buildPalette(replayCommands);
                break;
        }
        let lastTime;
        activeSocket.ws.addEventListener('error', err => {
            console.log(err);
        });
        activeSocket.ws.addEventListener('message', msg => {
            
            const [T, data] = msg.data.includes('404') ? ['a', msg.data] : Socket.decode(msg.data);
            const ts = Date.now();
            if(!lastTime) {
                lastTime = Date.now();
            }
            if(ts - lastTime >= 2500) {
                const _msg = '[]';
                activeSocket.ws.send(_msg);
                buildMessageItem('OUT', _msg);
                lastTime = ts;
            }
            buildMessageItem('IN', msg);
        });
        activeSocket.ws.addEventListener('shutdown', sd => console.log('shutdown...', sd));
        activeSocket.ws.onclose = msg => {
            buildMessageItem('IN', msg.reason, true);
        }
    }

    /*APPLICATION ENTRY*/

    const urlSelector = document.getElementById('url-selector');
    const starter = document.getElementById('start-socket-btn');
    const sender = document.getElementById('send-btn');
    const sendText = document.getElementById('send-text');
    const responses = document.getElementById('tdv-responses-list');
    let showHBs = true;
    const hbControl = document.getElementById('show-heartbeats');
    hbControl.addEventListener('change', (e) => {
        showHBs = e.target.checked;
    });

    starter.addEventListener('click', () => startSocket(urlSelector.options[urlSelector.selectedIndex].text));

    sender.addEventListener('click', () => {
        console.log(sendText.textContent);
        activeSocket.ws.send(sendText.textContent);
        buildMessageItem('OUT', sendText.textContent);
        counter++;
    });


    /*UTILITIES, COMMAND PALETTE*/
     

    /**
     * make and return an html input element with `box` as its parent
     * @param {string} type 
     * @param {string} placeholder 
     * @param {HTMLElement} box 
     * @returns {HTMLInputElement}
     */
    function makeInput(type, placeholder, box) {
        let input = document.createElement('input');
        input.type = type;
        if(type === 'checkbox') {
            input.id = 'param-checker';
            const outer = document.createElement('label');
            input.setAttribute('checked', 'checked');
            outer.setAttribute('for', 'param-checker');
            outer.classList.add('checker');
            const inner = document.createElement('span');
            inner.classList.add('checker-inner');
            outer.appendChild(input);
            outer.appendChild(inner);
            input = outer;
        }
        else {
            input.placeholder = placeholder;
        }
        input.addEventListener('change', () => {
            if(type === 'checkbox') {
                box.tdvParam = input.checked;
            } else if(type === 'number') {
                box.tdvParam = parseInt(input.value, 10);
            } else {
                box.tdvParam = input.value;
            }
        });
        box.appendChild(input);
        return input;
    }

    /**
     * make and return an html select element with `box` as its parent
     * @param {Array<string>} arr 
     * @param {HTMLElement} box 
     * @param {number} def default selection 
     * @returns {HTMLSelectElement}
     */
    function makeSelect(arr, box, def = 0) {
        const select = document.createElement('select');
        arr.forEach(n => {
            const opt = document.createElement('option');
            opt.text = n;
            select.add(opt);
        });
        box.tdvParam = select.options[def].text;
        select.addEventListener("change", () => {
            box.tdvParam = select.options[select.selectedIndex].text;
        });
        box.appendChild(select);
        return select;
    }

    function makeMultiInput(box, fields = false) {
        let arr = [];
        const input = document.createElement('input');
        input.type = fields ? 'text' : 'number';
        const list = document.createElement('ul');
        const btn = document.createElement('button');
        btn.classList.add('btn');
        btn.style.margin = '.25em';
        btn.style.width = '2.25em';
        btn.style.height = '2.25em';
        btn.style.borderRadius = '50%';
        btn.style.display = 'flex';
        btn.style.justifyContent = 'center';
        btn.style.alignItems = 'center';
        btn.style.fontSize = '10px'
        btn.textContent = '➕';
        btn.addEventListener('click', () => {
            const item = document.createElement('li');
            item.textContent = input.value;
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                arr.splice(arr.indexOf(item.textContent));
                item.remove();
                box.tdvParam = arr.map(x => fields ? x : parseInt(x, 10));
            });
            list.appendChild(item);
            arr.push(input.value);
            input.value = '';
            box.tdvParam = arr.map(x => fields ? x : parseInt(x, 10));
        });
        box.appendChild(input);
        box.appendChild(btn);
        box.appendChild(list);
    }

    /**
     * 
     * @param {string} k 
     * @param {string | 0} param 
     * @returns 
     */
    function buildCommandOption(k, param) {
        const box = document.createElement('div');
        box.tdvParamName = k;
        box.classList.add('ws-param-box');
        const label = document.createElement('label');
        label.textContent = k;
        box.appendChild(label);

        switch(param) {
            case 'fields': {
                makeMultiInput(box, true);
                break;
            }
            case 'array': {
                makeMultiInput(box);
                break;
            }
            case 'string': {
                makeInput('text', 'enter text', box);
                break;
            }
            case 'symbol': {
                makeInput('text', 'ESU0', box);
                break;
            }
            case 'token': {
                const input = makeInput('text', 'enter access token', box);
                const accessToken = sessionStorage.getItem('tradovate.accessToken');
                if(accessToken) {
                    input.value = accessToken;
                    box.tdvParam = accessToken;
                } 
                input.placeholder = 'enter access token';                
                break;
            }
            case 0: {
                makeInput('number', '123456789', box);
                break;
            }
            case 'price': {
                makeInput('number', '1000.00', box);
                break;
            }
            case 'number': {
                makeInput('number', '0', box);
                break;
            }
            case 'bool': {
                makeInput('checkbox', null, box);
                break;
            }
            case 'date': {
                makeInput('datetime-local', null, box);
                break;
            }
            case 'Entity': {
                makeSelect(ENTITY_TYPES, box);
                break;
            }
            case 'action': {
                makeSelect(['Buy', 'Sell'], box);
                break;
            }
            case 'chartType': {
                makeSelect(['Tick', 'DailyBar', 'MinuteBar', 'Custom', 'DOM'], box);
                break;
            }
            case 'sizeUnit': {
                makeSelect(['UnderlyingUnits', 'Volume', 'Range', 'Renko', 'MomentumRange', 'PointAndFigure', 'OFARange'], box);
                break;
            }
            case 'orderType': {
                makeSelect(['Market', 'Limit', 'Stop', 'StopLimit', 'TrailingStop', 'TrailingStopLimit'], box);
                break;
            }
        }
        return box;
    }

    function buildCommandOptions(params, parent = null) {
        let optionsContainer = parent || document.getElementById('palette-buttons')
        if(parent === null) {
            optionsContainer.innerText = '';
        }
        Object.keys(params).forEach(k => {
            switch(typeof params[k]) {
                case 'object': {
                    const div = document.createElement('div');
                    div.classList.add('compound-param');
                    const label = document.createElement('label');
                    label.innerHTML = `<strong>${k}</strong>`;
                    optionsContainer.appendChild(label);
                    div.id = 'param-'+k;
                    optionsContainer.appendChild(buildCommandOptions(params[k], div));
                    break;
                }
                case 'number':
                case 'string': {
                    optionsContainer.appendChild(buildCommandOption(k, params[k]));
                    break;
                }
            }
        });
        return optionsContainer
    }

    function buildPalette(commands) {
        console.log('building palette for commands', commands)
        const palette = playground.querySelector('#palette');
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('tdv-playground-palette-content');
        let h4 = palette.querySelector('h4');
        if(!h4) {
            h4 = document.createElement('h4');
            palette.appendChild(h4);
            h4.textContent = 'Command Palette';
        }
        const input = playground.querySelector('#send-text');

        Object.keys(commands).forEach((k, i) => {
            const { get, params } = commands[k]();
            let button = document.createElement('button');
            button.classList.add('btn', 'btn-red');
            button.style.fontFamily = `"Montserrat", sans-serif`;
            button.style.transform = `translateX(128px)`;
            button.style.opacity = 0;
            button.style.transition = `transform .33s ease-out, opacity .25s ease-in`;
            setTimeout(() => {
                button.style.transform = '';
                button.style.opacity = 1;
            },(i+1)*50);
            button.textContent = k;
            button.addEventListener('click', () => {
                buildCommandOptions(params);
                const buildBtn = document.getElementById('build-btn');
                buildBtn.removeAttribute('disabled');
                buildBtn.addEventListener('click', () => {
                    let boxes = Array.from(palette.querySelectorAll('.ws-param-box'));
                    let params = boxes.reduce((acc, next) => {
                        if(next.parentElement.id && next.parentElement.id.startsWith('param-')) {
                            const nk = next.parentElement.id.split('-')[1];
                            acc[nk] = acc[nk] || {};
                            acc[nk][next.tdvParamName] = next.tdvParam;
                        } else {
                            acc[next.tdvParamName] = next.tdvParam;
                            if(acc[next.tdvParamName] === undefined) {
                                delete acc[next.tdvParamName]
                            }
                        }
                        return acc;
                    }, {});
                    const message = get(params);
                    input.textContent = message;
                });
            });
            buttonContainer.appendChild(button);
        });
        const existingContent = palette.querySelector('.tdv-playground-palette-content')
        if(existingContent) {
            existingContent.replaceWith(buttonContainer);
        } else {
            palette.appendChild(buttonContainer);
        }
    }

    function buildOutputItem(color, icon, message, small = false) {
        const inner = message[1] === '['
            ? `<details><summary>${new Date().toJSON().split('T')[1]} > ${message}</summary><div>${JSON.stringify(JSON.parse(message.slice(1)), null, 2)}</div></details>`
            : message.includes('\\n')
            ? `<details><summary>${new Date().toJSON().split('T')[1]} > ${message}</summary><div style="overflow-x: auto; text-overflow: visible;">${message.split('\\n').join('\n')}</div></details>`
            : `<span>${new Date().toJSON().split('T')[1]} > ${message}</span>`;
            
        return `<span class="fs-6" style="color: ${color}; height: 100%; border-radius: 50%;${small ? '' : 'padding-left: 6px; padding-right: 6px;'} background-color: #27262b;">${icon}</span>${inner}`;
    }

    function buildMessageItem(mode, msg, wasClose = false) {
        const li = document.createElement('li');
        const _li = document.createElement ('div');
        _li.style.listStyle = 'none';
        _li.style.listStyleType = 'none';
        _li.appendChild(li); 
        li.style.listStyle = 'none';
        li.style.listStyleType = 'none';
        li.style.marginLeft = '-1em';

        if(mode === 'IN') {
            if(!showHBs && msg.data[0] === 'h') {
                return;
            }
            else {
                li.innerHTML = msg.data ?  buildOutputItem('red', '↘', msg.data) : buildOutputItem('red', '⛔', msg, true);
                let _msg = msg.data ? msg.data : msg;
                if(_msg.length > 1 && _msg[1] === '[') {
                    let was404 = false;
                    const data = _msg.includes('404') ? (was404 = true, _msg) : JSON.parse(_msg.slice(1));
                    li.firstElementChild.style.cursor = 'pointer';
                    li.firstElementChild.ariaLabel = 'Copy JSON data to clipboard.';
                    li.firstElementChild.addEventListener('click', async e => {
                        await navigator.clipboard.writeText(was404 ? _msg : JSON.stringify(data));
                        alert('Copied JSON Data to Clipboard.');
                    });
                }
            }
            if(wasClose) {
                li.innerHTML = buildOutputItem('red', '⛔', msg, true);
            } 
        } else if (mode === 'OUT') {
            if(msg === '[]') {
                if(!showHBs) {
                    return;
                }
                li.innerHTML = buildOutputItem('blue', '↖', '[]');
            } else {
                li.innerHTML = buildOutputItem('blue', '↖', msg.split('\n').join('\\n'));
                li.firstElementChild.style.ariaLabel = 'Copy Message data to clipboard.';
                li.firstElementChild.style.cursor = 'pointer';
                li.children[1].style.marginLeft = '1em';
                li.firstElementChild.addEventListener('click', async () => {
                    await navigator.clipboard.writeText(msg.split('\n').join('\\n'));
                    alert('Copied Message Text to Clipboard.')
                });
            }
        }
        if(li.children && li.children.length > 1) {
            li.children[1].style.marginLeft = '1em';
        }
        if(responses.hasChildNodes() && responses.children.length > 0) {
            responses.insertBefore(_li, responses.firstElementChild);
        } else {
            responses.appendChild(_li);
        }
    }
});
