<template>
  <div class="document-editor">
    <div ref="toolbar" class="toolbar" />
    <div class="editable-container">
      <ckeditor id="editor" v-model="editorData" :editor="editor" :config="editorConfig" :disabled="!editable" @ready="onReady" />
      <div class="footer">
        <div ref="wordCount" />
      </div>
    </div>

  </div>
</template>

<script>
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline'
import FontColorPlugin from '@ckeditor/ckeditor5-font/src/fontcolor'
import AlignmentPlugin from '@ckeditor/ckeditor5-alignment/src/alignment'
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
import PendingActions from '@ckeditor/ckeditor5-core/src/pendingactions'
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'
import { modelElementToPlainText } from '@ckeditor/ckeditor5-word-count/src/utils'

WordCount.prototype._getCharacters = function() {
  const txt = modelElementToPlainText(this.editor.model.document.getRoot())
  return txt.replace(/(\n|\s)/g, '').length
}

export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      defualt: true
    },
    maxLength: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      editor: DecoupledEditor,
      editorData: this.content,
      editorConfig: {
        // The configuration of the editor.
        plugins: [
          EssentialsPlugin,
          HeadingPlugin,
          BoldPlugin,
          ItalicPlugin,
          UnderlinePlugin,
          FontColorPlugin,
          AlignmentPlugin,
          WordCount,
          LinkPlugin,
          ParagraphPlugin,
          ListPlugin,
          Autosave,
          PendingActions
        ],
        fontColor: {
          colors: [
            {
              color: '#ff0000',
              label: 'p1'
            },
            {
              color: '#000000',
              label: 'p2'
            },
            {
              color: '#494949',
              label: 'p3'
            },
            {
              color: '#ee7976',
              label: 'p4'
            },
            {
              color: '#faa573',
              label: 'p5'
            },
            {
              color: '#e6b322',
              label: 'p6'
            },
            {
              color: '#98c091',
              label: 'p7'
            },
            {
              color: '#79c6cd',
              label: 'p8'
            },
            {
              color: '#956fe7',
              label: 'p9'
            }
          ]
        },
        toolbar: {
          items: [
            'insertTable',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'fontColor',
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
        },
        wordCount: {
          container: document.getElementById('word-count'),
          displayCharacters: true,
          displayWords: false
        },
        autosave: {
          save: editor => {
            this.saveData()
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
    }
  },
  watch: {
    content(newContent, oldContent) {
      // there is a fucking bug here!!!!
      // this setData will trigger the downcast to flush nested comments
      this.editorHandler.setData(newContent)
    }
  },
  methods: {
    saveData() {
      // console.log('Save data to localStorage')
      // localStorage.setItem('localTempDocument', editor.getData())
    },
    onSave() {
      // this.saveData()
    },
    countControl(length, wordCountPlugin, colorJudge) {
      const maxLength = length
      let str = '字符数：'
      if (maxLength > 0) {
        str = wordCountPlugin.characters + '/' + maxLength
        if (colorJudge) {
          wordCountPlugin.wordCountContainer.innerHTML = '<span style="color: red">' + str + ' （追问字数超过了限制的字数要求' + maxLength + '，请调整追问内容！）</span>'
        } else {
          wordCountPlugin.wordCountContainer.innerText = str
        }
      }
    },
    onReady(editor) {
      const toolbarContainer = this.$refs.toolbar
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)
      const wordCountPlugin = editor.plugins.get('WordCount')
      const wordCountWrapper = this.$refs.wordCount
      wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer)
      this.countControl(this.maxLength, wordCountPlugin, false)
      editor.model.document.on('change', () => {
        let colorJudge = false
        // const content = modelElementToPlainText(editor.model.document.getRoot())
        const content = editor.getData()
        if (this.maxLength !== 0 && wordCountPlugin.characters > this.maxLength) {
          colorJudge = true
        }
        this.countControl(this.maxLength, wordCountPlugin, colorJudge)
        this.$emit('content-change', content, !colorJudge)
      })
      this.editorHandler = editor
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ #editor a {
    color: #1b3af2;
    text-decoration: none;
  }

  .document-editor {
    .toolbar {
      /* Make sure the toolbar container is always above the editable. */
      z-index: 1;

      /* Create the illusion of the toolbar floating over the editable. */
      // box-shadow: 0 0 5px hsla( 0,0%,0%,.2 );

      /* Use the CKEditor CSS variables to keep the UI consistent. */
      // border-bottom: 1px solid var(--ck-color-toolbar-border);
      //border: 1px solid var(--ck-color-base-border);
      border-bottom: none;
      z-index: 1;
      position: sticky;
      top: 0;
      /* Adjust the look of the toolbar inside of the container. */
      .ck-toolbar {
        border: 0;
        border-radius: 0;
        position: relative;
      }
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

      // padding: calc( 2 * var(--ck-spacing-large) );
      padding: 0;
      background: var(--ck-color-base-foreground);

      /* Make it possible to scroll the "page" of the edited content. */
      overflow-y: scroll;

      .ck-editor__editable {
        /* Set the dimensions of the "page". */
        // width: 15.8cm;
        min-height: 3cm;

        /* Keep the "page" off the boundaries of the container. */
        // padding: 1cm 2cm 2cm;

        border: 1px hsl( 0,0%,82.7% ) solid;
        border-radius: var(--ck-border-radius);
        background: white;

        /* The "page" should cast a slight shadow (3D illusion). */
        box-shadow: 0 0 5px hsla( 0,0%,0%,.1 );

        /* Center the "page". */
        // margin: 0 auto;
      }
    }
  }
  .footer {
    background: var(--ck-color-toolbar-background);
    padding: 10px;
    border-right: 1px #d3d3d3 solid;
    border-left: 1px #d3d3d3 solid;
    border-bottom: 1px #d3d3d3 solid;
  }
</style>
