<template>
  <wrapper>
    <el-form ref="regForm" :model="form" :rules="loginRules" class="reg-form" auto-complete="on" label-position="left">
      <el-form-item prop="phone">
        <el-input
          v-model="form.phone"
          autofocus
          placeholder="手机号"
        />
      </el-form-item>

      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          placeholder="用户名"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          v-model="form.password"
          :type="passwordType"
          placeholder="密码"
          auto-complete="off"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="code">
        <img v-if="image" :src="image" alt="code">

        <el-input
          ref="code"
          v-model="form.code"
          placeholder="请输入左侧图中的字符"
          name="code"
          type="text"
          auto-complete="off"
        />
        <el-input v-if="false" v-model="form.verifyToken" name="verifyToken" />
      </el-form-item>

      <div style="margin: 2em 0; height: 100px;">
        <div class="declare">
          登入/注册即代表同意<a href="">《用户服务条款》</a>与<a href="">《隐私协议》</a>
        </div>

        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleReg">注册</el-button>
      </div>
    </el-form>
  </wrapper>
</template>

<script>
import { regStudent } from '@/api/homework/student'
import request from '@/utils/request'
// import { validUsername } from '@/utils/validate'
import Wrapper from './wrapper'

export default {
  name: 'UserReg',
  components: {
    Wrapper
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error('Please enter the correct user name'))
      // } else {
      //   callback()
      // }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: null,
        password: null,
        phone: null,
        gender: null,
        code: null,
        verifyToken: null
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
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
  mounted() {
    this.getToken()
  },
  methods: {
    getToken() {
      return request({
        url: '/verificationCode/getBase64Image',
        method: 'get'
      }).then(res => {
        this.image = res.data.image
        this.form.verifyToken = res.data.verifyToken
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
    handleReg() {
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     this.$store.dispatch('user/login', this.loginForm).then(() => {
      //       this.$router.push({ path: this.redirect || '/' })
      //       this.loading = false
      //     }).catch(() => {
      //       this.loading = false
      //     })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
      regStudent(this.form).then(() => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style>
  @keyframes slideUp {
    from { transform: translateY(10%);}
    to { transform: translateY(0);}
  }
</style>
