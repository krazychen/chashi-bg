import View from '@ckeditor/ckeditor5-ui/src/view'
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection'

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker'
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler'
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler'

import { ensureSafeUrl } from '../utils'

import unlinkIcon from '../../theme/icons/unlink.svg'
import pencilIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg'
import '../../theme/commentactions.scss'

export default class CommentActionsView extends View {
  constructor(locale) {
    super(locale)

    const t = locale.t

    this.focusTracker = new FocusTracker()

    this.keystrokes = new KeystrokeHandler()

    this.previewButtonView = this._createPreviewButton()

    this.uncommentButtonView = this._createButton(t('Uncomment'), unlinkIcon, 'uncomment')

    this.editButtonView = this._createButton(t('Edit link'), pencilIcon, 'edit')

    this.set('title')

    this._focusables = new ViewCollection()

    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        // Navigate fields backwards using the Shift + Tab keystroke.
        focusPrevious: 'shift + tab',

        // Navigate fields forwards using the Tab key.
        focusNext: 'tab'
      }
    })

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
        this.previewButtonView,
        this.editButtonView,
        this.uncommentButtonView
      ]
    })
  }

  render() {
    super.render()

    const childViews = [
      this.previewButtonView,
      this.editButtonView,
      this.uncommentButtonView
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
    const bind = this.bindTemplate
    const t = this.t

    button.set({
      withText: true,
      tooltip: t('Open link in new tab')
    })

    button.extendTemplate({
      attributes: {
        class: [
          'ck',
          'ck-link-actions__preview'
        ],
        href: bind.to('href', href => href && ensureSafeUrl(href)),
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    })

    button.bind('label').to(this, 'href', href => {
      return href || t('This link has no URL')
    })

    button.bind('isEnabled').to(this, 'href', href => !!href)

    button.template.tag = 'a'
    button.template.eventListeners = {}

    return button
  }
}
