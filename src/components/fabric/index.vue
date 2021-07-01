<template>
  <canvas :id="id" :width="width" :height="height" />
</template>

<script type="text/ecmascript-6">
export default {
  name: 'VueFabric',
  props: {
    id: {
      type: String,
      required: false,
      default: 'fabricCanvas'
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      canvas: null,
      currentObj: null,
      path: ''
    }
  },
  watch: {
    width(val) {
      this.canvas.setWidth(val)
    },
    height(val) {
      this.canvas.setHeight(val)
    }
  },
  created() {
    this.$nextTick(() => {
      // this.canvas.loadFromJSON(this.path, this.canvas.renderAll.bind(this.canvas))
    })
  },
  mounted() {
    this.canvas = new fabric.Canvas(this.id, { preserveObjectStacking: true, skipTargetFind: false,
      selectable: true,
      selection: true })
    const canvas = this.canvas
    /*    fabric.Canvas.prototype.customiseControls({
            tl: {
              action: 'scale'
              // cursor: '../../assets/dot-circle.png',
            },
            tr: {
              action: 'scale'
            },
            bl: {
              action: 'scale',
              cursor: 'pointer'
            },
            br: {
              action: 'scale',
              cursor: 'pointer'
            },
            mb: {
              action: 'scale',
              cursor: 'pointer'
            },
            // mr: {
            //     // action: function(e, target) {
            //     //     target.set({
            //     //         left: 200,
            //     //     });
            //     //     canvas.renderAll();
            //     // },
            //     action: 'scale',
            //     cursor: 'pointer',
            // },
            mt: {
              // action: {
              //   rotateByDegrees: 30
              // },
              action: 'scale',
              cursor: 'pointer'
            },
            // only is hasRotatingPoint is not set to false
            mtr: {
              action: 'rotate'
              // cursor: '../../assets/cow.png',
            }
          })*/
    // this.setCornerIcons({})
    // canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
    // canvas.backgroundColor = '#ffffff'
    // canvas.renderAll();
    // this.canvas.push(canvas);
    const that = this
    // this.canvas.controlsAboveOverlay = false
    // this.canvas.skipOffscreen = true
    // this.drawControls();
    this.canvas.on('selection:created', function(options) {
      that.$emit('selection:created', options)
    })
    this.canvas.on('mouse:down', function(options) {
      that.$emit('mouse:down', options)
    })
    this.canvas.on('mouse:up', function(options) {
      that.$emit('mouse:up', options)
    })
    this.canvas.on('mouse:move', function(options) {
      that.$emit('mouse:move', options)
    })
    this.canvas.on('mouse:dblclick', function(options) {
      that.$emit('mouse:dblclick', options)
    })
    this.canvas.on('mouse:over', function(options) {
      that.$emit('mouse:over', options)
    })
    this.canvas.on('mouse:out', function(options) {
      that.$emit('mouse:out', options)
    })
    this.canvas.on('object:added', function(options) {
      that.$emit('object:added', options)
    })
    this.canvas.on('object:removed', function(options) {
      that.$emit('object:removed', options)
    })
    this.canvas.on('object:modified', function(options) {
      that.$emit('object:modified', options)
    })
    this.canvas.on('object:rotating', function(options) {
      that.$emit('object:rotating', options)
    })
    this.canvas.on('object:scaling', function(options) {
      that.$emit('object:scaling', options)
    })
    this.canvas.on('object:moving', function(options) {
      that.$emit('object:moving', options)
    })
    this.canvas.on('selection:updated', function(options) {
      that.$emit('selection:updated', options)
    })
    this.canvas.on('selection:cleared', function(options) {
      that.$emit('selection:cleared', options)
    })
    this.canvas.on('before:selection:cleared', function(options) {
      that.$emit('before:selection:cleared', options)
    })
  },
  methods: {
    getActiveObject() {
      return this.canvas.getActiveObject()
    },
    getWidth() {
      return this.canvas.getWidth()
    },
    getHeight() {
      return this.canvas.getHeight()
    },
    getViewportTransform() {
      return this.canvas.viewportTransform
    },
    relativePan(point) {
      return this.canvas.relativePan(point)
    },
    zoomToPoint(center, zoom) {
      this.canvas.zoomToPoint(center, zoom)
    },
    requestRenderAll() {
      this.canvas.requestRenderAll()
    },
    absolutePan(point) {
      this.canvas.absolutePan(point)
    },
    rotatePoint(point, origin, radians) {
      return fabric.util.rotatePoint(point, origin, radians)
    },
    setWidth(width) {
      this.canvas.setWidth(width)
    },
    setHeight(height) {
      this.canvas.setHeight(height)
    },
    setZoom(zoom) {
      this.canvas.setZoom(zoom)
      window.zoom = zoom
      this.canvas.renderAll()
    },
    setCoords() {
      this.canvas.setCoords()
    },
    add(obj) {
      this.canvas.add(obj)
      this.canvas.renderAll()
    },
    remove(obj) {
      this.canvas.remove(obj)
      this.canvas.renderAll()
    },
    drawDottedline(options) {
      options = Object.assign({ x: 0, y: 0, x1: 10, y1: 10, color: '#B2B2B2', drawWidth: 2, offset: 6, empty: 3 }, options)
      const canvasObject = new fabric.Line([options.x, options.y, options.x1, options.y1], {
        ...options,
        strokeDashArray: [options.offset, options.empty],
        stroke: options.color,
        strokeWidth: options.drawWidth
      })
      this.canvas.add(canvasObject)
      this.canvas.renderAll()
    },
    drawArrowLine(options) {
      options = Object.assign({ x: 0, y: 0, x1: 0, y1: 0, color: '#B2B2B2', drawWidth: 2, fillColor: 'rgba(255,255,255,0)', theta: 35, headlen: 35 }, options)
      const canvasObject = new fabric.Path(this.drawArrowBase(options.x, options.y, options.x1, options.y1, options.theta, options.headlen), {
        ...options,
        stroke: options.color,
        fill: options.fillColor,
        strokeWidth: options.drawWidth
      })
      this.canvas.add(canvasObject)
      this.canvas.renderAll()
    },
    drawArrowBase(fromX, fromY, toX, toY, theta, headlen) {
      theta = typeof theta !== 'undefined' ? theta : 30
      headlen = typeof theta !== 'undefined' ? headlen : 10
      // 计算各角度和对应的P2,P3坐标
      var angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI
      var angle1 = ((angle + theta) * Math.PI) / 180
      var angle2 = ((angle - theta) * Math.PI) / 180
      var topX = headlen * Math.cos(angle1)
      var topY = headlen * Math.sin(angle1)
      var botX = headlen * Math.cos(angle2)
      var botY = headlen * Math.sin(angle2)
      var arrowX = fromX - topX
      var arrowY = fromY - topY
      var path = ' M ' + fromX + ' ' + fromY
      path += ' L ' + toX + ' ' + toY
      arrowX = toX + topX
      arrowY = toY + topY
      path += ' M ' + arrowX + ' ' + arrowY
      path += ' L ' + toX + ' ' + toY
      arrowX = toX + botX
      arrowY = toY + botY
      path += ' L ' + arrowX + ' ' + arrowY
      return path
    },
    freeDrawConfig(options) {
      this.canvas.isDrawingMode = options.isDrawingMode
      this.canvas.freeDrawingBrush.color = options.color // 设置自由绘颜色
      this.canvas.freeDrawingBrush.width = options.drawWidth
      this.canvas.renderAll()
    },
    updateFreeDrawingBrush(color) {
      this.canvas.freeDrawingBrush.width = color
      this.canvas.renderAll()
    },
    eraseDrawConfig(options) {
      options = Object.assign({ color: 'white', drawWidth: 2 }, options)
      this.canvas.freeDrawingBrush.color = options.color // 设置自由绘颜色
      this.canvas.freeDrawingBrush.width = options.drawWidth
      this.canvas.renderAll()
    },
    removeClean(options) {
      this.canvas.selection = options.selection
      this.canvas.skipTargetFind = options.skipTargetFind
      if (options.selectable) {
        this.canvas.selectable = options.selectable
      }
    },
    removeCurrentObj() {
      const obj = this.canvas.getActiveObject()
      // console.log(obj);
      this.canvas.remove(obj)
      this.canvas.renderAll()
    },
    getEditObj() {
      const obj = this.canvas.getActiveObject()
      this.removeCurrentObj()
      return obj
    },
    setEditObj(obj) {
      this.canvas.add(obj)
      this.canvas.renderAll()
    },
    setRotate(deg = 36) {
      const obj = this.canvas.getActiveObject()
      const angle = obj.angle
      obj.rotate(angle + deg)
      this.canvas.renderAll()
    },
    renderAll() {
      this.canvas.renderAll(this.canvas)
    },
    disActive(obj) {
      this.canvas.discardActiveObject(obj)
      this.canvas.renderAll()
    },
    discardActive() {
      const obj = this.canvas.getActiveObject()
      this.canvas.discardActiveObject(obj)
      // this.canvas.discardActiveGroup();
      this.canvas.renderAll()
    },
    deactivateAll() {
      this.canvas.deactivateAll().renderAll()
    },
    deactivateOne(obj) {
      var activeGroup = this.canvas.getActiveGroup()
      activeGroup.removeWithUpdate(obj)
      this.canvas.renderAll()
    },
    setSelection(flag) {
      this.canvas.selection = flag
      this.canvas.renderAll()
    },
    moveTo() {
      const obj = this.canvas.getActiveObject()
      console.log(this.canvas.sendBackwards)
      this.canvas.sendBackwards(obj, true)
      this.canvas.discardActiveObject()
      // this.canvas.discardActiveGroup();
    },
    discardActiveObject() {
      this.canvas.discardActiveObject()
    },
    createRect(options) {
      options = Object.assign({ width: 0, height: 0, fillColor: 'rgba(255, 255, 255, 0)', left: 50, top: 50 }, options)
      const rect = new fabric.Rect({
        ...options,
        fill: options.fillColor // 填充的颜色
      })
      this.canvas.add(rect)
      this.canvas.renderAll()
    },
    createCircle(options) {
      options = Object.assign({ color: '#B2B2B2', drawWidth: 2 }, options)
      const defaultOption = {
        ...options,
        fill: options.fillColor,
        strokeWidth: options.drawWidth,
        stroke: options.color,
        opacity: options.opacity
      }
      const Circle = new fabric.Circle(defaultOption)
      this.canvas.add(Circle)
      this.canvas.renderAll()
    },
    createNumber(options) {
      debugger
      const text = new fabric.Textbox(options.val, options)
      this.canvas.add(text)
      this.canvas.renderAll()
    },
    setGlobalAlpha(val) {
      this.canvas.globalAlpha = val
    },
    createTriangle(options) {
      options = Object.assign({ x: 0, y: 0, x1: 0, y1: 0, x2: 0, y2: 0, left: 100, top: 100, color: '#B2B2B2', drawWidth: 2, fillColor: 'rgba(255, 255, 255, 0)', id: 'triangle' }, options)
      var path = 'M ' + options.x + ' ' + options.y + ' L ' + options.x1 + ' ' + options.y1 + ' L ' + options.x2 + ' ' + options.y2 + ' z'
      const canvasObject = new fabric.Path(path, {
        ...options,
        stroke: options.color,
        strokeWidth: options.drawWidth,
        fill: options.fillColor
      })
      this.canvas.add(canvasObject)
      this.canvas.renderAll()
    },
    createEqualTriangle(options) {
      options = Object.assign({ left: 100, top: 100, width: 50, height: 80, fillColor: 'rgba(255, 255, 255, 0)', color: '#B2B2B2', drawWidth: 2 }, options)
      // console.log(defaultOption);
      const triangle = new fabric.Triangle({
        ...options,
        fill: options.fillColor,
        strokeWidth: options.drawWidth,
        stroke: options.color
      })
      this.setContronVisibility(triangle)
      this.canvas.add(triangle)
      this.canvas.renderAll()
    },
    createLine(options) {
      options = Object.assign({ x: 0, y: 0, x1: 10, y1: 10, fillColor: 'rgba(255, 255, 255, 0)', strokeColor: '#B0B0B0' }, options)
      const line = new fabric.Line([options.x, options.y, options.x1, options.y1], {
        ...options,
        fill: options.fillColor,
        stroke: options.strokeColor
      })
      this.canvas.add(line)
      this.canvas.renderAll()
    },
    createEllipse(options) {
      options = Object.assign({ rx: 100, ry: 200, fillColor: 'rgba(255, 255, 255, 0)', angle: 0, strokeColor: '#B0B0B0', strokeWidth: 3, left: 50, top: 50 }, options)
      var ellipse = new fabric.Ellipse({
        ...options,
        fill: options.fillColor,
        stroke: options.strokeColor
      })
      this.canvas.add(ellipse)
      this.canvas.renderAll()
    },
    createText(text, options) {
      options = Object.assign({ left: 100, top: 100 }, options)
      var canvasObj = new fabric.Text(text, { ...options })
      this.canvas.add(canvasObj)
      this.canvas.renderAll()
    },
    createItext(text, options) {
      options = Object.assign({ left: 0, top: 0, fill: '#000' }, options)
      const IText = new fabric.IText(text, options)
      this.canvas.add(IText)
      this.canvas.renderAll()
    },
    toJson() {
      const json = this.canvas.toJSON()
      return json
    },
    toDataUrl() {
      const canvas = this.canvas
      const dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: 1
      })
      return dataURL
    },
    load(json, call) {
      this.canvas.loadFromJSON(json, call)
    },
    loadFromJSON(json, cb) {
      const canvas = this.canvas
      canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function(
        o,
        object
      ) {
        // `o` = json object
        // `object` = fabric.Object instance
        // ... do some stuff ...
        cb(o)
        object.setControlsVisibility({
          bl: true,
          br: true,
          mb: false,
          ml: true,
          mr: true,
          mt: false,
          mtr: true,
          tl: true,
          tr: true
        })
      })
    },
    clear() {
      this.canvas.clear()
    },
    getObjects() {
      return this.canvas.getObjects()
    },
    renderTop() {
      this.canvas.renderTop()
    },
    setBackgroundColor(color) {
      const canvas = this.canvas
      this.canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas))
    },
    setBackgroundImage(options) {
      const canvas = this.canvas
      let opt = {
        opacity: 1,
        left: 0,
        top: 0,
        angle: 0,
        crossOrigin: null,
        originX: 'left',
        originY: 'top',
        scaleX: 1,
        scaleY: 1
      }
      // console.log(options);
      if (Object.prototype.toString.call(options) == '[object String]') {
        console.log('字符串兼容')
        opt.imgUrl = options
      } else {
        opt = Object.assign(opt, options)
      }

      // canvas.setBackgroundImage(opt.imgUrl, canvas.renderAll.bind(canvas), {
      //   opacity: opt.opacity,
      //   angle: opt.angle,
      //   left: opt.left,
      //   top: opt.top,
      //   originX: 'left',
      //   originY: 'top',
      //   crossOrigin: opt.crossOrigin,
      //   ...opt
      // });

      fabric.Image.fromURL(opt.imgUrl, function(img) {
        img.set({ width: opt.width ? opt.width : canvas.width, height: opt.height ? opt.height : canvas.height, originX: 'left', originY: 'top', scaleX: opt.scaleX, scaleY: opt.scaleY })
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), { ...opt })
      })
    },
    toSvg() {
      return this.canvas.toSVG()
    },
    drawControls() {
      const canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.ellipse(100, 100, 50, 75, (45 * Math.PI) / 180, 0, 2 * Math.PI) // 倾斜45°角
      ctx.stroke()
      ctx.setLineDash([5])
      ctx.moveTo(0, 200)
      ctx.lineTo(200, 0)
      ctx.stroke()
      this.canvas.drawControls(ctx)
      // this.canvas.controlsAboveOverlay=true;
    },
    setContronVisibility(obj) {
      obj.setControlsVisibility({
        bl: true,
        br: true,
        mb: false,
        ml: true,
        mr: true,
        mt: false,
        mtr: true,
        tl: true,
        tr: true
      })
    },
    // 设置mirror
    toggleMirror(options) {
      options = options || {}
      options = Object.assign({ flip: 'X' }, options)
      const img = this.canvas.getActiveObject()
      // if (img && img.type == 'image') {
      if (options.flip === 'X') {
        img.toggle('flipX')
      } else {
        img.toggle('flipY')
      }
      this.renderAll()
      // }
    },
    // 设置层级
    toNextLayer() {
      const obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }
      obj.sendBackwards(true)
      this.renderTop()
      // this.canvas.setActiveObject(obj);
    },
    toBottomLayer() {
      const obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }
      obj.sendToBack()
      this.renderTop()
      // this.canvas.setActiveObject(obj);
    },
    toLastLayer() {
      const obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }
      obj.bringForward(true)
      this.renderTop()
    },
    toTopLayer(obj) {
      // const obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }
      obj.bringToFront()
      this.renderTop()
    },
    drawByPath(pathArray, options) {
      options = Object.assign({ fillColor: 'rgba(255, 255, 255, 0)', left: 150, top: 150, strokeColor: '#B0B0B0', strokeWidth: 3 }, options)
      let pathStr = 'M '
      for (const item of pathArray) {
        pathStr = pathStr + item[0] + ' ' + item[1] + ' '
      }
      pathStr = pathStr + 'z'
      console.log(pathStr)
      var path = new fabric.Path(pathStr)
      path.set({
        ...options,
        stroke: options.strokeColor,
        fill: options.fillColor
      })
      this.canvas.add(path)
    }
  }
}
</script>

<style lang="scss" scoped></style>
