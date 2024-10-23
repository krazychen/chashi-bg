<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" placeholder="昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phoneNumber" placeholder="手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
        重置
      </el-button>
<!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
<!--        新增-->
<!--      </el-button>-->
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
<!--      <el-table-column-->
<!--        type="index"-->
<!--        :index="indexMethod"-->
<!--        align="center"-->
<!--        label="序号">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="id"
        align="center"
        label="用户ID">
      </el-table-column>
      <el-table-column align="center" label="头像" width="180">
        <template   slot-scope="scope">
          <img :src="scope.row.avatarUrl"  min-width="50" height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="nickname" label="昵称" width="150" />
      <el-table-column align="center" prop="phoneNumber" label="手机号码" width="150" />
      <el-table-column align="center" prop="menberType" label="会员类型" width="150" />
      <el-table-column align="center" prop="integral" label="积分" width="150" />
      <el-table-column align="center" prop="balance" label="余额" width="150" :formatter="balanceFormat" />
      <el-table-column align="center" prop="status" label="状态" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-tickets" title="发放会员" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleRelease(scope.row)" />
          <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleView(scope.row)" />
<!--          <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleUpdate(scope.row)" />-->
<!--          <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />-->
          <i v-if="scope.row.status==='1'" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="图片" prop="avatar">
          <template   slot-scope="scope">
            <img :src="temp.avatarUrl"  min-width="50" height="50" />
          </template>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="手机号码" prop="sort">
          <el-input v-model="temp.phoneNumber" placeholder="会员类型" />
        </el-form-item>
        <el-form-item label="会员类型" prop="sort">
          <el-input v-model="temp.menberType" placeholder="会员类型" />
        </el-form-item>
        <el-form-item label="积分" prop="sort">
          <el-input v-model="temp.integral" placeholder="积分" />
        </el-form-item>
        <el-form-item label="余额" prop="sort">
          <el-input v-model="temp.balance" placeholder="余额" />
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
import { getWxUserList, updateStatusById, addCsRechargeRecord } from '@/api/chashi/wxUser'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import { roundFun } from '../../utils'

export default {
  name: 'WxUser',
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
        nickname: '',
        phoneNumber: ''
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      temp: {
        id: undefined,
        nickname: '',
        phoneNumber: '',
        avatarUrl: '',
        menberType: '',
        integral: '',
        balance: ''
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
      getWxUserList(this.listQuery).then(response => {
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
        nickname: '',
        phoneNumber: '',
        avatar: '',
        menberType: '',
        integral: '',
        balance: ''
      }
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
    rest() { // 重置
      this.listQuery = {
        current: 1,
        nickname: '',
        phoneNumber: ''
      }
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
    },

    balanceFormat(row) {
      return roundFun(row.balance, 2)
    },

    handleRelease(row) {
      if (this.temp.status === '2') {
        this.$message('已禁用的用户无法再充值！')
        return
      }
      this.$prompt('请输入要充值的金额', '充值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9.]+$/,
        inputErrorMessage: '请输入正整数！'
      }).then(({ value }) => {
        console.log(row)
        const rechargeTemp = {}
        rechargeTemp.wxuserId = row.id
        rechargeTemp.wxuserPhone = row.phoneNumber
        rechargeTemp.openid = row.openid
        rechargeTemp.rechargeAmount = value
        rechargeTemp.rechargeGived = 0

        console.log(rechargeTemp)
        addCsRechargeRecord(rechargeTemp).then(response => {
          this.$notify({
            title: '成功',
            message: '手工充值成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消手工充值'
        })
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
