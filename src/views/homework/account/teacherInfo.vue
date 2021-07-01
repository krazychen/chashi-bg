<template>
  <div class="app-container">
    <p-nav v-if="state" style="margin-bottom: 3em;" :index="$route.path" />
    <div v-else style="margin-top: 20px;" />

    <el-form v-if="!loading" ref="dataForm" :model="form" :rules="rules" label-width="150px" :style="{marginLeft:!state?'20px':'0px'}">

      <el-form-item label="头像">
        <avatar-uploader />
      </el-form-item>

      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="用户名" disabled :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio v-model="form.gender" :label="1" :disabled="dis">男生</el-radio>
        <el-radio v-model="form.gender" :label="0" :disabled="dis">女生</el-radio>
      </el-form-item>

      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="真实姓名" prop="fullName">
        <el-input v-model="form.fullName" placeholder="真实姓名" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="微信号" prop="wechatNumber">
        <el-input v-model="form.wechatNumber" placeholder="微信号" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="本科院校" prop="schoolName">
        <el-input v-model="form.schoolName" placeholder="本科院校" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="本科专业" prop="collegeName">
        <el-input v-model="form.collegeName" placeholder="本科专业" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="研究生院校" prop="graduateSchoolName">
        <el-input v-model="form.graduateSchoolName" placeholder="研究生院校" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="研究生入学时间" prop="graduateEntranceTime">
        <el-date-picker
          v-model="form.graduateEntranceTime"
          type="month"
          placeholder="研究生入学时间"
          style="width: 410px"
          value-format="yyyy-MM"
          :disabled="dis"
        />
      </el-form-item>

      <el-form-item label="研究生预计毕业时间" prop="graduationTime">
        <el-date-picker
          v-model="form.graduationTime"
          type="month"
          style="width: 410px"
          value-format="yyyy-MM"
          placeholder="研究生预计毕业时间"
          :disabled="dis"
        />
      </el-form-item>

      <el-form-item label="身份证号" prop="idNumber">
        <el-input v-model="form.idNumber" placeholder="身份证号" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="银行卡号" prop="bankCardNumber">
        <el-input v-model="form.bankCardNumber" placeholder="银行卡号" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>

      <el-form-item label="所属银行" prop="bankName">
        <el-input v-model="form.bankName" placeholder="所属银行" :disabled="dis" :style="!state?selectwidthz:{}" />
      </el-form-item>
      <el-form-item label="是否工作" prop="isWork">
        <el-select v-model="form.isWork" class="filter-item" placeholder="请选择是否工作" :style="!state?selectwidthz:{}">
          <el-option v-for="item in isWorks" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.isWork==='1'" label="工作单位" prop="workplace">
        <el-input v-model="form.workplace" placeholder="工作单位" :style="!state?selectwidthz:{}" type="text" maxlength="50" show-word-limit />
      </el-form-item>
      <!--      <el-form-item label="学号" prop="username">
        <el-input v-model="form.studentNumber" placeholder="学号" :disabled="dis" />
      </el-form-item>-->

      <el-form-item label="微信" prop="wxOpenId">
        <el-input v-if="form.wxOpenid != null" v-model="form.wxOpenid" disabled :style="!state?selectwidthz:{}" />
        <el-button v-else type="primary" size="mini" @click="openQRCode">{{ operationName }}</el-button>
        <div>重新绑定需联系班主任进行重置</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <!--<el-button v-if="!dis">取消</el-button>-->
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
import { getHwTeacherInfo, updateHwTeacherInfo } from '@/api/homework/teacher.js'
import { getQRCode } from '@/api/system/users.js'
import { update } from '@/api/system/user.js'
import PNav from './nav'
import AvatarUploader from './avatarUploader'
import { getDictDataList } from '@/utils/dictUtils'
import { getLocalStorageKeyValue } from '@/utils/auth'

import { validatePhone, isCardNo, checkBankNo } from '@/utils/validate'

import { mapGetters } from 'vuex'

export default {
  components: {
    PNav,
    AvatarUploader
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    selectwidthz() {
      return {
        width: '410px'
      }
    }
  },
  data() {
    return {
      userid: undefined,
      ticket: undefined,
      loading: true,
      operationName: '绑定微信',
      dis: false,
      state: true,
      isWorks: [],
      form: {
        isWork: undefined,
        workplace: undefined,
        nickname: undefined,
        gender: 1,
        phone: undefined,
        fullName: undefined,
        wechatNumber: undefined,
        schoolName: undefined,
        collegeName: undefined,
        graduateSchoolName: undefined,
        graduateEntranceTime: undefined,
        graduationTime: undefined,
        idNumber: undefined,
        bankCardNumber: undefined
      },
      delVisible: false,
      appid: 'wx49bdbb228ac47a68',
      scope: 'snsapi_login',
      theme: 'black',
      redirect_uri: 'http://www.yanjiusen.com/#/homework/account/info',
      href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsNCiAgZGlzcGxheTogbm9uZTsNCn0NCi5pbXBvd2VyQm94IC5zdGF0dXMuc3RhdHVzX2Jyb3dzZXIgew0KICBkaXNwbGF5OiBub25lOw0KfQ0KLmltcG93ZXJCb3ggLnFyY29kZSB7DQogIGJvcmRlcjogbm9uZTsNCiAgd2lkdGg6IDIwMHB4Ow0KICBoZWlnaHQ6IDIwMHB4Ow0KfQ0KLmltcG93ZXJCb3ggLnN0YXR1c3sNCiAgZGlzcGxheTogbm9uZQ0KfQ==',
      rules: {
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: validatePhone }],
        fullName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        wechatNumber: [{ required: true, message: '请输入微信号', trigger: 'blur' }],
        schoolName: [{ required: true, message: '请输入本科院校', trigger: 'blur' }],
        collegeName: [{ required: true, message: '请输入本科专业', trigger: 'blur' }],
        graduateSchoolName: [{ required: true, message: '请输入研究生院校', trigger: 'blur' }],
        graduateEntranceTime: [{ required: true, message: '请输入研究生入学时间', trigger: 'blur' }],
        graduationTime: [{ required: true, message: '请输入研究生预计毕业时间', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入身份证号', trigger: 'blur' }, { validator: isCardNo }],
        isWork: [{ required: true, message: '请选择是否工作', trigger: 'blur' }],
        workplace: [{ required: true, message: '请输入工作单位', trigger: 'blur' }],
        bankCardNumber: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }, { validator: checkBankNo }]
      }
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
    this.isWorks = getDictDataList('hw_teacher_is_work')
    const state = this.$route.params.state
    if (state) {
      this.state = false
    }
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
            const data = JSON.parse(getLocalStorageKeyValue('user'))
            const sysRoleList = data.sysRoleList
            if (sysRoleList && sysRoleList[0]) {
              if (sysRoleList[0].type === 'leve2teacher' || sysRoleList[0].type === 'leve1teacher') {
                window.location.href = '/'
              } else {
                that.$router.go(0)
              }
            }
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
      if (!this.dis) {
        this.$message.error('请先更新资料')
        return false
      }
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
      if (!this.userInfo.avatar) {
        this.$message.error('请上传头像')
        return false
      }
      let flag = false
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          flag = valid
        }
      })
      if (flag) {
        const res = await updateHwTeacherInfo(this.form)
        if (res.success) {
          this.dis = true
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
      }
    },
    async loadData() {
      this.loading = true
      // refresh the user info for editing
      const res = await getHwTeacherInfo()
      this.userid = res.data.id
      this.dis = res.data.isUpdate === '0'
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
