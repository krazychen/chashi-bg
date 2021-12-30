<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.couponName" placeholder="请输入优惠券名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-radio-group v-model="listQuery.releasedMethod" style="width: 400px; margin-left:15px;" class="filter-item" @change="handleFilter">
        <el-radio :label="1">新人优惠卷</el-radio>
        <el-radio :label="2">分享优惠卷</el-radio>
        <el-radio :label="3">领卷中心</el-radio>
      </el-radio-group>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleDialog(null, 'create')">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" :index="indexMethod" align="center" label="序号" />
      <el-table-column align="center" prop="couponName" label="优惠卷名称" width="180 " />
      <el-table-column align="center" label="满减金额" width="180 ">
        <template slot-scope="scope">
          {{ '满' + scope.row.fullAmount + '减' + scope.row.reductionAmount }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="releasedMethod" label="获取方式">
        <template slot-scope="scope">
          {{ scope.row.releasedMethod === 1 ? '新人优惠卷' : (scope.row.releasedMethod === 2 ? '分享优惠卷' : '领卷中心') }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="startTime" label="开始时间" />
      <el-table-column align="center" prop="endTime" label="结束时间" />
      <el-table-column align="center" prop="status" label="状态" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-tickets" title="发放优惠卷" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleRelease(scope.row)" />
          <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleDialog(scope.row, 'view')" />
          <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleDialog(scope.row, 'update')" />
          <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
          <i v-if="scope.row.status==='1'" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="temp.couponName" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="获取方式" prop="releasedMethod" style="width: 140%">
          <el-radio-group v-model="temp.releasedMethod">
            <el-radio :label="1">新人优惠卷</el-radio>
            <el-radio :label="2">分享优惠卷</el-radio>
            <el-radio :label="3">领卷中心</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="满减" prop="fullAmount">
          <el-input-number v-model="temp.fullAmount" controls-position="right" label="满" />
          减
          <el-input-number v-model="temp.reductionAmount" controls-position="right" label="减" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker v-model="temp.startTime" type="date" placeholder="请选择开始日期" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker v-model="temp.endTime" type="date" placeholder="请选择结束日期" value-format="yyyy-MM-dd"/>
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
    </el-dialog>，

    <el-dialog title="发放优惠卷" :visible.sync="dialogReleaseFormVisible">
      <div class="filter-container">
        <el-input v-model="userListQuery.nameAphone" placeholder="请输入用户昵称/手机号" style="width: 200px;" class="filter-item" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleReleaseFilter">
          查询
        </el-button>
      </div>
      <el-table v-loading="userListLoading" :data="userList" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="头像" width="180 ">
          <template slot-scope="scope">
            {{ scope.row.avatarUrl }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="昵称" />
        <el-table-column align="center" prop="phoneNumber" label="手机号" />
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleReleaseCoupon(scope.row)" >发放优惠卷</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="userTotal>0" :total="userTotal" :page.sync="userListQuery.current" :limit.sync="userListQuery.size" @pagination="fetchReleaseData" />
      <br>
      <el-row :gutter="20">
        <el-col :span="4" style="text-align: left; line-height: 32px">优惠券数量</el-col>
        <el-col :span="18"><el-input-number v-model="releasedTemp.releasedNum" controls-position="right" label="请输入优惠券数量" style="width: 250px"/></el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getCouponList, createCoupon, updateCoupon, deleteCoupon, updateStatusById, createReleasedCoupon } from '@/api/chashi/csCoupon'
import { getWxUserList } from '@/api/chashi/wxUser'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'CsCoupon',
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
        couponName: '',
        releasedMethod: 1
      },
      userList: null,
      userListLoading: false,
      userTotal: 0,
      userListQuery: {
        nameAphone: ''
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      temp: {
        id: '',
        couponName: '',
        releasedMethod: 1,
        fullAmount: '',
        reductionAmount: '',
        startTime: '',
        endTime: ''
      },
      headers: { 'Content-Type': 'multipart/form-data' },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      rulesText: {
        couponName: [{ required: true, message: '请输入优惠卷名称', trigger: 'blur' }],
        releasedMethod: [{ required: true, message: '请输入获取方式', trigger: 'blur' }],
        startTime: [{ required: true, message: '请输入开始日期', trigger: 'blur' }],
        endTime: [{ required: true, message: '请输入结束日期', trigger: 'blur' }]
      },
      dialogReleaseFormVisible: false,
      releasedTemp: {
        releasedCoupon: '',
        couponId: '',
        releasedNum: 0,
        wxuserId: ''
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
      getCouponList(this.listQuery).then(response => {
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
        couponName: '',
        releasedMethod: 1,
        fullAmount: '',
        reductionAmount: '',
        startTime: '',
        endTime: ''
      }
    },
    handleDialog(row, type) { // 创建/查看/编辑详情
      if (type === 'create') {
        this.chakan = false
        this.dialogStatus = 'create'
        this.resetTemp()
      } else if (type === 'update') {
        this.chakan = false
        this.dialogStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
      } else {
        this.chakan = true
        this.dialogStatus = 'view'
        this.temp = Object.assign({}, row) // copy obj
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          createCoupon(this.temp).then(() => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateCoupon(tempData).then(() => {
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
        this.$message('已启用的优惠卷无法删除！')
        return
      }
      deleteCoupon(this.temp.id).then(() => {
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
      this.listQuery.couponName = ''
      this.listQuery.releasedMethod = 1
      this.fetchData()
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
    handleRelease(row) {
      if (this.temp.status === '2') {
        this.$message('已禁用的优惠卷无法再发放！')
        return
      }
      this.userList = []
      this.userTotal = 0
      this.dialogReleaseFormVisible = true
      this.releasedTemp.releasedCoupon = row
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
      if (this.releasedTemp.releasedNum === 0) {
        this.$message('请输入要发放的优惠卷数量！')
        return
      }
      this.releasedTemp.wxuserId = row.id
      this.releasedTemp.couponId = this.releasedTemp.releasedCoupon.id
      console.log(this.releasedTemp)
      console.log(row)
      createReleasedCoupon(this.releasedTemp).then(() => {
        this.$notify({
          title: '发放优惠卷成功',
          message: '给用户' + row.nickname + '发放' + this.releasedTemp.releasedNum + '张优惠卷成功',
          type: 'success',
          duration: 2000
        })
      })
    }

  }
}
</script>

<style>
</style>
