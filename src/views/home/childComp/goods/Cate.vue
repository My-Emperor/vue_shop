<template>
  <div>
    <!-- 面包屑导航   -->
    <!--    面包屑区域-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图   -->
    <el-card>
      <!--      添加商品分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" class="addButton" @click="addCateValidate"
            >添加分类
          </el-button>
        </el-col>
      </el-row>
      <!--      表格区域-->
      <tree-table
        :data="cateList"
        :columns="columns"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <!--        col:是否有效-->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!--        col:排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!--        col:操作-->
        <template slot="option" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="changeCatesForm(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!--      分页条-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="cateInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--  添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--弹窗主体内容-->
      <el-form
        ref="addCateFormRef"
        :rules="addFormRules"
        :model="addCateForm"
        label-width="70px"
      >
        <el-form-item label="分类名称" label-width="15%" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="15%" prop="password">
          <!--联级选择器-->
          <el-cascader
            v-model="selectCateKey"
            :options="this.parentCateList"
            expandTrigger="hover"
            :props="props"
            @change="ChangeCateKey"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateFormValidate">确 定</el-button>
      </span>
    </el-dialog>

    <!--  修改分类对话框-->
    <el-dialog
      title="修改分类"
      :visible.sync="changeDialogVisible"
      width="50%"
      @close="changeDialogClosed"
    >
      <!--弹窗主体内容-->
      <el-form
        ref="changeCateFormRef"
        :rules="changeFormRules"
        :model="changeCateForm"
        label-width="70px"
      >
        <el-form-item label="分类名称" label-width="15%" prop="cat_name">
          <el-input v-model="changeCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeCateFormValidate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList } from "network/home";
import { addCate } from "network/home";
import { getParentCateList } from "network/home";
import { getCateById } from "network/home";
import { changeCate } from "network/home";
import { deleteCate } from "network/home";
export default {
  name: "Cate",
  data() {
    return {
      //商品分类数据列表
      cateList: [],
      //商品分类参数对象
      cateInfo: {
        type: "",
        pageNum: "",
        pageSize: ""
      },
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "option"
        }
      ],
      //添加分类对象
      addCateForm: {
        cat_pid: "",
        cat_name: "",
        cat_level: ""
      },
      //添加分类控制弹窗对象
      addDialogVisible: false,

      //父级分类层级数组
      parentCateList: [],

      //联级选择器配置对象
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },

      //选中父级的id数组
      selectCateKey: [],

      //修改分类表单对象
      changeCateForm: {},

      //修改分类控制值弹窗对象
      changeDialogVisible: false,

      //添加分类表单规则对象
      addFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      },
      //修改分类表单规则对象
      changeFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //监听pagesize改变的事件
    handleSizeChange(pagesize) {
      this.cateInfo.pageSize = pagesize;
      //改变页码后重新请求数据
      console.log(this.cateInfo);
      this.getCate(this.cateInfo);
    },
    //监听页码值改变的事件
    handleCurrentChange(pagenum) {
      this.cateInfo.pageNum = pagenum;
      console.log(this.cateInfo);
      this.getCate(this.cateInfo);
    },

    //监听分类弹窗,关闭时触发,重置表单对象
    addDialogClosed() {
      //重置联级选择器
      this.selectCateKey = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.$refs.addCateFormRef.resetFields();
    },

    //监听添加分类按钮 添加时弹窗显示
    addCateValidate() {
      this.addDialogVisible = true;
      this.getParentCateLists();
      console.log(this.parentCateList);
    },

    //监听联级选项是否发生改变
    ChangeCateKey() {
      if (this.selectCateKey.length > 0) {
        this.addCateForm.cat_pid = this.selectCateKey[
          this.selectCateKey.length - 1
        ];
        this.addCateForm.cat_level = this.selectCateKey.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    //添加分类
    cateFormValidate() {
      // console.log(this.addCateForm)
      this.addCates(this.addCateForm);
    },

    //监听修改分类弹窗是否关闭
    changeDialogClosed() {
      //重置表单
      this.$refs.changeCateFormRef.resetFields();
    },

    //监听修改分类按钮 并初始化表单数据
    changeCatesForm(id) {
      this.getCatesById(id);
      console.log(this.changeCateForm);
    },

    //提交修改分类数据
    changeCateFormValidate() {
      this.changeCates(this.changeCateForm);
    },

    //删除分类
    removeCateById(cat_id) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //用户点击了确定按钮:
          //进行删除用户操作
          this.deleteCates(cat_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * 网络请求相关方法
     */
    //获取商品分类数据
    getCate(cateInfo) {
      getCateList(cateInfo.type, cateInfo.pageNum, cateInfo.pageSize).then(
        res => {
          if (res.meta.status !== 200)
            return this.$message.error("获取商品分类失败!ERR:" + res.meta.msg);
          // this.$message.success("获取商品分类成功!");
          this.cateList = res.data.result;
          this.total = res.data.total;
          // console.log(111);
          // console.log(this.cateList);
        }
      );
    },

    //获取父级商品层级
    getParentCateLists() {
      //获取前两级的分类
      getParentCateList(2).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error(
            "获取父级商品分类层级失败!ERR:" + res.meta.msg
          );
        this.parentCateList = res.data;
      });
    },

    //添加商品分类
    addCates(addCateForms) {
      addCate(
        addCateForms.cat_pid,
        addCateForms.cat_name,
        addCateForms.cat_level
      ).then(res => {
        if (res.meta.status !== 201)
          return this.$message.error("添加商品分类失败!ERR:" + res.meta.msg);
        this.$message.success("添加商品分类成功!");
        //关闭弹窗
        this.addDialogVisible = false;
        //刷新商品分类列表
        this.getCate(this.cateInfo);
      });
    },

    //根据Id获取商品分类数据
    getCatesById(id) {
      getCateById(id).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("获取商品分类失败!ERR:" + res.meta.msg);
        this.$message.success("获取商品分类成功!");
        this.changeCateForm = res.data;
        //显示弹窗
        this.changeDialogVisible = true;
      });
    },

    //修改商品分类表单数据
    changeCates(cateForm) {
      changeCate(cateForm.cat_id, cateForm.cat_name).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("修改商品分类失败!ERR:" + res.meta.msg);
        this.$message.success("修改商品分类成功!");
        //关闭弹窗
        this.changeDialogVisible = false;
        //刷新商品分类数据列表
        this.getCate(this.cateInfo);
      });
    },

    //删除商品分类
    deleteCates(id) {
      deleteCate(id).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("删除商品分类失败!ERR:" + res.meta.msg);
        this.$message.success("删除商品分类成功!");
        //关闭弹窗
        this.changeDialogVisible = false;
        //刷新商品分类数据列表
        this.getCate(this.cateInfo);
      });
    }
  },
  created() {
    //在该组件创建时渲染商品分类数据列表
    this.cateInfo.type = 3;
    this.cateInfo.pageNum = 1;
    this.cateInfo.pageSize = 5;
    this.getCate(this.cateInfo);
  }
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
