<template>
  <div>
    <!--    面包屑区域-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!--用户卡片-->
    <el-card>
      <!--提示信息-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>

      <el-row class="selectCate">
        <el-col>
          <span>选择商品分类:</span>
          <!--分类级联选择器-->
          <el-cascader
            v-model="selectCateKey"
            :options="this.cateListAll"
            expandTrigger="hover"
            :props="props"
            @change="ChangeCateKey"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!--标签页-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :disabled="isDisable" label="动态参数" name="many">
          <el-button
            :disabled="isDisable"
            class="addParamsBtn"
            type="primary"
            @click="addParamsDialogVisible = true"
            >添加参数
          </el-button>
          <!--动态参数列表表格-->
          <el-table border stripe :data="manyParams" style="width: 100%">
            <!--展开列-->
            <el-table-column type="expand" style="text-align: left">
              <!--展开列表模板-->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  :key="index"
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="savetaginput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
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
                    size="mimi"
                    @click="
                      editParamsFormValidate(
                        scope.row.cat_id,
                        scope.row.attr_id
                      )
                    "
                    >编辑</el-button
                  >
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
                    icon="el-icon-delete"
                    @click="
                      deleteParamsFormValidate(
                        scope.row.cat_id,
                        scope.row.attr_id
                      )
                    "
                    >删除</el-button
                  >
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :disabled="isDisable" label="静态属性" name="only">
          <el-button
            :disabled="isDisable"
            class="addParamsBtn"
            type="primary"
            @click="addParamsDialogVisible = true"
            >添加属性
          </el-button>
          <!--今天属性列表表格-->
          <el-table border stripe :data="onlyParams" style="width: 100%">
            <!--展开列-->
            <el-table-column type="expand" style="text-align: left">
              <!--展开列表模板-->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  :key="index"
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="savetaginput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  :enterable="false"
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="top"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mimi"
                    @click="
                      editManyOrOnlyParamsFormValidate(
                        scope.row.cat_id,
                        scope.row.attr_id
                      )
                    "
                    >编辑</el-button
                  >
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
                    icon="el-icon-delete"
                    @click="
                      deleteParamsFormValidate(
                        scope.row.cat_id,
                        scope.row.attr_id
                      )
                    "
                    >删除</el-button
                  >
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加动态参数弹窗-->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClosed"
    >
      <!--弹窗主体内容-->
      <el-form
        ref="addParamsFormRef"
        :rules="addParamsFormRules"
        :model="addParamsForm"
        label-width="140px"
      >
        <el-form-item :label="titleText + '名称'" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsFormValidate"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!--修改动态参数弹窗-->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editParamsDialogClosed"
    >
      <!--弹窗主体内容-->
      <el-form
        ref="editParamsFormRef"
        :rules="editParamsFormRules"
        :model="editParamsForm"
        label-width="140px"
      >
        <el-form-item :label="titleText + '名称'" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsFormValidate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateListAll } from "network/home";
import { getCateParams } from "network/home";
import { addCateParams } from "network/home";
import { selectCateParamsById } from "network/home";
import { changeCateParams } from "network/home";
import { deleteCateParamsById } from "network/home";
import { changeCateParamsAttrVals } from "network/home";

export default {
  name: "Params",
  data() {
    return {
      //所有商品分类列表
      cateListAll: [],

      //级联选择器中选中父级的id数组
      selectCateKey: [],

      //级联选择器配置对象
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //判断标签页是否被禁用
      isDisable: true,
      //标签页活动标记对象 默认动态参数
      activeName: "many",

      //参数列表对象数组
      //动态参数列表
      manyParams: [],

      //静态参数列表
      onlyParams: [],

      //添加参数弹窗显示对象
      addParamsDialogVisible: false,

      //添加参数表单对象
      addParamsForm: {},

      //添加参数表单规则
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入动态参数名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      },

      //编辑参数表单对象
      editParamsForm: {},

      //编辑参数弹窗显示对象
      editParamsDialogVisible: false,

      //编辑参数表单规则
      editParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入动态参数名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //级联选择器改变触发事件
    ChangeCateKey() {
      console.log(this.selectCateKey);
      console.log(this.cateId);
      //当选择三级分类时 进行一次动态参数的渲染
      if (!this.cateId) {
        this.selectCateKey = [];
        return this.$message.error("请选择三级分类");
      }
      this.getCateParamsList(this.cateId, this.activeName);
    },

    //标签页改变触发事件
    handleClick() {
      //修改标签页时进行一次获取分类参数列表的网络请求
      //判断选中的是否是三级分类
      if (!this.cateId) return this.$message.error("请选择三级分类");
      this.getCateParamsList(this.cateId, this.activeName);
    },

    //监听添加动态参数弹窗是否关闭
    addParamsDialogClosed() {
      this.$refs.addParamsFormRef.resetFields();
    },
    //添加动态参数
    addParamsFormValidate() {
      //判断选中的是否是三级分类
      if (!this.cateId) {
        this.addParamsDialogVisible = false;
        return this.$message.error("请选择三级分类");
      }
      this.addCateMonyOrOnlyParams(
        this.cateId,
        this.addParamsForm.attr_name,
        this.activeName
      );
      this.addParamsDialogVisible = false;
    },

    //编辑动态参数,获取对应ID的动态参数数据
    editManyOrOnlyParamsFormValidate(id, attr_id) {
      this.getCateMonyOrOnlyParamsById(id, attr_id, this.activeName);
      this.editParamsDialogVisible = true;
    },

    //监听添加动态参数弹窗是否关闭
    editParamsDialogClosed() {
      this.$refs.editParamsFormRef.resetFields();
    },

    //提交修改的动态参数表单
    editParamsFormValidate() {
      this.changeCateMonyOrOnlyParams(
        this.editParamsForm.cat_id,
        this.editParamsForm.attr_id,
        this.editParamsForm.attr_name,
        this.activeName
      );
      this.editParamsDialogVisible = false;
    },

    //删除参数列表
    deleteParamsFormValidate(cat_id, attr_id) {
      this.$confirm("此操作将删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //用户点击了确定按钮:
          //进行删除用户操作
          this.deleteCateParams(cat_id, attr_id, this.activeName);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //监听tag标签删除按钮
    handleClose(index, cateParams) {
      //截取需要删除的下标为index的对象,返回删除后的数据
      //将数组转成字符串
      cateParams.attr_vals.splice(index, 1);
      this.changeCateMonyOrOnlyAttrVals(
        this.cateId,
        cateParams.attr_id,
        cateParams.attr_name,
        cateParams.attr_sel,
        cateParams.attr_vals
      );
    },

    //tag添加框input失去焦点或回车提交时提交数据保存
    handleInputConfirm(cateParams) {
      if (cateParams.inputValue.trim().length === 0) {
        cateParams.inputValue = "";
        cateParams.inputVisible = false;
        return;
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      cateParams.attr_vals.push(cateParams.inputValue.trim());
      cateParams.inputValue = "";
      cateParams.inputVisible = false;
      //提交修改
      this.changeCateMonyOrOnlyAttrVals(
        this.cateId,
        cateParams.attr_id,
        cateParams.attr_name,
        cateParams.attr_sel,
        cateParams.attr_vals
      );
    },

    //监听New Tag按钮点击事件
    showInput(cateParams) {
      cateParams.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      // BUG: Cannot read property '$refs' of undefined"
      // this.$nextTick(_ => {
      //   this.$refs.saveTagInput.$refs.input.focus()
      //   console.log(_)
      // })
    },

    /**
     * 网络请求相关方法
     */
    //获取所有商品分类列表
    getCateAll() {
      getCateListAll().then(res => {
        if (res.meta.status !== 200)
          return this.$message.error(
            "获取是所有商品分类列表失败!ERR:" + res.meta.msg
          );
        this.cateListAll = res.data;
        console.log(this.cateListAll);
      });
    },
    //获取分类参数列表
    getCateParamsList(id, attr_sel) {
      getCateParams(id, attr_sel).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error(
            "获取是所有商品分类列表失败!ERR:" + res.meta.msg
          );
        //将attr_value字符串转换成数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          //定义tag添加框监听事件对象
          item.inputVisible = false;
          //定义tag添加框属性对象
          item.inputValue = "";
        });

        if (this.activeName == "many") {
          this.manyParams = res.data;
          console.log("many");
          console.log(this.manyParams);
        } else {
          this.onlyParams = res.data;
          console.log("only");
          console.log(this.onlyParams);
        }
      });
    },
    //添加动态参数或静态属性
    addCateMonyOrOnlyParams(id, attr_name, attr_sel) {
      addCateParams(id, attr_name, attr_sel).then(res => {
        if (res.meta.status !== 201)
          return this.$message.error("添加失败!ERR:" + res.meta.msg);
        //添加成功 重新获取该分类参数列表
        this.getCateParamsList(id, attr_sel);
        this.$message.success("添加成功");
      });
    },
    //根据id查询参数或属性数据
    getCateMonyOrOnlyParamsById(id, attr_id, attr_sel) {
      selectCateParamsById(id, attr_id, attr_sel).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error(
            "获取对应ID的参数数据失败!ERR:" + res.meta.msg
          );
        this.editParamsForm = res.data;
      });
    },

    //提交修改的参数表单数据
    changeCateMonyOrOnlyParams(id, attrId, attr_name, attr_sel) {
      changeCateParams(id, attrId, attr_name, attr_sel).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("添加失败!ERR:" + res.meta.msg);
        //修改成功 重新获取该分类参数列表
        this.getCateParamsList(id, attr_sel);
        this.$message.success("修改成功");
      });
    },

    //根据ID删除参数
    deleteCateParams(id, attr_id, attr_sel) {
      deleteCateParamsById(id, attr_id).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("删除失败!ERR:" + res.meta.msg);
        //修改成功 重新获取该分类参数列表
        this.getCateParamsList(id, attr_sel);
        this.$message.success("删除成功");
      });
    },

    //修改attr_vals属性参数
    changeCateMonyOrOnlyAttrVals(id, attrId, attr_name, attr_sel, attr_vals) {
      attr_vals = attr_vals.join(" ");
      changeCateParamsAttrVals(id, attrId, attr_name, attr_sel, attr_vals).then(
        res => {
          if (res.meta.status !== 200)
            return this.$message.error("添加失败!ERR:" + res.meta.msg);
          //修改成功 重新获取该分类参数列表
          this.$message.success("修改成功");
        }
      );
    }
  },
  computed: {
    /**
     * 当CateKey中长度为3表明选中三级分类 返回三级分类的id
     * @returns {null|*}
     */
    cateId() {
      //分类id计算属性
      if (this.selectCateKey.length === 3) {
        // BUG:Unexpected side effect in "cateId" computed property 大致意思:不能在计算属性值改变当前页面中变量的值
        // 解决:利用监听器watch对cateID进行监听即可
        //解除禁用标记
        // this.isDisable = !this.isDisable;
        return this.selectCateKey[2];
      }
      return null;
    },

    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  },
  watch: {
    //判断级联选择器是否选择了三级分类而解除禁用
    cateId(newVal) {
      console.log(newVal);
      if (!newVal) {
        this.onlyParams = [];
        this.manyParams = [];
        return (this.isDisable = true);
      }
      return (this.isDisable = false);
    }
  },
  created() {
    //获取所有商品分类列表渲染页面
    this.getCateAll();
  }
};
</script>

<style lang="less" scoped>
.selectCate {
  margin: 15px;
  span {
    margin-right: 5px;
  }
}
.addParamsBtn {
  margin-bottom: 10px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
