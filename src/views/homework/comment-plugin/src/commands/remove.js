import Command from '@ckeditor/ckeditor5-core/src/command'

export default class RemoveComment extends Command {
  refresh() {
    this.isEnabled = true
  }

  execute(uuid) {
    const model = this.editor.model

    if (!uuid) {
      console.log('-- no uuid provided')
      return
    }

    model.change(writer => {
      _removeMarkers(writer, model.markers, uuid)
    })
  }
}

export function _removeMarkers(writer, markers, uuid) {
  if (!uuid) return

  const pattern = ['cc', uuid].join(':')
  // console.log('-- check for pattern', pattern)

  for (const marker of markers) {
    if (marker.name.startsWith(pattern)) {
      // console.log('-- found', marker)
      writer.removeMarker(marker.name)
    }
  }
}
