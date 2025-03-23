declare module 'worker-loader!*' {
    class WebWorker extends Worker {
        constructor();
    }
    export = WebWorker;
}
