<template>
  <div class="app-container">
    <p-nav v-if="state" style="margin-bottom: 3em;" :index="$route.path" />

    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" show-password />
      </el-form-item>
      <el-form-item label="再次输入" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updatePassword } from '@/api/system/user.js'
import PNav from './nav'
export default {
  components: {
    PNav
  },
  data() {
    return {
      state: true,
      form: {
        userId: 1, // should not post the user id!
        oldPassword: null,
        newPassword: null,
        confirmPassword: null
      },
      formRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, validator: this.newPasswordValidator, trigger: 'change' }],
        confirmPassword: [{ required: true, validator: this.confirmPasswordValidator, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'user'
    ])
  },
  created() {
    const state = this.$route.params.state
    if (state) {
      this.state = false
    }
  },
  methods: {
    newPasswordValidator(rule, value, callback) {
      if (!value) {
        callback(new Error('您的密码需由6~10位的数字、字母组成，请重新设置密码！'))
        return false
      }
      const val = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/
      console.log(value)
      console.log(value.match(val))
      if (value.match(val) !== null) {
        callback()
      } else {
        callback(new Error('您的密码需由6~10位的数字、字母组成，请重新设置密码！'))
      }
    },
    confirmPasswordValidator(rule, value, callback) {
      if (this.form.newPassword) {
        if (value === this.form.newPassword) {
          callback()
        } else {
          callback(new Error('密码不一致'))
        }
      } else {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else {
          callback()
        }
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updatePassword(this.form).then(res => {
            if (res.success && res.data != null && res.data) {
              this.$notify({
                title: '成功',
                message: '密码更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>
