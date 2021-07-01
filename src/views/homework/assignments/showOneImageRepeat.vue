<template>
  <div @contextmenu.prevent>
    <div align="center">
      <div class="backClass">
        <div>
          <div class="fenk leftClass">
            <div class="toolClass" :style="clientHeight">
              <ul id="toolsul" class="tools">
                <li
                  v-show="!auditControl"
                  id="color"
                  data-type="color"
                  title="色板"
                >
                  <colorPicker v-model="color" @change="headleChangeColor" />
                </li>
                <li v-show="!auditControl" data-type="equilateral">
                  <i
                    class="icon-tools icon-equilateral-black"
                    data-default="icon-tools icon-equilateral-black"
                    title="标记"
                  />
                </li>
                <li v-show="!auditControl" data-type="text">
                  <i
                    class="icon-tools icon-text-black"
                    data-default="icon-tools icon-text-black"
                    title="文本"
                  />
                </li>
                <li data-type="move">
                  <i
                    class="icon-tools icon-move-black"
                    data-default="icon-tools icon-move-black"
                    title="移动"
                  />
                </li>
                <li data-type="ratate">
                  <i
                    class="icon-tools icon-rotatewhite-black"
                    data-default="icon-tools icon-rotatewhite-black"
                    title="旋转"
                  />
                </li>
                <li data-type="enlarge">
                  <i
                    class="icon-tools icon-enlargewhite-black"
                    data-default="icon-tools icon-enlargewhite-black"
                    title="放大"
                  />
                </li>
                <li data-type="narrow">
                  <i
                    class="icon-tools icon-narrowwhite-black"
                    data-default="icon-tools icon-narrowwhite-black"
                    title="缩小"
                  />
                </li>
                <li v-show="!auditControl" id="toolsPencil" data-type="pen">
                  <i
                    class="icon-tools icon-pen-black"
                    data-default="icon-tools icon-pen-black"
                    title="画笔"
                  />
                </li>
                <li v-show="!auditControl" data-type="arrow">
                  <i
                    class="icon-tools icon-arrow-black"
                    data-default="icon-tools icon-arrow-black"
                    title="箭头"
                  />
                </li>
                <li v-show="!auditControl" data-type="line">
                  <i
                    class="icon-tools icon-line-black"
                    data-default="icon-tools icon-line-black"
                    title="实线"
                  />
                </li>
                <li v-show="!auditControl" data-type="ellipse">
                  <i
                    class="icon-tools icon-ellipse-black"
                    data-default="icon-tools icon-ellipse-black"
                    title="椭圆"
                  />
                </li>
                <li v-show="!auditControl" data-type="rectangle">
                  <i
                    class="icon-tools icon-rectangle-black"
                    data-default="icon-tools icon-rectangle-black"
                    title="长方形"
                  />
                </li>
                <li v-show="!auditControl" data-type="remove">
                  <i
                    class="icon-tools icon-remove-black"
                    data-default="icon-tools icon-remove-black"
                    title="橡皮擦"
                  />
                </li>
                <!--
                                <li data-type="eye" class="active">
                  <i
                    class="icon-tools icon-eye-select"
                    data-default="icon-tools icon-eye-black"
                    title="查看"
                  />
                </li>
                <li v-show="!auditControl" data-type="dottedline">
                  <i
                    class="icon-tools icon-dottedline-black"
                    data-default="icon-tools icon-dottedline-black"
                    title="虚线"
                  />
                </li>
                <li v-show="!auditControl" data-type="circle">
                  <i
                    class="icon-tools icon-circle-black"
                    data-default="icon-tools icon-circle-black"
                    title="圆"
                  />
                </li>-->
              </ul>
            </div>
          </div>
          <div id="canvasDiv" class="canvasDiv fenk" :style="clientHeight">
            <vue-fabric
              id="canvas"
              ref="canvas"
              :width="width"
              :height="height"
              @selection:created="selected"
              @selection:updated="selected"
              @mouse:dblclick="createCircle"
              @mouse:move="mousemove"
              @mouse:down="mousedown"
              @mouse:up="mouseup"
              @object:moving="objectMoving"
              @object:rotating="objectRotating"
            />
            <el-dialog
              :visible.sync="removeState"
              title="提示"
              width="250px"
              :modal="false"
              :show-close="true"
              :close-on-click-modal="false"
            >
              <div class="del-dialog-cnt">删除后无法恢复，确认删除吗？</div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeState = false">取 消</el-button>
                <el-button type="primary" @click="removeObj()">确 定</el-button>
              </span>
            </el-dialog>
            <div>
              <el-dialog
                class="el-dialog1"
                :visible.sync="commentsState"
                width="250px"
                :modal="false"
                :show-close="true"
                :close-on-click-modal="false"
                @opened="setStates"
                @closed="setCloseStates"
              >
                <comment-item
                  ref="tan"
                  :comment="commentObj"
                  :commentable="commentable"
                  :reviewable="reviewable"
                  :audit-state="auditState"
                  @cancel="cancel"
                  @setting-popup="settingP"
                  @update-comment="updateComment"
                  @comment-loaded="onCommentLoaded"
                  @delete-comment="deleteComment"
                  @delete-review="deleteReview"
                  @update-review="updateReview"
                />
              </el-dialog>
            </div>

          </div>
          <div id="comments" class="rightClass" :style="clientHeight">
            <el-row class="upDownRow" :gutter="10">
              <el-col :span="8" class="upDownCol">
                <div style="width:100%;font-size:16px;vertical-align: top;line-height: 38px;border: 1px solid #b9b4b7;background-color: #e6a23c;">
                  {{ currentNumber }}/{{ total }}
                </div>
              </el-col>
              <el-col :span="8" class="upDownCol">
                <i class="el-icon-top" title="上一页" style="width:100%;vertical-align: top;line-height: 38px;border: 1px solid #b9b4b7 ;background-color: #e6a23c;" @click="upClick()" />
              </el-col>
              <el-col :span="8" class="upDownCol">
                <i class="el-icon-bottom" title="下一页" style="width:100%;vertical-align: top;line-height: 38px; border: 1px solid #b9b4b7 ;background-color: #e6a23c;" @click="downClick()" />
              </el-col>
            </el-row>
            <div class="commentsDiv">
              <div v-for=" (comment,index) in comments" :key="comment.id" style="margin-top: 20px">
                <ImgCommentItem
                  :comment="comment"
                  :commentable="commentable"
                  :reviewable="reviewable"
                  :ind="index+1+''"
                  @update-comment="updateComments"
                  @delete-comment="deleteComment"
                  @update-review="updateReviews"
                  @delete-review="deleteReviews"
                />
              </div>
            </div>
            <!--            </div>-->
            <!--          <div
            v-for="comment in sortedComments"
            :key="comment.tagParagraph"
            :val="comment.tagParagraph"
          >
            <comment-item
              :comment="comment"
              :commentable="commentable"
              :reviewable="reviewable"
              @update-comment="updateComment"
              @comment-loaded="onCommentLoaded"
              @delete-comment="deleteComment"
              @delete-review="deleteReview"
              @update-review="updateReview"
            />
          </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import CommentItem from '../submissions/ImageCommentItema'
import ImgCommentItem from '../submissions/ImgCommentItem'
import vueFabric from '@/components/fabric'
import { upateImgJsonByIdRepeat, updateImgJsonAndAuditRepeat, getAuditById, updateAuditByIdRepeat, getHwStuHomeworkPicList, deleteImgJsonAndAuditRepeat, isReceive, updateRepeatImgById, deleteRepeatImgById, getAuditByImgId, getRepeatJudge } from '@/api/homework/hwHomework'
import { mapGetters } from 'vuex'
import uuid from 'uuid/v1'

export default {
  components: { vueFabric, CommentItem, ImgCommentItem },
  computed: {
    ...mapGetters([
      'currentRoleType'
    ])
  },
  data() {
    return {
      subState: true,
      total: 0,
      currentNumber: 0,
      removeState: false,
      suo: true,
      auditState: '1',
      auditControl: true,
      switchState: true,
      hwStuHomeworkId: undefined,
      imgId: undefined,
      currentObj: undefined,
      existence: false,
      reviewable: false,
      textbox: undefined,
      commentable: false,
      commentObj: {
        auditTeacherName: '',
        auditTeacherAvatar: '',
        auditTime: '2020-09-21',
        tagComment: '',
        tagParagraph: '123',
        repeatComment: '',
        repeatTeacherName: '',
        repeatTeacherAvatar: '',
        repeatTime: '2020-09-21'
      },
      comments: [],
      clientHeight: { height: '' },
      commentsState: false,
      commentsObj: undefined,
      form: {},
      removeObject: undefined,
      editing: true,
      tagComment: undefined,
      mouseFrom: {},
      circleXY: {},
      zoomDrag: false,
      mouseTo: {},
      kongzhi: false,
      drawingObject: undefined,
      doDrawing: false,
      moveCount: 1,
      imgUrl: '',
      color: '#FF1E02',
      radius: 15,
      fontSize: 28,
      drawWidth: 2,
      type: 'move',
      imageObj: {},
      equilateralState: true,
      width: 0,
      height: 0,
      circular: 0,
      imgs: [],
      imgObjs: [],
      lastHeight: 0,
      isDrawingMode: false,
      updateImgJsonContro: false,
      tagParagraph: undefined,
      jianting: 0,
      // add by wzx  初始化 比例
      originalScale: 1,
      minZoom: 0.2,
      maxZoom: 2,
      mouseFromOriginal: {}
    }
  },
  created() {
    window.zoom = 1
    this.hwStuHomeworkId = this.$route.query.hwStuHomeworkId
    if (this.currentRoleType === 'leve1teacher') {
      const state = this.$route.query.state
      // 判断是否是查看
      if (state === '0') {
        // 查看
        this.auditControl = true
        this.auditState = state
      } else {
        // 判断作业是否领取
        isReceive(this.hwStuHomeworkId).then(res => {
          if (res.data) {
            this.auditControl = false
            this.auditState = '0'
            this.commentable = true
          } else {
            this.auditControl = true
          }
        })
      }
    } else if (this.currentRoleType === 'leve2teacher') {
      getRepeatJudge(this.hwStuHomeworkId).then(res => {
        if (res.success && res.data != null) {
          this.auditControl = false
          this.auditState = '0'
          this.reviewable = true
          this.commentable = true
        } else {
          this.auditControl = true
        }
      })
    } else {
      this.auditControl = true
    }
    const that = this
    this.clientHeight.height = window.innerHeight - 30 + 'px'
    document.ready = function() {
      that.setTol()
    }
    window.onresize = function() {
      that.clientHeight.height = window.innerHeight - 30 + 'px'
      // that.settingDialog()
      that.commentsState = false
      that.setTol()
      // that.visualAngle()
      // this.clientHeight = window.innerHeight - 30 + 'px'
      // this.clientHeight = window.innerHeight - 30 + 'px'
    }
    const imgId = this.$route.query.id
    this.imgId = imgId
    getHwStuHomeworkPicList(this.hwStuHomeworkId).then(res => {
      if (res.success) {
        that.total = res.data.length
        res.data.forEach(function(img, ind) {
          that.imgs.push({ url: img.imgUrl, uid: img.id, name: img.imgName, width: img.width, height: img.height, imgJson: img.imgJson })
          if (img.id === imgId) {
            that.width = img.width
            that.height = img.height
            that.currentNumber = ind + 1
          }
        })
      }
      this.$nextTick(() => {
        this.imgSWitch(imgId)
        const sco = document.querySelector('.canvasDiv')
        const obj = { selection: false, skipTargetFind: false, selectable: true }
        that.$refs.canvas.removeClean(obj)
        /*          sco.scrollLeft = (this.width - sco.clientWidth) / 2
                  sco.scrollTop = (this.height - this.lastHeight) / 2*/
        // this.visualAngle()
        const elementList = document.querySelectorAll('#toolsul>li')
        elementList.forEach(function(a) {
          a.addEventListener('click', (event) => {
            const e = document.querySelectorAll('#toolsul>li>i')
            e.forEach(function(b) {
              b.setAttribute('class', b.getAttribute('data-default'))
            })
            a.setAttribute('class', 'active')
            var obox = a.parentNode
            var lis = obox.children
            for (var i = 0; i < lis.length; i++) {
              if (lis[i] !== a) {
                lis[i].setAttribute('class', '')
              }
            }
            /*            .siblings()
                                .removeClass('active')*/
            a.querySelector('i').setAttribute(
              'class',
              a.querySelector('i')
                .getAttribute('class')
                .replace('black', 'select')
            )
            that.type = a.getAttribute('data-type')
            that.isDrawingMode = false
            if (that.textbox) {
              // 退出文本编辑状态
              that.textbox.exitEditing()
              that.textbox = null
            }
            if (that.type === 'eye') {
              const obj = { selection: false, skipTargetFind: false, selectable: true }
              that.$refs.canvas.removeClean(obj)
              that.updateImageSelectable(false)
              // this.cleanState()
            } else if (that.type === 'text') {
              const obj = { selection: true, skipTargetFind: false, selectable: true }
              that.$refs.canvas.removeClean(obj)
              that.updateImageSelectable(true)
            } else if (that.type === 'move') {
              const obj = { selection: false, skipTargetFind: false, selectable: true }
              that.$refs.canvas.removeClean(obj)
              that.updateImageSelectable(true)
            } else if (that.type === 'pen') {
              that.cleanState()
              that.isDrawingMode = true
              that.updateImageSelectable(false)
            } else if (that.type === 'remove') {
              const obj = { selection: true, skipTargetFind: false, selectable: false }
              that.$refs.canvas.removeClean(obj)
              that.updateImageSelectable(false)
            } else if (that.type === 'ratate') {
              const obj = { selection: false, skipTargetFind: false, selectable: true }
              that.$refs.canvas.removeClean(obj)
              that.updateImageSelectable(false)
              that.rotateing()
            } else if (that.type === 'enlarge') {
              const obj = { selection: false, skipTargetFind: false, selectable: true }
              that.$refs.canvas.removeClean(obj)
              that.updateImageSelectable(false)

              if (that.width * (parseFloat(window.zoom) + 0.1) <= that.width * (parseFloat(that.originalScale) * that.maxZoom) &&
                  that.height * (parseFloat(window.zoom) + 0.1) <= that.height * (parseFloat(that.originalScale) * that.maxZoom)) {
                window.zoom = parseFloat(window.zoom) + 0.1
                that.enlargeAndNarrow(parseFloat(window.zoom))
              } else {
                that.$message.error('超出最大尺寸无法放大')
              }
            } else if (that.type === 'narrow') {
              const obj = { selection: false, skipTargetFind: false, selectable: true }
              that.$refs.canvas.removeClean(obj)
              that.updateImageSelectable(false)
              if (that.width * (parseFloat(window.zoom) - 0.1) >= that.width * (parseFloat(that.originalScale) * that.minZoom) &&
                  that.height * (parseFloat(window.zoom) - 0.1) >= that.height * (parseFloat(that.originalScale) * that.minZoom)) {
                window.zoom = parseFloat(window.zoom) - 0.1
                that.enlargeAndNarrow(parseFloat(window.zoom))
              } else {
                that.$message.error('小于最小尺寸无法缩小')
              }
            } else {
              that.cleanState()
              that.updateImageSelectable(false)
            }
            that.$refs.canvas.freeDrawConfig({
              isDrawingMode: that.isDrawingMode,
              color: that.color,
              drawWidth: that.drawWidth * 2
            })
            if (that.commentsState) {
              that.commentsState = false
            }
          })
        })
        // that.imgRendering()
      })
    })
  },
  mounted() {
    this.$nextTick(() => {

    })
  },
  updated() {
    if (this.kongzhi) {
      this.settingPopup()
      this.kongzhi = false
    }
  },
  methods: {
    settingP() {
      this.$nextTick(() => {
        this.settingPopup()
      })
    },
    settingPopup() {
      const cc = document.querySelector('.el-dialog1')
      const top = parseInt(cc.style.top.substring(0, cc.style.top.length - 2))
      let height = cc.clientHeight
      if (height < 326) {
        height = 326
      } else if (height < 648) {
        height = 648
      }
      if ((top + height) > window.innerHeight) {
        cc.style.top = top - ((top + height) - window.innerHeight) - 20 + 'px'
      }
    },
    setTol() {
      const that = this
      const lis = document.querySelectorAll('.tools>li')
      lis.forEach(function(li) {
        li.style.height = li.clientWidth + 'px'
        li.style.lineHeight = li.clientWidth + 'px'
        // li.style.fontSize = li.clientWidth / 2 + 'px'
      })
    },
    removeObj() {
      const e = this.removeObject
      if (e) {
        if (e.target._objects) {
          // 多选删除
          var etCount = e.target._objects.length
          for (var etindex = 0; etindex < etCount; etindex++) {
            if (e.target._objects[etindex].type !== 'image') {
              this.removeRule(e.target._objects[etindex])
            }
          }
        } else {
          this.removeRule(e.target)
          // this.$refs.canvas.remove(e.target)
        }
      } else {
        this.$message.success('移除失败')
      }
      this.$refs.canvas.discardActiveObject() // 清楚选中框
      this.removeState = false
      this.$nextTick(() => {
        this.updateJson()
      })
    },
    removeRule(e) {
      if (e.type === 'circle' && e.id && e.id.indexOf('-') === -1) {
        this.$refs.canvas.disActive(e)
      } else if (e.type === 'textbox' && e.id) {
        this.$refs.canvas.disActive(e)
      } else {
        this.$refs.canvas.remove(e)
      }
    },
    enlargeAndNarrow(zoom) {
      const that = this
      // const objs = that.$refs.canvas.getObjects()
      // const a = objs.find(res => res.type === 'image')
      // that.$refs.canvas.zoomToPoint(a.getCenterPoint(), window.zoom)
      that.$refs.canvas.setZoom(zoom)
      that.rotateCanvas()
    },
    rotateing() {
      const that = this
      const objs = this.$refs.canvas.getObjects()
      const a = objs.find(res => res.type === 'image')
      const origin = a.getCenterPoint()
      objs.forEach(function(b) {
        // 获取元素中心店位置
        const point = b.getCenterPoint()
        // 根据弧度变化算出新的元素中心点
        const angle = 90
        let newP = that.$refs.canvas.rotatePoint(point, origin, fabric.util.degreesToRadians(angle))
        // 把中心点的位置转换为left top的位置
        if (b.type !== 'ellipse') {
          newP = b.translateToOriginPoint(newP, 'left', 'top')
        }
        // 改变元素位置
        b.left = newP.x
        b.top = newP.y
        b.rotate(b.angle + angle)
        b.setCoords()
      })
      this.rotateCanvas()
    },
    rotateCanvas() {
      const that = this
      const objs = this.$refs.canvas.getObjects()
      const a = objs.find(res => res.type === 'image')
      let width = a.width * window.zoom
      let height = a.height * window.zoom
      const scaleX = a.scaleX
      const angle = a.angle
      width = Math.round(Math.abs((width * scaleX) / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * (90 - angle))) + Math.abs((height * scaleX) / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * (angle))))
      height = Math.round(Math.abs(a.width * window.zoom * scaleX / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * angle)) + Math.abs(height * scaleX / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * (90 - angle))))
      that.$refs.canvas.setWidth(width)
      that.$refs.canvas.setHeight(height)
      that.$refs.canvas.renderAll()
      const cc = a.getCenterPoint()
      const cen = new fabric.Point(width / 2, height / 2)
      // const newP = a.translateToOriginPoint(cen, 'left', 'top')
      const cWidth = cen.x - cc.x * window.zoom
      const cHeight = cen.y - cc.y * window.zoom
      objs.forEach(function(b) {
        // 改变元素位置
        b.left = Math.round(b.left + cWidth / window.zoom * 1)
        b.top = Math.round(b.top + cHeight / window.zoom * 1)
        b.setCoords()
      })
      that.$refs.canvas.renderAll()
      this.visualAngle(that.$refs.canvas.getObjects().find(res => res.type === 'image'))
    },
    objectRotating(e) {
      const that = this

      if (e.target.type === 'image') {
        const objs = this.$refs.canvas.getObjects()
        const a = e.target
        const origin = a.getCenterPoint()

        objs.forEach(function(b) {
          if (b.type !== 'image') {
            // 获取元素中心店位置
            const point = b.getCenterPoint()
            // 根据弧度变化算出新的元素中心点
            const c = a.angle
            const angle = c - that.imageObj.angle
            let newP = that.$refs.canvas.rotatePoint(point, origin, fabric.util.degreesToRadians(angle))
            // 把中心点的位置转换为left top的位置
            if (b.type !== 'ellipse') {
              newP = b.translateToOriginPoint(newP, 'left', 'top')
            }
            // 改变元素位置
            b.left = Math.round(newP.x)
            b.top = Math.round(newP.y)
            b.rotate(b.angle + angle)
            b.setCoords()
          }
        })
        that.imageObj = Object.assign({}, a)
      }
    },
    objectMoving(e) {
      const that = this
      if (e.target.type === 'circle' && e.target.id) {
        const objs = this.$refs.canvas.getObjects()
        objs.forEach(function(a) {
          if (a.type === 'textbox' && e.target.id === a.id) {
            a.left = e.target.left + (that.radius - that.fontSize / 2)
            a.top = e.target.top + (that.radius - that.fontSize / 2)
            that.$refs.canvas.renderAll()
            const img = that.imgs.find(res => res.uid === that.imgId)
            img.imgJson = JSON.stringify(that.$refs.canvas.toJson())
            return false
          }
        })
      }
      if (e.target.type === 'image') {
        const objs = this.$refs.canvas.getObjects()
        const a = objs.find(res => res.type === 'image')
        const left = a.left - that.imageObj.left
        const top = a.top - that.imageObj.top
        objs.forEach(function(b) {
          if (b.type !== 'image') {
            b.left = Math.round(b.left + left)
            b.top = Math.round(b.top + top)
            b.setCoords()
          }
        })
        // const img = that.imgs.find(res => res.uid === that.imgId)
        // img.imgJson = JSON.stringify(that.$refs.canvas.toJson())
        that.imageObj = Object.assign({}, a)
      }
    },
    setStates() {
      if (this.commentObj.id) {
        this.$refs.tan.setStates(false)
      } else {
        this.$refs.tan.setStates(true)
      }
    },
    setCloseStates() {
      this.restComment()
      this.circleXY = {}
      this.tagParagraph = undefined
      this.$refs.tan.setStatess()
    },
    imgRendering() {
      const that = this
      const elImage = document.querySelectorAll('.el-image')
      const inx = this.imgs.findIndex(res => res.uid === this.imgId)
      elImage[inx].classList.add('imgclass')
      elImage.forEach(function(image, idxi) {
        image.addEventListener('click', (event) => {
          if (that.updateImgJsonContro) {
            that.updateImgJsonContro = false
            if (that.auditControl) {
              elImage.forEach(function(im) {
                im.classList.remove('imgclass')
              })
              image.classList.add('imgclass')
              const dataId = image.children[0].dataset.id
              that.imgSWitch(dataId)
              that.imgId = dataId
              that.updateImgJsonContro = true
            } else {
              let json = that.$refs.canvas.toJson()
              json = that.getNewJson(json)
              const jsonStr = JSON.stringify(json)
              upateImgJsonByIdRepeat({ id: that.imgId, imgJson: jsonStr }).then(res => {
                if (res.success && res.data) {
                  const im = that.imgs.find(r => r.uid === that.imgId)
                  im.imgJson = jsonStr
                  elImage.forEach(function(im) {
                    im.classList.remove('imgclass')
                  })
                  image.classList.add('imgclass')
                  const dataId = image.children[0].dataset.id
                  that.imgSWitch(dataId)
                } else {
                  this.$message.error(res.msg)
                }
              }).finally(() => {
                that.imgId = image.children[0].dataset.id
                that.updateImgJsonContro = true
              })
            }
          } else {
            that.$message.error('上一步操作未结束，请稍后再试')
          }
        })
      })
    },
    resetCanvas(a) {
      window.zoom = 1
      this.$refs.canvas.setZoom(window.zoom)
      this.rotateCanvas(a)
    },
    getFileList(id) {
      const that = this
      // 获取图片
      const imgs = []
      getHwStuHomeworkPicList(id).then(res => {
        if (res.success) {
          res.data.forEach(function(img) {
            imgs.push({ url: img.imgUrl, uid: img.id, name: img.imgName, width: img.width, height: img.height, imgJson: img.imgJson })
          })
        }
        that.imgs = imgs
      })
    },
    upClick() {
      const that = this
      if (this.imgs.length > 0) {
        const idx = this.imgs.findIndex(res => res.uid === this.imgId)
        if (idx === 0) {
          this.$message.error('当前已经是第一页！')
          return false
        }
        if (this.updateImgJsonContro) {
          this.updateImgJsonContro = false
          if (this.auditControl) {
            this.imgSWitch(this.imgs[idx - 1].uid, idx)
          } else {
            const im = this.imgs.find(rr => rr.uid === this.imgId)
            const json = this.$refs.canvas.toJson()
            im.imgJson = JSON.stringify(json)
            upateImgJsonByIdRepeat({ id: this.imgId, imgJson: im.imgJson }).then(res => {
              if (res.success && res.data) {
                this.imgSWitch(this.imgs[idx - 1].uid, idx)
                this.$message.success('已自动保存')
              } else {
                // this.$message.error(res.msg)
                if (res.msg === '您不具备此资源操作权限') {
                  this.imgSWitch(this.imgs[idx - 1].uid, idx)
                }
              }
            }).catch(() => {
              that.updateImgJsonContro = true
            })
          }
        } else {
          this.$message.error('上一步操作未结束，请稍后再试')
        }
      }
    },
    downClick() {
      const that = this
      const idx = this.imgs.findIndex(res => res.uid === this.imgId)
      if (idx === this.imgs.length - 1) {
        this.$message.error('当前已经最后一页！')
        return false
      }
      if (this.updateImgJsonContro) {
        this.updateImgJsonContro = false
        if (this.auditControl) {
          this.imgSWitch(this.imgs[idx + 1].uid, idx + 2)
        } else {
          const im = this.imgs.find(rr => rr.uid === this.imgId)
          const json = this.$refs.canvas.toJson()
          im.imgJson = JSON.stringify(json)
          upateImgJsonByIdRepeat({ id: this.imgId, imgJson: im.imgJson }).then(res => {
            if (res.success && res.data) {
              // this.$message.success('保存成功')
              this.imgSWitch(this.imgs[idx + 1].uid, idx + 2)
              this.$message.success('已自动保存')
            } else {
              if (res.msg === '您不具备此资源操作权限') {
                this.imgSWitch(this.imgs[idx + 1].uid, idx + 2)
              }
            }
          }).catch(() => {
            that.updateImgJsonContro = true
          })
        }
      } else {
        this.$message.error('上一步操作未结束，请稍后再试')
      }
    },
    visualAngle(a) {
      let x = a.left * window.zoom
      let y = a.top * window.zoom
      let width = a.width * window.zoom
      let height = a.height * window.zoom
      // 翻转重新计算初始比例
      const imgWidth = window.innerWidth - 450 - 20
      this.originalScale = (imgWidth / a.width).toFixed(2)
      const scaleX = a.scaleX
      const angle = a.angle
      const sco = document.querySelector('.canvasDiv')
      // const objs = this.$refs.canvas.getObjects()
      if (angle !== 0) {
        width = Math.abs((width * scaleX) / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * (90 - angle))) + Math.abs((height * scaleX) / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * (angle)))
        height = Math.abs(a.width * window.zoom * scaleX / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * angle)) + Math.abs(height * scaleX / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * (90 - angle)))
        const center = a.getCenterPoint()
        x = center.x * window.zoom - width / 2
        y = center.y * window.zoom - height / 2
        this.$nextTick(() => {
          sco.scrollLeft = x + (x + width / 2) - (x + sco.clientWidth / 2) + 10
          sco.scrollTop = y + (y + height / 2) - (y + sco.clientHeight / 2) + 10
        })
      } else {
        this.$nextTick(() => {
          sco.scrollLeft = x + (x + width * scaleX / 2) - (x + sco.clientWidth / 2) + 10
          sco.scrollTop = y + (y + height * scaleX / 2) - (y + sco.clientHeight / 2) + 10
        })
      }
    },
    imgSWitch(id, inds) {
      const that = this
      if (this.imgs && this.imgs.length > 0) {
        const img = this.imgs.find(res => res.uid === id)
        this.lastHeight = img.height
        const can = document.querySelector('.canvas-container')
        can.style.display = 'none'
        this.comments = []
        if (img.imgJson) {
          const jsonStr = this.unescape(img.imgJson)
          this.$refs.canvas.load(jsonStr, function() {
            getAuditByImgId(id).then(res => {
              that.comments = res.data
              that.comments.forEach(function(u, index) {
                u.tagComment = that.unescape(u.tagComment)
                u.repeatComment = that.unescape(u.repeatComment)
                u.head = true
              })
              const im = that.$refs.canvas.getObjects().find(res => res.type === 'image')
              that.resetCanvas(im)
              const objs = that.$refs.canvas.getObjects()
              const a = objs.find(res => res.type === 'image')
              let width = a.width
              const height = a.height
              const angle = a.angle
              const scaleX = a.scaleX
              if (angle !== 0) {
                width = Math.abs((width * scaleX) / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * (90 - angle))) + Math.abs((height * scaleX) / Math.sin(2 * Math.PI / 360 * 90) * Math.sin(2 * Math.PI / 360 * (angle)))
              }
              const imgWidth = window.innerWidth - 450 - 20
              window.zoom = (imgWidth / width).toFixed(2)
              // 初始化比例
              that.originalScale = (imgWidth / width).toFixed(2)

              that.enlargeAndNarrow(window.zoom)
              // that.addNumber(res.data)
              that.imgId = id
              that.updateImgJsonContro = true
              if (inds) {
                that.currentNumber = inds
              }
              can.style.display = 'inline-block'
            })
          })
          // 如果json数据存在，那么就使用json数据，否则直接创建图片
        } else {
          // this.$refs.canvas.clear()
          that.updateImgJsonContro = false
          that.createImgs(img.url, function(a) {
            if (a.width > 0 && a.height > 0) {
              that.resetCanvas(a)
              const objs = that.$refs.canvas.getObjects()
              const im = objs.find(res => res.type === 'image')
              const width = im.width
              const imgWidth = window.innerWidth - 450 - 20
              window.zoom = (imgWidth / width).toFixed(2)
              // 初始化比例
              that.originalScale = (imgWidth / width).toFixed(2)

              that.enlargeAndNarrow(window.zoom)
              that.imgId = id
              that.updateImgJsonContro = true
              if (inds) {
                that.currentNumber = inds
              }
            }
            can.style.display = 'inline-block'
          })
        }
      }
    },
    addNumber(comments) {
      // const circleArray = []
      const that = this
      const str = JSON.stringify(this.$refs.canvas.getObjects())
      const objs = JSON.parse(str)
      // 清空所有带id的Textbox
      objs.find(function(res) {
        if (res.type === 'circle' && res.id.indexOf('-') === -1) {
          let computedRadius = that.radius
          let computedFontSize = that.fontSize
          if (parseFloat(that.originalScale) <= 0.4) {
            computedRadius = computedRadius / 0.3
            computedFontSize = computedFontSize / 0.3
          }
          let num = comments.findIndex(r => r.id === res.id)
          if (num !== -1) {
            num = num + 1 + ''
            const textbox = new fabric.Textbox(num, {
              left: res.left,
              top: res.top + (computedRadius - computedFontSize / 2),
              width: computedRadius * 2,
              fontSize: computedFontSize,
              borderColor: that.color,
              textAlign: 'center',
              fill: '#000000',
              fontWeight: 'bold',
              hasControls: false,
              angle: res.angle,
              id: res.id
            })
            // let newP = textbox.translateToOriginPoint(newP, 'left', 'top')
            // textbox.rotate(res.angle)
            that.$refs.canvas.add(textbox)
            textbox.rotate(-textbox)
            // textbox.rotate(res.angle)
          }
        }
      })
      that.markTop()
      that.$refs.canvas.renderAll()
    },
    settingScroll(img) {

    },
    unescape(html) {
      if (!html) {
        return ''
      }
      return html
        .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/amp;/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "\'")
        .replace(/&ldquo;/g, '\“')
        .replace(/&rdquo;/g, '\”')
        .replace(/&lsquo;/g, '\‘')
        .replace(/&rsquo;/g, '\’')
    },
    updateImageSelectable(flag) {
      this.$refs.canvas.discardActive()
      const objs = this.$refs.canvas.getObjects()
      objs.forEach(function(a) {
        if (a.type === 'image') {
          a.selectable = flag
        }
      })
    },
    cleanState() {
      const that = this
      that.isDrawingMode = false
      const obj = { selection: false, skipTargetFind: false, selectable: true }
      that.$refs.canvas.removeClean(obj)
    },
    siblingElems(elem) {
      var nodes = []
      var _elem = elem
      while ((elem = elem.previousSibling)) {
        if (elem.nodeType == 1) {
          nodes.push(elem)
        }
      }
      var elem = _elem
      while ((elem = elem.nextSibling)) {
        if (elem.nodeType === 1) {
          nodes.push(elem)
        }
      }
    },
    cancel(a) {
      this.commentObj = {
        auditTeacherName: '',
        auditTeacherAvatar: '',
        auditTime: '',
        tagComment: '',
        tagParagraph: '',
        repeatComment: '',
        repeatTeacherName: '',
        repeatTeacherAvatar: '',
        repeatTime: '',
        head: false
      }
      this.commentsState = a
      this.equilateralState = true
    },
    getNewJson(json) {
      const objs = json.objects.filter(t => !(t.type === 'textbox' && t.id))
      json.objects = objs
      return json
    },
    updateComments({ data }) {
      // 此处需要判断是新建还是编辑
      updateAuditByIdRepeat({ id: data.id, tagComment: data.tagComment }).then(res => {
        if (res.success && res.data) {
          res.data.tagComment = this.unescape(res.data.tagComment)
          res.data.repeatComment = this.unescape(res.data.repeatComment)
          res.data.head = true
          const num = this.comments.findIndex(r => r.id === data.id)
          this.comments[num] = res.data
          this.tagParagraph = res.data.id
          this.commentObj = res.data
          this.$message.success('更新成功')
          this.equilateralState = true
          // this.commentsState = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateComment({ tagComment }) {
      if (this.subState) {
        this.subState = false
        // 此处需要判断是新建还是编辑
        if (this.tagParagraph) {
          // 编辑
          this.updateTagging(tagComment)
        } else {
          // 新增
          const json = this.$refs.canvas.toJson()
          let jsons = JSON.parse(JSON.stringify(json))
          jsons = this.getNewJson(jsons)
          this.addTagging(jsons, tagComment)
        }
      } else {
        this.$message.error('请勿重复提交！')
      }
      // this.sortedComments.push(obj)
    },
    updateTagging(tagComment) {
      updateAuditByIdRepeat({ id: this.tagParagraph, tagComment: tagComment }).then(res => {
        if (res.success && res.data) {
          res.data.tagComment = this.unescape(res.data.tagComment)
          res.data.repeatComment = this.unescape(res.data.repeatComment)
          res.data.head = true
          this.commentObj = res.data
          const num = this.comments.findIndex(r => r.id === this.commentObj.id)
          this.comments[num] = res.data
          this.$message.success('更新成功')
          this.$refs.tan.setStates(false)
          this.equilateralState = true
          // this.commentsState = false
        } else {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        this.subState = true
      })
    },
    updateJson() {
      this.updateImgJsonContro = false
      const that = this
      const json = this.$refs.canvas.toJson()
      let jsons = JSON.parse(JSON.stringify(json))
      jsons = JSON.stringify(this.getNewJson(jsons))
      upateImgJsonByIdRepeat({ id: that.imgId, imgJson: jsons }).then(ress => {
        if (ress.success && ress.data) {
          this.$message.success('已自动保存')
        } else {
          this.$message.error(ress.msg)
        }
      }).finally(() => {
        that.updateImgJsonContro = true
      })
    },
    addTagging(json, tagComment) {
      const that = this
      let computedRadius = that.radius
      if (parseFloat(that.originalScale) <= 0.4) {
        computedRadius = computedRadius / 0.3
      }

      updateImgJsonAndAuditRepeat({ hwStuHomeworkPicImgJsonQueryParam: { id: this.imgId, imgJson: '' }, hwHomeworkAuditPic: { stuHomeworkId: this.hwStuHomeworkId, tagParagraph: this.tagParagraph, tagComment: tagComment }}).then(res => {
        if (res.success && res.data) {
          const Circle = new fabric.Circle({
            left: that.circleXY.x - computedRadius,
            top: that.circleXY.y - computedRadius,
            stroke: that.color,
            // 如果初始化是缩小的。 批注圆圈半径放大。 初始化是放大的 不变
            radius: computedRadius,
            fill: that.color, // 填充的颜色
            strokeWidth: this.drawWidth,
            lockScalingX: true,
            lockScalingY: true,
            opacity: 0.6,
            id: res.data.id
          })
          json.objects.push(Circle)
          json = that.getNewJson(json)
          const jsonStr = JSON.stringify(json)
          upateImgJsonByIdRepeat({ id: that.imgId, imgJson: jsonStr }).then(ress => {
            if (ress.success && ress.data) {
              that.$refs.canvas.add(Circle)
              that.$refs.canvas.renderAll()
              const img = that.imgs.find(r => r.uid === that.imgId)
              img.imgJson = JSON.stringify(json)
              res.data.tagComment = that.unescape(res.data.tagComment)
              res.data.head = true
              that.commentObj = res.data
              that.$refs.tan.setStates(false)
              that.comments.push(res.data)
              that.addNumber(that.comments)
              this.tagParagraph = res.data.id
              this.circleXY = {}
            } else {
              this.$message.error(ress.msg)
            }
          }).finally(() => {
            this.subState = true
          })
        } else {
          this.$message.error(res.msg)
        }
        /*          json.objects.forEach(function(a, b) {
                if (a.type === 'circle' && a.id === that.tagParagraph) {
                  a.id = res.data.id
                  // that.$refs.canvas.load(jsonStr)
                  /!*                            json.objects.push(new fabric.Textbox('12', {
                    left: a.left + ((that.radius * 2 - 18) / 2),
                    top: a.top + ((that.radius * 2 - 18) / 2),
                    width: that.radius * 2,
                    fontSize: 18,
                    borderColor: that.color,
                    textAlign: 'center',
                    fill: '#000000',
                    hasControls: false,
                    id: a.id
                  }))*!/
                  const jsonStr = JSON.stringify(json)
                  that.$refs.canvas.load(jsonStr, function() {
                    const img = that.imgs.find(r => r.uid === that.imgId)
                    img.imgJson = jsonStr
                    that.$refs.tan.setStates(false)
                    that.tagParagraph = a.id
                    that.comments.push(res.data)
                    that.addNumber(that.comments)
                  })
                  return false
                }
              })*/
      })
    },
    restComment() {
      this.commentObj = {
        auditTeacherName: '',
        auditTeacherAvatar: '',
        auditTime: '',
        tagComment: '',
        tagParagraph: '',
        repeatComment: '',
        repeatTeacherName: '',
        repeatTeacherAvatar: '',
        repeatTime: '',
        head: false
      }
    },
    deleteComment({ data, success, error }) {
      const that = this
      // 为了避免后台删除失败但是前端对数据做了修改，所以采取真克隆
      const oldjson = this.$refs.canvas.toJson()
      let jsonStr = JSON.stringify(oldjson)
      let newJson = JSON.parse(jsonStr)
      newJson.objects.forEach(function(a, b) {
        if (a.type === 'circle' && a.id === data.id) {
          newJson.objects.splice(b, 1)
        }
      })
      newJson = this.getNewJson(newJson)
      jsonStr = JSON.stringify(newJson)
      deleteImgJsonAndAuditRepeat({ hwHomeworkAuditPic: { id: data.id }, hwStuHomeworkPicImgJsonQueryParam: { id: this.imgId, imgJson: jsonStr }}).then(res => {
        if (res.success && res.data) {
          this.$message.success('删除成功')
          this.commentsState = false
          this.equilateralState = true
          const newComments = this.comments.filter(r => r.id !== data.id)
          this.comments = newComments
          this.restComment()
          this.$refs.canvas.load(jsonStr, function() {
            that.addNumber(that.comments)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateReviews({ data }) {
      updateRepeatImgById({ id: data.id, repeatComment: data.repeatComment }).then(res => {
        if (res.success && res.data) {
          res.data.tagComment = this.unescape(res.data.tagComment)
          res.data.repeatComment = this.unescape(res.data.repeatComment)
          res.data.head = true
          const num = this.comments.findIndex(r => r.id === data.id)
          this.comments[num] = res.data
          this.tagParagraph = res.data.id
          this.commentObj = res.data
          this.$message.success('复评成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateReview(payload) {
      if (this.subState) {
        this.subState = false
        const repeatComment = payload.data.repeatComment
        if (this.tagParagraph.indexOf('-') === -1) {
          updateRepeatImgById({ id: this.tagParagraph, repeatComment: repeatComment }).then(res => {
            if (res.success && res.data) {
              res.data.tagComment = this.unescape(res.data.tagComment)
              res.data.repeatComment = this.unescape(res.data.repeatComment)
              res.data.head = true
              const num = this.comments.findIndex(r => r.id === res.data.id)
              this.comments[num] = res.data
              this.commentObj = res.data
              this.$message.success('复评成功')
            }
          }).finally(() => {
            this.subState = true
          })
        } else {
          this.$message.error('请先评论再复评')
        }
      } else {
        this.$message.error('请勿重复提交！')
      }
      /* this.$emit('review-update', payload)*/
    },
    deleteReviews({ data, success, error }) {
      deleteRepeatImgById({ id: data.id }).then(res => {
        if (res.success && res.data) {
          res.data.tagComment = this.unescape(res.data.tagComment)
          res.data.head = true
          const num = this.comments.findIndex(r => r.id === res.data.id)
          this.comments[num] = res.data
          this.commentObj = res.data
          this.tagParagraph = res.data.id
          this.$message.success('删除复评成功')
        } else {
          this.$message.error('删除复评失败')
        }
      })
    },
    deleteReview({ data, success, error }) {
      deleteRepeatImgById({ id: this.tagParagraph }).then(res => {
        if (res.success && res.data) {
          res.data.tagComment = this.unescape(res.data.tagComment)
          res.data.head = true
          const num = this.comments.findIndex(r => r.id === res.data.id)
          this.comments[num] = res.data
          this.commentObj = res.data
          this.$message.success('删除复评成功')
        } else {
          this.$message.error('删除复评失败')
        }
      })
    },
    onCommentLoaded(uuid) {

    },
    onCommentUpdate() {
      this.$emit('update-comment', {
        data: this.form,
        success: () => {
          this.tagComment = this.form.tagComment
          this.editing = false
        },
        error: () => {
          // show error msg
        }
      })
    },
    onCommentChange(data) {
      this.form.tagComment = data
    },
    createImgs(url, call) {
      const that = this
      new fabric.Image.fromURL(url, function(img) {
        const le = Math.round(img.width < that.width ? (that.width / 2 - img.width / 2) : 0)
        const t = Math.round((that.height - that.lastHeight) / 2)
        const imgOptions = {
          // left: (that.width / 2 - img.width / 2 + 1),
          left: le,
          top: t,
          cornerStrokeColor: 'blue',
          evented: false,
          selectable: false,
          selection: true,
          hasRotatingPoint: false
        }
        img.set(imgOptions)
        // that.lastHeight = that.lastHeight + height
        that.$refs.canvas.clear()
        that.$refs.canvas.add(img) // 把图片添加到画布上
        that.$refs.canvas.renderAll.bind(that.$refs.canvas)
        const im = that.$refs.canvas.getObjects().find(res => res.type === 'image')
        call(im)
      })
    },
    headleChangeColor() {
      if (this.type === 'pen') {
        this.$refs.canvas.freeDrawConfig({
          isDrawingMode: this.isDrawingMode,
          color: this.color,
          drawWidth: this.drawWidth
        })
      }
    },
    mousemove(e) {
      var xy = {}
      var wz = {}
      const xyor = {}
      if (e.e.offsetX === undefined) {
        xy = this.transformMouse(e.pointer.x, e.pointer.y)
        xyor.x = e.pointer.x
        xyor.y = e.pointer.y
      } else {
        xy = this.transformMouse(e.e.offsetX, e.e.offsetY)
        wz = { x: e.e.clientX, y: e.e.clientY }
        xyor.x = e.e.offsetX
        xyor.y = e.e.offsetY
      }

      // 当鼠标移动到最上面时，自动滑动滚动条
      const sco = document.querySelector('.canvasDiv')
      if (this.type === 'enlarge' || this.type === 'narrow' || this.type === 'move') {
        if (this.zoomDrag) {
          // 横向可移动的最大距离
          const limitX = sco.scrollWidth - sco.offsetWidth + 20
          // 纵向可移动的最大距离
          const limitY = sco.scrollHeight - sco.offsetHeight + 20
          let scrollTop = sco.scrollTop
          let scrollLeft = sco.scrollLeft

          // 获取鼠标按下后移动的距离
          const moveX = xyor.x - this.mouseFromOriginal.x
          const moveY = xyor.y - this.mouseFromOriginal.y

          // PS: 需要注意的是当鼠标向上移动时, 滚动条应该向下移动, 所以这里都是减去的移动距离
          scrollTop = scrollTop - moveY
          scrollLeft = scrollLeft - moveX

          if (scrollTop >= limitY) {
            // 当滑块移动到底端时
            scrollTop = limitY
          } else if (scrollTop <= 0) {
            // 当滑块移动到顶端时
            scrollTop = 0
          }

          if (scrollLeft >= limitX) {
            // 当滑块移动到左侧时
            scrollLeft = limitX
          } else if (scrollLeft <= 0) {
            // 当滑块移动到右侧时
            scrollLeft = 0
          }

          // 将计算后的距离赋值给滚动条
          sco.scrollTop = scrollTop
          sco.scrollLeft = scrollLeft

          // const num = this.getDirection(this.mouseFrom.x, this.mouseFrom.y, xy.x, xy.y)
          // if (num === 1) {
          //   sco.scrollTop = sco.scrollTop + 10
          // } else if (num === 2 && sco.scrollTop > 0) {
          //   sco.scrollTop = sco.scrollTop - 10
          // } else if (num === 3) {
          //   sco.scrollLeft = sco.scrollLeft + 10
          // } else if (num === 4 && sco.scrollLeft > 0) {
          //   sco.scrollLeft = sco.scrollLeft - 10
          // }
        }
        return false
      }
      if (wz.y < 20) {
        sco.scrollTop = sco.scrollTop - 5
      }
      if (wz.y > (window.innerHeight - 30)) {
        sco.scrollTop = sco.scrollTop + 5
      }
      if (wz.x > (window.innerWidth - window.innerWidth * 0.16)) {
        sco.scrollLeft = sco.scrollLeft + 5
      }
      if (wz.x < window.innerWidth * 0.07) {
        sco.scrollLeft = sco.scrollLeft - 5
      }
      if (this.type === 'eye') {
        return false
      }
      if (this.moveCount % 2 && !this.doDrawing) {
        // 减少绘制频率
        return
      }
      this.moveCount++

      this.mouseTo.x = xy.x
      this.mouseTo.y = xy.y
      this.drawing()
    },
    mouseup(e) {
      const that = this
      // this.$refs.canvas.discardActiveObject()
      // that.imageObj = {}
      var xy = {}
      if (e.e.offsetX === undefined) {
        xy = this.transformMouse(e.pointer.x, e.pointer.y)
      } else {
        xy = this.transformMouse(e.e.offsetX, e.e.offsetY)
      }
      if (this.type === 'equilateral' || (e.e.which === 3 && !this.auditControl)) {
        // 点击后直接弹框
        if (this.equilateralState) {
          this.commentsState = false
          this.circleXY = xy
          /*          // that.$refs.canvas.setGlobalAlpha(0.2)
              that.$refs.canvas.createCircle({
                left: xy.x - that.radius,
                top: xy.y - that.radius,
                color: that.color,
                radius: that.radius,
                fillColor: that.color, // 填充的颜色
                strokeWidth: this.drawWidth,
                lockScalingX: true,
                lockScalingY: true,
                opacity: 0.3,
                id: tagParagraph
              })
              this.$refs.canvas.discardActive()
              this.rest()
              this.restComment()
              this.tagParagraph = tagParagraph
              this.equilateralState = true*/
          this.rest()
          this.restComment()
          this.tagParagraph = undefined
          this.$nextTick(() => {
            this.commentsState = true
            if (this.$refs.tan) {
              this.$refs.tan.setStatess()
            }
          })
          this.$nextTick(() => {
            const right = window.innerWidth - (e.e.pageX ? e.e.pageX : e.e.changedTouches[0].clientX) - 250
            this.settingDialog(right, (e.e.pageY ? e.e.pageY : e.e.changedTouches[0].clientY) + 10)
            this.kongzhi = true
          })
        } else {
          this.equilateralState = true
        }

        /*          if (that.commentsObj) {
                          that.$refs.canvas.remove(that.commentsObj)
                        }
                        that.commentsObj = new fabric.Line([xy.x, xy.y, that.width, that.height / 2], {
                          strokeDashArray: [6, 3],
                          stroke: that.color,
                          strokeWidth: that.drawWidth,
                          types: 'relation'
                        })
                        that.$refs.canvas.add(that.commentsObj)
                        that.$refs.canvas.toLastLayer(that.commentsObj)*/
      } else if (this.type === 'enlarge' || this.type === 'narrow' || this.type === 'move') {
        this.zoomDrag = false
      } else if (this.type === 'text') {
        let originalFontSize = 26
        if (parseFloat(that.originalScale) <= 0.4) {
          originalFontSize = originalFontSize / 0.3
        }
        // const width3 = left > this.mouseTo.x ? (-(left - this.mouseTo.x)) : (this.mouseTo.x - left)
        const textbox = new fabric.Textbox('', {
          left: xy.x,
          top: xy.y - originalFontSize / 2,
          width: 200,
          fontSize: originalFontSize,
          borderColor: this.color,
          fill: this.color,
          hasControls: false
        })
        this.$refs.canvas.add(textbox)
        textbox.enterEditing()
        console.log(textbox.hiddenTextarea)
        textbox.hiddenTextarea.focus()
        textbox.hiddenTextarea.addEventListener('change', function(event) {
          that.updateJson()
          textbox.exitEditing()
        })
        this.mouseFrom = {}
      } else {
        this.mouseTo.x = xy.x
        this.mouseTo.y = xy.y
        if (this.type === 'eye') {
          const sco = document.querySelector('.canvasDiv')
          const num = this.getDirection(this.mouseFrom.x, this.mouseFrom.y, xy.x, xy.y)
          if (num === 1) {
            sco.scrollTop = sco.scrollTop + 50
          } else if (num === 2 && sco.scrollTop > 0) {
            sco.scrollTop = sco.scrollTop - 50
          } else if (num === 3) {
            sco.scrollLeft = sco.scrollLeft + 50
          } else if (num === 4 && sco.scrollLeft > 0) {
            sco.scrollLeft = sco.scrollLeft - 50
          }
          return false
        }
        this.drawingObject = null
        this.moveCount = 1
        this.doDrawing = false
      }
      const types = ['line', 'ellipse', 'rectangle', 'arrow', 'pen']
      if (types.findIndex(function(value) {
        return value === that.type
      }) !== -1 && e.e.which !== 3) {
        this.updateJson()
      }
      this.markTop()
    },
    markTop() { // 标记置顶
      const that = this
      const objs = this.$refs.canvas.getObjects()
      objs.forEach(function(a) {
        if (a.type === 'circle') {
          that.$refs.canvas.toTopLayer(a)
        }
      })
    },
    getDirection(startx, starty, endx, endy) { // 根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
      var angx = endx - startx
      var angy = endy - starty
      var result = 0

      // 如果滑动距离太短
      if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
        return result
      }

      var angle = this.getAngle(angx, angy)
      if (angle >= -135 && angle <= -45) {
        result = 1
      } else if (angle > 45 && angle < 135) {
        result = 2
      } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3
      } else if (angle >= -45 && angle <= 45) {
        result = 4
      }

      return result
    },
    settingDialog(right, top) {
      const cc = document.querySelector('.el-dialog1')
      if (right < window.innerWidth * 0.16) {
        cc.style.right = window.innerWidth * 0.16 + 'px'
      } else {
        cc.style.right = right + 'px'
      }
      cc.style.top = top + 'px'
    },
    getAngle(angx, angy) {
      return Math.atan2(angy, angx) * 180 / Math.PI
    },
    mousedown(e) {
      var xy = {}
      if (e.e.offsetX === undefined) {
        xy = this.transformMouse(e.pointer.x, e.pointer.y)
        this.mouseFromOriginal.x = e.pointer.x
        this.mouseFromOriginal.y = e.pointer.y
      } else {
        xy = this.transformMouse(e.e.offsetX, e.e.offsetY)
        this.mouseFromOriginal.x = e.e.offsetX
        this.mouseFromOriginal.y = e.e.offsetY
      }
      this.mouseFrom.x = xy.x
      this.mouseFrom.y = xy.y
      this.doDrawing = true
      if (this.type === 'enlarge' || this.type === 'narrow' || this.type === 'move') {
        this.zoomDrag = true
      }
    },
    transformMouse(mouseX, mouseY) {
      // const viewportTransform = this.$refs.canvas.getViewportTransform()
      // this.$refs.canvas.relativePan(new fabric.Point(0, 0))
      return { x: mouseX / window.zoom, y: mouseY / window.zoom }
    },
    drawing() {
      const that = this
      if (this.drawingObject) {
        this.$refs.canvas.remove(this.drawingObject)
      }
      var left = this.mouseFrom.x
      var top = this.mouseFrom.y
      var canvasObject = null
      var mouseFrom = this.mouseFrom
      var mouseTo = this.mouseTo
      var x1 = mouseFrom.x
      var x2 = mouseTo.x
      var y1 = mouseFrom.y
      var y2 = mouseTo.y
      switch (this.type) {
        case 'arrow': // 箭头
          var w = x2 - x1
          var h = y2 - y1
          var sh = Math.cos(Math.PI / 4) * 16
          var sin = h / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
          var cos = w / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
          var w1 = (16 * sin) / 4
          var h1 = (16 * cos) / 4
          var centerx = sh * cos
          var centery = sh * sin
          /**
             * centerx,centery 表示起始点，终点连线与箭头尖端等边三角形交点相对x，y
             * w1 ，h1用于确定四个点
             */

          var path = ' M ' + x1 + ' ' + y1
          path += ' L ' + (x2 - centerx + w1) + ' ' + (y2 - centery - h1)
          path +=
              ' L ' + (x2 - centerx + w1 * 2) + ' ' + (y2 - centery - h1 * 2)
          path += ' L ' + x2 + ' ' + y2
          path +=
              ' L ' + (x2 - centerx - w1 * 2) + ' ' + (y2 - centery + h1 * 2)
          path += ' L ' + (x2 - centerx - w1) + ' ' + (y2 - centery + h1)
          path += ' Z'
          canvasObject = new fabric.Path(path, {
            stroke: this.color,
            fill: this.color,
            strokeWidth: this.drawWidth
          })
          break
        case 'line':
          canvasObject = new fabric.Line([x1, y1, x2, y2], {
            fill: this.color,
            stroke: this.color,
            strokeWidth: this.drawWidth * 2
          })
          // this.$refs.$refs.canvas.createLine({ x: x1, y: y1, x1: x2, y1: y2, fillColor: this.color, strokeColor: this.color })
          break
        case 'dottedline':
          canvasObject = new fabric.Line([x1, y1, x2, y2], {
            strokeDashArray: [6, 3],
            stroke: this.color,
            strokeWidth: this.drawWidth
          })
          break
        case 'circle': // 正圆
          var radius = Math.sqrt((this.mouseTo.x - this.mouseFrom.x) * (this.mouseTo.x - this.mouseFrom.x) + (this.mouseTo.y - this.mouseFrom.y) * (this.mouseTo.y - this.mouseFrom.y)) / 2
          canvasObject = new fabric.Circle({
            left: left,
            top: top,
            stroke: this.color,
            fill: 'rgba(255, 255, 255, 0)',
            radius: radius,
            strokeWidth: this.drawWidth
          })
          break
        case 'ellipse': // 椭圆
          // Math.sqrt((mouseTo.x - this.mouseFrom.x) * (mouseTo.x - this.mouseFrom.x) + (mouseTo.y - this.mouseFrom.y) * (mouseTo.y - this.mouseFrom.y)) / 2
          canvasObject = new fabric.Ellipse({
            left: this.mouseTo.x,
            top: this.mouseTo.y,
            stroke: this.color,
            fill: 'rgba(255, 255, 255, 0)',
            originX: 'center',
            originY: 'center',
            rx: Math.abs(this.mouseFrom.x - this.mouseTo.x),
            ry: Math.abs(this.mouseFrom.y - this.mouseTo.y),
            strokeWidth: this.drawWidth
          })
          break
        case 'rectangle':
          var path =
              'M ' +
              mouseFrom.x +
              ' ' +
              mouseFrom.y +
              ' L ' +
              mouseTo.x +
              ' ' +
              mouseFrom.y +
              ' L ' +
              mouseTo.x +
              ' ' +
              mouseTo.y +
              ' L ' +
              mouseFrom.x +
              ' ' +
              mouseTo.y +
              ' L ' +
              mouseFrom.x +
              ' ' +
              mouseFrom.y +
              ' z'
          const width = left > this.mouseTo.x ? (-(left - this.mouseTo.x)) : (this.mouseTo.x - left)
          const height = top > this.mouseTo.y ? (-(top - this.mouseTo.y)) : (this.mouseTo.y - top)
          canvasObject = new fabric.Rect({
            left: left, top: top, stroke: this.color, width: width, height: height, strokeWidth: this.drawWidth * 2,
            fill: 'rgba(255, 255, 255, 0)' // 填充的颜色
          })
          break
        case 'rightangle':
          path = 'M ' + mouseFrom.x + ' ' + mouseFrom.y + ' L ' + mouseFrom.x + ' ' + mouseTo.y + ' L ' + mouseTo.x + ' ' + mouseTo.y + ' z'
          // path = 'M 318 605 L 318 520 L 484 520 z'
          canvasObject = new fabric.Path(path, {
            stroke: this.color,
            strokeWidth: this.drawWidth * 2,
            fill: 'rgba(255, 255, 255, 0)'
          })
          break
        case 'remove':
          break
        default:
          break
      }
      if (canvasObject) {
        this.$refs.canvas.add(canvasObject) // .setActiveObject(canvasObject)
        this.drawingObject = canvasObject
      }
      // this.rest()
    },
    rest() {
      this.mouseFrom = {}
      this.mouseTo = {}
    },
    drawTypeChange(e) {
      this.isDrawingMode = false
      if (e === 'pen') {
        this.isDrawingMode = !this.isDrawingMode
      }
      this.$refs.canvas.freeDrawConfig({ isDrawingMode: this.isDrawingMode, color: this.color })
      this.type = e
    },
    createCircle(options, obj) {
      /*      if (this.circular === 0) {
                              const radius = 10
                              this.$refs.canvas.createCircle({
                                left: options.pointer.x - radius,
                                top: options.pointer.y - radius,
                                fillColor: 'red',
                                radius: radius,
                                id: 123
                              })
                              this.$refs.canvas.drawDottedline({
                                x: options.pointer.x,
                                y: options.pointer.y,
                                x1: options.pointer.x,
                                y1: 0,
                                fillColor: 'red'
                              })
                            } else {
                              this.circular = 0
                            }*/
      /*      this.type = ''
                        this.isDrawingMode = false
                        this.$refs.canvas.freeDrawConfig({ isDrawingMode: this.isDrawingMode })*/
    },
    drawDottedline() {
      this.$refs.canvas.drawDottedline({ x: 1, y: 100, x1: 100, y1: 1, fillColor: 'red' })
    },
    changeDrawMore() {
      this.isDrawingMode = !this.isDrawingMode
      this.$refs.canvas.freeDrawConfig({ isDrawingMode: this.isDrawingMode })
    },
    setErase() {
      this.$refs.canvas.eraseDrawConfig({ color: 'rgba(255, 255, 255, 0)', drawWidth: 20 })
    },
    toggleMirror() {
      this.$refs.canvas.toggleMirror({ flip: 'Y' })
    },
    discardActive() {
      this.$refs.canvas.discardActive()
    },
    handleAdd(url) {
      this.$refs.canvas.createImage(url)
    },
    handleDelete() {
      this.$refs.canvas.removeCurrentObj()
    },
    rotate() {
      this.$refs.canvas.setRotate()
    },
    createImg() {
      const dataUrl = this.$refs.canvas.toDataUrl()
      this.imgUrl = dataUrl
    },
    getAudit(id) {
      // 根据tagParagraph获取对应的批注详情
      getAuditById(id).then(res => {
        if (res.success && res.data) {
          res.data.tagComment = this.unescape(res.data.tagComment)
          res.data.repeatComment = this.unescape(res.data.repeatComment)
          res.data.head = true
          this.commentObj = res.data
          this.commentsState = true
        }
      })
    },
    selected(e) {
      const json = this.$refs.canvas.toJson()
      const that = this
      // 查看模式，如果选择的不是标记，取消选择
      // eye,pen,arrow,line,dottedline,circle,ellipse,rectangle,equilateral,text,narrow,enlarge,ratate,move
      const types = ['eye', 'pen', 'arrow', 'line', 'dottedline', 'circle', 'ellipse', 'text', 'rectangle', 'equilateral', 'narrow', 'enlarge', 'ratate', 'move']
      if (types.findIndex(function(value) {
        return value === that.type
      }) !== -1) {
        this.$refs.canvas.discardActive()
      }
      if (this.type === 'eye') {
        // 查看模式不允许任何操作
        this.$refs.canvas.discardActive()
      }
      // 如果点击的是图片，怎直接取消选择
      if (e.target.type === 'image') {
        this.imageObj = e.target
        this.imageObj = Object.assign({}, e.target)
        return false
      }
      // 若是删除，则判断为多选删除还是单选删除
      if (this.type === 'remove') {
        // 单选删除
        this.removeState = true
        const cc = document.querySelector('.el-dialog')
        const right = window.innerWidth - (e.e.pageX ? e.e.pageX : e.e.touches[0].clientX) - 250
        cc.style.right = (right < window.innerWidth * 0.16 ? window.innerWidth * 0.16 : right) + 'px'
        const topp = (e.e.pageY ? e.e.pageY : e.e.touches[0].clientY) + 10
        cc.style.top = ((window.innerHeight - topp) < 110 ? window.innerHeight - 110 : topp) + 'px'
        this.removeObject = e
        return false
      }
      // 如果点击了标记点
      if (e.target.type === 'circle') {
        // 如果在标记的地方再次点击标记，则新的标记不被允许添加
        if (this.type === 'equilateral') {
          that.equilateralState = false
          // 弹出框，根据标记点的判断是否有id，若有则根据id获取批注信息，进行展示
        }
        // 判断是不是删除，若为删除，并且有id的存在，则弹出提示框，进行确认
        if (this.type === 'remove') {
          return false
        }
        if (e.target.id) {
          // 根据id查找批注，然后渲染
          // 获取id，若id存在，则根据id获取具体的批注内容，若不存在则不管
          if (e.target.id.indexOf('-') === -1) {
            this.getAudit(e.target.id)
            this.tagParagraph = e.target.id
          } else {
            this.tagParagraph = e.target.id
            this.$nextTick(() => {
              this.commentsState = true
            })
          }
        }
        this.$nextTick(() => {
          const right = window.innerWidth - (e.e.pageX ? e.e.pageX : e.e.touches[0].clientX) - 250
          this.rest()
          this.settingDialog(right, (e.e.pageY ? e.e.pageY : e.e.touches[0].clientY) + 10)
          this.kongzhi = true
        })
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tools {
    list-style: none;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    z-index: 100000;
    border-bottom: 1px solid #b9b4b7;
    border-left: 1px solid #b9b4b7;
    border-right: 1px solid #b9b4b7;
  }

  .tools li {
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    box-sizing: border-box;
    font-size: 28px;
    border-top: #b9b4b7 solid 1px;
    background: #fefefe;
    cursor: pointer;
    position: relative;
  }
  .tools li:hover {
    background: #f2f1f2;
  }

  .tools li.active {
    background: #e34f51;
  }

  .hide {
    display: none;
  }

  .icon-tools {
    display: inline-block;
    width: 28px;
    height: 28px;
    background-image: url("../../../assets/icons/draw/tools-28.png");
    background-repeat: no-repeat;
    vertical-align: middle;
  }

  .icon-color-black {
    background-position: -0px -0px;
  }

  .icon-color-select {
    background-position: -28px -0px;
  }

  .icon-color-black {
    background-position: -56px -0px;
  }

  .icon-color-blue {
    background-position: -84px -0px;
  }

  .icon-color-select {
    background-position: -112px -0px;
  }

  .icon-eye-black {
    background-position: -140px -0px;
  }

  .icon-eye-select {
    background-position: -168px -0px;
  }

  .icon-noeye-black {
    background-position: -196px -0px;
  }

  .icon-noeye-select {
    background-position: -0px -28px;
  }

  .icon-grids-black {
    background-position: -28px -28px;
  }

  .icon-grids-select {
    background-position: -56px -28px;
  }

  .icon-nogrids-black {
    background-position: -84px -28px;
  }

  .icon-nogrids-select {
    background-position: -112px -28px;
  }

  .icon-pen-black {
    background-position: -140px -28px;
  }

  .icon-pen-select {
    background-position: -168px -28px;
  }

  .icon-move-black {
    background-position: -196px -28px;
  }

  .icon-move-select {
    background-position: -0px -56px;
  }
  .icon-rotatewhite-select {
    background-image: url("../../../assets/icons/draw/rotateblack.png");
  }

  .icon-rotatewhite-black {
    background-image: url("../../../assets/icons/draw/rotatewhite.png");
  }
  .icon-enlargewhite-select {
    background-image: url("../../../assets/icons/draw/enlargeblack.png");
  }

  .icon-enlargewhite-black {
    background-image: url("../../../assets/icons/draw/enlargewhite.png");
  }

  .icon-narrowwhite-select {
    background-image: url("../../../assets/icons/draw/narrowblack.png");
  }

  .icon-narrowwhite-black {
    background-image: url("../../../assets/icons/draw/narrowwhite.png");
  }

  .icon-text-black {
    background-position: -28px -56px;
  }

  .icon-text-select {
    background-position: -56px -56px;
  }

  .icon-dottedline-arrow-black {
    background-position: -84px -56px;
  }

  .icon-dottedline-arrow-select {
    background-position: -112px -56px;
  }

  .icon-line-black {
    background-position: -140px -56px;
  }

  .icon-line-select {
    background-position: -168px -56px;
  }

  .icon-dottedline-black {
    background-position: -196px -56px;
  }

  .icon-dottedline-select {
    background-position: -0px -84px;
  }

  .icon-arrow-black {
    background-position: -28px -84px;
  }

  .icon-arrow-select {
    background-position: -56px -84px;
  }

  .icon-circle-black {
    background-position: -84px -84px;
  }

  .icon-circle-select {
    background-position: -112px -84px;
  }

  .icon-ellipse-black {
    background-position: -140px -84px;
  }

  .icon-ellipse-select {
    background-position: -168px -84px;
  }

  /*  .icon-square-black {
            background-position: -196px -84px;
          }

          .icon-square-select {
            background-position: -0px -112px;
          }*/

  .icon-rectangle-black {
    background-position: -28px -112px;
  }

  .icon-rectangle-select {
    background-position: -56px -112px;
  }

  .icon-rightangle-black {
    background-position: -84px -112px;
  }

  .icon-rightangle-select {
    background-position: -112px -112px;
  }

  .icon-equilateral-black {
    //background-position: -140px -112px;
    background-image: url("../../../assets/icons/draw/signwhite.png");
  }

  .icon-equilateral-select {
    //background-position: -168px -112px;
    background-image: url("../../../assets/icons/draw/signblack.png");
  }

  /*
          .icon-isosceles-black {
            background-position: -196px -112px;
          }

          .icon-isosceles-select {
            background-position: -0px -140px;
          }
        */

  /*
          .icon-isoscelesrighttriangle-black {
            background-position: -28px -140px;
          }

          .icon-isoscelesrighttriangle-select {
            background-position: -56px -140px;
          }
        */

  .icon-remove-black {
    background-position: -84px -140px;
  }

  .icon-remove-select {
    background-position: -112px -140px;
  }

  .icon-clear-black {
    background-position: -140px -140px;
  }

  .icon-clear-select {
    background-position: -168px -140px;
  }

  .video-preview-modal-div {
    width: 69%;
    margin: 5% auto 0;
    text-align: center;
    background-color: #ffffff;
  }

  /deep/ .m-colorPicker {
    z-index: 10000;
    width: 100% !important;
    height: 100% !important;

    .colorBtn {
      width: 100% !important;
      height: 100% !important;
    }
  }

  /deep/ .box {
    width: 216px !important;
  }

  /deep/ .el-dialog__body {
    padding: 0px 0px;
  }

  /deep/ .el-dialog__header {
    padding: 0px 0px;
  }

  .fenk {
    float: left;
  }

  /deep/ .m-colorPicker .box.open {
    z-index: 99999999;
    position: fixed;
  }

  .canvasDiv {
    overflow: auto;
    width: calc(100% - 300px - 100px);
    margin-top: 20px;
    margin-bottom: 10px;
    border: 1px solid #797979;
    display: -webkit-box;
    align-items: center;
    justify-content: center;
  }

  .leftClass {
    width: 90px;
    height: 100px;
  }

  .toolClass {
    float: left;
    width: 80px;
    /*width: 60px;*/
    z-index: 1;
    position: fixed;
    top: 20px;
    left: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .imgCl {
    position: fixed;
    background-color: #e7ecf5;
    top: 20px;
    width: 14%;
    right: 1%;
  }

  .backClass {
    background-color: #e5e4e5;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .rightClass {
    float: right;
    width: 290px;
    margin-top: 20px;
    margin-right: 10px;
    z-index: 1;
    background-color: #e7ecf5;
  }

  /deep/ .el-dialog {
    margin-top: 0px !important;
    margin-right: 0px !important;
    padding: 0px !important;
    left: auto;
  }

  /deep/ .el-dialog__wrapper {
    left: auto;
    width: 100%;
    overflow: hidden;
    z-index: 0 !important;
  }
  .el-dialog1{
    height: fit-content;
    width: fit-content;
  }

  /deep/ .el-image:hover {
    border: 1px solid #66b1ff;
  }
  /deep/ .el-image {
    height: calc(100% / 3 - 3px);
  }

  .imgclass {
    border: 1px solid #e6a23c;
  }

  .upDown {
    height: 38px;
    /*
      //background-color: #e6a23c;
    */
    line-height: 20px;
    text-align: center;
    align-content: center;
    position: fixed;
    z-index: 10000;
    right: 1%;
    width: 14%;
    border-radius: 2px;
  }

  .downUp {
    width: 10%;
    background-color: #e6a23c;
    line-height: 20px;
    text-align: center;
    align-content: center;
    position: fixed;
    z-index: 10000;
    bottom: 10px;
    right: 2%;
    border-radius: 2px;
  }
  .upDownRow {
    height: 38px;
  }
  .upDownCol {
    height: 100%;
    line-height: 38px;
  }
  /*.imgDiv {
    height: calc(100% - 52% + 38px);
    width: 100%;
    padding-top: 38px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 2%;
  }*/
  .comment {
    max-height: 700px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /*.commentsDiv {
    height: calc(48% - 38px);;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 38px;
  }*/
  .commentsDiv {
    height: calc(100% - 38px);
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  /deep/ .canvas-container{
    //display: inline-block !important;
    margin: 10px;
  }
</style>
