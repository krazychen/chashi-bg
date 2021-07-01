<template>
  <div class="assignment">
    <el-row class="subjectrow">
      <el-col :span="24">
        <span class="subject">
          题目: {{ dangqian.groupName?(dangqian.groupName+"-"+dangqian.subjectName):dangqian.subjectName }}
        </span>
      </el-col>
    </el-row>

    <el-row>
      <el-col class="cols" :span="8">作业状态: {{ dangqian.subState }}</el-col>
      <el-col class="cols" :span="8">题型: {{ dangqian.subjectTypeName }}</el-col>
      <el-col class="cols" :span="8">提交截止时间： {{ dangqian.endTime }}</el-col>
    </el-row>
    <el-row>
      <el-col class="cols" :span="8">班级: {{ dangqian.className }}</el-col>
      <el-col class="cols" :span="8">学号: {{ dangqian.studentNumber }}</el-col>
      <el-col class="cols" :span="8">昵称: {{ dangqian.nickName }}</el-col>
    </el-row>
    <el-row>
      <!--<el-col class="cols" :span="8">批改截止时间: {{ dangqian.auditEndTime }}</el-col>-->
      <el-col class="cols" :span="8">批改人： {{ dangqian.teacherName }} </el-col>
      <el-col v-if="dangqian.repeatTeacherName !=='尚未审核'" class="cols" :span="8">审核人： {{ dangqian.repeatTeacherName }}</el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col class="cols" :span="24">
        <span class="complete">
          作业说明：{{ this.unescape(dangqian.completeExplain) }}
        </span>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="cols" :span="24">
        补充材料：<a v-for="item in dangqian.list" :underline="false" style="margin-right: 10px;color: #02A7F0" @click="download(item.id)">{{ item.materialName }}</a>
      </el-col>
    </el-row>
    <el-divider />
    <el-main>
      <el-radio-group v-show="isContentType !== '0'" v-model="contentType" :disabled="isContentType !== '1'">
        <el-radio
          v-for="item in isSyss"
          :key="item.dictValue"
          :label="item.dictValue"
          :value="item.dictValue"
        >{{ item.dictLabel }}
        </el-radio>
      </el-radio-group>
    </el-main>

    <el-row v-if="contentType==='0'">
      <el-col :span="24">
        <editor :save="saveData" :sub-state="state" :submit="okSubmit" :content="dangqian" @panduan="pan" @update="getVal" />
      </el-col>
    </el-row>
    <uploadAssembly
      v-else
      :name="'img'"
      :my-headers="myHeaders"
      :param="{'id':id}"
      url="/hwStuHomework/uploadContent"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :submit-upload="okSubmit"
      :before-handle-remove="beforeHandleRemove"
      :dis="toolDis"
      :on-error="onError"
      @handlePreview="handlePreview"
      @handleRemove="handleRemove"
      @uploadSuccess="uploadSuccess"
    />
    <!-- 提交提示框 -->
    <el-dialog title="提示" :visible.sync="isSubmit" width="480px" center>
      <div class="del-dialog-cnt" style="padding-bottom: 25px;">请按照下面提示输入相关内容，输入正确才能提交！</div>
      <el-input v-model="subjectNameConfirm" :placeholder="subjectNameConfirmPlaceholder" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSubmit = false">取 消</el-button>
        <el-button type="primary" @click="contentType === '0'? sub():submitUpload()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Editor from './Editor'
import { getDictDataList } from '@/utils/dictUtils'
import { getToken } from '@/utils/auth'
import { updateContent, updateContentSub, saveQa, updateReadTime, getTobeListStudent, deleteHwStuHomeworkPic, submitUploadContent, getHwStuHomeworkPicList } from '@/api/homework/hwHomework'
import Editor from './DecoupledEditor'
import uploadAssembly from './uploadAssembly'
import { debounce } from '../../../utils'
export default {
  components: {
    Editor,
    uploadAssembly
  },
  data: function() {
    return {
      isContentType: '0',
      toolDis: false,
      myHeaders: {},
      isSyss: [],
      fileList: [],
      contentType: '0',
      subjectNameConfirm: undefined,
      isSubmit: false,
      readState: {},
      id: undefined,
      list: [],
      dangqian: {},
      oldContent: undefined,
      pand: true,
      times: 600000,
      dangqianindex: 0,
      danqianlength: 0,
      timer: null,
      state: '1',
      dsq: false,
      submit: true,
      disSave: false,
      to: undefined,
      dialogFormVisible: false,
      up: 1,
      temp: {
        id: undefined,
        stuHomeworkId: undefined,
        qaContent: undefined,
        qaReply: undefined
      },
      rules: {
        qaContent: [{ required: true, message: '请输入追问内容', trigger: 'blur' }]
      },
      subjectNameConfirmPlaceholder: undefined,
      uploadState: true
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '300px'
      }
    }
  },
  created() {
    this.isSyss = getDictDataList('hw_stu_homework_content_type')
    this.getList()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  mounted() {
    this.timer = setInterval(this.saveData, this.times)
    const token = getToken()
    this.myHeaders = { token: token }
  },
  updated() {

  },
  methods: {
    onError() {
      this.uploadState = true
    },
    submitUpload() {
      if (this.fileList && this.fileList.length < 1) {
        this.$message.error('请先上传图片！')
        return false
      }
      const flag = this.confirm()
      if (!flag) {
        return flag
      }
      submitUploadContent(this.id).then(res => {
        if (res.data != null && res.data && res.success) {
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            duration: 2000
          })
          this.jump()
        } else {
          this.$notify({
            title: '失败',
            message: res.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    uploadSuccess(response, file, fileList) {
      this.uploadState = true
      file.url = response.data.imgUrl
      file.uid = response.data.id
      file.name = response.data.imgName + response.data.imgSuffix
      file.width = response.data.width
      file.height = response.data.height
      file.imgJson = response.data.imgJson
      this.fileList = fileList
    },
    async beforeHandleRemove(file, fileList) {
      console.log(fileList)
      if (file.status === 'success') {
        const res = await deleteHwStuHomeworkPic(file.uid)
        if (res.success) {
          this.$message.success('移除成功！')
        } else {
          this.$message.error('移除失败！')
          this.reject(res.success)
        }
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePreview(file) {
      // 点击后去到批改工具页面
      const routeUrl = this.$router.resolve({
        path: '/homework/showOneImage',
        query: {
          id: file.uid,
          hwStuHomeworkId: this.id
        }
      })
      window.open(routeUrl.href, this.id + 'stuwImg')
    },
    beforeUpload(file) {
      var reg = /image\/(png|jpg|jpeg|gif)$/
      const su = file.name.substring(file.name.lastIndexOf('.'))
      if (!reg.test(file.type)) {
        const regsu = /\.(png|jpg|jpeg|gif)$/
        if (!regsu.test(su)) {
          this.$message.error('上传图片只能是 png、jpg、jpeg、gif、jfif、heic 格式！')
          return false
        }
      } else {
        this.uploadState = false
      }
    },
    okSubmit() {
      if (this.uploadState) {
        // this.subjectNameConfirmPlaceholder = '请正确输入\"' + this.dangqian.subjectName + '\"后，点击确认按钮，才能进行提交！'
        // 荣哥0913修改自有题目名称
        this.subjectNameConfirmPlaceholder = this.dangqian.subjectName
        this.isSubmit = true
      } else {
        this.$message.error('请待上传结束后提交')
      }
    },
    pan() {
      const _this = this
      const timers = setTimeout(() => {
        _this.submit = true
        clearTimeout(timers)
      }, 500)
    },
    getVal(val) {
      // this.dangqian.content = val
    },
    qa() {
      this.dialogFormVisible = true
    },
    qaSubmit() {
      this.temp.id = undefined
      this.qaReply = undefined
      this.temp.stuHomeworkId = this.id
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveQa(this.temp).then(response => {
            if (response.success) {
              this.dangqian.listzw.push({ id: response.data.id, qaContent: this.temp.qaContent })
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    mydsq() {
      if (this.state !== '2') {
        this.timer = setInterval(this.saveData, this.times)
      }
    },
    noData() {
      if (this.to === 1) {
        this.upperU()
      }
      if (this.to === 2) {
        this.lowerL()
      }
    },
    quxiao() {
      this.noData()
      this.disSave = false
    },
    tong(b) {
      clearInterval(this.timer)
      this.timer = null
      if (this.submit) {
        this.to = b
        if (this.id === this.dangqian.id && this.unescape(this.oldContent) !== editor.getData()) {
          this.disSave = true
          return false
        } else {
          this.noData()
        }
      }
    },
    upperU() {
      if (this.dangqianindex > 0) {
        if (this.submit) {
          if (this.id !== this.list[this.dangqianindex - 1].id) {
            this.submit = false
            this.dangqianindex = this.dangqianindex - 1
            this.dangqian = this.list[this.dangqianindex]
            this.oldContent = this.dangqian.content
            this.id = this.dangqian.id
            this.mydsq()
            if (!this.dangqian.readTime && !this.readState[this.id + '']) {
              updateReadTime(this.id).then(res => {
                if (res.data) {
                  this.readState[this.id + ''] = true
                }
              })
            }
            return false
          }
        } else {
          console.log('操作频繁')
        }
      }
    },
    lowerL() {
      if (this.dangqianindex >= 0 && this.dangqianindex < (this.list.length - 1)) {
        if (this.submit) {
          if (this.id !== this.list[this.dangqianindex + 1].id) {
            this.submit = false
            this.dangqianindex = this.dangqianindex + 1
            this.dangqian = this.list[this.dangqianindex]
            this.oldContent = this.dangqian.content
            this.id = this.dangqian.id
            this.mydsq()
            if (!this.dangqian.readTime && !this.readState[this.id + '']) {
              updateReadTime(this.id).then(res => {
                if (res.data) {
                  this.readState[this.id + ''] = true
                }
              })
            }
            return false
          }
        } else {
          console.log('操作频繁')
        }
      }
    },
    unescape(html) {
      if (!html) {
        return ''
      }
      return html
        .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/amp;/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "\'")
        .replace(/&ldquo;/g, '\“')
        .replace(/&rdquo;/g, '\”')
        .replace(/&lsquo;/g, '\‘')
        .replace(/&rsquo;/g, '\’')
    },
    queding() {
      this.saveData(1)
      this.disSave = false
    },
    saveData(p) {
      if (this.dsq) {
        const zuixin = editor.getData()
        if (this.unescape(this.oldContent) !== zuixin) {
          updateContent({ id: this.id, content: zuixin }).then(response => {
            if (response.data != null && response.data) {
              this.pand = false
              this.dangqian.content = zuixin
              this.oldContent = zuixin
              this.$message.success('保存成功')
              if (p === 1) {
                this.noData()
              }
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          console.log('未修改无须保存')
        }
      }
    },
    sub() {
      const flag = this.confirm()
      if (!flag) {
        return flag
      }
      updateContentSub({ id: this.id, content: editor.getData() }).then(response => {
        if (response.data != null && response.data) {
          clearInterval(this.timer)
          this.timer = null
          this.$message.success('提交成功')
          this.jump()
          // this.$router.push(url)
          /*          debugger
              this.list.splice(this.list.findIndex(item => item.id === this.id))
              if (this.list.length > 0) {
                this.dangqianindex = 0
                this.load(this.list[this.dangqianindex])
              } else {
                const url = '/homework/' + this.dangqian.id + '/studetails/0'
                this.$router.push(url)
              }*/
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    confirm() {
      if (!this.subjectNameConfirm || this.subjectNameConfirm !== this.dangqian.subjectName) {
        this.$message.error('当前输入的题目名称和当前题目名称不一致，请重新输入！')
        return false
      } else {
        return true
      }
    },
    jump() {
      const url = '/homework/' + this.dangqian.id + '/studetails/0'
      const routeUrl = this.$router.resolve({
        path: url
      })
      // window.location.href=routeUrl.href
      window.opener = null
      window.open(routeUrl.href, '' + this.dangqian.id + 'chakan')
      window.close()
    },
    getList() {
      const that = this
      const stuHomeworkId = this.$route.params.id
      this.id = stuHomeworkId
      getTobeListStudent(stuHomeworkId).then(response => {
        /* getTobeStuHomeworkList(this.listQuery).then(response => {*/

        if (response.data.contentType) {
          this.contentType = response.data.contentType
        }
        if (response.data.isContentType) {
          this.isContentType = response.data.isContentType
        }

        if (response.data.subState === '待提交' || response.data.subState === '新作业') {
          this.toolDis = true
        }
        // 获取图片
        getHwStuHomeworkPicList(stuHomeworkId).then(res => {
          if (res.success) {
            res.data.forEach(function(img) {
              that.fileList.push({ url: img.imgUrl, uid: img.id, name: img.imgName, width: img.width, height: img.height, imgJson: img.imgJson })
            })
          }
        })
        this.list.push(response.data)
        if (this.list && this.list.length > 0) {
          const stu = this.$route.params.stu
          // this.list = response.data
          let ind = 0
          if (stu === '0') {
            console.log(that.list)
            this.list.forEach(function(a, b) {
              if (stuHomeworkId === a.id) {
                ind = b
                if (!a.readTime && !that.readState[a.id + '']) {
                  updateReadTime(a.id).then(res => {
                    if (res.data) {
                      that.readState[that.id + ''] = true
                    }
                  })
                }
              }
            })
          }
          this.dangqianindex = ind
          this.load(this.list[this.dangqianindex])
        }
      })
    },
    load(dd) {
      this.dangqian = dd
      this.id = this.dangqian.id
      this.oldContent = this.dangqian.content
      this.state = this.dangqian.subState
      this.dsq = true
      this.danqianlength = this.list.length
      // editor.setData(this.unescape(this.dangqian.content))
    },
    getContent() {
      if (this.dangqian && this.dangqian.content) {
        return this.unescape(this.dangqian.content)
      } else {
        return localStorage.getItem('localTempDocument')
      }
    },
    download(id) {
      // window.location.href = '/hwHomeworkMaterial/downloadMaterial/' + id
      window.open('/hwHomeworkMaterial/downloadMaterial/' + id)
      // window.open('/hwHomeworkMaterial/downloadMaterial/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .assignment {
    margin: 2em 1.5em;
    text-align: left;

    .cols {
      line-height: 2.5em;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: normal;
      font-style: normal;
    }
  }
  /deep/ .subject{
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
  }
  /deep/ .el-divider {
    background-color: #1d0e0e;
    margin-bottom: 0px ;
    margin-top:0px;
  }
  .wenben{
    height: 23px;
    overflow: auto;
  }
  .complete{
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
  }

  /deep/ .subjectrow{
    padding-bottom: 1em;
  }

  /deep/ .el-main {
    text-align: center;
  }

</style>
