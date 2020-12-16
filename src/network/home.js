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

// -------params-------
//获取所有商品分类数据
export function getCateListAll() {
  return request({
    url: `categories`
  });
}

//获取分类参数列表
export function getCateParams(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    params: {
      sel
    }
  });
}

//添加动态参数或静态属性
export function addCateParams(id, attr_name, attr_sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: "post",
    data: {
      attr_name,
      attr_sel
    }
  });
}

//删除参数
export function deleteCateParamsById(id, attrid) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "delete"
  });
}

//根据id查询参数
export function selectCateParamsById(id, attrid, attr_sel) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "get",
    params: {
      attr_sel
    }
  });
}
//提交修改查询
export function changeCateParams(id, attrid, attr_name, attr_sel) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "put",
    data: {
      attr_name,
      attr_sel
    }
  });
}
//提交属性Attr_Vals的修改
export function changeCateParamsAttrVals(
  id,
  attrid,
  attr_name,
  attr_sel,
  attr_vals
) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "put",
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  });
}
// -------goodsList-------
/**
 * 获取商品列表数据
 * @param query 查询参数
 * @param pagenum 当前页码
 * @param pagesize 每页显示条数
 * @returns {*}
 */
export function getGoods(query, pagenum, pagesize) {
  return request({
    url: `goods`,
    method: "get",
    params: {
      query,
      pagenum,
      pagesize
    }
  });
}
export function deleteGoodsById(id) {
  return request({
    url: `goods/${id}`,
    method: "delete"
  });
}

//添加商品
export function addGood(
  goods_name,
  goods_cat,
  goods_price,
  goods_number,
  goods_weight,
  goods_introduce,
  pics,
  attrs
) {
  return request({
    url: `goods`,
    method: "post",
    data: {
      goods_name,
      goods_cat,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs
    }
  });
}
