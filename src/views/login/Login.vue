<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar-box">
        <img src="~assets/img/logo.png" alt="logo" />
      </div>
      <!--登录表单-->
      <el-form
        ref="loginFormRef"
        :rules="loginRules"
        :model="loginUser"
        class="login_form"
        label-width="0px"
      >
        <!--用户名输入框-->
        <el-form-item prop="username">
          <el-input
            v-model="loginUser.username"
            prefix-icon="iconfont icon-yonghu"
          ></el-input>
        </el-form-item>
        <!--密码输入框-->
        <el-form-item prop="password">
          <el-input
            v-model="loginUser.password"
            prefix-icon="iconfont icon-mima1"
            type="password"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="login_btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Login } from "network/login";

export default {
  name: "Login",
  data() {
    return {
      loginUser: {
        username: "as",
        password: "123"
      },
      loginRules: {
        //required 必填, message 提示信息, trigger 触发动作(点击 click /鼠标失去焦点 blur)
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ]
      },
      loginStatus: "100"
    };
  },
  methods: {
    resetLoginForm() {
      //this指向的是该组件的实例对象
      this.$refs.loginFormRef.resetFields();
    },

    login() {
      //该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个promise
      this.$refs.loginFormRef.validate(flag => {
        if (!flag) return;
        //校验通过 发送login网络请求
        Login(this.loginUser.username, this.loginUser.password)
          .then(res => {
            console.log(res);
            if (res.meta.status !== 200)
              return this.$message.error("用户名或密码错误");
            this.$message.success("登录成功");
            //登录成功 获取服务器中给出的token值 存到sessionStorage中
            window.sessionStorage.setItem("token", res.data.token);
            //跳转页面
            this.$router.push("/home");
          })
          .catch({
            // console.log(rej)
          });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  //登录盒子
  .login_box {
    //绝对定位将盒子固定到中间位置
    position: absolute;
    top: 50%;
    left: 50%;
    //移动自身宽高的一半
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;

    //logo
    .avatar-box {
      position: absolute;
      left: 50%;
      top: -65px;
      transform: translate(-50%, 0);
      padding: 6px;
      width: 130px;
      height: 130px;
      border: 1px solid #e0e0e0;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 10px #ddd;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #e0e0e0;
      }
    }

    //表单
    .login_form {
      position: absolute;
      bottom: 0px;
      padding: 0 20px;
      width: 100%;
      //按钮
      .login_btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
