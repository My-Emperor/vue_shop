<template>
  <div>
    <el-form
      ref="loginFormRef"
      :rules="loginRules"
      :model="loginUser"
      class="login_form"
      label-width="0px">
      <!--用户名输入框-->
      <el-form-item prop="username">
        <el-input
          v-model="loginUser.username"
          prefix-icon="iconfont icon-yonghu">
        </el-input>
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
</template>

<script>
  export default {
    name: "From_element",
    data(){
      return {
        loginUser:{
          username:"admin",
          password:"123456"
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
      }
    },
    methods:{
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
              this.$router.push('/home');
            })
            .catch({
              // console.log(rej)
            });
        });
      }
    },
    watch:{
      username:{
      
      },
      password:{
      
      }
    }
  }
</script>

<style lang="less" scoped>
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
</style>