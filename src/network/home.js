import { request } from "./request";

//获取侧边栏
export function getMenuList() {
  return request({
    url: "menus"
  });
}

// -------user-------
//用户列表类
export class User {
  constructor(users, total, pagenum) {
    this.userList = users;
    this.total = total;
    this.pageNum = pagenum;
  }
}

//获取用户列表
export function getUserList(query, pagenum, pagesize) {
  return request({
    url: "users",
    params: {
      query,
      pagenum,
      pagesize
    }
  });
}

//修改用户状态
export function changeUserState(userId, userType) {
  return request({
    url: `users/${userId}/state/${userType}`,
    method: "put"
  });
}

// 添加用户
export function addUser(username, password, email, mobile) {
  return request({
    url: "users",
    method: "post",
    data: {
      username,
      password,
      email,
      mobile
    }
  });
}

//获取修改用户数据
export function getChangeUser(userId) {
  return request({
    url: `users/${userId}`
  });
}

//修改用户
export function changeUser(userId, email, mobile) {
  return request({
    url: `users/${userId}`,
    method: "put",
    data: {
      email,
      mobile
    }
  });
}

//删除用户
export function deleteUser(userId) {
  return request({
    url: `users/${userId}`,
    method: "delete"
  });
}
