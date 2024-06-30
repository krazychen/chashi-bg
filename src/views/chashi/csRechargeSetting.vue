<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="充值设置">
        <div class="filter-container">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
        </div>
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column type="index" :index="indexMethod" align="center" label="序号">
          </el-table-column>
          <el-table-column align="center" prop="rechargeAmount" label="充值金额" width="350" />
          <el-table-column align="center" prop="rechargeGived" label="赠送金额" width="350" />
          <el-table-column align="center" prop="status" label="状态" :formatter="statusFormat" />
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-tickets" title="手工充值" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleRelease(scope.row)" />
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

      <el-tab-pane label="充值记录">
        <div class="filter-container">
          <el-input v-model="orderListQuery.wxuserPhoneAname" placeholder="用户昵称/手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleOrderFilter" />

          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleOrderFilter">查询</el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
            重置
          </el-button>
        </div>
        <el-table v-loading="orderListLoading" :data="orderList" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column type="index" :index="indexMethod" align="center" label="序号">
          </el-table-column>
          <el-table-column align="center" prop="wxuserName" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="rechargeAmount" label="充值金额" width="150" :formatter="rechargeAmountFormat"/>
          <el-table-column align="center" prop="rechargeGived" label="赠送金额" width="100" :formatter="rechargeGivedFormat"/>
          <el-table-column align="center" prop="integral" label="积分" width="100" />
          <el-table-column align="center" prop="orderDate" label="购买日期" width="200" />
          <el-table-column align="center" prop="sourceType" label="充值类型" width="100" :formatter="sourceTypeStatus"/>
          <el-table-column align="center" prop="paymentStatus" label="支付状态" width="100" :formatter="paymentStatus"/>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="orderListQuery.current" :limit.sync="orderListQuery.size" @pagination="fetchOrderData" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="充值金额" prop="rechargeAmount">
          <el-input v-model="temp.rechargeAmount" placeholder="请输入充值金额" />
        </el-form-item>
        <el-form-item label="赠送金额" prop="rechargeGived">
          <el-input v-model="temp.rechargeGived" placeholder="请输入赠送金额" />
        </el-form-item>
      </el-form>
      <div v-if="!chakan" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="手工充值" :visible.sync="dialogReleaseFormVisible">
      <div class="filter-container">
        <el-input v-model="userListQuery.nameAphone" placeholder="请输入用户昵称/手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleReleaseFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleReleaseFilter">
          查询
        </el-button>
      </div>
      <el-table v-loading="userListLoading" :data="userList" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="头像" width="180 ">
          <template   slot-scope="scope">
            <img :src="scope.row.avatarUrl"  min-width="50" height="50" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="昵称" />
        <el-table-column align="center" prop="phoneNumber" label="手机号" />
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleReleaseCoupon(scope.row)" >手工充值</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="userTotal>0" :total="userTotal" :page.sync="userListQuery.current" :limit.sync="userListQuery.size" @pagination="fetchData" />
    </el-dialog>
  </div>
</template>

<script>
import { getRechargeSettingList, createRechargeSetting, updateRechargeSetting, deleteRechargeSetting, updateStatusById } from '@/api/chashi/csRechargeSetting'
import { getWxUserList } from '@/api/chashi/wxUser'
import { createRechargeRecord, getRechargeRecordList } from '@/api/chashi/csRechargeRecord'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import { roundFun } from '../../utils'

export default {
  name: 'CsMemberCard',
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
        rechargeAmount: '',
        rechargeGived: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      rulesText: {
        rechargeAmount: [{ required: true, message: '请输入充值金额', trigger: 'blur' }],
        rechargeGived: [{ required: true, message: '请输入赠送金额', trigger: 'blur' }]
      },
      dialogReleaseFormVisible: false,
      releasedTemp: {
        rechargeSetting: '',
        rechargeAmount: '',
        rechargeGived: '',
        wxuserId: '',
        wxuserPhone: '',
        openid: ''
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
      getRechargeSettingList(this.listQuery).then(response => {
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
        rechargeAmount: '',
        rechargeGived: ''
      }
    },
    handleCreate() {
      this.chakan = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          createRechargeSetting(tempData).then(() => {
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
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRechargeSetting(tempData).then(() => {
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
        this.$message('已启用的充值设置无法删除！')
        return
      }
      deleteRechargeSetting(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
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
    paymentStatus(row) {
      if (row.paymentStatus === 0) {
        return '支付中'
      } else if (row.paymentStatus === 1) {
        return '支付失败'
      } else if (row.paymentStatus === 2) {
        return '支付成功'
      } else if (row.paymentStatus === 3) {
        return '支付关闭'
      } else {
        return '支付取消'
      }
    },
    sourceTypeStatus(row) {
      if (row.sourceType === 0) {
        return '系统发放'
      } else {
        return '用户购买'
      }
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
    rechargeAmountFormat(row) {
      return roundFun(row.rechargeAmount, 2)
    },
    rechargeGivedFormat(row) {
      return roundFun(row.rechargeGived, 2)
    },
    handleRelease(row) {
      if (this.temp.status === '2') {
        this.$message('已禁用的充值设置无法再手工充值！')
        return
      }
      this.userList = []
      this.userTotal = 0
      this.dialogReleaseFormVisible = true
      this.releasedTemp.rechargeSetting = row
    },
    handleReleaseFilter() {
      this.userListQuery.page = 1
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
      this.releasedTemp.rechargeAmount = this.releasedTemp.rechargeSetting.rechargeAmount
      this.releasedTemp.rechargeGived = this.releasedTemp.rechargeSetting.rechargeGived
      console.log(this.releasedTemp)
      createRechargeRecord(this.releasedTemp).then(() => {
        this.$notify({
          title: '手工充值成功',
          message: '给用户<' + row.nickname + '>充值<' + this.releasedTemp.rechargeAmount + '>成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleOrderFilter() {
      this.orderListQuery.page = 1
      this.fetchOrderData()
    },
    rest() { // 重置
      this.orderListQuery = {
        current: 1,
        wxuserPhoneAname: ''
      }
      this.fetchOrderData()
    },
    fetchOrderData() {
      this.orderListLoading = true
      getRechargeRecordList(this.orderListQuery).then(response => {
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
