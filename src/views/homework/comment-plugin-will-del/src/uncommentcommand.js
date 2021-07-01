import Command from '@ckeditor/ckeditor5-core/src/command'
import findCommentRange from './findcommentrange'

export default class UncommentCommand extends Command {
  refresh() {
    this.isEnabled = this.editor.model.document.selection.hasAttribute('commentOn')
  }

  execute() {
    const editor = this.editor
    const model = this.editor.model
    const selection = model.document.selection
    const command = editor.commands.get('comment')

    model.change(writer => {
      // Get ranges to uncomment.
      const rangesToUncomment = selection.isCollapsed
        ? [findCommentRange(selection.getFirstPosition(), selection.getAttribute('commentOn'), model)] : selection.getRanges()

      // Remove `commentOn` attribute from specified ranges.
      for (const range of rangesToUncomment) {
        writer.removeAttribute('commentOn', range)
        // If there are registered custom attributes, then remove them during uncomment.
        if (command) {
          for (const manualDecorator of command.manualDecorators) {
            writer.removeAttribute(manualDecorator.id, range)
          }
        }
      }
    })
  }
}
