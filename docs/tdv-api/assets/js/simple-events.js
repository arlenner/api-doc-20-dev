~function() {
    const EVENTS = {};
    const TDV = Symbol.for('tdv-docs');

    function SimpleEvents() {}

    SimpleEvents.prototype.register = function(tag, cb) {
        EVENTS[tag] = EVENTS[tag] || [];
        EVENTS[tag].push(cb);
    }

    SimpleEvents.prototype.unregister = function(tag, cb) {
        if(EVENTS[tag]) {
            let idx = EVENTS[tag].indexOf(cb);
            if(idx > -1) {
                EVENTS[tag].splice(idx, 1);
            }
        }
    }

    SimpleEvents.prototype.emit = function(tag, data) {
        if(EVENTS[tag]) {
            EVENTS[tag].forEach(cb => cb(data));
        }
    }

    window[TDV] = window[TDV] || {};
    window[TDV].events = new SimpleEvents();
}();