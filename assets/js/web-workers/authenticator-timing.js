const workercode = () => {
    let interval;
    let time = 0;
    self.onmessage = function({data: { mode, renewed, secsLeft }}) {
        if(mode === 'off') {
            clearInterval(interval);
            self.postMessage({ shouldUpdate: true });
            time = 0;
        } else if (mode === 'on') {
            if(renewed) {
                time = 0;
                if(interval) clearInterval(interval);
            }
            if(!renewed) {
                self.postMessage({ shouldUpdate: true });
            }
            interval = setInterval(() => {
                time += 1;
                if(time >= secsLeft) {
                    self.postMessage({ shouldRenew: true });
                    time = 0;
                }
            }, 1000);
        }
    };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);

const authWorker = new Worker(worker_script);
window[Symbol.for('tdv-docs')] = window[Symbol.for('tdv-docs')] || {};
window[Symbol.for('tdv-docs')]._authWorker = authWorker;