import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import TreeTable from "vue-table-with-tree-grid";

//导入全局样式表
import "./assets/css/base.css";
//导入element-ui样式表
import "element-ui/lib/theme-chalk/index.css";
//导入字体图标样式表
import "./assets/fonts/iconfont.css";

Vue.config.productionTip = false;

Vue.component("tree-table", TreeTable);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
