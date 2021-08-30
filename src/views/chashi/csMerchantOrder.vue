<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.merchantId" placeholder="请选择商店">
        <el-option
          v-for="item in merchantOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.nameAphone" placeholder="请输入用户昵称/手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="全部">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="nickname" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="roomName" label="茶室名称" width="180" />
          <el-table-column align="center" prop="orderPrice" label="付费金额" width="100" />
          <el-table-column align="center" prop="orderOriginPrice" label="订单金额" width="100" />
          <el-table-column align="center" prop="orderDate" label="使用日期" width="120" />
          <el-table-column align="center" prop="orderTimerage" label="使用时间段" width="180" />
          <el-table-column align="center" prop="paymentType" label="支付类型" width="120" :formatter="paymentType" />
          <el-table-column align="center" prop="status" label="订单状态" width="120" :formatter="orderStatus"/>
          <el-table-column label="订单详情" align="center" width="130" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'view')" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="待付款">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="nickname" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="roomName" label="茶室名称" width="180" />
          <el-table-column align="center" prop="orderPrice" label="付费金额" width="100" />
          <el-table-column align="center" prop="orderOriginPrice" label="订单金额" width="100" />
          <el-table-column align="center" prop="orderDate" label="使用日期" width="120" />
          <el-table-column align="center" prop="orderTimerage" label="使用时间段" width="180" />
          <el-table-column align="center" prop="paymentType" label="支付类型" width="120" :formatter="paymentType" />
          <el-table-column align="center" prop="status" label="订单状态" width="120" :formatter="orderStatus"/>
          <el-table-column label="订单详情" align="center" width="130" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'view')" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="待使用">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="nickname" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="roomName" label="茶室名称" width="180" />
          <el-table-column align="center" prop="orderPrice" label="付费金额" width="100" />
          <el-table-column align="center" prop="orderOriginPrice" label="订单金额" width="100" />
          <el-table-column align="center" prop="orderDate" label="使用日期" width="120" />
          <el-table-column align="center" prop="orderTimerage" label="使用时间段" width="180" />
          <el-table-column align="center" prop="paymentType" label="支付类型" width="120" :formatter="paymentType" />
          <el-table-column align="center" prop="status" label="订单状态" width="120" :formatter="orderStatus"/>
          <el-table-column label="订单详情" align="center" width="130" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'view')" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="已使用">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="nickname" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="roomName" label="茶室名称" width="180" />
          <el-table-column align="center" prop="orderPrice" label="付费金额" width="100" />
          <el-table-column align="center" prop="orderOriginPrice" label="订单金额" width="100" />
          <el-table-column align="center" prop="orderDate" label="使用日期" width="120" />
          <el-table-column align="center" prop="orderTimerage" label="使用时间段" width="180" />
          <el-table-column align="center" prop="paymentType" label="支付类型" width="120" :formatter="paymentType" />
          <el-table-column align="center" prop="status" label="订单状态" width="120" :formatter="orderStatus"/>
          <el-table-column label="订单详情" align="center" width="130" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'view')" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="已完成">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="nickname" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="roomName" label="茶室名称" width="180" />
          <el-table-column align="center" prop="orderPrice" label="付费金额" width="100" />
          <el-table-column align="center" prop="orderOriginPrice" label="订单金额" width="100" />
          <el-table-column align="center" prop="orderDate" label="使用日期" width="120" />
          <el-table-column align="center" prop="orderTimerage" label="使用时间段" width="180" />
          <el-table-column align="center" prop="paymentType" label="支付类型" width="120" :formatter="paymentType" />
          <el-table-column align="center" prop="status" label="订单状态" width="120" :formatter="orderStatus"/>
          <el-table-column label="订单详情" align="center" width="130" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'view')" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="已取消">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="nickname" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="roomName" label="茶室名称" width="180" />
          <el-table-column align="center" prop="orderPrice" label="付费金额" width="100" />
          <el-table-column align="center" prop="orderOriginPrice" label="订单金额" width="100" />
          <el-table-column align="center" prop="orderDate" label="使用日期" width="120" />
          <el-table-column align="center" prop="orderTimerage" label="使用时间段" width="180" />
          <el-table-column align="center" prop="paymentType" label="支付类型" width="120" :formatter="paymentType" />
          <el-table-column align="center" prop="status" label="订单状态" width="120" :formatter="orderStatus"/>
          <el-table-column label="订单详情" align="center" width="130" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'view')" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="已退款">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="nickname" label="用户昵称" width="150" />
          <el-table-column align="center" prop="wxuserPhone" label="用户手机" width="150" />
          <el-table-column align="center" prop="roomName" label="茶室名称" width="180" />
          <el-table-column align="center" prop="orderPrice" label="付费金额" width="100" />
          <el-table-column align="center" prop="orderOriginPrice" label="订单金额" width="100" />
          <el-table-column align="center" prop="orderDate" label="使用日期" width="120" />
          <el-table-column align="center" prop="orderTimerage" label="使用时间段" width="180" />
          <el-table-column align="center" prop="paymentType" label="支付类型" width="120" :formatter="paymentType" />
          <el-table-column align="center" prop="status" label="订单状态" width="120" :formatter="orderStatus"/>
          <el-table-column label="订单详情" align="center" width="130" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleViewAUpdate(scope.row, 'view')" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="手工新增订单" :visible.sync="dialogAddFormVisible">
      <cs-add-merchant-order></cs-add-merchant-order>
    </el-dialog>
  </div>
</template>

<script>
import { getMerchantOrderList } from '@/api/chashi/csMerchantOrder'
import { getMerchantList } from '@/api/chashi/csMerchant'
import Pagination from '@/components/Pagination'
import CsAddMerchantOrder from '@/views/chashi/csAddMerchantOrder'
import waves from '@/directive/waves'

export default {
  name: 'CsMerchantOrder',
  components: { Pagination, CsAddMerchantOrder },
  directives: { waves },
  data() {
    return {
      chakan: null,
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        sort: '',
        queryType: 1,
        merchantId: '',
        nameAphone: ''
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
      dialogAddFormVisible: false,
      textMap: {
        view: '查看'
      },
      merchantOptions: [],
      merchantModel: ''
    }
  },
  beforeCreate() {
  },
  created() {
    getMerchantList({}).then(response => {
      const merchantOptionss = [{}]
      response.data.records.forEach(function(obj) {
        const merchantOption = { value: obj.id, label: obj.merchantName }
        merchantOptionss.push(merchantOption)
      })
      this.merchantOptions = merchantOptionss
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      console.log(this.listQuery)
      getMerchantOrderList(this.listQuery).then(response => {
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
    paymentType(row) {
      if (row.paymentType === 1) {
        return '余额支付'
      } else if (row.paymentType === 2) {
        return '微信支付'
      }
    },
    orderStatus(row) {
      if (row.paymentStatus === 0) {
        return '支付中'
      } else if (row.paymentStatus === 1) {
        return '支付失败'
      } else if (row.paymentStatus === 2) {
        return '支付成功'
      } else {
        return '支付关闭'
      }
    },
    handleClick(tab, event) {
      switch (tab.label) {
        case '待付款':
          this.listQuery.queryType = 2
          this.fetchData()
          break
        case '待使用':
          this.listQuery.queryType = 3
          this.fetchData()
          break
        case '已使用':
          this.listQuery.queryType = 4
          this.fetchData()
          break
        case '已完成':
          this.listQuery.queryType = 5
          this.fetchData()
          break
        case '已取消':
          this.listQuery.queryType = 6
          this.fetchData()
          break
        case '已退款':
          this.listQuery.queryType = 7
          this.fetchData()
          break
        default:
          this.listQuery.queryType = 1
          this.fetchData()
      }
    },
    handleCreate() {
      this.dialogAddFormVisible = true
    }
  }
}
</script>

