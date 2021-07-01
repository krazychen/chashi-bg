<template>
  <!--    <canvas id="QRCode" />
    <button @click="getQRCode()">点击生成二维码</button>

    <div class="qrcodeImg">
      <img id="qrcodeImg" :src="img" style="height: 148px;width: 148px;padding: 10px">
    </div>-->

  <!-- 删除提示框 -->
  <div style="height: 395px;width: 740px;">
    <div class="shou">
      <div v-if="succ==0" class="divfd yy">
        <div class="yiji dy">
          <i class="el-icon-share" />
        </div>
        <div class="yiji de">
          <div>
            {{ content }}
          </div>
          <div>
            通过QQ、微信、微博、QQ控件等分享给好友吧
          </div>
        </div>
      </div>
      <div v-if="succ==1" class="divfd yy">
        <div class="yiji dy">
          <i class="el-icon-circle-check" style="color: #409EFF" />
        </div>
        <div class="yiji de">
          <div style="color: #409EFF">
            {{ content }}
          </div>
          <div>
            通过QQ、微信、微博、QQ控件等分享给好友吧
          </div>
        </div>
      </div>
      <div v-if="succ==2" class="divfd yy">
        <div class="yiji dy">
          <i class="el-icon-circle-close" style="color: #F56C6C" />
        </div>
        <div class="yiji de">
          <div style="color: #F56C6C">
            {{ content }}
          </div>
          <div>
            通过QQ、微信、微博、QQ控件等分享给好友吧
          </div>
        </div>
      </div>
    </div>

    <div style="height: 20%;">
      <el-row :gutter="40">
        <el-col :span="4">
          <div class="grid-content bg-purple ys">
            链接：
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple-light">
            <el-input
              :value=" link"
              :disabled="true"
              size="large"
            />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button
              v-clipboard:copy="link"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="primary"
              size="medium"
            >复制链接</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div style="height: 50%;">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple ys">
            二维码：
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <test ref="child" :qr-logo="logo" :qr-url="link" @getImg="getImg" />
          </div>
        </el-col>
        <el-col :span="14">
          <div style="height: 148px;">
            <div style="height: 17%;" />
            <div class="grid-content bg-purple">
              <p>
                将二维码分享给好友，
              </p>
              <p>
                对方微信扫一扫即可访问分享内容
              </p>
            </div>
            <el-button type="primary" size="medium" @click="copyqrcode">复制二维码</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>

import $ from 'jquery'
import QRCode from 'qrcode' // 引入生成二维码插件
import test from './QRcodeGeneration' // 引入生成二维码插件
import { getImgUrl, getBaiduShortURL } from '@/api/homework/hwHomework'
import logo from '@/views/users/liyuer.png'

export default {

  components: {
    test
  },
  props: {
    succ: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // img: 'data:image/png;base64,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'
      img: '/ggg/123.png',
      QRCodeMsg: '12356', // 生成二维码信息
      link: '',
      logo: logo,
      imgUrl: '',
      content: '分享链接或二维码',
      qrUrl: ''
    }
  },
  created() {

  },
  methods: {
    share(url) {
      this.link = url
      this.getLink()
    },
    getImg(data, val) {
      getImgUrl(data).then(ress => {
        this.imgUrl = ress.data.imgUrl
        val(ress.data.imgUrl)
      })
    },
    getLink() {
      const data = { longUrl: this.link, termOfValidity: '1-year' }
      getBaiduShortURL(data).then(ress => {
        this.link = ress.data.shortUrl
        this.$refs.child.handleQrcodeToDataUrl()

        /* val(ress.data)*/
      })
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.succ = 1
      this.content = '分享链接已复制'
      // this.$message.success('链接已复制到剪切板！')
    },
    // 复制失败时的回调函数
    onError(e) {
      this.succ = 2
      this.content = '分享链接或二维码复制失败'
      // this.$message.error('抱歉，复制失败！')
    },
    SelectText(element) {
      var doc = document
      if (doc.body.createTextRange) {
        var range = document.body.createTextRange()

        range.moveToElementText(element)
        range.select()
      } else if (window.getSelection) {
        var selection = window.getSelection()
        var range = document.createRange()
        range.selectNodeContents(element)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    },
    // 点击按钮复制二维码，需要二维码是图片的格式，此处未实现，从网上在线获取转换成二维码图片的的地址

    copyqrcode() {
      $('.qrcode_box').attr('contenteditable', true)
      // console.log($(".qrcodeImg"));
      // '.canvasImg' 是类名    选id就是#
      // 获取DOM元素，需document.querySelector（".qrcodeImg"）获取这个dom节点，然后再获取qrcodeImg的值。
      this.SelectText($('.qrcode_box').get(0)) // 取第一位   this调用了实例上的东西
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
      $('.qrcode_box').removeAttr('contenteditable')
      // this.$message.success('二维码已复制到剪切板！')
      this.succ = 1
      this.content = '分享二维码已复制'
    }
  }
}

</script>

<style scodpe>
.ys{
  text-align: center;
  font-size: 16px;
}
.yy{
  font-size: 16px;
}
  .el-icon-circle-check{
    font-size: 60px;
  }
.el-icon-circle-close{
  font-size: 60px;
}
.el-icon-share{
  font-size: 60px;
}
  .divfd .yiji{
    float: left;
  }
  .yiji div{
    margin-top: 7px;
    margin-bottom: 7px;
  }
  .shou{
    height: 30%;
  }
  .divfd{
    height: 100%;
    width: 100%;
    padding-left: 12px;
    padding-top: 20px;

  }
  .dy{
    width: 60px;
    height: 60px;
  }
.el-dialog__body {
  padding: 0px 20px;
}
</style>
