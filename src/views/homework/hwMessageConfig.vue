<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.configName"
        placeholder="请输入配置名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.configMilestone" placeholder="请选择配置节点" class="filter-item" style="width: 200px;">
        <el-option
          v-for="item in messageMilestoneList"
          :key="item.dictValue"
          :label="item.dictLabel"
          :value="item.dictValue"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="restListQuery">
        重置
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
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
      <el-table-column align="center" label="配置名称">
        <template slot-scope="scope">
          {{ scope.row.configName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置节点">
        <template slot-scope="scope">
          {{ scope.row.configMilestoneName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="通知对象"
        :formatter="menuIsSysFormat"
      />
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i
            class="el-icon-camera"
            title="查看"
            tooltip="true"
            style="color: #315FC2;margin-left:15px;"
            type="primary"
            @click="lookMsg(scope.row)"
          />
          <i
            class="el-icon-edit"
            title="编辑"
            tooltip="true"
            style="color: #67C23A;margin-left:15px;"
            type="primary"
            @click="handleUpdate(scope.row)"
          />
          <i
            title="删除"
            class="el-icon-delete"
            style="color: #F56C6C;margin-left:10px;"
            @click="deletes(scope.row)"
          />
          <i
            v-if="scope.row.status==='0' || scope.row.status==='2'"
            class="fa fa-power-off"
            style="color: #F56C6C;margin-left:10px;"
            title="启用"
            @click="updateStatus(scope.row)"
          />
          <i
            v-else
            class="fa fa-ban"
            style="color: #F56C6C;margin-left:10px;"
            title="禁用"
            @click="updateStatus(scope.row)"
          />
          <i
            class="el-icon-circle-plus"
            style="color: #409EFF;margin-left:10px;"
            title="添加微信消息"
            @click="addWxCreate(scope.row)"
          />
          <i
            class="el-icon-circle-plus"
            style="color: #409EFF;margin-left:10px;"
            title="添加站内消息"
            @click="addSysCreate(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px">
        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="temp.configName" placeholder="请输入配置名称" :disabled="usernameDisabled" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="配置节点" prop="configMilestone" :style="selectwidthz">
          <el-select
            v-model="temp.configMilestone"
            :disabled="usernameDisabled"
            :style="selectwidthz"
            @change="handleConfigMilestoneChange"
            placeholder="请选择配置节点"
          >
            <el-option
              v-for="item in messageMilestoneList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="通知对象">
          <el-input v-model="temp.configMilestoneRemarks" type="textarea" :disabled="true" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.remarks"
            type="textarea"
            :disabled="usernameDisabled"
            placeholder="请输入备注信息"
            :style="selectwidthz"
          />
        </el-form-item>
      </el-form>
      <div v-show="!usernameDisabled" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="微信模板" :visible.sync="wxFormVisible" width="800px" @close="closeWx">
      <add-message-teimplate ref="addwxtep" :succ="true" :config-id.sync="configId" :form-data.sync="formData" @submit="submitWx" @cancel="cancelWx" />
    </el-dialog>

    <el-dialog title="系统模板" :visible.sync="sysFormVisible" width="800px" @close="closeSys">
      <add-message-teimplate ref="addSystep" :succ="false" :config-id="configIds" :form-data.sync="formDataSucc" @submit="submitSys" @cancel="cancelSys" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getHwMessageConfigPageList,
  addHwMessageConfig,
  updateHwMessageConfig,
  deleteHwMessageConfig,
  updateStatusById,
  addWxTemplate,
  getWxTemplate,
  addSysTemplate,
  getSysTemplate,
  configNameValid
} from '@/api/homework/hwMessageConfig'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'
import addMessageTeimplate from '@/views/homework/addMessageTeimplate'
import { getDictDataByType } from '@/api/system/SysDictData'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'HwMessageConfig',
  components: { Pagination, DictSelect, addMessageTeimplate },
  directives: { waves },
  filters: {
    stateFilter(state) {
      const stateMap = {
        1: 'success',
        2: 'gray',
        0: 'danger'
      }
      return stateMap[state]
    },
    genderFilter(value) {
      const genderObj = that.genders.filter(gender => gender.value === value)
      return genderObj[0].label
    }
  },
  data() {
    return {
      formDataSucc: {
        configTemplate: undefined,
        tableData: []
      },
      formData: {
        wxConfigId: undefined,
        configTemplate: undefined,
        tableData: []
      },
      configId: undefined,
      configIds: undefined,
      wxFormVisible: false,
      sysFormVisible: false,
      messageMilestoneList: [],
      statusQueryParam: {},
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        configMilestone: undefined,
        configName: undefined
      },
      temp: {
        id: undefined,
        configMilestone: '',
        configMilestoneName: '',
        configMilestoneRemarks: '',
        remarks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建',
        see: '查看'
      },
      genders: [{
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
      stateOptions: [{
        value: 0,
        label: '禁用'
      }, {
        value: 1,
        label: '启用'
      }, {
        value: 2,
        label: '锁定'
      }],
      rules: {
        configMilestone: [{ required: true, message: '请选择配置节点', trigger: 'blur' }],
        configName: [{ required: true, message: '请输配置名称', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.configNameVerification
        }]
      }
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '300px'
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    getDictDataByType('hw_message_milestone').then(res => {
      if (res.success && res.data !== null) {
        this.messageMilestoneList = res.data
        this.fetchData()
      }
    })
  },
  methods: {
    cancelWx() {
      this.wxFormVisible = false
    },
    cancelSys() {
      this.sysFormVisible = false
    },
    configNameVerification(rule, value, callback) {
      if (this.dialogStatus === 'see') {
        callback()
      } else {
        // 判断是编辑还是新增
        let map = {}
        if (this.dialogStatus === 'update') {
          map = { id: this.configIdv, configName: value }
        } else {
          map = { configName: value }
        }
        configNameValid(map).then(res => {
          if (res.data != null && res.data) {
            callback()
          } else {
            callback(new Error('已经存在"' + value + '"配置名称，请重新输入配置名称！'))
          }
        })
      }
    },
    menuIsSysFormat(row) {
      const milestone = this.messageMilestoneList.find(co => co.dictValue === row.configMilestone)
      return milestone.remarks
    },
    closeWx() {
      this.$refs.addwxtep.closetep()
    },
    closeSys() {
      this.$refs.addSystep.closetep()
    },
    restForm() {
      this.formData = {
        wxConfigId: undefined,
        configTemplate: undefined,
        tableData: []
      }
    },
    restFormSucc() {
      this.formDataSucc = {
        configTemplate: undefined,
        tableData: []
      }
    },
    submitWx(wxObj) {
      wxObj['wxConfigTemplate'] = wxObj.configTemplate
      addWxTemplate(wxObj).then(res => {
        if (res.success) {
          this.wxFormVisible = false
          this.$notify({
            title: '成功',
            message: '添加微信消息',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    submitSys(wxObj) {
      wxObj['sysConfigTemplate'] = wxObj.configTemplate
      addSysTemplate(wxObj).then(res => {
        if (res.success) {
          this.sysFormVisible = false
          this.$notify({
            title: '成功',
            message: '添加微信消息',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    restListQuery() {
      this.listQuery = {
        current: 1,
        configMilestone: undefined,
        configName: undefined
      }
      this.fetchData()
    },
    handleConfigMilestoneChange() {
      const milestone = this.messageMilestoneList.find(co => co.dictValue === this.temp.configMilestone)
      this.temp.configMilestoneName = milestone.dictLabel
      this.temp.configMilestoneRemarks = milestone.remarks
    },
    fetchData() {
      this.listLoading = true
      getHwMessageConfigPageList(this.listQuery).then(response => {
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
        configMilestone: '',
        configMilestoneName: '',
        configMilestoneRemarks: '',
        remarks: ''
      }
    },
    handleCreate() {
      this.configIdv = undefined
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.usernameDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addHwMessageConfig(this.temp).then(() => {
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
    lookMsg() {
      this.dialogStatus = 'see'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.configIdv = row.id
      this.temp = Object.assign({}, row) // copy obj
      this.temp.configMilestoneRemarks = this.menuIsSysFormat(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addWxCreate(row) {
      getWxTemplate(row.id).then(res => {
        if (res.success) {
          if (res.data) {
            this.formData = res.data
          } else {
            this.restForm()
          }
          this.configId = row.id
          // 添加微信模板
          this.wxFormVisible = true
        }
      })
    },
    addSysCreate(row) {
      getSysTemplate(row.id).then(res => {
        if (res.success) {
          if (res.data) {
            this.formDataSucc = res.data
          } else {
            this.restFormSucc()
          }
          this.configIds = row.id
          // 添加微信模板
          this.sysFormVisible = true
        }
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
        // const mess = vv === 0 ? '未发布' : (vv === 1 ? '发布' : '冻结')
        this.$message(msg)
        this.delVisible = false
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateHwMessageConfig(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
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
    deletes(row) {
      deleteHwMessageConfig(row.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
