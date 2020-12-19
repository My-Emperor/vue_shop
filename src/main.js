import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import TreeTable from "vue-table-with-tree-grid";
import VueQuillEditor from "vue-quill-editor";
//导入全局样式表
import "./assets/css/base.css";
//导入element-ui样式表
import "element-ui/lib/theme-chalk/index.css";
//导入字体图标样式表
import "./assets/fonts/iconfont.css";
//导入富文本编辑器样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.config.productionTip = false;

Vue.component("tree-table", TreeTable);

//挂载富文本编辑器
Vue.use(VueQuillEditor);

//全局定义一个时间格式化过滤器
Vue.filter("dateFormate", function(originVal) {
  //获取该时间对应的date对象
  const date = new Date(originVal);

  const year = date.getFullYear();
  //month 从0月份开始计算
  //padStart 判断是否为2位数,不满足则在前边添加字符串 '0';
  const month = (date.getMonth() + 1 + "").padStart(2, "0");
  const day = (date.getMonth() + "").padStart(2, "0");

  const hour = (date.getHours() + "").padStart(2, "0");
  const minute = (date.getMinutes() + "").padStart(2, "0");
  const second = (date.getSeconds() + "").padStart(2, "0");

  //返回自定义格式的模板字符串
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
