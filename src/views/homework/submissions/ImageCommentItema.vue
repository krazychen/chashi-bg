<template>

  <div ref="commentElem" :class="classObj" @click="focusOn">
    <template v-if="exp">
      <!--      <blockquote :class="quoteTextClasses" @click.stop="toggle">
        你好
      </blockquote>-->
      <div class="comment-body">
        <div class="comment-content container">
          <div v-if="head" class="user-profile flex center">
            <div class="tiny-profile">
              <e-avatar :username="comment.auditTeacherName?comment.auditTeacherName:''" :src="comment.auditTeacherAvatar?comment.auditTeacherAvatar:''" :size="18" :rounded="false" />
              <span class="username">{{ comment.auditTeacherName }}</span>
            </div>
            <span class="time">{{ comment.auditTime }}</span>
            <template v-if="reviewable">
              &middot; <el-button size="mini" type="text" @click.prevent="onStartReview">复评</el-button>
            </template>

            <template v-if="auditState==='0'">
              &middot; <el-button size="mini" type="text" @click.prevent="onStartEditing">編輯</el-button>

              <el-popconfirm v-if="auditState==='0'" title="确认删除？" @confirm="onDeleteComment">
                <el-button slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </div>

          <div v-if="editing" class="container">
            <el-form :inline="true" :model="form">
              <comment-editor :content.sync="tagComment" :editable="true" @content-change="onCommentChange" />
              <el-form-item style="display: block; text-align: right; margin: 0;">
                <el-button type="primary" size="small" @click="onCommentUpdate">确认</el-button>
                <el-button size="small" @click="cancel()">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="content" v-html="comment.tagComment" />
        </div>

        <div v-if="comment.repeatComment" class="review-content container">
          <div class="user-profile flex center">
            <div class="tiny-profile">
              <e-avatar :username="comment.repeatTeacherName?comment.repeatTeacherName:''" :src="comment.repeatTeacherAvatar?comment.repeatTeacherAvatar:''" :size="18" :rounded="false" />
              <span class="username">{{ comment.repeatTeacherName }}</span>
            </div>

            <span class="time">{{ comment.repeatTime }}</span>
            <template v-if="reviewable">
              &middot; <el-button size="mini" type="text" @click="onStartReview">编辑</el-button>
              <el-popconfirm title="确认删除？" @confirm="onDeleteReview">
                <el-button slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </div>
          <div v-if="!reviewing" class="content" v-html="comment.repeatComment" />
        </div>

        <div v-if="reviewing" class="container">
          <el-form :inline="true" :model="form">
            <comment-editor :content="repeatComment" :editable="true" @content-change="onReviewChange" />
            <el-form-item style="display: block; text-align: right; margin: 0;">
              <el-button type="primary" size="small" @click="onReviewSubmit">确认</el-button>
              <el-button size="small" @click="reviewing = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <!--    <template>
      <blockquote class="compact" v-html="comment.tagComment" />
    </template>-->
  </div>

</template>

<script>
import EAvatar from 'vue-avatar'
import { mapGetters } from 'vuex'

import CommentEditor from './ImageCommentEditor'
// import TinyProfile from './TinyProfile'

export default {
  components: {
    CommentEditor,
    EAvatar
  },
  props: {
    auditState: {
      type: String,
      default: '1'
    },
    comment: {
      type: Object,
      required: true
    },
    reviewable: {
      type: Boolean,
      default: false
    },
    commentable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      head: this.comment.head,
      quotedText: null,
      exp: true,
      quotedElems: [],
      editing: false,
      reviewing: false,
      tagComment: this.comment.tagComment,
      repeatComment: this.comment.repeatComment,
      form: {}
    }
  },
  watch: {
    comment(value) {
      this.tagComment = '1'
      // this.tagComment = value.tagComment
      this.head = value.head
      this.$nextTick(() => {
        this.tagComment = value.tagComment
        this.repeatComment = value.repeatComment
      })
    },
    editing() {
      this.$nextTick(() => {
        this.$emit('setting-popup')
      })
    },
    reviewing() {
      this.$nextTick(() => {
        this.$emit('setting-popup')
      })
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'userInfo'
    ]),
    classObj() {
      const classes = ['comment']
      /*      if (this.quotedElems.length > 0) {
          // console.log(this.quotedElems[0].classList)
          this.quotedElems[0].classList.forEach(x => classes.push(x))
        }*/
      return classes
    },
    quoteTextClasses() {
      return this.exp ? null : 'inline'
    }
  },
  mounted() {

  },
  updated() {
    // console.log('-- comment updated')
  },
  created() {

  },
  methods: {
    setStates(state) {
      this.editing = state
    },
    setStatess() {
      this.reviewing = false
      this.editing = false
    },
    onReviewSubmit() {
      this.$emit('update-review', {
        data: this.form,
        success: () => {
          this.tagComment = this.form.repeatComment
          this.reviewing = false
        },
        error: () => {
          // show error msg
        }
      })
    },
    onReviewChange(data) {
      this.form.repeatComment = data
    },
    cancel() {
      if (this.comment.id) {
        this.editing = false
      } else {
        this.$emit('cancel', false)
      }

      // this.$emit('cancel', false)
    },
    onCommentUpdate() {
      this.$emit('update-comment', { id: this.comment.id, tagComment: this.form.tagComment })
    },
    onCommentChange(data) {
      this.form.tagComment = data
      // this.tagComment = data
    },
    onDeleteComment() {
      // this.focusOn(this.comment)
      this.$emit('delete-comment', {
        data: this.comment,
        success: () => {
          // nothing
        },
        error: () => {
          // show error msg
        }
      })
    },
    onStartEditing() {
      this.editing = true
    },
    onStartReview() {
      this.reviewing = true
    },
    focusOn() {
      this.exp = true
    },
    toggle() {
      this.exp = !this.exp
    },
    onDeleteReview() {
      this.$emit('delete-review', {
        data: this.comment,
        success: () => {
          // nothing
          console.log(this.comment)
          this.$forceUpdate()
        },
        error: () => {
          // show error msg
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .comment {
    background-color: #fbd4d0 !important;
    border-color: #fbd4d0;
    line-height: 1.5;
    // background: #fff;
    color: #333;
    word-break: break-all;
    // border: 2px solid #ccc;
    border-width: 2px;
    border-style: solid;
    border-radius: 2px;
    // margin-bottom: 1em;
    margin-bottom: 2px;
    transition: transform all 1s;

    .comment-body {
      background: #fff;
    }

    blockquote {
      padding: .5em;
      margin: 0;
      display: block;
      // color: #111;

      &.inline {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      &.compact {
        padding: 4px;
        background: #fff;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

    }

    .flex{
      display: flex;
    }
    .flex.center {
      align-items: center;
    }

    .comment-content {
      padding: .5em;
    }

    .user-profile {
      white-space: nowrap;
      flex-wrap: wrap;
      line-height: 2em;

      .vue-avatar--wrapper {
        flex: 0 0 18px;
        margin-right: .5em;
      }
      .username {
        font-weight: bold;
        margin: 0 .5em;
      }

      .time {
        display: block;
        color: #999;
        font-size: 12px;
      }
    }

    .content {
      margin: .5em 0;
      text-align: left;
    }

    .review-content {
      background: #f3fffe;
      border-top: 1px solid #bee3e8;
    }
    .container{
      padding: .5em;
    }

    .document-editor {
      margin-bottom: 10px;
    }
  }

  .comment.marker-yellow {
    border-color: var(--marker-yellow);
  }
  .comment.marker-green {
    border-color: var(--marker-green);
  }
  .comment.marker-pink {
    border-color: var(--marker-pink);
  }
  .comment.marker-blue {
    border-color: var(--marker-blue);
  }

  .comment.marker-yellow blockquote {
    background: var(--marker-yellow);
  }
  .comment.marker-green blockquote {
    background: var(--marker-green);
  }
  .comment.marker-pink blockquote {
    background: var(--marker-pink);
  }
  .comment.marker-blue blockquote {
    background: var(--marker-blue);
  }

  .tiny-profile {
    display: flex;
    align-items: center;
    margin-right: .5em;
    width: 100%;
  }
  .tiny-profile .vue-avatar--wrapper {
    margin-right: .5em;
  }

  /deep/ .el-button--text {
    color: #999;
  }

  /deep/ .ck.ck-toolbar {
    border: none !important;
  }

  /deep/ blockquote.compact * {
    display: inline;
  }

  /deep/ blockquote.compact br {
    display: none;
  }
  /deep/ .document-editor .editable-container .ck-editor__editable{
    max-height: 100px !important;
  }
  .content{
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>
