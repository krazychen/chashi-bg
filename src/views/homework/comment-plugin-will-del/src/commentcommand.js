import Command from '@ckeditor/ckeditor5-core/src/command'
import findCommentRange from './findcommentrange'
import toMap from '@ckeditor/ckeditor5-utils/src/tomap'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'

export default class CommentCommand extends Command {
  constructor(editor) {
    super(editor)
    this.manualDecorators = new Collection()
  }

  restoreManualDecoratorStates() {
    for (const manualDecorator of this.manualDecorators) {
      manualDecorator.value = this._getDecoratorStateFromModel(manualDecorator.id)
    }
  }

  refresh() {
    const model = this.editor.model
    const doc = model.document

    this.value = doc.selection.getAttribute('commentOn')

    for (const manualDecorator of this.manualDecorators) {
      manualDecorator.value = this._getDecoratorStateFromModel(manualDecorator.id)
    }

    this.isEnabled = model.schema.checkAttributeInSelection(doc.selection, 'commentOn')
  }

  execute(href, manualDecoratorIds = {}) {
    const model = this.editor.model
    const selection = model.document.selection
    // Stores information about manual decorators to turn them on/off when command is applied.
    const truthyManualDecorators = []
    const falsyManualDecorators = []

    for (const name in manualDecoratorIds) {
      if (manualDecoratorIds[ name ]) {
        truthyManualDecorators.push(name)
      } else {
        falsyManualDecorators.push(name)
      }
    }

    model.change(writer => {
      // If selection is collapsed then update selected comment or insert new one at the place of caret.
      if (selection.isCollapsed) {
        const position = selection.getFirstPosition()

        // When selection is inside text with `commentOn` attribute.
        if (selection.hasAttribute('commentOn')) {
          const commentRange = findCommentRange(position, selection.getAttribute('commentOn'), model)

          writer.setAttribute('commentOn', href, commentRange)

          truthyManualDecorators.forEach(item => {
            writer.setAttribute(item, true, commentRange)
          })

          falsyManualDecorators.forEach(item => {
            writer.removeAttribute(item, commentRange)
          })

          writer.setSelection(commentRange)
        } else if (href !== '') {
          // If not then insert text node with `commentOn` attribute in place of caret.
          // However, since selection in collapsed, attribute value will be used as data for text node.
          // So, if `href` is empty, do not create text node.
          const attributes = toMap(selection.getAttributes())

          attributes.set('commentOn', href)

          truthyManualDecorators.forEach(item => {
            attributes.set(item, true)
          })

          const node = writer.createText(href, attributes)

          model.insertContent(node, position)

          // Create new range wrapping created node.
          writer.setSelection(writer.createRangeOn(node))
        }
      } else {
        // If selection has non-collapsed ranges, we change attribute on nodes inside those ranges
        // omitting nodes where `commentOn` attribute is disallowed.
        const ranges = model.schema.getValidRanges(selection.getRanges(), 'commentOn')

        for (const range of ranges) {
          writer.setAttribute('commentOn', href, range)

          truthyManualDecorators.forEach(item => {
            writer.setAttribute(item, true, range)
          })

          falsyManualDecorators.forEach(item => {
            writer.removeAttribute(item, range)
          })
        }
      }
    })
  }

  _getDecoratorStateFromModel(decoratorName) {
    const doc = this.editor.model.document
    return doc.selection.getAttribute(decoratorName) || false
  }
}
