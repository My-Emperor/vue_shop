<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <!--搜索框-->
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
            @blur="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addGoods">
            添加商品
          </el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table border stripe :data="goods.goods" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          width="110px"
          prop="goods_price"
          label="商品价格(元)"
        ></el-table-column>
        <el-table-column
          width="80px"
          prop="goods_weight"
          label="商品重量"
        ></el-table-column>
        <el-table-column width="170px" prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column width="130px" label="操作">
          <template slot-scope="scope">
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeGoods(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--  分页条  -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goods.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoods } from "network/home";
import { deleteGoodsById } from "network/home";

export default {
  name: "List",
  data() {
    return {
      // 获取商品列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      //商品列表
      goods: {},
      //添加商品窗口flag
      addDialogVisible: false,
      //添加商品表单对象
      addGoodsForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        add_time: ""
      }
    };
  },
  methods: {
    //监听pagesize改变的事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      //改变页码后重新请求数据
      this.getGoodsList();
    },
    //监听页码值改变的事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getGoodsList();
    },

    //删除对应ID的商品
    removeGoods(goods_id) {
      this.deleteGoods(goods_id);
    },

    //添加商品
    addGoods() {
      //跳转到添加商品组件
      this.$router.push("/goods/addGoods");
    },

    /**
     * 网络请求相关方法
     */
    //获取商品参数列表
    getGoodsList() {
      getGoods(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("获取商品列表失败!ERR:" + res.meta.msg);
        this.goods = res.data;
        console.log("goods");
        console.log(this.goods);
      });
    },
    deleteGoods(goods_id) {
      deleteGoodsById(goods_id).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("删除商品失败!ERR:" + res.meta.msg);
        this.$message.success("删除商品成功!ERR:" + res.meta.msg);
        //重新刷新商品列表
        this.getGoodsList();
      });
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style scoped>
.el-table {
  margin: 10px 0;
}
</style>
