<template>
  <div class="login-container">
    <el-container class="logo-wrapper" style="justify-content: center;">
      <div class="site-logo">荣景</div>
    </el-container>

    <div class="card">
      <div class="top-nav">
        <router-link to="/login" class="el-button el-button--text">密码登录</router-link>
<!--        <router-link to="/reg" class="el-button el-button&#45;&#45;text">注册账号</router-link>-->
        <!-- <router-link v-else to="/smslogin" class="el-button el-button--text el-button--small">短信登录</router-link> -->
      </div>

      <slot />

      <div class="third-icons">
        <!-- <router-link v-if="$route.path != '/wxlogin'" to="/wxlogin" class="el-button el-button--text el-button--small">微信登入</router-link> -->
        第三方登录：
        <router-link to="/wx" class="el-button el-button--text"><i class="fa fa-weixin" /></router-link>
      </div>
    </div>

    <div style="width:333px;margin:0 auto; padding:20px 0;">
      Copyright ©2021-2022 荣景茶业合作联社 <a href="https://beian.miit.gov.cn/" target="_blank">闽ICP备15006570号</a>
    </div>
  </div>
</template>

<script>
// import iconPicker from 'vue-fontawesome-elementui-icon-picker'

// import UserLogin from '@/views/login/users/login'
// import SMSLogin from '@/views/login/users/sms'
// import UserReg from '@/views/login/users/reg'
// import Wx from '@/views/login/users/wx'

// const cMapping = {
//   'login': 'user-login',
//   'sms': 'sms-login',
//   'wxlogin': 'wx',
//   'reg': 'user-reg'
// }

export default {
  name: 'Login',
  components: {
  },
  data() {
    return {
      icon: 'plus'
    }
  },
  computed: {
    // cName() {
    //   return cMapping[this.card]
    // }
  },

  mounted() {

  },
  methods: {
    openQRCode() {
      /*      console.log(this.$router.path)
      openWechatQRCode('http://www.yanjiusen.com/#/homework/account/info')*/
    }
    // openWechatLogin() {
    //   const appid = 'wx49bdbb228ac47a68'
    //   // const redirect_uri = encodeURIComponent(window.location.origin + '/#/wxlogin') // vue中重定向的页面/#/authredirect'
    //   const redirect_uri = encodeURIComponent('http://www.yanjiusen.com/#/wxlogin')
    //   const url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_login#wechat_redirect'
    //   // window.open(url, '微信登录', 'width=450,height=450')
    //   window.open(url, '_blank')
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
}

/* reset element-ui css */
.login-container {
  .el-input {
    width: auto;
    flex: 1;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      line-height: initial;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }

    input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #999;
      opacity: 1; /* Firefox */
    }
  }

  .el-form-item {
    border-radius: 5px;
    color: #454545;

    background: transparent;
    border: 1px solid #ccc;

    margin-bottom: 10px;
  }

  .el-form-item__content {
    line-height: 26px;
    display: flex;
    align-items: center;
  }
  .third-icons {
    margin-top: -3em;
    color: #9b9b9b;
  }
  .third-icons > button {
    background: rgb(7, 193, 96);;
    color: rgb(255, 255, 255);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-size: 16px;
    padding: 0;
  }
  .third-icons > button:hover {
    background: rgb(7, 193, 96);
    color: rgb(255, 255, 255);
  }
}
</style>

<style lang="scss">
$bg:#83ccd2;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  padding-top: 6em;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<style>
  * {
    box-sizing: border-box;
  }

  .top-nav {
    position: absolute;
    width: 100%;
    left: 0;
    margin-top: -.5em;
    text-align: right;
  }

  .site-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 90px;
    height: 90px;
    background: #409EFF;
    border-radius: 20px;
    color: rgba(255,255,255,.9);
    font-size: 2.5em;
    font-weight: bold;
    position: relative;
    overflow: hidden;

    transition: all .2s;
  }

  /* .card.reg .site-logo {
    width: 64px;
    height: 64px;
    font-size: 1.2em;
  } */

  .site-logo:before {
    content: ' ';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 50%;
    opacity: .2;
    transform: scale(2) translateY(-50%);
  }

  .card {
    position: relative;
    width: 320px;
    min-height: 360px;

    max-width: 800px;
    overflow: hidden;
    margin: 2em auto;
    background-image: linear-gradient(to top, #409EFF 0%, #e7f0fd 100%);
    position: relative;
    padding: 1em;
    border-radius: 4px;
    box-shadow: 0 10px 10px #043e54;
  }

  .card > * {
    position: relative;
    z-index: 10;
  }

  .card:before {
    content: ' ';
    width: 200%;
    height: 200%;
    position: absolute;
    top: -25%;
    margin-left: -50%;
    margin-top: -75%;
    border-radius: 35% 55%;
    background: #fff;
    opacity: .8;
    animation: wave 15s infinite linear;
  }

  .card:after {
    content: ' ';
    width: 200%;
    height: 200%;
    position: absolute;
    top: -25%;
    margin-left: -50%;
    margin-top: -75%;
    border-radius: 55% 35%;
    background: #fff;
    opacity: .5;
    animation: wave 15s infinite linear;
  }

  .declare {
    text-align: center;
    font-size: smaller;
    color: #333;

    margin-bottom: 1em;
  }

  @keyframes wave {
    from { transform: rotate(0deg);}
    from { transform: rotate(360deg);}
  }

  @media (max-width: 800px) {
    . login-container {
      background: #e7f0fd;
      padding-top: 3em;

      display: flex;
      flex-direction: column;
    }
    .login-container > * {
      flex: 1;
    }
    .logo-wrapper {
      flex: 0 0 5em;
    }
    .card {
      /* min-height: 100vh; */
      /* min-height: 460px; */
      width: 100%;
      margin: 0;
      margin-top: 2em;
      border-radius: 0;
    }

    .card:before,
    .card:after {
      margin-top: -80%;
    }
  }
  .footer-sign{
    clear: both;
    display: block;
    text-align: center;
    margin: 0px auto;
    position: absolute;
    bottom: 100px;
    width: 100%;
    color: white;
  }
</style>
