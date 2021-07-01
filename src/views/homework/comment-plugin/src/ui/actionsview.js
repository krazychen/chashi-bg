import View from '@ckeditor/ckeditor5-ui/src/view'
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection'

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview'
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview'

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler'
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker'
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler'
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler'

import uncommentIcon from '@ckeditor/ckeditor5-core/theme/icons/eraser.svg'
import pencilIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg'

export default class FormView extends View {
  constructor(locale, manualDecorators = []) {
    super(locale)

    const t = locale.t

    this.previewButton = this._createPreviewButton()

    this.uncommentButton = this._createButton(t('Uncomment'), uncommentIcon, 'uncomment')

    this.editButton = this._createButton(t('Edit link'), pencilIcon, 'edit')

    this.setTemplate({
      tag: 'div',

      attributes: {
        class: [
          'ck',
          'ck-link-actions'
        ],

        // https://github.com/ckeditor/ckeditor5-link/issues/90
        tabindex: '-1'
      },

      children: [
        this.previewButton,
        this.editButton,
        this.uncommentButton
      ]
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

  _createButton(label, icon, eventName) {
    const button = new ButtonView(this.locale)

    button.set({
      label,
      icon,
      tooltip: true
    })

    button.delegate('execute').to(this, eventName)

    return button
  }

  _createPreviewButton() {
    const button = new ButtonView(this.locale)
    // const bind = this.bindTemplate
    // const t = this.t

    button.set({
      label: '点评',
      withText: true,
      tooltip: 'Add Review Content'
    })

    button.delegate('execute').to(this, 'review')

    // button.extendTemplate({
    //   attributes: {
    //     class: [
    //       'ck',
    //       'ck-link-actions__preview'
    //     ],
    //     href: bind.to('href', href => href),
    //     target: '_blank',
    //     rel: 'noopener noreferrer'
    //   }
    // })

    // button.bind('label').to(this, 'href', href => {
    //   return href || '这里放一些评语的文字？'
    // })

    // button.bind('isEnabled').to(this, 'href', href => !!href)

    // button.template.tag = 'a'
    // button.template.eventListeners = {}

    return button
  }
}
