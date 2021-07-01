<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.nickname" placeholder="昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" placeholder="手机" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.wxOpenid" placeholder="微信" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.roleName" placeholder="角色名称" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in roleSelectList" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>

      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>

      <el-input v-model="listQuery.className" placeholder="班级" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="exportList">
        导出
      </el-button>
      <el-dropdown class="filter-item" trigger="click" placement="top">
        <el-button type="primary" class="el-dropdown-link">
          更多
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-scissors" @click="tableNoWxs()">
              解绑微信
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="tableDeleteRow('','deletes')">
              删除
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-success" @click="updateStatus(1)">
              启用
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-remove" @click="updateStatus(0)">
              停用
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="importFile">
              导入
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleUpdatePassWord">
              设置密码
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="assignJobNumbers">
              分配工号
            </el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
        width="55px"
      />
      <el-table-column align="center" label="用户" width="150">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="150">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="手机" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wxOpenid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleNames }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip
            v-model="scope.row.showTooltip"
            placement="top"
            :open-delay="200"
            effect="dark"
            :disabled="!scope.row.showTooltip"
          >
            <div slot="content">{{ scope.row.classNames }}</div>
            <div class="class-name" @mouseenter="showTips($event,scope.row)" @mouseleave="showTipsReset($event,scope.row)">{{ scope.row.classNames }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="工号" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否工作" width="100" align="center" prop="isWorks" :formatter="formats" />
      <el-table-column label="工作单位" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.workplace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:10px;" type="primary" @click="handleUpdate(scope.row)" />
          <span v-if="scope.row.status == 1">
            <i class=" el-icon-remove" title="禁用" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="updateState(scope.row)" />
          </span>
          <span v-if="scope.row.status == 0">
            <i class=" el-icon-success" title="启用" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="updateState(scope.row)" />
          </span>
          <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="tableDeleteRow(scope.row,'delete')" />
          <i class="el-icon-arrow-right" title="分配角色" tooltip="true" style="color: #409EFF;margin-left:10px;" @click="assignRoles(scope.row)" />
          <span style="color: #409EFF;margin-left:10px;cursor:pointer" @click="getTeacherRoleList(scope.row)">
            题型设置
          </span>
          <span style="color: #409EFF;margin-left:10px;cursor:pointer" @click="getTeacherClassRoleList(scope.row)">
            班级设置
          </span>
          <i v-if="!scope.row.jobNumber" class="el-icon-plus" title="添加工号" tooltip="true" style="color: #409EFF;margin-left:10px;" @click="addJobNumber(scope.row.id)" />
          <i v-if="scope.row.wxOpenid" class="el-icon-scissors" title="解绑微信" tooltip="true" style="color: #409EFF;margin-left:15px;" @click="updateWx(scope)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="570px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="请输入用户名" :disabled="usernameDisabled" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname" placeholder="请输入昵称" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入手机号" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentType">
          <el-select v-model="temp.departmentType" class="filter-item" placeholder="请选择所部门" :style="selectwidthz">
            <el-option v-for="item in departmentTypes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="temp.fullName" placeholder="真实姓名" :style="selectwidthz" />
        </el-form-item>

        <el-form-item label="微信号">
          <el-input v-model="temp.wechatNumber" placeholder="微信号" :style="selectwidthz" />
        </el-form-item>

        <el-form-item label="本科院校">
          <el-input v-model="temp.schoolName" placeholder="本科院校" :style="selectwidthz" />
        </el-form-item>

        <el-form-item label="本科专业">
          <el-input v-model="temp.collegeName" placeholder="本科专业" :style="selectwidthz" />
        </el-form-item>

        <el-form-item label="研究生院校">
          <el-input v-model="temp.graduateSchoolName" placeholder="研究生院校" :style="selectwidthz" />
        </el-form-item>

        <el-form-item label="研究生入学时间">
          <el-date-picker
            v-model="temp.graduateEntranceTime"
            type="month"
            placeholder="研究生入学时间"
            style="width: 250px"
            value-format="yyyy-MM"
          />
        </el-form-item>

        <el-form-item label="研究生预计毕业时间">
          <el-date-picker
            v-model="temp.graduationTime"
            type="month"
            style="width: 250px"
            value-format="yyyy-MM"
            placeholder="研究生预计毕业时间"
          />
        </el-form-item>

        <el-form-item label="身份证号">
          <el-input v-model="temp.idNumber" placeholder="身份证号" :style="selectwidthz" />
        </el-form-item>

        <el-form-item label="银行卡号">
          <el-input v-model="temp.bankCardNumber" placeholder="银行卡号" :style="selectwidthz" />
        </el-form-item>

        <el-form-item label="所属银行">
          <el-input v-model="temp.bankName" placeholder="所属银行" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="是否工作" prop="isWork">
          <el-select v-model="temp.isWork" class="filter-item" placeholder="请选择是否工作" :style="selectwidthz">
            <el-option v-for="item in isWorks" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.isWork==='1'" label="工作单位" prop="workplace">
          <el-input v-model="temp.workplace" placeholder="工作单位" :style="selectwidthz" type="text" maxlength="50" />
        </el-form-item>
        <el-form-item label="省份">
          <el-select v-model="temp.provinceName" class="filter-item" placeholder="请选择所属省份" :style="selectwidthz" @change="_selectChange1">
            <el-option v-for="item in provinceCodes" :key="item.id" :label="item.label" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="temp.cityName" class="filter-item" placeholder="请选择所属市区" :style="selectwidthz" @change="_selectChange2">
            <el-option v-for="item in cityCodes" :key="item.value" :label="item.label" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="区县">
          <el-select v-model="temp.districtName" class="filter-item" placeholder="请选择所属区县" :style="selectwidthz" @change="_selectChange3">
            <el-option v-for="item in districtCodes" :key="item.value" :label="item.label" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="temp.address" placeholder="请输入地址" :style="selectwidthz" />
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
    <el-dialog :title="textMap[dialogStatus1]" :visible.sync="dialogFormVisible1" @open="handleData">
      <el-table
        ref="multipleTable"
        :data="rolelist"
        style="width: 100%"
        @selection-change="handleSelectionChange1"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          label="角色名称"
        />
        <el-table-column
          prop="code"
          label="角色编码"
        />
      </el-table>
      <pagination v-show="roletotal>0" :total="roletotal" :page.sync="rolelistQuery.current" :limit.sync="rolelistQuery.size" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">
          取消
        </el-button>
        <el-button type="primary" @click="assignData">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入文件" :visible.sync="excelImportShow">
      <a href="javascript:;" class="file">
        <input id="upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="importFileTeacher(this)">
      </a>
      <button id="submitRelease" class="btn sbold green" @click="downloadTemplate">
        <span class="ladda-label">下载模板</span>
      </button>
      <br>
      <span style="color: red;position:relative; top: 25px;">提示：仅允许导入.xls和.xlsx的格式文件</span>
      <div id="demo" />
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="excelImportShow = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click.native="submitUpload()">提交</el-button>
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
    <!-- 设置密码 -->
    <el-dialog title="密码设置" :visible.sync="passworkVisible" width="400px" :show-close="false" @closed="guanbi">
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="ruless" label-width="100px" class="demo-ruleForm" label-position="top">
        <el-form-item label="密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passworkVisible = false">取 消</el-button>
        <el-button type="primary" @click="passwordSetting()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 题型设置 -->
    <el-dialog title="题型设置" :visible.sync="subjectTypeVisible" width="800px">
      <el-tabs v-model="activeSubjectTab" style="margin-left: 20px;margin-right: 20px;" @tab-click="subjectTabClick">
        <el-tab-pane
          v-for="(item, index) in teacherRoleList"
          :key="item.roleId"
          :label="item.roleName"
          :name="item.roleId"
        >
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            @click="openNoExistSubject"
          >
            添加题型
          </el-button>
          <el-button
            size="small"
            type="primary"
            style="margin-bottom: 10px"
            @click="deleteSubjectTypeRelation"
          >批量删除</el-button>
          <el-table
            :data="teacherSubjectTypeList"
            border
            fit
            highlight-current-row
            height="360px"
            style="margin-top: 16px"
            @selection-change="handleExistSubjectChange"
          >
            <el-table-column
              type="selection"
              label="勾选"
              width="55px"
            />
            <el-table-column align="center" label="题型名称">
              <template slot-scope="scope">
                {{ scope.row.typeName }}
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteSubjectTypeRelationOne(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-dialog>

    <el-dialog title="题型" :visible.sync="subjectTypeNoExistVisible">
      <el-table
        :data="teacherSubjectTypeNotExistList"
        border
        fit
        highlight-current-row
        height="360px"
        style="margin-top: 16px"
        @selection-change="handleNoExistSubjectChange"
      >
        <el-table-column
          type="selection"
          label="勾选"
          width="55px"
        />
        <el-table-column align="center" label="题型名称">
          <template slot-scope="scope">
            {{ scope.row.typeName }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="teacherSubjectTypeNotExistTotal>0"
        :total="teacherSubjectTypeNotExistTotal"
        :page.sync="teacherSubjectQuery.current"
        :limit.sync="teacherSubjectQuery.size"
        :page-sizes="[20, 40, 60, 80]"
        @pagination="getNotExistSubjectListByTeacherIdAndRoleId"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNoExistSubject">
          取消
        </el-button>
        <el-button type="primary" @click="saveTeacherSubjectTypeByTeacherId">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 班级设置 -->
    <el-dialog title="班级设置" :visible.sync="teacherClassVisible" width="800px">
      <el-tabs v-model="activeTeacherClassTab" style="margin-left: 20px;margin-right: 20px;" @tab-click="teacherClassTabClick">
        <el-tab-pane
          v-for="(item, index) in teacherClassRoleList"
          :key="item.roleId"
          :label="item.roleName"
          :name="item.roleId"
        >
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            @click="openNoExistTeacherClass"
          >
            添加班级
          </el-button>
          <el-button
            size="small"
            type="primary"
            style="margin-bottom: 10px"
            @click="deleteTeacherClassRelation"
          >批量删除</el-button>
          <el-table
            :data="teacherClassList"
            border
            fit
            highlight-current-row
            height="360px"
            style="margin-top: 16px"
            @selection-change="handleExistTeacherClassChange"
          >
            <el-table-column
              type="selection"
              label="勾选"
              width="55px"
            />
            <el-table-column align="center" label="班级名称">
              <template slot-scope="scope">
                {{ scope.row.className }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="班级标签">
              <template slot-scope="scope">
                {{ scope.row.typeName }}
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteTeacherClassRelationOne(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-dialog>

    <el-dialog title="班级" :visible.sync="teacherClassNoExistVisible" @close="resetListClassClose">
      <div class="filter-container">
        <el-input v-model="teacherClassQuery.className" placeholder="班级名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="teacherClassQuery.typeId" placeholder="标签" clearable style="width: 150px" class="filter-item">
          <el-option v-for="item in typeIds" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getNotExistClassListByTeacherIdAndRoleId">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetListClassQuery">
          重置
        </el-button>
      </div>
      <el-table
        :data="teacherClassNotExistList"
        border
        fit
        highlight-current-row
        height="360px"
        style="margin-top: 16px"
        @selection-change="handleNoExistTeacherClassChange"
      >
        <el-table-column
          type="selection"
          label="勾选"
          width="55px"
        />
        <el-table-column align="center" label="班级名称">
          <template slot-scope="scope">
            {{ scope.row.className }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="班级标签">
          <template slot-scope="scope">
            {{ scope.row.typeName }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="teacherClassNotExistTotal>0"
        :total="teacherClassNotExistTotal"
        :page.sync="teacherClassQuery.current"
        :limit.sync="teacherClassQuery.size"
        :page-sizes="[20, 40, 60, 80]"
        @pagination="getNotExistClassListByTeacherIdAndRoleId"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNoExistTeacherClass">
          取消
        </el-button>
        <el-button type="primary" @click="saveTeacherClassByTeacherId">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getTeacherList, createTeacher, updateTeacher, deleteTeacher, stateUpdate, updateByStatus, deleteTeachers, getRoleList, findRoles, addRoleList, importTeacher, addJobNumbers, addJobNumber, getUserRoleByUserId,
  getSubjectListByTeacherIdAndRoleId, getNotExistSubjectListByTeacherIdAndRoleId, saveTeacherSubjectTypeByTeacherId,
  getClassListByTeacherIdAndRoleId, getNotExistClassListByTeacherIdAndRoleId, saveTeacherClassByTeacherId, exportTeacherList } from '@/api/homework/teacher'
import { deleteSubjectTypeAndTeacherBatch } from '@/api/homework/subjectType'
import { deleteHwClassAndTeacherList } from '@/api/homework/hwClass'
import { getSysAreaRedisSimplifyPageList } from '@/api/system/sysArea.js'
import { passwordSetting, checkUserNameValid } from '@/api/system/users'
import { validatePhone } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import { noWx, nowxs } from '@/api/system/user'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import { getHwClassTypeAll } from '@/api/homework/hwClassType'
export default {
  name: 'TeacherMgn',
  components: { Pagination },
  directives: { waves },
  filters: {
    stateFilter(state) {
      const stateMap = {
        1: 'success',
        2: 'gray',
        0: 'danger'
      }
      return stateMap[state]
    }
  },
  data() {
    return {
      statusList: [{
        id: null,
        name: '全部'
      }, {
        id: 0,
        name: '禁用'
      }, {
        id: 1,
        name: '启用'
      }],
      roleSelectList: [],
      ruless: {
        pass: [
          { validator: this.validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: this.validatePass2, trigger: 'blur' }
        ]
      },
      ruleForm: {
        checkPass: '',
        pass: ''
      },
      typeIds: [],
      passworkVisible: false,
      rowr: {},
      delVisible: false,
      provinceCodes: [],
      cityCodes: [],
      districtCodes: [],
      list: null,
      list1: null,
      listLoading: true,
      userId: null,
      userIdd: undefined, // 用于编辑验证用户名，排除自己
      rolelist: null,
      roletotal: 0,
      total: 0,
      listQuery: {
        current: 1,
        username: undefined,
        nickname: undefined,
        wxOpenid: undefined,
        phone: undefined,
        roleName: null,
        className: null,
        status: null
      },
      rolelistQuery: {
        current: 1
      },
      departmentTypes: [],
      isWorks: [],
      temp: {
        id: undefined,
        bankName: undefined,
        isWork: undefined,
        workplace: undefined,
        departmentType: undefined,
        multipleSelection: [],
        multipleSelection1: [],
        delarr: [],
        username: '',
        nickname: '',
        provinceCode: '',
        provinceName: '',
        cityName: '',
        cityCode: '',
        districtName: '',
        districtCode: '',
        wxOpenid: '',
        address: '',
        roleId: '',
        roleNames: '',
        classNames: '',
        phone: '',
        fullName: undefined,
        wechatNumber: undefined,
        schoolName: undefined,
        collegeName: undefined,
        graduateSchoolName: undefined,
        graduateEntranceTime: undefined,
        graduationTime: undefined,
        idNumber: undefined,
        bankCardNumber: undefined
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      excelImportShow: false,
      addLoading: false,
      dialogStatus: '',
      dialogStatus1: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // 题型弹出框 老师所属角色 add by wzx
      activeSubjectTab: '',
      subjectTypeVisible: false,
      subjectTypeNoExistVisible: false,
      teacherRoleList: [],
      teacherSubjectQuery: {
        current: 1,
        size: 20
      },
      teacherSubjectTypeList: [],
      teacherSubjectTypeNotExistList: [],
      teacherSubjectTypeNotExistTotal: 0,
      teacherSubjectTypeAddList: [],
      teacherSubjectTypeDeleteIdList: [],
      // 班级弹出框 老师所属角色 add by wzx
      teacherClassRoleList: [],
      activeTeacherClassTab: '',
      teacherClassVisible: false,
      teacherClassNoExistVisible: false,
      teacherClassQuery: {
        className: undefined,
        typeId: undefined,
        current: 1,
        size: 20
      },
      teacherClassList: [],
      teacherClassNotExistList: [],
      teacherClassNotExistTotal: 0,
      teacherClassAddList: [],
      teacherClassDeleteIdList: [],
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { validator: this.userNameVerification, trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        departmentType: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        phone: [{ trigger: 'blur', validator: validatePhone }]
      }
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '250px'
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.departmentTypes = getDictDataList('hw_department_type')
    this.isWorks = getDictDataList('hw_teacher_is_work')
    this.setRoleSelectList()
    this.fetchData()
    this.getHwClassType()
  },
  methods: {
    getHwClassType() {
      getHwClassTypeAll({ status: 1 }).then(response => {
        this.typeIds = response.data
      })
    },
    formats(row) {
      let vv = '-'
      const typ = this.statusCodes
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
    assignJobNumbers() {
      let length = 0
      if (this.multipleSelection === undefined) {
        this.multipleSelection = []
      }
      length = this.multipleSelection.length
      if (length < 1) {
        this.$message({
          message: '请选择一条或多条数据!',
          type: 'warning'
        })
        return false
      }
      const idList = []
      this.multipleSelection.forEach(function(a) {
        idList.push(a.id)
      })
      addJobNumbers(idList).then(res => {
        if (res.success && res.data) {
          this.$message.success('工号已生成')
          this.fetchData()
        } else {
          this.$message.error('工号已生失败')
        }
      })
    },
    addJobNumber(id) {
      addJobNumber(id).then(res => {
        if (res.success && res.data) {
          this.$message.success('工号已生成')
          this.fetchData()
        } else {
          this.$message.error('工号已生失败')
        }
      })
    },
    setRoleSelectList() {
      getRoleList(this.rolelistQuery).then(response => {
        const roleAllObj = { id: '', code: '', name: '' }
        this.roleSelectList = response.data.records
        this.roleSelectList.unshift(roleAllObj)
      })
    },
    showTipsReset(obj, row) {
      row.showTooltip = false
    },
    showTips(obj, row) {
      /* currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
      const TemporaryTag = document.createElement('span')
      TemporaryTag.innerText = row.classNames
      TemporaryTag.className = 'getTextWidth'
      document.querySelector('body').appendChild(TemporaryTag)
      const currentWidth = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()

      /* cellWidth为表格容器的宽度*/
      const cellWidth = obj.target.offsetWidth
      /* 当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行*/
      if (currentWidth > (2 * cellWidth)) {
        row.showTooltip = true
      } else {
        row.showTooltip = false
      }
    },

    userNameVerification(rule, value, callback) {
      // 判断是编辑还是新增
      let map = {}
      if (this.dialogStatus === 'update') {
        map = { userId: this.userIdd, userName: value }
      } else {
        map = { userName: value }
      }
      checkUserNameValid(map).then(res => {
        if (res.data != null && res.data) {
          callback()
        } else {
          callback(new Error('用户名已存在'))
        }
      })
    },
    handleUpdatePassWord() {
      let length = 0
      if (this.multipleSelection) {
        length = this.multipleSelection.length
      }
      if (length < 1) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      }
      if (length > 1) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      }
      this.passworkVisible = true
    },
    guanbi() {
      this.$refs['ruleForm'].resetFields()
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    passwordSetting() {
      this.passworkVisible = true
      let length = 0
      if (this.multipleSelection) {
        length = this.multipleSelection.length
      }
      if (length < 1) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      }
      if (length > 1) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.id = this.multipleSelection[0].id
          passwordSetting(this.ruleForm).then(res => {
            if (res.data) {
              this.fetchData()
              this.$notify({
                title: '成功',
                message: '密码重置成功！',
                type: 'success',
                duration: 2000
              })
              this.passworkVisible = false
            }
          })
        }
      })
    },
    fetchData() {
      this.listLoading = true
      getTeacherList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    updateWx(scope) {
      noWx(scope.row.id).then(res => {
        if (res.success) {
          scope.row.wxOpenid = undefined
          this.$notify({
            title: '成功',
            message: '微信绑定已解除!',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    tableDeleteRow(row, or) {
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        let length = 0
        if (this.multipleSelection === undefined) {
          this.multipleSelection = []
        }
        length = this.multipleSelection.length
        if (length < 1) {
          this.$message({
            message: '请选择一条或多条数据!',
            type: 'warning'
          })
        } else {
          this.delVisible = true
        }
      }
    },
    resetListClassQuery() {
      this.teacherClassQuery.className = undefined
      this.teacherClassQuery.typeId = undefined
      this.getNotExistClassListByTeacherIdAndRoleId()
    },
    resetListClassClose() {
      this.teacherClassQuery.className = undefined
      this.teacherClassQuery.typeId = undefined
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickname: '',
        provinceCode: '',
        provinceName: '',
        delarr: [],
        cityName: '',
        cityCode: '',
        districtName: '',
        districtCode: '',
        wxOpenid: '',
        address: '',
        deleted: 0,
        password: '',
        userType: '3', // 默认用户类型老师
        mgrType: '0', // 默认非管理员
        status: '1', // 默认启用
        phone: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.usernameDisabled = false
      this.getArea()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createTeacher(this.temp).then(() => {
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
      this.userIdd = row.id
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.password = '123456'
          this.temp.userType = '1'
          this.temp.mgrType = '0'
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateTeacher(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                this.userIdd = undefined
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
    handleDelete() {
      this.delVisible = false
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteTeacher(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateState(row) { // 修改状态
      stateUpdate(row.id).then(res => {
        if (res.success && res.data !== null && res.data) {
          this.fetchData()
          this.$notify({
            title: '成功',
            message: '状态修改成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '状态修改失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    updateStatus(row) { // 批量修改状态
      let length = 0
      if (this.multipleSelection === undefined) {
        this.multipleSelection = []
      }
      length = this.multipleSelection.length
      if (length < 1) {
        this.$message({
          message: '请选择一条或多条数据!',
          type: 'warning'
        })
        return false
      }
      for (let i = 0; i < length; i++) {
        this.temp.delarr.push(this.multipleSelection[i].id)
      }
      const param = {}
      param.idList = this.temp.delarr
      param.status = row
      updateByStatus(param).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '状态批量修改成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSelectionChange(val) { // 复选框
      this.multipleSelection = val
    },
    handleSelectionChange1(val) { // 复选框
      this.multipleSelection1 = val
    },
    rest() { // 重置
      this.listQuery.username = undefined
      this.listQuery.nickname = undefined
      this.listQuery.wxOpenid = undefined
      this.listQuery.phone = undefined
      this.listQuery.roleName = null
      this.listQuery.className = null
      this.listQuery.status = null
      this.fetchData()
    },
    handleDeletes() { // 批量删除
      this.delVisible = false
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.temp.delarr.push(this.multipleSelection[i].id)
      }
      deleteTeachers(this.temp.delarr).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    tableNoWxs() {
      let length = 0
      if (this.multipleSelection === undefined) {
        this.multipleSelection = []
      }
      length = this.multipleSelection.length
      if (length < 1) {
        this.$message({
          message: '请选择一条或多条数据!',
          type: 'warning'
        })
      } else {
        const cc = []
        for (let i = 0; i < length; i++) {
          cc.push(this.multipleSelection[i].id)
        }
        nowxs(cc).then(res => {
          if (res.success) {
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '微信绑定已解除!',
              type: 'success',
              duration: 2000
            })
          }
        })
      }
    },
    assignRoles(row) { // 单个分配角色
      this.dialogFormVisible1 = true
      this.userId = row.id
    },
    handleData() {
      findRoles(this.userId).then(response => {
        this.list1 = response.data
        let arrId = []
        arrId = this.list1.split(',')
        console.log(arrId)
        if (arrId.length > 0) {
          getRoleList(this.rolelistQuery).then(response => {
            this.rolelist = response.data.records
            console.log(this.rolelist)
            this.roletotal = parseInt(response.data.total)
            this.$nextTick(() => {
              for (let i = 0; i < this.rolelist.length; i++) {
                for (let j = 0; j < arrId.length; j++) {
                  if (arrId[j] === this.rolelist[i].id) {
                    this.$refs.multipleTable.toggleRowSelection(this.rolelist[i], true)
                  }
                }
              }
            })
          })
        } else {
          getRoleList(this.rolelistQuery).then(response => {
            this.rolelist = response.data.records
            this.roletotal = parseInt(response.data.total)
          })
        }
      })
    },
    assignData() { // 单个分配用户角色
      const length = this.multipleSelection1.length
      var roleIds = ''
      for (let i = 0; i < length; i++) {
        roleIds += this.multipleSelection1[i].id + ','
      }
      if (roleIds === '') {
        this.$message({
          message: '请选择角色！',
          type: 'warning'
        })
        return false
      }
      const data1 = {}
      data1.userId = this.userId
      data1.roleId = roleIds
      addRoleList(data1).then(() => {
        this.fetchData()
        this.dialogFormVisible1 = false
        this.$notify({
          title: '成功',
          message: '用户分配角色成功！',
          type: 'success',
          duration: 2000
        })
      })
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
    },
    importFile() {
      this.excelImportShow = true
    },
    importFileTeacher(file) {
      this.file = event.currentTarget.files[0]
      this.files = this.file
      if (this.file.name.indexOf('.xls') === -1 && this.file.name.indexOf('.xlsx') === -1) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!')
        return false
      }
    },
    submitUpload() {
      if (this.file === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      this.addLoading = true
      const fileFormData = new FormData()
      fileFormData.append('file', this.files)// filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      console.log(fileFormData)
      importTeacher(fileFormData).then(response => {
        this.addLoading = false
        this.excelImportShow = false
        if (response.data) {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          this.fetchData()// 重新请求一次页面数据
        } else {
          this.$message({
            message: response.msg
          })
        }
      })
    },
    downloadTemplate() {
      window.location.href = '/hwTeacher/downloadTemplate/'
    },
    // 题型设置
    getTeacherRoleList(row) {
      getUserRoleByUserId(row.id).then(response => {
        if (response.data && response.data.length > 0) {
          this.teacherRoleList = response.data.map(item => {
            if (item.roleType === 'leve1teacher' || item.roleType === 'seeteacher') {
              return item
            } else {
              return null
            }
          }).filter(item => item)
          if (this.teacherRoleList.length > 0) {
            this.activeSubjectTab = this.teacherRoleList[0].roleId
            this.teacherSubjectQuery.teacherId = row.id
            this.teacherSubjectQuery.teacherRoleId = this.teacherRoleList[0].roleId
            this.getSubjectListByTeacherIdAndRoleId()
            this.subjectTypeVisible = true
            this.teacherUserId = row.id
          } else {
            this.$message.warning('该老师未赋予一级老师或查看老师角色！')
          }
        } else {
          this.$message.warning('该老师未赋予一级老师或查看老师角色！')
        }
      })
    },
    subjectTabClick(tab, event) {
      this.teacherSubjectQuery.teacherId = this.teacherUserId
      this.teacherSubjectQuery.teacherRoleId = tab.name
      this.getSubjectListByTeacherIdAndRoleId()
    },
    getSubjectListByTeacherIdAndRoleId() {
      getSubjectListByTeacherIdAndRoleId(this.teacherSubjectQuery).then(res => {
        this.teacherSubjectTypeList = res.data
      })
    },
    openNoExistSubject() {
      this.teacherSubjectQuery.current = 1
      getNotExistSubjectListByTeacherIdAndRoleId(this.teacherSubjectQuery).then(res => {
        this.teacherSubjectTypeNotExistList = res.data.records
        this.teacherSubjectTypeNotExistTotal = parseInt(res.data.total)
        this.subjectTypeNoExistVisible = true
      })
    },
    getNotExistSubjectListByTeacherIdAndRoleId() {
      getNotExistSubjectListByTeacherIdAndRoleId(this.teacherSubjectQuery).then(res => {
        this.teacherSubjectTypeNotExistList = res.data.records
        this.teacherSubjectTypeNotExistTotal = parseInt(res.data.total)
      })
    },

    handleNoExistSubjectChange(val) {
      if (val && val.length > 0) {
        this.teacherSubjectTypeAddList = val.map(item => {
          const addItemObj = { 'teacherId': this.teacherSubjectQuery.teacherId, 'teacherRoleId': this.teacherSubjectQuery.teacherRoleId }
          addItemObj.subjectTypeId = item.id
          return addItemObj
        })
      } else {
        this.teacherSubjectTypeAddList = []
      }
    },
    cancelNoExistSubject() {
      this.subjectTypeNoExistVisible = false
    },
    saveTeacherSubjectTypeByTeacherId() {
      saveTeacherSubjectTypeByTeacherId(this.teacherSubjectTypeAddList).then(res => {
        if (res.success) {
          this.$message.success('保存成功')
          this.activeSubjectTab = this.teacherSubjectQuery.teacherRoleId
          this.getSubjectListByTeacherIdAndRoleId()
          this.subjectTypeNoExistVisible = false
          this.subjectTypeVisible = true
          this.fetchData()
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    handleExistSubjectChange(val) {
      if (val && val.length > 0) {
        this.teacherSubjectTypeDeleteIdList = val.map(item => {
          return item.id
        })
      } else {
        this.teacherSubjectTypeDeleteIdList = []
      }
    },
    deleteSubjectTypeRelation() {
      if (this.teacherSubjectTypeDeleteIdList.length > 0) {
        this.$confirm('请确认是否删除选中的关联题型，删除请点击确认!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 执行批量删除
          deleteSubjectTypeAndTeacherBatch(this.teacherSubjectTypeDeleteIdList).then(res => {
            if (res.success) {
              this.$message.success('删除成功')
              this.activeSubjectTab = this.teacherSubjectQuery.teacherRoleId
              this.teacherSubjectTypeDeleteIdList = []
              this.getSubjectListByTeacherIdAndRoleId()
            } else {
              this.$message.success('删除失败')
            }
          })
        }).catch(() => {

        })
      } else {
        this.$message.warning('请先选择要删除的记录')
      }
    },
    deleteSubjectTypeRelationOne(row) {
      this.teacherSubjectTypeDeleteIdList.push(row.id)
      this.deleteSubjectTypeRelation()
    },
    // 班级设置
    getTeacherClassRoleList(row) {
      getUserRoleByUserId(row.id).then(response => {
        if (response.data && response.data.length > 0) {
          this.teacherClassRoleList = response.data
          if (this.teacherClassRoleList.length > 0) {
            this.activeTeacherClassTab = this.teacherClassRoleList[0].roleId
            this.teacherClassQuery.teacherId = row.id
            this.teacherClassQuery.teacherRoleId = this.teacherClassRoleList[0].roleId
            this.getClassListByTeacherIdAndRoleId()
            this.teacherClassVisible = true
            this.teacherUserId = row.id
          } else {
            this.$message.warning('请先配置老师的角色！')
          }
        } else {
          this.$message.warning('请先配置老师的角色！')
        }
      })
    },
    getClassListByTeacherIdAndRoleId() {
      getClassListByTeacherIdAndRoleId(this.teacherClassQuery).then(res => {
        this.teacherClassList = res.data
      })
    },
    teacherClassTabClick(tab, event) {
      this.teacherClassQuery.teacherId = this.teacherUserId
      this.teacherClassQuery.teacherRoleId = tab.name
      this.getClassListByTeacherIdAndRoleId()
    },
    openNoExistTeacherClass() {
      this.teacherClassQuery.current = 1
      getNotExistClassListByTeacherIdAndRoleId(this.teacherClassQuery).then(res => {
        this.teacherClassNotExistList = res.data.records
        this.teacherClassNotExistTotal = parseInt(res.data.total)
        this.teacherClassNoExistVisible = true
      })
    },
    handleExistTeacherClassChange(val) {
      if (val && val.length > 0) {
        this.teacherClassDeleteIdList = val.map(item => {
          return item.id
        })
      } else {
        this.teacherClassDeleteIdList = []
      }
    },
    deleteTeacherClassRelation() {
      if (this.teacherClassDeleteIdList.length > 0) {
        this.$confirm('请确认是否删除选中的关联班级，删除请点击确认!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 执行批量删除
          deleteHwClassAndTeacherList(this.teacherClassDeleteIdList).then(res => {
            if (res.success) {
              this.$message.success('删除成功')
              this.activeTeacherClassTab = this.teacherClassQuery.teacherRoleId
              this.teacherClassDeleteIdList = []
              this.getClassListByTeacherIdAndRoleId()
              this.fetchData()
            } else {
              this.$message.success('删除失败')
            }
          })
        }).catch(() => {

        })
      } else {
        this.$message.warning('请先选择要删除的记录')
      }
    },
    deleteTeacherClassRelationOne(row) {
      this.teacherClassDeleteIdList.push(row.id)
      this.deleteTeacherClassRelation()
    },
    handleNoExistTeacherClassChange(val) {
      if (val && val.length > 0) {
        this.teacherClassAddList = val.map(item => {
          return item.id
        })
      } else {
        this.teacherClassAddList = []
      }
    },
    getNotExistClassListByTeacherIdAndRoleId() {
      getNotExistClassListByTeacherIdAndRoleId(this.teacherClassQuery).then(res => {
        this.teacherClassNotExistList = res.data.records
        this.teacherClassNotExistTotal = parseInt(res.data.total)
      })
    },
    cancelNoExistTeacherClass() {
      this.teacherClassNoExistVisible = false
    },
    saveTeacherClassByTeacherId() {
      const addTeacherClassObj = {
        teacherId: this.teacherClassQuery.teacherId,
        teacherRoleId: this.teacherClassQuery.teacherRoleId,
        classIdList: this.teacherClassAddList
      }
      saveTeacherClassByTeacherId(addTeacherClassObj).then(res => {
        if (res.success) {
          this.$message.success('保存成功')
          this.activeTeacherClassTab = this.teacherClassQuery.teacherRoleId
          this.getClassListByTeacherIdAndRoleId()
          this.teacherClassNoExistVisible = false
          this.teacherClassVisible = true
          this.fetchData()
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    exportList() {
      exportTeacherList(this.listQuery)
    }
  }
}
</script>

<style>
  .class-name{
    display:-webkit-box;
    text-overflow:ellipsis;
    overflow:hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient:vertical;
  }
</style>
