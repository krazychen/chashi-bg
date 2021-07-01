<template>
  <wrapper>
    <div style="width: 300px;height: 280px; position:relative;">
      <el-image
        style="width: 220px; height: 220px;margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0; "
        :src="ticket"
        fit="fill"
        :class="show?'classShwo':''"
      />
    </div>

    <!--    <wxlogin
      :appid="appid"
      :scope="scope"
      :theme="'black'"
      :redirect_uri="encodeURIComponent(redirect_uri+'?num=' + Math.ceil(Math.random() * 1000))"
      :href="href"
      style="width: 300px;height: 300px"
    />-->
  </wrapper>
</template>

<script>
import Wrapper from './wrapper'
import wxlogin from 'vue-wxlogin'
import { getTokenKeyValue } from '@/utils/auth'
import { getQRCode, checkLoginQr } from '@/api/system/users'

export default {
  name: 'Wx',
  components: {
    Wrapper,
    wxlogin
  },
  data() {
    return {
      show: true,
      code: undefined,
      ticket: '',
      delVisible: false,
      appid: 'wx49bdbb228ac47a68',
      scope: 'snsapi_login',
      theme: 'black',
      redirect_uri: 'http://www.yanjiusen.com/#/wx',
      href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsNCiAgZGlzcGxheTogbm9uZTsNCn0NCi5pbXBvd2VyQm94IC5zdGF0dXMuc3RhdHVzX2Jyb3dzZXIgew0KICBkaXNwbGF5OiBub25lOw0KfQ0KLmltcG93ZXJCb3ggLnFyY29kZSB7DQogIGJvcmRlcjogbm9uZTsNCiAgd2lkdGg6IDIwMHB4Ow0KICBoZWlnaHQ6IDIwMHB4Ow0KfQ0KLmltcG93ZXJCb3ggLnN0YXR1c3sNCiAgZGlzcGxheTogbm9uZQ0KfQ=='

    }
  },
  watch: {
    '$route.query'(newVal, oldVal) {
      if (newVal.code) {
        this.$store.dispatch('user/wxlogin1', newVal).then(res => {
          this.$router.push({ path: '/' })
        })
      }
    },
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  created() {
    this.$nextTick(() => {
      this.getCode()
    })
  },
  mounted() {
    const iswx = getTokenKeyValue('iswx') === 'true'
    if (iswx) {
      this.delVisible = true
    }
  },
  methods: {
    wxLogin() {
      const that = this
      that.timer = setInterval(function() {
        that.$store.dispatch('user/checkLoginQr', that.code).then(response => {
          if (response.success && response.data !== null && response.data) {
            that.$router.push({ path: '/' })
          } else {
            if (response.msg !== '120') {
              if (response.msg === '110') {
                that.$message.error('此微信已有绑定过的账号，请解绑后再试')
              } else {
                that.$message.error(response.msg)
              }
            }
          }
        })
      }, 2000)
    },
    createCode() {
      let code = ''
      var codeLength = 10// 验证码的长度
      var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')// 随机数
      for (var i = 0; i < codeLength; i++) {
        // 循环操作
        var index = Math.floor(Math.random() * 36)// 取得随机数的索引（0~35）
        code += random[index]// 根据索引取得随机数加到code上
      }
      return code// 把code值赋给验证码
    },
    async getCode() {
      this.code = this.createCode()
      const res = await getQRCode(this.code)
      if (res.success && res.data != null) {
        this.show = false
        this.ticket = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.data.ticket
        this.wxLogin()
      }
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

<style scoped>

  /deep/ .classShwo .el-image__error{
    display: none;
  }

</style>
