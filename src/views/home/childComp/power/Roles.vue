<template>
  <div>
    <!--    面包屑区域-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    添加角色按钮区域-->
    <el-row>
      <el-col>
        <el-button
          type="primary"
          class="addButton"
          @click="addDialogVisible = true"
          >添加角色
        </el-button>
      </el-col>
    </el-row>

    <!--    用户卡片-->
    <el-card
      ><!--    面包屑区域-->
      <el-table border stripe :data="rolesList">
        <!--        展开栏-->
        <el-table-column type="expand" style="text-align: left">
          <!--展开列表模板-->
          <template slot-scope="scope">
            <!--一级渲染-->
            <el-row
              :class="[
                'border_btm',
                index1 === 0 ? 'border_top' : '',
                'vcenter'
              ]"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  class="Tag_margin"
                  closable
                  @close="removeRoleRight(scope.row, item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级与三级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'border_top', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <!--二级渲染-->
                    <el-tag
                      class="Tag_margin"
                      type="success"
                      closable
                      @close="removeRoleRight(scope.row, item2.id)"
                      >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--三级渲染-->
                    <el-tag
                      class="Tag_margin"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRoleRight(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column width="450px" prop="level" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mimi"
              @click="showChangeDialogVisible(scope.row.id)"
              >编辑
            </el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mimi"
              @click="removeRoleById(scope.row.id)"
              >删除
            </el-button>

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mimi"
              @click="showEditRoleDialogVisible(scope.row)"
              >权限分配
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色弹窗-->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="35%"
      @close="addDialogClosed"
    >
      <!--弹窗主体内容-->
      <el-form
        ref="addRoleFormRef"
        :rules="addRoleRules"
        :model="addRoleForm"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolseFormValidate">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑弹窗-->
    <el-dialog
      title="编辑角色"
      :visible.sync="changeDialogVisible"
      width="50%"
      @close="changeDialogClosed"
    >
      <!--弹窗主体内容-->
      <el-form
        ref="changeRoleFormRef"
        :rules="changeFormRules"
        :model="changeRoleForm"
        label-width="100px"
      >
        <el-form-item label="角色ID" prop="roleId">
          <el-input v-model="changeRoleForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="changeRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="changeRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeFormValidate">确 定</el-button>
      </span>
    </el-dialog>

    <!--角色权限分配弹窗-->
    <el-dialog
      title="分配权限"
      :visible.sync="editRoleDialogVisible"
      width="40%"
      @close="editRoleDialogClosed"
    >
      <!--弹窗主体内容-->
      <el-tree
        ref="treeRef"
        node-key="id"
        :default-checked-keys="this.editRoleByIdArray"
        show-checkbox
        default-expand-all
        :data="editRoleForm"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleFormValidate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList } from "network/home";
import { addRoles } from "network/home";
import { changeRoles } from "network/home";
import { getChangeRolesById } from "network/home";
import { deleteRolesById } from "network/home";
import { deleteRoleRightById } from "network/home";
import { getRightsList } from "network/home";
import { editRoleRight } from "network/home";

export default {
  name: "Roles",
  data() {
    return {
      //角色列表
      rolesList: [],
      //添加角色弹框判断对象
      addDialogVisible: false,
      //添加角色对象
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      //添加修改角色对象
      changeRoleForm: {},

      //添加修改角色弹窗判断对象
      changeDialogVisible: false,

      //添加权限分配对象
      editRoleForm: {},

      //添加权限分配弹窗判断对象
      editRoleDialogVisible: false,

      //权限分配树形参数对象
      defaultProps: {
        children: "children",
        label: "authName"
      },

      //权限分配勾选id数组
      editRoleByIdArray: [],

      // 当前即将分配权限的角色id
      roleId: "",

      //添加角色校验规则
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },

      //添加修改角色校验规则
      changeFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //提交添加角色并进行预校验
    rolseFormValidate() {
      this.$refs.addRoleFormRef.validate(boolean => {
        if (!boolean) return;
        //预校验通过 发起添加角色网络请求
        this.addRole(this.addRoleForm);
        //关闭弹窗
        this.addDialogVisible = false;
      });
    },
    //监听添加角色弹窗是否关闭 关闭时重置表单数据
    addDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },

    //监听修改角色按钮 点击弹出修改角色弹窗
    showChangeDialogVisible(roleId) {
      //获取数据并绑定到changeRoleForm中
      this.getChangeRoles(roleId);
      // console.log(this.changeRoleForm);
      //打开弹窗进行数据渲染
      this.changeDialogVisible = true;
    },

    //提交修改角色并进行预校验
    changeFormValidate() {
      this.$refs.changeRoleFormRef.validate(boolean => {
        if (!boolean) return;
        //预校验通过 发起添加角色网络请求
        this.changeRole(this.changeRoleForm);
        //关闭弹窗
        this.changeDialogVisible = false;
      });
    },

    //监听修改角色弹窗 关闭时重置表单数据
    changeDialogClosed() {
      this.$refs.changeRoleFormRef.resetFields();
    },

    //删除角色
    removeRoleById(roleId) {
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //用户点击了确定按钮:
          //进行删除用户操作
          this.removeRole(roleId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //删除角色权限
    removeRoleRight(roleId, RithtId) {
      this.$confirm("此操作将删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //用户点击了确定按钮:
          //进行删除用户操作
          this.removeRoleRights(roleId, RithtId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //显示权限分配弹窗并初始化数据
    showEditRoleDialogVisible(role) {
      //即将分配权限的角色id
      this.roleId = role.id;
      console.log(this.roleId);
      //获取权限列表
      this.getRithts("tree");
      //获取列表中所拥有的权限id
      this.getLeafKeys(role, this.editRoleByIdArray);
      console.log(this.editRoleByIdArray);
    },

    //递归函数
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },

    //监听分配权限弹窗是否关闭
    editRoleDialogClosed() {
      //弹窗关闭 清空默认选中对象
      this.editRoleByIdArray = [];
    },

    //提交修改的角色权限
    editRoleFormValidate() {
      this.editRoleByIdArray = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      console.log(this.editRoleByIdArray);
      this.editRoleRights(this.roleId, this.editRoleByIdArray.join(","));
    },

    /**
     * 网络请求相关方法
     */
    //获取角色列表
    getRoles() {
      getRolesList().then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("获取权限列表失败!ERR:" + res.meta.msg);
        //将获取的权限列表数据赋值给rightsList
        console.log(res);
        this.rolesList = res.data;
      });
    },
    //添加角色
    addRole(role) {
      addRoles(role.roleName, role.roleDesc).then(res => {
        if (res.meta.status !== 201)
          return this.$message.error("添加角色失败!ERR:" + res.meta.msg);
        this.$message.success("添加角色成功!");
        //刷新角色列表
        this.getRoles();
      });
    },

    //通过id获取即将修改角色数据
    getChangeRoles(id) {
      getChangeRolesById(id).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("获取该角色数据失败!ERR:" + res.meta.msg);
        // console.log(res);
        this.changeRoleForm = res.data;
      });
    },
    //提交修改角色
    changeRole(role) {
      changeRoles(role.roleId, role.roleName, role.roleDesc).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("修改角色失败!ERR:" + res.meta.msg);
        this.$message.success("修改角色成功!");
        //刷新角色列表
        this.getRoles();
      });
    },
    //删除角色
    removeRole(roleId) {
      deleteRolesById(roleId).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("修改角色失败!ERR:" + res.meta.msg);
        this.$message.success("修改角色成功!");
        //刷新用户列表
        this.getRoles();
      });
    },
    //删除角色权限
    removeRoleRights(role, rightId) {
      deleteRoleRightById(role.id, rightId).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("修改角色失败!ERR:" + res.meta.msg);
        this.$message.success("修改角色成功!");
        //刷新用户列表
        role.children = res.data;
      });
    },

    //获取树形角色权限
    getRithts(type) {
      getRightsList(type).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("获取角色权限失败!ERR:" + res.meta.msg);
        this.editRoleForm = res.data;
        console.log(this.editRoleForm);
        this.$message.success("获取角色权限成功!");
        //显示弹窗
        this.editRoleDialogVisible = true;
      });
    },
    //角色权限授权
    editRoleRights(roleId, rids) {
      editRoleRight(roleId, rids).then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("角色权限授权失败!ERR:" + res.meta.msg);
        this.$message.success("角色权限授权成功!");
        //刷新列表
        this.getRoles();
        //关闭弹窗
        this.editRoleDialogVisible = false;
      });
    }
  },
  created() {
    this.getRoles();
  }
};
</script>

<style lang="less" scoped>
.addButton {
  margin: 15px 0;
}

.cloExpand {
  text-align: left !important;
}

.Tag_margin {
  margin: 7px;
}

.border_top {
  border-top: 1px solid #eee;
}

.border_btm {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
