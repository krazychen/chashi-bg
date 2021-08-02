<template>
  <div  id="meQrcode" :title="qrText">
    <div class="qrcode_box">
      <img
        v-show="xianshi"
        id="qrcode_canvas"
        ref="qrcode_canvas"
        class="qrcode_canvas"
        alt="二维码本图"
      >
      <img
        v-if="qrLogo"
        ref="qrcode_logo"
        class="qrcode_logo"
        :src="qrLogo"
        alt="公司logo"
      >
      <canvas
        ref="canvas"
        :width="qrSize"
        :height="qrSize"
        class="canvas"
      />
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcode'

export default {
  name: 'Test',
  props: {
    qrUrl: {
      type: String,
      default: ''
    },
    qrSize: {
      type: Number,
      default: 148
    },
    qrText: {
      default: undefined
    },
    qrLogo: {
      type: String,
      default: ''
    },
    qrLogoSize: {
      type: Number,
      default: 20
    },
    qrTextSize: {
      type: Number,
      default: 14
    }
  },
  data() {
    return {
      xianshi: false
    }
  },
  mounted() {

  },
  updated() {

  },
  methods: {
    /**
       64      * @argument qrUrl        二维码内容
       65      * @argument qrSize       二维码大小
       66      * @argument qrText       二维码中间显示文字
       67      * @argument qrTextSize   二维码中间显示文字大小(默认16px)
       68      * @argument qrLogo       二维码中间显示图片
       69      * @argument qrLogoSize   二维码中间显示图片大小(默认为80)
       70      */
    handleQrcodeToDataUrl() {
      this.xianshi = false
      const qrcode_canvas = this.$refs.qrcode_canvas
      const qrcode_logo = this.$refs.qrcode_logo
      const canvas = this.$refs.canvas
      const that = this

      /*
      that.qrUrl = vals.shortUrl*/
      QRCode.toDataURL(this.qrUrl, { errorCorrectionLevel: 'H' }, (err, url) => {
        qrcode_canvas.src = url
        // 画二维码里的logo// 在canvas里进行拼接
        const ctx = canvas.getContext('2d')

        setTimeout(() => {
          // 获取图片
          ctx.drawImage(qrcode_canvas, 0, 0, that.qrSize, that.qrSize)
          if (that.qrLogo) {
            // 设置logo大小
            // 设置获取的logo将其变为圆角以及添加白色背景
            ctx.fillStyle = '#fff'
            ctx.beginPath()
            const logoPosition = (that.qrSize - that.qrLogoSize) / 2 // logo相对于canvas居中定位
            const h = that.qrLogoSize + 10 // 圆角高 10为基数(logo四周白色背景为10/2)
            const w = that.qrLogoSize + 10 // 圆角宽
            const x = logoPosition - 5
            const y = logoPosition - 5
            const r = 5 // 圆角半径
            ctx.moveTo(x + r, y)
            ctx.arcTo(x + w, y, x + w, y + h, r)
            ctx.arcTo(x + w, y + h, x, y + h, r)
            ctx.arcTo(x, y + h, x, y, r)
            ctx.arcTo(x, y, x + w, y, r)
            ctx.closePath()
            ctx.fill()
            ctx.drawImage(
              qrcode_logo,
              logoPosition,
              logoPosition,
              that.qrLogoSize,
              that.qrLogoSize
            )
          }
          if (that.qrText) {
            // 设置字体
            const fpadd = 10 // 规定内间距
            ctx.font = 'bold ' + that.qrTextSize + 'px Arial'
            const tw = ctx.measureText(that.qrText).width // 文字真实宽度
            const ftop = that.qrSize - that.qrTextSize // 根据字体大小计算文字top
            const fleft = (that.qrSize - tw) / 2 // 根据字体大小计算文字left
            const tp = that.qrTextSize / 2 // 字体边距为字体大小的一半可以自己设置
            ctx.fillStyle = '#fff'
            ctx.fillRect(
              fleft - tp / 2,
              ftop - tp / 2,
              tw + tp,
              that.qrTextSize + tp
            )
            ctx.textBaseline = 'top' // 设置绘制文本时的文本基线。
            ctx.fillStyle = '#333'
            ctx.fillText(that.qrText, fleft, ftop)
          }
          canvas.style.display = 'none'
          const data = { base64Img: canvas.toDataURL() }

          that.$emit('getImg', data, val => {
            qrcode_canvas.src = val
            qrcode_canvas.style.display = 'inline-block'
          })
          this.xianshi = true
          /*            getImgUrl(data).then(ress => {
                    qrcode_canvas.src = ress.data.imgUrl
                    // qrcode_canvas.src = '/ggg/123.png'
                    qrcode_canvas.style.display = 'inline-block'
                  })*/
        }, 0)
      }
      )
    }
  }
}
</script>
<style scoped>
  .qrcode_box,
  #meQrcode {
    display: inline-block;
  }

  .qrcode_box img {
    display: none;
  }
</style>
