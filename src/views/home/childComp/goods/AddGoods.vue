<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <!--提示信息-->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!--步骤条-->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--form表单-->
      <el-form
        ref="addGoodsRef"
        :rules="addGoodsRules"
        :model="addGoods"
        label-position="top"
      >
        <!--tab栏-->
        <el-tabs
          :before-leave="tabBeforeLeave"
          v-model="activeIndex"
          :tab-position="'left'"
          @tab-click="tabClicked"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoods.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addGoods.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="addGoods.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="addGoods.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="选择商品分类" prop="goods_number">
              <el-cascader
                v-model="selectCateKey"
                :options="this.cateListAll"
                expandTrigger="hover"
                :props="props"
                @change="ChangeCateKey"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane name="1" label="商品参数">
            <el-form-item
              v-for="itemParams in manyParams"
              :label="itemParams.attr_name"
              :key="itemParams.attr_id"
              prop="goods_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="itemParams.attr_vals">
                <el-checkbox
                  :label="itemVals"
                  v-for="(itemVals, index) in itemParams.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              list-type="picture"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!--富文本编辑器-->
            <quill-editor v-model="addGoods.goods_introduce"></quill-editor>

            <!--富文本编辑器-->
            <el-button type="primary" class="btnAdd" @click="addGoodsForm"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getCateListAll } from "network/home";
import { getCateParams } from "network/home";
import { addGood } from "network/home";
import _ from "lodash";

export default {
  name: "AddGoods",
  data() {
    return {
      //步骤条活跃标记对象
      activeIndex: "0",
      //添加商品对象
      addGoods: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        //介绍
        goods_introduce: "",
        //上传的图片的临时路径
        pics: [],
        //商品参数(mony+only)
        attrs: []
      },
      list: [1, 3, 4, 5, 67, 7],
      //级联选择器配置对象
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //所有商品分类列表
      cateListAll: [],

      //级联选择器中选中父级的id数组
      selectCateKey: [],
      //商品参数类别对象
      paramsType: "",
      //
      // toManyParams: this.manyParams,
      //动态参数列表
      manyParams: [],
      //静态属性列表
      onlyParams: [],

      //图片的网络请求地址
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      //设置上传图片的请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      //图片绝对路径
      previewPath: "",
      //判断图片查看弹框对象
      previewVisible: false,
      //添加用户表单规则对象
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
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
      this.addGoods.goods_cat = this.selectCateKey;
    },

    //监听tab栏切换前触发事件
    tabBeforeLeave() {
      if (this.activeIndex == "0" && !this.cateId) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },

    //监听tab栏点击切换事件
    tabClicked() {
      console.log(this.activeIndex);
      if (this.activeIndex == "1") {
        this.paramsType = "many";
        //获取商品动态参数
        this.getCateParamsList(this.cateId, this.paramsType);
      }
      if (this.activeIndex == "2") {
        this.paramsType = "only";
        //获取商品静态属性
        this.getCateParamsList(this.cateId, this.paramsType);
      }
    },
    //图片临时上传成功时触发
    handleSuccess(response) {
      //将图片的临时路径保存到添加商品对象的属性中
      const pic = { pic: response.data.tmp_path };
      this.addGoods.pics.push(pic);
      console.log(this.addGoods.pics);
    },

    //点击图片时预览
    handlePreview(file) {
      //将上传图片的绝对路径赋值 用于预览图片
      this.previewPath = file.response.data.url;
      //显示弹窗
      this.previewVisible = true;
    },

    //删除图片
    handleRemove(file) {
      const remPicPath = file.response.data.temp_path;
      const index = this.addGoods.pics.findIndex(item => {
        //判断保存的临时地址
        item.pic === remPicPath;
      });
      //删除添加商品对象中的图片
      this.addGoods.pics.splice(index, 1);
      console.log(this.addGoods.pics);
    },

    //添加商品
    addGoodsForm() {
      //添加前进行预校验
      this.$refs.addGoodsRef.validate(valid => {
        if (!valid) {
          return this.$message.error("请输入必要的表单项!");
        }
        //校验通过 添加商品
        //_.cloneDeep 深拷贝 返回一个拷贝的对象
        const addForm = _.cloneDeep(this.addGoods);
        //直接将this.AddGoods转成字符串会报错 原因 级联选择器中v-model只允许绑定数组 而双向绑定的goods_cat变成字符串时将会报错
        console.log(addForm);
        console.log(this.addGoods);
        addForm.goods_cat = addForm.goods_cat.join(",");

        //将动态参数与静态属性attr_vals转成字符串并添加到数组中
        //动态参数转字符串
        this.manyParams.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(" ")
          };
          this.addGoods.attrs.push(obj);
        });
        //静态属性没有转成数组 则不需要转成字符串
        this.onlyParams.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          };
          this.addGoods.attrs.push(obj);
        });
        //将attrs保存到克隆的添加商品对象addForm中
        addForm.attrs = this.addGoods.attrs;
        console.log(addForm);
        //添加商品
        this.addGoodParamsForm(addForm);
      });
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
        if (attr_sel == "many") {
          //将attr_value字符串转换成数组
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          });
          this.manyParams = res.data;
        } else {
          //BUG Invalid prop: type check failed for prop "value". Expected String, Number, got Array   found in
          //原因 input中v-model绑定的值为需为字符串, 上边通过foreach将attr_vals转换成了数组 所以报warn
          this.onlyParams = res.data;
        }
      });
    },
    //添加商品
    addGoodParamsForm(addGoods) {
      addGood(
        addGoods.goods_name,
        addGoods.goods_cat,
        addGoods.goods_price,
        addGoods.goods_number,
        addGoods.goods_weight,
        addGoods.goods_introduce,
        addGoods.pics,
        addGoods.attrs
      ).then(res => {
        if (res.meta.status !== 201)
          return this.$message.error("添加商品失败!ERR:" + res.meta.msg);
        this.$message.success("添加商品成功！");
        //跳转页面至商品列表页面
        this.$router.push("/goods");
      });
    }
  },
  created() {
    //初始化获取所有参数
    this.getCateAll();
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
    }
  }
};
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 10px;
}
</style>
