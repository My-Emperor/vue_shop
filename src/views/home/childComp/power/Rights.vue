<template>
  <div>
    <!--    面包屑区域-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    用户卡片-->
    <el-card
      ><!--    面包屑区域-->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!--          插槽作用域 可以在域中获取该表格当前的对象 并且进行对应操作-->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/home";

export default {
  name: "Rights",
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    /**
     * 网络请求相关方法
     */
    getRights(type) {
      getRightsList(type)
        .then(res => {
          if (res.meta.status !== 200)
            return this.$message.error("获取权限列表失败!ERR:" + res.meta.msg);
          //将获取的权限列表数据赋值给rightsList
          this.rightsList = res.data;
          console.log(res);
        })
        .catch();
    }
  },
  created() {
    //加载组件进行数据初始化
    this.getRights("list");
  }
};
</script>

<style lang="less" scoped></style>
