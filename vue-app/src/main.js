import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

if (!window.singleSpaStarted) {
  createApp(App).use(router).mount("#root");
}

export async function bootstrap(props) {
  console.log("vue app bootstrap", props);
}

let instance;
export async function mount(props) {
  console.log("vue app mount", props);
  instance = createApp(App);
  instance.use(router).mount("#vue-app");
}

export async function unmount(props) {
  console.log("vue app unmount", props);
  instance.unmount();
  instance = null;
}
