<template>
  <div>
    <!--    面包屑区域-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    用户卡片-->
    <el-card>
      <!--搜索框-->
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryLikeOrder()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--订单列表-->
      <el-table
        class="orderTable"
        border
        stripe
        :data="orderlist"
        style="width: 100%"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款"></el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay !== 0 + ''" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="warning">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column prop="role_name" label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showAddressForm"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressForm"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--    分页条-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total - 0"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrder } from "network/home";
import { getExpressById } from "network/home";
import cityData from "assets/citydata";
export default {
  name: "Order",
  data() {
    return {
      //查询对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      //订单数据列表
      orderlist: [],
      //总数据条数
      total: "",
      //查询物流信息单号id
      expressId: 804909574412544580,
      //物流信息对象
      progressInfo: [],
      //判断修改弹窗是否弹出对象
      addressVisible: false,
      //判断物流弹窗是否弹出对象
      progressVisible: false,
      //城市列表对象
      cityData: cityData,
      //编辑表单对象
      addressForm: {
        address1: [],
        address2: ""
      },

      //编辑表单规则对象
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //模糊查询关键字订单信息
    queryLikeOrder() {
      console.log(111);
      console.log(this.queryInfo.query);
      this.getOrders(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      );
    },

    //监听pagesize改变的事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      //改变页码后重新请求数据
      this.getOrders(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      );
    },
    //监听页码值改变的事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getOrders(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      );
    },
    //监听编辑弹窗是否关闭 关闭则重置对象
    addressDialogClosed() {
      //重置表单
      this.$refs.addressFormRef.resetFields();
    },
    showAddressForm() {
      this.addressVisible = true;
    },
    showProgressForm() {
      this.getExpress(this.expressId);
    },
    //判断物流弹窗是否弹出对象
    /**
     * 网络请求相关方法
     */
    //获取订单数据列表
    getOrders(query, pagenum, pagesize) {
      getOrder(query, pagenum, pagesize).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error(
            "获取订单列表数据失败!ERR:" + res.meta.msg
          );
        this.orderlist = res.data.goods;
        this.total = res.data.total;
        console.log(this.orderlist);
      });
    },
    //获取物流信息数据列表
    getExpress(id) {
      getExpressById(id).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("获取物流数据失败!ERR:" + res.meta.msg);
        this.progressInfo = res.data;
        this.progressVisible = true;
      });
    }
  },
  created() {
    //初始化数据列表
    this.getOrders(
      this.queryInfo.query,
      this.queryInfo.pagenum,
      this.queryInfo.pagesize
    );
  }
};
</script>

<style lang="less" scoped>
.orderTable {
  margin: 15px 0;
}
</style>
