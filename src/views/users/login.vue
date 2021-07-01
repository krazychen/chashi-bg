<template>
  <wrapper>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          type="text"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          autocomplete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="code">
        <img v-if="image" :src="image" alt="code" @click="getToken">

        <el-input
          ref="code"
          v-model="loginForm.code"
          placeholder="请输入左侧图中的字符"
          name="code"
          type="text"
          autocomplete="off"
          @keyup.enter.native="handleLogin"
        />
        <el-input v-if="false" v-model="loginForm.verifyToken" name="verifyToken" />
      </el-form-item>

      <div style="margin: 2em 0; height: 100px;">
        <div class="declare">
          登录/注册即代表同意<a href="">《用户服务条款》</a>与<a href="">《隐私协议》</a>
        </div>

        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">登录</el-button>

        <div style="text-align: right;">
          <el-button type="text">忘记密码？</el-button>
        </div>
      </div>

    </el-form>
  </wrapper>
</template>

<script>
import request from '@/utils/request'
// import { validUsername } from '@/utils/validate'
import Wrapper from './wrapper'
import { getTokenKeyValue, getLocalStorageKeyValue } from '@/utils/auth'
import { openWechatQRCode } from '@/views/users/utils'
export default {
  name: 'UserLogin',
  components: {
    Wrapper
  },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        code: null,
        verifyToken: null
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }], // validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      image: null,
      drawer: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  beforeCreate() {

  },
  mounted() {
    this.getToken()
  },
  methods: {
    reg() {
      this.$router.push('/students/new')
    },
    getToken() {
      return request({
        url: '/verificationCode/getBase64Image',
        method: 'get'
      }).then(res => {
        console.log(res)
        this.image = res.data.image
        this.loginForm.verifyToken = res.data.verifyToken
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            const data = JSON.parse(getLocalStorageKeyValue('user'))
            console.log(data.sysRoleList[0]['type'])
            console.log(data.sysRoleList[0].type)
            if (data) {
              const sysRoleList = data.sysRoleList
              let type = ''
              sysRoleList.forEach(function(a, b) {
                if (a.type === 'student') {
                  type = 'student'
                  return
                } else if (a.type === 'studentnowx') {
                  type = 'studentnowx'
                } else {
                  type = a.type
                  return
                }
              })
              if (type === 'studentnowx' || type === 'teachernowx') {
                if (data.iswx) {
                  this.$router.push({ path: '/wx' })
                } else {
                  this.$router.push({ path: '/homework/account/info' })
                }
              } else {
                this.$router.push({ path: this.redirect || '/' })
              }
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
