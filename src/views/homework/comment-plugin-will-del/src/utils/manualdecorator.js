import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin'
import mix from '@ckeditor/ckeditor5-utils/src/mix'

export default class ManualDecorator {
  constructor({ id, label, attributes }) {
    this.id = id

    this.set('value')

    this.label = label

    this.attributes = attributes
  }
}

mix(ManualDecorator, ObservableMixin)
