// import { registerApplication, start } from 'single-spa';
import { registerApplication, start } from './my-spa/index';
import 'systemjs';

registerApplication({
    name: 'react-app-single-spa-name',
    app: () => window.System.import('react-app'),
    activeWhen: (location) => location.pathname.includes('/react'),
    customProps: {},
});

registerApplication({
    name: 'vue-app-single-spa-name',
    // app: () => import("http://localhost:8088/src/main.js"), // vite
    app: async () => {
        // vue的性能优化，把node_module单独打包成chunk-vendors，因为vue认为第三方包改动比较少，可以用于缓存。
        // https://forum.vuejs.org/t/why-does-vue-cli-produce-chunk-vendors-and-how-to-eventually-manage-it/108794
        // https://github.com/vuejs/vue-cli/blob/master/packages/%40vue/cli-service/lib/config/app.js#L41-L46
        await window.System.import('vue-chunk-vendors')
        return await window.System.import('vue-app')
    },
    activeWhen: (location) => location.pathname.includes('/vue'),
    customProps: {},
});

window.singleSpaStarted = true;
start();

