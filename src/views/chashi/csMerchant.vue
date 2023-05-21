<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.merchantName" placeholder="商家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.merchantAccount" placeholder="商家账户" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="商店名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.merchantName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户" width="180 ">
        <template slot-scope="scope">
          {{ scope.row.merchantAccount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderFee"
        label="订单手续费%"
      />
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        align="center"
        prop="status"
        label="状态"
        :formatter="statusFormat"
      />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleView(scope.row)" />
          <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleUpdate(scope.row)" />
          <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
          <i v-if="scope.row.status==='1'" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商店名称" prop="merchantName">
          <el-input v-model="temp.merchantName" placeholder="请输入商店名称" />
        </el-form-item>
        <el-form-item label="账户" prop="merchantAccount">
          <el-input v-model="temp.merchantAccount" placeholder="账户" :disabled="viewCodeDisabled" />
        </el-form-item>
        <el-form-item label="密码" prop="merchantPassword">
          <el-input v-model="temp.merchantPassword" placeholder="密码" />
        </el-form-item>
        <el-form-item label="订单手续费" prop="orderFee">
          <el-input v-model="temp.orderFee" placeholder="订单手续费 0~100">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-select v-model="temp.cityCode" filterable placeholder="请选择所在城市" @change="changeCity">
            <el-option v-for="item in cityOptions" :key="item.value" clearable filterable :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" placeholder="地址" style="width: 71%; padding-right: 10px" :disabled="true" />
          <el-button type="primary" @click="selectAddress">选择地址</el-button>
        </el-form-item>
        <el-form-item label="经纬度" prop="longAlat">
          <el-input v-model="temp.longAlat" placeholder="经纬度" :disabled="true" />
        </el-form-item>

        <el-form-item label="营业时间">
          <!--          <el-time-picker-->
          <!--            is-range-->
          <!--            arrow-control-->
          <!--            v-model="temp.opsTime"-->
          <!--            range-separator="至"-->
          <!--            start-placeholder="开始时间"-->
          <!--            end-placeholder="结束时间"-->
          <!--            placeholder="选择时间范围"-->
          <!--            format = 'HH:mm'-->
          <!--            value-format="HH:mm"-->
          <!--            :picker-options="{-->
          <!--              selectableRange: '00:00 - 24:00',-->
          <!--              format: 'HH'-->
          <!--            }">-->
          <!--          </el-time-picker>-->
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

        <el-form-item label="非营业时间">
          <el-time-select
            v-model="temp.exStartTime"
            placeholder="未营业开始时间"
            style="width: 47%; padding-right: 5px"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: temp.startTime,
            }"
          />
          <el-time-select
            v-model="temp.exEndTime"
            placeholder="未营业结束时间"
            style="width: 47%"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: temp.exStartTime,
              maxTime: temp.endTime
            }"
          />
        </el-form-item>
        <el-form-item label="营业时间描述" prop="opDescription">
          <el-input v-model="temp.opDescription" placeholder="营业时间描述" />
        </el-form-item>
        <el-form-item label="商店小程序排序" prop="merchantOrder">
          <el-input v-model="temp.merchantOrder" placeholder="数字小的排在前面(1~100)">
          </el-input>
        </el-form-item>

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
          <el-dialog :visible.sync="logoDialogVisible">
            <img width="100%" :src="logoDialogImageUrl" alt="">
          </el-dialog>
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
          <el-dialog :visible.sync="bannerDialogVisible">
            <img width="100%" :src="bannerDialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

      </el-form>
      <div v-if="!chakan" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择地址" :visible.sync="dialogMapVisible">
      <iframe
        id="mapPage"
        width="100%"
        height="450px"
        frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=FMXBZ-TXULW-2SVRL-RY734-IDFSF-2QFWF&referer=chashi"
      />
      <br>
      <br>
      <el-row :gutter="20">
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
import { getMerchantList, createMerchantPic, updateMerchant, deleteMerchant, updateStatusById } from '@/api/chashi/csMerchant'
import { getReleaseCity } from '@/api/system/sysArea'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'CsMerchant',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      chakan: null,
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        merchantName: '',
        merchantAccount: ''
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
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
        opsTime: [],
        startTime: '',
        endTime: '',
        exStartTime: '',
        exEndTime: '',
        opDescription: '',
        merchantOrder:'',
        logoUploadFile: [],
        bannerUploadFile: []
      },
      logoFileLists: [],
      logoDelFileList: [],
      bannerFileLists: [],
      logoLocalFileList: [],
      bannerLocalFileList: [],
      bannerDelFileList: [],
      headers: { 'Content-Type': 'multipart/form-data' },
      dialogFormVisible: false,
      dialogStatus: '',
      viewCodeDisabled: false,
      dialogMapVisible: false,
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      rulesText: {
        merchantName: [{ required: true, message: '请输入商店名称', trigger: 'blur' }],
        merchantAccount: [{ required: true, message: '请输入账户', trigger: 'blur' }],
        merchantPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        orderFee: [{ required: true, message: '请输入订单手续费', trigger: 'blur' }]
      },
      logoDialogImageUrl: '',
      logoDialogVisible: false,
      bannerDialogImageUrl: '',
      bannerDialogVisible: false,
      cityOptions: [],
      tempCityName: ''
    }
  },
  beforeCreate() {
  },
  mounted() {
    window.addEventListener('message', this.handleMapEvent)
  },
  created() {
    this.statuss = getDictDataList('sys_status')
    getReleaseCity().then(response => {
      const optionss = []
      response.data.forEach(function(labelObj) {
        const option = { value: labelObj.areaCode, label: labelObj.areaName }
        optionss.push(option)
      })
      this.cityOptions = optionss
    })
    this.fetchData()
  },
  methods: {
    handleMapEvent(event) {
      const loc = event.data
      if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        console.log('location', loc)
        // this.temp.city = loc.cityname
        this.temp.address = loc.poiaddress
        const latlng = loc.latlng
        this.temp.longAlat = latlng['lng'] + ',' + latlng['lat']
      }
    },
    fetchData() {
      this.listLoading = true
      getMerchantList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
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
        carouselUrlVName: '',
        officeCode: '',
        opsTime: [],
        startTime: '',
        endTime: '',
        exStartTime: '',
        exEndTime: '',
        opDescription: '',
        merchantOrder:'',
        logoUploadFile: [],
        bannerUploadFile: []
      }
      this.logoFileLists = []
      this.logoDelFileList = []
      this.bannerFileLists = []
      this.logoLocalFileList = []
      this.bannerLocalFileList = []
      this.bannerDelFileList = []
      this.tempCityName = ''
    },
    handleCreate() {
      this.chakan = false
      this.viewCodeDisabled = false
      this.resetTemp()
      this.logoFileLists = []
      this.logoDelFileList = []
      this.bannerFileLists = []
      this.logoLocalFileList = []
      this.bannerDelFileList = []
      this.bannerLocalFileList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          this.logoFileLists.forEach(function(file) {
            formData.append('logoUploadFile', file, file.name)
          })
          this.bannerFileLists.forEach(function(file) {
            formData.append('bannerUploadFile', file, file.name)
          })
          formData.append('merchantName', this.temp.merchantName)
          formData.append('merchantAccount', this.temp.merchantAccount)
          formData.append('merchantPassword', this.temp.merchantPassword)
          formData.append('orderFee', this.temp.orderFee)
          formData.append('cityCode', this.temp.cityCode)
          formData.append('city', this.tempCityName)
          formData.append('address', this.temp.address)
          if (this.temp.longAlat) {
            const lnglat = this.temp.longAlat.split(',')
            formData.append('longitude', lnglat[0])
            formData.append('latitude', lnglat[1])
          }
          // formData.append('longAlat', this.temp.longAlat)
          formData.append('merchantInfo', '')
          formData.append('usageNotice', '')
          formData.append('startTime', this.temp.startTime)
          formData.append('endTime', this.temp.endTime)
          formData.append('exStartTime', this.temp.exStartTime)
          formData.append('exEndTime', this.temp.exEndTime)
          formData.append('opDescription', this.temp.opDescription)

          // if (this.temp.opsTime) {
          //   formData.append('startTime', this.temp.opsTime[0])
          //   formData.append('endTime', this.temp.opsTime[1])
          // }
          createMerchantPic(formData).then(() => {
            // this.list.unshift(this.temp)
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleView(row) { // 查看详情
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.viewCodeDisabled = true
      this.chakan = true
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
      if (this.temp.longitude) {
        this.temp.longAlat = this.temp.longitude + ',' + this.temp.latitude
      }
      // if (this.temp.startTime) {
      //   this.temp.opsTime = []
      //   this.temp.opsTime.push(this.temp.startTime)
      //   this.temp.opsTime.push(this.temp.endTime)
      // }
    },
    handleUpdate(row) {
      this.chakan = false
      this.viewCodeDisabled = true
      this.logoFileLists = []
      this.logoDelFileList = []
      this.bannerFileLists = []
      this.logoLocalFileList = []
      this.bannerDelFileList = []
      this.bannerLocalFileList = []
      this.temp = Object.assign({}, row) // copy obj
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
      if (this.temp.longitude) {
        this.temp.longAlat = this.temp.longitude + ',' + this.temp.latitude
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // if (this.temp.startTime) {
      //   this.temp.opsTime = []
      //   this.temp.opsTime.push(this.temp.startTime)
      //   this.temp.opsTime.push(this.temp.endTime)
      // }
    },
    updateData() {
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
          formData.append('cityCode', this.temp.cityCode)
          formData.append('city', this.tempCityName)
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
          formData.append('startTime', this.temp.startTime)
          formData.append('endTime', this.temp.endTime)
          formData.append('exStartTime', this.temp.exStartTime)
          formData.append('exEndTime', this.temp.exEndTime)
          formData.append('opDescription', this.temp.opDescription)
          // if (this.temp.opsTime) {
          //   formData.append('startTime', this.temp.opsTime[0])
          //   formData.append('endTime', this.temp.opsTime[1])
          // }

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
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.status === '1') {
        this.$message('已启用的商店无法删除！')
        return
      }
      deleteMerchant(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    rest() { // 重置
      this.listQuery.configName = ''
      this.listQuery.configKey = ''
      this.listQuery.isSys = ''
      this.fetchData()
    },

    handleLogoRemove(file, fileList) {
      // this.temp.uploadFile = []
      // for (let i = 0; i < fileList.length; i++) {
      //   this.temp.uploadFile.push(new File([fileList[i]], new Date().getTime() + '.jpg', {
      //     type: 'image/jpeg'
      //   }))
      // }
      this.logoFileLists = fileList
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
        let isExist = false
        this.logoFileLists.forEach(function(file) {
          if (file.uid === param.file.uid) {
            isExist = true
          }
        })
        if (isExist !== true) {
          this.logoFileLists.push(param.file)
        }
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        let isExist = false
        this.logoFileLists.forEach(function(file) {
          if (file.uid === param.file.uid) {
            isExist = true
          }
        })
        if (isExist !== true) {
          this.logoFileLists.push(param.file)
        }
        // this.logoFileLists.push(param.file)
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
      this.bannerFileLists = fileList
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
        let isExist = false
        this.bannerFileLists.forEach(function(file) {
          if (file.uid === param.file.uid) {
            isExist = true
          }
        })
        if (isExist !== true) {
          this.bannerFileLists.push(param.file)
        }
        // this.bannerFileLists.push(param.file)
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        let isExist = false
        this.bannerFileLists.forEach(function(file) {
          if (file.uid === param.file.uid) {
            isExist = true
          }
        })
        if (isExist !== true) {
          this.bannerFileLists.push(param.file)
        }
        // this.bannerFileLists.push(param.file)
      } else {
        this.$message.error('只能上传jpg/png文件')
        return
      }
    },

    updateStatus(row) {
      let vv = '0'
      let msg = '已启用'
      console.log(row)
      if (row.status === '0') {
        vv = '1'
      }
      if (row.status === '1') {
        vv = '2'
        msg = '已停用'
      }
      if (row.status === '2') {
        vv = '1'
      }
      this.statusQueryParam.status = vv
      this.statusQueryParam.id = row.id
      updateStatusById(this.statusQueryParam).then(() => {
        this.fetchData()
        // const mess = vv === '0' ? '已启用' : '已停用'
        this.$message(msg)
      })
    },

    statusFormat(row) {
      let vv = '-'
      const typ = this.statuss
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.status) {
          vv = aa.dictLabel
        }
      })
      return vv
    },

    selectAddress() {
      this.dialogMapVisible = true
    },

    configSelectAddress() {
      this.dialogMapVisible = false
    },

    changeCity(val) {
      let obj = {}
      obj = this.cityOptions.find((item) => {
        return item.value === val
      })
      this.tempCityName = obj.label
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
