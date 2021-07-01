<template>
  <div class="app-wrapper">
    <top-nav />

    <div class="container">
      <navbar />
      <div class="box">
        <h2>这里是作业批改介面</h2>
        <p>老师和学生都有用到这个页面</p>
        <p>老师在这个页面里可以对作业进行批改，而学生只能查看</p>

        <el-button @click.prevent="reloadData">Reload</el-button>
        <el-button @click.prevent="saveData">Save</el-button>
        <el-button @click.prevent="toggleCommentable">Toggle Commentable</el-button>

        <dou-editor :content="{}" />

        <editor
          v-if="true"
          v-loading="contentLoading"
          :stud-homework-id="1111"
          :content="content"
          :comments="comments"
          :editable="true"
          :commentable="commentable"
          :reviewable="true"
          @content-change="updateContent"
          @comment-create="createComment"
          @comment-update="updateComment"
          @comment-delete="deleteComment"
          @review-update="updateReview"
          @review-delete="deleteReview"
        />

      </div>
    </div>

  </div>
</template>

<script>
import TopNav from '@/views/homework/shared/TopNav'
import Navbar from '@/views/homework/shared/Navbar'
import Editor from './ReviewEditor'
import { getLoginSysUserVo } from '@/utils/auth'

import DouEditor from '@/views/homework/assignments/DecoupledEditor'

export default {
  name: 'Dashboard',
  components: {
    Navbar,
    TopNav,
    Editor,
    DouEditor
  },
  data() {
    return {
      contentLoading: true,
      content: null,
      updatedContent: null,
      comments: [],
      commentable: true
    }
  },
  created() {
    this.loadContent()
  },
  methods: {
    toggleCommentable() {
      this.commentable = !this.commentable
    },
    updateReview({ data, success, error }) {
      console.log(data)

      // 这是调用 api 进行各种 action 的例子
      // 下面几个 methods 一样的用法
      _updateReview(data).then(res => {
        if (res.success) {
          // dummy code
          const { tagParagraph } = data
          const comment = this.comments.find(c => c.tagParagraph === tagParagraph)
          comment.repeatTeacherId = getLoginSysUserVo().id
          comment.repeatComment = data.repeatComment

          // TODO: 更新 comments
          // this.comments = refreshCommentList
          success() // 成功后调用 editor 提供的 success 回调
        } else {
          error()
        }
      })
    },
    deleteReview({ data, success, error }) {
      // dummy code
      const { tagParagraph } = data
      const comment = this.comments.find(c => c.tagParagraph === tagParagraph)
      comment.repeatComment = null
      comment.repeatTeacherId = null

      success()
    },

    createComment({ data, success, error }) {
      // console.log(data)

      data.auditTeacherId = getLoginSysUserVo().id
      this.comments.push(data)

      success()
    },
    updateComment({ data, success, error }) {
      console.log(data)

      const { tagParagraph } = data
      const comment = this.comments.find(c => c.tagParagraph === tagParagraph)
      comment.tagComment = data.tagComment

      success()
    },
    deleteComment({ data, success, error }) {
      console.log(data)

      const { tagParagraph } = data
      const idx = this.comments.findIndex(c => c.tagParagraph === tagParagraph)
      if (idx > -1) {
        this.comments.splice(idx, 1)
      }

      success()
    },
    loadComments() {
      this.comments = []
    },
    saveData() {
      // console.log('Save data to localStorage')
      localStorage.setItem('localTempDocument', this.updatedContent)
    },
    loadContent() {
      this.contentLoading = true

      // 或者 ajax 从 server 取数据
      this.content = localStorage.getItem('localTempDocument') || ''

      this.contentLoading = false
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
    }
  }
}

// 这是个从 api import 的 function（假的）
function _updateReview() {
  // nothing here
  return new Promise(function(resolve, reject) {
    // just wait for 300ms
    setTimeout(function() {
      resolve({ success: true })
    }, 300)
  })
}
</script>

<style lang="scss">
  @import "@/views/homework/shared/StyleFix.scss";
  body {
    background: #f7f7f7;
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
