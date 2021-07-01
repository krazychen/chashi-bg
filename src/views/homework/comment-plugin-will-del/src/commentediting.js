import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import CommentCommand from './commentcommand'
import UncommentCommand from './uncommentcommand'
import { createCommentElement, getLocalizedDecorators, normalizeDecorators } from './utils'
import AutomaticDecorators from './utils/automaticdecorators'
// import ManualDecorator from './utils/manualdecorator'
import bindTwoStepCaretToAttribute from '@ckeditor/ckeditor5-engine/src/utils/bindtwostepcarettoattribute'
import findCommentRange from './findcommentrange'
import '../theme/comment.css'

const HIGHLIGHT_CLASS = 'ck-link_selected'
const DECORATOR_AUTOMATIC = 'automatic'
// const DECORATOR_MANUAL = 'manual'
// const EXTERNAL_LINKS_REGEXP = /^(https?:)?\/\//

export default class CommentEditing extends Plugin {
  static get pluginName() {
    return 'CommentEditing'
  }

  constructor(editor) {
    super(editor)

    editor.config.define('comment', {
      addTargetToExternalLinks: false // here is the way to add extra attributes
    })
  }

  init() {
    const editor = this.editor
    const locale = editor.locale

    // Allow link attribute on all inline nodes.
    editor.model.schema.extend('$text', { allowAttributes: 'commentOn' })

    editor.conversion.for('dataDowncast')
      .attributeToElement({ model: 'commentOn', view: createCommentElement })

    editor.conversion.for('editingDowncast')
      .attributeToElement({ model: 'commentOn', view: createCommentElement })
      // .attributeToElement({ model: 'commentOn', view: (dataComment, writer) => {
      //   return createCommentElement(dataComment, writer)
      // } })

    editor.conversion.for('upcast')
      .elementToAttribute({
        view: {
          name: 'strong',
          attributes: {
            title: true
          }
        },
        model: {
          key: 'commentOn',
          value: viewElement => viewElement.getAttribute('title')
        }
      })

    // Register commands.
    editor.commands.add('comment', new CommentCommand(editor))
    editor.commands.add('uncomment', new UncommentCommand(editor))

    // 点击链接的时候弹出的介绍框
    const linkDecorators = getLocalizedDecorators(editor.t, normalizeDecorators(editor.config.get('link.decorators')))

    this._enableAutomaticDecorators(linkDecorators.filter(item => item.mode === DECORATOR_AUTOMATIC))
    // this._enableManualDecorators(linkDecorators.filter(item => item.mode === DECORATOR_MANUAL))

    // Enable two-step caret movement for `commentOn` attribute.
    bindTwoStepCaretToAttribute({
      view: editor.editing.view,
      model: editor.model,
      emitter: this,
      attribute: 'commentOn',
      locale
    })

    // Setup highlight over selected link.
    this._setupLinkHighlight()
  }

  _enableAutomaticDecorators(automaticDecoratorDefinitions) {
    const editor = this.editor
    const automaticDecorators = new AutomaticDecorators()

    // // Adds a default decorator for external links.
    // if (editor.config.get('link.addTargetToExternalLinks')) {
    //   automaticDecorators.add({
    //     id: 'linkIsExternal',
    //     mode: DECORATOR_AUTOMATIC,
    //     // callback: url => EXTERNAL_LINKS_REGEXP.test(url),
    //     callback: dataComment => false,
    //     attributes: {
    //       target: '_blank',
    //       // rel: 'noopener noreferrer'
    //       'data-id': 'hello'
    //     }
    //   })
    // }

    automaticDecorators.add(automaticDecoratorDefinitions)

    if (automaticDecorators.length) {
      editor.conversion.for('downcast').add(automaticDecorators.getDispatcher())
    }
  }

  // _enableManualDecorators(manualDecoratorDefinitions) {
  //   if (!manualDecoratorDefinitions.length) {
  //     return
  //   }

  //   const editor = this.editor
  //   const command = editor.commands.get('comment')
  //   const manualDecorators = command.manualDecorators

  //   manualDecoratorDefinitions.forEach(decorator => {
  //     editor.model.schema.extend('$text', { allowAttributes: decorator.id })

  //     // Keeps reference to manual decorator to decode its name to attributes during downcast.
  //     manualDecorators.add(new ManualDecorator(decorator))

  //     editor.conversion.for('downcast').attributeToElement({
  //       model: decorator.id,
  //       view: (manualDecoratorName, writer) => {
  //         if (manualDecoratorName) {
  //           const attributes = manualDecorators.get(decorator.id).attributes
  //           const element = writer.createAttributeElement('a', attributes, { priority: 5 })
  //           writer.setCustomProperty('comment', true, element)

  //           return element
  //         }
  //       } })

  //     editor.conversion.for('upcast').elementToAttribute({
  //       view: {
  //         name: 'a',
  //         attributes: manualDecorators.get(decorator.id).attributes
  //       },
  //       model: {
  //         key: decorator.id
  //       }
  //     })
  //   })
  // }

  _setupLinkHighlight() {
    const editor = this.editor
    const view = editor.editing.view
    const highlightedLinks = new Set()

    // Adding the class.
    view.document.registerPostFixer(writer => {
      const selection = editor.model.document.selection
      let changed = false

      if (selection.hasAttribute('commentOn')) {
        const modelRange = findCommentRange(selection.getFirstPosition(), selection.getAttribute('commentOn'), editor.model)
        const viewRange = editor.editing.mapper.toViewRange(modelRange)

        // There might be multiple `a` elements in the `viewRange`, for example, when the `a` element is
        // broken by a UIElement.
        for (const item of viewRange.getItems()) {
          if (item.is('a') && !item.hasClass(HIGHLIGHT_CLASS)) {
            writer.addClass(HIGHLIGHT_CLASS, item)
            highlightedLinks.add(item)
            changed = true
          }
        }
      }

      return changed
    })

    // Removing the class.
    editor.conversion.for('editingDowncast').add(dispatcher => {
      // Make sure the highlight is removed on every possible event, before conversion is started.
      dispatcher.on('insert', removeHighlight, { priority: 'highest' })
      dispatcher.on('remove', removeHighlight, { priority: 'highest' })
      dispatcher.on('attribute', removeHighlight, { priority: 'highest' })
      dispatcher.on('selection', removeHighlight, { priority: 'highest' })

      function removeHighlight() {
        view.change(writer => {
          for (const item of highlightedLinks.values()) {
            writer.removeClass(HIGHLIGHT_CLASS, item)
            highlightedLinks.delete(item)
          }
        })
      }
    })
  }
}
