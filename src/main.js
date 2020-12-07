import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 全局引用 element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// vue3.0 
import VueCompositionApi from '@vue/composition-api';
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
// 系统默认的环境变量
// console.log(process.env)
/*
可以自定义环境变量
如果是线下 npm run serve
 -----默认读取 .env.development
如果是线上 npm run build
 -----默认读取 .env.production
*/
Vue.config.productionTip = false;

// 可以删除
// import './styles/main.scss'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
