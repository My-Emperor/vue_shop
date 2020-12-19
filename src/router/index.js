import Vue from "vue";
import VueRouter from "vue-router";
//es6语法导入
const Login = () => import("@/views/login/Login");
const Home = () => import("@/views/home/Home");
const WelCome = () => import("@/views/home/Welcome");
const Users = () => import("@/views/home/childComp/user/Users");
const Rights = () => import("@/views/home/childComp/power/Rights");
const Roles = () => import("@/views/home/childComp/power/Roles");
const Cate = () => import("@/views/home/childComp/goods/Cate");
const Params = () => import("@/views/home/childComp/goods/Params");
const List = () => import("@/views/home/childComp/goods/List");
const AddGoods = () => import("@/views/home/childComp/goods/AddGoods");
const Order = () => import("@/views/home/childComp/order/Order");

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      {
        //欢迎首页
        path: "/welcome",
        component: WelCome
      },
      {
        //用户列表
        path: "/users",
        component: Users
      },
      {
        //权限列表
        path: "/rights",
        component: Rights
      },
      {
        //角色列表
        path: "/roles",
        component: Roles
      },
      {
        //商品分类
        path: "/categories",
        component: Cate
      },
      {
        //分类参数
        path: "/params",
        component: Params
      },
      {
        //商品列表
        path: "/goods",
        component: List
      },
      {
        //添加商品
        path: "/goods/addGoods",
        component: AddGoods
      },
      {
        //订单管理
        path: "/orders",
        component: Order
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

//  to 将要跳转的页面
//  from 从哪里跳转的页面
//  next() 放行  如果带参数 则强制跳转的参数路径
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  return next();
});

//BUG
/* 由于next();加了分号的缘故 因此
  router.beforeEach((to, from, next) => {
  if (to.path === '/login') next();
  const token = window.sessionStorage.getItem("token");
  if (token) next();
  else next('/login');
});
 */
export default router;
