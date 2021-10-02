<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
          <el-form-item label="订单手续费" prop="orderFee">
            <el-input v-model="temp.orderFee" placeholder="订单手续费 0~100" :disabled="true">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商店名称" prop="merchantName">
            <el-input v-model="temp.merchantName" placeholder="请输入商店名称" />
          </el-form-item>
          <el-form-item label="联系手机" prop="contactPhonse">
            <el-input v-model="temp.contactPhonse" placeholder="联系手机"/>
          </el-form-item>
          <el-form-item label="标签" prop="merchantPassword">
            <el-select v-model="labels" multiple placeholder="请选择">
              <el-option
                v-for="item in labelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在城市" prop="city">
            <el-input v-model="temp.city" placeholder="所在城市" :disabled="true" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="temp.address" placeholder="地址" style="width: 71%; padding-right: 10px" :disabled="true" />
            <el-button @click="selectAddress" type="primary">选择地址</el-button>
          </el-form-item>
          <el-form-item label="经纬度" prop="longAlat">
            <el-input v-model="temp.longAlat" placeholder="经纬度" :disabled="true" />
          </el-form-item>

          <el-form-item label="后台登录账户" prop="merchantAccount">
            <el-input v-model="temp.merchantAccount" placeholder="后台登录账户" :disabled="true" />
          </el-form-item>
          <el-form-item label="后台登录密码" prop="merchantPassword">
            <el-input v-model="temp.merchantPassword" placeholder="后台登录密码" />
          </el-form-item>
          <el-form-item label="订单退款手续费" prop="orderRefundFee">
            <el-input v-model="temp.orderRefundFee" placeholder="订单退款手续费 0~100" :disabled="true">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-time-select
              v-model="temp.startTime"
              placeholder="起始时间"
              style="width: 47%; padding-right: 5px"
              :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00'
            }"
            />
            <el-time-select
              v-model="temp.endTime"
              placeholder="结束时间"
              style="width: 47%"
              :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: temp.startTime
            }"
            />
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="updateData()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商店图片">
        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
          <el-form-item label="商店Logo" prop="logoPicValue">
            <el-upload
              accept="image/png,image/jpg,image/jpeg"
              action="auto"
              :http-request="uploadLogoSectionFile"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleLogoRemove"
              :on-exceed="handleLogoExceed"
              :file-list="logoLocalFileList"
              :headers="headers"
              :limit="1"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>

          <el-form-item label="商店轮播图" prop="bannerPicValue">
            <el-upload
              accept="image/png,image/jpg,image/jpeg"
              action="auto"
              :http-request="uploadBannerSectionFile"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleBannerRemove"
              :on-exceed="handleBannerExceed"
              :file-list="bannerLocalFileList"
              :headers="headers"
              :limit="3"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="updateData()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商户信息">
        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
          <el-form-item label="综合设施" prop="facilities">
            <el-select v-model="facilities" multiple placeholder="请选择">
              <el-option
                v-for="item in facilitieOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="服务项目" prop="services">
            <el-select v-model="services" multiple placeholder="请选择">
              <el-option
                v-for="item in facilitieOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商户简介" prop="merchantInfo">
            <div class="document-editor">
              <div ref="toolbar1" class="toolbar" />
              <div class="editable-container">
                <ckeditor id="editor1" v-model="temp.merchantInfo" :editor="editor1" :config="editorConfig" @ready="onReady1" />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="使用须知" prop="usageNotice">
            <div class="document-editor">
              <div ref="toolbar2" class="toolbar" />
              <div class="editable-container">
                <ckeditor id="editor2" v-model="temp.usageNotice" :editor="editor2" :config="editorConfig" @ready="onReady2" />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="updateData()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="智能锁设备">智能锁设备</el-tab-pane>
      <el-tab-pane label="智能取电设备">智能取电设备</el-tab-pane>
    </el-tabs>

    <el-dialog title="选择地址" :visible.sync="dialogMapVisible">
      <iframe
        id="mapPage"
        width="100%"
        height="450px"
        frameborder=0
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=FMXBZ-TXULW-2SVRL-RY734-IDFSF-2QFWF&referer=chashi">
      </iframe>
      <br/>
      <br/>
      <el-row :gutter="20" >
        <el-col :offset="19">
          <el-button type="primary" @click="configSelectAddress">
            确定选中地址
          </el-button>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
import { getMerchant, updateMerchant } from '@/api/chashi/csMerchant'
import { getLoginSysUserVo } from '@/utils/auth'
import { getCsLabelList } from '@/api/chashi/csLabel.js'
import { getFacilitiesList } from '@/api/chashi/csFacilities.js'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline'
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import ListPlugin from '@ckeditor/ckeditor5-list/src/list'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import { unescape } from '../../utils'

export default {
  name: 'MerchantSetting',
  directives: { waves },
  data() {
    return {
      editor1: DecoupledEditor,
      editor2: DecoupledEditor,
      editorConfig: {
        // The configuration of the editor.
        plugins: [
          EssentialsPlugin,
          HeadingPlugin,
          BoldPlugin,
          ItalicPlugin,
          UnderlinePlugin,
          LinkPlugin,
          ParagraphPlugin,
          ListPlugin
        ],
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'link',
            'undo',
            'redo'
          ]
        }
      },
      labelOptions: [],
      facilitieOptions: [],
      temp: {
        id: undefined,
        merchantName: '',
        merchantAccount: '',
        merchantPassword: '',
        orderFee: '',
        city: '',
        address: '',
        longitude: '',
        latitude: '',
        longAlat: '',
        logoUrlValue: '',
        logoUrlName: '',
        carouselUrlValue: '',
        carouselUrlName: '',
        officeCode: '',
        contactPhonse: '',
        labelId: '',
        labelName: '',
        facilitiesId: '',
        facilitiesName: '',
        servicesId: '',
        servicesName: '',
        orderRefundFee: '',
        merchantInfo: '',
        usageNotice: '',
        logoUploadFile: [],
        bannerUploadFile: [],
        startTime: '',
        endTime: '',
      },
      labels: [],
      facilities: [],
      services: [],
      logoFileLists: [],
      logoDelFileList: [],
      bannerFileLists: [],
      logoLocalFileList: [],
      bannerLocalFileList: [],
      bannerDelFileList: [],
      dialogMapVisible: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      rulesText: {
        merchantName: [{ required: true, message: '请输入商店名称', trigger: 'blur' }],
        merchantAccount: [{ required: true, message: '请输入账户', trigger: 'blur' }],
        merchantPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        orderFee: [{ required: true, message: '请输入订单手续费', trigger: 'blur' }],
        contactPhonse: [{ required: true, message: '请输入联系手机', trigger: 'blur' }]
      }
    }
  },
  beforeCreate() {
  },
  mounted() {
    window.addEventListener('message', this.handleMapEvent)
  },
  created() {
    this.statuss = getDictDataList('sys_status')
    getCsLabelList({}).then(response => {
      const labelOptionss = []
      response.data.records.forEach(function(labelObj) {
        const labelOption = { value: labelObj.id, label: labelObj.titleName }
        labelOptionss.push(labelOption)
      })
      this.labelOptions = labelOptionss
    })
    getFacilitiesList({}).then(response => {
      console.log(response.data.records)
      const optionss = []
      response.data.records.forEach(function(labelObj) {
        const option = { value: labelObj.id, label: labelObj.titleName }
        optionss.push(option)
      })
      this.facilitieOptions = optionss
    })
    this.fetchData()
  },
  methods: {
    handleMapEvent(event) {
      const loc = event.data
      if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        console.log('location', loc)
        this.temp.city = loc.cityname
        this.temp.address = loc.poiaddress
        const latlng = loc.latlng
        this.temp.longAlat = latlng['lng'] + ',' + latlng['lat']
      }
    },
    fetchData() {
      const userInfo = getLoginSysUserVo()
      getMerchant(userInfo.officeCode).then(response => {
        this.temp = response.data

        if (this.temp.logoUrlValue) {
          const logoPicLists = this.temp.logoUrlValue.split(',')
          const logoNameLists = this.temp.logoUrlName.split(',')
          this.logoLocalFileList = []
          for (let i = 0; i < logoPicLists.length; i++) {
            const cop = {}
            cop['name'] = logoNameLists[i]
            cop['url'] = logoPicLists[i]
            this.logoLocalFileList.push(cop)
          }
        }
        if (this.temp.carouselUrlValue) {
          const bannerPicLists = this.temp.carouselUrlValue.split(',')
          const bannerNameLists = this.temp.carouselUrlName.split(',')
          this.bannerLocalFileList = []
          for (let i = 0; i < bannerPicLists.length; i++) {
            const cop = {}
            cop['name'] = bannerNameLists[i]
            cop['url'] = bannerPicLists[i]
            this.bannerLocalFileList.push(cop)
          }
        }
        if (this.temp.labelId) {
          const idArr = this.temp.labelId.split(',')
          const optionss = []
          idArr.forEach(function(obj, index) {
            optionss.push(obj)
          })
          this.labels = optionss
        }
        if (this.temp.facilitiesId) {
          const idArr = this.temp.facilitiesId.split(',')
          const optionss = []
          idArr.forEach(function(obj, index) {
            optionss.push(obj)
          })
          this.facilities = optionss
        }
        if (this.temp.servicesId) {
          const idArr = this.temp.servicesId.split(',')
          const optionss = []
          idArr.forEach(function(obj, index) {
            optionss.push(obj)
          })
          this.services = optionss
        }
        if (this.temp.merchantInfo) {
          this.temp.merchantInfo = unescape(this.temp.merchantInfo)
        }
        if (this.temp.usageNotice) {
          this.temp.usageNotice = unescape(this.temp.usageNotice)
        }
        if (this.temp.longitude) {
          this.temp.longAlat = this.temp.longitude + ',' + this.temp.latitude
        }
      })
    },
    updateData() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          const formData = new FormData()

          // 新增的文件
          if (this.logoFileLists) {
            this.logoFileLists.forEach(function(file) {
              if (!file.url) {
                formData.append('logoUploadFileAdd', file, file.name)
              }
            })
          }
          // 处理删除的文件
          if (this.logoDelFileList.length > 0) {
            const logoDelFiles = []
            this.logoDelFileList.forEach(function(fileName) {
              logoDelFiles.push(fileName.name)
            })
            formData.append('logoUploadFileDel', logoDelFiles)
          }

          // 新增的文件
          if (this.bannerFileLists) {
            this.bannerFileLists.forEach(function(file) {
              if (!file.url) {
                formData.append('bannerUploadFileAdd', file, file.name)
              }
            })
          }
          // 处理删除的文件
          if (this.bannerDelFileList.length > 0) {
            const bannerDelFiles = []
            this.bannerDelFileList.forEach(function(fileName) {
              bannerDelFiles.push(fileName.name)
            })
            formData.append('bannerUploadFileDel', bannerDelFiles)
          }

          formData.append('merchantName', this.temp.merchantName)
          formData.append('merchantAccount', this.temp.merchantAccount)
          formData.append('merchantPassword', this.temp.merchantPassword)
          formData.append('orderFee', this.temp.orderFee)
          formData.append('city', this.temp.city)
          formData.append('address', this.temp.address)
          if (this.temp.longAlat) {
            const lnglat = this.temp.longAlat.split(',')
            formData.append('longitude', lnglat[0])
            formData.append('latitude', lnglat[1])
          }
          // formData.append('longAlat', this.temp.longAlat)
          formData.append('logoUrlValue', this.temp.logoUrlValue)
          formData.append('logoUrlName', this.temp.logoUrlName)
          formData.append('carouselUrlValue', this.temp.carouselUrlValue)
          formData.append('carouselUrlName', this.temp.carouselUrlName)
          formData.append('id', this.temp.id)
          formData.append('officeCode', this.temp.officeCode)
          formData.append('contactPhonse', this.temp.contactPhonse)
          formData.append('orderRefundFee', this.temp.orderRefundFee)
          formData.append('startTime', this.temp.startTime)
          formData.append('endTime', this.temp.endTime)
          if (this.labels) {
            let tempLabelId = ''
            let tempLabelName = ''
            this.labels.forEach(function(label, index, arr) {
              const obj = that.labelOptions.find((item) => {
                return item.value === label
              })
              if (index === (arr.length - 1)) {
                tempLabelId += label
                tempLabelName += obj.label
              } else {
                tempLabelId += label + ','
                tempLabelName += obj.label + ','
              }
            })
            formData.append('labelId', tempLabelId)
            formData.append('labelName', tempLabelName)
          }
          if (this.facilities) {
            let tempFacilitieId = ''
            let tempFacilitieName = ''
            this.facilities.forEach(function(facilitie, index, arr) {
              const obj = that.facilitieOptions.find((item) => {
                return item.value === facilitie
              })
              if (index === (arr.length - 1)) {
                tempFacilitieId += facilitie
                tempFacilitieName += obj.label
              } else {
                tempFacilitieId += facilitie + ','
                tempFacilitieName += obj.label + ','
              }
            })
            formData.append('facilitiesId', tempFacilitieId)
            formData.append('facilitiesName', tempFacilitieName)
          }
          if (this.services) {
            let tempServicesId = ''
            let tempServicesName = ''
            this.services.forEach(function(service, index, arr) {
              const obj = that.facilitieOptions.find((item) => {
                return item.value === service
              })
              if (index === (arr.length - 1)) {
                tempServicesId += service
                tempServicesName += obj.label
              } else {
                tempServicesId += service + ','
                tempServicesName += obj.label + ','
              }
            })
            formData.append('servicesId', tempServicesId)
            formData.append('servicesName', tempServicesName)
          }
          if (this.temp.merchantInfo) {
            formData.append('merchantInfo', unescape(this.temp.merchantInfo))
          }
          if (this.temp.usageNotice) {
            formData.append('usageNotice', unescape(this.temp.usageNotice))
          }

          for (var pair of formData.entries()) {
            console.log(pair[0] + ' - ' + pair[1].toString())
          }
          updateMerchant(formData).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleLogoRemove(file, fileList) {
      // this.temp.uploadFile = []
      // for (let i = 0; i < fileList.length; i++) {
      //   this.temp.uploadFile.push(new File([fileList[i]], new Date().getTime() + '.jpg', {
      //     type: 'image/jpeg'
      //   }))
      // }
      if (fileList.length > 0) {
        this.logoFileLists = fileList
      }
      if (this.logoLocalFileList.length > 0) {
        const templogoLocalFileList = []
        const templogoDelFileList = this.logoDelFileList
        var tempLogoUrlName = this.temp.logoUrlName
        this.logoLocalFileList.forEach(function(logoFile) {
          if (logoFile.name !== file.name) {
            templogoLocalFileList.push(logoFile)
          } else {
            templogoDelFileList.push(logoFile)
            tempLogoUrlName = ''
          }
        })
        this.logoLocalFileList = templogoLocalFileList
        this.logoDelFileList = templogoDelFileList
        this.temp.logoUrlName = tempLogoUrlName
      }
    },
    handleLogoExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadLogoSectionFile(param) {
      const fileObj = param.file

      const isLt2M = fileObj.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return
      }
      if (fileObj.type === 'image/jpeg') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.jpg', {
        //   type: 'image/jpeg'
        // }))
        this.logoFileLists.push(param.file)
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        this.logoFileLists.push(param.file)
      } else {
        this.$message.error('只能上传jpg/png文件')
        return
      }
    },

    handleBannerRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // this.temp.uploadFile = []
      // for (let i = 0; i < fileList.length; i++) {
      //   this.temp.uploadFile.push(new File([fileList[i]], new Date().getTime() + '.jpg', {
      //     type: 'image/jpeg'
      //   }))
      // }
      if (fileList.length > 0) {
        this.bannerFileLists = fileList
      }
      if (this.bannerLocalFileList.length > 0) {
        const tempBannerLocalFileList = []
        const tempbannerDelFileList = this.bannerDelFileList
        const bannerUrlNameArr = this.temp.carouselUrlName.split(',')
        const bannerUrlValueArr = this.temp.carouselUrlValue.split(',')
        const tempBannerUrlNameArr = []
        const tempBannerUrlValueArr = []
        let remIndex = 0
        this.bannerLocalFileList.forEach(function(bannerFile) {
          if (bannerFile.name !== file.name) {
            tempBannerLocalFileList.push(bannerFile)
          } else {
            tempbannerDelFileList.push(bannerFile)
            bannerUrlNameArr.forEach(function(fileName) {
              if (fileName !== bannerFile.name) {
                tempBannerUrlNameArr.push(fileName)
                tempBannerUrlValueArr.push(bannerUrlValueArr[remIndex])
              }
              remIndex++
            })
            // console.log(tempBannerUrlName.indexOf(bannerFile.name))
            // if (tempBannerUrlName.indexOf(bannerFile.name) !== -1) {
            //   if (tempBannerUrlName.indexOf(bannerFile.name) - 1 > 0) {
            //     tempBannerUrlName = tempBannerUrlName.slice(0, tempBannerUrlName.indexOf(bannerFile.name) - 1)
            //   } else {
            //     tempBannerUrlName = tempBannerUrlName.slice(bannerFile.name.length + 1, tempBannerUrlName.length  )
            //   }
            // }
          }
        })
        this.bannerLocalFileList = tempBannerLocalFileList
        this.bannerDelFileList = tempbannerDelFileList
        this.temp.carouselUrlName = tempBannerUrlNameArr.toString()
        this.temp.carouselUrlValue = tempBannerUrlValueArr.toString()
        console.log(this.temp.carouselUrlName)
        console.log(this.temp.carouselUrlValue)
      }
    },
    handleBannerExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    uploadBannerSectionFile(param) {
      const fileObj = param.file

      const isLt2M = fileObj.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return
      }
      if (fileObj.type === 'image/jpeg') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.jpg', {
        //   type: 'image/jpeg'
        // }))
        this.bannerFileLists.push(param.file)
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        this.bannerFileLists.push(param.file)
      } else {
        this.$message.error('只能上传jpg/png文件')
        return
      }
    },
    onReady1(editor) {
      // Insert the toolbar before the editable are.
      const toolbarContainer = this.$refs.toolbar1
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)

      // const wordCountPlugin = editor.plugins.get('WordCount')
      // console.log(wordCountPlugin)

      // editor.model.document.on('change', () => {
      //   this.$emit('content-change', editor.getData())
      // })
    },
    onReady2(editor) {
      // Insert the toolbar before the editable are.
      const toolbarContainer = this.$refs.toolbar2
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)

      // const wordCountPlugin = editor.plugins.get('WordCount')
      // console.log(wordCountPlugin)

      // editor.model.document.on('change', () => {
      //   this.$emit('content-change', editor.getData())
      // })
    },

    selectAddress() {
      this.dialogMapVisible = true
    },

    configSelectAddress() {
      this.dialogMapVisible = false
    }
  }
}
</script>

<style>
  .el-upload--picture-card{
    width: 70px!important;
    height: 70px!important;
    line-height: 74px!important;
  }
  .el-upload--picture-card i{
    font-size: 24px!important;
  }

  .el-upload-list--picture-card li{
    width: 70px!important;
    height: 70px!important;
  }
  .el-upload-list__item{
    width: 70px!important;
    height: 70px!important;
  }
</style>

<style lang="scss" scoped>
  /deep/ #editor a {
    color: #1b3af2;
    text-decoration: none;
  }

  .document-editor {
    .toolbar {
      /* Make sure the toolbar container is always above the editable. */
      z-index: 1;

      /* Create the illusion of the toolbar floating over the editable. */
      // box-shadow: 0 0 5px hsla( 0,0%,0%,.2 );

      /* Use the CKEditor CSS variables to keep the UI consistent. */
      // border-bottom: 1px solid var(--ck-color-toolbar-border);
      border: 1px solid var(--ck-color-base-border);
      border-bottom: none;

      /* Adjust the look of the toolbar inside of the container. */
      .ck-toolbar {
        border: 0;
        border-radius: 0;
      }
    }

    /* Make the editable container look like the inside of a native word processor app. */
    .editable-container {
      // border: 1px solid var(--ck-color-base-border);
      // border-radius: var(--ck-border-radius);

      // /* Set vertical boundaries for the document editor. */
      // max-height: 600px;

      // /* This element is a flex container for easier rendering. */
      // display: flex;
      // flex-flow: column nowrap;

      // padding: calc( 2 * var(--ck-spacing-large) );
      padding: 0;
      background: var(--ck-color-base-foreground);

      /* Make it possible to scroll the "page" of the edited content. */
      overflow-y: scroll;

      .ck-editor__editable {
        /* Set the dimensions of the "page". */
        // width: 15.8cm;
        min-height: 3cm;

        /* Keep the "page" off the boundaries of the container. */
        // padding: 1cm 2cm 2cm;

        border: 1px hsl( 0,0%,82.7% ) solid;
        border-radius: var(--ck-border-radius);
        background: white;

        /* The "page" should cast a slight shadow (3D illusion). */
        box-shadow: 0 0 5px hsla( 0,0%,0%,.1 );

        /* Center the "page". */
        // margin: 0 auto;
      }
    }
  }
</style>
