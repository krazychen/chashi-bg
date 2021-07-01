<template>
  <div class="document-editor">
    <div ref="toolbar" :class="toolbarClasses" />
    <div class="editable-container">

      <ckeditor v-if="!editorConfigLoading" id="editor" v-model="editorData" :editor="editor" :config="editorConfig" :disabled="!editable" @ready="onReady" />

      <canvas id="comment-guideline" />
      <div v-if="comments.length > 0" :class="asideClass">
        <div v-for="comment in sortedComments" :key="comment.tagParagraph" class="comment-wrapper">
          <i class="fa fa-comment-o" @click="showComment = showComment === comment.tagParagraph ? null : comment.tagParagraph" />
          <comment-item
            v-show="showAllComments || showComment === comment.tagParagraph"
            :comment="comment"
            :commentable="commentable"
            :reviewable="reviewable"
            @update-comment="updateComment"
            @delete-comment="deleteComment"
            @update-review="updateReview"
            @delete-review="deleteReview"
            @select-comment="guideToComment"
            @comment-loaded="onCommentLoaded"
          />
        </div>
      </div>
    </div>

    <div class="footer">
      <div ref="wordCount" />
    </div>

    <div id="w999" />
  </div>
</template>

<script>
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor'
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline'
import FontColorPlugin from '@ckeditor/ckeditor5-font/src/fontcolor'
import AlignmentPlugin from '@ckeditor/ckeditor5-alignment/src/alignment'
// import FontColorPlugin from '@ckeditor/ckeditor5-font/src/fontcolor'
// import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage'
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import ListPlugin from '@ckeditor/ckeditor5-list/src/list'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
// import Table from '@ckeditor/ckeditor5-table/src/table'
// import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave'
// import BlockToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar'
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'
import { modelElementToPlainText } from '@ckeditor/ckeditor5-word-count/src/utils'
// import Position from '@ckeditor/ckeditor5-engine/src/view/position'
// import Range from '@ckeditor/ckeditor5-engine/src/view/range'

// override the plugin to remove the space, duplicate code, should do some refactor
WordCount.prototype._getCharacters = function() {
  const txt = modelElementToPlainText(this.editor.model.document.getRoot())
  return txt.replace(/(\n|\s)/g, '').length
}

import CommentPlugin from '@/views/homework/comment-plugin/src/comment'

import IndentTextPlugin from '@/views/homework/indent-text-plugin/src/indent-text'

import CommentItem from './CommentItem'

const TOOLBAR_ITEMS = [
  'insertTable',
  '|',
  'heading',
  '|',
  'bold',
  'italic',
  'underline',
  'fontColor',
  '|',
  'indentLeft',
  'indentRight',
  '|',
  'bulletedList',
  'numberedList',
  '|',
  'alignment',
  '|',
  'link',
  'undo',
  'redo'
]

export default {
  components: {
    // CommentEditor,
    CommentItem
  },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    commentable: {
      type: Boolean,
      defualt: false
    },
    comments: {
      type: Array,
      required: true
    },
    reviewable: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    studHomeworkId: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      // drawer: false,
      // commentId: 0, // dmeo ID
      // comments: [], // demo Comments
      // selection: null,
      // selectedRange: null,
      // commentForm: {
      //   ...commentTemplate
      // },
      // isCommentReview: false,
      editorConfigLoading: true,
      showComment: null,
      showAllComments: true
    }
  },
  computed: {
    toolbarClasses() {
      const cs = ['toolbar']
      if (this.commentable) {
        cs.push('commentable')
      }
      return cs
    },
    asideClass() {
      const cs = ['aside']
      if (!this.showAllComments) {
        cs.push('collapse')
      }
      return cs
    },
    sortedComments() {
      const uuids = []
      document.querySelectorAll('#editor .comment-marker').forEach(el => {
        const uuid = el.getAttribute('uuid')
        if (!uuids.includes[uuid]) {
          uuids.push(uuid)
        }
      })
      // console.log(uuids)
      if (uuids.length > 0) {
        // use slice to clone the comment array
        return this.comments.slice().sort((c1, c2) => {
          return uuids.indexOf(c1.tagParagraph) - uuids.indexOf(c2.tagParagraph)
        })
      } else {
        return this.comments
      }
    }
  },
  watch: {
    content(newContent, oldContent) {
      // there is a fucking bug here!!!!
      // this setData will trigger the downcast to flush nested comments
      this.editorHandler.setData(newContent)
    }
  },
  mounted() {
    this.prepareConfig()

    // window.removeEventListener('save-comment', this.createComment)
    window.addEventListener('save-comment', this.createComment)

    // window.removeEventListener('save-comment', this.createComment)
    window.addEventListener('toggle-comments', () => {
      this.showAllComments = !this.showAllComments

      // new HelloCtor({
      //   propsData: {
      //     comment: this.comments[0],
      //     commentable: this.commentable,
      //     reviewable: this.reviewable
      //   }
      // }).$mount('#w999')
    })

    // window.removeEventListener('remove-comment', this.onCommentDeleteFromEditor)
    // window.addEventListener('remove-comment', this.onCommentDeleteFromEditor)

    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('comment-marker')) {
        // console.log('-- click', event.target)
        // const c = event.target
        // const uuid = c.getAttribute('uuid')
        // this.guideToComment(uuid)
        const uuid = event.target.getAttribute('uuid')
        const customEvent = new CustomEvent('toggle-comment', {
          detail: { uuid }
        })
        window.dispatchEvent(customEvent)
      }
    })
  },
  methods: {
    onCommentLoaded(uuid) {
      // console.log('-- on comment loaded', uuid)

      this.$nextTick(() => {
        this.adjustCommentsPosition()
      })
    },
    getOffsetTop(elem) {
      let top = elem.offsetTop
      if (elem.offsetParent && !elem.offsetParent.classList.contains('editable-container')) {
        if (elem.offsetParent.classList.contains('comment-marker')) {
          top = this.getOffsetTop(elem.offsetParent)
        } else {
          top += this.getOffsetTop(elem.offsetParent)
        }
      }
      return top
    },
    adjustCommentsPosition() {
      // console.log('-- adjust comments position')
      const uuids = []
      const comments = document.querySelectorAll('.aside .comment-marker')
      comments.forEach(el => uuids.push(el.getAttribute('uuid')))
      // console.log(uuids)

      // 先根據所有編輯器的文字位置安排 comment 的初始 top
      comments.forEach(comment => {
        const uuid = comment.getAttribute('uuid')
        // 查找編輯起中框選的文字
        const contentNode = document.querySelector(`#editor .comment-marker[uuid='${uuid}']`)
        const contentTop = this.getOffsetTop(contentNode) - 20.5

        const commentWrapper = comment.parentElement
        commentWrapper.style.top = contentTop + 'px'
      })

      // 檢查每個 comment 如果和前一個重疊，就全部往下推
      let prevCommentWrapper = null
      comments.forEach(comment => {
        const commentWrapper = comment.parentElement
        const commentTop = parseFloat(commentWrapper.style.top)

        if (prevCommentWrapper) {
          const minTop = parseFloat(prevCommentWrapper.style.top) + prevCommentWrapper.offsetHeight

          // console.log(minTop, commentTop)
          if (commentTop < minTop) {
            commentWrapper.style.top = minTop + 'px'
          }
        }

        prevCommentWrapper = commentWrapper
      })
    },
    guideToComment(uuid) {
      // console.log('-- guide to comment', uuid)
      if (uuid) {
        this.showComment = uuid
        document.querySelectorAll('.comment-marker.hl').forEach(el => el.classList.remove('hl'))
        document.querySelectorAll(`.comment-marker[uuid='${uuid}']`).forEach(comment => {
          comment.classList.add('hl')
        })

        const contentNode = document.querySelector(`#editor .comment-marker[uuid='${uuid}']`)
        const commentNode = document.querySelector(`.aside .comment-marker[uuid='${uuid}']`)

        if (commentNode && contentNode) {
          document.querySelectorAll('.onTop').forEach(el => el.classList.remove('onTop'))
          commentNode.parentElement.classList.add('onTop')

          const canvas = document.querySelector('#comment-guideline')
          canvas.width = canvas.offsetWidth
          canvas.height = canvas.offsetHeight
          const ctx = canvas.getContext('2d')

          ctx.clearRect(0, 0, canvas.width, canvas.height)

          const contentTop = this.getOffsetTop(contentNode)
          const commentTop = this.getOffsetTop(commentNode)
          // console.log(commentNode)
          // console.log(contentTop, commentTop)

          ctx.moveTo(0.5, contentTop - 20.5)
          ctx.lineTo(4.5, contentTop - 20.5)
          ctx.lineTo(canvas.width - 3.5, commentTop - 10.5)
          ctx.lineTo(canvas.width + 0.5, commentTop - 10.5)
          // ctx.setLineDash([4, 2])
          // const bgColor = window.getComputedStyle(contentNode, null).getPropertyValue('background-color')
          const bgColor = '#c30'
          ctx.strokeStyle = bgColor // 'orange'
          ctx.stroke()
        }

        // if (commentItem) {
        //   commentItem.classList.add('hl')
        //   commentItem.scrollIntoView({
        //     behavior: 'smooth'
        //   })
        // }
      }

      this.$nextTick(() => {
        this.adjustCommentsPosition()
      })
    },
    prepareConfig() {
      this.editorConfigLoading = true
      this.editor = DecoupledEditor

      console.log('-- set content')
      this.editorData = this.content

      // const toolbarItems = this.commentable ? [...TOOLBAR_ITEMS, ...['comment', 'toggleComments']] : TOOLBAR_ITEMS
      const toolbarItems = [...TOOLBAR_ITEMS, ...['comment', 'toggleComments']]

      const plugins = [
        EssentialsPlugin,
        HeadingPlugin,
        BoldPlugin,
        ItalicPlugin,
        UnderlinePlugin,
        IndentTextPlugin,
        FontColorPlugin,
        AlignmentPlugin,
        LinkPlugin,
        ParagraphPlugin,
        ListPlugin,
        WordCount,
        Autosave,
        CommentPlugin,
        Table,
        // TableToolbar,
        TableProperties,
        TableCellProperties
      ]

      if (this.editable) {
        plugins.push(TableToolbar)
      }

      this.editorConfig = {
        language: 'zh-cn', // 中文
        plugins,
        toolbar: {
          items: toolbarItems
        },
        wordCount: {
          // displayCharacters: true
          displayWords: false
        },
        indentText: {
          options: {
            indentLength: 24,
            indentMeasure: 'px'
          }
        },
        autosave: {
          save: editor => {
            // this.saveData()
            console.log('-- autosave')
          },
          waitingTime: 5000
        },
        alignment: {
          options: ['left', 'right', 'center']
        },
        table: {
          contentToolbar: [
            'tableColumn', 'tableRow', 'mergeTableCells',
            'tableProperties', 'tableCellProperties'
          ]
        }
      }
      this.editorConfigLoading = false
    },

    // onReviewComment(comment) {
    //   for (const key in this.commentForm) {
    //     this.commentForm[key] = comment[key]
    //   }
    //   this.isCommentReview = true
    //   this.drawer = true
    // },
    // onDrawerClose(done) {
    //   this.$confirm('确认关闭？').then(done).catch(res => {})
    // },
    // commentClass(comment) {
    //   return [comment.class, comment.uuid]
    // },
    // onCommentContentChange(content) {
    //   this.commentForm.content = content
    // },
    // onCommentDeleteFromEditor(event) {
    //   const { uuid } = event.detail
    //   this.deleteComment(uuid)
    // },
    // onCommentDeleteFromList(comment) {
    //   this.deleteComment(uuid)
    // },

    deleteReview({ data, success, error }) {
      this.$emit('review-delete', {
        data,
        success,
        error
      })
    },
    updateReview(payload) {
      this.$emit('review-update', payload)
    },
    createReview(payload) {
      this.$emit('review-update', payload) // the same as update
    },

    deleteComment({ data, success, error }) {
      this.$emit('comment-delete', {
        data,
        success: () => {
          console.log('-- delete success')
          const { tagParagraph } = data
          this.editorHandler.execute('uncomment', tagParagraph)
          this.resetGuideline()
        },
        error
      })
    },
    updateComment(payload) {
      this.$emit('comment-update', payload)
    },
    createComment(event) {
      const { uuid, content } = event.detail

      this.$emit('comment-create', {
        data: {
          studHomeworkId: this.studHomeworkId,
          auditType: 0, // 批改類型不應該出現在這裡
          tagParagraph: uuid,
          tagComment: content,
          repeatComment: null
        },
        success: () => {
          console.log('-- create success')
        },
        error: () => {
          console.log('-- create failed')
        }
      })
    },
    // submitCommentSave() {
    //   const newComment = { ...this.commentForm }

    //   if (this.isCommentReview) {
    //     const comment = this.comments.find(c => c.uuid === newComment.uuid)
    //     console.log('found comment', comment)
    //     if (comment) {
    //       comment.score = newComment.score
    //       comment.review = newComment
    //     }
    //   } else {
    //     this.comments.push(newComment)
    //   }

    //   this.commentForm = { ...commentTemplate }

    //   // this.isCommentReview = false
    //   // this.drawer = false
    // },
    // saveData() {
    //   // console.log('Save data to localStorage')
    //   localStorage.setItem('localTempDocument', this.editorHandler.getData())
    // },
    onReady(editor) {
      // Insert the toolbar before the editable are.
      const toolbarContainer = this.$refs.toolbar
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)

      // Setup Word Count Plugin
      const wordCountPlugin = editor.plugins.get('WordCount')
      const wordCountWrapper = this.$refs.wordCount
      wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer)

      // force enable comment command
      if (this.commentable) {
        editor.commands.get('comment').clearForceDisabled('readOnlyMode')
        editor.commands.get('uncomment').clearForceDisabled('readOnlyMode')
      }

      // const wordCountPlugin = editor.plugins.get('WordCount')
      // console.log(wordCountPlugin)

      editor.model.document.on('change', () => {
        // this.saveData()
        this.$emit('content-change', this.editorHandler.getData())
      })

      // editor.model.document.on('select', () => {
      //   console.log('something selected')
      // })
      this.editorHandler = editor

      // just for debug, do not use window.editor
      window.editor = this.editorHandler
    },

    resetGuideline() {
      document.querySelectorAll('.comment-marker.hl').forEach(el => el.classList.remove('hl'))

      const canvas = document.querySelector('#comment-guideline')
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ #editor a {
    background: #72cdfd;
    color: #222;
    text-decoration: none;
  }
  /deep/ .ck.ck-link-form {
    padding: 4px;
  }

  /deep/ .comment-selected {
    border-bottom: 1px solid #222;
  }

  /deep/ .el-tooltip__popper {
    max-width: 400px;
  }

  /deep/ .ck.ck-toolbar {
    background: var(--ck-color-toolbar-background);
    padding: 0 var(--ck-spacing-small);
    border: 0;
    border-bottom: 1px solid var(--ck-color-toolbar-border);

    .ck-toolbar__items {
      position: relative;
    }

    .toggle-comments {
      display: none;
      position: absolute;
      right: 0;
      margin: 0;
    }
  }

  /deep/ .comment-marker.hl {
    // outline: 1px solid orange;
  }

  /deep/ .comment-icon {
    display: none;
  }

  /deep/ .commentable .comment-icon {
    display: initial;
  }

  .flex-box {
    display: flex;
  }

  .document-editor {
    //border: 2px solid #5f5f5f;
    border: 1px solid #797979;
    border-radius: 2px;
    max-width: 897px;
    margin: .5em auto;

    .toolbar {
      /* Make sure the toolbar container is always above the editable. */
      z-index: 1;
      position: sticky;
      top: 0;
    }

    /* Make the editable container look like the inside of a native word processor app. */
    .editable-container {
      // border: 1px solid var(--ck-color-base-border);
      // border-radius: var(--ck-border-radius);

      // /* Set vertical boundaries for the document editor. */
      // max-height: 600px;

      // /* This element is a flex container for easier rendering. */
      // display: flex;
      // flex-flow: column nowrap;

      // padding: calc( 2 * var(--ck-spacing-large));
      padding: 1.5em 0 1.5em 1.5em;
      background: var(--ck-color-base-foreground);
      // box-sizing: content-box;
      display: flex;
      // justify-content: center;
      position: relative;

      /* Make it possible to scroll the "page" of the edited content. */
      overflow-y: scroll;

      .ck-editor__editable {
        /* Set the dimensions of the "page". */
        // width: 15.8cm;
        // flex: 0 0 12.8cm;
        flex: 0 0 calc(36em + 2cm);
        margin: 0 auto;
        // width: calc(35em + 2cm);
        // float: left;
        min-height: 18cm;
        font-size: 14px;
        line-height: 1.5;

        /* Keep the "page" off the boundaries of the container. */
        // padding: 1cm 2cm 2cm;
        padding: 1cm;

        border: 2px #797979 solid;
        border-radius: var(--ck-border-radius);
        background: white;

        /* The "page" should cast a slight shadow (3D illusion). */
        box-shadow: 0 0 5px hsla( 0,0%,0%,.1 );

        /* Center the "page". */
        // margin: 0 auto;

        // line-height: 1.6;
        overflow: hidden;

        /deep/ .comment-marker {
          position: relative;
        }
        /deep/ .comment-marker.hl:before {
          content: " ";
          position: absolute;
          border-top: 1px solid #c30;
          width: 800px;
        }
      }

      .comments {
        // margin-left: 2em;
        width: calc(100% - 2.5em - 15.8cm);
        min-width: 300px;
      }

      #comment-guideline {
        // background: #eee;
        width: 1.5em;
        // position: absolute;
        // left: calc(35em + 2cm);
      }

      .aside {
        position: relative;
        // max-width: 40%;
        width: calc(100% - 36em - 2em - 1.5em);
        // padding: 0 1.5em;
        padding-right: 1.5em;
        min-width: 254px;
        // padding: 0 1.5em;
        // float: left;
        // margin-right: calc( 2 * var(--ck-spacing-large));

        // padding: 0 1.5em;
        transition: all .4s;

        .comment-wrapper {
          position: absolute;
          left: 0;
          right: 1.5em;

          &:hover {
            background: #eee;
          }

          &.onTop {
            z-index: 100;
          }

          .fa-comment-o {
            display: none;
          }

        }

        &.collapse {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          border-left: 1px solid #ccc;
          width: 56px;
          padding-left: 0;

          .comment-wrapper {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            .fa-comment-o {
              display: block;
              font-size: 32px;
              color: #333;

              &:hover {
                cursor: pointer;
              }
            }

            .comment {
              // transition: all .4s;
              position: absolute;
              top: 10px;
              right: 66px;
              width: 400px;
              // box-shadow: 0 0 10px #b7b7b7;
            }

          }
        }
      }
    }

    // &.collapse{
    //   .editable-container {
    //     .comments {
    //       position: absolute;
    //       right: 0;
    //       top: 0;
    //       bottom: 0;
    //     }
    //   }
    // }

    .footer {
      background: var(--ck-color-toolbar-background);
      padding: 10px;
    }
  }

  /deep/ figure.table.ck-widget.ck-widget_with-selection-handle {
    width: auto !important;
  }
</style>
