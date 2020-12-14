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
export function getChangeUserById(userId) {
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

//分配角色给用户
export function asRoleToUser(id, rid) {
  return request({
    url: `users/${id}/role`,
    method: "put",
    data: {
      rid
    }
  });
}

// -------rights-------
//获取权限列表
export function getRightsList(type) {
  return request({
    url: `rights/${type}`,
    method: "get"
  });
}

// -------roles-------
//获取角色列表
export function getRolesList() {
  return request({
    url: "roles",
    method: "get"
  });
}

//添加角色列表
export function addRoles(roleName, roleDesc) {
  return request({
    url: "roles",
    method: "post",
    data: {
      roleName,
      roleDesc
    }
  });
}

//获取修改角色数据
export function getChangeRolesById(id) {
  return request({
    url: `roles/${id}`,
    method: "get"
  });
}

//提交修改角色
export function changeRoles(id, roleName, roleDesc) {
  return request({
    url: `roles/${id}`,
    method: "put",
    data: {
      roleName,
      roleDesc
    }
  });
}

//删除角色
export function deleteRolesById(id) {
  return request({
    url: `roles/${id}`,
    method: "delete"
  });
}

//删除角色权限
export function deleteRoleRightById(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "delete"
  });
}

//角色授权
export function editRoleRight(roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: "post",
    data: {
      rids
    }
  });
}

// -------cate-------
//获取商品分类数据
export function getCateList(type, pagenum, pagesize) {
  return request({
    url: `categories`,
    params: {
      type,
      pagenum,
      pagesize
    }
  });
}
//获取父级商品分类数据
export function getParentCateList(type) {
  return request({
    url: `categories`,
    params: {
      type
    }
  });
}

//添加商品分类
export function addCate(cat_pid, cat_name, cat_level) {
  return request({
    url: `categories`,
    method: "post",
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  });
}

//根据id查询商品分类数据
export function getCateById(id) {
  return request({
    url: `categories/${id}`
  });
}

//提交修改的商品分类
export function changeCate(id, cat_name) {
  return request({
    url: `categories/${id}`,
    method: "put",
    data: {
      cat_name
    }
  });
}
//删除商品分类
export function deleteCate(id) {
  return request({
    url: `categories/${id}`,
    method: "delete"
  });
}
