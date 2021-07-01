<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      height="500px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <el-table-column align="center" label="重置人账户">
        <template slot-scope="scope">
          {{ scope.row.resetName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="重置时间" width="200px">
        <template slot-scope="scope">
          {{ scope.row.resetTime }}
        </template>
      </el-table-column>
      <el-table-column label="重置学员账户" align="center">
        <template slot-scope="scope">
          {{ scope.row.studentUsername }}
        </template>
      </el-table-column>
      <el-table-column label="重置作业名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stuHomeworkSubjectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重置作业提交截止时间" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.stuEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重置作业内容" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="unescape(scope.row.content)" placement="top-start">
            <span>
              <div v-if="scope.row.content" class="extra">
                {{ unescape(scope.row.content) }}
              </div>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="restVisible" width="500px" center>
      <div class="del-dialog-cnt">
        <p style="font-weight: bold;">
          请确认是否将选中的：
        </p>
        <p v-for="item in multipleSelection">
          {{ item.username }}-{{ item.subjectName }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="restVisible = false">取 消</el-button>
        <el-button type="primary" @click="restBatch()">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getDictDataList } from '@/utils/dictUtils'
import { getPageList } from '@/api/homework/hwHomework'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'UserMgn',
  components: { Pagination, DictSelect },
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
      restVisible: false,
      list: null,
      multipleSelection: [],
      listLoading: true,
      total: 0,
      listQuery: {

      },
      subStates: [],
      usernameDisabled: false
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.subStates = getDictDataList('hw_homework_submit_status')
    this.fetchData()
  },
  methods: {
    record() {

    },
    unescape(html) {
      if (!html) {
        return ''
      }
      return html
        .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/amp;/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "\'")
        .replace(/&ldquo;/g, '\“')
        .replace(/&rdquo;/g, '\”')
        .replace(/&lsquo;/g, '\‘')
        .replace(/&rsquo;/g, '\’')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    rest() {
      this.listQuery = {
        usernames: undefined
      }
      this.fetchData()
    },
    restStart() {
      if (this.multipleSelection.length < 1) {
        this.$message('请勾选要删除的项！')
      } else {
        this.restVisible = true
      }
    },
    restBatch() {
      const that = this
      const can = []
      this.multipleSelection.forEach(function(a, b) {
        can.push(a.id)
      })
      if (can.length < 1) {
        this.$message.error('请选择要重置的学员作业！')
      }
      getPageList(can).then(res => {
        if (res.success) {
          this.restVisible = false
          this.$notify({
            title: '成功',
            message: '重置成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '重置失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    subStateFormat(row, type) {
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
    fetchData() {
      this.listLoading = true
      getPageList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickname: '',
        password: '',
        phone: '',
        gender: 1,
        state: '0',
        departmentId: 1, // 暂时写死
        roleId: 1 // 暂时写死
      }
    }
  }
}
</script>
<style>
  .extra {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
