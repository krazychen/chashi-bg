<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-input
          v-model="listQuery.subjectName"
          placeholder="作业题目"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-date-picker
          v-model="listQuery.startTime"
          class="filter-item"
          style="width: 150px;"
          type="datetime"
          placeholder="作业截止开始时间"
          value-format=" yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
        />
        <el-date-picker
          v-model="listQuery.endTime"
          class="filter-item"
          style="width: 150px;"
          type="datetime"
          placeholder="作业截止结束时间"
          value-format=" yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
        />
        <el-button v-waves class="filter-item" type="primary" :icon="icongenduo" @click="gengduo">
          更多查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetListQuery">
          重置
        </el-button>
        <el-dropdown class="filter-item" trigger="click" placement="top">
          <el-button type="primary" class="el-dropdown-link">
            更多
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
            <el-dropdown-item class="custom-dropdown-menu-item">
              <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="releasesAll">
                发布作业
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item class="custom-dropdown-menu-item">
              <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
                布置作业
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item class="custom-dropdown-menu-item">
              <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="unpublishAllYesOrNo">
                取消发布
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item class="custom-dropdown-menu-item">
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-delete"
                @click="deleteRow('','deletes')"
              >
                删除作业
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div v-if="gen">
        <el-input
          v-model="listQuery.groupName"
          placeholder="作业组名称"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-date-picker
          v-model="listQuery.auditStartTime"
          class="filter-item"
          style="width: 150px;"
          type="datetime"
          placeholder="批改截止开始时间"
          value-format=" yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
        />
        <el-date-picker
          v-model="listQuery.auditEndTime"
          class="filter-item"
          style="width: 150px;"
          type="datetime"
          placeholder="作业截止结束时间"
          value-format=" yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
        />
      </div>
      <div v-if="gen">
        <el-input
          v-model="listQuery.classTypeName"
          placeholder="标签"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.className"
          placeholder="班级"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.subjectTypeId"
          placeholder="题型"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in subjectTypes" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
      </div>
      <div v-if="gen">
        <el-input
          v-model="listQuery.completeExplain"
          placeholder="题目说明"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <el-table-column
        prop="subjectName"
        label="题目名称"
        fixed
        width="200"
      />
      <el-table-column
        prop="groupName"
        label="作业组名称"
        fixed
        width="200"
      />
      <el-table-column
        prop="startTime"
        label="作业开始时间"
        fixed
        width="200"
      />
      <el-table-column
        prop="endTime"
        label="作业提交截止时间"
        width="200"
      />
      <el-table-column
        prop="auditEndTime"
        label="老师批改截止时间"
        width="200"
      />
      <el-table-column
        prop="qaEndTime"
        label="学生追问截止时间"
        width="200"
      />
      <el-table-column
        prop="subScoreCount"
        label="子分数个数"
        width="200"
      />
      <el-table-column
        label="班级标签"
        width="200"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="scope.row.classTypeName" placement="top">
            <span>
              <div v-if="scope.row.classTypeName" class="extra">
                {{ scope.row.classTypeName }}
              </div>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="班级"
        width="200"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="scope.row.className" placement="top">
            <span>
              <div v-if="scope.row.className" class="extra">
                {{ scope.row.className }}
              </div>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="subjectTypeName"
        label="题目类型"
        width="200"
      />
      <el-table-column
        prop="subjectState"
        label="题目状态"
        width="200"
        :formatter="menuTypeFormat"
      />
      <el-table-column
        prop="学员数"
        label="学员数"
        width="200"
        :formatter="xueyuan"
      />
      <el-table-column
        label="当前批改老师"
        width="200"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="scope.row.teacherNames" placement="top">
            <span>
              <div v-if="scope.row.teacherNames" class="extra">
                {{ scope.row.teacherNames }}
              </div>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="fhteacherNames"
        label="当前复核老师"
        width="200"
      />
      <el-table-column
        prop="completeExplain"
        label="作业说明"
        width="200"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="scope.row.completeExplain" placement="top">
            <span>
              <div v-if="scope.row.completeExplain" class="extra">
                {{ scope.row.completeExplain }}
              </div>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="isQa"
        label="启用追问"
        width="200"
        :formatter="menuTypeFormat"
      />
      <el-table-column
        prop="qaNumbers"
        label="追问人数"
      />
      <el-table-column
        prop="username"
        label="发布人"
      />
      <el-table-column
        prop="subjectTime"
        label="发布时间"
        width="200"
      />
      <el-table-column fixed="right" label="操作" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <i
            v-if="scope.row.subjectState==='0'"
            class="el-icon-edit"
            style="color: #67C23A;margin-left:10px;"
            type="primary"
            title="编辑作业"
            @click="handleUpdate(scope.row,'update')"
          />
          <i
            v-if="scope.row.subjectState==='0'"
            class="el-icon-delete"
            style="color: #F56C6C;margin-left:10px;"
            title="删除作业"
            @click="tableDeleteRow(scope.row,'delete')"
          />
          <i
            v-if="scope.row.subjectState==='0'"
            class="fa fa-power-off"
            style="color: #F56C6C;margin-left:10px;"
            title="发布作业"
            @click="updateStatus(scope.row)"
          />
          <i
            v-if="scope.row.subjectState==='1'"
            class="el-icon-info"
            style="color: #F56C6C;margin-left:10px;"
            title="查看作业"
            @click="handleUpdate(scope.row,'info')"
          />
          <i
            v-if="scope.row.subjectState==='1'"
            class="fa fa-send-o"
            style="color: #F56C6C;margin-left:10px;"
            title="发送通知"
            @click="sendMsg(scope.row)"
          />
          <i
            v-if="scope.row.subjectState==='1'"
            class="el-icon-user"
            style="color: #F56C6C;margin-left:10px;"
            title="学员列表"
            @click="xueyuans(scope.row)"
          />
          <i
            v-if="scope.row.subjectState==='1'"
            class="el-icon-s-check"
            style="color: #F56C6C;margin-left:10px;"
            title="添加委托老师"
            @click="weituo(scope.row)"
          />
          <i v-if="scope.row.subjectState === '1'" title="补发作业" class="el-icon-circle-plus-outline" style="color: #F56C6C;margin-left:10px;" @click="getTreeData(scope.row)" />
          <i v-if="scope.row.subjectState === '1'" title="取消发布" class="el-icon-circle-close" style="color: #F56C6C;margin-left:10px;" @click="unpublishYesOrNo(scope.row)" />
          <!-- <i v-if="scope.row.subjectState==='1'" class="fa fa-ban" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />-->
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

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">请确认是否删除数据！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 取消发布提示框 -->
    <el-dialog title="取消发布" :visible.sync="unpublish" width="400px">
      <div class="del-dialog-cnt">请确定是否取消发布，取消发布会将会影响到已经完成作业提交的学员，请确认！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unpublish = false">取 消</el-button>
        <el-button type="primary" @click="cancel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量取消发布提示框 -->
    <el-dialog title="批量取消发布" :visible.sync="unpublishAll" width="400px">
      <div class="del-dialog-cnt">请确定是否取消发布，取消发布会将会影响到已经完成作业提交的学员，请确认！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unpublishAll = false">取 消</el-button>
        <el-button type="primary" @click="cancelall">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="委托批改" :visible.sync="wtVisible" width="510px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="委托老师" prop="teacherId">
          <el-select v-model="temp.teacherId" filterable placeholder="请选择" :style="selectwidthz">
            <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="作业开始时间" prop="entrustStartTime">
          <el-date-picker
            v-model="temp.entrustStartTime"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            value-format=" yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <el-form-item label="作业截止时间" prop="entrustEndTime">
          <el-date-picker
            v-model="temp.entrustEndTime"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            value-format=" yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="wtVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="学员列表" :visible.sync="stuVisible" width="1250px">
      <div class="stu-container">
        <div class="filter-container">
          <el-input
            v-model="stulistQuery.username"
            placeholder="学员账户"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="stuhandleFilter"
          />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="stuhandleFilter">
            查询
          </el-button>
          <el-button class="filter-item" type="primary" @click="subStateBackOffs">
            批量状态回退
          </el-button>
        </div>
        <div class="stu">
          <el-tabs v-model="stulistQuery.activeName" type="card" @tab-click="stuhandleClick">
            <el-tab-pane label="所有" name="first" />
            <el-tab-pane label="待提交作业" name="second" />
            <el-tab-pane label="待批改作业" name="third" />
            <el-tab-pane label="待复评作业" name="fourth" />
            <el-tab-pane label="待回复追问作业" name="Fifth" />
          </el-tabs>
          <el-table
            v-loading="stulistLoading"
            :data="stulist"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @selection-change="selectionChange"
          >
            <el-table-column
              type="selection"
              label="勾选"
              width="55px"
            />
            <el-table-column
              prop="username"
              label="学员账户"
            />
            <el-table-column
              prop="gender"
              label="学员联系方式"
            />
            <el-table-column
              prop="schoolName"
              label="报考院校"
            />
            <el-table-column
              prop="subjectState"
              label="作业状态"
              :formatter="menuTypeFormat"
            />
            <el-table-column
              prop="subTime"
              label="作业提交时间"
            />
            <el-table-column
              prop="auditState"
              label="批改状态"
              :formatter="menuTypeFormat"
            />
            <el-table-column
              prop="teacherName"
              label="批改老师"
            />
            <el-table-column
              prop="audiCompleteTime"
              label="批改时间"
            />
            <el-table-column
              prop="repeatState"
              label="复评状态"
              :formatter="menuTypeFormat"
            />
            <el-table-column
              prop="repeatTime"
              label="复评时间"
            />
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="subStateBackOff(scope.row)">
                  状态回退
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="stutotal>0"
            :total="stutotal"
            :page.sync="stulistQuery.current"
            :limit.sync="stulistQuery.size"
            @pagination="stufetchData"
          />
        </div>
      </div>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="backOffVisible" width="300px" center>
      <div class="del-dialog-cnt">请确认回退吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backOffVisible = false">取 消</el-button>
        <el-button type="primary" @click="backOff==='backOff'?subStateBackOffsSubmit():subStateBackOffsSubmits()">确 定</el-button>
      </span>
    </el-dialog>

    <classTypeClassStudents
      ref="mychild"
      class="bufa"
      :tree-data.sync="treeData"
      :dis.sync="disy"
      :users-data.sync="usersData"
      :list-loading.sync="listloadingh"
      :list-loading1.sync="listloadingh1"
      :submits="submit"
      :total="totalz"
      @getUserList="getUserLists"
    />
  </div>
</template>

<script>
import {
  gethwHomeworkList,
  updatehwHomeworkOne,
  deletehwHomework,
  deletehwHomeworks,
  releases,
  getHwStuHomeworkPageList,
  updateEntrust,
  sendMsg,
  addHwStuHomeworkOtherAdd,
  updateHwHomeworkSubjectStateByHomework,
  cancelalls,
  hwStuHomeworkReset
} from '@/api/homework/hwHomework'
import { getHwSubjectTypeList } from '@/api/homework/subjectType'
import { getListEntrust } from '@/api/homework/teacher'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import classTypeClassStudents from '@/views/homework/classTypeClassStudents'
import { getHwClassTypeByHomeworkId, getHwClassTypeRelatedByHomeworkId } from '@/api/homework/hwClassType'
import {
  hwStudentTypePageList,
  hwStudentTypeRelatedPageList
} from '@/api/homework/student'

// 让data数据在创建阶段透传到全局变量
export default {
  name: 'UserMgn',
  components: {
    Pagination,
    classTypeClassStudents
  },
  directives: { waves },
  data() {
    return {
      selection: [],
      backOffVisible: false,
      backOffRow: undefined,
      backOff: 'backOff',
      totalz: 0,
      listloadingh: false,
      listloadingh1: false,
      row: {},
      usersData: [],
      disy: false,
      treeData: [],
      rules: {
        teacherId: [{ required: true, message: '请选择委托老师', trigger: 'blur' }],
        entrustStartTime: [{ required: true, message: '请输入委托开始时间', trigger: 'blur' }],
        entrustEndTime: [{ required: true, message: '请输入委托截止时间', trigger: 'blur' }]
      },
      temp: {
        teacherId: undefined,
        entrustStartTime: undefined,
        entrustEndTime: undefined
      },
      options: [],
      repeatStates: [],
      auditStates: [],
      gen: false,
      stuVisible: false,
      wtVisible: false,
      icongenduo: 'el-icon-arrow-up',
      subjectStates: [],
      isQas: [],
      statuss: [], // 状态
      statusQueryParam: {},
      subjectTypes: [],
      subjectTypeIds: {},
      delVisible: false,
      unpublish: false,
      unpublishAll: false,
      rowrows: [],
      multipleSelection: [],
      idListAll: [],
      list: null,
      stulist: null,
      listLoading: true,
      stulistLoading: true,
      classsxz: [],
      total: 0,
      stutotal: 0,
      deleteor: 'delete',
      classs: [],
      listQuery: {
        current: 1,
        subjectName: undefined,
        startTime: undefined,
        endTime: undefined,
        auditEndTime: undefined,
        auditStartTime: undefined,
        completeExplain: undefined,
        classTypeName: undefined,
        className: undefined,
        subjectTypeId: undefined,
        groupName: undefined
      },
      stulistQuery: {
        current: 1,
        username: undefined,
        activeName: 'first',
        id: undefined
      },
      usernameDisabled: false
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '330px'
      }
    }
  },
  created() {
    this.statuss = getDictDataList('hw_class_type_status')
    this.subjectStates = getDictDataList('hw_homework_status')
    this.auditStates = getDictDataList('hw_homework_submit_status')
    this.repeatStates = getDictDataList('hw_homework_reaudit_status')
    this.isQas = getDictDataList('sys_yes_no')
    getHwSubjectTypeList().then(res => {
      if (res.success) {
        this.subjectTypes = res.data
      }
    })
    this.fetchData()
  },
  methods: {
    subStateBackOff(row) {
      // 回退单条数据
      this.backOff = 'backOff'
      this.backOffVisible = true
      this.backOffRow = row
    },
    subStateBackOffs() {
      // 批量回退数据
      if (!this.selection || this.selection.length < 1) {
        this.$message.error('请选择一条或多条数据!')
      } else {
        this.backOff = 'backOffs'
        this.backOffVisible = true
      }
    },
    subStateBackOffsSubmit() {
      // 单个回退状态提交
      const arrnew = [this.backOffRow.id]
      this.sub(arrnew)
    },
    subStateBackOffsSubmits() {
      // 批量回退提交
      const arrnew = this.selection.map(item => {
        return item.id
      })
      this.sub(arrnew)
    },
    sub(val) {
      hwStuHomeworkReset(val).then(res => {
        if (res.success) {
          this.backOffVisible = false
          this.selection = []
          this.stufetchData()
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
    selectionChange(val) {
      this.selection = val
    },
    load(text, lock) {
      const loading = this.$loading({
        lock: true,
        text: text,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    },
    cancelall() {
      this.unpublishAll = false
      const that = this
      try {
        const loading = this.load('正在批量取消发布...', true)
        // 发送批量取消请求
        cancelalls(this.idListAll).then(res => {
          if (res.data) {
            this.fetchData()
            loading.setText('批量取消发布成功')
          } else {
            loading.setText('批量取消发布失败')
          }
          setTimeout(() => {
            loading.close()
          }, 1000)
        })
      } catch (e) {
        that.$message.error(e.message)
      }
    },
    unpublishAllYesOrNo() {
      const that = this
      this.idListAll = []
      if (this.multipleSelection.length < 1) {
        this.$message.error('请先选择要取消发布的作业！')
        return false
      } else {
        try {
          const idList = []
          let tishi = ''
          this.multipleSelection.forEach(function(a, b) {
            if (a.groupHomeworkId) {
              tishi = tishi + a.subjectName + '、'
            }
            if (a.subjectState === '0' && !a.groupHomeworkId) {
              throw new Error('请先发布作业(' + a.subjectName + ')！')
            }
            idList.push(a.id)
          })
          if (tishi !== '') {
            tishi = tishi.substring(0, tishi.length - 1)
            this.$message.error(tishi + '作业包含作业组，请到作业组进行取消发布！')
            return false
          }
          that.idListAll = idList
          that.unpublishAll = true
        } catch (e) {
          that.$message.error(e.message)
        }
      }
    },
    unpublishYesOrNo(row) {
      if (row.groupHomeworkId) {
        this.$message.error(row.subjectName + '作业包含作业组，请到作业组进行取消发布！')
        return false
      }
      this.unpublish = true
      this.cancelRow = {}
      this.cancelRow = row
    },
    cancel() {
      this.unpublish = false
      // 取消发布
      const row = this.cancelRow
      const loading = this.load('正在取消发布', true)
      updateHwHomeworkSubjectStateByHomework(row.id).then(res => {
        if (res.data) {
          this.fetchData()
          loading.setText('取消发布成')
        } else {
          loading.setText('取消发失败')
        }
        setTimeout(() => {
          loading.close()
        }, 1000)
      })
    },
    submit(values) {
      // 补发作业
      const data = { homeworkId: this.row.id }
      const listStuIds = []
      values.forEach(function(a, b) {
        listStuIds.push(a.id)
      })
      data['listStuIds'] = listStuIds
      addHwStuHomeworkOtherAdd(data).then(res => {
        if (res.data) {
          this.$notify({
            title: '成功',
            message: '补发作业成功！',
            type: 'success',
            duration: 2000
          })
          this.getTreeData(this.row)
        } else {
          this.$notify({
            title: '失败',
            message: '补发作业失败！',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    getUserLists(listQuery) {
      listQuery.homeworkId = this.row.id
      if (this.row.relatedHomeworkId) {
        hwStudentTypeRelatedPageList(listQuery).then(response => {
          this.usersData = response.data.records
          this.listLoadingh = true
          this.totalz = parseInt(response.data.total)
        })
      } else {
        hwStudentTypePageList(listQuery).then(response => {
          this.usersData = response.data.records
          this.listLoadingh = true
          this.totalz = parseInt(response.data.total)
        })
      }
    },
    getTreeData(row) {
      if (row.subjectState === '0') {
        this.$message.error('请先发布作业XX（' + row.subjectName + '）！')
        return false
      }
      this.$refs.mychild.cleanss()
      const that = this
      this.row = row
      if (row.relatedHomeworkId) {
        getHwClassTypeRelatedByHomeworkId(row.id).then(response => {
          that.treeData = response.data
          if (that.treeData.length > 0) {
            hwStudentTypeRelatedPageList({ homeworkId: row.id, classTypeId: that.treeData[0].id }).then(res => {
              that.usersData = res.data.records
              this.totalz = parseInt(res.data.total)
            })
          }
          that.listLoadingh = true
          that.listLoading1h = true
          that.disy = true
        })
      } else {
        getHwClassTypeByHomeworkId(row.id).then(response => {
          that.treeData = response.data
          if (that.treeData.length > 0) {
            hwStudentTypePageList({ homeworkId: row.id, classTypeId: that.treeData[0].id }).then(res => {
              that.usersData = res.data.records
              this.totalz = parseInt(res.data.total)
            })
          }
          that.listLoadingh = true
          that.listLoading1h = true
          that.disy = true
        })
      }
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
    xueyuan(row) {
      return row.stu + '/' + row.ytj + '/' + row.ypg + '/' + row.yfp
    },
    resetListQuery() {
      this.listQuery.subjectName = undefined
      this.listQuery.startTime = undefined
      this.listQuery.endTime = undefined
      this.listQuery.auditEndTime = undefined
      this.listQuery.auditStartTime = undefined
      this.listQuery.completeExplain = undefined
      this.listQuery.className = undefined
      this.listQuery.classTypeName = undefined
      this.listQuery.subjectTypeId = undefined
      this.listQuery.groupName = undefined
      this.fetchData()
    },
    releasesAll() {
      if (this.multipleSelection.length < 1) {
        this.$message('请勾选要发布的项！')
      } else {
        let tishi = ''
        this.multipleSelection.forEach(function(a, b) {
          if (a.groupHomeworkId) {
            tishi = tishi + a.subjectName + '、'
          }
        })
        if (tishi !== '') {
          tishi = tishi.substring(0, tishi.length - 1)
          this.$message.error(tishi + '作业包含作业组，请到作业组进行发布！')
          return false
        }
        const loading = this.load('正在批量发布...', true)
        releases(this.multipleSelection).then(response => {
          if (response.success) {
            this.fetchData()
            loading.setText('批量发布成功')
          } else {
            loading.setText('批量发布失败')
          }
          setTimeout(() => {
            loading.close()
          }, 1000)
        })
      }
    },
    fetchData() {
      this.listLoading = true
      gethwHomeworkList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    stufetchData() {
      this.stulistLoading = true
      getHwStuHomeworkPageList(this.stulistQuery).then(response => {
        this.stulist = response.data.records
        this.stutotal = parseInt(response.data.total)
        this.stulistLoading = false
      })
    },
    stuhandleClick() {
      this.stufetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    stuhandleFilter() {
      this.stulistQuery.page = 1
      this.stufetchData()
    },
    updateData() {
      updateEntrust(this.temp).then(response => {
        this.wtVisible = false
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete() {
      this.temp = Object.assign({}, this.rowr) // copy obj
      deletehwHomework(this.temp.id).then(() => {
        this.fetchData()
        this.delVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    tableDeleteRow(row, or) {
      if (row.groupHomeworkId) {
        this.$message.error(row.subjectName + '作业包含作业组，请到作业组进行删除！')
        return false
      }
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
    handleDeletes() {
      const length = this.multipleSelection.length
      const delarr = []
      for (let i = 0; i < length; i++) {
        delarr.push(this.multipleSelection[i].id)
      }
      deletehwHomeworks(delarr).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功！',
          type: 'success',
          duration: 2000
        })
        this.delVisible = false
      })
    },
    resetTemp() {
      this.temp = {
        subjectName: undefined, // 题目名称
        startTime: undefined, // 开始时间
        endTime: undefined, // 结束时间
        auditEndTime: undefined, // 批改时间
        classTypeName: undefined, // 班级标签名称
        classTypeId: undefined, // 班级标签id
        classId: undefined,
        className: undefined,
        subjectTypeId: undefined, // 题目类型id
        subjectTypeName: undefined, // 题型名称
        completeExplain: undefined,
        isQa: undefined, // 启用追问
        qaNumber: undefined, // 追问次数
        isRemind: undefined, // 启用系统提醒
        sysCycle: undefined, // 系统提醒周期
        isWxremind: undefined, // 是否微信提醒
        wxremindTime1: undefined, // 微信提醒时间1
        wxremindTime2: undefined,
        isMsg: undefined, // 是否短信提醒
        msgTime1: undefined, // 短信提醒时间
        msgTime2: undefined
      }
      this.classsxz = []
      this.classTypes = []
    },
    handleCreate() {
      this.$router.push({
        path: '/system/homework/addHwHomework'
      })
    },
    handleUpdate(row, pd) {
      this.$router.push({
        path: '/system/homework/addHwHomework',
        query: {
          row: row,
          pd: pd
        }
      })
    },
    sendMsg(row) {
      if (row.stu < 1) {
        this.$notify({
          title: '失败',
          message: '作业中无学员',
          type: 'error',
          duration: 2000
        })
        return false
      }
      sendMsg(row).then(res => {
        if (res.data) {
          this.$notify({
            title: '成功',
            message: '通知下发成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '通知下发失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    xueyuans(row) {
      this.stulistQuery.id = row.id
      this.stulistQuery.activeName = 'first'
      this.stufetchData()
      this.stuVisible = true
    },
    weituo(row) {
      this.temp.id = row.id
      this.temp.teacherId = row.teacherId
      this.temp.entrustStartTime = row.entrustStartTime
      this.temp.entrustEndTime = row.entrustEndTime
      getListEntrust({}).then(response => {
        this.options = response.data
      })
      this.wtVisible = true
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
    }, deleteRow(row, or) {
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        if (this.multipleSelection.length < 1) {
          this.$message('请勾选要删除的项！')
        } else {
          let tishi = ''
          this.multipleSelection.forEach(function(a, b) {
            if (a.groupHomeworkId) {
              tishi = tishi + a.subjectName + '、'
            }
          })
          if (tishi !== '') {
            tishi = tishi.substring(0, tishi.length - 1)
            this.$message.error(tishi + '作业包含作业组，请到作业组进行删除！')
            return false
          }
          const length = this.multipleSelection.length
          this.delarr = []
          for (let i = 0; i < length; i++) {
            this.delarr.push(this.multipleSelection[i].id)
          }
          this.delVisible = true
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    updateStatus(row) {
      if (row.groupHomeworkId) {
        this.$message.error(row.subjectName + '作业包含作业组，请到作业组进行发布！')
        return false
      }
      const loading = this.load('正在发布...', true)
      row.subjectState = '1'
      updatehwHomeworkOne(row.id).then(response => {
        if (response.success) {
          this.fetchData()
          loading.setText('发布成功')
        } else {
          loading.setText('发布失败')
        }
        setTimeout(() => {
          loading.close()
        }, 1000)
      })
    }
  }
}
</script>
<style>
  .el-upload-list {
    height: 70px;
    overflow: auto;
  }

  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .stu {
    height: 600px;
    overflow: auto;
  }

  .stu-container {
    margin: 10px 20px 10px 20px;
  }

  .el-dialog__header {
    padding: 20px 20px;
  }

  .el-dialog__footer {
    padding-right: 40px;
  }

  .el-tooltip__popper {
    width: 400px;
  }

  .extra {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /deep/ .bufa .el-row{
    height: 100%;
  }

.bufa .el-row{
    height: 90%;
  }

 .bufa .el-col{
    height: 100%;
    overflow-y: auto;
  }
</style>
