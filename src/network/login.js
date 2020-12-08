import { request } from "./request";

//登录请求
export function Login(username, password) {
  return request({
    url: "login",
    params: {
      username,
      password
    }
  });
}
