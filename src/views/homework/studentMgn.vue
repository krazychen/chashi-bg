<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="账户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.nickname"
        placeholder="昵称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="手机"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.wxOpenid"
        placeholder="微信"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.schoolName"
        placeholder="报考院校"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.collegeName"
        placeholder="报考专业"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.studentNumber"
        placeholder="学号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="item in statusList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.bindOrNot"
        placeholder="是否绑定cctalk账号"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="item in bindOrNots"
          :key="item.dictCode"
          :label="item.dictLabel"
          :value="item.dictValue"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="rest"
      >
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-download"
        @click="exportList"
      >
        导出
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="reissue"
      >
        补发作业
      </el-button>
      <el-dropdown class="filter-item" trigger="click" placement="top">
        <el-button type="primary" class="el-dropdown-link">
          更多
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-delete"
              @click="tableNoWxs()"
            >
              解绑微信
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-delete"
              @click="tableDeleteRow('', 'deletes')"
            >
              删除
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-success"
              @click="updateStatus(1)"
            >
              启用
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-remove"
              @click="updateStatus(0)"
            >
              停用
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="importFile"
            >
              导入
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-refresh"
              @click="handleUpdatePassWord"
            >
              设置密码
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              @click="bindingFileClick"
            >
              绑定
            </el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      ref="stud"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="createSort"
    >
      <el-table-column type="selection" label="勾选" width="55px" />
      <el-table-column align="center" label="账户名" width="140" fixed>
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="140" fixed>
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="班级" width="150" align="center" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.classNames }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentNumbers }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wxOpenid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业重置次数" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resetTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报考院校" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.schoolName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报考专业" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collegeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="150"
        align="center"
        sortable="custom"
        prop="create_time"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否绑定cctalk账号"
        width="150"
        align="center"
        sortable="custom"
        prop="create_time"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cctalkStudentNo ? '已绑定' : '未绑定' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <i
            class="el-icon-edit"
            title="修改"
            tooltip="true"
            style="color: #67C23A;margin-left:15px;"
            type="primary"
            @click="handleUpdate(scope.row)"
          />
          <span v-if="scope.row.status == 1">
            <i
              class=" el-icon-remove"
              title="禁用"
              tooltip="true"
              style="color: #F56C6C;margin-left:15px;"
              type="primary"
              @click="updateState(scope.row)"
            />
          </span>
          <span v-if="scope.row.status == 0">
            <i
              class=" el-icon-success"
              title="启用"
              tooltip="true"
              style="color: #F56C6C;margin-left:15px;"
              type="primary"
              @click="updateState(scope.row)"
            />
          </span>
          <i
            class="el-icon-delete"
            title="删除"
            tooltip="true"
            style="color: #F56C6C;margin-left:15px;"
            type="primary"
            @click="tableDeleteRow(scope.row, 'delete')"
          />
          <i
            class="el-icon-refresh-right"
            title="重置密码"
            tooltip="true"
            style="color: #409EFF;margin-left:15px;"
            @click="resetPassWord(scope.row)"
          />
          <i
            v-if="scope.row.wxOpenid"
            class="el-icon-scissors"
            title="解绑微信"
            tooltip="true"
            style="color: #409EFF;margin-left:15px;"
            @click="updateWx(scope)"
          />
          <i
            class="el-icon-view"
            title="查看重置申请记录"
            style="color: #409EFF;margin-left:15px;"
            @click="seeResetRecord(scope.row)"
          />
          <i
            class="el-icon-view"
            title="重置次数充值"
            style="color: #409EFF;margin-left:15px;"
            @click="reResetRecharge(scope.row)"
          />
          <span
            style="color: #409EFF;margin-left:10px;cursor:pointer"
            @click="getStudentClassList(scope.row)"
          >
            班级设置
          </span>
          <span
            style="color: #409EFF;margin-left:10px;cursor:pointer"
            @click="cctalkBind(scope.row)"
          >
            账号绑定
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="绑定cctalk账号"
      :visible.sync="cctalkBindVisible"
      width="440px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="cctalkTemp"
        label-position="left"
        label-width="100px"
        style="width: 400px;"
      >
        <el-form-item label="cctalk用户名" prop="cctalkUserName">
          <el-input
            v-model="cctalkTemp.cctalkUserName"
            placeholder="cctalk用户名"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="cctalk学籍号"
          prop="cctalkStudentNo"
          :disabled="true"
        >
          <el-input
            v-model="cctalkTemp.cctalkStudentNo"
            placeholder="cctalk学籍号"
            :disabled="true"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="cctalkTemp.cctalkStudentNo"
          type="primary"
          @click="bindCctalk()"
        >
          重新绑定
        </el-button>
        <el-button v-else type="primary" @click="bindCctalk()">
          绑定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择账号" :visible.sync="cctalkUserVisible" width="700px">
      <div class="filter-container">
        <el-input
          v-model="listCctalkUserQuery.cctalkUserName"
          placeholder="cctalk用户名"
          class="filter-item"
          style="width: 200px;"
          @keyup.enter.native="cctalkHandleFilter"
        />
        <el-input
          v-model="listCctalkUserQuery.cctalkStudentNo"
          placeholder="cctalk学籍号"
          class="filter-item"
          style="width: 200px;"
          @keyup.enter.native="cctalkHandleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="cctalkHandleFilter(resetRow)"
        >
          查询
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-refresh"
          @click="resetCctalkUser"
        >
          重置
        </el-button>
      </div>
      <el-table
        v-loading="listCctalkLoading"
        :data="listCctalk"
        element-loading-text="Loading"
        border
        fit
        height="450px"
        highlight-current-row
        style="width: 100%;"
        @row-click="rowClick"
      >
        <el-table-column label width="35">
          <template slot-scope="scope">
            <el-radio
              v-model="cctalkStudentNo"
              :label="scope.row.cctalkStudentNo"
            >&nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" label="cctalk用户名">
          <template slot-scope="scope">
            {{ scope.row.cctalkUserName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="cctalk学籍号">
          <template slot-scope="scope">
            {{ scope.row.cctalkStudentNo }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="cctalkUsertotal > 0"
        :total="cctalkUsertotal"
        :page.sync="listCctalkUserQuery.current"
        :pager-count="5"
        style="width: 100%"
        @pagination="cctalkUserfetchData"
      />
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitBindCctalk()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="520px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="账户名" prop="username">
          <el-input
            v-model="temp.username"
            placeholder="请输入用户名"
            :disabled="usernameDisabled"
            :style="selectwidthz"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="temp.nickname"
            placeholder="请输入昵称"
            :style="selectwidthz"
          />
        </el-form-item>
        <el-form-item label="手机">
          <el-input
            v-model="temp.phone"
            placeholder="请输入手机"
            :style="selectwidthz"
          />
        </el-form-item>
        <el-form-item label="省份">
          <el-select
            v-model="temp.provinceName"
            class="filter-item"
            placeholder="请选择所属省份"
            :style="selectwidthz"
            @change="_selectChange1"
          >
            <el-option
              v-for="item in provinceCodes"
              :key="item.id"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-select
            v-model="temp.cityName"
            class="filter-item"
            placeholder="请选择所属市区"
            :style="selectwidthz"
            @change="_selectChange2"
          >
            <el-option
              v-for="item in cityCodes"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区县">
          <el-select
            v-model="temp.districtName"
            class="filter-item"
            placeholder="请选择所属区县"
            :style="selectwidthz"
            @change="_selectChange3"
          >
            <el-option
              v-for="item in districtCodes"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            v-model="temp.address"
            placeholder="请输入地址"
            :style="selectwidthz"
          />
        </el-form-item>
        <el-form-item label="报考院校">
          <el-select
            v-model="temp.schoolName"
            filterable
            placeholder="请选择报考院校"
            :style="selectwidthz"
            @change="_selectChange4"
          >
            <el-option
              v-for="item in schoolList"
              :key="item.label"
              :label="item.value"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报考专业">
          <el-select
            v-model="temp.collegeName"
            filterable
            placeholder="请选择报考专业"
            :style="selectwidthz"
            @change="_selectChange5"
          >
            <el-option
              v-for="item in schoolCollegeList"
              :key="item.label"
              :label="item.value"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="重置次数" prop="resetTimes">
          <el-input
            v-model="temp.resetTimes"
            placeholder="重置次数"
            :style="selectwidthz"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入文件" :visible.sync="excelImportShow">
      <a href="javascript:;" class="file">
        <input
          id="upload"
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="importFileStudent(this)"
        >
      </a>
      <button
        id="submitRelease"
        class="btn sbold green"
        @click="downloadTemplate"
      >
        <span class="ladda-label">下载模板</span>
      </button>
      <br>
      <span
        style="color: red;position:relative; top: 25px;"
      >提示：仅允许导入.xls和.xlsx的格式文件</span>
      <div id="demo" />
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="excelImportShow = false">取消</el-button>
        <el-button
          type="primary"
          :loading="addLoading"
          @click.native="submitUpload()"
        >提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入文件" :visible.sync="bindingImportShow">
      <a href="javascript:;" class="file">
        <input
          id="binding"
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="bindingFileStudent(this)"
        >
      </a>
      <button
        id="bindingRelease"
        class="btn sbold green"
        @click="bindingTemplate"
      >
        <span class="ladda-label">下载模板</span>
      </button>
      <br>
      <span
        style="color: red;position:relative; top: 25px;"
      >提示：仅允许导入.xls和.xlsx的格式文件</span>
      <div id="bindingDemo" />
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="bindingImportShow = false">取消</el-button>
        <el-button
          type="primary"
          :loading="bindingAddLoading"
          @click.native="bindingUpload()"
        >提交
        </el-button>
      </div>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">请确认是否删除数据！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="deleteor === 'delete' ? handleDelete() : handleDeletes()"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置密码 -->
    <el-dialog
      title="密码设置"
      :visible.sync="passworkVisible"
      width="400px"
      :show-close="false"
      @closed="guanbi"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        :rules="ruless"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="密码" prop="pass">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passworkVisible = false">取 消</el-button>
        <el-button type="primary" @click="passwordSetting()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 重置次数申请记录 -->
    <el-dialog
      title="重置次数申请记录"
      :visible.sync="resetTableVisible"
      width="900px"
      @closed="cleanResetTableData()"
    >
      <div class="filter-container">
        <el-input
          v-model="resetListQuery.subjectName"
          placeholder="作业名称"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="seeResetRecord(resetRow)"
        />
        <el-date-picker
          v-model="value2"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          class="filter-item"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="seeResetRecord(resetRow)"
        >
          查询
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-refresh"
          @click="resetRecord"
        >
          重置
        </el-button>
      </div>
      <el-table
        v-loading="resetListLoading"
        :data="resetTableData"
        style="width: 100%"
        height="429"
      >
        <el-table-column
          prop="subjectName"
          label="申请作业名称"
          align="center"
          width="180"
        />
        <el-table-column
          prop="applyTime"
          label="申请时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="resetTimeBeforeApply"
          align="center"
          label="申请前次数"
        />
        <el-table-column
          prop="resetTimeAfterApply"
          align="center"
          label="申请后次数"
        />
      </el-table>
      <pagination
        v-show="resetTotal > 0"
        :total="resetTotal"
        :page.sync="resetListQuery.current"
        :limit.sync="resetListQuery.size"
        @pagination="seeResetRecord(resetRow)"
      />
    </el-dialog>

    <!-- 充值记录记录 -->
    <el-dialog
      title="重置次数充值记录"
      :visible.sync="rechargeTableVisible"
      width="900px"
      @closed="cleanRechargeTableData()"
    >
      <el-form
        ref="rechargeForm"
        :model="rechargeForm"
        label-position="left"
        :rules="rechargeRuless"
        label-width="100px"
      >
        <el-form-item label="当前重置次数">
          <el-input
            v-model="rechargeRow.resetTimes"
            autocomplete="off"
            style="width: 200px;"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="充值次数" prop="rechargeTimes">
          <el-input
            v-model="rechargeForm.rechargeTimes"
            autocomplete="off"
            style="width: 200px;"
          />
          <el-button
            type="primary"
            :disabled="rechargeDis"
            size="mini"
            style="margin-left: 20px;"
            @click="rechargeSave(rechargeRow)"
          >
            保存
          </el-button>
        </el-form-item>
        <el-form-item label="充值记录" prop="checkPass" />
      </el-form>
      <el-table
        v-loading="rechargeListLoading"
        :data="rechargeTableData"
        style="width: 100%"
        height="429"
      >
        <el-table-column
          prop="rechargeTimes"
          label="充值次数"
          align="center"
          width="180"
        />
        <el-table-column
          prop="resetTimesBeforeRecharge"
          label="充值前次数"
          align="center"
          width="180"
        />
        <el-table-column align="center" label="充值后次数">
          <template slot-scope="scope">
            <span>{{
              new Number(scope.row.resetTimesBeforeRecharge) +
                new Number(scope.row.rechargeTimes)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" align="center" label="充值人" />
        <el-table-column prop="rechargeTime" align="center" label="充值时间" />
      </el-table>
      <pagination
        v-show="rechargeTotal > 0"
        :total="rechargeTotal"
        :page.sync="rechargeListQuery.current"
        :limit.sync="rechargeListQuery.size"
        :page-sizes="[20, 40, 60, 80]"
        @pagination="getRechargeTableData()"
      />
    </el-dialog>

    <!-- 班级设置 -->
    <el-dialog
      title="班级设置"
      :visible.sync="studentClassEditVisible"
      width="950px"
    >
      <el-form ref="studentClassForm" :model="studentClassForm" :inline="true">
        <!--      <el-form-->
        <!--        v-for="(item, index) in studentClassList"-->
        <!--        :key="index"-->
        <!--        :ref="'dynamicValidateForm'+index"-->
        <!--        :model="classFormModel"-->
        <!--        :label="'班级' + (index +1)"-->
        <!--        :inline="true"-->
        <!--      >-->
        <div
          v-for="(item, index) in studentClassForm.studentClassList"
          :key="index"
        >
          <el-form-item
            label="班级"
            :prop="'studentClassList.' + index + '.classId'"
            :rules="{
              required: true,
              message: '班级不能为空',
              trigger: 'blur'
            }"
          >
            <el-select
              v-model="item.classId"
              filterable
              placeholder="请选择班级"
              :style="{width:'400px'}"
            >
              <el-option
                v-for="classItem in classSelectList"
                :key="classItem.id"
                :label="classItem.typeName+'|'+classItem.className"
                :value="classItem.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="学号">
            <el-input
              v-model="item.studentNumber"
              placeholder="请输入学号"
              :style="selectwidthz"
            />
          </el-form-item>
          <el-button @click.prevent="deleteStudentClass(item)">删除</el-button>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStudentClass">新增</el-button>
        <el-button type="primary" @click="saveStudentClass">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="reissueTitle[idx]"
      :visible.sync="reissueVisible"
      width="820px"
      @closed="reissueClose"
      @open="reissueOpen"
    >
      <el-tabs
        v-show="step === 1"
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="作业" name="first">
          <el-table
            ref="single"
            v-loading="firstLoading"
            :data="firstList"
            height="380"
            :row-key="getRowKey"
            @selection-change="reissueFirstSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              :reserve-selection="true"
            />
            <el-table-column
              label="作业名称"
              prop="subjectName"
              align="center"
            />
            <el-table-column
              label="作业开始时间"
              prop="startTime"
              align="center"
            />
            <el-table-column
              label="作业提交截止时间"
              prop="endTime"
              align="center"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="作业组" name="second">
          <el-table
            ref="group"
            v-loading="secondLoading"
            :data="secondList"
            height="380"
            :row-key="getRowKey"
            @selection-change="reissueSecondSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              :reserve-selection="true"
            />
            <el-table-column
              label="作业组名称"
              prop="groupName"
              align="center"
            />
            <el-table-column
              label="最大数量"
              prop="groupMaxNum"
              align="center"
            />
            <el-table-column
              label="最大允许提交数量"
              prop="groupAllowMaxNum"
              align="center"
            />
            <el-table-column
              label="作业开始时间"
              prop="groupStartTime"
              align="center"
            />
            <el-table-column
              label="作业截止时间"
              prop="groupEndTime"
              align="center"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-form
        v-show="step === 2"
        ref="reissueForm"
        :model="reissueTemp"
        :rules="reissueRules"
        label-width="150px"
        label-position="left"
        style="width: 740px;mar-left: 20px;height: 380px"
      >
        <el-form-item label="最晚提交时间" prop="endTime">
          <el-date-picker
            v-model="reissueTemp.endTime"
            type="datetime"
            placeholder="请选择最晚提交时间"
            :style="{ width: '380px' }"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="学生追问截止时间" prop="qaEndTime">
          <el-date-picker
            v-model="reissueTemp.qaEndTime"
            type="datetime"
            placeholder="请选择学生追问截止时间"
            :style="{ width: '380px' }"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-show="step === 2"
          type="primary"
          @click="lastStep()"
        >上一步</el-button>
        <el-button
          v-show="step === 1"
          type="primary"
          @click="next()"
        >下一步</el-button>
        <el-button
          v-show="step === 2"
          type="primary"
          @click="submitReissue()"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStudentList,
  createStudent,
  updateStudent,
  deleteStudent,
  stateUpdate,
  updateByStatus,
  deleteStudents,
  updatePassWord,
  importStudent,
  bindingExcel,
  getSchoolList,
  getSchooCollegelList,
  getClassListByStudentId,
  saveStudentClassByStudentId,
  exportStudentList,
  bindCctalk
} from '@/api/homework/student'
import { getAllClass } from '@/api/homework/hwClass'
import { noWx, nowxs } from '@/api/system/user'
import { passwordSetting, checkUserNameValid } from '@/api/system/users'
import { getSysAreaRedisSimplifyPageList } from '@/api/system/sysArea.js'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getConfigData } from '@/utils/configDataUtils'
import { dialogFormRules } from '@/utils/validate'
import {
  getResetApplyPageList,
  recharge,
  getRechargeApplyPageList,
  getReissueHomeworkList,
  addReissueHomework
} from '@/api/homework/hwHomework.js'
import { getReissueHomeworkGroupList } from '@/api/homework/hwHomeworkGroup.js'
import { getDictDataList } from '@/utils/dictUtils'
import { getPageUserList } from '@/api/homework/cctalk.js'

export default {
  name: 'StudentMgn',
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
      cctalkStudentNo: undefined,
      cctalkStudent: {},
      cctalkBindVisible: false,
      cctalkUserVisible: false,
      listCctalk: [],
      listCctalkLoading: true,
      cctalkTemp: {
        id: undefined,
        cctalkStudentNo: undefined,
        cctalkStudentUserId: undefined,
        cctalkUserName: undefined
      },
      bindOrNots: [],
      statusList: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '禁用'
        },
        {
          id: 1,
          name: '启用'
        }
      ],
      idx: 0,
      reissueTemp: {
        endTime: undefined,
        qaEndTime: undefined,
        homeworkList: [],
        homeworkGroupList: [],
        studentIdList: []
      },
      reissueRules: {
        endTime: [
          { required: true, message: '请选择最晚提交时间', trigger: 'change' }
        ],
        qaEndTime: [
          {
            required: true,
            message: '请选择学生追问截止时间',
            trigger: 'change'
          }
        ]
      },
      firstLoading: false,
      secondLoading: false,
      firstList: [],
      secondList: [],
      reissueVisible: false,
      reissueTitle: ['选择作业', '选择作业组', '截止时间'],
      step: 1,
      activeName: 'first',
      rechargeValue: 0,
      rechargeDis: false,
      resetRow: {},
      rechargeRow: {},
      resetTableData: [],
      rechargeTableData: [],
      resetTableVisible: false,
      rechargeTableVisible: false,
      resetListLoading: true,
      rechargeListLoading: true,
      userIdd: undefined,
      rechargeRuless: {
        rechargeTimes: [
          { required: true, message: '请输充值次数', trigger: 'blur' },
          { validator: dialogFormRules, trigger: 'blur' }
        ]
      },
      ruless: {
        pass: [{ validator: this.validatePass, trigger: 'blur' }],
        checkPass: [{ validator: this.validatePass2, trigger: 'blur' }]
      },
      ruleForm: {
        checkPass: '',
        pass: ''
      },
      rechargeForm: {
        rechargeTimes: undefined
      },
      passworkVisible: false,
      rowr: {},
      delVisible: false,
      provinceCodes: [],
      cityCodes: [],
      districtCodes: [],
      list: null,
      schoolList: [],
      schoolCollegeList: [],
      listLoading: true,
      total: 0,
      cctalkUsertotal: 0,
      resetTotal: 0,
      rechargeTotal: 0,
      listCctalkUserQuery: {
        current: 1,
        cctalkUserName: undefined,
        cctalkStudentNo: undefined
      },
      listQuery: {
        bindOrNot: undefined,
        current: 1,
        username: undefined,
        nickname: undefined,
        wxOpenid: undefined,
        schoolName: undefined,
        phone: undefined,
        collegeName: undefined,
        studentNumber: undefined,
        status: null
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      rechargeListQuery: {
        current: 1,
        id: undefined,
        size: 20
      },
      resetListQuery: {
        current: 1,
        id: undefined,
        applyTimeStart: undefined,
        applyTimeEnd: undefined,
        subjectName: undefined
      },
      value2: [],
      temp: {
        id: undefined,
        multipleSelection: [],
        delarr: [],
        schoolId: '',
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
        schoolName: '',
        schoolCode: '',
        collegeCode: '',
        collegeName: '',
        classNames: '',
        phone: '',
        resetTimes: undefined
      },
      dialogFormVisible: false,
      excelImportShow: false,
      bindingImportShow: false,
      bindingAddLoading: false,
      addLoading: false,
      dialogStatus: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            validator: this.userNameVerification,
            trigger: 'blur'
          }
        ],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        resetTimes: [
          { required: true, message: '请输重置次数', trigger: 'blur' },
          {
            validator: dialogFormRules,
            trigger: 'blur'
          }
        ]
      },

      // 班级设置 add by wzx
      studentClassEditVisible: false,
      editStudentId: null,
      classSelectList: [],
      studentClassForm: {
        studentClassList: [
          {
            id: null,
            classId: null,
            studentId: null,
            studentNumber: null
          }
        ]
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
    this.bindOrNots = getDictDataList('cctalk_bind_or_not')
    this.getClassList()
    this.fetchData()
  },
  methods: {
    getRowKey(row) {
      return row.id
    },
    getHomeworkList() {
      this.firstLoading = true
      getReissueHomeworkList()
        .then(res => {
          if (res.success) {
            this.firstList = res.data
          }
        })
        .finally(() => {
          this.firstLoading = false
        })
    },
    getHomeworkGroupList() {
      this.secondLoading = true
      getReissueHomeworkGroupList()
        .then(res => {
          if (res.success) {
            this.secondList = res.data
          }
        })
        .finally(() => {
          this.secondLoading = false
        })
    },
    submitReissue() {
      this.$refs['reissueForm'].validate(valid => {
        if (valid) {
          let studentList = []
          if (this.multipleSelection && this.multipleSelection.length > 0) {
            studentList = this.multipleSelection
              .map((obj, index) => {
                return obj.id
              })
              .join(',')
              .split(',')
          } else {
            this.$message.error('请先选择要补发的学员')
            return false
          }
          this.reissueTemp.studentIdList = studentList
          addReissueHomework(this.reissueTemp).then(res => {
            if (res.success && res.data) {
              this.$notify({
                title: '成功',
                message: '补发成功!',
                type: 'success',
                duration: 2000
              })
              this.reissueVisible = false
              this.$refs.stud.clearSelection()
            } else {
              this.$notify({
                title: '失败',
                message: res.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
      this.$nextTick(() => {
        this.$refs['reissueForm'].clearValidate()
      })
    },
    lastStep() {
      this.step = 1
      this.idx = 1
    },
    next() {
      if (
        this.reissueTemp.homeworkList.length > 0 ||
          this.reissueTemp.homeworkGroupList.length > 0
      ) {
        this.step = 2
        this.idx = 2
      } else {
        this.$message.error('至少选择一个作业或作业组')
      }
    },
    reissueClose() {
      this.step = 1
      this.idx = 0
      this.activeName = 'first'
      this.reissueTemp = {
        endTime: undefined,
        qaEndTime: undefined,
        homeworkList: [],
        homeworkGroupList: [],
        studentIdList: []
      }
      this.$refs.single.clearSelection()
      this.$refs.group.clearSelection()
      this.$nextTick(() => {
        this.$refs['reissueForm'].clearValidate()
      })
    },
    reissueOpen() {
      this.getHomeworkList()
    },
    rowClick(row) {
      this.cctalkStudentNo = row.cctalkStudentNo
      this.cctalkStudent = row
    },
    handleClick(tab, event) {
      this.idx = parseInt(tab.index)
      if (tab.index === '0') {
        this.getHomeworkList()
      }
      if (tab.index === '1') {
        this.getHomeworkGroupList()
      }
    },
    reissueFirstSelectionChange(val) {
      this.reissueTemp.homeworkList = []
      if (val && val.length > 0) {
        this.reissueTemp.homeworkList = val
          .map((obj, index) => {
            return obj.id
          })
          .join(',')
          .split(',')
      }
    },
    reissueSecondSelectionChange(val) {
      this.reissueTemp.homeworkGroupList = []
      if (val && val.length > 0) {
        this.reissueTemp.homeworkGroupList = val
          .map((obj, index) => {
            return obj.id
          })
          .join(',')
          .split(',')
      }
    },
    reissue() {
      let length = 0
      if (this.multipleSelection === undefined) {
        this.multipleSelection = []
      }
      length = this.multipleSelection.length
      if (length < 1) {
        this.$message({
          message: '请至少选择一位学员进行作业补发！',
          type: 'error'
        })
      } else {
        // 补发作业
        this.reissueVisible = true
      }
    },
    createSort(column, prop, order) {
      this.listQuery.orders = []
      if (column.order === 'ascending') {
        this.listQuery.orders.push({ column: column.prop, asc: true })
      } else {
        this.listQuery.orders.push({ column: column.prop, asc: false })
      }
      this.fetchData()
    },
    rechargeSave(row) {
      this.rechargeForm.id = row.id
      this.rechargeDis = true
      recharge(this.rechargeForm).then(res => {
        this.rechargeDis = false
        if (res.success && res.data != null && res.data) {
          this.rechargeRow.resetTimes =
              new Number(this.rechargeRow.resetTimes) +
              new Number(this.rechargeForm.rechargeTimes)
          this.getRechargeTableData()
          this.$notify({
            title: '成功',
            message: '保存成功！',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '保存失败！' + res.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    getRechargeTableData() {
      this.rechargeListLoading = true
      this.rechargeListQuery.id = this.rechargeRow.id
      getRechargeApplyPageList(this.rechargeListQuery).then(res => {
        this.rechargeTableData = res.data.records
        this.rechargeTotal = parseInt(res.data.total)
        this.rechargeListLoading = false
      })
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
      this.$refs['ruleForm'].validate(valid => {
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
      getStudentList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
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
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetCctalkUser() {
      this.listCctalkUserQuery = {
        current: 1,
        cctalkUserName: undefined,
        cctalkStudentNo: undefined
      }
      this.cctalkHandleFilter()
    },
    cctalkHandleFilter() {
      this.listCctalkUserQuery.page = 1
      this.cctalkUserfetchData()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        schoolId: '',
        username: '',
        nickname: '',
        provinceName: '',
        provinceCode: '',
        cityName: '',
        cityCode: '',
        districtName: '',
        districtCode: '',
        wxOpenid: '',
        address: '',
        schoolName: '',
        schoolCode: '',
        collegeCode: '',
        collegeName: '',
        userType: '1',
        password: '',
        mgrType: '0',
        status: 1,
        deleted: 0,
        phone: '',
        resetTimes: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.usernameDisabled = false
      this.getArea()
      this.getSchool()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.temp.resetTimes = getConfigData('default_reset_times').configValue
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createStudent(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功!',
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
            if (
              this.provinceCodes[i].children !== undefined &&
                this.provinceCodes[i].children.length > 0
            ) {
              this.cityCodes = this.provinceCodes[i].children
              for (let j = 0; j < this.provinceCodes[i].children.length; j++) {
                if (
                  this.provinceCodes[i].children[j].id === this.temp.cityCode
                ) {
                  this.districtCodes = this.provinceCodes[i].children[
                    j
                  ].children
                  return
                }
                return
              }
            }
          }
        }
      })
    },
    getSchool() {
      getSchoolList({}).then(response => {
        this.schoolList = response.data
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.password = '123456'
          this.temp.userType = '1'
          this.temp.mgrType = '0'
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateStudent(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.userIdd = undefined
            this.$notify({
              title: '成功',
              message: '更新成功!',
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
      deleteStudent(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateState(row) {
      // 修改状态
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
    updateStatus(row) {
      // 批量修改状态
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
    handleSelectionChange(val) {
      // 复选框
      this.multipleSelection = val
    },
    rest() {
      // 重置
      this.listQuery.username = undefined
      this.listQuery.nickname = undefined
      this.listQuery.wxOpenid = undefined
      this.listQuery.schoolName = undefined
      this.listQuery.collegeName = undefined
      this.listQuery.phone = undefined
      this.listQuery.studentNumber = undefined
      this.listQuery.bindOrNot = undefined
      this.fetchData()
    },
    handleDeletes() {
      // 批量删除
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.temp.delarr.push(this.multipleSelection[i].id)
      }
      this.delVisible = false
      deleteStudents(this.temp.delarr).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetPassWord(row) {
      // 重置密码
      updatePassWord(row.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '密码重置成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    cleanResetTableData() {
      this.resetTableData = []
      this.resetListQuery = {
        current: 1,
        id: undefined,
        applyTimeStart: undefined,
        applyTimeEnd: undefined,
        subjectName: undefined
      }
      this.resetRow = {}
      this.value2 = []
    },
    cleanRechargeTableData() {
      debugger
      this.rechargeForm = {
        rechargeTimes: undefined
      }
      this.rechargeRow = {}
      this.rechargeTableData = []
      this.rechargeListQuery = {
        current: 1,
        id: undefined,
        size: 20
      }
      this.$nextTick(() => {
        this.$refs['rechargeForm'].clearValidate()
      })
    },
    seeRechargeRecord(row) {
      // 查看重置申请记录
      this.rechargeRow = Object.assign({}, row)
    },
    seeResetRecord(row) {
      // 查看重置申请记录
      debugger
      this.resetRow = row
      this.resetTableVisible = true
      this.resetListLoading = true
      this.resetListQuery.id = row.id
      if (this.value2.length > 1) {
        this.resetListQuery.applyTimeStart = this.value2[0]
        this.resetListQuery.applyTimeEnd = this.value2[1]
      }
      this.$nextTick(() => {
        getResetApplyPageList(this.resetListQuery).then(res => {
          this.resetTableData = res.data.records
          this.resetTotal = parseInt(res.data.total)
          this.resetListLoading = false
        })
      })
    },
    resetRecord() {
      this.resetListQuery = {
        current: 1,
        id: undefined,
        applyTimeStart: undefined,
        applyTimeEnd: undefined,
        subjectName: undefined
      }
      this.value2 = []
      this.seeResetRecord(this.resetRow)
    },
    reResetRecharge(row) {
      // 重置次数充值
      this.rechargeRow = row
      this.getRechargeTableData()
      this.rechargeTableVisible = true
      this.rechargeListLoading = false
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
    _selectChange4(val) {
      this.temp.schoolCode = val.label
      this.temp.schoolName = val.value
      this.temp.schoolId = val.schoolId
      console.log(this.temp.schoolId)
      getSchooCollegelList(this.temp.schoolId).then(response => {
        this.schoolCollegeList = response.data
      })
    },
    _selectChange5(val) {
      this.temp.collegeCode = val.label
      this.temp.collegeName = val.value
    },
    importFile() {
      this.excelImportShow = true
    },
    bindingFileClick() {
      this.bindingImportShow = true
    },
    importFileStudent(file) {
      this.file = event.currentTarget.files[0]
      this.files = this.file
      if (
        this.file.name.indexOf('.xls') === -1 &&
          this.file.name.indexOf('.xlsx') === -1
      ) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!')
        return false
      }
    },
    bindingFileStudent(file) {
      this.bindingFile = event.currentTarget.files[0]
      this.bindingFiles = this.bindingFile
      if (
        this.bindingFile.name.indexOf('.xls') === -1 &&
        this.bindingFile.name.indexOf('.xlsx') === -1
      ) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!')
        return false
      }
    },
    bindingUpload() {
      if (this.bindingFile === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      this.bindingAddLoading = true
      const fileFormData = new FormData()
      fileFormData.append('file', this.bindingFiles) // filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      console.log(fileFormData)
      bindingExcel(fileFormData).then(response => {
        this.bindingAddLoading = false
        this.bindingImportShow = false
        if (response.success && response.data) {
          const file = document.getElementById('binding')
          if (file.outerHTML) {
            file.outerHTML = file.outerHTML
          } else { // FF(包括3.5)
            file.value = ''
          }
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          this.fetchData() // 重新请求一次页面数据
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          })
        }
      }).finally(() => {
        document.getElementById('binding').value = ''
        this.bindingFile = ''
        this.bindingFiles = ''
      })
    },
    submitUpload() {
      if (this.file === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      this.addLoading = true
      const fileFormData = new FormData()
      fileFormData.append('file', this.files) // filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      console.log(fileFormData)
      importStudent(fileFormData).then(response => {
        this.addLoading = false
        this.excelImportShow = false
        if (response.success && response.data) {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          const file = document.getElementById('upload')
          if (file.outerHTML) {
            file.outerHTML = file.outerHTML
          } else { // FF(包括3.5)
            file.value = ''
          }
          this.fetchData() // 重新请求一次页面数据
        } else {
          this.$message({
            message: response.msg
          })
        }
      })
    },
    downloadTemplate() {
      window.location.href = 'hwStudent/downloadTemplate/'
    },
    bindingTemplate() {
      window.location.href = 'hwStudent/downloadBindingTemplate/'
    },
    cctalkUserfetchData() {
      this.listCctalkLoading = true
      getPageUserList(this.listCctalkUserQuery).then(response => {
        this.listCctalk = response.data.records
        this.cctalkUsertotal = parseInt(response.data.total)
        this.listCctalkLoading = false
      })
    },
    submitBindCctalk() {
      this.cctalkStudent.id = this.cctalkTemp.id
      bindCctalk(this.cctalkStudent).then(res => {
        if (res.success && res.data != null && res.data) {
          this.$notify({
            title: '成功',
            message: '绑定成功!',
            type: 'success',
            duration: 2000
          })
          this.cctalkTemp = Object.assign({}, this.cctalkStudent)
          this.cctalkUserVisible = false
          this.fetchData()
        } else {
          this.$notify({
            title: '失败',
            message: '绑定失败!',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    bindCctalk(id) {
      this.cctalkUserVisible = true
      this.cctalkStudentNo = this.cctalkTemp.cctalkStudentNo
      this.cctalkStudent = Object.assign({}, this.cctalkTemp)
      this.cctalkUserfetchData()
    },
    // 绑定账号
    cctalkBind(row) {
      this.cctalkTemp = {
        id: row.id,
        cctalkStudentNo: row.cctalkStudentNo,
        cctalkStudentUserId: row.cctalkStudentUserId,
        cctalkUserName: row.cctalkUserName
      }
      this.cctalkBindVisible = true
    },
    // 班级设置
    getStudentClassList(row) {
      this.editStudentId = row.id
      const queryObj = { studentId: row.id }
      getClassListByStudentId(queryObj).then(res => {
        if (res.success) {
          this.studentClassForm.studentClassList = res.data
          this.studentClassEditVisible = true
        }
      })
    },
    getClassList() {
      getAllClass().then(res => {
        this.classSelectList = res.data
      })
    },
    addStudentClass() {
      const addStudentClassObj = {
        id: null,
        classId: null,
        studentId: this.editStudentId,
        studentNumber: null
      }
      this.studentClassForm.studentClassList.push(addStudentClassObj)
    },
    deleteStudentClass(item) {
      const index = this.studentClassForm.studentClassList.indexOf(item)
      if (index !== -1) {
        this.studentClassForm.studentClassList.splice(index, 1)
      }
    },
    saveStudentClass() {
      this.$refs['studentClassForm'].validate(valid => {
        if (valid) {
          const saveObj = {
            studentId: this.editStudentId,
            hwStudentClassList: this.studentClassForm.studentClassList
          }
          saveStudentClassByStudentId(saveObj).then(res => {
            if (res.success) {
              this.$message.success('保存成功')
              this.studentClassEditVisible = false
              this.fetchData()
            } else {
              this.$message.error('保存失败')
            }
          })
        } else {
          return false
        }
      })
    },
    exportList() {
      exportStudentList(this.listQuery)
    }
  }
}
</script>
