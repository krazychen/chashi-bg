import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
// import bindTwoStepCaretToAttribute from '@ckeditor/ckeditor5-engine/src/utils/bindtwostepcarettoattribute'

// import findCommentRange from './findCommentRange'
import CommandInsert from './commands/insert'
import CommandRemove from './commands/remove'

const insertCommand = 'comment'
const removeCommand = 'uncomment'
// const attributeName = 'commentOn'

// const commentTag = 'comment'

// const HIGHLIGHT_CLASS = 'comment-selected'

export default class CommentEditing extends Plugin {
  init() {
    const editor = this.editor

    // 翻译暂时用不到
    // const locale = editor.locale

    // Allow link attribute on all inline nodes.
    // editor.model.schema.extend('$text', {
    //   allowAttributes: [attributeName, 'marker']
    //   // allowIn: ['$text', 'commentOn']
    // })

    // 将 Model 转为在编辑器里看到的 HTML
    editor.conversion.for('editingDowncast').markerToHighlight({
      model: 'cc',
      view: (data, writer) => {
        // console.log('cc marker to highlight')
        const [model, uuid, marker, pen, ...rest] = data.markerName.split(':')
        // console.log('-- marker', marker)

        // addMarker 后刷新数据到 editor 里会自动进行排序，marker 里是一些不一样的 class 名称，会直接影响到排序导致高亮区域跑到背景里
        // 这里往 classes 里塞一个时间戳，新增的内容的时间一定比旧的大，就一定会显示在前方
        const timeMark = new Date().getTime()
        const classes = ['comment-marker', timeMark, marker, pen]

        return {
          attributes: {
            uuid: uuid
          },
          classes
        }
      }
    })

    // 将 Model 转为可储存的格式，即 editor.getData() 的结果
    editor.conversion.for('dataDowncast').markerToElement({
      model: 'cc',
      view: (data, writer) => {
        // console.log('-- comment data downcast')
        // console.log(data)

        const [model, uuid, marker, pen, ...rest] = data.markerName.split(':')

        // 原始数据只需要保存 uuid
        return writer.createAttributeElement('span', { 'data-uuid': uuid, 'data-marker': marker, 'data-pen': pen }, { priority: 5 })
      }
    })

    // 原始数据里的 data-uuid 抽出来做个 marker，用来标记位置
    editor.conversion.for('upcast').elementToMarker({
      view: {
        name: 'span',
        attributes: {
          'data-uuid': true,
          'data-marker': true,
          'data-pen': true
        }
      },
      model: viewElement => ['cc', viewElement.getAttribute('data-uuid'), viewElement.getAttribute('data-marker'), viewElement.getAttribute('data-pen')].join(':')
    })

    // 注册 command
    editor.commands.add(insertCommand, new CommandInsert(editor))
    editor.commands.add(removeCommand, new CommandRemove(editor))

    // // 不知道干啥的。。。
    // // Enable two-step caret movement for `commentOn` attribute.
    // bindTwoStepCaretToAttribute({
    //   view: editor.editing.view,
    //   model: editor.model,
    //   emitter: this,
    //   attribute: attributeName,
    //   locale
    // })

    // Setup highlight over selected link.
    // this._setupHighlight()
  }

  // _setupHighlight() {
  //   const editor = this.editor
  //   const view = editor.editing.view
  //   const selection = editor.model.document.selection

  //   view.document.registerPostFixer(writer => {
  //     const position = selection.getFirstPosition()
  //     console.log(position)
  //     editor.model.markers
  //   })
  // }

  // // 点击 comment 的时候加 class
  // _setupHighlight() {
  //   const editor = this.editor
  //   const view = editor.editing.view
  //   const highlightedLinks = new Set()

  //   // Adding the class.
  //   view.document.registerPostFixer(writer => {
  //     const selection = editor.model.document.selection
  //     let changed = false

  //     if (selection.hasAttribute(attributeName)) {
  //       const modelRange = findCommentRange(selection.getFirstPosition(), selection.getAttribute(attributeName), editor.model)
  //       const viewRange = editor.editing.mapper.toViewRange(modelRange)

  //       // There might be multiple `a` elements in the `viewRange`, for example, when the `a` element is
  //       // broken by a UIElement.
  //       for (const item of viewRange.getItems()) {
  //         if (item.is('comment') && !item.hasClass(HIGHLIGHT_CLASS)) {
  //           writer.addClass(HIGHLIGHT_CLASS, item)
  //           highlightedLinks.add(item)
  //           changed = true
  //         }
  //       }
  //     }

  //     return changed
  //   })

  //   // Removing the class.
  //   editor.conversion.for('editingDowncast').add(dispatcher => {
  //     // Make sure the highlight is removed on every possible event, before conversion is started.
  //     dispatcher.on('insert', removeHighlight, { priority: 'highest' })
  //     dispatcher.on('remove', removeHighlight, { priority: 'highest' })
  //     dispatcher.on('attribute', removeHighlight, { priority: 'highest' })
  //     dispatcher.on('selection', removeHighlight, { priority: 'highest' })

  //     function removeHighlight() {
  //       view.change(writer => {
  //         for (const item of highlightedLinks.values()) {
  //           writer.removeClass(HIGHLIGHT_CLASS, item)
  //           highlightedLinks.delete(item)
  //         }
  //       })
  //     }
  //   })
  // }
}

// function _createCommentElement(data, writer, priority) {
//   if (!data) {
//     return // wtf????
//   }

//   // console.log('-- create comment element fired')
//   // console.log(data)
//   const commentElement = writer.createAttributeElement(commentTag, data, { priority: priority || 5 })

//   // 给 commentElement 加一个 comment 的标识
//   // 文章在被点击的时候根据这个标识判断是不是一个 comment 元素
//   writer.setCustomProperty('isComment', true, commentElement)
//   return commentElement
// }
