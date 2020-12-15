<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt="" /><span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="reback">注销</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="menuCollapse" @click="isMenuCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!--一级菜单-->
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="item.id + ''"
          >
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="saveNavState('/' + subItem.path)"
            >
              <i class="iconfont icon-gengduo"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "../../network/home";

export default {
  name: "Home",
  data() {
    return {
      //侧边栏数据
      menuList: {},
      //侧边栏各类图标
      menuIcon: {
        "125": "iconfont icon-ren",
        "103": "iconfont icon-quanxian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-dingdan",
        "145": "iconfont icon-shuju"
      },
      //侧边栏收缩
      isCollapse: false,
      //侧边栏中当前活跃的组件地址
      activePath: ""
    };
  },
  methods: {
    reback() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    isMenuCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存二级菜单激活状态
    saveNavState(path) {
      window.sessionStorage.setItem("activePath", path);
      this.activePath = path;
    }
  },

  created() {
    //刷新页面时获取侧边栏二级菜单中激活的状态
    this.activePath = window.sessionStorage.getItem("activePath");

    /**
     * 网络请求相关方法
     */
    //登录成功后进行主页的数据渲染
    //获取侧边栏数据
    getMenuList()
      .then(res => {
        //如果响应的数据状态值非200 则弹出错误提示
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data;
        console.log(this.menuList);
      })
      .catch({
        // console.log(rej)
      });
  }
};
</script>
<style lang="less" scoped>
//lement-ui中的每一个组件名称都是一个类名
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  background-color: #373d41;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    align-items: center;

    span {
      padding-left: 20px;
      font-size: 19px;
      color: #fff;
    }
  }
}
//侧边栏
.el-aside {
  background-color: #333744;
  //收缩栏
  .menuCollapse {
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    background-color: #4a5064;
    color: #fff;
    cursor: pointer;
    letter-spacing: 0.2em;
  }
  //左侧菜单
  .el-menu {
    border-right: 0px;
    //字体图标
    .iconfont {
      font-size: 19px;
      padding-right: 8px;
    }
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
