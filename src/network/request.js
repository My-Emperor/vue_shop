import axios from "axios";

import Vue from "vue";
Vue.prototype.$http = axios;
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

//对axios进行封装 导出axios实例
export function request(config) {
  //1.创建axios的实例
  const instance = axios.create({
    baseURL: "https://www.liulongbin.top:8888/api/private/v1/",
    timeout: 5000
  });

  // 2.axios的拦截器
  // 2.1.请求拦截,在发送请求之前会调用该回调函数,调用完成后才会发送真正的请求
  // 该项目获取接口数据时需要保证获取数据的权限,即验证token 将本地的token添加到请求头对象中 即Authorization中,以获取数据的权限
  instance.interceptors.request.use(
    config => {
      config.headers.Authorization = window.sessionStorage.getItem("token");
      return config;
    },
    err => {
      console.log(err);
    }
  );

  // 2.2.响应拦截
  instance.interceptors.response.use(
    res => {
      return res.data;
    },
    err => {
      console.log(err);
    }
  );

  // 3.发送真正的网络请求
  return instance(config);
}
