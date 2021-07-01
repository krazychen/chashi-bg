import View from '@ckeditor/ckeditor5-ui/src/view'

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview'
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview'
import BoxedEditorUIView from '@ckeditor/ckeditor5-ui/src/editorui/boxed/boxededitoruiview'

import InlineEditorView from './inlineeditor'

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler'
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler'

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg'
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg'

// 不能用自己的 svg 做 icon 。。
// import penIcon from '../../theme/icons/unlink.svg'
// import markerIcon from '../../theme/icons/marker.svg'
import penIcon from '@ckeditor/ckeditor5-highlight/theme/icons/pen.svg'
import markerIcon from '@ckeditor/ckeditor5-highlight/theme/icons/marker.svg'
import eraserIcon from '@ckeditor/ckeditor5-core/theme/icons/eraser.svg'

import '../../theme/app.css'
// import '@ckeditor/ckeditor5-ui/theme/components/panel/balloonpanel.css'

export default class FormView extends View {
  constructor(locale) {
    super(locale)

    const t = locale.t

    this.set('uuid')

    this.set('isEnabled')

    this.children = this.createCollection()

    // this.editor = new BoxedEditorUIView(this.locale)
    // this.children.add(this.editor)

    // 创建 button 组
    for (let i = -1; i < 6; i++) {
      const marker = 'm' + (i + 1)
      const className = ['comment-marker', marker]
      // const button = this._createButton(option.class, this._getIconForType(option.type), option.class, 'btn-clicked')
      const button = this._createButton(marker, markerIcon, className, 'marker-clicked')
      // button.iconView.fillColor = option.color
      // button.extendTemplate({
      //   attributes: {
      //     style: 'background: ' + option.color
      //   }
      // })
      // button.bind('isEnabled').to(this)
      this.listenTo(button, 'execute', () => {
        this.lastMarker = marker
      })
      this.children.add(button)
    }

    for (let i = -1; i < 8; i++) {
      const pen = 'p' + (i + 1)
      const className = ['comment-pen', pen]
      const button = this._createButton(pen, penIcon, className, 'marker-clicked')
      this.listenTo(button, 'execute', () => {
        this.lastPen = pen
      })
      this.children.add(button)
    }

    this.uncommentButton = this._createButton(t('Uncomment'), eraserIcon, '', 'uncomment')
    this.children.add(this.uncommentButton)

    this.reviewInput = new InlineEditorView(this.locale)
    this.reviewInput.placeholder = 'Put your comment here'
    this.reviewInput.id = 'inline-editor'
    this.children.add(this.reviewInput)

    this.cancelButton = this._createButton('取消', null, 'c-button-cancel', 'cancel')
    this.children.add(this.cancelButton)

    this.saveButton = this._createButton('确认', null, 'c-button-save')
    this.saveButton.type = 'submit'
    // this.saveButton.bind('isEnabled').to(this)
    this.children.add(this.saveButton)

    this.setTemplate({
      tag: 'form',

      attributes: {
        class: ['ck', 'ck-comment-form'],

        // https://github.com/ckeditor/ckeditor5-link/issues/90
        tabindex: '-1'
      },

      children: this.children
    })

    // this.focusTracker = new FocusTracker()
    this.keystrokes = new KeystrokeHandler()
    // this._focusables = new ViewCollection()
    // this._focusCycler = new FocusCycler({
    //   focusables: this._focusables,
    //   focusTracker: this.focusTracker,
    //   keystrokeHandler: this.keystrokes,
    //   actions: {
    //     // Navigate form fields backwards using the Shift + Tab keystroke.
    //     focusPrevious: 'shift + tab',

    //     // Navigate form fields forwards using the Tab key.
    //     focusNext: 'tab'
    //   }
    // })
  }

  render() {
    super.render()

    submitHandler({
      view: this
    })

    // const childViews = [
    //   this.commentInput,
    //   this.saveButton,
    //   this.cancelButton
    // ]

    // childViews.forEach(v => {
    //   // Register the view as focusable.
    //   this._focusables.add(v)

    //   // Register the view in the focus tracker.
    //   this.focusTracker.add(v.element)
    // })

    // Start listening for the keystrokes coming from #element.
    this.keystrokes.listenTo(this.element)
  }

  _createButton(label, icon, className, eventName) {
    const button = new ButtonView(this.locale)

    button.set({
      label,
      icon,
      tooltip: true
    })

    button.extendTemplate({
      attributes: {
        class: className
        // style: 'background: red'
      }
    })

    if (eventName) {
      button.delegate('execute').to(this, eventName)
    }

    return button
  }

  // _getIconForType(type) {
  //   return type === 'marker' ? markerIcon : penIcon
  // }
}
