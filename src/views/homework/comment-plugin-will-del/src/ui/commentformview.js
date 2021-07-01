import View from '@ckeditor/ckeditor5-ui/src/view'
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection'

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
// import SwitchButtonView from '@ckeditor/ckeditor5-ui/src/button/switchbuttonview'
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview'
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview'

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler'
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker'
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler'
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler'

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg'
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg'
import '../../theme/commentform.scss'

export default class CommentFormView extends View {
  constructor(locale, manualDecorators = []) {
    super(locale)

    const t = locale.t

    this.focusTracker = new FocusTracker()

    this.keystrokes = new KeystrokeHandler()

    this.commentInputView = this._createCommentInput()

    this.saveButtonView = this._createButton(t('Save'), checkIcon, 'ck-button-save')
    this.saveButtonView.type = 'submit'

    this.cancelButtonView = this._createButton(t('Cancel'), cancelIcon, 'ck-button-cancel', 'cancel')

    // this._manualDecoratorSwitches = this._createManualDecoratorSwitches(manualDecorators)

    this.children = this._createFormChildren(manualDecorators)

    this._focusables = new ViewCollection()

    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        // Navigate form fields backwards using the Shift + Tab keystroke.
        focusPrevious: 'shift + tab',

        // Navigate form fields forwards using the Tab key.
        focusNext: 'tab'
      }
    })

    const classList = ['ck', 'ck-link-form']

    if (manualDecorators.length) {
      classList.push('ck-link-form_layout-vertical')
    }

    this.setTemplate({
      tag: 'form',

      attributes: {
        class: classList,

        // https://github.com/ckeditor/ckeditor5-link/issues/90
        tabindex: '-1'
      },

      children: this.children
    })
  }

  // getDecoratorSwitchesState() {
  //   return Array.from(this._manualDecoratorSwitches).reduce((accumulator, switchButton) => {
  //     accumulator[ switchButton.name ] = switchButton.isOn
  //     return accumulator
  //   }, {})
  // }

  render() {
    super.render()

    submitHandler({
      view: this
    })

    const childViews = [
      this.commentInputView,
      // ...this._manualDecoratorSwitches,
      this.saveButtonView,
      this.cancelButtonView
    ]

    childViews.forEach(v => {
      // Register the view as focusable.
      this._focusables.add(v)

      // Register the view in the focus tracker.
      this.focusTracker.add(v.element)
    })

    // Start listening for the keystrokes coming from #element.
    this.keystrokes.listenTo(this.element)
  }

  focus() {
    this._focusCycler.focusFirst()
  }

  _createCommentInput() {
    const t = this.locale.t

    const labeledInput = new LabeledInputView(this.locale, InputTextView)

    labeledInput.label = t('Comment')
    labeledInput.inputView.placeholder = 'Put your comment here'

    return labeledInput
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
      }
    })

    if (eventName) {
      button.delegate('execute').to(this, eventName)
    }

    return button
  }

  // _createManualDecoratorSwitches(manualDecorators) {
  //   const switches = this.createCollection()

  //   for (const manualDecorator of manualDecorators) {
  //     const switchButton = new SwitchButtonView(this.locale)

  //     switchButton.set({
  //       name: manualDecorator.id,
  //       label: manualDecorator.label,
  //       withText: true
  //     })

  //     switchButton.bind('isOn').to(manualDecorator, 'value')

  //     switchButton.on('execute', () => {
  //       manualDecorator.set('value', !switchButton.isOn)
  //     })

  //     switches.add(switchButton)
  //   }

  //   return switches
  // }

  _createFormChildren(manualDecorators) {
    const children = this.createCollection()

    children.add(this.commentInputView)

    // if (manualDecorators.length) {
    //   const additionalButtonsView = new View()

    //   additionalButtonsView.setTemplate({
    //     tag: 'ul',
    //     children: this._manualDecoratorSwitches.map(switchButton => ({
    //       tag: 'li',
    //       children: [switchButton],
    //       attributes: {
    //         class: [
    //           'ck',
    //           'ck-list__item'
    //         ]
    //       }
    //     })),
    //     attributes: {
    //       class: [
    //         'ck',
    //         'ck-reset',
    //         'ck-list'
    //       ]
    //     }
    //   })
    //   children.add(additionalButtonsView)
    // }

    children.add(this.saveButtonView)
    children.add(this.cancelButtonView)

    return children
  }
}
