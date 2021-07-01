// import { upperFirst } from 'lodash-es'

export function isCommentElement(node) {
  return node.is('attributeElement') && !!node.getCustomProperty('comment')
}

export function createCommentElement(data, writer) {
  // Priority 5 - https://github.com/ckeditor/ckeditor5-link/issues/121.
  const commentElement = writer.createAttributeElement('strong', { data }, { priority: 5 })
  writer.setCustomProperty('comment', true, commentElement)
  return commentElement
}

export function getLocalizedDecorators(t, decorators) {
  const localizedDecoratorsLabels = {
    'Open in a new tab': t('Open in a new tab'),
    'Downloadable': t('Downloadable')
  }

  decorators.forEach(decorator => {
    if (decorator.label && localizedDecoratorsLabels[decorator.label]) {
      decorator.label = localizedDecoratorsLabels[decorator.label]
    }
    return decorator
  })

  return decorators
}

export function normalizeDecorators(decorators) {
  const retArray = []

  if (decorators) {
    for (const [key, value] of Object.entries(decorators)) {
      const decorator = Object.assign(
        {},
        value,
        // { id: `link${upperFirst(key)}` }
        { id: `link${key}` }
      )
      retArray.push(decorator)
    }
  }

  return retArray
}
