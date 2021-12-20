<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roomName" placeholder="茶室名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="exportList">导出</el-button>
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
      <el-table-column align="center" label="商户图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.merchant.logoUrlValue"  min-width="50" height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="roomName" label="茶室名称" width="180" />
      <el-table-column align="center" prop="hoursAmount" label="小时金额" width="180" />
      <el-table-column align="center" prop="recomNumUsers" label="建议使用人数" width="180" />
      <el-table-column align="center" prop="createTime" label="创建时间" width="180" />
      <el-table-column align="center" prop="status" label="状态" :formatter="statusFormat" />
      <el-table-column align="center" prop="releaseStatus" label="营业状态" :formatter="releaseStatusFormat" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i v-if="scope.row.releaseStatus==='1'" class="el-icon-remove-outline" title="开始休息" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="updateReleaseStatus(scope.row)" />
          <i v-else class="el-icon-circle-check" title="开始营业" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="updateReleaseStatus(scope.row)" />
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
        <el-form-item label="茶室名称" prop="roomName">
          <el-input v-model="temp.roomName" placeholder="请输入茶室名称" />
        </el-form-item>
        <el-form-item label="服务设施" prop="facilities">
          <el-select v-model="facilities" multiple placeholder="请选择">
            <el-option v-for="item in facilitieOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小时金额" prop="hoursAmount">
          <el-input v-model="temp.hoursAmount" placeholder="请输入小时金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="起订时间" prop="startTime">
          <el-select v-model="startTime" placeholder="请选择">
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间间隔" prop="timeRange">
          <el-select v-model="temp.timeRange" placeholder="请选择">
            <el-option v-for="item in rangeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建议使用人数" prop="recomNumUsers">
          <el-input v-model="temp.recomNumUsers" placeholder="请输入建议使用人数(格式:3~5)" />
        </el-form-item>

        <el-form-item label="茶室封面" prop="logoPicValue">
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

        <el-form-item label="轮播" prop="bannerPicValue">
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
        <el-form-item label="茶室门锁lockId" prop="sort">
          <el-input v-model="temp.rttlLockId" placeholder="请输入茶室门锁lockId" />
        </el-form-item>
        <el-form-item label="曼顿空开mac" prop="sort">
          <el-input v-model="temp.kkMac" placeholder="请输入曼顿空开mac" />
        </el-form-item>
        <el-form-item label="曼顿空开线路" prop="sort">
          <el-input v-model="temp.kkOcSwitch" placeholder="请输入曼顿空开线路" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="请输入排序号" />
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
  </div>
</template>

<script>
import { getRoomList, createRoomPic, updateRoom, deleteRoom, updateStatusById, updateReleaseStatusById, exportList } from '@/api/chashi/csRoom'
import { getMerchant } from '@/api/chashi/csMerchant'
import { getLoginSysUserVo } from '@/utils/auth'
import { getFacilitiesList } from '@/api/chashi/csFacilities.js'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'CsRoom',
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
        roomName: ''
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      facilitieOptions: [],
      timeOptions: [{ value: '1', label: '1小时' }, { value: '2', label: '2小时' },
        { value: '3', label: '3小时' }, { value: '4', label: '4小时' },
        { value: '5', label: '5小时' }, { value: '6', label: '6小时' },
        { value: '7', label: '7小时' }, { value: '8', label: '8小时' },
        { value: '9', label: '9小时' }, { value: '10', label: '10小时' }],
      rangeOptions: [{ value: '0.5', label: '0.5小时' }, { value: '1', label: '1小时' }],
      temp: {
        id: undefined,
        roomName: '',
        facilitiesId: '',
        facilitiesName: '',
        hoursAmount: '',
        startTime: '1',
        timeRange: '0.5',
        recomNumUsers: '',
        roomLogoUrl: '',
        roomLogoName: '',
        roomBannerUrl: '',
        roomBannerName: '',
        doorOpenMethod: '',
        rttlLockId: '',
        kkMac: '',
        kkOcSwitch: '',
        sort: '',
        merchantId: '',
        merchantObj: {}
      },
      facilities: [],
      startTime: '1',
      merchantId: '',
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
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      rulesText: {
        roomName: [{ required: true, message: '请输入商店名称', trigger: 'blur' }]
      },
      logoDialogImageUrl: '',
      logoDialogVisible: false,
      bannerDialogImageUrl: '',
      bannerDialogVisible: false
    }
  },
  beforeCreate() {
  },
  created() {
    this.statuss = getDictDataList('sys_status')
    getFacilitiesList({}).then(response => {
      console.log(response.data.records)
      const optionss = []
      response.data.records.forEach(function(labelObj) {
        const option = { value: labelObj.id, label: labelObj.titleName }
        optionss.push(option)
      })
      this.facilitieOptions = optionss
    })
    const userInfo = getLoginSysUserVo()
    getMerchant(userInfo.officeCode).then(response => {
      console.log(response.data)
      this.merchantId = response.data.id
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRoomList(this.listQuery).then(response => {
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
        roomName: '',
        facilitiesId: '',
        facilitiesName: '',
        hoursAmount: '',
        startTime: '1',
        timeRange: '0.5',
        recomNumUsers: '',
        roomLogoUrl: '',
        roomLogoName: '',
        roomBannerUrl: '',
        roomBannerName: '',
        doorOpenMethod: '',
        rttlLockId: '',
        kkMac: '',
        kkOcSwitch: '',
        sort: '',
        merchantId: '',
        merchantObj: {}
      }
      this.facilities = []
      this.startTime = '1'
      this.timeRange = '0.5'
      this.logoFileLists = []
      this.logoDelFileList = []
      this.bannerFileLists = []
      this.logoLocalFileList = []
      this.bannerLocalFileList = []
      this.bannerDelFileList = []
    },
    handleCreate() {
      this.chakan = false
      this.viewCodeDisabled = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          this.logoFileLists.forEach(function(file) {
            formData.append('logoUploadFile', file, file.name)
          })
          this.bannerFileLists.forEach(function(file) {
            formData.append('bannerUploadFile', file, file.name)
          })
          formData.append('roomName', this.temp.roomName)
          if (this.temp.facilitiesId) {
            const idArr = this.temp.facilitiesId.split(',')
            const optionss = []
            idArr.forEach(function(obj, index) {
              optionss.push(obj)
            })
            this.facilities = optionss
          }
          // formData.append('facilitiesId', this.facilities)
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
          formData.append('hoursAmount', this.temp.hoursAmount)
          formData.append('startTime', this.startTime)
          formData.append('timeRange', this.timeRange)
          formData.append('recomNumUsers', this.temp.recomNumUsers)
          formData.append('doorOpenMethod', 0)
          formData.append('rttlLockId', this.temp.rttlLockId)
          formData.append('kkMac', this.temp.kkMac)
          formData.append('kkOcSwitch', this.temp.kkOcSwitch)
          formData.append('sort', this.temp.sort)
          console.log(this.merchantId)
          formData.append('merchantId', this.merchantId)

          for (const pair of formData.entries()) {
            console.log(pair[0] + ' - ' + pair[1].toString())
          }

          createRoomPic(formData).then(() => {
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
      this.resetTemp()
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.viewCodeDisabled = true
      this.chakan = true
      if (this.temp.roomLogoUrl) {
        const logoPicLists = this.temp.roomLogoUrl.split(',')
        const logoNameLists = this.temp.roomLogoName.split(',')
        this.logoLocalFileList = []
        for (let i = 0; i < logoPicLists.length; i++) {
          const cop = {}
          cop['name'] = logoNameLists[i]
          cop['url'] = logoPicLists[i]
          this.logoLocalFileList.push(cop)
        }
      }
      if (this.temp.roomBannerUrl) {
        const bannerPicLists = this.temp.roomBannerUrl.split(',')
        const bannerNameLists = this.temp.roomBannerName.split(',')
        this.bannerLocalFileList = []
        for (let i = 0; i < bannerPicLists.length; i++) {
          const cop = {}
          cop['name'] = bannerNameLists[i]
          cop['url'] = bannerPicLists[i]
          this.bannerLocalFileList.push(cop)
        }
      }
      if (this.temp.facilitiesId) {
        const idArr = this.temp.facilitiesId.split(',')
        const optionss = []
        idArr.forEach(function(obj, index) {
          optionss.push(obj)
        })
        this.facilities = optionss
      }
      if (this.temp.startTime) {
        this.startTime = this.temp.startTime
      }
    },
    handleUpdate(row) {
      this.chakan = false
      this.viewCodeDisabled = true
      this.resetTemp()
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.roomLogoUrl) {
        const logoPicLists = this.temp.roomLogoUrl.split(',')
        const logoNameLists = this.temp.roomLogoName.split(',')
        this.logoLocalFileList = []
        for (let i = 0; i < logoPicLists.length; i++) {
          const cop = {}
          cop['name'] = logoNameLists[i]
          cop['url'] = logoPicLists[i]
          this.logoLocalFileList.push(cop)
        }
      }
      if (this.temp.roomBannerUrl) {
        const bannerPicLists = this.temp.roomBannerUrl.split(',')
        const bannerNameLists = this.temp.roomBannerName.split(',')
        this.bannerLocalFileList = []
        for (let i = 0; i < bannerPicLists.length; i++) {
          const cop = {}
          cop['name'] = bannerNameLists[i]
          cop['url'] = bannerPicLists[i]
          this.bannerLocalFileList.push(cop)
        }
      }
      if (this.temp.facilitiesId) {
        const idArr = this.temp.facilitiesId.split(',')
        const optionss = []
        idArr.forEach(function(obj, index) {
          optionss.push(obj)
        })
        this.facilities = optionss
      }
      if (this.temp.startTime) {
        this.startTime = this.temp.startTime
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
          console.log(this.bannerFileLists)
          if (this.bannerFileLists) {
            this.bannerFileLists.forEach(function(file) {
              if (!file.url) {
                formData.append('bannerUploadFileAdd', file, file.name)
              }
            })
          }
          // 处理删除的文件
          console.log(this.bannerDelFileList)
          if (this.bannerDelFileList.length > 0) {
            const bannerDelFiles = []
            this.bannerDelFileList.forEach(function(fileName) {
              bannerDelFiles.push(fileName.name)
            })
            formData.append('bannerUploadFileDel', bannerDelFiles)
          }

          formData.append('roomName', this.temp.roomName)
          // if (this.facilitiesId) {
          //   console.log(this.facilitiesId)
          //   const idArr = this.facilitiesId.split(',')
          //   const optionss = []
          //   idArr.forEach(function(obj, index) {
          //     optionss.push(obj)
          //   })
          //   this.facilities = optionss
          // }
          formData.append('facilitiesId', this.facilities)
          formData.append('hoursAmount', this.temp.hoursAmount)
          formData.append('startTime', this.startTime)
          formData.append('timeRange', this.timeRange)
          formData.append('recomNumUsers', this.temp.recomNumUsers)
          formData.append('doorOpenMethod', 0)
          formData.append('rttlLockId', this.temp.rttlLockId)
          formData.append('kkMac', this.temp.kkMac)
          formData.append('kkOcSwitch', this.temp.kkOcSwitch)
          formData.append('sort', this.temp.sort)
          formData.append('merchantId', this.merchantId)
          formData.append('id', this.temp.id)

          for (var pair of formData.entries()) {
            console.log(pair[0] + ' - ' + pair[1].toString())
          }
          updateRoom(formData).then(() => {
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
      deleteRoom(this.temp.id).then(() => {
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
        console.log(this.logoDelFileList)
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
          if (file.uid === param.file.uid){
            isExist = true
          }
        })
        if (isExist !== true) {
          this.logoFileLists.push(param.file)
        }
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
        const bannerUrlNameArr = this.temp.roomBannerUrl.split(',')
        const bannerUrlValueArr = this.temp.roomBannerName.split(',')
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
        this.temp.roomBannerName = tempBannerUrlNameArr.toString()
        this.temp.roomBannerUrl = tempBannerUrlValueArr.toString()
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
          if (file.uid === param.file.uid){
            isExist = true
          }
        })
        if (isExist !== true) {
          this.bannerFileLists.push(param.file)
        }
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        let isExist = false
        this.bannerFileLists.forEach(function(file) {
          if (file.uid === param.file.uid){
            isExist = true
          }
        })
        if (isExist !== true) {
          this.bannerFileLists.push(param.file)
        }
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

    updateReleaseStatus(row) {
      let vv = '0'
      let msg = '营业中'
      if (row.releaseStatus === '0') {
        vv = '1'
      }
      if (row.releaseStatus === '1') {
        vv = '0'
        msg = '休息中'
      }
      this.statusQueryParam.releaseStatus = vv
      this.statusQueryParam.id = row.id
      updateReleaseStatusById(this.statusQueryParam).then(() => {
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

    releaseStatusFormat(row) {
      if (row.releaseStatus === '0') {
        return '休息中'
      }
      if (row.releaseStatus === '1') {
        return '营业中'
      }
    },

    exportList() {
      exportList(this.listQuery)
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
