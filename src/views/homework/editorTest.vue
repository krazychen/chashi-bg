<template>
  <div id="App" class="components-container ">
    <!-- The toolbar will be rendered in this container. -->
    <div id="toolbar-container" ref="toolbar" class="document-editor__toolbar" />
    <div class="document-editor document-editor__editable-container">
      <ckeditor id="editor" v-model="editorData" :editor="editor" :config="editorConfig" @ready="onReady" />
    </div>
    <div id="snippet-autosave-header">
      <div id="cha-status">
        <div class="snippet-autosave-status_label">字数:</div>
      </div>
      <div id="snippet-autosave-status" class="">
        <div class="snippet-autosave-status_label">状态:</div>
        <div id="snippet-autosave-status_spinner">
          <span id="snippet-autosave-status_spinner-label" ref="label" />
          <span id="snippet-autosave-status_spinner-loader" />
        </div>
      </div>

      <div id="snippet-manualsave-container">
        <span id="snippet-manualsave-spinner" />
        <input id="save" class="snippet-manualsave-save" type="submit" value="保存">
        <input id="subm" class="snippet-manualsave-save" type="submit" value="提交">
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
import PendingActions from '@ckeditor/ckeditor5-core/src/pendingactions'

// let isDirty = false

export default {
  name: 'App',
  data: function() {
    return {
      editor: DecoupledEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
        plugins: [
          EssentialsPlugin,
          HeadingPlugin,
          BoldPlugin,
          ItalicPlugin,
          UnderlinePlugin,
          LinkPlugin,
          ParagraphPlugin,
          ListPlugin,
          WordCount,
          Autosave,
          PendingActions
        ],
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'link',
            'undo',
            'redo'
          ]
        },
        wordCount: {
          container: document.getElementById('word-count'),
          displayCharacters: true,
          displayWords: true
        },
        autosave: {
          save(editor) {
            return new Promise(resolve => {
              console.log(new Date() + editor.getData() + '开始保存')
              resolve()
            })
          },
          waitingTime: 5000
        }
      }
    }
  },
  methods: {
    onReady(editor) {
      // Insert the toolbar before the editable are.
      const toolbarContainer = this.$refs.toolbar
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)
      const wordCountPlugin = editor.plugins.get('WordCount')
      console.log(wordCountPlugin)
      // const wordCountWrapper = document.getElementById('word-count')
      // wordCountWrapper.appendChild(wordCountPlugin.wordCountContainer)

      // editor.ui.getEditableElement().parentElement.insertBefore(
      //   editor.ui.view.toolbar.element,
      //   editor.ui.getEditableElement()
      // )
      editor.model.document.on('change', () => {
        if (editor.model.document.differ.getChanges().length > 0) {
          const statusIndicator = document.querySelector('#snippet-autosave-status')
          statusIndicator.classList.add('unsaved')
          console.log('The Document has changed!')
        }
      })
      window.editor = editor
      // displayStatus(editor)
      // handleStatusChanges(editor)
      // handleSaveButton(editor)
      // handleBeforeunload(editor)
    }
  }
}

// // Save the data to a fake HTTP server (emulated here with a setTimeout()).
// function saveData(data) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log('Saved', data)
//       resolve()
//     })
//   })
// }

// Update the "Status: Saving..." info.
// function displayStatus(editor) {
//   const pendingActions = editor.plugins.get('PendingActions')
//   const statusIndicator = document.querySelector('#snippet-autosave-status')
//
//   pendingActions.on('change:hasAny', (evt, propertyName, newValue) => {
//     console.log(newValue)
//     if (newValue) {
//       statusIndicator.classList.add('busy')
//     } else {
//       statusIndicator.classList.remove('busy')
//     }
//   })
// }

// // Handle clicking the "Save" button by sending the data to a
// // fake HTTP server (emulated here with setTimeout()).
// function handleSaveButton(editor) {
//   const saveButton = document.querySelector('#save')
//   const pendingActions = editor.plugins.get('PendingActions')
//
//   saveButton.addEventListener('click', evt => {
//     const data = editor.getData()
//
//     // Register the action of saving the data as a "pending action".
//     // All asynchronous actions related to the editor are tracked like this,
//     // so later on you only need to check `pendingActions.hasAny` to check
//     // whether the editor is busy or not.
//     const action = pendingActions.add('Saving changes')
//
//     evt.preventDefault()
//
//     // Save the data to a fake HTTP server.
//     setTimeout(() => {
//       pendingActions.remove(action)
//
//       // Reset isDirty only if the data did not change in the meantime.
//       if (data === editor.getData()) {
//         isDirty = false
//       }
//
//       updateStatus(editor)
//     }, 500)
//   })
// }
//
// // Listen to new changes (to enable the "Save" button) and to
// // pending actions (to show the spinner animation when the editor is busy).
// function handleStatusChanges(editor) {
//   editor.plugins.get('PendingActions').on('change:hasAny', () => updateStatus(editor))
//
//   editor.model.document.on('change:data', () => {
//     isDirty = true
//
//     updateStatus(editor)
//   })
// }
//
// // If the user tries to leave the page before the data is saved, ask
// // them whether they are sure they want to proceed.
// function handleBeforeunload(editor) {
//   const pendingActions = editor.plugins.get('PendingActions')
//
//   window.addEventListener('beforeunload', evt => {
//     if (pendingActions.hasAny) {
//       evt.preventDefault()
//     }
//   })
// }
//
// function updateStatus(editor) {
//   const saveButton = document.querySelector('#save')
//
//   // Disables the "Save" button when the data on the server is up to date.
//   // eslint-disable-next-line no-undef
//   if (isDirty) {
//     saveButton.classList.add('active')
//   } else {
//     saveButton.classList.remove('active')
//   }
//
//   // Shows the spinner animation.
//   if (editor.plugins.get('PendingActions').hasAny) {
//     saveButton.classList.add('saving')
//   } else {
//     saveButton.classList.remove('saving')
//   }
// }
</script>
<style lang="scss">
  .document-editor {
    border: 1px solid var(--ck-color-base-border);
    border-radius: var(--ck-border-radius);

    /* Set vertical boundaries for the document editor. */
    max-height: 600px;

    /* This element is a flex container for easier rendering. */
    display: flex;
    flex-flow: column nowrap;
  }

  .document-editor__toolbar {
    /* Make sure the toolbar container is always above the editable. */
    z-index: 1;

    /* Create the illusion of the toolbar floating over the editable. */
    box-shadow: 0 0 5px hsla( 0,0%,0%,.2 );

    /* Use the CKEditor CSS variables to keep the UI consistent. */
    border-bottom: 1px solid var(--ck-color-toolbar-border);
  }

  /* Adjust the look of the toolbar inside of the container. */
  .document-editor__toolbar .ck-toolbar {
    border: 0;
    border-radius: 0;
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
    width: 15.8cm;
    min-height: 21cm;

    /* Keep the "page" off the boundaries of the container. */
    padding: 1cm 2cm 2cm;

    border: 1px hsl( 0,0%,82.7% ) solid;
    border-radius: var(--ck-border-radius);
    background: white;

    /* The "page" should cast a slight shadow (3D illusion). */
    box-shadow: 0 0 5px hsla( 0,0%,0%,.1 );

    /* Center the "page". */
    margin: 0 auto;
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
    border: 1px solid var(--ck-color-toolbar-border);
    padding: 10px;
    border-radius: var(--ck-border-radius);
    margin-top: 0em;
    margin-bottom: 1.5em;
    border-top: 0;
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

  .snippet-manualsave-save:hover{
    background: hsl( 88, 73%, 42% );
  }
  .snippet-manualsave-save{
    color: #fff;
    background: hsl( 88, 73%, 39% );
    opacity: 0.5;
    padding: 4px 20px;
    display: inline-block;
    border: 0;
    border-radius: 2px;
    font-weight: bold;
    outline: none;
    transition: 300ms ease background;
    box-shadow: 0 2px 0 rgb(68, 117, 10);
  }
</style>
