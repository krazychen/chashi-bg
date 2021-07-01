import View from '@ckeditor/ckeditor5-ui/src/view'

export default class InlineEditorView extends View {
  constructor(locale) {
    super(locale)

    this.set('id')

    this.set('placeholder')

    this.set('isReadOnly', false)

    this.set('ariaDescribedById')

    const bind = this.bindTemplate

    this.setTemplate({
      tag: 'div',
      attributes: {
        class: [
          'dc-inline-editor'
        ],
        id: bind.to('id'),
        readonly: bind.to('isReadOnly'),
        'aria-invalid': bind.if('hasError', true),
        'aria-describedby': bind.to('ariaDescribedById')
      },
      children: [
        {
          tag: 'div',
          attributes: {
            class: ['dc-inline-editor-toolbar']
          }
        },
        {
          tag: 'div',
          attributes: {
            class: ['dc-inline-editor-content'],
            text: bind.to('placeholder')
          }
        }
      ]
    })
  }

  select() {
    this.element.select()
  }

  focus() {
    this.element.focus()
  }
}
