<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-input v-model="listQuery.nickName" placeholder="请输入学员姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="areaName" placeholder="请选择省份" clearable style="width: 200px" class="filter-item" @change="_selectChange2">
          <el-option v-for="item in areaList" :key="item.areaCode" :label="item.areaName" :value="item" />
        </el-select>
        <el-select v-model="schoolName" placeholder="请选择学校" clearable style="width: 200px" class="filter-item" @change="_selectChange3">
          <el-option v-for="item in schoolList" :key="item.schoolCode" :label="item.schoolName" :value="item" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" :icon="icongenduo" @click="gengduo">
          更多查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetListQuery">
          重置
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="daochu">
          导出
        </el-button>
        <div v-if="gen">
          <el-select v-model="subjectCategoryName" placeholder="请选择学科类别" clearable style="width: 200px" class="filter-item" @change="_selectChange4">
            <el-option v-for="item in examMethodList" :key="item.dictValue" :label="item.dictLabel" :value="item" />
          </el-select>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="填报时间从"
            class="filter-item"
            style="width: 400px"
            end-placeholder="填报时间到"
            value-format="yyyy-MM-dd"
            @change="queding"
          />
          <!--          <el-date-picker v-model="listQuery.auditStartTime" class="filter-item" style="width: 200px;" type="datetime" placeholder="批改截止开始时间" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
          <el-date-picker v-model="listQuery.auditEndTime" class="filter-item" style="width: 200px;" type="datetime" placeholder="作业截止结束时间" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />-->
        </div>
      </div>

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
        fixed
        prop="nickName"
        align="center"
        width="250px"
        label="名称"
      />
      <el-table-column
        fixed
        prop="gender"
        align="center"
        width="150px"
        label="性别"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.gender === '0'">
            未知
          </span>
          <span v-else-if="scope.row.gender === '1'">
            男
          </span>
          <span v-else>
            nv
          </span>
        </template>

      </el-table-column>
      <el-table-column label="学校" width="250" align="center" fixed>
        <template slot-scope="scope">
          <span v-if="scope.row.schoolCode!==null">（{{ scope.row.schoolCode }}）{{ scope.row.schoolName }}</span>
          <span v-else>
            {{ scope.row.schoolName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="facultyDepartmentName"
        align="center"
        width="250px"
        label="院系"
      />
      <el-table-column
        prop="examMethodName"
        align="center"
        label="考试方式"
      />
      <el-table-column
        prop="studyMethodName"
        align="center"
        label="学习方式"
      />
      <el-table-column
        prop="subjectCategoryName"
        width="250px"
        align="center"
        label="学科类别"
      />
      <el-table-column
        prop="collegeName"
        align="center"
        width="250px"
        label="专业"
      />
      <el-table-column
        prop="researchDirectionName"
        align="center"
        width="250px"
        label="专业方向"
      />
      <el-table-column
        align="center"
        label="科目一"
        width="250px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.subOneCode!==null">（{{ scope.row.subOneCode }}/{{ scope.row.subOneName }}）</span>
          <span v-else>
            {{ scope.row.subOneName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="subOneScore"
        align="center"
        width="150px"
        label="科目一分数"
      />
      <el-table-column
        align="center"
        label="科目二"
        width="250px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.subTwoCode!==null">（{{ scope.row.subTwoCode }}/{{ scope.row.subTwoName }}）</span>
          <span v-else>
            {{ scope.row.subTwoName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="subTwoScore"
        align="center"
        width="150px"
        label="科目二分数"
      />
      <el-table-column
        align="center"
        label="科目三"
        width="250px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.subThreeCode!==null">（{{ scope.row.subThreeCode }}/{{ scope.row.subThreeName }}）</span>
          <span v-else>
            {{ scope.row.subThreeName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="subThreeScore"
        align="center"
        width="150px"
        label="科目三分数"
      />
      <el-table-column
        align="center"
        label="科目四"
        width="250px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.subFourCode!==null">（{{ scope.row.subFourCode }}/{{ scope.row.subFourName }}）</span>
          <span v-else>
            {{ scope.row.subFourName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="subFourScore"
        align="center"
        width="150px"
        label="科目四分数"
      />
      <el-table-column label="操作" class-name="small-padding fixed-width" fixed>
        <template slot-scope="scope">
          <a style="color: #F56C6C;align-content: center" @click="chakan(scope.row.id)" >查看</a>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <!-- 删除提示框 -->
    <el-dialog title="排名列表" :visible.sync="cha" width="900px" center>
      <el-table
        v-loading="listLoadingcha"
        :data="listcha"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          prop="nickName"
          align="center"
          label="姓名"
        />
        <el-table-column
          prop="score"
          align="center"
          width="250px"
          label="总分/专业排名/专业方向排名"
        />
<!--        <el-table-column
          prop="scoreRank"
          align="center"
          width="100px"
          label="专业排名"
        />
        <el-table-column
          prop="researchDirectionScoreRank"
          align="center"
          width="100px"
          label="专业方向排名"
        />-->
        <el-table-column
          prop="subOneScore"
          align="center"
          width="100px"
          label="科目一分数"
        />
        <el-table-column
          prop="subTwoScore"
          align="center"
          width="100px"
          label="科目二分数"
        />
        <el-table-column
          prop="subThreeScore"
          align="center"
          width="100px"
          label="科目三分数"
        />
        <el-table-column
          prop="subFourScore"
          align="center"
          width="100px"
          label="科目三分数"
        />
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { getScoreStudentList, getStudentSelect, exports, getStudentRankSee } from '@/api/score/score'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'

// 让data数据在创建阶段透传到全局变量
export default {
  name: 'UserMgn',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      statuss: [], // 状态
      statusQueryParam: {},
      cha: false,
      listcha: [],
      listLoadingcha: false,
      gen: false,
      areaList: [],
      areaName: undefined,
      schoolName: undefined,
      schoolList: [],
      examMethodList: [],
      subjectCategoryName: undefined,
      value1: '',
      icongenduo: 'el-icon-arrow-up',
      multipleSelection: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        nickName: undefined,
        areaCode: undefined,
        schoolCode: undefined,
        subjectCategoryCode: undefined,
        endTime: undefined,
        startTime: undefined
      },
      usernameDisabled: false
    }
  },
  computed: {

  },
  created() {
    this.fetchData()
    this.getStudentSelects()
  },
  methods: {
    resetListQuery() {
      this.listQuery.current = 1
      this.listQuery.nickName = undefined
      this.listQuery.areaCode = undefined
      this.listQuery.schoolCode = undefined
      this.listQuery.subjectCategoryCode = undefined
      this.schoolName = undefined
      this.areaName = undefined
      this.subjectCategoryName = undefined
      this.listQuery.startTime = undefined
      this.listQuery.endTime = undefined
      this.value1 = ''
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getScoreStudentList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    chakan(id) {
      this.cha = true
      this.listLoadingcha = true
      const data = { id: id }
      getStudentRankSee(data).then(response => {
        this.listcha = response.data.rankList
        this.listLoadingcha = false
      })
    },
    daochu() {
      // exports()
      window.location.href = '/scoreStudent/export'
    },
    getStudentSelects() {
      getStudentSelect().then(res => {
        this.areaList = res.data.sysAreaList
        this.examMethodList = res.data.examMethodList
      })
    },
    gengduo() {
      if (this.gen) {
        this.gen = false
        this.icongenduo = 'el-icon-arrow-up'
      } else {
        this.gen = true
        this.icongenduo = 'el-icon-arrow-down'
      }
    },
    _selectChange2(val) {
      this.listQuery.areaCode = val.areaCode
      this.areaName = val.areaName
      this.schoolList = val.listSchool
    },
    _selectChange3(val) {
      this.listQuery.schoolCode = val.schoolCode
      this.schoolName = val.schoolName
    },
    _selectChange4(val) {
      this.listQuery.subjectCategoryCode = val.dictValue
      this.subjectCategoryName = val.dictLabel
    },
    queding(val) {
      if (val && val.length > 0) {
        this.listQuery.startTime = val[0]
        this.listQuery.endTime = val[1]
      } else {
        this.listQuery.startTime = undefined
        this.listQuery.endTime = undefined
        this.value1 = ''
      }
    },
    handleFilter() {
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.fetchData()
    },
    tableDeleteRow(row, or) {
      if (row.status === 1) {
        this.$message('已发布无法删除')
        return false
      }
      if (row.status === 2) {
        this.$message('已冻结无法删除')
        return false
      }
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        if (this.multipleSelection.length < 1) {
          this.$message('请勾选要删除的项！')
        } else {
          this.delVisible = true
        }
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickname: ''
      }
    },

    handleUpdate(row) {
      if (row.status === 1) {
        this.$message('已发布无法编辑')
        return false
      }
      if (row.status === 2) {
        this.$message('已冻结无法编辑')
        return false
      }
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    menuTypeFormat(row, type) {
      let vv = '-'
      const typ = this[type.property + 's']
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === (row[type.property] + '')) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
