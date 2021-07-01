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
      <el-radio-group v-model="contentType" :disabled="true">
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
        <editor
          v-loading="contentLoading"
          :stud-homework-id="1111"
          :content="content"
          :comments="comments"
          :editable="!dis"
          :commentable="!dis"
          :reviewable="!dis"
        />
      </el-col>
    </el-row>
    <uploadAssembly
      v-else
      name="img"
      :file-list="fileList"
      :dis="false"
      @handlePreview="handlePreview"
    />
    <!--
    <el-row>
      <el-col :span="24">
        总评: {{ dangqian.tagComment }}
      </el-col>
    </el-row>-->
    <el-form ref="form" :model="tempForm" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-divider v-if="dangqian.tagComment" />
      <el-form-item class="labels" label="总评" prop="tagComment" :rows="3" size="medium">
        <comment-editor :key="dangqian.id" v-loading="contentLoading" :content="tagComment" :editable="!dis" />
        <!-- <el-input v-model="tempForm.tagComment" class="zonping" :autosize="{ minRows: 3}" type="textarea" :disabled="dis" />-->
      </el-form-item>
      <el-divider v-if="dangqian.tagComment" />

      <el-form-item v-if="audioSrcList && audioSrcList.length>0" label="语音总评">
        <div style="max-height:300px;overflow-y:scroll">
          <div v-for="audioItem in audioSrcList" :key="audioItem.id" class="audio-wrap">
            <audio :ref="audioItem.id" class="audio-text" :src="audioItem.audioUrl" controls controlsList="nodownload" oncontextmenu="return false"/>
            <el-select :key="audioItem.id" style="width: 80px;margin-left:0px;margin-right: 10px" :value="audioPlayBackRate[audioItem.id]" placeholder="倍速" @change="(val) =>{changeAudioPlayRate(val,audioItem.id)}">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-divider v-if="audioSrcList && audioSrcList.length>0" />
      <el-form-item v-if="dangqian.listScore && dangqian.listScore[0]" class="scolabel" label="分数">
        <el-row v-for=" (arr1,index1) in new Array(Math.ceil((num)/3))">
          <el-col v-for="(arr,index) in new Array(((num-(index1*3))>=3?3:(num-(index1*3))))" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-tooltip class="item" effect="light" :content="scores[0]?scoreNames[((index1*3)+index)]+'/'+scores[((index1*3)+index)]+'分：':scoreNames[((index1*3)+index)]+'：'" placement="top-start">
              <el-form-item class="scorelabel" :label="scores[0]?scoreNames[((index1*3)+index)]+'/'+scores[((index1*3)+index)]+'分：':scoreNames[((index1*3)+index)]+'：'" :prop="'score'+((index1*3)+(index+1))">
                <el-input v-model="tempForm['score'+((index1*3)+(index+1))]" class="scoreClass" :disabled="dis" />
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item class="scorelabelAll" label="总分：" prop="scoreAll">
              <el-input v-model="tempForm.scoreAll" class="scoreClassAll" :disabled="dis" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-divider v-if="dangqian.listzw && dangqian.listzw.length>0" />
    <el-form ref="dataForm" :model="temp" :rules="rules" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <div v-for="(item,index) in dangqian.listzw" v-if="dangqian.listzw.length>0" class="zhuwen">
        <el-form-item label="追问">
          <comment-editor :key="item.id" v-loading="contentLoading" :max-length="qaNumbers.length>0?new Number(qaNumbers[index]):0" :content="unescape(item.qaContent)" :editable="!dis" /><br>
        </el-form-item>
        <el-form-item v-if="item.qaReply" label="追问回复" :rows="3">
          <comment-editor :key="item.id+'s'" v-loading="contentLoading" :content="unescape(item.qaReply)" :editable="!dis" /><br>
        </el-form-item>
      </div>
    </el-form>
    <!--<el-divider />-->
    <el-form>
      <!--      <el-form-item label="作业标签" label-width="100px">
        <el-radio-group :value="dangqian.jobTag" :disabled="true">
          <el-radio v-for="item in jobtags" :key="item.dictValue" :label="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>-->
    </el-form>
    <el-divider v-if="repeatComment && dangqian.repeatTeacherName !== '尚未审核'" />
    <el-form v-if="repeatComment && dangqian.repeatTeacherName !== '尚未审核'" ref="form" :model="tempForm" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-form-item label="复评" prop="repeatComment" :rows="3">
        <!--<el-input v-model="tempForm.repeatComment" class="zonping" :autosize="{ minRows: 3}" type="textarea" :disabled="dis" />-->
        <comment-editor :key="dangqian.id" v-loading="contentLoading" :content="repeatComment" :editable="!dis" />
      </el-form-item>
      <el-divider v-if="audioSrcRepeatList && audioSrcRepeatList.length>0" />
      <el-form-item v-if="audioSrcRepeatList && audioSrcRepeatList.length>0" label="复评语音">
        <div style="margin-top:10px;max-height:300px;overflow-y:scroll">
          <div v-for="audioItem in audioSrcRepeatList" :key="audioItem.id" class="audio-wrap">
            <audio :ref="audioItem.id" class="audio-text" :src="audioItem.audioUrl" controls />
            <el-select :key="audioItem.id" style="width: 80px;margin-left:0px;margin-right: 10px" :value="audioPlayBackRate[audioItem.id]" placeholder="倍速" @change="(val) =>{changeAudioPlayRate(val,audioItem.id)}">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </el-form-item>
      <!--      <el-divider v-if="tempForm.repeatComment" />
      <el-form-item v-if="tempForm.repeatComment" label="审核标签">
        <el-radio-group :value="dangqian.examineTag" :disabled="true">
          <el-radio v-for="item in examineTags" :key="item.dictValue" :label="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
// import Editor from './Editor'
import { getDictDataList } from '@/utils/dictUtils'
import { getTobeStuHomeworkListOneShare, saveQa, getHwStuHomeworkPicListShare } from '@/api/homework/hwHomework'
// import TopNav from '@/views/homework/shared/TopNav'
// import Navbar from '@/views/homework/shared/Navbar'
import Editor from '@/views/homework/submissions/ReviewEditor'
import CommentEditor from '@/views/homework/submissions/CommentEditor'
import uploadAssembly from './uploadAssembly'

export default {
  name: 'Dashboard',
  components: {
    // Navbar,
    // TopNav,
    Editor,
    CommentEditor,
    uploadAssembly
  },
  data: function() {
    return {
      fileList: [],
      contentType: '0',
      isSyss: [],
      scores: [],
      scoreNames: [],
      num: 0,
      dis: true,
      tagComment: null,
      repeatComment: null,
      tempForm: {
        score1: 0,
        score2: 0,
        score3: 0,
        scoreAll: 0,
        tagComment: null,
        repeatComment: null
      },
      tempFormzw: {
        qaContent: undefined
      },
      qaNumbers: [],
      contentLoading: true,
      content: null,
      updatedContent: null,
      comments: [],
      tempAudit: {
        auditType: undefined,
        tagParagraph: undefined,
        tagComment: undefined,
        tagScore: undefined,
        stuHomeworkId: undefined
      },

      id: undefined,
      dangqian: {},
      pand: true,
      state: undefined,
      timer: undefined,
      dsq: false,
      dialogFormVisible: false,
      temp: {
        stuHomeworkId: undefined,
        qaContent: undefined
      },
      rules: {
        qaContent: [{ required: true, message: '请输入追问内容', trigger: 'blur' }]
      },
      // 语音
      audioSrcList: [],
      audioSrcRepeatList: [],
      audioPlayBackRate: {},
      options: [{
        value: '0.5',
        label: '0.5X'
      }, {
        value: '1',
        label: '1X'
      }, {
        value: '1.5',
        label: '1.5X'
      }, {
        value: '2',
        label: '2X'
      }]
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
    /*    this.jobtags = getDictDataList('hw_homework_job_tag')
    this.examineTags = getDictDataList('hw_homework_examine_tag')*/
    const stu = this.$route.params.stu
    if (stu === '0') {
      const id = this.$route.params.id
      this.loadContent(id)
      // this.onlyList(id)
    }
  },
  updated() {
    if (this.dangqian) {
      if (this.scoreNames.length > 0) {
        let scor = 0
        for (let i = 0; i < this.scoreNames.length; i++) {
          scor = scor + new Number(this.tempForm['score' + (i + 1)])
        }
        this.tempForm.scoreAll = scor
      }
    }
  },
  methods: {
    handlePreview(file, fileList) {
      // 点击后去到批改工具页面
      const routeUrl = this.$router.resolve({
        path: '/homeworkShare/showOneImageShare',
        query: {
          hwStuHomeworkId: this.id,
          id: file.uid
        }
      })
      window.open(routeUrl.href, this.id + 'shareimage')
    },
    loadContent(id) {
      console.log(id)
      const that = this
      this.contentLoading = true
      getTobeStuHomeworkListOneShare(id).then(response => {
        const dd = response.data
        if (response.data.contentType) {
          this.contentType = response.data.contentType
        } else {
          this.contentType = '0'
        }
        // 获取图片
        getHwStuHomeworkPicListShare(id).then(res => {
          if (res.success) {
            res.data.forEach(function(img) {
              that.fileList.push({ url: img.imgUrl, uid: img.id, name: img.imgName })
            })
          }
        })
        // this.dangqian = dd
        // 语音
        if (dd.hwHomeworkAuditAudioQueryVoList && dd.hwHomeworkAuditAudioQueryVoList.length > 0) {
          this.audioSrcList = dd.hwHomeworkAuditAudioQueryVoList.map(item => {
            if (item.audioType === 1) {
              return item
            } else {
              return null
            }
          }).filter(item => item)

          this.audioSrcRepeatList = dd.hwHomeworkAuditAudioQueryVoList.map(item => {
            if (item.audioType === 2) {
              return item
            } else {
              return null
            }
          }).filter(item => item)
        }
        this.$set(this, 'dangqian', dd)
        this.scoreNames = this.dangqian.subScoreCount.split(',')
        if (this.dangqian.subScores) {
          this.scores = this.dangqian.subScores.split(',')
        }
        this.num = this.scoreNames.length

        this.tagComment = this.unescape(this.dangqian.tagComment)
        this.repeatComment = this.unescape(this.dangqian.repeatComment)
        this.qaNumbers = this.dangqian.qaNumber.split(',')
        // this.$set(this, 'tempForm', {
        //   tagComment: this.unescape(this.dangqian.tagComment),
        //   repeatComment: this.unescape(this.dangqian.repeatComment)
        // })
        const scorelist = this.dangqian.listScore
        const arr = new Array((this.scoreNames.length + 1))
        if (arr.length < 2) {
          if (scorelist.length > 0) {
            this.$set(this.tempForm, 'scoreAll', scorelist[scorelist.length - 1].score)
          } else {
            this.$set(this.tempForm, 'scoreAll', 0)
          }
        }
        if (arr.length !== 1 && scorelist.length <= arr.length) {
          for (let key = 0; key < arr.length; key++) {
            if (scorelist.length < 2) {
              if (key === (arr.length - 1)) {
                this.$set(this.tempForm, 'scoreAll', 0)
              } else {
                this.$set(this.tempForm, 'score' + (key + 1), 0)
              }
            } else {
              if (key < arr.length - 1) {
                if ((key < (scorelist.length - 1))) {
                  this.$set(this.tempForm, 'score' + (key + 1), scorelist[key].score)
                } else {
                  this.$set(this.tempForm, 'score' + (key + 1), 0)
                }
              } else {
                if ((key < (scorelist.length - 1))) {
                  this.$set(this.tempForm, 'scoreAll', scorelist[key].score)
                } else {
                  this.$set(this.tempForm, 'scoreAll', scorelist[scorelist.length - 1].score)
                }
              }
            }
          }
        } else {
          for (let key = 0; key < arr.length - 1; key++) {
            if (key < (arr.length - 1)) {
              // this.tempForm['score' + (key + 1)] = scorelist[key].score
              this.$set(this.tempForm, 'score' + (key + 1), scorelist[key].score)
            }
          }
          this.$set(this.tempForm, 'scoreAll', scorelist[scorelist.length - 1].score)
        }
        console.log(this.tempForm)
        this.content = this.unescape(this.dangqian.content)
        const auditlist = []
        this.dangqian.listAudit.forEach(function(a) {
          a.tagComment = that.unescape(a.tagComment)
          a.repeatComment = that.unescape(a.repeatComment)
          auditlist.push(a)
        })
        this.dangqian.listAudit = auditlist
        this.comments = this.dangqian.listAudit
        this.id = this.dangqian.id
        this.state = this.dangqian.subState
        this.dsq = true
        this.contentLoading = false
      })
    },
    qaAnswer(item) {
      this.dialogFormVisible = true
    },
    qaSubmit() {
      this.temp.id = undefined
      this.qaReply = undefined
      this.temp.stuHomeworkId = this.id
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveQa(this.temp).then(response => {
            if (response.data != null && response.data) {
              this.dangqian.listzw.push({ id: response.data.id, qaContent: this.temp.qaContent })
              this.dialogFormVisible = false
              this.dangqian.subState = '已追问'
              this.$notify({
                title: '成功',
                message: '追问成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
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
    download(id) {
      // window.location.href = '/hwHomeworkMaterial/downloadMaterial/' + id
      window.open('/hwHomeworkMaterial/downloadMaterial/' + id)
      // window.open('/hwHomeworkMaterial/downloadMaterial/' + id)
    },
    changeAudioPlayRate(val, objId) {
      this.$set(this.audioPlayBackRate, objId, val)
      this.$refs[objId][0].playbackRate = val
    }
  }
}
</script>

<style lang="scss">
  @import "@/views/homework/shared/StyleFix.scss";
  body {
    background: #f7f7f7;
  }

  .audio-wrap{
    display: flex;
    align-items: center;
    margin-top:10px;
  }
  .audio-text{
    width:400px;
    margin-right:10px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
    font-size: 14px;
    padding: 0 5px;
  }

</style>
<style lang="scss" scoped>
  /deep/ .container {
    max-width: 1140px;
    margin: 0em auto;
  }

  /deep/ .app-wrapper {
    font-size: 16px;
  }
  /deep/ .subjectrow{
    padding-bottom: 1em;
  }

</style>

<style lang="scss" scoped>
  .zonping{
    font-size: 16px;
    max-width: 38em;

  }
  /deep/ .zonpingzw .el-textarea__inner{
    font-size: 16px;
    max-width: 38em;
    color: #333333;
  }
  /deep/ .zonping .el-textarea__inner{
    color: #333333;
    font-weight: 400;
    line-height: 1.5em;

  }
  /deep/ > .el-form-item__label{
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    width: calc((100% - 897px)/2);
  }
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
  .wenben{
    height: 23px;
    overflow: auto;
  }
  .complete{
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
  }
</style>

<style lang="scss" scoped>
  /deep/ .scoreClass .el-input__inner {
    color: #333333;
    line-height: 1em;
    font-size: 16px;
    border: 1px solid #797979;
    text-align: center;
    font-weight: 400;
  }
  .scoreClass{
    width: 30% !important;
  }

  /deep/ .scorelabel .el-form-item__label {
    font-weight: 400;
    font-size: 16px;
    width: 50% !important;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /deep/ .scoreClassAll .el-input__inner {
    color: #333333;
    line-height: 1em;
    font-size: 16px;
    border: 1px solid #797979;
    text-align: center;
    font-weight: 700;
  }
  .scoreClassAll{
    width: 30% !important;
  }

  /deep/ .scorelabelAll .el-form-item__label {
    font-weight: 700;
    font-size: 16px;
    width: 50% !important;
    text-align: left;
  }
  /deep/ .scorelabelAll{
    margin-bottom: 0px;
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

  /deep/ .el-form >.el-form-item--small{
    margin-top: 1.5em;
  }
  .zhuwen >.el-form-item--small{
    margin-top: 1.5em;
  }
  .zhuwenButton{
    color: #333333;
    border: 1px solid #797979;
    margin-top: 0.5em;
  }

  /deep/ .el-radio__input.is-disabled+span.el-radio__label {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
  }

  /deep/ .el-radio__input.is-disabled .el-radio__inner, .el-radio__input.is-disabled.is-checked .el-radio__inner {
    border-color: #333333;
    cursor: pointer;
  }

  /deep/ .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
    background-color: #333333;
  }

  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    cursor:auto;
    border-color: #797979;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    cursor:auto;
  }
  /deep/ .el-textarea__inner{
    border: 1px solid #797979;
  }

  /deep/ .subjectrow{
    padding-bottom: 1em;
  }

</style>
