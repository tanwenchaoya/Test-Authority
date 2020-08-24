<template>
  <div id="login">
   <div class="login-box">
     <div class="portrait-head">
       <input type="file" @change="upPortraitHead" ref="inputImage">
       <img :src="portraitHead" alt="" class="head-image" ref="head-image">
     </div>
     <el-form class="form" :model = 'loginForm' :rules="loginFormRules" ref="loginFormRef">
       <el-form-item prop="name">
         <el-input prefix-icon="iconfont icon-nickname" v-model="loginForm.name"></el-input>
       </el-form-item>
       <el-form-item prop="password">
         <el-input prefix-icon="iconfont icon-locking" v-model="loginForm.password" type="password"></el-input>
       </el-form-item>
       <el-form-item>
         <el-button type="success" @click="checkLoginForm">登录</el-button>
         <el-button type="info" @click="resetLoginForm">重置</el-button>
       </el-form-item>
     </el-form>
   </div>
  </div>
</template>

<script>
import { login } from '../api/index'
export default {
  name: 'Login',
  data () {
    return {
      portraitHead: '../assets/logo.png',
      loginForm: {
        name: '',
        password: ''
      },
      loginFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 上传头像
    upPortraitHead () {
      const file = this.$refs.inputImage.files[0]
      console.log(file)
      if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
          const img = this.$refs.head_image
          console.log(img)
          this.portraitHead = event.target.result
        }
      }
    },
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 检验表单并登录
    checkLoginForm () {
      this.$refs.loginFormRef.validate(async (flag) => {
        if (!flag) return
        const result = await login(this.loginForm)
        console.log(result);
        console.log(result);
        if (result.status !== 200) {
          this.$message.error('登录失败')
        } else {
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', result.token);
          window.sessionStorage.setItem('userName',this.loginForm.name);
          window.sessionStorage.setItem('sessionId',result.data[1]);
          window.sessionStorage.setItem('userId',result.data[2]);
          this.$router.push('/home')
        }
        console.log(result)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #login{
    /*background-color: #61649f;*/
    background-color: #B4EEFB;
    height: 100%;
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-box{
      height:300px;
      width: 450px;
      background-color: #fff;
      position: relative;
      border-radius: 15px;
      .portrait-head{
        height: 130px;
        width: 130px;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 0 10px #ddd;

        padding: 5px;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #61649f;
        input{
          opacity: 0;
          width: 100%;
          height: 100%;
        }
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          top: -100%;
        }
      }
      .form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transform: translateY(80px);
        input{
          font-size: 16px;
        }
      }
    }
  }
</style>
