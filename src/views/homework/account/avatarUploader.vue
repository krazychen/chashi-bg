<template>
  <div class="avatar-uploader">
    <div id="pick-avatar" class="el-upload">
      <img v-if="avatar" :src="avatar" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </div>
    <custom-avatar-cropper
      trigger="#pick-avatar"
      upload-form-name="head"
      :cropper-options="cropperOptions"
      :output-options="outputOptions"
      :upload-headers="uploadHeader"
      :upload-url="uploadActionUrl"
      @uploaded="handleAvatarSuccess"
    />
    <div>点击图片更换头像，支持 .jpg, .png 格式</div>
  </div>
</template>

<script>
import AvatarCropper from 'vue-avatar-cropper'
import { mapGetters } from 'vuex'

import Vue from 'vue'

const CustomAvatarCropper = Vue.extend({
  mixins: [AvatarCropper],
  methods: {
    submit() {
      this.cropper.getCroppedCanvas(this.outputOptions).toBlob(blob => {
        // console.log(blob)
        // console.log(blob.size)

        if (blob.size > 1024 * 1024) {
          // this.$emit('error', '上传文件大小不能超过 1MB!', 'user')
          this.$message.error('上传文件大小不能超过 1MB!')
        } else {
          this.uploadImage()
        }
        this.destroy()
      })
    }
  }
})

export default {
  components: {
    CustomAvatarCropper
  },
  data() {
    return {
      uploadActionUrl: '/sysUser/uploadHead'
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'avatar',
      'userInfo'
    ]),
    outputOptions() {
      return {
        maxWidth: 600,
        maxHeight: 600
      }
    },
    cropperOptions() {
      return {
        aspectRatio: 1,
        autoCropArea: 1,
        viewMode: 1,
        movable: false,
        zoomable: false,
        scalable: true,
        minContainerWidth: 300,
        minContainerHeight: 300
      }
    },
    uploadHeader() {
      return { token: this.token }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      if (res.success) {
        this.$store.dispatch('user/getInfo')
        this.$store.dispatch('users/getUserInfo', { userId: this.userInfo.id, force: true })
        this.$notify({ title: '成功', message: '资料已变更', type: 'success' })
      } else {
        this.$notify({ title: '出问题啦', type: 'error' })
      }
    }
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style>
  .avatar-cropper .avatar-cropper-container .avatar-cropper-footer .avatar-cropper-btn:hover {
    background: #409EFF;
    color: #fff;
  }
</style>
