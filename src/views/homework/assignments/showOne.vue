<template>
  <div class="assignment">
    <el-row class="subjectrow">
      <el-col :span="16">
        <span class="subject">
          题目: {{ dangqian.groupName?(dangqian.groupName+"-"+dangqian.subjectName):dangqian.subjectName }}
        </span>
      </el-col>
      <el-col :span="8">
        <el-button v-if="!isReceive" :disabled="xiaButton || shangButton ||!readState" class="upButton" style="margin-right: 20px" @click="receiveHomework('0')">领取作业</el-button>
        <el-button v-else :disabled="xiaButton || shangButton ||!readState" class="upButton" style="margin-right: 20px" @click="receiveHomework('1')">取消领取</el-button>
        <el-button class="upButton" :loading="shangButton" :disabled="xiaButton||!readState" @click="prev(1)">上一篇</el-button>
        <el-button class="upButton" :loading="xiaButton" :disabled="shangButton||!readState" @click="next(2)">下一篇</el-button>
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
            关联作业: <a v-if="relatedObj.subState !==undefined && relatedObj.subState !=='0' && relatedObj.subState !=='1'" style="font-size: 16px;link: 2.5em;color: #409eff;" :underline="false" type="primary" class="cols" :href=" link.replace(/\/homework\/.*\/teacherView\//g,'/homeworkShare/'+relatedObj.id+'/studetailsShare/')" target="_blank">{{ relatedObj.subjectName }}</a>
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
          <li style="font-weight: bold;" class="scoreLi cols">
            一稿分数：{{ scoresData.scoreAll }}
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
    <el-row v-show="contentType==='0'">
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
      v-show="contentType==='1'"
      :name="'img'"
      url="/hwStuHomework/uploadContent"
      :file-list="fileList"
      :dis="toolDis"
      :before-handle-remove="beforeHandleRemove"
      @handlePreview="handlePreview"
    />
    <el-form ref="form" :model="tempForm" :rules="rulesForm" label-width="100px" label-position="left" style="margin-top: 1.5em;">
      <el-divider />
      <el-form-item label="总评" prop="tagComment" :rows="3">
        <comment-editor :key="dangqian.id" v-loading="contentLoading" :content="tempForm.tagComment" :editable="true" @content-change="onZongPingChange" />
      </el-form-item>
      <el-divider />
      <el-form-item label="语音总评">
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
          <el-button v-if="!audioShow && (!audioSrcList || audioSrcList && audioSrcList.length < 10)" class="upButton" @click="(e)=>{audioDirectUpload(e)}">上传</el-button>
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
      <el-form-item class="scolabel" label="分数">
        <el-row v-for=" (arr1,index1) in new Array(Math.ceil((num)/3))" :key="index1">
          <el-col v-for="(arr,index) in new Array(((num-(index1*3))>=3?3:(num-(index1*3))))" :key="index" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-tooltip class="item" effect="light" :content="scores[0]?scoreNames[((index1*3)+index)]+'/'+scores[((index1*3)+index)]+'分：':scoreNames[((index1*3)+index)]+'：'" placement="top-start">
              <el-form-item class="scorelabel" :label="scores[0]?scoreNames[((index1*3)+index)]+'/'+scores[((index1*3)+index)]+'分：':scoreNames[((index1*3)+index)]+'：'" :prop="'score'+((index1*3)+(index+1))">
                <el-input v-model="tempForm['score'+((index1*3)+(index+1))]" class="scoreClass" />
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item class="scorelabelAll" label="总分：" prop="scoreAll">
              <el-input v-model="tempForm.scoreAll" class="scoreClassAll" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-divider />
      <el-form-item label="作业标签" prop="jobTag">
        <el-radio-group v-model="tempForm.jobTag">
          <el-radio v-for="item in jobtags" :key="item.dictValue" :label="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!--    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="qa">追问解答</el-button>
      </el-col>
    </el-row>-->
    <div class="subcl">
      <div>
        <el-button v-show="!tjhButton" class="subButton" :disabled="saveButton || audioShow" @click.prevent="onSave('0')">保存</el-button>
      </div>
      <div>
        <el-button v-show="!tjhButton" class="subButton" :disabled="saveButton || audioShow" @click.prevent="okSubmit()">提交</el-button>
      </div>
    </div>

    <!-- 提交提示框 -->
    <el-dialog title="提示" :visible.sync="isSubmit" width="300px" center>
      <div class="del-dialog-cnt">确定提交吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSubmit = false">取 消</el-button>
        <el-button type="primary" :disabled="saveButton" @click="onSave('1')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="related" width="70%" style="height: 100%" center :top="iframeTop" :show-close="false">
      <div style="width: 100%;border:2px solid #616060">
        <iframe id="external-frame" frameborder="0" :src="link.replace(/\/homework\/.*\/teacherView\//g,'/homeworkShare/'+relatedObj.id+'/relatedStudetailsShare/')" :style="{width: '100%'}" />
        <el-button :disabled="!readState" type="danger" style="right: 8%;bottom: 5%;position: absolute" @click="closeRelatedIfream()">{{ readState?'已阅读完一稿':'还剩'+surplusReadTime+'s完成阅读' }}</el-button>
      </div>
    </el-dialog>

    <!-- 语音总评录音框 -->
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
import { getLoginSysUserVo } from '@/utils/auth'
import { getDictDataList } from '@/utils/dictUtils'
import { mapGetters } from 'vuex'
import { getTobeStuHomeworkListOne, addHwHomeworkAudit, getHwStuHomeworkPicList, getRelatedHomework } from '@/api/homework/hwHomework'
import { submitHomeworkTotalAudit, updateQa, deleteAudit, updateAudit, getAuditNumber, updateAuditTime, getReceiveHomework, updateCancelReceiveHomework, updateOrAddTagComment, uploadAuditAudio, saveAudioRelation } from '@/api/homework/homework'
import Editor from '@/views/homework/submissions/ReviewEditor'
import { isNum } from '@/utils/validate'
import uploadAssembly from './uploadAssembly'
import CommentEditor from '@/views/homework/submissions/CommentEditor'

import Recorder from 'recorder-core/recorder.mp3.min'
import { getToken } from '@/utils/auth'

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
      readTime: 20,
      readState: true,
      surplusReadTime: 20,
      readInterval: null,
      isContentType: '0',
      myHeaders: {},
      isSyss: [],
      fileList: [],
      toolDis: false,
      contentType: '0',
      xianzhi: false,
      saveButton: false,
      tjhButton: false,
      shangButton: false,
      xiaButton: false,
      numberList: [],
      indexNumber: 0,
      contentLoading: true,
      scoreNames: [],
      scores: [],
      jobtags: [],
      num: 0,
      isSubmit: false,
      isReceive: true,
      tagComment: null,
      oldTagComment: undefined,
      tempForm: {
        jobTag: null
      },
      cunchutime: {},
      itt: {},
      content: null,
      updatedContent: null,
      comments: [],
      repeat: {
        id: undefined,
        repeatComment: '干啥呢',
        repeatScore: 100
      },
      tagCommentTimer: undefined,
      qaTime: 10000,
      id: undefined,
      dangqian: {},
      relatedObj: { subState: '0' },
      relatedScoreNames: [],
      relatedScores: [],
      scoresData: {},
      related: false,
      iframeTop: '0px',
      link: '',
      pand: true,
      state: undefined,
      timer: undefined,
      dsq: false,
      dialogFormVisible: false,
      temp: {
        id: undefined,
        qaReply: undefined
      },
      rules: {
        qaReply: [{ required: true, message: '请输入追问内容', trigger: 'blur' }]
      },
      rulesForm: {
      },
      // 录音
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
        let pd = false
        for (let i = 0; i < this.scoreNames.length; i++) {
          if (this.tempForm['score' + (i + 1)] !== undefined) {
            pd = true
            scor = scor + new Number(this.tempForm['score' + (i + 1)])
          }
        }
        if (scor === 0) {
          if (pd) {
            this.tempForm.scoreAll = 0
          } else {
            this.tempForm.scoreAll = undefined
          }
        } else {
          this.tempForm.scoreAll = scor
        }
      }
    }
  },
  methods: {
    closeRelatedIfream() {
      if (this.readState) {
        this.related = false
        this.receive()
      }
    },
    setIframeHeight(iframe) {
      console.log(window.innerHeight)
      iframe.height = window.innerHeight * 0.8
      this.iframeTop = window.innerHeight * 0.1 + 'px'
    },
    beforeHandleRemove(file, fileList) {
      return false
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
      window.open(routeUrl.href, this.id + 'stuyImg')
    },
    clearJob() {
      clearInterval(this.tagCommentTimer)
      this.tagCommentTimer = null
    },
    onSaveTagComment() {
      if (this.oldTagComment !== this.tempForm.tagComment) {
        if (!this.xianzhi) {
          this.xianzhi = true
          updateOrAddTagComment({ stuHomeworkId: this.id, tagComment: this.tempForm.tagComment }).then(res => {
            if (res.success && res != null) {
              this.oldTagComment = this.tempForm.tagComment
              this.xianzhi = false
            }
          })
        } else {
          console.log('手动保存中...')
        }
      } else {
        console.log('未更改无须保存')
      }
    },
    onZongPingChange(data) {
      this.tempForm.tagComment = data
    },
    okSubmit() {
      /*      const tempFormnew = JSON.parse(JSON.stringify(this.tempForm))
          this.load(this.dangqian)
          this.tempForm = tempFormnew*/
      this.$refs['form'].clearValidate()
      this.dongtai()
      this.$nextTick(() => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isSubmit = true
          }
        })
      })
    },
    receiveHomework(state) {
      if (state === '0') {
        if (this.dangqian.relatedHomeworkId) {
          this.related = true
          this.$nextTick(() => {
            document.getElementById('external-frame').contentWindow.location.reload()
            this.setIframeHeight(document.getElementById('external-frame'))
            this.readState = false
            this.surplusReadTime = this.readTime
            this.readInterval = setInterval(() => {
              if (this.surplusReadTime === 0) {
                this.readState = true
                clearInterval(this.readInterval)
                this.readInterval = null
              } else {
                this.surplusReadTime = this.surplusReadTime - 1
              }
            }, 1000)
          })
          return false
        } else {
          this.receive()
        }
      } else {
        updateCancelReceiveHomework(this.dangqian.id).then(res => {
          if (res.data != null && res.data) {
            this.isReceive = false
            this.$message.success('作业取消成功！')
            this.loadContent(this.dangqian.id)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    receive() {
      getReceiveHomework(this.dangqian.id).then(res => {
        if (res.data != null && res.data) {
          this.isReceive = true
          this.$message.success('作业领取成功！')
          this.onlyList(this.dangqian.id)
          // this.loadContent(this.dangqian.id)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    prev() {
      if (this.indexNumber > 0) {
        this.tjhButton = false
        this.shangButton = true
        this.indexNumber = this.indexNumber - 1
        this.clearJob()
        this.loadContent(this.numberList[this.indexNumber].id)
      } else {
        if (this.numberList[this.indexNumber].num === 1) {
          this.$message.error('已经是第一篇了')
        } else {
          this.tjhButton = false
          this.shangButton = true
          this.clearJob()
          this.loadContent(this.numberList[this.indexNumber].id)
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
    next() {
      if (this.numberList.length === 2 && this.indexNumber === 1) {
        this.$message.error('已经是最后一篇，没有更多了！')
        return false
      }
      if (this.numberList.length === 1) {
        this.$message.error('已经是最后一篇，没有更多了！')
        return false
      }
      this.tjhButton = false
      this.xiaButton = true
      this.indexNumber = this.indexNumber + 1
      this.clearJob()
      this.loadContent(this.numberList[this.indexNumber].id)
    },
    xiangqin(id) {
      const url = '/homework/' + id + '/details/0'
      const routeUrl = this.$router.resolve({
        path: url
      })
      window.opener = null
      window.open(routeUrl.href, '' + id + 'tea')
      // window.close()
    },
    onSave(state) {
      if (this.xianzhi) {
        this.$message.error('自动保存未结束，请稍后再试')
        return false
      }
      this.saveButton = true
      this.$refs['form'].clearValidate()
      this.saveOrSubmit(state)
      this.$nextTick(() => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const dat = []
            const map = this.tempForm
            const maps = {}
            const scores = this.dangqian.subScoreCount.split(',')
            if (scores && scores.length > 0) {
              for (let key = 0; key < scores.length; key++) {
                dat.push({ stuHomeworkId: this.id, socreNumber: key, score: map['score' + (key + 1)], auditType: 0 })
              }
              dat.push({ stuHomeworkId: this.id, socreNumber: scores.length, score: map['scoreAll'], auditType: 1 })
            }
            maps['list'] = dat
            maps['content'] = this.updatedContent // editor.getData()
            maps['tagComment'] = this.tempForm.tagComment // 總評？？？
            maps['jobTag'] = this.tempForm.jobTag
            maps['stuHomeworkId'] = this.id
            maps['state'] = state
            maps['audioIdDelList'] = this.audioIdDelList
            this.xianzhi = true
            submitHomeworkTotalAudit(maps).then(res => {
              this.xianzhi = false
              this.saveButton = false
              if (res.data != null && res.data) {
                if (state === '1') {
                  this.$message.success('提交成功')
                  this.isSubmit = false
                  /*                  if ((this.numberList.length === 2 && (this.indexNumber === 1)) || (this.numberList.length === 1 && (this.indexNumber === 0))) {
                        this.xiangqin()
                      } else {
                        // this.next()

                      }*/
                  this.tjhButton = true
                } else {
                  this.$message.success('保存成功')
                  this.loadContent(this.dangqian.id)
                }
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.saveButton = false
          }
        })
      })
    },
    createComment({ data, success, error }) {
      data['stuHomeworkId'] = this.id
      data['content'] = this.updatedContent // editor.getData()
      console.log(this.updatedContent)
      console.log(editor.getData())
      addHwHomeworkAudit(data).then(res => {
        if (res.data != null && res.data) {
          // console.log('-- after save', res.data)
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
    updateComment({ data, success, error }) {
      updateAudit(data).then(res => {
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
    deleteComment({ data, success, error }) {
      deleteAudit(data.id).then(res => {
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
    loadComments() {
      this.comments = []
    },
    saveData() {
      // console.log('Save data to localStorage')
      localStorage.setItem('localTempDocument', this.updatedContent)
    },
    loadContent(id) {
      const that = this
      let classId = 110
      if (this.numberList[this.indexNumber]) {
        classId = this.numberList[this.indexNumber].classId
      }
      getAuditNumber(id, classId).then(res => {
        if (res.success && res.data !== null && res.data.length > 0) {
          this.numberList = [...res.data]
          this.numberList.forEach(function(a, b) {
            if (a.position === '1') {
              that.indexNumber = b
              that.onlyList(that.numberList[that.indexNumber].id)
              return
            }
          })
        } else {
          this.xiangqin(id)
          return false
        }
      })
    },
    saveOrSubmit(state) {
      if (state === '0') {
        this.$set(this, 'rulesForm', {
          jobTag: [{ required: true, message: '请选择批改标签', trigger: 'change' }]
        })
      }
    },
    tagCommetValidator(rule, value, callback) {
      if (this.tempForm.tagComment) {
        callback()
      } else {
        callback(new Error('请输入总评'))
      }
    },
    dongtai() {
      this.$set(this, 'rulesForm', {
        scoreAll: [{ required: true, message: '请输入分数', trigger: 'blur' }, { validator: isNum, trigger: 'blur' }],
        tagComment: [{ required: true, validator: this.tagCommetValidator, trigger: 'blur' }],
        jobTag: [{ required: true, message: '请选择批改标签', trigger: 'blur' }]
      })
      const scores = this.dangqian.subScoreCount.split(',')
      if (scores && scores.length > 0) {
        for (let i = 0; i < scores.length; i++) {
          this.rulesForm['score' + (i + 1)] = [{ required: true, message: '请输入分数', trigger: 'blur' }, { validator: this.scoreNum, trigger: 'blur' }]
        }
      }
    },
    load(dd) {
      this.clearJob()
      this.content = ''
      this.contentLoading = true
      this.$set(this, 'dangqian', dd)
      if (this.dangqian.isUsed === 0) {
        this.isReceive = true
      } else {
        this.isReceive = false
      }
      this.scoreNames = this.dangqian.subScoreCount.split(',')
      if (this.dangqian.subScores) {
        this.scores = this.dangqian.subScores.split(',')
      }
      this.num = this.scoreNames.length
      this.tagComment = this.unescape(this.dangqian.tagComment)
      // this.temp.tagComment = this.unescape(this.dangqian.tagComment)
      this.oldTagComment = this.unescape(this.dangqian.tagComment)
      // this.repeatComment = this.unescape(this.dangqian.repeatComment)
      this.tempForm.jobTag = this.dangqian.jobTag
      this.tempForm.tagComment = this.unescape(this.dangqian.tagComment)
      this.$set(this, 'rulesForm', {
        scoreAll: [{ required: true, message: '请输入分数', trigger: 'blur' }, { validator: isNum, trigger: 'blur' }],
        tagComment: [{ required: true, validator: this.tagCommetValidator, trigger: 'blur' }],
        jobTag: [{ required: true, message: '请选择批改标签', trigger: 'blur' }]
      })
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
        this.content = this.unescape(this.dangqian.content)
        this.comments = this.dangqian.listAudit
      })
      const scorelist = this.dangqian.listScore
      const arr = new Array((this.scoreNames.length + 1))
      if (arr.length < 2) {
        if (scorelist.length > 0) {
          this.$set(this.tempForm, 'scoreAll', scorelist[scorelist.length - 1].score)
        } else {
          this.$set(this.tempForm, 'scoreAll', undefined)
        }
      }
      if (arr.length !== 1 && scorelist.length <= arr.length) {
        for (let key = 0; key < arr.length; key++) {
          if (scorelist.length < 2) {
            if (key === (arr.length - 1)) {
              this.$set(this.tempForm, 'scoreAll', undefined)
            } else {
              this.$set(this.tempForm, 'score' + (key + 1), undefined)
              this.rulesForm['score' + (key + 1)] = [{ required: true, message: '请输入分数', trigger: 'blur' }, { validator: this.scoreNum, trigger: 'blur' }]
            }
          } else {
            if (key < arr.length - 1) {
              if ((key < (scorelist.length - 1))) {
                this.$set(this.tempForm, 'score' + (key + 1), scorelist[key].score)
              } else {
                this.$set(this.tempForm, 'score' + (key + 1), undefined)
              }
              this.rulesForm['score' + (key + 1)] = [{ required: true, message: '请输入分数', trigger: 'blur' }, { validator: this.scoreNum, trigger: 'blur' }]
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
          this.rulesForm['score' + (key + 1)] = [{ required: true, message: '请输入分数', trigger: 'blur' }, { validator: this.scoreNum, trigger: 'blur' }]
        }
        this.$set(this.tempForm, 'scoreAll', scorelist[scorelist.length - 1].score)
      }
      console.log(this.tempForm)

      this.id = this.dangqian.id
      if (!this.cunchutime[this.dangqian.id]) {
        const da = { id: this.dangqian.id, type: '0' }
        updateAuditTime(da).then(resss => {
          if (resss.success) {
            this.cunchutime[this.dangqian.id] = true
          }
        })
      }
      this.state = this.dangqian.subState

      // 语音
      if (this.dangqian.hwHomeworkAuditAudioQueryVoList && this.dangqian.hwHomeworkAuditAudioQueryVoList.length > 0) {
        this.audioSrcList = this.dangqian.hwHomeworkAuditAudioQueryVoList.map(item => {
          if (item.audioType === 1) {
            return item
          } else {
            return null
          }
        }).filter(item => item)
      }

      this.dsq = true
      this.contentLoading = false
      if (this.isReceive) {
        this.tagCommentTimer = setInterval(this.onSaveTagComment, this.qaTime)
      }
    },
    updateContent(data) {
      // 接收 editor 里修改后的内容
      // 不要把 data 存回 content，改变 content 会触发 editor 加载新数据，光标位置会被重设
      // 如果要跟踪每次更改，可以另外开一个字段存储
      // this.content = data // error
      this.updatedContent = data
    },
    reloadData() {
      this.contentLoading = true

      // 或者 ajax 从 server 取数据
      this.content = '与君歌一曲，请君为我倾耳听。(倾耳听 一作：侧耳听)钟鼓馔玉不足贵，但愿长醉不愿醒。(不足贵 一作：何足贵；不愿醒 一作：不复醒)古来圣贤皆寂寞，惟有饮者留其名。(古来 一作：自古；惟 通：唯)'

      this.contentLoading = false
    },
    qaAnswer(item) {
      this.itt = item
      this.temp.id = item.id
      this.temp.qaReply = undefined
      this.dialogFormVisible = true
    },
    /*    qa() {
          this.temp.id = undefined
          this.qaReply = undefined
          this.temp.stuHomeworkId = undefined
          this.temp.qaContent = undefined
          this.dialogFormVisible = true
        },*/
    scoreNum(rule, value, callback) {
      const age = /^[0-9]*$/
      if (!age.test(value)) {
        callback(new Error('只能为数字'))
      } else {
        const index = rule.field.substr(rule.field.length - 1) - 1
        const sxScore = new Number(this.scores[index])
        if (new Number(value) > sxScore) {
          callback(new Error('批改子分数超出' + sxScore + '，请修改！'))
        } else {
          callback()
        }
      }
    },
    qaSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateQa(this.temp).then(response => {
            if (response.data != null && response.data) {
              this.itt.qaReply = this.temp.qaReply
              console.log(this.list)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '成功',
                message: response.msg,
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    onlyList(id) {
      const that = this
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
        this.shangButton = false
        this.xiaButton = false
        const that = this
        const dd = response.data
        this.dangqian = dd
        if (dd.auditReadTime) {
          that.cunchutime[dd.id] = dd.auditReadTime
        }
        dd.content = that.unescape(dd.content)
        const listnewau = []
        const listau = dd.listAudit
        // console.log(listau)
        listau.forEach(function(c, d) {
          c.tagComment = that.unescape(c.tagComment)
          c.repeatComment = that.unescape(c.repeatComment)
          listnewau.push(c)
        })
        dd.listAudit = listnewau
        this.load(dd)
        this.id = this.dangqian.id
        this.state = this.dangqian.subState
        this.dsq = true
        console.log(this.tempForm)
        console.log(this.scoreNames)
      }).catch(() => {
        this.shangButton = false
        this.$message.error('出错了，刷新页面重试')
      })
    },
    getContent() {
      return this.unescape(this.dangqian.content)
    },
    download(id) {
      window.location.href = '/hwHomeworkMaterial/downloadMaterial/' + id
      // window.open('/hwHomeworkMaterial/downloadMaterial/' + id)
    },
    // 录音
    openAudio() {
      const userId = getLoginSysUserVo().id
      const isUsed = this.dangqian.isUsed
      const isUsedUser = this.dangqian.isUsedUser
      if (isUsedUser === userId) {
        this.audioReady()
      } else if (isUsed == null) {
        this.$message.error('请先领取作业')
      } else {
        if (isUsedUser !== userId) {
          this.$message.error('作业被其他老师领取')
        }
      }
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
              audioType: 1
            }
            saveAudioRelation(hwHomeworkAuditAudio).then(sares => {
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
    handleAudioSuccess(res, file) {
      if (res.success && res.data != null && res.data) {
        // 绑定
        const hwHomeworkAuditAudio = {
          stuHomeworkId: this.id,
          audioUrl: res.data,
          audioType: 1
        }
        saveAudioRelation(hwHomeworkAuditAudio).then(sares => {
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
    audioDirectUpload(e) {
      const userId = getLoginSysUserVo().id
      const isUsed = this.dangqian.isUsed
      const isUsedUser = this.dangqian.isUsedUser
      if (isUsedUser === userId) {
      } else if (isUsed == null) {
        this.$message.error('请先领取作业')
        e.stopPropagation()
      } else if (isUsedUser !== userId) {
        this.$message.error('作业被其他老师领取')
        e.stopPropagation()
      } else {
        e.stopPropagation()
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
  .subcl{
    /*
        margin-left: calc((100% - 897px)/2);
    */
    width: 100%;
    padding-left: 100px;
    padding-top: 1.5em;
    height: 100px;
  }

  .subcl div{
    width: 180px;
    float: left;
  }
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
  /deep/ .zonping .el-textarea__inner{
    color: #333333;
    font-family: '宋体 常规', '宋体', sans-serif;
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
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
      line-height: 2.5em;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: normal;
      font-style: normal;
    }
  }

  /deep/ .subject{
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
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
  /deep/ .el-textarea__inner{
    border: 1px solid #797979;
  }
  .wenben{
    height: 23px;
    overflow: auto;
  }

  .complete{
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
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

  .upButton{
    color: #333333;
    border: 1px solid #333333;
  }
  .zhuwenButton{
    color: #333333;
    border: 1px solid #797979;
    margin-top: 0.5em;
  }

  /deep/ .el-textarea__inner{
    border: 1px solid #797979;
  }

  /deep/ .el-radio__label {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
  }

  /deep/ .el-radio__inner{
    border-color: #333333;
    cursor: pointer;
    width: 16px;
    height: 16px;
  }

  /deep/ .el-radio__inner::after {
    background-color: #333333;
  }

  /deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #333333;
  }

  /deep/ .el-radio__input.is-checked .el-radio__inner {
    border-color: #333333;
    background: #FFF;
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
