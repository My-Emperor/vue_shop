<template>
  <div>
    <!--    面包屑区域-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    用户卡片-->
    <el-card>
      <!--      搜索框-->
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUser"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUser"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户
          </el-button>
          <!--         添加用户弹窗-->
          <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
          >
            <!--            弹窗主体内容-->
            <el-form
              ref="addUserFormRef"
              :rules="addFormRules"
              :model="addUserForm"
              label-width="70px"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addUserForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addUserForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUserForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addUserForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="userFormValidate"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!--    用户表格-->
      <el-table border stripe :data="users.userList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!--          作用域插槽 scope.row获取的是当前作用域的属性对象,即userList对象-->
            <!--          {{scope.row}}-->
            <el-switch
              v-model="scope.row.mg_state"
              @change="putUserState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column width="300px" label="操作">
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
                @click="showChangeDialogVisible(scope.row.id)"
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
                type="success"
                icon="el-icon-delete"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-share"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--修改弹窗-->
      <el-dialog
        title="修改用户"
        :visible.sync="changeDialogVisible"
        width="50%"
        @close="changeDialogClosed"
      >
        <!--弹窗主体内容-->
        <el-form
          ref="changeUserFormRef"
          :rules="changeFormRules"
          :model="changeUserForm"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="changeUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="changeUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="changeUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="changeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeFormValidate"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!--    分页条-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="users.total"
      >
      </el-pagination>
    </el-card>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from "network/home";
import { addUser } from "network/home";
import { changeUserState } from "network/home";
import { getChangeUserById } from "network/home";
import { changeUser } from "network/home";
import { deleteUser } from "network/home";
import { getRolesList } from "network/home";
import { asRoleToUser } from "network/home";

import { User } from "network/home";

export default {
  name: "Users",
  data() {
    //添加用户表单自定义规则对象
    var emailRule = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      //test() 方法用于检测一个字符串是否匹配某个模式.
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };

    var mobileRule = (rule, value, callback) => {
      // 验证手机的正则表达式
      const regmobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regmobile.test(value)) {
        // 合法的邮箱
        return callback();
      }
      callback(new Error("请输入合法的手机"));
    };

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      //用户列表
      users: {},
      //添加用户窗口flag
      addDialogVisible: false,
      //添加用户表单对象
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: "",

      //添加用户表单规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          },
          { validator: emailRule, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: mobileRule, trigger: "blur" }
        ]
      },

      //修改用户表单规则对象
      changeFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          },
          { validator: emailRule, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: mobileRule, trigger: "blur" }
        ]
      },

      //修改用户窗口flag
      changeDialogVisible: false,
      //修改用户表单对象
      changeUserForm: {}
    };
  },
  methods: {
    //监听pagesize改变的事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      //改变页码后重新请求数据
      this.getUser();
    },
    //监听页码值改变的事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getUser();
    },

    //监听关闭添加用户弹框
    addDialogClosed() {
      //关闭时重置添加用户表单数据
      this.$refs.addUserFormRef.resetFields();
    },

    //添加用户点击确定按钮时进行预校验
    userFormValidate() {
      this.$refs.addUserFormRef.validate(boolean => {
        if (!boolean) return;
        //校验通过 发起网络请求进行添加用户操作
        console.log(this.addUserForm);
        this.addUsers(this.addUserForm);
        //添加成功 关闭弹窗
        this.addDialogVisible = false;
        //重新获取并刷新用户列表
        this.getUser();
      });
    },

    //监听修改用户按钮获取数据并弹窗
    showChangeDialogVisible(userId) {
      this.getChangeUsers(userId);
      //获取数据成功后进行弹窗
      this.changeDialogVisible = true;
    },

    //修改用户点击确定按钮时进行预校验
    changeFormValidate() {
      this.$refs.changeUserFormRef.validate(boolean => {
        if (!boolean) return;
        //校验通过 发起网络请求进行修改用户操作
        this.changeUsers(this.changeUserForm);
        //添加成功 关闭弹窗
        this.changeDialogVisible = false;
        //重新获取并刷新用户列表
        this.getUser();
      });
    },

    changeDialogClosed() {
      //关闭时重置添加用户表单数据
      this.$refs.changeUserFormRef.resetFields();
    },

    //删除用户
    removeUserById(userId) {
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //用户点击了确定按钮:
          //进行删除用户操作
          this.removeUser(userId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 展示分配角色的对话框
    setRole(userInfo) {
      this.userInfo = userInfo;

      // 在展示对话框之前，获取所有角色的列表
      this.getRoles();
    },
    // 点击按钮，分配角色
    saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色！");
      }
      console.log(this.users);
      this.asRoleToUsers(this.userInfo.id, this.selectedRoleId);
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },

    /**
     * 网络请求相关方法
     */
    //获取用户数据
    getUser() {
      getUserList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      )
        .then(res => {
          // console.log(res)
          if (res.meta.status !== 200)
            return this.$message.error("用户列表获取错误 ERR:" + res.meta.msg);
          //赋值用户数据
          this.users = new User(
            res.data.users,
            res.data.total,
            res.data.pagenum
          );
          // console.log(this.users)
        })
        .catch(rej => {
          console.log(rej);
        });
    },

    //提交用户状态
    putUserState(userinfo) {
      //利用模板字符串``拼接参数
      changeUserState(userinfo.id, userinfo.mg_state)
        .then(res => {
          if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state;
            return this.$message.error("更新用户状态失败！ERR:" + res.meta.msg);
          }
          this.$message.success("更新用户状态成功！");
        })
        .catch();
    },

    //添加用户数据
    addUsers(userForm) {
      addUser(
        userForm.username,
        userForm.password,
        userForm.email,
        userForm.mobile
      )
        .then(res => {
          if (res.meta.status !== 201)
            return this.$message.error("添加用户失败! ERR:" + res.meta.msg);
          this.$message.success("添加用户成功");
        })
        .catch(rej => {
          console.log(rej);
        });
    },

    // //获取修改用户数据
    getChangeUsers(userId) {
      getChangeUserById(userId)
        .then(res => {
          if (res.meta.status !== 200)
            return this.$message.error("获取用户信息失败! ERR:" + res.meta.msg);
          this.changeUserForm = res.data;
          this.$message.success("获取用户信息成功");
        })
        .catch();
    },

    //修改用户数据
    changeUsers(user) {
      changeUser(user.id, user.email, user.mobile)
        .then(res => {
          console.log(res);
          if (res.meta.status !== 200)
            return this.$message.error("修改用户数据失败! ERR:" + res.meta.msg);
          this.$message.success("修改用户信息成功");
        })
        .catch();
    },

    //删除用户
    removeUser(userId) {
      deleteUser(userId)
        .then(res => {
          if (res.meta.status !== 200)
            return this.$message.error("删除用户失败! ERR:" + res.meta.msg);
          //提示成功信息
          this.$message.success("删除用户成功!");
          //重新刷新用户列表
          this.getUser();
        })
        .catch();
    },

    //获取角色列表
    getRoles() {
      getRolesList().then(res => {
        if (res.meta.status !== 200)
          return this.$message.error("获取角色列表失败!ERR:" + res.meta.msg);
        //将获取的权限列表数据赋值给rightsList
        this.$message.success("获取角色列表成功！");
        this.rolesList = res.data;
        console.log(111);
        this.setRoleDialogVisible = true;
      });
    },

    //赋值角色给用户
    asRoleToUsers(id, rid) {
      asRoleToUser(id, rid).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("更新角色失败！!ERR:" + res.meta.msg);
        }
        this.$message.success("更新角色成功！");
        this.getUser();
        this.setRoleDialogVisible = false;
      });
    }
  },

  created() {
    this.getUser();
  }
};
</script>

<style lang="less" scoped>
.el-input {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>
