<template>
  <div class="assignment">
    <el-row class="subjectrow">
      <el-col :span="24">
        <span class="subject">
          题目: {{ dangqian.subjectName }}
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
      <el-col class="cols" :span="8">批改人： {{ dangqian.teacherName }} </el-col>
      <el-col v-if="dangqian.repeatTeacherName !=='尚未审核'" class="cols" :span="8">审核人： {{ dangqian.repeatTeacherName }}</el-col>
    </el-row>
    <el-divider />
    <el-row v-if="dangqian.relatedHomeworkId">
      <el-col :span="24">
        <ul class="scoreUrl">
          <li class="scoreLi cols">
            关联作业: <a v-if="relatedObj.subState !==undefined && relatedObj.subState !=='0' && relatedObj.subState !=='1'" style="font-size: 16px;link: 2.5em;color: #409eff;" :underline="false" type="primary" class="cols" :href=" link.replace(/\/homework\/.*\/seeDetails\//g,'/homeworkShare/'+relatedObj.id+'/studetailsShare/')" target="_blank">{{ relatedObj.subjectName }}</a>
            <span v-else class="cols">
              {{ relatedObj.subjectName }}
            </span>
          </li>
          <li class="scoreLi cols">
            关联作业状态: {{ relatedObj.subState==='2'?'已提交': (relatedObj.subState=='3'?'已结束':(relatedObj.subState=='4'?'已批改': (relatedObj.subState=='5'?'已追问': (relatedObj.subState=='6'?'已答复': '新作业')))) }}
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row v-if="dangqian.relatedHomeworkId">
      <el-col :span="24">
        <ul class="scoreUrl">
          <li class="scoreLi cols">
            一稿分数：{{ scoresData.scoreAll?scoresData.scoreAll:'0' }}
          </li>
          <li v-for="(arr,index) in new Array(relatedScoreNames.length)" class="scoreLi cols">
            {{ relatedScoreNames[index]+'：'+(scoresData['score'+(index+1)] ===undefined?'0':scoresData['score'+(index+1)])+'/' + relatedScores[index] }}
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-divider v-if="dangqian.relatedHomeworkId" />
    <el-row>
      <el-col class="cols" :span="24">
        <span class="complete">
          作业说明：{{ this.unescape(dangqian.completeExplain) }}
        </span>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="cols" :span="24">
        补充材料：<a v-for="item in dangqian.list" :key="item.id" :underline="false" style="margin-right: 10px;color: #02A7F0" @click="download(item.id)">{{ item.materialName }}</a>
      </el-col>
    </el-row>
    <el-divider />
    <el-main>
      <el-radio-group v-show="isContentType !== '0'" v-model="contentType">
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
          :editable="false"
          :commentable="isReceive"
          :reviewable="false"
          @content-change="updateContent"
          @comment-create="createComment"
          @comment-update="updateComment"
          @comment-delete="deleteComment"
        />
      </el-col>
    </el-row>
    <uploadAssembly
      v-else
      name="img"
      :file-list="fileList"
      :before-handle-remove="beforeHandleRemove"
      :dis="false"
      @handlePreview="handlePreview"
    />
    <el-form ref="tagCommentForms" :model="tagCommentForm" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-form-item v-if="dangqian.tagComment" label="总评" prop="tagComment" :rows="3">
        <comment-editor :key="dangqian.id" v-loading="contentLoading" :content="tagComment" :editable="isReceive" @content-change="onZongPingChange" />
      </el-form-item>
      <el-divider v-if="audioSrcList && audioSrcList.length>0 " />
      <el-form-item v-if="audioSrcList && audioSrcList.length>0 " label="语音总评">
        <div style="max-height:300px;overflow-y:scroll">
          <div v-for="audioItem in audioSrcList" :key="audioItem.id" class="audio-wrap">
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
      <el-divider v-if="dangqian.listScore && dangqian.listScore[0]" />
      <el-form-item v-if="dangqian.listScore && dangqian.listScore[0]" class="scolabel" label="分数">
        <el-row v-for=" (arr1,index1) in new Array(Math.ceil((num)/3))" :key="index1">
          <el-col v-for="(arr,index) in new Array(((num-(index1*3))>=3?3:(num-(index1*3))))" :key="index" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-tooltip class="item" effect="light" :content="scores[0]?scoreNames[((index1*3)+index)]+'/'+scores[((index1*3)+index)]+'分：':scoreNames[((index1*3)+index)]+'：'" placement="top-start">
              <el-form-item class="scorelabel" :label="scoreNames[((index1*3)+index)]+'：'" :prop="'score'+((index1*3)+(index+1))">
                <el-input :value="tempForm['score'+((index1*3)+(index+1))]" class="scoreClass" :disabled="dis" />
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item class="scorelabelAll" label="总分：" prop="scoreAll">
              <el-input :value="tempForm.scoreAll" class="scoreClassAll" :disabled="dis" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-divider v-if="dangqian.listzw && dangqian.listzw.length >0 " />
    <el-form ref="dataForm" :model="temp" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <div v-if="dangqian.listzw && dangqian.listzw.length > 0">
        <div v-for="(item,index) in dangqian.listzw" :key="index" class="zhuwen">
          <el-form-item label="追问">
            <comment-editor :key="item.id" v-loading="contentLoading" :max-length="qaNumbers.length>0?new Number(qaNumbers[index]):0" :content="unescape(item.qaContent)" :editable="!dis" /><br>
          </el-form-item>
          <el-form-item v-if="item.qaReply" label="追问回复" :rows="3">
            <comment-editor :key="item.id+'s'" v-loading="contentLoading" :content="unescape(item.qaReply)" :editable="!dis" /><br>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-form ref="tagCommentForm" :model="tagCommentForm" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-divider v-if="tagCommentForm.jobTag" />
      <el-form-item v-if="tagCommentForm.jobTag" label="作业标签" prop="jobTag">
        <el-radio-group v-model="tagCommentForm.jobTag">
          <el-radio v-for="item in jobtags" :key="item.dictValue" :label="item.dictValue" :disabled="!isReceive" :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-divider v-if="dangqian.repeatComment" />
    </el-form>
    <el-form v-if="dangqian.repeatComment" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-form-item label="复评" prop="repeatComment" :rows="3">
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

      <el-divider v-if="dangqian.examineTag" />
      <el-form-item v-if="dangqian.examineTag" label="审核标签">
        <el-radio-group :value="dangqian.examineTag" :disabled="true">
          <el-radio v-for="item in examineTags" :key="item.dictValue" :label="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getDictDataList } from '@/utils/dictUtils'
import { mapGetters } from 'vuex'
import { getTobeStuHomeworkListOne, getHwStuHomeworkPicList, getRelatedHomework } from '@/api/homework/hwHomework'
import Editor from '@/views/homework/submissions/ReviewEditor'
import CommentEditor from '@/views/homework/submissions/CommentEditor'
import uploadAssembly from './uploadAssembly'

export default {
  name: 'Dashboard',
  components: {
    Editor,
    CommentEditor,
    uploadAssembly
  },
  data: function() {
    return {
      relatedObj: { subState: '0' },
      relatedScores: [],
      link: '',
      scoresData: {},
      relatedScoreNames: [],
      scores: [],
      isSyss: [],
      contentType: '0',
      isContentType: '0',
      fileList: [],
      contentLoading: true,
      qaNumbers: [],
      scoreNames: [],
      jobtags: [],
      examineTags: [],
      num: 0,
      dis: true,
      isReceive: true,
      tagComment: null,
      repeatComment: null,
      tagCommentForm: {
        tagComment: null,
        repeatComment: null,
        stuHomeworkId: undefined,
        jobTag: undefined
      },
      tempForm: {
        tagComment: null,
        repeatComment: null,
        jobTag: null
      },
      content: null,
      updatedContent: null,
      comments: [],
      id: undefined,
      dangqian: {},
      pand: true,
      state: undefined,
      timer: undefined,
      dsq: false,
      dialogFormVisible: false,
      temp: {
        id: undefined,
        stuHomeworkId: undefined,
        qaReply: undefined,
        jobtag: '1'
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
    ...mapGetters([
      'userId'
    ]),
    selectwidthz() {
      return {
        width: '300px'
      }
    }
  },
  created() {
    this.link = window.location.href
    this.jobtags = getDictDataList('hw_homework_job_tag')
    this.isSyss = getDictDataList('hw_stu_homework_content_type')
    this.examineTags = getDictDataList('hw_homework_examine_tag')
    const stu = this.$route.params.stu
    if (stu === '0') {
      const id = this.$route.params.id
      this.loadContent(id)
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
    beforeHandleRemove() {
      this.$message.error('已提交无法删除！')
      return false
    },
    handlePreview(file, fileList) {
      // 点击后去到批改工具页面
      const routeUrl = this.$router.resolve({
        path: '/homework/showOneImage',
        query: {
          hwStuHomeworkId: this.id,
          id: file.uid
        }
      })
      window.open(routeUrl.href, this.id + 'stuimage')
    },
    onZongPingChange(data) {
      this.tagCommentForm.tagComment = data
    },
    updateContent(data) {
    },
    createComment({ data, success, error }) {
    },
    updateComment({ data, success, error }) {

    },
    deleteComment({ data, success, error }) {
    },
    loadContent(id) {
      console.log(id)
      const that = this
      this.contentLoading = true
      getTobeStuHomeworkListOne(id).then(response => {
        if (response.data.relatedHomeworkId) {
          getRelatedHomework(response.data.relatedHomeworkId, response.data.relatedStudentId).then(ree => {
            this.relatedObj = ree.data
            // 各项名称
            if (ree.data.subScoreCount) {
              this.relatedScoreNames = ree.data.subScoreCount.split(',')
            }
            // 各项分
            if (ree.data.subScores) {
              this.relatedScores = ree.data.subScores.split(',')
            }

            if (ree.data.listScore && ree.data.listScore.length > 0) {
              ree.data.listScore.forEach(function(a, b) {
                if (b === ree.data.listScore.length - 1) {
                  that.scoresData['scoreAll'] = a.score
                } else {
                  that.scoresData['score' + (b + 1)] = a.score
                }
              })
            }
          })
        }
        const dd = response.data
        if (response.data.contentType) {
          this.contentType = response.data.contentType
        }
        if (response.data.isContentType) {
          this.isContentType = response.data.isContentType
        }

        // 获取图片
        getHwStuHomeworkPicList(id).then(res => {
          if (res.success) {
            res.data.forEach(function(img) {
              that.fileList.push({ url: img.imgUrl, uid: img.id, name: img.imgName })
            })
          }
        })
        // this.dangqian = dd
        this.$set(this, 'dangqian', dd)
        if (this.dangqian.isUsed !== 0) {
          this.isReceive = false
        }

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

        this.tagCommentForm.jobTag = this.dangqian.jobTag
        this.tagComment = this.unescape(this.dangqian.tagComment)
        this.repeatComment = this.unescape(this.dangqian.repeatComment)
        this.qaNumbers = this.dangqian.qaNumber.split(',')
        this.scoreNames = this.dangqian.subScoreCount.split(',')
        this.num = this.scoreNames.length
        if (this.dangqian.subScores) {
          this.scores = this.dangqian.subScores.split(',')
        }
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
        const auditlist = []
        this.dangqian.listAudit.forEach(function(a) {
          a.tagComment = that.unescape(a.tagComment)
          a.repeatComment = that.unescape(a.repeatComment)
          auditlist.push(a)
        })
        this.dangqian.listAudit = auditlist
        this.content = this.unescape(this.dangqian.content)
        this.comments = this.dangqian.listAudit
        this.id = this.dangqian.id
        this.state = this.dangqian.subState
        this.dsq = true
        this.contentLoading = false
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

  .app-wrapper {
    font-size: 13px;
  }
</style>
<style  lang="scss" scoped>

</style>
<style lang="scss" scoped>
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

  /deep/ .scorelabel .el-form-item__label {
    font-weight: 400;
    font-size: 16px;
    width: 50% !important;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

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

  .zonping{
    border-radius: 2px;
    font-size: 16px;
    max-width: 38em;
  }

  /deep/ .zonpingzw .el-textarea__inner{
    font-size: 16px;
    max-width: 38em;
    color: #333333;
  }
  /deep/ .el-textarea__inner{
    border: 1px solid #797979;
  }
  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    border-color: #797979;
    cursor:auto;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    cursor:auto;
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

  /deep/ .subject{
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
  }

  /deep/ .subjectrow{
    padding-bottom: 1em;
  }

  /deep/ .el-divider {
    background-color: #1d0e0e;
    margin-bottom: 0px ;
    margin-top:0px;
  }

  /deep/ .el-form >.el-form-item--small{
    margin-top: 1.5em;
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
  /deep/ .subButton{
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
    width: 138px;
    height: 38px;
    border: 1px solid #333333;
    color: #333333;
  }

  /deep/ .subjectrow{
    padding-bottom: 1em;
  }

  .subcl{
    margin-left: calc((100% - 897px)/2);
    margin-top: 1.5em;
  }
  .upButton{
    color: #333333;
    border: 1px solid #333333;
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

  /deep/ .el-radio__inner{
    border-color: #333333;
    cursor: pointer;
  }

  /deep/ .el-radio__inner::after {
    background-color: #333333;
  }

  /deep/ .el-radio__label {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
  }

  /deep/ .el-radio__input.is-checked .el-radio__inner {
    border-color: #333333;
    background: #FFF;
  }

  /deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #333333;
  }
  /deep/ .el-icon-close-tip{
    display: none !important;
  }
  /deep/ .el-icon-close{
    display: none !important;
  }
  /deep/ .el-main {
    text-align: center;
  }

  .scoreLi{
    list-style-type:none;
    float:left;
    margin-right: 80px;
  }

  .scoreUrl{
    margin: auto;
    padding-left: 0px !important;
  }
</style>
