import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline'
import FontColorPlugin from '@ckeditor/ckeditor5-font/src/fontcolor'
// import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import ListPlugin from '@ckeditor/ckeditor5-list/src/list'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave'

import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver'

import findCommentRange from './findCommentRange'

import uuid from 'uuid/v1'

import pencilIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg'
import toggleCommentsIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

// handle global click event, no need at the monent
// import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler'

// 这个 plugin 会有多重调用的问题
// Two plugins with the same name were loaded
// 下面即使没用到也要引用
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon'

import FormView from './ui/formview'
// import UncommentCommand from '../../comment-plugin-will-del/src/uncommentcommand'
// import ActionsView from './ui/actionsview'

// const menuName = 'insertComment'
const insertCommand = 'comment'
// const removeCommand = 'uncomment'
const attributeName = 'commentOn'

// 快捷键
const hotKeystroke = 'Ctrl+M'

export default class CommentUI extends Plugin {
  // 直接在这里 require ContextualBalloon 会和其他 plugin 冲突
  // static get requires() {
  //   return [ContextualBalloon]
  // }
  init() {
    const editor = this.editor

    editor.editing.view.addObserver(ClickObserver)

    // FormView 用来输入颜色
    this.formView = this._createFormView()

    // // ActionView 用来改变颜色或者删除
    // this.actionsView = this._createActionsView()

    // 注册 toolbar 的按钮
    this._createToolbarButton()

    // 在选中的文字区域弹出对话框
    this._balloon = this.editor.plugins.get('ContextualBalloon')
    this._enableUserBalloonInteractions()
  }

  destroy() {
    super.destroy()

    // Destroy created UI components as they are not automatically destroyed (see ckeditor5#1341).
    this.formView.destroy()
  }

  // _createActionsView() {
  //   const editor = this.editor
  //   const actionsView = new ActionsView(editor.locale)
  //   const commentCommand = editor.commands.get(insertCommand)
  //   const uncommentCommand = editor.commands.get(removeCommand)

  //   // actionsView.bind('title').to(commentCommand, 'value')
  //   actionsView.editButton.bind('isEnabled').to(commentCommand)
  //   actionsView.uncommentButton.bind('isEnabled').to(uncommentCommand)

  //   // Execute uncomment command after clicking on the "Edit" button.
  //   this.listenTo(actionsView, 'edit', () => {
  //     this._addFormView()
  //   })

  //   // Execute uncomment command after clicking on the "Uncomment" button.
  //   this.listenTo(actionsView, 'uncomment', () => {
  //     editor.execute('uncomment')
  //     this._hideUI()
  //   })

  //   this.listenTo(actionsView, 'review', () => {
  //     const data = { ...commentCommand.value }
  //     // data.text = this._getCommentTextInSelection()

  //     const event = new CustomEvent('review-content', {
  //       detail: data
  //     })

  //     window.dispatchEvent(event)
  //     this._hideUI()
  //   })

  //   return actionsView
  // }

  _createFormView() {
    const editor = this.editor
    const command = editor.commands.get(insertCommand)

    const formView = new FormView(editor.locale)
    formView.bind('isEnabled').to(command)
    // formView.saveButton.bind('isEnabled').to(command)

    // Execute link command after clicking the "Save" button.
    this.listenTo(formView, 'submit', () => {
      // console.log('form 里按了提交')
      // 没选择颜色就直接用第一个 color option
      // console.log(command.value)
      this._restoreSelection()

      const data = { ...command.value }

      // console.log(this.inlineEditor)
      if (this.inlineEditor) {
        data.content = this.inlineEditor.getData()
      }

      data.uuid = this.uuid

      const event = new CustomEvent('save-comment', {
        detail: data
      })

      window.dispatchEvent(event)

      this.isNewRecord = false
      this._hideUI()
    })

    // 更改颜色
    this.listenTo(formView, 'marker-clicked', () => {
      // console.log('form 里按钮触发了')
      // console.log(formView.lastExecuted)
      // console.log(command.value)

      this._restoreSelection()

      // const option = { ...formView.lastExecuted, ...{ uuid: this.uuid }}
      const option = {
        marker: formView.lastMarker,
        pen: formView.lastPen,
        uuid: this.uuid
      }
      editor.execute(insertCommand, option)
    })

    // Execute uncomment command after clicking on the "Uncomment" button.
    this.listenTo(formView, 'uncomment', () => {
      this._restoreSelection()

      const event = new CustomEvent('remove-comment', {
        detail: { ...command.value }
      })

      window.dispatchEvent(event)

      editor.execute('uncomment', this.uuid)

      this._hideUI()
    })

    // Hide the panel after clicking the "Cancel" button.
    this.listenTo(formView, 'cancel', () => {
      // console.log('form 里按了取消')

      this._hideUI()
    })

    return formView
  }

  // 菜单栏里的按钮
  _createToolbarButton() {
    const editor = this.editor

    // 批改
    editor.ui.componentFactory.add('comment', locale => {
      const button = new ButtonView(locale)

      button.set({
        label: '批改',
        icon: pencilIcon,
        keystroke: hotKeystroke,
        tooltip: true,
        class: 'comment-icon'
      })

      const commentCommand = editor.commands.get(insertCommand)
      // command enabled 的时候 button 可以被点击
      button.bind('isEnabled').to(commentCommand, 'isEnabled')
      // 如果点击的区域有 comment 就 higlight，value 是 comment 的 model
      button.bind('isOn').to(commentCommand, 'value', value => !!value)

      // Callback executed once the image is clicked.
      button.on('execute', () => this._showUI())

      return button
    })

    // 顯示批改
    editor.ui.componentFactory.add('toggleComments', locale => {
      const button = new ButtonView(locale)

      button.set({
        label: '顯示所有批改',
        class: 'toggle-comments',
        icon: toggleCommentsIcon,
        tooltip: true
      })

      // Callback executed once the image is clicked.
      button.on('execute', () => {
        const event = new CustomEvent('toggle-comments')
        window.dispatchEvent(event)
      })

      return button
    })
  }

  _enableUserBalloonInteractions() {
    // const viewDocument = this.editor.editing.view.document
    const command = this.editor.commands.get(insertCommand)

    // const editor = this.editor
    // const selection = editor.model.document.selection

    // // // 点击文章里的 comment 显示泡泡
    // this.listenTo(viewDocument, 'click', () => {
    //   if (selection.hasAttribute(attributeName)) {
    //     this._showUI()
    //   }
    //   //   const parent = this._getCommentsInSelection()

    // //   if (parent) {
    // //     // Then show panel but keep focus inside editor editable.
    // //     this._showUI()
    // //   }
    // })

    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey === true && e.keyCode === 77 && command.isEnabled) { // ctrl + m
        this._showUI()
      }
    })

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) { // esc
        this._hideUI()
      }
    })

    // // 监听快捷键
    // this.editor.keystrokes.set(hotKeystroke, (data, cancel) => {
    //   // console.log('check command status', command.isEnabled)
    //   if (command.isEnabled) {
    //     this._showUI()
    //   }
    //   cancel()
    // })

    // // 监听 esc 退出
    // this.editor.keystrokes.set('Esc', (data, cancel) => {
    //   this._hideUI()
    //   cancel()
    // })

    // 点击画面其他区域退出
    // clickOutsideHandler({
    //   emitter: this.formView,
    //   activator: () => this._isUIInPanel,
    //   contextElements: [this._balloon.view.element],
    //   callback: () => {
    //     this._hideUI()
    //   }
    // })
  }

  _showUI() {
    const editor = this.editor
    const selection = editor.model.document.selection

    // 如果选择的范围内没有 Comment 就直接打开 form 新增
    // if (!this._getCommentsInSelection()) {

    // TODO: unless focus has uuid
    this.uuid = uuid()

    const option = {
      // marker: 'm' + Math.round(Math.random() * 40), // random background color
      marker: 'm1',
      pen: 'p0',
      uuid: this.uuid,
      isNew: true
    }

    // console.log('选择的范围内没有 Comment')
    if (!selection.hasAttribute(attributeName)) {
      this.editor.execute(insertCommand, option)
      this.isNewRecord = true
    }

    this.cachedRange = selection.getFirstRange()

    this._addFormView()
    // this.formView.reviewInput.focus()
    // } else {
    //   // 有 comment 就开启预览画面
    //   // console.log('发现 Comment')
    //   this._addActionsView()
    // }

    this._initEditor()

    if (this.inlineEditor) {
      this.inlineEditor.editing.view.focus()
    }
  }

  _initEditor() {
    const editorElem = document.querySelector('#inline-editor .dc-inline-editor-content')
    if (editorElem && !editorElem.editor) {
      DecoupledEditor.create(editorElem, {
        initialData: '',
        language: 'zh-cn',
        plugins: [
          EssentialsPlugin,
          // HeadingPlugin,
          BoldPlugin,
          ItalicPlugin,
          UnderlinePlugin,
          FontColorPlugin,
          LinkPlugin,
          ParagraphPlugin,
          ListPlugin,
          Autosave
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
            // 'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'fontColor',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'link',
            'undo',
            'redo'
          ]
        }
      }).then(editor => {
        // console.log('Editor was initialized', editor)
        editorElem.editor = editor

        // Append the toolbar to the <body> element.
        const toolbarContainer = document.querySelector('#inline-editor .dc-inline-editor-toolbar')
        if (toolbarContainer) {
          toolbarContainer.appendChild(editor.ui.view.toolbar.element)
        }

        // dirty fix
        document.querySelectorAll('.ck-reset_all').forEach(elem => elem.classList.remove('ck-reset_all'))

        // Initial data was provided so the editor UI element needs to be added manually to the DOM.
        // document.querySelector('#www').appendChild(editor.ui.getEditableElement())

        this.inlineEditor = editor
        editor.editing.view.focus()
      }).catch(err => {
        console.error(err.stack)
      })
    } else if (editorElem.editor) {
      editorElem.editor.setData('')
    }
  }

  // _addActionsView() {
  //   this._removeViews()

  //   this._balloon.add({
  //     view: this.actionsView,
  //     position: this._getBalloonPositionData()
  //   })
  // }

  _addFormView() {
    this._removeViews()

    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData()
    })
  }

  _hideUI() {
    // console.log('---hide UI fired')
    if (!this._isUIInPanel) {
      return
    }

    const editor = this.editor

    this.stopListening(editor.ui, 'update')
    this.stopListening(this._balloon, 'change:visibleView')

    // Remove form first because it's on top of the stack.
    this._removeViews()

    // editor.editing.view.focus()

    if (this.cachedRange && this.isNewRecord) {
      this._restoreSelection()
      editor.execute('uncomment', this.uuid)
    }
    this.isNewRecord = false
    this.cachedRange = null

    // remove the editor
    const editorElem = document.querySelector('#inline-editor .dc-inline-editor-content')
    if (editorElem && editorElem.editor) {
      editorElem.editor.destroy()
      editorElem.editor = null
      this.inlineEditor = null
    }

    this.formView.lastPen = null
    this.formView.lastMarker = null
  }

  _removeViews() {
    if (this._balloon.hasView(this.formView)) {
      this._balloon.remove(this.formView)
    }

    // if (this._balloon.hasView(this.actionsView)) {
    //   this._balloon.remove(this.actionsView)
    // }
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view
    const viewDocument = view.document
    const targetLink = this._getCommentsInSelection()

    const target = targetLink
    // When selection is inside link element, then attach panel to this element.
      ? view.domConverter.mapViewToDom(targetLink)
    // Otherwise attach panel to the selection.
      : view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange())

    return { target }
  }

  _getCommentsInSelection() {
    const view = this.editor.editing.view
    const selection = view.document.selection

    if (selection.isCollapsed) {
      // 当鼠标点下去，只有位置而还没有选中任何文字的时候
      return findElementAncestor(selection.getFirstPosition())
    } else {
      // The range for fully selected link is usually anchored in adjacent text nodes.
      // Trim it to get closer to the actual link element.
      // 点击 comment 后 higlight 的范围内通常是文字，所以 trim？
      const range = selection.getFirstRange().getTrimmed()
      const startComment = findElementAncestor(range.start)
      const endComment = findElementAncestor(range.end)

      if (!startComment || startComment !== endComment) {
        return null
      }

      // 检查 Comment 是否被全选？？
      if (view.createRangeIn(startComment).getTrimmed().isEqual(range)) {
        console.log(startComment)
        return startComment
      } else {
        return null
      }
    }
  }

  _getCommentTextInSelection() {
    const editor = this.editor
    const selection = editor.model.document.selection

    if (selection.hasAttribute(attributeName)) {
      const modelRange = findCommentRange(selection.getFirstPosition(), selection.getAttribute(attributeName), editor.model)
      const viewRange = editor.editing.mapper.toViewRange(modelRange).getTrimmed()

      const text = []
      for (const item of viewRange.getItems()) {
        console.log(item.data)
        text.push(item.data)
      }
      return text.join(' ')
    }
  }

  _restoreSelection() {
    if (this.cachedRange) {
      this.editor.model.change(writer => writer.setSelection(this.cachedRange))
    }
  }

  get _isFormInPanel() {
    return this._balloon.hasView(this.formView)
  }

  // get _isActionInPanel() {
  //   return this._balloon.hasView(this.actionsView)
  // }

  get _isUIInPanel() {
    return this._isFormInPanel // || this._isActionInPanel
  }
}

// 从 position 开始找最上层符合的 element
function findElementAncestor(position) {
  return position.getAncestors().find(ancestor => isCommentElement(ancestor))
}

// 判断 node 是不是一个 comment
function isCommentElement(node) {
  return node.is('attributeElement') && !!node.getCustomProperty('isComment')
}

