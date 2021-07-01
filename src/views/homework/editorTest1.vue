<template>
  <div id="App" class="components-container">
    <ckeditor id="editor" v-model="content" :editor="editor" :config="editorConfig" @ready="onReady" />
  </div>
</template>

<script>
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn' // 中文包

export default {
  name: 'App',
  data() {
    return {
      editor: DecoupledEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
        language: 'zh-cn' // 中文
      }
    }
  },
  methods: {
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      )
    }
  }
}
</script>
<style>
  ck ck-content ck-editor__editable {
    min-height: 400px;
    border-left: 30px solid #ccc!important;
    border-right: 30px solid #ccc!important;
  }
</style>
