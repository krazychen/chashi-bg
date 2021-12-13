<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="会员卡">
        <div class="filter-container">
          <el-input v-model="listQuery.cardname" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

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
          <el-table-column type="index" :index="indexMethod" align="center" label="序号" />
          <el-table-column align="center" label="图片" width="180">
            <template slot-scope="scope">
              <img :src="scope.row.logoUrl" min-width="50" height="50">
            </template>
          </el-table-column>
          <el-table-column align="center" prop="cardname" label="名称" width="180" />
          <el-table-column align="center" prop="level" label="级别" width="100" />
          <el-table-column align="center" prop="price" label="购买金额" width="100" />
          <el-table-column align="center" prop="discountOff" label="折扣" width="100" />
          <el-table-column align="center" prop="discountPrice" label="优惠金额" width="100" />
          <el-table-column align="center" prop="discountTime" label="优惠时长" width="100" />
          <el-table-column align="center" prop="status" label="状态" :formatter="statusFormat" />
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-tickets" title="发放会员" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleRelease(scope.row)" />
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'view')" />
              <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'update')" />
              <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
              <i v-if="scope.row.status==='1'" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
              <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </el-tab-pane>

      <el-tab-pane label="会员用户">
        <div class="filter-container">
          <el-input v-model="orderListQuery.membercardName" placeholder="会员卡名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleOrderFilter" />
          <el-input v-model="orderListQuery.wxuserPhoneAname" placeholder="用户昵称/手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleOrderFilter" />

          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleOrderFilter">
            查询
          </el-button>
        </div>
        <el-table
          v-loading="orderListLoading"
          :data="orderList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column type="index" :index="indexMethod" align="center" label="序号" />
          <el-table-column align="center" prop="wxuserName" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="membercardName" label="会员卡名称" width="150" />
          <el-table-column align="center" prop="level" label="级别" width="100" />
          <el-table-column align="center" prop="startTime" label="有效开始时间" width="100" />
          <el-table-column align="center" prop="endTime" label="有效结束时间" width="100" />
          <el-table-column align="center" prop="" label="剩余优惠时间" width="100" />
          <el-table-column align="center" prop="discountOff" label="折扣" width="100" />
          <el-table-column align="center" prop="status" label="卡片状态" :formatter="cardStatus" />
          <el-table-column align="center" prop="orderDate" label="购买时间" />
        </el-table>

        <pagination v-show="total>0" :total="orderTotal" :page.sync="orderListQuery.current" :limit.sync="orderListQuery.size" @pagination="fetchOrderData" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="会员名称" prop="cardname">
          <el-input v-model="temp.cardname" placeholder="请输入会员名称" />
        </el-form-item>
        <el-form-item label="会员卡价格" prop="price">
          <el-input v-model="temp.price" placeholder="请输入会员卡价格" />
        </el-form-item>
        <el-form-item label="封面" prop="logoUrl">
          <el-upload
            accept="image/png,image/jpg,image/jpeg"
            action="auto"
            :http-request="uploadSectionFile"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :file-list="localFileList"
            :headers="headers"
            :limit="1"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="temp.level" placeholder="请选择">
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会员折扣" prop="discountOff">
          <el-input v-model="temp.discountOff" placeholder="请输入会员折扣：0-10折">
            <template slot="append">折</template>
          </el-input>
        </el-form-item>
        <el-form-item label="优惠金额" prop="discountPrice">
          <el-input v-model="temp.discountPrice" placeholder="请输入优惠金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="优惠时长" prop="discountTime">
          <el-input v-model="temp.discountTime" placeholder="请输入优惠时长">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="validPeriod">
          <el-input v-model="temp.validPeriod" placeholder="请输入有效期">
            <template slot="append">月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="使用须知" prop="usageNotice" style="width: 130%">
          <div class="document-editor">
            <div ref="toolbar1" class="toolbar" />
            <div class="editable-container">
              <ckeditor id="editor1" v-model="temp.usageNotice" :editor="editor1" :config="editorConfig" @ready="onReady1" />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="使用权益" prop="useRights" style="width: 130%">
          <div class="document-editor">
            <div ref="toolbar2" class="toolbar" />
            <div class="editable-container">
              <ckeditor id="editor2" v-model="temp.useRights" :editor="editor2" :config="editorConfig" @ready="onReady2" />
            </div>
          </div>
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

    <el-dialog title="发放会员卡" :visible.sync="dialogReleaseFormVisible">
      <div class="filter-container">
        <el-input v-model="userListQuery.nameAphone" placeholder="请输入用户昵称/手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleReleaseFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleReleaseFilter">
          查询
        </el-button>
      </div>
      <el-table v-loading="userListLoading" :data="userList" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="头像" width="180 ">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" min-width="50" height="50">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="昵称" />
        <el-table-column align="center" prop="phoneNumber" label="手机号" />
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleReleaseCoupon(scope.row)">发放会员卡</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="userTotal>0" :total="userTotal" :page.sync="userListQuery.current" :limit.sync="userListQuery.size" @pagination="fetchReleaseData" />
    </el-dialog>
  </div>
</template>

<script>
import { getMemberCardList, createMemberCard, updateMemberCard, deleteMemberCard, updateStatusById } from '@/api/chashi/csMemberCard'
import { getWxUserList } from '@/api/chashi/wxUser'
import { createMembercardOrder, getMembercardOrderList } from '@/api/chashi/csMemberCardOrder'
import Pagination from '@/components/Pagination'
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
  name: 'CsMemberCard',
  components: { Pagination },
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
      chakan: null,
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        sort: ''
      },
      userList: null,
      userListLoading: false,
      userTotal: 0,
      userListQuery: {
        current: 1,
        nameAphone: ''
      },
      orderList: null,
      orderListLoading: false,
      orderTotal: 0,
      orderListQuery: {
        current: 1,
        membercardName: '',
        wxuserPhoneAname: ''
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      temp: {
        id: undefined,
        cardname: '',
        price: '',
        logoUrl: '',
        logoName: '',
        level: 1,
        discountOff: '',
        discountPrice: '',
        discountTime: '',
        validPeriod: '',
        usageNotice: '',
        useRights: '',
        uploadFile: []
      },
      fileLists: [],
      delFileList: [],
      localFileList: [],
      headers: { 'Content-Type': 'multipart/form-data' },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      rulesText: {
        logoUrl: [{ required: true, message: '请上传logo', trigger: 'blur' }],
        cardname: [{ required: true, message: '请输入会员名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入会员卡价格', trigger: 'blur' }],
        level: [{ required: true, message: '请输入级别', trigger: 'blur' }],
        discountOff: [{ required: true, message: '请输入会员折扣', trigger: 'blur' }],
        discountPrice: [{ required: true, message: '请输入优惠金额', trigger: 'blur' }],
        discountTime: [{ required: true, message: '请输入优惠时长', trigger: 'blur' }],
        validPeriod: [{ required: true, message: '请输入有效期', trigger: 'blur' }]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      levelOptions: [{ value: '1', label: '1' }, { value: '2', label: '2' },
        { value: '3', label: '3' }, { value: '4', label: '4' },
        { value: '5', label: '5' }, { value: '6', label: '6' },
        { value: '7', label: '7' }, { value: '8', label: '8' },
        { value: '9', label: '9' }, { value: '10', label: '10' }],
      dialogReleaseFormVisible: false,
      releasedTemp: {
        releasedMembercard: '',
        membercardId: '',
        wxuserId: '',
        wxuserPhone: '',
        membercardName: '',
        openid: '',
        validPeriod: '',
        orderPrice: ''
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.statuss = getDictDataList('sys_status')
    this.fetchData()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    fetchData() {
      this.listLoading = true
      getMemberCardList(this.listQuery).then(response => {
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
        cardname: '',
        price: '',
        logoUrl: '',
        logoName: '',
        level: 1,
        discountOff: '',
        discountPrice: '',
        discountTime: '',
        validPeriod: '',
        usageNotice: '',
        useRights: '',
        uploadFile: []
      }
    },
    handleCreate() {
      this.chakan = false
      this.resetTemp()
      this.fileLists = []
      this.localFileList = []
      this.delFileList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      if (this.fileLists.length > 0) {
        this.rulesText.logoUrl = []
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          console.log(this.fileLists.length)
          this.fileLists.forEach(function(file) {
            formData.append('uploadFile', file, file.name)
          })
          formData.append('cardname', this.temp.cardname)
          formData.append('price', this.temp.price)
          formData.append('level', this.temp.level)
          formData.append('discountOff', this.temp.discountOff)
          formData.append('discountPrice', this.temp.discountPrice)
          formData.append('discountTime', this.temp.discountTime)
          formData.append('validPeriod', this.temp.validPeriod)
          formData.append('usageNotice', unescape(this.temp.usageNotice))
          formData.append('useRights', unescape(this.temp.useRights))

          createMemberCard(formData).then(() => {
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
    handleViewAUpdate(row, type) { // 查看/编辑详情
      if (type === 'update') {
        this.chakan = false
        this.dialogStatus = 'update'
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      } else {
        this.chakan = true
        this.dialogStatus = 'view'
      }
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.logoUrl) {
        this.localFileList = []
        const cop = {}
        cop['name'] = this.temp.logoName
        cop['url'] = this.temp.logoUrl
        this.localFileList.push(cop)
      }
      if (this.temp.useRights) {
        this.temp.useRights = unescape(this.temp.useRights)
      }
      if (this.temp.usageNotice) {
        this.temp.usageNotice = unescape(this.temp.usageNotice)
      }
    },
    updateData() {
      if (this.fileLists.length > 0) {
        this.rulesText.logoUrl = []
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)

          const formData = new FormData()

          // 新增的文件
          if (this.fileLists) {
            this.fileLists.forEach(function(file) {
              if (!file.url) {
                formData.append('uploadFileAdd', file, file.name)
              }
            })
          }
          // 处理删除的文件
          if (this.delFileList.length > 0) {
            const delFiles = []
            this.delFileList.forEach(function(fileName) {
              delFiles.push(fileName.name)
            })
            formData.append('uploadFileDel', delFiles)
          }

          formData.append('cardname', this.temp.cardname)
          formData.append('price', this.temp.price)
          formData.append('level', this.temp.level)
          formData.append('discountOff', this.temp.discountOff)
          formData.append('discountPrice', this.temp.discountPrice)
          formData.append('discountTime', this.temp.discountTime)
          formData.append('validPeriod', this.temp.validPeriod)
          formData.append('usageNotice', unescape(this.temp.usageNotice))
          formData.append('useRights', unescape(this.temp.useRights))
          formData.append('id', this.temp.id)

          updateMemberCard(formData).then(() => {
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
        this.$message('已启用的会员卡无法删除！')
        return
      }
      deleteMemberCard(this.temp.id).then(() => {
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

    handleRemove(file, fileList) {
      // this.temp.uploadFile = []
      // for (let i = 0; i < fileList.length; i++) {
      //   this.temp.uploadFile.push(new File([fileList[i]], new Date().getTime() + '.jpg', {
      //     type: 'image/jpeg'
      //   }))
      // }
      if (fileList.length > 0) {
        this.fileLists = fileList
      }
      if (this.localFileList.length > 0) {
        const tempLocalFileList = []
        const tempDelFileList = this.delFileList
        var tempUrlName = this.temp.picUrl
        this.localFileList.forEach(function(logoFile) {
          console.log(logoFile.name)
          if (logoFile.name !== file.name) {
            tempLocalFileList.push(logoFile)
          } else {
            tempDelFileList.push(logoFile)
            tempUrlName = ''
          }
        })
        this.localFileList = tempLocalFileList
        this.delFileList = tempDelFileList
        this.temp.picUrl = tempUrlName
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadSectionFile(param) {
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
        this.fileLists.forEach(function(file) {
          if (file.uid === param.file.uid) {
            isExist = true
          }
        })
        if (isExist !== true) {
          this.fileLists.push(param.file)
        }
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        // this.fileLists.push(param.file)
        let isExist = false
        this.fileLists.forEach(function(file) {
          if (file.uid === param.file.uid) {
            isExist = true
          }
        })
        if (isExist !== true) {
          this.fileLists.push(param.file)
        }
      } else {
        this.$message.error('只能上传jpg/png文件')
        return
      }
    },

    updateStatus(row) {
      let vv = '0'
      let msg = '已启用'
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

    cardStatus(row) {
      const startTime = new Date(row.startTime)
      const endTime = new Date(row.endTime)
      const nowTime = new Date()
      if (nowTime >= startTime && nowTime <= endTime) {
        return '生效中'
      } else {
        return '已过期'
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
    handleRelease(row) {
      if (this.temp.status === '2') {
        this.$message('已禁用的会员卡无法再发放！')
        return
      }
      this.userList = []
      this.userTotal = 0
      this.dialogReleaseFormVisible = true
      this.releasedTemp.releasedMembercard = row
    },
    handleReleaseFilter() {
      this.userListQuery.page = 1
      this.fetchReleaseData()
    },
    fetchReleaseData() {
      this.userListLoading = true
      getWxUserList(this.userListQuery).then(response => {
        this.userList = response.data.records
        this.userTotal = parseInt(response.data.total)
        this.userListLoading = false
      })
    },
    handleReleaseCoupon(row) {
      this.releasedTemp.wxuserId = row.id
      this.releasedTemp.wxuserPhone = row.phoneNumber
      this.releasedTemp.openid = row.openid
      this.releasedTemp.membercardId = this.releasedTemp.releasedMembercard.id
      this.releasedTemp.membercardName = this.releasedTemp.releasedMembercard.cardname
      this.releasedTemp.orderPrice = this.releasedTemp.releasedMembercard.price
      this.releasedTemp.validPeriod = this.releasedTemp.releasedMembercard.validPeriod
      console.log(this.releasedTemp)
      console.log(row)
      createMembercardOrder(this.releasedTemp).then(() => {
        this.$notify({
          title: '发放会员卡成功',
          message: '给用户<' + row.nickname + '>发放<' + this.releasedTemp.membercardName + '>会员卡成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleOrderFilter() {
      this.orderListQuery.page = 1
      this.fetchOrderData()
    },
    fetchOrderData() {
      this.orderListLoading = true
      getMembercardOrderList(this.orderListQuery).then(response => {
        this.orderList = response.data.records
        this.orderTotal = parseInt(response.data.total)
        this.orderListLoading = false
      })
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
