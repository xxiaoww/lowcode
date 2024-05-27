import { createApp } from "vue";
import App from "./App.vue";
import "element-plus/theme-chalk/index.css";
import "./assets/iconfont/iconfont.css";

const app = createApp(App);

import element from "element-plus";
app.use(element);
//pinia
import { createPinia } from "pinia";
const pinia = createPinia();

//pinia
app.use(pinia);
app.mount("#app");

// createApp(App).mount('#app')
