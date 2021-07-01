<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-select
          v-model="listQuery.subjectTypeId"
          placeholder="请选择题型"
          clearable
          multiple
          style="width: 200px"
          class="filter-item"
        >
          <el-option v-for="item in subjectTypes" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
        <el-input v-model="listQuery.className" placeholder="请输入班级名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.subjectName" placeholder="请输入作业名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      </div>
      <div>
        <el-input v-model="listQuery.studentNumber" placeholder="请输入学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.auditName" placeholder="请输入批改老师" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.repeatName" placeholder="请输入审核老师" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      </div>
      <div>
        <el-select
          v-model="listQuery.subState"
          placeholder="请选择作业状态"
          clearable
          multiple
          style="width: 200px"
          class="filter-item"
        >
          <el-option v-for="item in subStates" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
        </el-select>
        <el-date-picker
          v-model="dateTiems"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          class="filter-item"
          style="width: 409px"
          @change="dateTimeBinding"
        />
      </div>
      <div class="filter-container">
        <el-select
          v-model="listQuery.status"
          placeholder="请选择学员状态"
          clearable
          multiple
          style="width: 200px"
          class="filter-item"
        >
          <el-option v-for="item in stuStatuss" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          导出
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetListQuery">
          重置
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { excelWriter } from '@/api/homework/hwHomework'
import { getHwSubjectTypeList } from '@/api/homework/subjectType'
import { getDictDataList } from '@/utils/dictUtils'
import waves from '@/directive/waves' // waves directive

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'Export',
  directives: { waves },
  data() {
    return {
      dateTiems: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      stuStatuss: [],
      subjectTypes: [],
      subStates: [],
      listQuery: {
        subjectTypeId: [],
        status: ['0', '1', '2'],
        className: undefined,
        subjectName: undefined,
        studentNumber: undefined,
        auditName: undefined,
        repeatName: undefined,
        subState: [],
        startSubjectTime: undefined,
        endSubjectTime: undefined
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.subStates = getDictDataList('hw_homework_submit_status')
    this.stuStatuss = getDictDataList('sys_status')
    getHwSubjectTypeList().then(res => {
      if (res.success) {
        this.subjectTypes = res.data
      }
    })
  },
  methods: {
    dateTimeBinding(values) {
      if (values[0] && values[1]) {
        this.listQuery.startSubjectTime = values[0]
        this.listQuery.endSubjectTime = values[1]
        console.log(this.listQuery)
      } else {
        this.listQuery.startTime = undefined
        this.listQuery.endTime = undefined
      }
    },
    resetListQuery() {
      this.listQuery = {
        subjectTypeId: [],
        status: ['0', '1', '2'],
        className: undefined,
        subjectName: undefined,
        studentNumber: undefined,
        auditName: undefined,
        repeatName: undefined,
        subState: [],
        startSubjectTime: undefined,
        endSubjectTime: undefined
      }
    },
    fetchData() {
      excelWriter(this.listQuery)
    },
    handleFilter() {
      let i = 0
      if (this.listQuery.subjectTypeId[0]) {
        i = i + 1
      }
      if (this.listQuery.className) {
        i = i + 1
      }
      if (this.listQuery.subjectName) {
        i = i + 1
      }
      if (this.listQuery.studentNumber) {
        i = i + 1
      }
      if (this.listQuery.auditName) {
        i = i + 1
      }
      if (this.listQuery.repeatName) {
        i = i + 1
      }
      if (this.listQuery.subState[0]) {
        i = i + 1
      }
      if (this.listQuery.startSubjectTime && this.listQuery.endSubjectTime) {
        i = i + 1
      }
      if (this.listQuery.status[0]) {
        i = i + 1
      }
      if (i < 1) {
        this.$message.error('至少需要选择一个筛选条件')
        return false
      }
      this.fetchData()
    }
  }
}
</script>

<style scoped>
  /deep/ .el-tag--small {

    padding: 0 8px;
    line-height: 1.5em;
    font-size: 18px;
    min-height: 5em;
    margin-right: 1em;
    margin-bottom: 1em;
  }

  .haha {
    width: 20em;
    text-align: center;
    float: left;
    margin-top: 1em;
    margin-bottom: 1em;
    height: 3em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }

  .hahas {
    width: 20em;
    text-align: center;
    float: left;
    margin-top: 1em;
    margin-bottom: 1em;
    height: 3em;
    line-height: 3em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }

</style>
