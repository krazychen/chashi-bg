<template>
  <div class="app-container">
    <el-row :gutter="40">
      <el-col :span="12">
        <div class="filter-container">
          <el-input
            v-model="listQuery.schoolCode"
            placeholder="请输入学校代码"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-input
            v-model="listQuery.schoolName"
            placeholder="请输入学校名称"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetFilter">
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
          <el-dropdown class="filter-item" trigger="click" placement="top">
            <el-button type="primary" class="el-dropdown-link">
              更多
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="deleteRow('','deletes')">
                  删除
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="importFileSchool">
                  导入
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-table
          v-loading="listLoading"
          :data="tableData"
          highlight-current-row
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          @row-click="relation"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            label="勾选"
            width="55"
          />
          <el-table-column
            prop="schoolName"
            label="学校名称"
            width="200"
            fixed
          />
          <el-table-column
            prop="schoolCode"
            label="学校代码"
            width="100"
            fixed
          />
          <el-table-column
            prop="schoolInfo"
            label="学校介绍"
            width="200"
          />
          <el-table-column
            prop="address"
            label="学校地址"
            width="250"
          />
          <el-table-column
            prop="remarks"
            label="备注"
            width="200"
          />
          <el-table-column width="130px" label="操作">
            <template slot-scope="scope">
              <i
                class="el-icon-edit"
                style="color: #67C23A;margin-left:10px;"
                title="编辑"
                tooltip="true"
                type="primary"
                @click="handleUpdate(scope.row)"
              />
              <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:10px;" @click="deleteRow(scope.row,'delete')" />
              <!--
                <i class="fa fa-chevron-circle-right" title="专业管理" tooltip="true" style="color: #409EFF;margin-left:10px;" @click="relation(scope.row)" />
-->
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

      </el-col>
      <!--      <el-col :span="">
        <div class="verticalBar" />
      </el-col>-->
      <el-col :span="12">
        <div class="filter-container">
          <div class="filter-item">
            <el-tooltip class="item" effect="dark" :content="'（'+ schoolCode +'）'+ schoolName" placement="top">
              <el-tag size="medium" class="tagclass">（{{ schoolCode }}）{{ schoolName }}</el-tag>
            </el-tooltip>
          </div>
          <el-input
            v-model="listQueryCollege.collegeCode"
            placeholder="请输入专业代码"
            style="width: 150px;"
            class="filter-item"
            size="small"
            @keyup.enter.native="collegeHandleFilter"
          />
          <el-input
            v-model="listQueryCollege.collegeName"
            placeholder="请输入专业名称"
            style="width: 150px;"
            class="filter-item"
            size="small"
            @keyup.enter.native="collegeHandleFilter"
          />
          <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="collegeHandleFilter">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-refresh" @click="collegeResetFilter">
            重置
          </el-button>

          <el-dropdown class="filter-item" trigger="click" placement="top">
            <el-button type="primary" class="el-dropdown-link">
              更多
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button
                  class="filter-item"
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="handleCreateCollage"
                >
                  新增
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="collegeDeleteRow('','deletes')">
                  删除
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-thumb" @click="examinationScopeAll">
                  考试范围
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-table
          v-loading="listLoadingCollege"
          :data="tableDataCollege"
          style="width: 100%;margin-bottom: 20px;"
          highlight-current-row
          border
          @selection-change="handleSelectionChangeCollege"
        >
          <el-table-column
            type="selection"
            label="勾选"
            width="55"
          />
          <el-table-column label="院系所" width="200" fixed>
            <template slot-scope="scope">
              ({{ scope.row.facultyDepartmentCode }}){{ scope.row.facultyDepartmentName }}
            </template>
          </el-table-column>
          <el-table-column label="专业" width="300" fixed>
            <template slot-scope="scope">
              ({{ scope.row.collegeCode }}){{ scope.row.collegeName }}
            </template>
          </el-table-column>
          <el-table-column label="研究方向" width="260">
            <template slot-scope="scope">
              ({{ scope.row.researchDirectionCode }}){{ scope.row.researchDirectionName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="学习方式" width="80">
            <template slot-scope="scope">
              {{ scope.row.studyMethodName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="考试方式" width="80">
            <template slot-scope="scope">
              {{ scope.row.examMethodName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="专业介绍" width="150">
            <template slot-scope="scope">
              {{ scope.row.collegeInfo }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              {{ scope.row.remarks }}
            </template>
          </el-table-column>
          <el-table-column width="130px" label="操作">
            <template slot-scope="scope">
              <i
                class="el-icon-edit"
                style="color: #67C23A;margin-left:10px;"
                title="编辑"
                tooltip="true"
                type="primary"
                @click="collegeHandleUpdate(scope.row)"
              />
              <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:10px;" @click="collegeDeleteRow(scope.row,'delete')" />
              <i class="el-icon-thumb" title="考试范围" tooltip="true" style="color: #21f52f;margin-left:10px;" @click="examinationScope(scope.row)" />
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="totalCollege>0"
          :total="totalCollege"
          :page.sync="listQueryCollege.current"
          :limit.sync="listQueryCollege.size"
          @pagination="collegeHandFetchData"
        />
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="490px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="学校代码" prop="schoolCode">
          <el-input v-model="temp.schoolCode" placeholder="请输入学校代码" :disabled="usernameDisabled" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="学校名称" prop="schoolName">
          <el-input
            v-model="temp.schoolName"
            placeholder="请输入学校名称"
            :style="selectwidthz"
            @input="lengthUtil(temp.schoolName,7,'areaName')"
          />
        </el-form-item>
        <el-form-item label="学校介绍" prop="schoolInfo">
          <el-input v-model="temp.schoolInfo" placeholder="请输入学校介绍" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="学校省" prop="provinceCode">
          <el-select v-model="temp.provinceName" class="filter-item" placeholder="请选择所属省份" :style="selectwidthz" @change="_selectChange1">
            <el-option v-for="item in provinceCodes" :key="item.id" :label="item.label" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="cityCode">
          <el-select v-model="temp.cityName" class="filter-item" placeholder="请选择所属市区" :style="selectwidthz" @change="_selectChange2">
            <el-option v-for="item in cityCodes" :key="item.id" :label="item.label" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="区县" prop="districtCode">
          <el-select v-model="temp.districtName" class="filter-item" placeholder="请选择所属区县" :style="selectwidthz" @change="_selectChange3">
            <el-option v-for="item in districtCodes" :key="item.id" :label="item.label" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="学校地址" prop="address">
          <el-input v-model="temp.address" placeholder="请输入学校地址" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remarks" type="textarea" placeholder="请输入备注" :style="selectwidthz" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatusCollege]" :visible.sync="dialogFormVisibleCollege" width="490px">
      <el-form ref="dataFormCollege" :rules="rulesCollege" :model="tempCollege" label-position="left" label-width="120px">
        <el-form-item label="院系代码" prop="facultyDepartmentCode">
          <el-input v-model="tempCollege.facultyDepartmentCode" placeholder="请输入院系代码" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="院系名称" prop="facultyDepartmentName">
          <el-input v-model="tempCollege.facultyDepartmentName" placeholder="请输入院系名称" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="专业代码" prop="collegeCode">
          <el-input v-model="tempCollege.collegeCode" placeholder="请输入专业代码" :disabled="collegeDisabled" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="专业名称" prop="collegeName">
          <el-input
            v-model="tempCollege.collegeName"
            placeholder="请输入专业名称"
            :style="selectwidthz"
            @input="lengthUtil(tempCollege.collegeName,7,'collegeName')"
          />
        </el-form-item>
        <el-form-item label="专业方向代码" prop="researchDirectionCode">
          <el-input v-model="tempCollege.researchDirectionCode" placeholder="请输入专业方向代码" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="专业方向名称" prop="researchDirectionName">
          <el-input v-model="tempCollege.researchDirectionName" placeholder="请输入专业方向名称" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="考试方式" prop="examMethodName">
          <el-select v-model="tempCollege.examMethod" placeholder="请选择考试方式" :style="selectwidthz" @change="handleExamMethodChange">
            <el-option v-for="item in examMethodCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="学科门类" prop="subjectCategoryName">
          <el-select v-model="tempCollege.subjectCategory" placeholder="请选择学科门类" :style="selectwidthz" @change="handleSubjectCategoryChange">
            <el-option v-for="item in subjectCategoryCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="学习方式" prop="studyMethodName">
          <el-select v-model="tempCollege.studyMethod" placeholder="请选择学习方式" :style="selectwidthz" @change="handleStudyMethodChange">
            <el-option v-for="item in studyMethodCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业门类" prop="degreeTypeName">
          <el-select v-model="tempCollege.degreeType" placeholder="请选择专业门类" :style="selectwidthz" @change="handleDegreeTypeChange">
            <el-option-group
              label="专业学位"
            >
              <el-option v-for="item in academicTypeCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
            </el-option-group>
            <el-option-group
              label="学术学位"
            >
              <el-option v-for="item in degreeTypeCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictLabel" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="专业介绍" prop="collegeInfo">
          <el-input v-model="tempCollege.collegeInfo" placeholder="请输入专业介绍" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tempCollege.remarks" type="textarea" placeholder="请输入备注" :style="selectwidthz" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleCollege = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatusCollege==='create'?createDataCollege():updateDataCollege()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="考试范围" :visible.sync="dialogFormVisibleCollegeExamscope" width="650px">
      <el-table
        ref="dataTable"
        :data="tableData123"
        style="width: 100%"
        @selection-change="handleSelectionChange1"
      >
        <!--<el-table-column
          type="selection"
          width="55"
        />-->
        <el-table-column
          prop="name"
          label=""
        />
        <el-table-column
          prop="xh"
          label="序号"
        />
        <el-table-column
          prop="kmdm"
          label="科目代码"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row[scope.column.property]" />
          </template>
        </el-table-column>
        <el-table-column
          prop="kmmc"
          width="200px"
          label="科目名称"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row[scope.column.property]" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bz"
          label="备注"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row[scope.column.property]" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleCollegeExamscope = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatusCollegeExamscope==='one'?updateDataCollegeExamscope():addDataCollegeExamscopeAll()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">请确认是否删除数据！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisibleCollege" width="300px" center>
      <div class="del-dialog-cnt">请确认是否删除数据！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteorCollege==='delete'?handleDeleteCollege():handleDeleteColleges()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="导入文件" :visible.sync="uploadVisibleSchool">
      <a href="javascript:;" class="file">
        <input id="upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="importFile(this)">
      </a>
      <button id="submitRelease" class="btn sbold green" @click="downloadTemplate">
        <span class="ladda-label">下载模板</span>
      </button>
      <br>
      <span style="color: red;position:relative; top: 25px;">提示：仅允许导入.xls和.xlsx的格式文件</span>
      <div id="demo" />
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="uploadVisibleSchool = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click.native="submitUpload()">提交</el-button>
      </div>
    </el-dialog>

    <!-- 删除提示框 -->
    <!--    <el-dialog title="提示" :visible.sync="uploadVisibleSchool" width="300px" center>
      <el-upload
        class="upload-demo"
        :action="doUploadSchool"
        :headers="myHeaders"
        :on-success="handleAvatarSuccessSchool"
        :on-error="handleAvatarErrorSchool"
        :multiple="false"
        :limit="1"
        accept=".XLS,.XLSX,.xls,.xlsx"
        :file-list="fileListSchool"
      >
        <el-button size="small" type="primary">点击导入</el-button>
        <div slot="tip" class="el-upload__tip">只能导入XLS/XLSX文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>-->

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  createSysSchool,
  getSysSchoolList,
  updateSysSchool,
  deleteSysSchool,
  deleteSysSchools,
  checkSchoolCodeValid,
  importData
} from '@/api/system/sysSchool.js'

import {
  createSysSchoolCollege,
  getSysSchoolCollegeList,
  updateSysSchoolCollege,
  deleteSysSchoolCollege,
  deleteSysSchoolColleges,
  getSysSchoolCollegeExamscope,
  updateSysSchoolCollegeExamscope,
  getCollegeExamscope,
  updateSysSchoolCollegeExamscopeAll
} from '@/api/system/sysSchoolCollege.js'
import { getDictDataList } from '@/utils/dictUtils'
import { getSysAreaRedisSimplifyPageList } from '@/api/system/sysArea.js'
import { getToken } from '@/utils/auth'
export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      addLoading: false,
      schoolCode: '',
      schoolName: '',
      sysCollegeId: '',
      sysCollegeIds: [],
      degreeTypeCodes: [], // 专业门类
      academicTypeCodes: [], // 学术学位
      degreeType: [],
      subjectCategoryCodes: [], // 学科类别
      studyMethodCodes: [], // 学习方式
      examMethodCodes: [], // 考试方式
      collegeRow: {},
      provinceCodes: [],
      cityCodes: [],
      districtCodes: [],
      myHeaders: {},
      /* doUpload: '/sysSchoolCollege/import',*/
      doUploadSchool: '/sysSchool/import',
      /* uploadVisible: false,*/
      uploadVisibleSchool: false,
      dialogStatusCollegeExamscope: '',
      parentTree: [],
      dialogStatus: 'create',
      dialogStatusCollege: 'create',
      total: 0,
      totalCollege: 0,
      delarr: [],
      delarrCollege: [],
      dialogFormVisible: false,
      dialogFormVisibleCollege: false,
      dialogFormVisibleCollegeExamscope: false,
      usernameDisabled: false,
      collegeDisabled: false,
      deleteor: 'delete',
      deleteorCollege: 'delete',
      delVisible: false,
      delVisibleCollege: false,
      listLoading: 'false',
      listLoadingCollege: 'false',
      rowr: {},
      rowrCollege: {},
      tableData: [],
      tableDataCollege: [],
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      statuss: [{ label: '正常', value: '0' }, { label: '删除', value: '1' }, { label: '停用', value: '2' }],
      areaTypes: [{ label: '省份直辖市', value: 'province' }, { label: '地市', value: 'city' }, { label: '区县', value: 'region' }],
      multipleSelection: [],
      multipleSelectionCollege: [],
      listQuery: {
        current: 1,
        schoolName: undefined,
        schoolCode: undefined
      },
      listQueryCollege: {
        current: 1,
        collegeName: undefined,
        collegeCode: undefined,
        schoolId: undefined
      },
      temp: {
        schoolCode: undefined,
        schoolName: undefined,
        schoolInfo: undefined,
        address: undefined,
        provinceCode: undefined,
        provinceName: undefined,
        cityCode: undefined,
        cityName: undefined,
        districtCode: undefined,
        districtName: undefined
      },
      tempCollege: {
        collegeCode: undefined,
        collegeName: undefined,
        collegeInfo: undefined,
        remarks: undefined,
        schoolId: undefined,
        examMethod: undefined,
        examMethodName: undefined,
        studyMethod: undefined,
        studyMethodName: undefined,
        researchDirectionCode: undefined,
        researchDirectionName: undefined,
        facultyDepartmentCode: undefined,
        facultyDepartmentName: undefined,
        subjectCategory: undefined,
        degreeType: undefined
      },
      tempCollegeExamscope: {
        multipleSelection1: [],
        subOneOrdinal: undefined,
        subOneCode: undefined,
        subOneName: undefined,
        subOneRemarks: undefined,
        subTwoOrdinal: undefined,
        subTwoCode: undefined,
        subTwoName: undefined,
        subTwoRemarks: undefined,
        subThreeOrdinal: undefined,
        subThreeCode: undefined,
        subThreeName: undefined,
        subThreeRemarks: undefined,
        subFourOrdinal: undefined,
        subFourCode: undefined,
        subFourName: undefined,
        subFourRemarks: undefined
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      values: '',
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: '请输入内容'
      },
      treeParams: {
        clickParent: true,
        filterable: true,
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        data: [],
        props: {
          children: 'children',
          label: 'label',
          value: 'id'
        }
      },
      rules: {
        schoolCode: [{ required: true, message: '请输入学校代码', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.schoolCodeVerification
        }]
      },
      rulesCollege: {
        facultyDepartmentCode: [{ required: true, message: '请输入院系所代码', trigger: 'blur' }],
        facultyDepartmentName: [{ required: true, message: '请输入院系所名称', trigger: 'blur' }],
        subjectCategoryName: [{ required: true, message: '请选择学科类别', trigger: 'blur' }],
        degreeTypeName: [{ required: true, message: '请选择专业门类', trigger: 'blur' }],
        collegeCode: [{ required: true, message: '请输入专业代码', trigger: 'blur' }],
        collegeName: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
        researchDirectionCode: [{ required: true, message: '请输入研究方向代码', trigger: 'blur' }],
        researchDirectionName: [{ required: true, message: '请输入研究方向名称', trigger: 'blur' }],
        examMethodName: [{ required: true, message: '请选择考试方式', trigger: 'blur' }],
        studyMethodName: [{ required: true, message: '请选择学习方式', trigger: 'blur' }],
        collegeInfo: [{ required: true, message: '请输入专业介绍', trigger: 'blur' }]
      },
      fileList: [],
      fileListSchool: [],
      tableData123: []
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

  },
  created() {
    this.degreeTypeCodes = getDictDataList('scr_degree_type')
    this.academicTypeCodes = getDictDataList('scr_academic_type')
    const academicTypeCodes = this.academicTypeCodes
    const degreeTypeCodes = this.degreeTypeCodes
    this.degreeTypes = [...degreeTypeCodes, ...academicTypeCodes]
    this.subjectCategoryCodes = getDictDataList('scr_subject_category')
    this.studyMethodCodes = getDictDataList('scr_study_method')
    this.examMethodCodes = getDictDataList('scr_exam_method')
    this.fetchData()
  },
  mounted() {
    const token = getToken()
    console.log(token)
    this.myHeaders = { token: token }
  },
  methods: {
    submitUpload() {
      if (this.file === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      this.addLoading = true
      const fileFormData = new FormData()
      fileFormData.append('file', this.files)// filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      console.log(fileFormData)
      importData(fileFormData).then(response => {
        if (response.success && response.data != null && response.data) {
          this.$message.success('导入成功')
          this.uploadVisibleSchool = false
          this.fetchData()
        } else {
          this.$message.error(response.msg)
        }
        this.addLoading = false
      })
    },
    downloadTemplate() {
      window.location.href = 'sysSchool/downloadTemplate/'
    },
    importFile(file) {
      this.file = event.currentTarget.files[0]
      this.files = this.file
      if (this.file.name.indexOf('.xls') === -1 && this.file.name.indexOf('.xlsx') === -1) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!')
        return false
      }
    },
    schoolCodeVerification(rule, value, callback) {
      // 判断是编辑还是新增
      let map = {}
      if (this.dialogStatus === 'update') {
        map = { id: this.schoolIdd, schoolCode: value }
      } else {
        map = { schoolCode: value }
      }
      checkSchoolCodeValid(map).then(res => {
        if (res.data != null && res.data) {
          callback()
        } else {
          callback(new Error('已经存在' + this.temp.schoolCode + '学校代码，请重新输入学校代码！'))
        }
      })
    },
    handleDegreeTypeChange() {
      // debugger
      const degree = this.degreeTypes.find(sc => sc.dictValue === this.tempCollege.degreeType)
      this.tempCollege.degreeTypeName = degree.dictLabel
    },
    handleStudyMethodChange() {
      // debugger
      const study = this.studyMethodCodes.find(sc => sc.dictValue === this.tempCollege.studyMethod)
      this.tempCollege.studyMethodName = study.dictLabel
    },
    handleSubjectCategoryChange() {
      // debugger
      const subject = this.subjectCategoryCodes.find(sc => sc.dictValue === this.tempCollege.subjectCategory)
      this.tempCollege.subjectCategoryName = subject.dictLabel
    },
    handleExamMethodChange() {
      // debugger
      const exam = this.examMethodCodes.find(sc => sc.dictValue === this.tempCollege.examMethod)
      this.tempCollege.examMethodName = exam.dictLabel
    },
    handleAvatarSuccessSchool(res, file) {
      this.uploadVisibleSchool = false
      this.fileListSchool = []
      this.fetchData()
      if (res.data) {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      } else {
        this.$message(res.msg)
      }
    },
    handleAvatarErrorSchool(res, file) {
      this.uploadVisibleSchool = false
      this.fileListSchool = []
      this.$message('导入失败')
    },
    relation(row) {
      this.listQueryCollege.schoolId = row.id
      this.schoolName = row.schoolName
      this.schoolCode = row.schoolCode
      this.collegeHandFetchData()
    },
    importFileSchool() {
      this.uploadVisibleSchool = true
    },
    resetTemp() {
      this.temp = {
        schoolCode: undefined,
        schoolName: undefined, // 树下拉框选中数据
        schoolInfo: undefined,
        address: undefined,
        provinceCode: undefined,
        provinceName: undefined,
        cityCode: undefined,
        cityName: undefined,
        districtCode: undefined,
        districtName: undefined
      }
    },
    collegeResetTemp() {
      this.tempCollege = {
        collegeCode: undefined,
        collegeName: undefined,
        collegeInfo: undefined,
        remarks: undefined,
        schoolId: undefined,
        examMethod: undefined,
        examMethodName: undefined,
        studyMethod: undefined,
        studyMethodName: undefined,
        researchDirectionCode: undefined,
        researchDirectionName: undefined,
        facultyDepartmentCode: undefined,
        facultyDepartmentName: undefined,
        subjectCategory: undefined,
        subjectCategoryName: undefined,
        degreeType: undefined,
        degreeTypeName: undefined
      }
    },
    collegeExamscopeResetTemp() {
      this.tempCollegeExamscope = {
        collegeId: undefined,
        subOneOrdinal: undefined,
        subOneCode: undefined,
        subOneName: undefined,
        subOneRemarks: undefined,
        subTwoOrdinal: undefined,
        subTwoCode: undefined,
        subTwoName: undefined,
        subTwoRemarks: undefined,
        subThreeOrdinal: undefined,
        subThreeCode: undefined,
        subThreeName: undefined,
        subThreeRemarks: undefined,
        subFourOrdinal: undefined,
        subFourCode: undefined,
        subFourName: undefined,
        subFourRemarks: undefined
      }
    },
    hindleChanged(val) {
      this.temp.parentCode = val[0].id
    },
    fetchData() {
      this.listLoading = true
      getSysSchoolList(this.listQuery).then(response => {
        this.tableData = response.data.records
        // debugger
        if (this.tableData !== undefined && this.tableData.length > 0) {
          this.listQueryCollege.schoolId = this.tableData[0].id
          this.schoolName = this.tableData[0].schoolName
          this.schoolCode = this.tableData[0].schoolCode
          this.collegeHandFetchData()
        } else {
          this.listLoadingCollege = false
        }
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    collegeHandFetchData() {
      this.listLoadingCollege = true
      getSysSchoolCollegeList(this.listQueryCollege).then(response => {
        this.tableDataCollege = response.data.records
        this.totalCollege = parseInt(response.data.total)
        this.listLoadingCollege = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSysSchool(this.temp).then(res => {
            // this.list.unshift(this.temp)
            this.fetchData()
            this.dialogFormVisible = false
            if (res.success) {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    createDataCollege() {
      this.$refs['dataFormCollege'].validate((valid) => {
        this.tempCollege.schoolId = this.listQueryCollege.schoolId
        if (valid) {
          createSysSchoolCollege(this.tempCollege).then(() => {
            // this.list.unshift(this.temp)
            this.collegeHandFetchData()
            this.dialogFormVisibleCollege = false
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
          updateSysSchool(tempData).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
            this.schoolIdd = undefined
            if (res.success) {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    updateDataCollege() {
      this.$refs['dataFormCollege'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempCollege)
          updateSysSchoolCollege(tempData).then(() => {
            this.collegeHandFetchData()
            this.dialogFormVisibleCollege = false
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
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    collegeHandleFilter() {
      this.listQueryCollege.page = 1
      this.collegeHandFetchData()
    },
    resetFilter() {
      // 重置        areaName: undefined,
      this.listQuery.schoolName = undefined
      this.listQuery.schoolCode = undefined
      this.handleFilter()
    },
    collegeResetFilter() {
      // 重置        areaName: undefined,
      this.listQueryCollege.collegeName = undefined
      this.listQueryCollege.collegeCode = undefined
      this.collegeHandleFilter()
    },
    handleCreate(row) {
      this.schoolIdd = undefined
      this.resetTemp()
      this.usernameDisabled = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getArea()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateCollage(row) {
      this.collegeResetTemp()
      this.collegeDisabled = false
      this.dialogStatusCollege = 'create'
      this.dialogFormVisibleCollege = true
      this.$nextTick(() => {
        this.$refs['dataFormCollege'].clearValidate()
      })
    },
    examinationScope(row) {
      this.dialogFormVisibleCollegeExamscope = true
      this.sysCollegeId = row.id
      this.dialogStatusCollegeExamscope = 'one'
      getSysSchoolCollegeExamscope(row.id).then(response => {
        this.tableData123 = response.data
        this.$nextTick(() => {
          this.tableData123.forEach(row => {
            this.$refs.dataTable.toggleRowSelection(row, true)
          })
        })
      })
    },
    updateDataCollegeExamscope() {
      console.log(this.multipleSelection1)
      const param = {}
      param.examscopeList = this.multipleSelection1
      param.sysCollegeId = this.sysCollegeId
      updateSysSchoolCollegeExamscope(param).then(() => {
        this.sysCollegeId = ''
        this.fetchData()
        this.dialogFormVisibleCollegeExamscope = false
        this.$notify({
          title: '成功',
          message: '考试范围保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    examinationScopeAll() {
      let length = 0
      if (this.multipleSelectionCollege === undefined) {
        this.multipleSelectionCollege = []
      }
      length = this.multipleSelectionCollege.length
      if (length < 1) {
        this.$message({
          message: '请选择一条或多条数据！',
          type: 'warning'
        })
        return false
      }
      this.sysCollegeIds = []
      for (let i = 0; i < length; i++) {
        this.sysCollegeIds.push(this.multipleSelectionCollege[i].id)
      }
      console.log(this.sysCollegeIds)
      this.dialogFormVisibleCollegeExamscope = true
      this.dialogStatusCollegeExamscope = 'all'
      getCollegeExamscope().then(response => {
        this.tableData123 = response.data
        this.$nextTick(() => {
          this.tableData123.forEach(row => {
            this.$refs.dataTable.toggleRowSelection(row, true)
          })
        })
      })
    },
    addDataCollegeExamscopeAll() {
      console.log(this.multipleSelection1)
      const param = {}
      param.examscopeList = this.multipleSelection1
      param.sysCollegeIds = this.sysCollegeIds
      updateSysSchoolCollegeExamscopeAll(param).then(() => {
        this.sysCollegeIds = []
        this.collegeHandFetchData()
        this.dialogFormVisibleCollegeExamscope = false
        this.$notify({
          title: '成功',
          message: '考试范围保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    getArea() {
      getSysAreaRedisSimplifyPageList({}).then(response => {
        this.provinceCodes = response.data
        for (let i = 0; i < this.provinceCodes.length; i++) {
          if (this.provinceCodes[i].id === this.temp.provinceCode) {
            if (this.provinceCodes[i].children !== undefined && this.provinceCodes[i].children.length > 0) {
              this.cityCodes = this.provinceCodes[i].children
              for (let j = 0; j < this.provinceCodes[i].children.length; j++) {
                if (this.provinceCodes[i].children[j].id === this.temp.cityCode) {
                  this.districtCodes = this.provinceCodes[i].children[j].children
                  return
                }
                return
              }
            }
          }
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.schoolIdd = row.id
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.getArea()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    collegeHandleUpdate(row) {
      this.tempCollege = Object.assign({}, row) // copy obj
      this.dialogStatusCollege = 'update'
      this.dialogFormVisibleCollege = true
      this.collegeDisabled = true
      this.$nextTick(() => {
        this.$refs['dataFormCollege'].clearValidate()
      })
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleDelete() {
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteSysSchool(this.temp.id).then(() => {
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
    handleDeleteCollege() {
      this.tempCollege = Object.assign({}, this.rowrCollege) // copy obj
      deleteSysSchoolCollege(this.tempCollege.id).then(() => {
        this.collegeHandFetchData()
        this.delVisibleCollege = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDeletes() {
      deleteSysSchools(this.delarr).then(() => {
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
    handleDeleteColleges() {
      deleteSysSchoolColleges(this.delarrCollege).then(() => {
        this.collegeHandFetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功！',
          type: 'success',
          duration: 2000
        })
        this.delVisibleCollege = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChangeCollege(val) {
      this.multipleSelectionCollege = val
    },
    deleteRow(row, or) {
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        if (this.multipleSelection.length < 1) {
          this.$message('请勾选要删除的项！')
        } else {
          const length = this.multipleSelection.length
          this.delarr = []
          for (let i = 0; i < length; i++) {
            if (this.multipleSelection[i].children !== undefined && this.multipleSelection[i].children.length > 0) {
              this.$message('选中当前节点有子节点,请重新选择！')
              return false
            }
            this.delarr.push(this.multipleSelection[i].id)
          }
          this.delVisible = true
        }
      }
    },
    collegeDeleteRow(row, or) {
      this.deleteorCollege = or
      if (this.deleteorCollege === 'delete') {
        this.rowrCollege = row
        this.delVisibleCollege = true
      } else {
        if (this.multipleSelectionCollege.length < 1) {
          this.$message('请勾选要删除的项！')
        } else {
          const length = this.multipleSelectionCollege.length
          this.delarrCollege = []
          for (let i = 0; i < length; i++) {
            if (this.multipleSelectionCollege[i].children !== undefined && this.multipleSelectionCollege[i].children.length > 0) {
              this.$message('选中当前节点有子节点,请重新选择！')
              return false
            }
            this.delarrCollege.push(this.multipleSelectionCollege[i].id)
          }
          this.delVisibleCollege = true
        }
      }
    },
    lengthUtil(value, len, va) {
      if (value === '') {
        this.temp[va] = value
        return
      }
      const vals = value.replace(/\s/g, '')
      this.temp[va] = vals
      if (vals.length > len) {
        this.temp[va] = vals.slice(0, len)
      }
    },
    // 树点击
    _nodeClickFun(data, node, vm) {
      console.log('this _nodeClickFun', this.values, data, node)
    },
    _selectChange1(val) {
      this.temp.cityCode = ''
      this.temp.cityName = ''
      this.temp.districtCode = ''
      this.temp.districtName = ''
      this.temp.provinceCode = val.id
      this.temp.provinceName = val.label
      this.cityCodes = val.children
    },
    _selectChange2(val) {
      this.temp.districtCode = ''
      this.temp.districtName = ''
      this.temp.cityCode = val.id
      this.temp.cityName = val.label
      this.districtCodes = val.children
    },
    _selectChange3(val) {
      this.temp.districtCode = val.id
      this.temp.districtName = val.label
      console.log(this.temp.districtName)
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val
    },
    _searchFun(value) {
      console.log(value, '<--_searchFun')
      // 自行判断 是走后台查询，还是前端过滤
      // this.$refs.treeSelect.$refs.tree.filter(value);
      this.$refs.treeSelect.filterFun(value)
      // 后台查询
      // this.$refs.treeSelect.treeDataUpdateFun(treeData);
    },
    // 自定义render
    _renderFun(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
        </span>
      )
    }
  }
}
</script>

<style scoped>
  .verticalBar {
    width: 2px;
    height: 965px;
    background: #999999;
    display: inline-block;
    vertical-align: top;
    margin-left: 63px;
  }
  .tagclass{
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 10px;
  }
</style>
