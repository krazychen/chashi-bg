import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver'
import { isCommentElement } from './utils'
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon'

import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler'

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import CommentFormView from './ui/commentformview'
import CommentActionsView from './ui/commentactionsview'

import linkIcon from '../theme/icons/link.svg'

const linkKeystroke = 'Ctrl+M'

export default class CommentUI extends Plugin {
  static get requires() {
    return [ContextualBalloon]
  }

  static get pluginName() {
    return 'CommentUI'
  }

  init() {
    const editor = this.editor

    editor.editing.view.addObserver(ClickObserver)

    this.actionsView = this._createActionsView()

    this.formView = this._createFormView()

    this._balloon = editor.plugins.get(ContextualBalloon)

    console.log('before create toolbar button')
    // Create toolbar buttons.
    this._createToolbarCommentButton()
    console.log('after create toolbar button')

    // Attach lifecycle actions to the the balloon.
    this._enableUserBalloonInteractions()
  }

  destroy() {
    super.destroy()

    // Destroy created UI components as they are not automatically destroyed (see ckeditor5#1341).
    this.formView.destroy()
  }

  _createActionsView() {
    const editor = this.editor
    const actionsView = new CommentActionsView(editor.locale)
    const commentCommand = editor.commands.get('comment')
    const uncommentCommand = editor.commands.get('uncomment')

    actionsView.bind('title').to(commentCommand, 'value')
    actionsView.editButtonView.bind('isEnabled').to(commentCommand)
    actionsView.uncommentButtonView.bind('isEnabled').to(uncommentCommand)

    // Execute uncomment command after clicking on the "Edit" button.
    this.listenTo(actionsView, 'edit', () => {
      this._addFormView()
    })

    // Execute uncomment command after clicking on the "Uncomment" button.
    this.listenTo(actionsView, 'uncomment', () => {
      editor.execute('uncomment')
      this._hideUI()
    })

    // Close the panel on esc key press when the **actions have focus**.
    actionsView.keystrokes.set('Esc', (data, cancel) => {
      this._hideUI()
      cancel()
    })

    // Open the form view on Ctrl+K when the **actions have focus**..
    actionsView.keystrokes.set(linkKeystroke, (data, cancel) => {
      this._addFormView()
      cancel()
    })

    return actionsView
  }

  _createFormView() {
    const editor = this.editor
    const commentCommand = editor.commands.get('comment')

    const formView = new CommentFormView(editor.locale, commentCommand.manualDecorators)

    formView.commentInputView.bind('value').to(commentCommand, 'value')

    // Form elements should be read-only when corresponding commands are disabled.
    formView.commentInputView.bind('isReadOnly').to(commentCommand, 'isEnabled', value => !value)
    formView.saveButtonView.bind('isEnabled').to(commentCommand)

    // Execute link command after clicking the "Save" button.
    this.listenTo(formView, 'submit', () => {
      // editor.execute('comment', formView.urlInputView.inputView.element.value, formView.getDecoratorSwitchesState())
      editor.execute('comment', formView.commentInputView.inputView.element.value)
      this._closeFormView()
    })

    // Hide the panel after clicking the "Cancel" button.
    this.listenTo(formView, 'cancel', () => {
      this._closeFormView()
    })

    // Close the panel on esc key press when the **form has focus**.
    formView.keystrokes.set('Esc', (data, cancel) => {
      this._closeFormView()
      cancel()
    })

    return formView
  }

  _createToolbarCommentButton() {
    const editor = this.editor
    const commentCommand = editor.commands.get('comment')
    const t = editor.t

    // console.log(commentCommand.isEnabled)

    // Handle the `Ctrl+M` keystroke and show the panel.
    editor.keystrokes.set(linkKeystroke, (keyEvtData, cancel) => {
      // Prevent focusing the search bar in FF and opening new tab in Edge. #153, #154.
      cancel()

      // console.log(commentCommand.isEnabled)
      if (commentCommand.isEnabled) {
        this._showUI(true)
      }
    })

    editor.ui.componentFactory.add('comment', locale => {
      const button = new ButtonView(locale)

      button.isEnabled = true
      button.label = t('Comment')
      button.icon = linkIcon
      button.keystroke = linkKeystroke
      button.tooltip = true
      button.isToggleable = true

      // Bind button to the command.
      button.bind('isEnabled').to(commentCommand, 'isEnabled')
      button.bind('isOn').to(commentCommand, 'value', value => !!value)

      // Show the panel on button click.
      this.listenTo(button, 'execute', () => this._showUI(true))

      return button
    })
  }

  _enableUserBalloonInteractions() {
    const viewDocument = this.editor.editing.view.document

    // Handle click on view document and show panel when selection is placed inside the link element.
    // Keep panel open until selection will be inside the same link element.
    this.listenTo(viewDocument, 'click', () => {
      const parentLink = this._getSelectedLinkElement()

      if (parentLink) {
        // Then show panel but keep focus inside editor editable.
        this._showUI()
      }
    })

    // Focus the form if the balloon is visible and the Tab key has been pressed.
    this.editor.keystrokes.set('Tab', (data, cancel) => {
      if (this._areActionsVisible && !this.actionsView.focusTracker.isFocused) {
        this.actionsView.focus()
        cancel()
      }
    }, {
      // Use the high priority because the link UI navigation is more important
      // than other feature's actions, e.g. list indentation.
      // https://github.com/ckeditor/ckeditor5-link/issues/146
      priority: 'high'
    })

    // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
    this.editor.keystrokes.set('Esc', (data, cancel) => {
      if (this._isUIVisible) {
        this._hideUI()
        cancel()
      }
    })

    // Close on click outside of balloon panel element.
    clickOutsideHandler({
      emitter: this.formView,
      activator: () => this._isUIInPanel,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI()
    })
  }

  _addActionsView() {
    if (this._areActionsInPanel) {
      return
    }

    this._balloon.add({
      view: this.actionsView,
      position: this._getBalloonPositionData()
    })
  }

  _addFormView() {
    if (this._isFormInPanel) {
      return
    }

    const editor = this.editor
    const commentCommand = editor.commands.get('comment')

    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData()
    })

    // Select input when form view is currently visible.
    if (this._balloon.visibleView === this.formView) {
      this.formView.commentInputView.select()
    }

    // Make sure that each time the panel shows up, the URL field remains in sync with the value of
    // the command. If the user typed in the input, then canceled the balloon (`urlInputView#value` stays
    // unaltered) and re-opened it without changing the value of the link command (e.g. because they
    // clicked the same link), they would see the old value instead of the actual value of the command.
    // https://github.com/ckeditor/ckeditor5-link/issues/78
    // https://github.com/ckeditor/ckeditor5-link/issues/123
    this.formView.commentInputView.inputView.element.value = commentCommand.value || ''
  }

  _closeFormView() {
    const commentCommand = this.editor.commands.get('comment')

    // Restore manual decorator states to represent the current model state. This case is important to reset the switch buttons
    // when the user cancels the editing form.
    commentCommand.restoreManualDecoratorStates()

    if (commentCommand.value !== undefined) {
      this._removeFormView()
    } else {
      this._hideUI()
    }
  }

  _removeFormView() {
    if (this._isFormInPanel) {
      // Blur the input element before removing it from DOM to prevent issues in some browsers.
      // See https://github.com/ckeditor/ckeditor5/issues/1501.
      this.formView.saveButtonView.focus()

      this._balloon.remove(this.formView)

      // Because the form has an input which has focus, the focus must be brought back
      // to the editor. Otherwise, it would be lost.
      this.editor.editing.view.focus()
    }
  }

  _showUI(forceVisible = false) {
    const editor = this.editor
    const commentCommand = editor.commands.get('comment')
    console.log(commentCommand)

    if (!commentCommand.isEnabled) {
      return
    }

    // When there's no link under the selection, go straight to the editing UI.
    if (!this._getSelectedLinkElement()) {
      this._addActionsView()

      // Be sure panel with link is visible.
      if (forceVisible) {
        this._balloon.showStack('main')
      }

      this._addFormView()
    }

    // If there's a link under the selection...
    else {
      // Go to the editing UI if actions are already visible.
      if (this._areActionsVisible) {
        this._addFormView()
      }
      // Otherwise display just the actions UI.
      else {
        this._addActionsView()
      }

      // Be sure panel with link is visible.
      if (forceVisible) {
        this._balloon.showStack('main')
      }
    }

    // Begin responding to ui#update once the UI is added.
    this._startUpdatingUI()
  }

  _hideUI() {
    if (!this._isUIInPanel) {
      return
    }

    const editor = this.editor

    this.stopListening(editor.ui, 'update')
    this.stopListening(this._balloon, 'change:visibleView')

    // Make sure the focus always gets back to the editable _before_ removing the focused form view.
    // Doing otherwise causes issues in some browsers. See https://github.com/ckeditor/ckeditor5-link/issues/193.
    editor.editing.view.focus()

    // Remove form first because it's on top of the stack.
    this._removeFormView()

    // Then remove the actions view because it's beneath the form.
    this._balloon.remove(this.actionsView)
  }

  _startUpdatingUI() {
    const editor = this.editor
    const viewDocument = editor.editing.view.document

    let prevSelectedLink = this._getSelectedLinkElement()
    let prevSelectionParent = getSelectionParent()

    const update = () => {
      const selectedLink = this._getSelectedLinkElement()
      const selectionParent = getSelectionParent()

      // Hide the panel if:
      //
      // * the selection went out of the EXISTING link element. E.g. user moved the caret out
      //   of the link,
      // * the selection went to a different parent when creating a NEW link. E.g. someone
      //   else modified the document.
      // * the selection has expanded (e.g. displaying link actions then pressing SHIFT+Right arrow).
      //
      // Note: #_getSelectedLinkElement will return a link for a non-collapsed selection only
      // when fully selected.
      if ((prevSelectedLink && !selectedLink) ||
				(!prevSelectedLink && selectionParent !== prevSelectionParent)) {
        this._hideUI()
      }
      // Update the position of the panel when:
      //  * link panel is in the visible stack
      //  * the selection remains in the original link element,
      //  * there was no link element in the first place, i.e. creating a new link
      else if (this._isUIVisible) {
        // If still in a link element, simply update the position of the balloon.
        // If there was no link (e.g. inserting one), the balloon must be moved
        // to the new position in the editing view (a new native DOM range).
        this._balloon.updatePosition(this._getBalloonPositionData())
      }

      prevSelectedLink = selectedLink
      prevSelectionParent = selectionParent
    }

    function getSelectionParent() {
      return viewDocument.selection.focus.getAncestors()
        .reverse()
        .find(node => node.is('element'))
    }

    this.listenTo(editor.ui, 'update', update)
    this.listenTo(this._balloon, 'change:visibleView', update)
  }

  get _isFormInPanel() {
    return this._balloon.hasView(this.formView)
  }

  get _areActionsInPanel() {
    return this._balloon.hasView(this.actionsView)
  }

  get _areActionsVisible() {
    return this._balloon.visibleView === this.actionsView
  }

  get _isUIInPanel() {
    return this._isFormInPanel || this._areActionsInPanel
  }

  get _isUIVisible() {
    const visibleView = this._balloon.visibleView

    return visibleView == this.formView || this._areActionsVisible
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view
    const viewDocument = view.document
    const targetLink = this._getSelectedLinkElement()

    const target = targetLink
    // When selection is inside link element, then attach panel to this element.
      ? view.domConverter.mapViewToDom(targetLink)
    // Otherwise attach panel to the selection.
      : view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange())

    return { target }
  }

  _getSelectedLinkElement() {
    const view = this.editor.editing.view
    const selection = view.document.selection

    if (selection.isCollapsed) {
      return findLinkElementAncestor(selection.getFirstPosition())
    } else {
      // The range for fully selected link is usually anchored in adjacent text nodes.
      // Trim it to get closer to the actual link element.
      const range = selection.getFirstRange().getTrimmed()
      const startLink = findLinkElementAncestor(range.start)
      const endLink = findLinkElementAncestor(range.end)

      if (!startLink || startLink != endLink) {
        return null
      }

      // Check if the link element is fully selected.
      if (view.createRangeIn(startLink).getTrimmed().isEqual(range)) {
        return startLink
      } else {
        return null
      }
    }
  }
}

// Returns a link element if there's one among the ancestors of the provided `Position`.
//
// @private
// @param {module:engine/view/position~Position} View position to analyze.
// @returns {module:engine/view/attributeelement~AttributeElement|null} Link element at the position or null.
function findLinkElementAncestor(position) {
  return position.getAncestors().find(ancestor => isCommentElement(ancestor))
}
