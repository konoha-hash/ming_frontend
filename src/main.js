import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css';
import request from "@/utils/request";
import * as echarts from 'echarts';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import store from './store';
import axios from 'axios';

//配置antd的message
import { message} from 'ant-design-vue';

Vue.prototype.$message = message;
message.config({
  duration: 2,// 持续时间
  top:`100px`, // 到页面顶部距离
  maxCount: 3 // 最大显示数, 超过限制时，最早的消息会被自动关闭
});

Vue.config.productionTip = false

Vue.use(ElementUI,{size:'small'});

Vue.prototype.request=request;

Vue.use(Antd);

Vue.prototype.echarts = echarts;
Vue.prototype.axios = axios;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
