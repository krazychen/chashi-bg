import Command from '@ckeditor/ckeditor5-core/src/command'
// import findCommentRange from '../findCommentRange'
import { _removeMarkers } from './remove'

const attributeName = 'commentOn'

export default class InsertComment extends Command {
  refresh() {
    const model = this.editor.model
    const doc = model.document

    this.value = doc.selection.getAttribute(attributeName)

    // 光标只点在没有 comment 的区域，且没有选中任何内容的时候不启用，否则启用
    // this.isEnabled = !(doc.selection.isCollapsed && !doc.selection.hasAttribute(attributeName))
    // this.isEnabled = true
    this.isEnabled = !doc.selection.isCollapsed
  }

  // 这里的 option 是 commentui 里的 colorOptions 里的选项
  execute(option = {}) {
    // console.log(option)

    const model = this.editor.model
    const selection = model.document.selection

    // console.log('-- insert command fired')
    // const existingComment = selection.getAttribute(attributeName)

    // 允许嵌套的话这里不改变 uuid 反而会出问题
    // const commentAttributes = { class: option.class, uuid: existingComment ? existingComment.uuid : uuid() }
    // const commentAttributes = { ...option, ...{ uuid: uuid() }}
    // if (existingComment) { // && existingComment.uuid !== commentAttributes.uuid) {
    //   commentAttributes = [option, existingComment]
    // }
    // console.log('-- options', commentAttributes)

    model.change(writer => {
      // const ranges = model.schema.getValidRanges(selection.getRanges(), attributeName)
      const ranges = selection.getRanges()

      // If selection is collapsed then update selected comment or insert new one at the place of caret.
      if (selection.isCollapsed) {
        console.log('selection is collapsed, do nothing')
        // const position = selection.getFirstPosition()

        // // // When selection is inside text with `commentOn` attribute.
        // if (selection.hasAttribute(attributeName)) {
        //   const commentRange = findCommentRange(position, selection.getAttribute(attributeName), model)

        //   writer.setAttribute(attributeName, commentAttributes, commentRange)

        //   //   truthyManualDecorators.forEach(item => {
        //   //     writer.setAttribute(item, true, commentRange)
        //   //   })

        //   //   falsyManualDecorators.forEach(item => {
        //   //     writer.removeAttribute(item, commentRange)
        //   //   })

        //   //   writer.setSelection(commentRange)
        //   // } else if (href !== '') {
        //   //   // If not then insert text node with `commentOn` attribute in place of caret.
        //   //   // However, since selection in collapsed, attribute value will be used as data for text node.
        //   //   // So, if `href` is empty, do not create text node.
        //   //   const attributes = toMap(selection.getAttributes())

        //   //   attributes.set('commentOn', href)

        //   //   truthyManualDecorators.forEach(item => {
        //   //     attributes.set(item, true)
        //   //   })

        //   //   const node = writer.createText(href, attributes)

        //   //   model.insertContent(node, position)

        // //   // Create new range wrapping created node.
        // //   writer.setSelection(writer.createRangeOn(node))
        // }
      } else {
        // console.log('not collapsed')

        const { uuid } = option
        let { marker, pen } = option

        _removeMarkers(writer, model.markers, uuid)

        if (!marker) { marker = 'm1' }
        if (!pen) { pen = 'p0' }

        const markerPrefix = ['cc', uuid, marker, pen].join(':')
        // console.log('-- markerPrefix', markerPrefix)

        let idx = 0

        for (const range of ranges) {
          const markerId = [markerPrefix, idx].join(':')
          writer.addMarker(markerId, { range, usingOperation: true, affectsData: true })
          idx += 1
        }
      }
    })
  }
}
