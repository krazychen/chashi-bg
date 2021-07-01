<template>
  <div>
    <div class="document-editor">
      <!-- The toolbar will be rendered in this container. -->
      <div id="toolbar-container" ref="toolbar" class="document-editor__toolbar" />
      <div class="document-editor__editable-container">
        <ckeditor id="editor" v-model="editorData" :editor="editor" :config="editorConfig" @ready="onReady" />
      </div>
      <div id="snippet-autosave-header">
        <div ref="wordCount" />
        <div id="snippet-autosave-status" class="">
          <div class="snippet-autosave-status_label">状态:</div>
          <div id="snippet-autosave-status_spinner">
            <span id="snippet-autosave-status_spinner-label" ref="label" />
            <span id="snippet-autosave-status_spinner-loader" />
          </div>
        </div>
      </div>
    </div>
    <div id="snippet-manualsave-container">
      <div class="butH">
        <el-button v-if="subState !== '2'" class="subButton" @click.prevent="onSave">保存</el-button>
        <el-button v-if="subState !== '2'" class="subButton" @click.prevent="onSubmit">提交</el-button>
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
// import IndentPlugin from '@ckeditor/ckeditor5-indent/src/indent'
// import IndentBlockPlugin from '@ckeditor/ckeditor5-indent/src/indentblock'
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
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'
// import BlockToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar'
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount'
import { modelElementToPlainText } from '@ckeditor/ckeditor5-word-count/src/utils'
import PendingActions from '@ckeditor/ckeditor5-core/src/pendingactions'

import IndentTextPlugin from '@/views/homework/indent-text-plugin/src/indent-text'

// override the plugin to remove the space
WordCount.prototype._getCharacters = function() {
  const txt = modelElementToPlainText(this.editor.model.document.getRoot())
  return txt.replace(/(\n|\s)/g, '').length
}

export default {
  props: {
    content: {
      type: Object,
      default: null
    },
    save: {
      type: Function,
      default: null
    },
    submit: {
      type: Function,
      default: null
    },
    newDate: {
      type: String,
      default: ''
    },
    subState: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      olddangqian: undefined,
      editor: DecoupledEditor,
      editorData: this.content.content,
      editorConfig: {
        // The configuration of the editor.
        plugins: [
          EssentialsPlugin,
          HeadingPlugin,
          BoldPlugin,
          ItalicPlugin,
          UnderlinePlugin,
          FontColorPlugin,
          LinkPlugin,
          // IndentPlugin,
          // IndentBlockPlugin,
          IndentTextPlugin,
          AlignmentPlugin,
          ParagraphPlugin,
          ListPlugin,
          WordCount,
          Autosave,
          PendingActions,
          Table,
          TableToolbar,
          TableProperties,
          TableCellProperties
        ],
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
        },
        indentBlock: {
          offset: 1,
          unit: 'em'
        },
        indentText: {
          options: {
            indentLength: 24,
            indentMeasure: 'px'
          }
        },
        wordCount: {
          // displayCharacters: true
          displayWords: false
        },
        // autosave: {
        //   save: editor => {
        //     this.saveData()
        //   },
        //   waitingTime: 5000
        // },
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
    'content.content': function(newVal) {
      editor.setData(this.unescape(newVal))
      this.editorData = this.unescape(newVal)
    }
    // content: {
    //   handler(newVal) {
    //     this.editorData = this.unescape(newVal.content)
    //     this.$emit('panduan', true)
    //     console.log('新：' + this.editorData)
    //   },
    //   immediate: true
    // },
    // editorData(newVal) {
    //   this.$emit('update', this.unescape(newVal))
    // }
  },
  methods: {
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
    saveData() {
      // console.log('Save data to localStorage')
      // localStorage.setItem('localTempDocument', editor.getData())
    },
    onSave() {
      this.save()
    },
    onSubmit() {
      this.submit()
    },
    onReady(editor) {
      // Insert the toolbar before the editable are.
      const toolbarContainer = this.$refs.toolbar
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)

      // Setup Word Count Plugin
      const wordCountPlugin = editor.plugins.get('WordCount')
      const wordCountWrapper = this.$refs.wordCount
      wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer)

      // const wordCountPlugin = editor.plugins.get('WordCount')
      // console.log(wordCountPlugin)

      const view = editor.editing.view
      editor.setData(this.unescape(this.content.content))
      this.editorData = this.unescape(this.content.content)
      const viewDocument = view.document
      viewDocument.on('keydown', (evt, data) => {
        if ((data.keyCode === 9) && viewDocument.isFocused) {
          const len = this.editorConfig.indentText.options.indentLength
          editor.execute('indent-text', { value: data.shiftKey ? -len : len })

          evt.stop() // Prevent executing the default handler.
          data.preventDefault()
          view.scrollToTheSelection()
        }
      })

      // editor.model.document.on('change', () => {
      //   this.saveData()
      // })
      window.editor = editor
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ #editor a {
    color: #1b3af2;
    text-decoration: none;
  }
  /deep/ .el-button:focus, .el-button:hover {
    color: #333333;
    border-color: #333333;
    background-color: white;
  }
</style>

<style lang="scss">
  .butH{
    max-width: 897px;
    margin: 0.5em auto;
    margin-top: 30px;
  }
  .document-editor {
    //border: 2px solid #5f5f5f;
    border: 1px solid #797979;
    border-radius: 2px;
    max-width: 897px;
    margin: 0.5em auto;
  }

  .document-editor__toolbar {
    /* Make sure the toolbar container is always above the editable. */
    z-index: 1;
    position: sticky;
    top: 0;

    /* Create the illusion of the toolbar floating over the editable. */
    // box-shadow: 0 0 5px hsla( 0,0%,0%,.2 );

    /* Use the CKEditor CSS variables to keep the UI consistent. */
    // border-bottom: 1px solid var(--ck-color-toolbar-border);
    /* border: 1px solid var(--ck-color-base-border);*/
    border-bottom: 1px solid var(--ck-color-base-border);
  }

  /* Adjust the look of the toolbar inside of the container. */
  .document-editor__toolbar .ck-toolbar {
    border: 0;
    border-radius: 0;
    position: relative;
  }

  /* Make the editable container look like the inside of a native word processor app. */
  .document-editor__editable-container {
    padding: calc( 2 * var(--ck-spacing-large) );
    background: var(--ck-color-base-foreground);

    /* Make it possible to scroll the "page" of the edited content. */
    overflow-y: scroll;
  }

  .document-editor__editable-container .ck-editor__editable {
    /* Set the dimensions of the "page". */
    width: 44em;
    min-height: 18cm;
    font-size: 14px;

    /* Keep the "page" off the boundaries of the container. */
    padding: 1cm 4em 4em;

    border: 1px hsl( 0,0%,82.7% ) solid;
    border-radius: var(--ck-border-radius);
    background: white;

    /* The "page" should cast a slight shadow (3D illusion). */
    box-shadow: 0 0 5px hsla( 0,0%,0%,.1 );
    border: 2px #797979 solid;
    /* Center the "page". */
    margin: 0 auto;

    line-height: 1.5;
  }

  @media only screen and (max-width: 960px) {
    /* Because on mobile 2cm paddings are to big. */
    .document-editor__editable-container .document-editor__editable.ck-editor__editable {
      padding: 1.5em;
    }
  }

  @media only screen and (max-width: 1200px) {
    .main__content-wide .document-editor__editable-container .document-editor__editable.ck-editor__editable {
      width: 100%;
    }
  }

  /* Style document editor a'ka Google Docs.*/
  @media only screen and (min-width: 1360px) {
    .main .main__content.main__content-wide {
      padding-right: 0;
    }
  }

  @media only screen and (min-width: 1600px) {
    .main .main__content.main__content-wide {
      width: 24cm;
    }

    .main .main__content.main__content-wide .main__content-inner {
      width: auto;
      margin: 0 50px;
    }

    /* Keep "page" look based on viewport width. */
    .main__content-wide .document-editor__editable-container .document-editor__editable.ck-editor__editable {
      width: 60%;
    }
  }

  #snippet-autosave-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--ck-color-toolbar-background);
    /*
        border: 1px solid var(--ck-color-toolbar-border);
    */
    padding: 10px;
    border-radius: var(--ck-border-radius);
    margin-top: 0em;

    border-top: 1px solid var(--ck-color-toolbar-border);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  #snippet-autosave-status_spinner{
    display: flex;
    align-items: center;
    position: relative;
  }
  #snippet-autosave-status_spinner-label {
    position: relative;
  }

  #snippet-autosave-status_spinner-label::after {
    content: '已保存!';
    color: green;
    display: inline-block;
    margin-right: var(--ck-spacing-medium);
  }

  /* During "Saving" display spinner and change content of label. */
  #snippet-autosave-status.unsaved #snippet-autosave-status_spinner-label::after  {
    content: '未保存!';
    color: red;
  }

  /* During "Saving" display spinner and change content of label. */
  #snippet-autosave-status.busy #snippet-autosave-status_spinner-label::after  {
    content: '保存中...';
    color: red;
  }

  #snippet-autosave-status.busy #snippet-autosave-status_spinner-loader {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border-top: 3px solid hsl(0, 0%, 70%);
    border-right: 2px solid transparent;
    animation: autosave-status-spinner 1s linear infinite;
  }

  #snippet-autosave-status,
  #snippet-autosave-server {
    display: flex;
    align-items: center;
  }

  #snippet-autosave-server_label,
  .snippet-autosave-status_label {
    font-weight: bold;
    margin-right: var(--ck-spacing-medium);
  }

  #snippet-autosave + .ck.ck-editor .ck-editor__editable {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  #snippet-autosave-lag {
    padding: 4px;
  }

  #snippet-autosave-console {
    max-height: 300px;
    overflow: auto;
    white-space: normal;
    background: #2b2c26;
    transition: background-color 500ms;
  }

  #snippet-autosave-console.updated {
    background: green;
  }

  @keyframes autosave-status-spinner {
    to { transform: rotate( 360deg ); }
  }

  .snippet-manualsave-spinner {
    display: none;
  }

  .snippet-autosave-status, .snippet-autosave-server {
    display: flex;
    align-items: center;
  }

  .snippet-autosave-server_label, .snippet-autosave-status_label {
    font-weight: bold;
    margin-right: var(--ck-spacing-medium);
  }

  .snippet-autosave-status_spinner {
    display: flex;
    align-items: center;
    position: relative;
  }

  .snippet-autosave-status_spinner-label {
    position: relative;
  }

  .subButton{
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
    width: 138px;
    height: 38px;
    border: 1px solid #333333;
    color: #333333;
  }
</style>
