<template>
  <div>
    <p-nav style="margin-bottom: 3em;" :index="$route.path" />

    <el-form v-if="!loading" ref="dataForm" :model="form" label-width="80px">

      <el-form-item label="头像">
        <avatar-uploader />
      </el-form-item>

      <el-form-item label="学号" prop="username">
        <el-input v-model="form.studentNumber" placeholder="学号" disabled />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="用户名" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio v-model="form.gender" :label="1">男生</el-radio>
        <el-radio v-model="form.gender" :label="2">女生</el-radio>
      </el-form-item>

      <el-form-item label="手机">
        <el-input v-model="form.mobile" />
      </el-form-item>

      <el-form-item label="电话">
        <el-input v-model="form.phone" />
      </el-form-item>

      <el-form-item label="电邮">
        <el-input v-model="form.email" />
      </el-form-item>

      <el-form-item label="微信" prop="wxOpenId">
        <el-input v-if="form.wxOpenid != null" v-model="form.wxOpenid" disabled />
        <el-button v-else type="primary" size="small" @click="openQRCode">{{ operationName }}</el-button>
        <div>重新绑定需联系班主任进行重置</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 微信登陆二维码 -->
    <el-dialog title="绑定微信" :visible.sync="delVisible" width="340px">
      <div style="width: 300px;height: 250px; position:relative;">
        <el-image
          style="width: 220px; height: 220px;margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0; "
          :src="ticket"
          :lazy="true"
          fit="fill"
        />
      </div>
      <!--      <wxlogin
        :appid="appid"
        :scope="scope"
        :theme="'black'"
        :redirect_uri="encodeURIComponent(redirect_uri+'?num=' + Math.ceil(Math.random() * 1000))"
        :href="href"
        style="width: 300px;height: 300px"
      />-->

    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { getCurrentUserInfo } from '@/api/system/user.js'
import { getQRCode } from '@/api/system/users.js'
import { update } from '@/api/system/user.js'
import PNav from './nav'
import AvatarUploader from './avatarUploader'

import { openWechatQRCode } from '@/views/users/utils'
import { getLocalStorageKeyValue } from '@/utils/auth'

import wxlogin from 'vue-wxlogin'
import { getToken } from '../../../utils/auth'

export default {
  components: {
    PNav,
    AvatarUploader,
    wxlogin
  },
  data() {
    return {
      userid: undefined,
      ticket: undefined,
      loading: true,
      operationName: '绑定微信',
      form: {},
      delVisible: false,
      appid: 'wx49bdbb228ac47a68',
      scope: 'snsapi_login',
      theme: 'black',
      redirect_uri: 'http://www.yanjiusen.com/#/homework/account/info',
      href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsNCiAgZGlzcGxheTogbm9uZTsNCn0NCi5pbXBvd2VyQm94IC5zdGF0dXMuc3RhdHVzX2Jyb3dzZXIgew0KICBkaXNwbGF5OiBub25lOw0KfQ0KLmltcG93ZXJCb3ggLnFyY29kZSB7DQogIGJvcmRlcjogbm9uZTsNCiAgd2lkdGg6IDIwMHB4Ow0KICBoZWlnaHQ6IDIwMHB4Ow0KfQ0KLmltcG93ZXJCb3ggLnN0YXR1c3sNCiAgZGlzcGxheTogbm9uZQ0KfQ=='
    }
  },
  watch: {
    '$route.query'(newVal, oldVal) {
      const userTokenjson = getLocalStorageKeyValue('user')
      if (userTokenjson !== null) {
        const userToken = JSON.parse(userTokenjson)
        newVal.id = userToken.id
      }
      if (newVal.code) {
        this.$store.dispatch('user/wxlogin', newVal).then(() => {
          this.delVisible = false
          this.$router.go(0)
          // this.$router.push({ path: '/homework/account/info' })
        })
        this.operationName = '已绑定'
      }
    }
  },
  created() {

  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  mounted() {
    this.bindWeChat()
    this.loadData()
  },
  methods: {
    wxLogin() {
      const that = this
      that.timer = setInterval(function() {
        that.$store.dispatch('user/checkLoginQr', that.code + ',' + that.userid).then(response => {
          if (response.success && response.data !== null && response.data) {
            clearInterval(that.timer)
            clearInterval(that.timerDate)
            that.delVisible = false
            that.$router.go(0)
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
      }, 1000)
    },
    async getCode() {
      const that = this
      this.code = this.createCode()
      const res = await getQRCode(this.code + ',' + that.userid)
      if (res.success && res.data != null && res.data.ticket !== null) {
        this.ticket = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.data.ticket
        that.timerDate = setInterval(function() {
          clearInterval(that.timerDate)
          that.getCode()
        }, res.data.expire_seconds * 1000)
        clearInterval(this.timer)
        this.wxLogin()
      }
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
    async openQRCode() {
      /*      console.log(this.$router.path)
      openWechatQRCode('http://www.yanjiusen.com/#/homework/account/info')*/
      if (this.ticket === undefined) {
        await this.getCode()
      }
      this.delVisible = true
    },
    async bindWeChat() {
      if (this.$route.query.code) {
        console.log('-- code', this.$route.query.code)
        const res = update({ wechatCode: this.$route.query.code })
        if (res.success) {
          this.$store.dispatch('user/getInfo')
        }
      }
    },
    async onSubmit() {
      const res = await update(this.form)

      if (res.success) {
        this.$store.dispatch('user/getInfo')
        this.$notify({
          title: '成功',
          message: '资料已变更',
          type: 'success',
          duration: 2000
        })
      } else {
        this.$notify({
          title: '出问题啦',
          message: '资料未变更',
          type: 'error',
          duration: 2000
        })
      }
    },
    async loadData() {
      this.loading = true
      // refresh the user info for editing
      const res = await getCurrentUserInfo()
      this.userid = res.data.id
      if (!res.data.wxOpenid) {
        this.$message.error('请先绑定微信，并关注公众号后登陆！')
      } else if (res.data.isWx === '0') {
        this.$message.error('请先关注公众号，关注公众号后登陆！')
      }
      // console.log(res.data)
      // let { data } = res
      Vue.set(this, 'form', { ...res.data })

      this.loading = false
    }
  }
}
</script>
