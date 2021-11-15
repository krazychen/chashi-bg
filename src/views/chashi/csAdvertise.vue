<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sort" placeholder="排序" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

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
      <el-table-column
        type="index"
        :index="indexMethod"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column align="center" label="图片" width="280">
        <template   slot-scope="scope">
          <img :src="scope.row.picUrl"  min-width="50" height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="跳转链接" width="180 ">
        <template slot-scope="scope">
          {{ scope.row.jumpLink }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="180 ">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
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
        <el-form-item label="图片" prop="picUrl">
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
        <el-form-item label="跳转链接" prop="jumpLink">
          <el-input v-model="temp.jumpLink" placeholder="请输入跳转链接" />
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
import { getAdvertiseList, createAdvertise, updateAdvertise, deleteAdvertise, updateStatusById } from '@/api/chashi/csAdvertise'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'CsAdvertise',
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
        sort: ''
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      temp: {
        id: undefined,
        picUrl: '',
        picName: '',
        jumpLink: '',
        sort: '',
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
        // picUrl: [{ required: true, message: '请上传logo', trigger: 'blur' }],
        jumpLink: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      },
      dialogImageUrl: '',
      dialogVisible: false
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
      getAdvertiseList(this.listQuery).then(response => {
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
        picUrl: '',
        picName: '',
        jumpLink: '',
        sort: '',
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
        this.rulesText.picUrl = []
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          console.log(this.fileLists.length)
          this.fileLists.forEach(function(file) {
            formData.append('uploadFile', file, file.name)
          })
          formData.append('jumpLink', this.temp.jumpLink)
          formData.append('sort', this.temp.sort)

          createAdvertise(formData).then(() => {
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
      this.chakan = true
      if (this.temp.picUrl) {
        const picLists = this.temp.picUrl.split(',')
        const nameLists = this.temp.picName.split(',')
        this.localFileList = []
        for (let i = 0; i < picLists.length; i++) {
          const cop = {}
          cop['name'] = nameLists[i]
          cop['url'] = picLists[i]
          this.localFileList.push(cop)
        }
      }
    },
    handleUpdate(row) {
      this.chakan = false
      this.fileLists = []
      this.delFileList = []
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.picUrl) {
        const picLists = this.temp.picUrl.split(',')
        const nameLists = this.temp.picName.split(',')
        this.localFileList = []
        for (let i = 0; i < picLists.length; i++) {
          const cop = {}
          cop['name'] = nameLists[i]
          cop['url'] = picLists[i]
          this.localFileList.push(cop)
        }
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      if (this.fileLists.length > 0) {
        this.rulesText.logoUrl = []
      } else {
        this.$notify({
          title: '失败',
          message: '请上传logo图片',
          duration: 2000
        })
        return
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

          formData.append('jumpLink', this.temp.jumpLink)
          formData.append('sort', this.temp.sort)
          formData.append('id', this.temp.id)
          updateAdvertise(formData).then(() => {
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
        this.$message('已启用的广告无法删除！')
        return
      }
      deleteAdvertise(this.temp.id).then(() => {
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
      this.listQuery.sort = ''
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
        this.fileLists.push(param.file)
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        this.fileLists.push(param.file)
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
