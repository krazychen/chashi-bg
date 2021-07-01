export default class AutomaticDecorators {
  constructor() {
    this._definitions = new Set()
  }

  get length() {
    return this._definitions.size
  }

  add(item) {
    if (Array.isArray(item)) {
      item.forEach(item => this._definitions.add(item))
    } else {
      this._definitions.add(item)
    }
  }

  getDispatcher() {
    return dispatcher => {
      dispatcher.on('attribute:commentOn', (evt, data, conversionApi) => {
        // There is only test as this behavior decorates links and
        // it is run before dispatcher which actually consumes this node.
        // This allows on writing own dispatcher with highest priority,
        // which blocks both native converter and this additional decoration.
        if (!conversionApi.consumable.test(data.item, 'attribute:commentOn')) {
          return
        }
        const viewWriter = conversionApi.writer
        const viewSelection = viewWriter.document.selection

        for (const item of this._definitions) {
          const viewElement = viewWriter.createAttributeElement('strong', item.attributes, {
            priority: 5
          })
          viewWriter.setCustomProperty('comment', true, viewElement)
          if (item.callback(data.attributeNewValue)) {
            if (data.item.is('selection')) {
              viewWriter.wrap(viewSelection.getFirstRange(), viewElement)
            } else {
              viewWriter.wrap(conversionApi.mapper.toViewRange(data.range), viewElement)
            }
          } else {
            viewWriter.unwrap(conversionApi.mapper.toViewRange(data.range), viewElement)
          }
        }
      }, { priority: 'high' })
    }
  }
}
