
~function() {
    function Socket(url) {
        this.url = url;
        /**@type {WebSocket} */
        this.ws = null;
        this.idx = 0;
    }
    
    Socket.prototype.connect = async function() {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.warn('Attempting to connect an existing OPEN state WebSocket.');
        } else {
            this.ws = new WebSocket(this.url);
        }
    }
    
    Socket.prototype.disconnect = function() {
        if(this.ws && (this.ws.readyState !== WebSocket.CLOSED || this.ws.readyState !== WebSocket.CLOSING)) {
            this.ws.close(1000, 'Manual disconnect requested.');
        }
    }
    
    Socket.prototype.send = function({url, idx, query = '', body = ''}) {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(`${url}\n${idx || this.idx++}\n${query}\n${JSON.stringify(body)}`)
        }
    }
    
    Socket.prototype.on = function(event, cb) {
        if(this.ws) {
            this.ws.addEventListener(event, cb);
        }
    }

    Socket.decode = function (raw) {
        const T = raw[0];
        let data;
        if(raw.length > 1) {
            data = JSON.parse(raw.slice(1));
            if(!data) {
                data = raw;
            }
        }
        return [T, data];
    }

    const TDV = Symbol.for('tdv-docs');
    window[TDV].Socket = Socket;
}();
