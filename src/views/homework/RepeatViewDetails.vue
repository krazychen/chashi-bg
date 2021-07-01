<template>
  <div class="assignment">
    <el-row class="subjectrow">
      <el-col :span="22">
        <span class="subject">
          题目: {{ dangqian.groupName?(dangqian.groupName+"-"+dangqian.subjectName):dangqian.subjectName }}
        </span>
      </el-col>
      <el-col :span="2">
        <el-button class="upButton" @click="getPDF()">导出pdf</el-button>
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
    <el-row v-if="dangqian.relatedHomeworkId">
      <el-col :span="24">
        <ul class="scoreUrl">
          <li class="scoreLi cols">
            关联作业: <a v-if="relatedObj.subState !==undefined && relatedObj.subState !=='0' && relatedObj.subState !=='1'" style="font-size: 16px;link: 2.5em;color: #409eff;" :underline="false" type="primary" class="cols" :href=" link.replace(/\/system\/.*\/repeatDetails\//g,'/homeworkShare/'+relatedObj.id+'/studetailsShare/')" target="_blank">{{ relatedObj.subjectName }}</a>
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
        补充材料：<a v-for="item in dangqian.list" :underline="false" style="margin-right: 10px;color: #02A7F0" @click="download(item.id)">{{ item.materialName }}</a>
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
    <el-row v-show="contentType==='0'">
      <el-col :span="24">
        <editor
          v-loading="contentLoading"
          :stud-homework-id="1111"
          :content="content"
          :comments="comments"
          :editable="!dis"
          :commentable="dis"
          :reviewable="!dis"
          @comment-create="createComment"
          @comment-update="updateComment"
          @comment-delete="deleteComment"
        />
      </el-col>
    </el-row>
    <uploadAssembly
      v-if="contentType==='1'"
      :name="'img'"
      url="/hwStuHomework/uploadContent"
      :file-list="fileList"
      :dis="toolDis"
      :before-handle-remove="beforeHandleRemove"
      @handlePreview="handlePreview"
    />
    <el-form label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-divider />
      <el-form-item class="labels" label="总评" prop="tagComment" :rows="3" size="medium">
        <comment-editor :key="dangqian.id" v-loading="contentLoading" :content="tagComment" :editable="!dis" @content-change="onZongPingChange" />
      </el-form-item>
      <el-divider />
      <el-form-item label="语音总评">
        <div style="margin-top:10px;max-height:300px;overflow-y:scroll">
          <div v-for="audioItem in audioSrcFirstList" :key="audioItem.id" class="audio-wrap">
            <audio class="audio-text" :src="audioItem.audioUrl" controls />
            <el-select :key="audioItem.id" style="width: 80px;margin-left:0px;margin-right: 10px" :value="audioPlayBackRate[audioItem.id]" placeholder="倍速" @change="(val) =>{changeAudioPlayRate(val,audioItem.id)}">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button size="mini" type="danger" round @click="deleteFirstAudio(audioItem)">
              删除
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-divider />
      <el-form-item class="scolabel" label="分数">
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
              <el-input v-model.number="tempForm.scoreAll" class="scoreClassAll" :disabled="dis" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-divider v-if="dangqian.listzw && dangqian.listzw.length >0" />
    <el-form ref="dataForm" :model="temp" :rules="rules" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <div v-for="(item,index) in dangqian.listzw" v-if="dangqian.listzw.length>0" class="zhuwen">
        <el-form-item label="追问">
          <comment-editor :key="item.id" v-loading="contentLoading" :max-length="qaNumbers.length>0?new Number(qaNumbers[index]):0" :content="unescape(item.qaContent)" :editable="!dis" /><br>
          <!--<el-input :value="unescape(item.qaContent)" class="zonpingzw" placeholder="请输入追问内容" :autosize="{ minRows: 3}" type="textarea" :disabled="dis" />-->
        </el-form-item>
        <el-form-item v-if="item.qaReply && item.qaReplyState===0" label="追问回复" :rows="3">
          <comment-editor :key="item.id+'s'" v-loading="contentLoading" :content="unescape(item.qaReply)" :editable="!dis" /><br>
          <!--<el-input :value="unescape(item.qaReply)" class="zonpingzw" placeholder="请输入追问内容" :autosize="{ minRows: 3}" type="textarea" :disabled="dis" />-->
        </el-form-item>
        <el-form-item v-else-if="dangqian.isQa === 1 && item.qaReplyState === 1" label="追问回复" prop="qaReply" :rows="3">
          <!--<el-input v-model="temp.qaReply" class="zonpingzw" placeholder="请输入追问内容" :autosize="{ minRows: 3}" type="textarea" /> <br>-->
          <comment-editor :key="dangqian.id+'999s'" v-loading="contentLoading" :content="qaReply" :editable="dis" @content-change="qaReplyChange" /><br>
          <el-button class="zhuwenButton" @click="qaSubmit(item,0)">提交回复</el-button>
        </el-form-item>
      </div>
      <el-divider />
    </el-form>

    <el-form label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-form-item label="作业标签">
        <el-radio-group :value="dangqian.jobTag" :disabled="dis">
          <el-radio v-for="item in jobtags" :key="item.dictValue" :label="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-divider />
    </el-form>

    <el-form ref="repeatForm" :model="repeatTemp" :rules="repeatRules" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-form-item prop="repeatComment" :rows="3" class="labels" label="复评">
        <comment-editor :key="dangqian.id" v-loading="contentLoading" :content="repeatTemp.repeatComment" :editable="true" @content-change="onRepeatCommentChange" />
      </el-form-item>
      <el-divider />
      <el-form-item label="语音复评">
        <el-button v-if="!audioShow && (!audioSrcList || audioSrcList && audioSrcList.length < 10)" class="upButton" @click="openAudio">添加</el-button>
        <el-upload
          accept="audio/wav,audio/mp3,audio/x-m4a"
          style="display: inline-block;margin-left: 20px"
          action="/upload/"
          name="img"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAudioSuccess"
          :before-upload="beforeAudioUpload"
        >
          <el-button v-if="!audioShow && (!audioSrcList || audioSrcList && audioSrcList.length < 10)" class="upButton">上传</el-button>
        </el-upload>
        <div v-if="audioShow" style="display: inline-block;margin-left: 20px">
          <span style="margin-right: 20px"> {{ audioLength }}/10:00</span>
          <el-button :disabled="audioStartBtn" @click="audioStart">开始</el-button>
          <el-button :disabled="audioUploadStatus" @click="audioStop">停止</el-button>
          <el-button :disabled="audioUploadStatus" @click="audioPause">暂停</el-button>
          <el-button :disabled="audioUploadStatus" @click="audioResume">恢复</el-button>
          <el-button @click="audioCancel">取消</el-button>
        </div>

        <div style="margin-top:10px;max-height:300px;overflow-y:scroll">
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
            <el-button size="mini" type="danger" round @click="deleteAudio(audioItem)">
              删除
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-divider />
      <el-form-item label="审核标签" prop="examineTag">
        <el-radio-group v-model="repeatTemp.examineTag">
          <el-radio v-for="item in examineTags" :key="item.dictValue" :label="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="subcl">
      <div>
        <el-button class="subButton" @click.prevent="okSubmit()">提交</el-button>
      </div>
    </div>

    <!-- 提交提示框 -->
    <el-dialog title="提示" :visible.sync="isSubmit" width="300px" center>
      <div class="del-dialog-cnt">确定提交吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSubmit = false">取 消</el-button>
        <el-button type="primary" @click="onSave()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 语音复评录音框 -->
    <!--    <el-dialog-->
    <!--      title="录音"-->
    <!--      :visible.sync="audioShow"-->
    <!--      top="30vh"-->
    <!--      width="460px"-->
    <!--      custom-class="audio-pos"-->
    <!--      :show-close="false"-->
    <!--      :modal="false"-->
    <!--      :lock-scroll="false"-->
    <!--      :close-on-click-modal="false"-->
    <!--      :close-on-press-escape="false"-->
    <!--      destroy-on-close-->
    <!--    >-->
    <!--      <span style="margin-right: 20px"> {{ audioLength }}/10:00</span>-->
    <!--      <el-button :disabled="audioStartBtn" @click="audioStart">开始</el-button>-->
    <!--      <el-button :disabled="audioUploadStatus" @click="audioStop">停止</el-button>-->
    <!--      <el-button :disabled="audioUploadStatus" @click="audioPause">暂停</el-button>-->
    <!--      <el-button :disabled="audioUploadStatus" @click="audioResume">恢复</el-button>-->
    <!--      <el-button @click="audioCancel">取消</el-button>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
// import Editor from './Editor'
import { mapGetters } from 'vuex'
import { getDictDataList } from '@/utils/dictUtils'
import { getTobeStuHomeworkListOne, addTwoHwHomeworkAudit, getHwStuHomeworkPicList, getRelatedHomework } from '@/api/homework/hwHomework'
import { updateQaRepeat, submitHomeworkRepeatCommentAndexamineTag, deleteAuditTwo, updateAuditTwo, updateOrAddRepeatComment, uploadAuditAudio, saveAudioRelationRepeat } from '@/api/homework/homework'
import { getLoginSysUserVo } from '@/utils/auth'
import Editor from '@/views/homework/submissions/ReviewEditor'
import uploadAssembly from '@/views/homework/assignments/uploadAssembly'
import CommentEditor from '@/views/homework/submissions/CommentEditor'
import Recorder from 'recorder-core/recorder.mp3.min'
import { getToken } from '@/utils/auth'

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
      isContentType: '0',
      fileList: [],
      toolDis: false,
      isSyss: [],
      contentType: '0',
      scores: [],
      scoreNames: [],
      jobtags: [],
      examineTags: [],
      isSubmit: false,
      oldRepeatComment: undefined,
      repeatTemp: {
        examineTag: undefined,
        hwStuHomeworkId: undefined
      },
      repeatRules: {
        repeatComment: [{ required: true, validator: this.repeatTempValidator, trigger: 'blur' }],
        examineTag: [{ required: true, message: '请选择审核标签', trigger: 'change' }]
      },
      num: 0,
      dis: true,
      tagComment: null,
      repeatComment: null,
      tempForm: {
        tagComment: null,
        repeatComment: null
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
      qaReply: undefined,
      repeatCommentTimer: undefined,
      qaTime: 10000,
      temp: {
        id: undefined,
        qaReply: undefined
      },
      oldReply: undefined,
      rules: {
        qaReply: [{ required: true, validator: this.tagCommetValidator, trigger: 'blur' }]
      },
      // 录音
      audioSrcFirstList: [],
      audioShow: false,
      audioObj: null,
      audioSrcList: [],
      // 删除id
      audioIdDelList: [],
      audioLength: 0,
      audioStartBtn: false,
      audioUploadStatus: false,
      headers: { 'token': getToken() },
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
  beforeDestroy() {
    this.clearJob()
  },
  created() {
    this.link = window.location.href
    this.isSyss = getDictDataList('hw_stu_homework_content_type')
    this.jobtags = getDictDataList('hw_homework_job_tag')
    this.examineTags = getDictDataList('hw_homework_examine_tag')
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
    getPDF() {
      this.clickCompact(1)
      this.$nextTick(() => {
        const editor = document.querySelector('.document-editor .editable-container')
        editor.style.height = editor.scrollHeight + 'px'
        this.$nextTick(() => {
          this.clickCompact(3)
          this.$nextTick(() => {
            this.clickCompact(3)
            this.$nextTick(() => {
              window.print()
            })
          })
        })
        // window.print()
      })
    },
    clickCompact(state) {
      if (state === 1) {
        const objs = document.querySelectorAll('.compact')
        objs.forEach(function(a) {
          a.click()
        })
      } else if (state === 2) {
        const objs = document.querySelectorAll('blockquote')
        objs.forEach(function(a) {
          a.click()
        })
      } else {
        const objs = document.querySelectorAll('blockquote')
        if (objs.length > 0) {
          objs[0].click()
        }
      }
    },
    handlePreview(file) {
      // 点击后去到批改工具页面
      const routeUrl = this.$router.resolve({
        path: '/homework/showOneImage',
        query: {
          hwStuHomeworkId: this.id,
          id: file.uid
        }
      })
      window.open(routeUrl.href, this.id + 'twoImgr')
    },
    beforeHandleRemove(file, fileList) {
      return false
    },
    clearJob() {
      clearInterval(this.timer)
      this.timer = null
      clearInterval(this.repeatCommentTimer)
      this.repeatCommentTimer = null
    },
    clearQaJob() {
      clearInterval(this.timer)
      this.timer = null
    },
    qaSub() {
      if (this.oldReply !== this.temp.qaReply) {
        this.qaSubmit(this.dangqian.listzw[this.dangqian.listzw.length - 1], 1)
      } else {
        console.log('未更改追问回复，无须保存')
      }
    },
    onSaveRepeatComment() {
      if (this.oldRepeatComment !== this.repeatTemp.repeatComment) {
        updateOrAddRepeatComment({ stuHomeworkId: this.dangqian.id, repeatComment: this.repeatTemp.repeatComment }).then(res => {
          if (res.success && res != null) {
            this.oldRepeatComment = this.repeatTemp.repeatComment
          }
        })
      } else {
        console.log('未更改无须保存')
      }
    },
    tagCommetValidator(rule, value, callback) {
      if (this.temp.qaReply) {
        callback()
      } else {
        callback(new Error('请输入回复内容'))
      }
    },
    repeatTempValidator(rule, value, callback) {
      if (this.repeatTemp.repeatComment) {
        callback()
      } else {
        callback(new Error('请输入复评内容'))
      }
    },
    qaReplyChange(data) {
      this.temp.qaReply = data
    },
    onZongPingChange(data) {
      this.tempForm.tagComment = data
    },
    onRepeatCommentChange(data) {
      this.repeatTemp.repeatComment = data
    },
    deleteComment({ data, success, error }) {
      deleteAuditTwo(data.id).then(res => {
        if (res.data != null && res.data) {
          const { tagParagraph } = data
          const idx = this.comments.findIndex(c => c.tagParagraph === tagParagraph)
          if (idx > -1) {
            this.comments.splice(idx, 1)
          }
          success()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateComment({ data, success, error }) {
      updateAuditTwo(data).then(res => {
        if (res.data != null && res.data) {
          const { tagParagraph } = data
          const comment = this.comments.find(c => c.tagParagraph === tagParagraph)
          comment.tagComment = data.tagComment
          success()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    createComment({ data, success, error }) {
      data['stuHomeworkId'] = this.id
      data['content'] = editor.getData()// this.updatedContent // editor.getData()
      addTwoHwHomeworkAudit(data).then(res => {
        if (res.data != null && res.data) {
          data['id'] = res.data.id
          const user = getLoginSysUserVo()
          data['auditTeacherId'] = this.userId
          data['auditTeacherName'] = user.nickname ? user.nickname : user.username
          data['auditTeacherAvatar'] = user.avatar
          this.comments.push(data)
          success()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onSave() {
      this.repeatTemp.stuHomeworkId = this.dangqian.id
      this.repeatTemp.audioIdDelList = this.audioIdDelList

      submitHomeworkRepeatCommentAndexamineTag(this.repeatTemp).then(res => {
        if (res.data !== null && res.data) {
          this.oldRepeatComment = this.repeatTemp.repeatComment
          this.isSubmit = false
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.isSubmit = false
          this.$notify({
            title: '失败',
            message: res.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    okSubmit() {
      this.$refs['repeatForm'].validate((valid) => {
        if (valid) {
          this.isSubmit = true
        }
      })
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
        } else {
          this.contentType = '0'
        }
        if (response.data.isContentType) {
          this.isContentType = response.data.isContentType
        } else {
          this.isContentType = '0'
        }
        // 获取图片
        getHwStuHomeworkPicList(id).then(res => {
          if (res.success) {
            const fiList = []
            res.data.forEach(function(img) {
              fiList.push({ url: img.imgUrl, uid: img.id, name: img.imgName, width: img.width, height: img.height, imgJson: img.imgJson })
            })
            that.fileList = fiList
          }
        })
        // this.dangqian = dd
        this.$set(this, 'dangqian', dd)
        this.repeatTemp.examineTag = this.dangqian.examineTag
        this.tagComment = this.unescape(this.dangqian.tagComment)
        this.oldRepeatComment = this.unescape(this.dangqian.repeatComment)
        this.repeatTemp.repeatComment = this.unescape(this.dangqian.repeatComment)

        this.scoreNames = this.dangqian.subScoreCount.split(',')
        if (this.dangqian.subScores) {
          this.scores = this.dangqian.subScores.split(',')
        }
        this.num = this.scoreNames.length
        if (dd.listzw[0]) {
          dd.listzw.forEach(function(a, b) {
            if (a.qaReplyState === 1) {
              that.temp.qaReply = that.unescape(a.qaReply)
              that.qaReply = that.unescape(a.qaReply)
              that.oldReply = that.unescape(a.qaReply)
            }
          })
        }
        // this.temp.qaReply = this.unescape(this.dangqian.qaReply)
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.$refs['repeatForm'].clearValidate()
        })
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
        this.content = this.unescape(this.dangqian.content)
        this.qaNumbers = this.dangqian.qaNumber.split(',')
        const auditlist = []
        this.dangqian.listAudit.forEach(function(a) {
          a.tagComment = that.unescape(a.tagComment)
          a.repeatComment = that.unescape(a.repeatComment)
          auditlist.push(a)
        })
        this.dangqian.listAudit = auditlist
        console.log(this.tempForm)
        this.content = this.unescape(this.dangqian.content)
        this.comments = this.dangqian.listAudit
        this.id = this.dangqian.id
        this.state = this.dangqian.subState
        this.dsq = true

        // 语音
        if (this.dangqian.hwHomeworkAuditAudioQueryVoList && this.dangqian.hwHomeworkAuditAudioQueryVoList.length > 0) {
          this.audioSrcList = this.dangqian.hwHomeworkAuditAudioQueryVoList.map(item => {
            if (item.audioType === 2) {
              return item
            } else {
              return null
            }
          }).filter(item => item)

          // 一级老师语音列表
          this.audioSrcFirstList = this.dangqian.hwHomeworkAuditAudioQueryVoList.map(item => {
            if (item.audioType === 1) {
              return item
            } else {
              return null
            }
          }).filter(item => item)
        }

        this.contentLoading = false
        if (this.dangqian.subState === '已追问' && this.dangqian.listzw && this.dangqian.listzw.length > 0 && this.dangqian.listzw[this.dangqian.listzw.length - 1].qaReplyState === 1) {
          this.timer = setInterval(this.qaSub, this.qaTime)
        }
        this.repeatCommentTimer = setInterval(this.onSaveRepeatComment, this.qaTime)
      })
    },
    qaAnswer(item) {
      this.itt = item
      this.temp.id = item.id
      this.temp.qaReply = undefined
      this.dialogFormVisible = true
    },
    qaSubmit(item, state) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = item.id
          this.temp.stuHomeworkId = this.dangqian.id
          this.temp.qaReplyState = state
          updateQaRepeat(this.temp).then(response => {
            if (response.success && response.data !== null && response.data) {
              if (state === 0) {
                this.clearQaJob()
                let zong = {}
                zong = Object.assign(item, {}, this.temp)
                item = zong
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '回复成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.oldReply = this.temp.qaReply
              }
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

    // 录音
    openAudio() {
      this.audioReady()
    },
    audioReady: function() {
      const that = this
      this.audioLength = '0:0'
      // that.audioShow = true
      this.audioObj = Recorder({
        type: 'mp3',
        sampleRate: 16000,
        bitRate: 16, // mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
        onProcess: function(buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) {
          const minutes = parseInt((bufferDuration % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = parseInt((bufferDuration % (1000 * 60)) / 1000)
          that.audioLength = minutes + ':' + seconds
          // 超过10分钟自动停止
          if (bufferDuration >= 10 * 60 * 1000 + 1000) {
            that.audioStop()
          }
          // 录音实时回调，大约1秒调用12次本回调
          // 可利用extensions/waveview.js扩展实时绘制波形
          // 可利用extensions/sonic.js扩展实时变速变调，此扩展计算量巨大，onProcess需要返回true开启异步模式
        }
      })

      // var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
      this.audioObj.open(function() { // 打开麦克风授权获得相关资源
        that.audioShow = true
        // audio.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
      }, function(msg, isUserNotAllow) { // 用户拒绝未授权或不支持
        that.$message.error((isUserNotAllow ? '用户拒绝，未授权，' : '') + msg)
        // console.log((isUserNotAllow ? '用户拒绝未授权，' : '') + '无法录音:' + msg)
      })
    },
    audioStart: function() {
      this.audioObj.start()
      this.audioStartBtn = true
    },
    audioStop: function() {
      const that = this
      this.audioObj.stop(function(blob, duration) {
        that.audioObj.close()// 释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
        that.audioObj = null
        that.audioLength = '0:0'
        that.audioUploadStatus = true
        // that.audioSrc = (window.URL || webkitURL).createObjectURL(blob)
        const fileFormData = new FormData()
        fileFormData.append('img', blob, that.id + '.mp3')
        uploadAuditAudio(fileFormData).then(response => {
          if (response.success && response.data != null && response.data) {
            // 绑定
            const hwHomeworkAuditAudio = {
              stuHomeworkId: that.id,
              audioUrl: response.data,
              audioType: 2
            }
            saveAudioRelationRepeat(hwHomeworkAuditAudio).then(sares => {
              if (sares.success && sares.data != null && sares.data) {
                that.audioSrcList.push(sares.data)
                that.audioShow = false
                that.audioStartBtn = false
                that.audioUploadStatus = false
              } else {
                that.audioStartBtn = false
                that.audioUploadStatus = false
                this.$message.error(sares.msg)
              }
            })
          } else {
            that.audioStartBtn = false
            that.audioUploadStatus = false
            this.$message.error(response.msg)
          }
        })
      }, function(msg) {
        that.$message.error(msg)
        that.audioObj.close()// 可以通过stop方法的第3个参数来自动调用close
        that.audioObj = null
        that.audioStartBtn = false
        that.audioShow = false
      })
    },

    audioPause: function() {
      this.audioObj.pause()
    },
    audioResume: function() {
      this.audioObj.resume()
    },
    audioCancel: function() {
      const that = this
      this.audioLength = '0:0'
      if (this.audioObj) {
        this.audioObj.stop(function(blob, duration) {
          that.audioObj.close()// 释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
          that.audioObj = null
        }, function(msg) {
          that.audioObj.close()// 可以通过stop方法的第3个参数来自动调用close
          that.audioObj = null
        })
      }
      that.audioStartBtn = false
      that.audioShow = false
    },

    deleteAudio: function(audioItem) {
      this.$confirm('请确认是否删除选中的录音，删除请点击确认!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const objIndex = this.audioSrcList.findIndex(objItem => {
          return objItem.id === audioItem.id
        })
        if (objIndex >= 0) {
          this.audioSrcList.splice(objIndex, 1)
        }
        this.audioIdDelList.push(audioItem.id)
      }).catch(() => {

      })
    },
    deleteFirstAudio: function(audioItem) {
      this.$confirm('确定删除录音?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const objIndex = this.audioSrcFirstList.findIndex(objItem => {
          return objItem.id === audioItem.id
        })
        if (objIndex >= 0) {
          this.audioSrcFirstList.splice(objIndex, 1)
        }
        this.audioIdDelList.push(audioItem.id)
      }).catch(() => {

      })
    },
    handleAudioSuccess(res, file) {
      if (res.success && res.data != null && res.data) {
        // 绑定
        const hwHomeworkAuditAudio = {
          stuHomeworkId: this.id,
          audioUrl: res.data,
          audioType: 1
        }
        saveAudioRelationRepeat(hwHomeworkAuditAudio).then(sares => {
          if (sares.success && sares.data != null && sares.data) {
            this.audioSrcList.push(sares.data)
          } else {
            this.$message.error(sares.msg)
          }
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    beforeAudioUpload(file) {
      const isAudio = file.type === 'audio/wav' || file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.type === 'audio/x-m4a'
      const isLt5M = file.size / 1024 / 1024 < 15
      if (!isAudio) {
        this.$message.error('上传录音只能是 WAV/MP3/M4A 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传录音大小不能超过 15MB!')
      }
      return isAudio && isLt5M
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

  .audio-pos{
    margin-right: 5vw;
  }

  .audio-wrap{
    display: flex;
    align-items: center;
    margin-top:10px;
  }
  .audio-text{
    width:320px;
    margin-right:10px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
    font-size: 14px;
    padding: 0 5px;
  }

  .audio-del-btn{
    height: 40px;
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
  .wenben{
    height: 23px;
    overflow: auto;
  }

  .upButton{
    color: #333333;
    border: 1px solid #333333;
  }

  .complete{
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
  }

  .zonping{
    border-radius: 2px;
    font-size: 16px;
    max-width: 38em;
  }

  .scoreClass{
    width: 30% !important;
  }

  .scoreClassAll{
    width: 30% !important;
  }

  .zhuwenButton{
    color: #333333;
    border: 1px solid #797979;
    margin-top: 0.5em;
  }

  .subcl{
    /*
        margin-left: calc((100% - 897px)/2);
    */
    width: 100%;
    padding-left: 100px;
    padding-top: 1.5em;
    height: 100px;
  }
</style>

<style lang="scss" scoped>
  /deep/ .el-divider {
    background-color: #1d0e0e;
    margin-bottom: 0px ;
    margin-top:0px;
  }

  /deep/ .subject{
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
  }

  /deep/ .zonping .el-textarea__inner{
    color: #333333;
    font-weight: 400;
    line-height: 1.5em;
  }

  /deep/ .el-textarea__inner{
    border: 1px solid #797979;
    color: #333333;
    font-weight: 400;
    font-size: 16px;
    max-width: 38em;
  }

  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    border: 1px solid #797979;
    color: #333333;
    font-weight: 400;
    font-size: 16px;
    max-width: 38em;
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
    text-align: center;
    font-weight: 400;
  }

  /deep/ .el-input__inner{
    border: 1px solid #797979;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    border-color: #797979;
  }
  /deep/ > .el-form-item__label{
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    width: calc((100% - 897px)/2);
  }

  /deep/ .el-form >.el-form-item--small{
    margin-top: 1.5em;
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

  /deep/ .scoreClassAll .el-input__inner {
    color: #333333;
    line-height: 1em;
    font-size: 16px;
    border: 1px solid #797979;
    text-align: center;
    font-weight: 700;
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

  /deep/ .scorelabel  .el-form-item__error{
    width: 100%;
    text-align: center;
    padding-right: 18%;
  }

  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    border-color: #797979;
    cursor:auto;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    cursor:auto;
  }

  /deep/ .subjectrow{
    padding-bottom: 1em;
  }

  /deep/ .el-main {
    text-align: center;
  }
  /deep/ .el-icon-close-tip{
    display: none !important;
  }
  /deep/ .el-icon-close{
    display: none !important;
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
