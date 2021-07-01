<template>
  <wrapper>
    <el-form ref="loginForm" :model="form" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <el-form-item prop="mobile">
        <span class="svg-container">
          <i class="el-icon-mobile-phone" />
        </span>
        <el-select v-model="form.region" placeholder="+86" style="flex: 1 0 5em;">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
        <el-input
          ref="mobile"
          v-model="form.mobile"
          placeholder="手机号"
          type="text"
          auto-complete="off"
          style="flex: 1 1 100%;"
        />
      </el-form-item>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <i class="el-icon-unlock" />
        </span>
        <el-input v-model="form.code" placeholder="验证码" style="flex: 1" />
        <el-button type="primary" @click.prevent="getCode">
          {{ formattedCountdown }}
        </el-button>
      </el-form-item>

      <div style="margin: 2em 0; height: 100px;">
        <div class="declare">
          登录/注册即代表同意<a href="">《用户服务条款》</a>与<a href="">《隐私协议》</a>
        </div>

        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">登录</el-button>
      </div>

    </el-form>
  </wrapper>
</template>

<script>
// import request from '@/utils/request'
// import { validUsername } from '@/utils/validate'
import Wrapper from './wrapper'

export default {
  name: 'SMSLogin',
  components: {
    Wrapper
  },
  data() {
    return {
      form: {
        region: null,
        mobile: null,
        code: null
      },
      loginRules: {
        region: [{ required: true, trigger: 'blur' }],
        mobile: [{ required: true, trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      countdown: 0,
      countHandler: null,
      redirect: undefined
    }
  },
  computed: {
    formattedCountdown() {
      return (this.countdown > 0 ? this.countdown : '獲取驗證碼')
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
  mounted() {},
  methods: {
    getCode() {
      if (this.countdown > 0) {
        return
      }
      // TODO: AJAX request to send the SMS code

      this.countdown = 60
      this.startCount()
    },
    startCount() {
      if (this.countHandler) {
        clearInterval(this.countHandler)
        this.countHandler = null
      }

      this.countHandler = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown -= 1
        }
      }, 1000)
    },
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.form).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
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

<style>
  .login-container .el-input {
    width: auto;
  }
</style>
