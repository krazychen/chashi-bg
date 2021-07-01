<template>
  <el-row>
    <el-col :span="24">
      <el-upload
        :disabled="!disp"
        class="upload-demo"
        :headers="myHeaders"
        :data="param"
        name="img"
        :action="url"
        :on-error="onError"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :before-remove="beforeHandleRemove"
        :on-remove="handleRemove"
        :on-success="uploadSuccess"
        :file-list="fileList"
        list-type="picture"
      >
        <i v-show="disp" class="el-icon-picture-outline" style="margin: 4px; width: 3%; float: left;line-height: 1.5;" title="只能上传png/jpg/jpeg/gif文件" /><div v-show="disp" style="width: 97%;text-align: center"><span style="color: red;">点击图标，将作业照片按顺序一张一张上传</span></div>
      </el-upload>

      <el-main>
        <el-button v-show="disp" class="subButton" @click.prevent="submitUpload">提交</el-button>
      </el-main>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'UploadAssembly',
  props: {
    myHeaders: {
      type: Object,
      default: null
    },
    param: {
      type: Object,
      default: null
    },
    fileList: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: 'img'
    },
    url: {
      type: String,
      default: ''
    },
    upState: {
      type: Boolean,
      default: false
    },
    beforeHandleRemove: {
      type: Function,
      default: null
    },
    onError: {
      type: Function,
      default: null
    },
    beforeUpload: {
      type: Function,
      default: null
    },
    submitUpload: {
      type: Function,
      default: null
    },
    dis: {
      type: Boolean,
      default: null
    }
  },
  data: function() {
    return {
      disp: this.dis
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit('handleRemove', file, fileList)
    },
    uploadSuccess(response, file, fileList) {
      this.$emit('uploadSuccess', response, file, fileList)
    },
    handlePreview(file) {
      this.$emit('handlePreview', file)
    }
  }
}
</script>

<style scoped>
  /deep/ .el-upload{
    width: 100%;
    border-bottom: 1px solid #c4c4c4;
    height: 38px;
    line-height: 38px;
    font-size: 20px;
    text-align: left;
    border-radius: 2px;
    float: left;
  }

  /deep/ .upload-demo{
    width: 84%;
    border: 1px solid #797979;
    min-height: 800px;
    margin-left: 8%;
    border-radius: 2px;
  }

  /deep/ .el-upload-list{
    width: 80%;
    margin-left: 10%;
    margin-top: 5%;
    margin-bottom: 5%;
    padding: 2%;
    border: 2px solid #797979;
    min-height:680px;
    border-radius: 2px;
  }
</style>
