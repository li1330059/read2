import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import Vant from 'vant';
import 'vant/lib/index.css';
import 'element-plus/dist/index.css'
import { getQueryVariable } from './libs/util'
let new_pid = getQueryVariable('pid');
// const new_pid = 'aif8j9q38t4q78y4'
console.log(new_pid)
if (new_pid) {
    localStorage.setItem('pid', new_pid)
}
let tinit = localStorage.getItem('tinit');
if (tinit == null || tinit == 'null') {
    localStorage.setItem('tinit', Date.now());
    console.log('set tinit value');
}
createApp(App).use(store).use(router).use(ElementPlus).use(Vant).mount('#app')
