import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'


//pinia
import { createPinia } from 'pinia' 
const pinia = createPinia()
 
const app = createApp(App)
 
//pinia
app.use(pinia)
app.mount('#app')


// createApp(App).mount('#app')
