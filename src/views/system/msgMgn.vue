<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.msgTitle" placeholder="消息标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sendUserName" placeholder="发布人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.mustRead" placeholder="是否必读" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in mustReads" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>
    </div>
    <div class="filter-container">
      <el-input v-model="listQuery.msgContent" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" placeholder="消息内容" style="width: 410px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-tabs v-model="listQuery.msgTypeCode" type="border-card" @tab-click="fetchData">
      <el-tab-pane label="系统消息" :name="'1'">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column align="center" label="消息标题" fixed>
            <template slot-scope="scope">
              {{ scope.row.msgTitle }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="消息对象" width="150">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.msgNotifyObj" placement="top">
                <div class="extra">
                  {{ scope.row.msgNotifyObj }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发布人" width="150" fixed>
            <template slot-scope="scope">
              {{ scope.row.sendUserName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="通知方式" width="150" prop="msgNotifyTypeCode" :formatter="msgNotifyTypeCodeFormat" />
          <el-table-column align="center" label="通知人数" width="150" prop="msgNumber" />
          <el-table-column align="center" label="通知时间" width="150" prop="notifiedTime" />
          <el-table-column align="center" label="有效时间" width="150">
            <template slot-scope="scope">
              {{ scope.row.mustReadDueTime?scope.row.mustReadDueTime:'-' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="必读时长" width="150">
            <template slot-scope="scope">
              {{ scope.row.mustReadTime?scope.row.mustReadTime:'-' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="未读人数" width="150" prop="noReadNumber" />
          <!--          <el-table-column align="center" label="消息内容" fixed>
            <template slot-scope="scope">
              {{ scope.row.msgContent }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="消息类型" width="150" fixed prop="msgTypeCode" :formatter="msgTypeCodeFormat" />
          <el-table-column align="center" prop="created_at" label="计划发步时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ scope.row.publishTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发步状态" width="150" prop="status" :formatter="statusFormat" />-->
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i v-if="scope.row.status !== '1'" class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleUpdate(scope.row)" />
              <i v-if="scope.row.status !== '1'" class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
              <i v-if="scope.row.status !== '1'" class="el-icon-folder-checked" title="发布" tooltip="true" style="color: #409EFF;margin-left:15px;" @click="publishMsg(scope.row)" />
              <i v-if="scope.row.status === '1'" class="el-icon-folder-delete" title="取消发布" tooltip="true" style="color: #FF5369;margin-left:15px;" @click="cancelMsg(scope.row)" />
              <i v-if="scope.row.status === '1'" class="el-icon-bell" title="查看消息明细" tooltip="true" style="color: #1AFFED;margin-left:15px;" @click="lookMsgNotes(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="重要通知" :name="'2'">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column align="center" label="消息标题" fixed>
            <template slot-scope="scope">
              {{ scope.row.msgTitle }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="消息对象" width="150">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.msgNotifyObj" placement="top">
                <div class="extra">
                  {{ scope.row.msgNotifyObj }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发布人" width="150" fixed>
            <template slot-scope="scope">
              {{ scope.row.sendUserName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="通知方式" width="150" prop="msgNotifyTypeCode" :formatter="msgNotifyTypeCodeFormat" />
          <el-table-column align="center" label="通知人数" width="150" prop="msgNumber" />
          <el-table-column align="center" label="通知时间" width="150" prop="notifiedTime" />
          <el-table-column align="center" label="有效时间" width="150">
            <template slot-scope="scope">
              {{ scope.row.mustReadDueTime?scope.row.mustReadDueTime:'-' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="必读时长" width="150">
            <template slot-scope="scope">
              {{ scope.row.mustReadTime?scope.row.mustReadTime:'-' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="未读人数" width="150" prop="noReadNumber" />
          <!--          <el-table-column align="center" label="消息内容" fixed>
            <template slot-scope="scope">
              {{ scope.row.msgContent }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="消息类型" width="150" fixed prop="msgTypeCode" :formatter="msgTypeCodeFormat" />
          <el-table-column align="center" prop="created_at" label="计划发步时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ scope.row.publishTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发步状态" width="150" prop="status" :formatter="statusFormat" />-->
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i v-if="scope.row.status !== '1'" class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleUpdate(scope.row)" />
              <i v-if="scope.row.status !== '1'" class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
              <i v-if="scope.row.status !== '1'" class="el-icon-folder-checked" title="发布" tooltip="true" style="color: #409EFF;margin-left:15px;" @click="publishMsg(scope.row)" />
              <i v-if="scope.row.status === '1'" class="el-icon-folder-delete" title="取消发布" tooltip="true" style="color: #FF5369;margin-left:15px;" @click="cancelMsg(scope.row)" />
              <i v-if="scope.row.status === '1'" class="el-icon-bell" title="查看消息明细" tooltip="true" style="color: #1AFFED;margin-left:15px;" @click="lookMsgNotes(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="adds" @closed="addClosed" @close="lll">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style=" margin-left:50px;margin-right: 50px">
        <el-form-item label="消息标题" prop="msgTitle">
          <el-input v-model="temp.msgTitle" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="消息类型" prop="msgTypeCode">
          <el-radio-group v-model="temp.msgTypeCode">
            <el-radio v-for="item in msgTypeCodes" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode">{{ item.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="通知方式" prop="msgNotifyTypeCodes">
          <el-checkbox-group v-model="temp.msgNotifyTypeCodes" @change="msgNotifyTypeCodesChange">
            <el-checkbox v-for="item in msgNofityTypeCodes" :key="item.dictValue" :label="item.dictValue">{{ item.dictLabel }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="temp.msgNotifyTypeCodes && temp.msgNotifyTypeCodes.length>0 && temp.msgNotifyTypeCodes.indexOf('2')!=-1" label="微信消息模板" prop="configId">
          <el-select v-model="temp.configId" placeholder="请选择微信模板">
            <el-option v-for="item in configIds" :key="item.id" :label="item.configName" :value="item.id" class="filter-item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.msgNotifyTypeCodes && temp.msgNotifyTypeCodes.length>0 && temp.msgNotifyTypeCodes.indexOf('2')!=-1" label="超链接" prop="hyperLinks">
          <el-input v-model="temp.hyperLinks" type="textarea" show-word-limit :maxlength="200" placeholder="请输入超链接信息" />
        </el-form-item>
        <el-form-item label="通知对象" prop="msgNotifyObjCode">
          <el-radio-group v-model="temp.msgNotifyObjCode" @change="switchObj">
            <el-radio v-for="item in msgNotifyObjCodes" :key="item.dictValue" :label="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.msgNotifyObjCode==='homework'" label="选择作业" prop="HomeworkId">
          <el-button v-if="homeworkMultipleSelection ===undefined || homeworkMultipleSelection.length<1" size="small" type="primary" plain @click="homeworkSetting()">选择作业+
          </el-button>
          <el-tag
            v-for="homework in homeworkMultipleSelection"
            v-else
            :key="homework.id"
            closable
            @click="homeworkSetting()"
          >
            {{ homework.subjectName }}
          </el-tag>
        </el-form-item>
        <el-form-item v-if="temp.msgNotifyObjCode === 'user'" label="指定用户"><span><el-button type="primary" size="mini" @click="openUserList">请选择指定用户</el-button></span>
          <div class="app-container">
            <el-tag
              v-for="tag in tags"
              :key="tag.username"
              closable
              size="mini"
              :type="tag.type"
              @close="handleClose(tag)"
            >
              {{ tag.username }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item v-if="temp.msgNotifyObjCode === 'roles'" label="指定角色" prop="roleName">
          <el-select v-model="temp.roleName" placeholder="请选择" @change="roleChange">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item" class="filter-item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="(temp.msgNotifyObjCode === 'roles' && (temp.roleName==='一级老师' || temp.roleName==='学员') )|| temp.msgNotifyObjCode === 'classs'" label="选择班级" prop="classTypeAndClass">
          <el-button size="small" type="primary" plain @click="classChoiceSetting()">选择班级+
          </el-button>
          <div
            v-if="temp.classTypeAndClass && temp.classTypeAndClass.length>0"
            style="width: 500px;height:210px;border:1px solid #DCDFE6;padding: 10px 20px;margin-top: 10px;color: #606266;overflow: auto;"
          >
            <el-row>
              <el-col :span="12">标签</el-col>
              <el-col :span="12">班级名称</el-col>
            </el-row>
            <el-row v-for="item in temp.classTypeAndClass">
              <el-col :span="12">{{ item.typeName }}</el-col>
              <el-col :span="12"><span v-for="(ite,index) in item.classList">{{ item.classList && item.classList.length==index+1?ite.className:(ite.className+ '，') }}</span>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item v-if="temp.msgNotifyObjCode === 'roles' && temp.roleName==='一级老师'" label="题型" prop="classSubjectIdss">
          <el-checkbox-group v-model="temp.classSubjectIdss">
            <el-checkbox v-for="item in subjectTypes" :key="item.id" :label="item.id">{{ item.typeName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知时间" prop="notifiedType">
          <el-radio-group v-model="temp.notifiedType">
            <el-radio v-for="item in notifiedTypes" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode">{{ item.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.notifiedType === '1'" label="定时时间" prop="notifiedTime">
          <el-date-picker v-model="temp.notifiedTime" type="datetime" :picker-options="expireTimeOption" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        </el-form-item>
        <el-form-item label="启用必读时长" prop="mustRead">
          <el-radio-group v-model="temp.mustRead">
            <el-radio v-for="item in mustReads" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode">{{ item.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.mustRead === '1'" label="必读时长" prop="mustReadTime">
          <el-input v-model="temp.mustReadTime" placeholder="请输入必读时长" type="number" />
        </el-form-item>
        <el-form-item v-if="temp.mustRead === '1'" label="有效时间" prop="mustReadDueTime">
          <el-date-picker v-model="temp.mustReadDueTime" type="datetime" :picker-options="expireTimeOption" placeholder="请选择有效时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        </el-form-item>
        <el-form-item label="通知正文" prop="msgContent" class="msgContentClass">
          <comment-editor ref="666s" :key="'666s'" :content="msgContent" :max-length="10000" :editable="true" @content-change="onZongPingChange" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="inPperation" @click="dialogStatus==='create'?createData('0'):updateData('0')">
          保存
        </el-button>
        <el-button type="primary" :disabled="inPperation" @click="dialogStatus==='create'?addPublishMsg():updatePublishMsg()">
          发布
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看详情" :visible.sync="dialogFormVisible1">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 420px; margin-left:50px;">
        <el-form-item label="消息标题" prop="msgTitle">
          <el-input v-model="temp.msgTitle" placeholder="请输入" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="消息内容" prop="msgContent">
          <el-input v-model="temp.msgContent" placeholder="请输入消息内容" :disabled="disabled" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="发布人" prop="sendUserName">
          <el-input v-model="temp.sendUserName" placeholder="请输入发布人" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="计划发送时间">
          <el-date-picker v-model="temp.publishTime" :disabled="disabled" type="datetime" placeholder="选择日期" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        </el-form-item>
        <el-form-item label="优先级" prop="msgLevelCode">
          <el-radio v-model="temp.msgLevelCode" label="1" :disabled="disabled">高</el-radio>
          <el-radio v-model="temp.msgLevelCode" label="2" :disabled="disabled">中</el-radio>
          <el-radio v-model="temp.msgLevelCode" label="3" :disabled="disabled">低</el-radio>
        </el-form-item>
        <el-form-item label="消息类型" prop="msgTypeCode">
          <el-radio v-model="temp.msgTypeCode" label="1" :disabled="disabled">系统消息</el-radio>
          <el-radio v-model="temp.msgTypeCode" label="2" :disabled="disabled">通知公告</el-radio>
          <el-radio v-model="temp.msgTypeCode" label="3" :disabled="disabled">作业消息</el-radio>
        </el-form-item>
        <el-form-item label="通知方式" prop="msgNotifyTypeCode1">
          <el-checkbox v-model="msgNotifyTypeCode1" label="1" :disabled="disabled">PC</el-checkbox>
          <el-checkbox v-model="msgNotifyTypeCode1" label="2" :disabled="disabled">短信</el-checkbox>
          <el-checkbox v-model="msgNotifyTypeCode1" label="3" :disabled="disabled">微信</el-checkbox>
        </el-form-item>
        <el-form-item label="通知对象">
          <el-radio v-model="temp.msgNotifyObjCode" label="USER" :disabled="disabled" @change="displayUsers">指定用户</el-radio>
          <el-radio v-model="temp.msgNotifyObjCode" label="roles" :disabled="disabled" @change="displayRoles">指定角色</el-radio>
          <el-radio v-model="temp.msgNotifyObjCode" label="classs" :disabled="disabled" @change="displayClasss">指定班级</el-radio>
          <el-radio v-model="temp.msgNotifyObjCode" label="ALL" :disabled="disabled" @change="displayAll">全体用户</el-radio>
        </el-form-item>
        <el-form-item v-if="thisUserIds" label="指定用户"><span><el-button type="primary" size="mini">请选择指定用户</el-button></span>
          <div class="app-container">
            <el-tag
              v-for="tag in tags"
              :key="tag.username"
              closable
              size="mini"
              :type="tag.type"
              :disabled="disabled"
            >
              {{ tag.username }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item v-if="thisRoleIds" label="指定角色">
          <el-select v-model="value1" multiple placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" :disabled="disabled" class="filter-item" />
          </el-select>
        </el-form-item>
        <div v-if="thisClasssIds">
          <el-form-item label="班级标签">
            <el-checkbox-group
              v-model="classTypeIds"
              :min="0"
              :max="1"
              style="width: 750px;"
              :disabled="disabled"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="item in classTypes" :key="item.id" :value="item" :label="item">{{ item.typeName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="班级">
            <el-checkbox-group
              v-model="classsxz"
              :min="0"
              :max="1"
              style="width: 750px;"
              :disabled="disabled"
              @change="classhandleCheckedCitiesChange"
            >
              <el-checkbox v-for="item in classs" :key="item.id" :label="item">{{ item.className }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="题型">
            <el-radio-group v-model="subjectTypeIds" style="width: 750px;" @change="subjectTypehandleCheckedCitiesChange">
              <el-radio v-for="item in subjectTypes" :key="item.id" :label="item" :value="item.id" :disabled="disabled">{{ item.typeName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="指定班级角色">
            <el-select v-model="value1" multiple placeholder="请选择" :disabled="disabled">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" :disabled="disabled" class="filter-item" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="消息详情" :visible.sync="dialogFormVisible2" width="80%" center style="height: 1100px">
      <div>
        <el-row class="rowStytle">
          <el-col :span="2" class="msgtit">
            通知标题：
          </el-col>
          <el-col :span="22">
            {{ row.msgTitle }}
          </el-col>
        </el-row>
        <el-row class="rowStytle">
          <el-col :span="2" class="msgtit">
            通知时间：
          </el-col>
          <el-col :span="4">
            {{ row.notifiedTime }}
          </el-col>
          <el-col :span="3" class="msgtit">
            是否启用必读时长：
          </el-col>
          <el-col :span="2">
            {{ row.mustRead==='0'?'否':'是' }}
          </el-col>
          <el-col :span="2" class="msgtit">
            必读时长：
          </el-col>
          <el-col :span="3">
            {{ row.mustReadTime?row.mustReadTime:'-' }}
          </el-col>
          <el-col :span="2" class="msgtit">
            有效时间：
          </el-col>
          <el-col :span="6">
            {{ row.mustReadDueTime?row.mustReadDueTime:'-' }}
          </el-col>
        </el-row>
        <el-row class="rowStytle">
          <el-col :span="2" class="msgtit">
            通知正文：
          </el-col>
          <el-col :span="21">
            <comment-editor :key="'777s'" :content="unescape(row.msgContent)" :editable="false" :max-length="10000" @content-change="rowMsgContentChange" />
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="listLoading1"
        :data="msgRecordList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        height="300px"
        style="width: 100%"
      >
        <el-table-column align="center" label="用户账号">
          <template slot-scope="scope">
            {{ scope.row.receiveUserName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="通知方式" prop="msgNotifyTypeCode" :formatter="msgNotifyTypeCodeFormat" />
        <el-table-column label="读取状态" align="center" prop="status" :formatter="statusCodeFormat" />
        <el-table-column label="读取时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.readTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total1>0" :total="total1" :page.sync="msgRecordListQuery.current" :limit.sync="msgRecordListQuery.size" @pagination="findMsgNotes" />
    </el-dialog>
    <el-dialog title="指定用户" :visible.sync="dialogFormVisible3" width="80%" @open="handleData">
      <el-row>
        <el-col :span="6"><div class="grid-content bg-purple">
          <div class="app-container">
            <span style="font-size: 15px;">用户管理</span>
            <el-input
              v-model="filterText"
              style="margin-top: 10px;"
              placeholder="输入关键字进行过滤"
            />
            <el-tree
              ref="tree"
              v-loading="userListLoading"
              class="filter-tree"
              style="width: 100%;font-size: 18px"
              :data="officeList"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="treeClick"
            />
          </div>
        </div>
        </el-col>
        <el-col :span="18"><div class="grid-content bg-purple-light">
          <div class="app-container">
            <div class="filter-container">
              <el-input v-model="userListQuery.username" placeholder="用户名" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter3" />
              <el-input v-model="userListQuery.nickname" placeholder="昵称" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter3" />
              <el-input v-model="userListQuery.phone" placeholder="手机号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter3" />
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter3">
                查询
              </el-button>
            </div>
            <el-table
              ref="multipleTable"
              :data="userList"
              style="width: 100%"
              height="400px"
              class="huad"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                label="勾选"
                width="55px"
              />
              <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                  {{ scope.$index }}
                </template>
              </el-table-column>
              <el-table-column
                prop="username"
                label="用户名"
              />
              <el-table-column
                prop="nickname"
                label="昵称"
              />
              <el-table-column
                prop="phone"
                label="手机号"
              />
            </el-table>
            <pagination v-show="userTotal>0" :total="userTotal" :page.sync="userListQuery.current" :limit.sync="userListQuery.size" :page-sizes="[50, 100, 150, 200]" @pagination="handleData" />
          </div>
        </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">
          取消
        </el-button>
        <el-button type="primary" @click="addUsers">
          确定
        </el-button>
      </div>
    </el-dialog>
    <classTypeAndClass
      :father-class-choice.sync="classChoice"
      :page-list-by-class-type="getPageListByClassTypes"
      :class-type-and-class="getClassAndClassType"
      :get-hw-homework-class-ref="getHwHomeworkClassRefList"
      @classListsss="classLists"
    />

    <el-dialog title="选择作业" :visible.sync="homeworkVisible" width="80%" @open="openHomework" @opened="openedHomework" @close="closeHomework">
      <div class="filter-container">
        <el-table
          ref="multipleHomeworkTable"
          v-loading="homeworkListLoading"
          class="dan huad"
          :data="homeworkList"
          border
          highlight-current-row
          height="500px"
          :row-key="getKey"
          @selection-change="handleSelectionHomeworkChange"
        >
          <el-table-column
            type="selection"
            label="勾选"
            width="55"
            :reserve-selection="true"
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
            width="200"
          />
          <el-table-column
            prop="startTime"
            label="作业开始时间"
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
            width="500"
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
            width="500"
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
        </el-table>
        <pagination
          v-show="homeworkTotal>0"
          :total="homeworkTotal"
          :page.sync="homeworkListQuery.current"
          :limit.sync="homeworkListQuery.size"
          @pagination="fetchHomeworkListData"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getClassAndClassTypeList, getPageListByClassType } from '@/api/homework/hwClassType'
import { getUserList } from '@/api/system/users'
import { getSysMsgList, createSysMsg, updateSysMsg, deleteSysMsg, getRoleList, getParentCodeTrees, publishMsg, findByUser, findMsgNotes, cancelMsg, findUsersByIds, getSysMsgDetails, getListByConfigMilestone } from '@/api/system/sysMsg'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import CommentEditor from '@/views/homework/submissions/CommentEditor'
import classTypeAndClass from '@/views/homework/newClassTypeAndClass.vue'
import { gethwHomeworkList } from '@/api/homework/hwHomework'
export default {
  name: 'UserMgn',
  components: { Pagination, CommentEditor, classTypeAndClass },
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
      homeworkListQuery: {
        current: 1
      },
      classTypeAndClass: [],
      disabled: true,
      e: null,
      f: null,
      msgContent: undefined,
      tags: [],
      msgNotifyTypeCode1: [],
      value1: [],
      classTypeIds: [],
      classsxz: [],
      classs: [],
      classTypes: [],
      subjectTypeIds: {},
      mustReads: [],
      subjectTypes: [],
      statusCodes: [],
      msgTypeCodes: [], // 消息类型
      msgLevelCodes: [], // 消息优先级
      msgNofityTypeCodes: [], // 通知方式
      msgNofityObjCodes: [], // 通知对象
      msgReadStatusCodes: [], // 读取状态
      msgStatusCodes: [], // 消息发布状态
      thisUserIds: false,
      thisRoleIds: false,
      thisClasssIds: false,
      list: null,
      officeList: null,
      userList: null,
      roleList: null,
      configIds: [],
      uids: null,
      uList: null,
      msgRecordList: null,
      listLoading: true,
      listLoading1: true,
      userListLoading: true,
      total: 0,
      total1: 0,
      userTotal: 0,
      listQuery: {
        current: 1,
        msgTitle: '',
        msgContent: '',
        sendUserName: '',
        msgTypeCode: '1',
        mustRead: undefined
      },
      roleListQuery: {
        state: '1',
        current: 1,
        size: 200
      },
      msgRecordListQuery: {
        receiveUserName: '',
        readTime: '',
        msgId: '',
        status: '',
        current: 1
      },
      listClassQuery: {
        current: 1,
        typeName: undefined,
        status: undefined,
        remarks: undefined
      },
      userListQuery: {
        current: 1,
        size: 50,
        officeId: undefined,
        username: undefined,
        nickname: undefined,
        phone: undefined
      },
      classChoice: false,
      listQueryClassType: {
        current: 1,
        typeName: undefined,
        status: undefined,
        remarks: undefined
      },
      homeworkVisible: false,
      temp: {
        configId: undefined,
        hyperLinks: undefined,
        homeworkList: [],
        classSubjectIdss: [],
        homeworkIds: undefined,
        id: '',
        mustRead: '0',
        classTypeIds: '',
        classSubjectIds: undefined,
        notifiedType: undefined,
        mustReadTime: undefined,
        classTypeAndClass: [],
        mustReadDueTime: undefined,
        notifiedTime: undefined,
        msgTitle: '',
        roleName: undefined,
        roleId: undefined,
        msgContent: '',
        sendUserId: '',
        msgTypeCode: '',
        sendUserName: '',
        msgNotifyTypeCodes: [],
        msgNotifyTypeCode: '',
        msgNotifyObjCode: '',
        publishTime: '',
        roleIds: '',
        status: '',
        multipleSelection: [],
        classTypeName: undefined, // 班级标签名称
        classTypeId: undefined, // 班级标签id
        classId: undefined,
        className: undefined,
        subjectTypeId: undefined, // 题目类型id
        subjectTypeName: undefined // 题型名称
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: '请选择'
      },
      listHwHomeworkClassRef: [],
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
      filterText: '',
      row: {},
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogStatus: '',
      inPperation: false,
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      homeworkMultipleSelection: [],
      homeworkList: [],
      homeworkListLoading: false,
      homeworkTotal: 0,
      msgNotifyObjCodes: [],
      notifiedTypes: [],
      rules: {
        msgTitle: [{ required: true, message: '请输入消息标题', trigger: 'blur' }],
        msgTypeCode: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
        msgNotifyTypeCodes: [{ required: true, message: '请选择通知方式', trigger: 'change' }],
        msgNotifyObjCode: [{ required: true, message: '请选择通知对象', trigger: 'change' }],
        roleName: [{ required: true, message: '请选择角色', trigger: 'change' }],
        classTypeAndClass: [{ required: true, message: '请添加班级', trigger: 'change' }],
        classSubjectIdss: [{ required: true, message: '请选择题型', trigger: 'change' }],
        notifiedType: [{ required: true, message: '请选择通知时间', trigger: 'change' }],
        notifiedTime: [{ required: true, message: '请选择定时时间', trigger: 'change' }],
        mustRead: [{ required: true, message: '请选择是否启用必读时长', trigger: 'blur' }],
        mustReadTime: [{ required: true, message: '请输入必读时长', trigger: 'blur' }],
        mustReadDueTime: [{ required: false, message: '请选择有效时间', trigger: 'blur' }, { validator: this.validateMustReadDueTime }],
        msgContent: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
        configId: [{ required: true, message: '请选择微信消息模板', trigger: 'blur' }]
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.mustReads = getDictDataList('is_enable')
    this.msgNotifyObjCodes = getDictDataList('sys_msg_nofity_obj')
    this.notifiedTypes = getDictDataList('sys_notified_type')
    this.statusCodes = getDictDataList('sys_msg_read_status')
    this.msgTypeCodes = getDictDataList('sys_msg_type')
    this.msgLevelCodes = getDictDataList('sys_msg_level')
    this.msgNofityTypeCodes = getDictDataList('sys_msg_nofity_type')
    this.msgNofityObjCodes = getDictDataList('sys_msg_nofity_obj')
    this.msgReadStatusCodes = getDictDataList('sys_msg_read_status')
    this.msgStatusCodes = getDictDataList('sys_msg_status')
    this.fetchData()
    this.findByUser()
  },
  methods: {
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
    xueyuan(row) {
      return row.stu + '/' + row.ytj + '/' + row.ypg + '/' + row.yfp
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
    openHomework() {

    },
    openedHomework() {
      this.fetchHomeworkListData()
    },
    closeHomework() {
      this.temp.homeworkIds = ''
      const that = this
      if (this.homeworkMultipleSelection) {
        this.homeworkMultipleSelection.forEach(function(a) {
          that.temp.homeworkIds = that.temp.homeworkIds + a.id + ','
        })
      }
      if (this.temp.homeworkIds.length > 0) {
        this.temp.homeworkIds = this.temp.homeworkIds.substring(0, this.temp.homeworkIds.lastIndexOf(','))
      }
    },
    fetchHomeworkListData() {
      this.homeworkList = []
      this.toggleSelection(this.homeworkMultipleSelection)
      this.homeworkListLoading = true
      this.homeworkListQuery.state = 1
      gethwHomeworkList(this.homeworkListQuery).then(response => {
        this.homeworkList = response.data.records
        this.homeworkTotal = parseInt(response.data.total)
        this.homeworkListLoading = false
      })
    },
    toggleSelection(rows) {
      if (this.$refs.multipleHomeworkTable) {
        this.$refs.multipleHomeworkTable.clearSelection()
        const that = this
        this.$nextTick(() => {
          if (rows) {
            rows.forEach(row => {
              that.$refs.multipleHomeworkTable.toggleRowSelection(row, true)
            })
          }
        })
      }
    },
    handleSelectionHomeworkChange(val) {
      this.homeworkMultipleSelection = val
    },
    getKey(row) {
      return row.id
    },
    homeworkSetting() {
      this.homeworkVisible = true
    },
    validateMustReadDueTime(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (this.temp.notifiedType === '1') {
        if (this.temp.notifiedTime) {
          if (new Date(this.temp.notifiedTime).getTime() >= new Date(value).getTime()) {
            callback('有效时间不能小于定时时间')
          } else {
            callback()
          }
        } else {
          callback('请先选择定时时间')
        }
      } else {
        callback()
      }
    },
    async getPageListByClassTypes(data) {
      const ddd = await getPageListByClassType(data)
      return ddd
    },
    async getClassAndClassType() {
      const ddd = await getClassAndClassTypeList(this.listQueryClassType)
      this.subjectTypes = ddd.data.allhwSubjectType
      return ddd.data.allClassAndClass
    },
    async getHwHomeworkClassRefList() {
      if (this.listHwHomeworkClassRef && this.listHwHomeworkClassRef.length > 0) {
        return this.listHwHomeworkClassRef
      } else {
        return []
      }
    },
    classLists(val) {
      const that = this
      that.listHwHomeworkClassRef = []
      this.temp.classTypeAndClass = val
      val.forEach(function(a, b) {
        a.classList.forEach(function(c, d) {
          const hwHomeworkClassRef = {}
          hwHomeworkClassRef['classTypeId'] = a.id
          hwHomeworkClassRef['classTypeName'] = a.typeName
          hwHomeworkClassRef['classId'] = c.id
          hwHomeworkClassRef['className'] = c.className
          that.listHwHomeworkClassRef.push(hwHomeworkClassRef)
        })
      })
      console.log(that.listHwHomeworkClassRef)
    },
    rowMsgContentChange(data) {

    },
    onZongPingChange(data) {
      this.temp.msgContent = data
    },
    addClosed() {
      this.resetTemp()
      this.listHwHomeworkClassRef = []
      this.userList = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    msgNotifyTypeCodesChange(val) {
      if (val.indexOf('2') === -1) {
        this.temp.configId = undefined,
        this.temp.hyperLinks = undefined
      }
    },
    fetchData() {
      this.listLoading = true
      this.list = []
      getSysMsgList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleFilter1() {
      this.msgRecordListQuery.page = 1
      console.log(this.msgRecordListQuery.msgId)
      this.findMsgNotes()
    },
    handleFilter3() {
      this.userListQuery.page = 1
      this.userListLoading = true
      this.handleData()
    },
    resetTemp() {
      this.temp = {
        configId: undefined,
        hyperLinks: undefined,
        id: '',
        homeworkList: [],
        homeworkIds: undefined,
        mustRead: '0',
        classSubjectIdss: [],
        classSubjectIds: undefined,
        notifiedType: undefined,
        mustReadTime: undefined,
        classTypeAndClass: [],
        mustReadDueTime: undefined,
        notifiedTime: undefined,
        msgTitle: '',
        roleName: undefined,
        roleId: undefined,
        msgContent: '',
        sendUserId: '',
        msgTypeCode: '',
        sendUserName: '',
        msgNotifyTypeCodes: [],
        msgNotifyTypeCode: '',
        msgNotifyObjCode: '',
        publishTime: '',
        roleIds: '',
        status: '',
        multipleSelection: [],
        classTypeName: undefined, // 班级标签名称
        classTypeId: undefined, // 班级标签id
        classId: undefined,
        className: undefined,
        subjectTypeId: undefined, // 题目类型id
        subjectTypeName: undefined // 题型名称
      }
      this.classsxz = []
      this.classTypes = []
      this.tags = []
      this.value1 = []
      this.uids = null
    },
    handleCreate() {
      this.resetTemp()
      this.getRoleList()
      this.getWxConfig()
      this.temp.sendUserId = this.f
      this.temp.sendUserName = this.e
      this.displayAll()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getWxConfig() {
      getListByConfigMilestone('5').then(res => {
        if (res.success) {
          this.configIds = res.data
        }
      })
    },
    createData(status) {
      this.temp.status = status
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.inPperation = true
          this.setMsgNotifyTypeCodesData()
          if (this.temp.msgNotifyObjCode === 'roles') {
            if (this.temp.roleName === '一级老师') {
              // 组装标签，班级，题型数据
              this.setClassAndClassTypeData()
              this.temp.classSubjectIds = ''
              this.temp.classSubjectIdss.forEach(a => {
                this.temp.classSubjectIds = this.temp.classSubjectIds + a + ','
              })
              if (this.temp.classSubjectIds && this.temp.classSubjectIds.length > 0) {
                this.temp.classSubjectIds = this.temp.classSubjectIds.substring(0, this.temp.classSubjectIds.lastIndexOf(','))
              }
            }
            if (this.temp.roleName === '学员') {
              // 组装班级，标签数据
              this.setClassAndClassTypeData()
            }
          } else if (this.temp.msgNotifyObjCode === 'user') {
            // 组装学员数据
            this.setUserIdsData()
          } else if (this.temp.msgNotifyObjCode === 'homework') {
            // 组装作业数据
          } else if (this.temp.msgNotifyObjCode === 'classs') {
            // 组装班级，标签数据
            this.setClassAndClassTypeData()
          }
          createSysMsg(this.temp).then(res => {
            // this.list.unshift(this.temp)
            if (res.success) {
              this.listQuery.msgTypeCode = this.temp.msgTypeCode
              this.fetchData()
              this.dialogFormVisible = false
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
          }).finally(() => {
            this.inPperation = false
          })
        }
      })
    },
    setMsgNotifyTypeCodesData() {
      const that = this
      const msgNotifyTypeCodes = new Set()
      this.temp.msgNotifyTypeCode = ''
      if (this.temp.msgNotifyTypeCodes) {
        this.temp.msgNotifyTypeCodes.forEach(function(a) {
          msgNotifyTypeCodes.add(a)
        })
      }
      if (msgNotifyTypeCodes.size > 0) {
        msgNotifyTypeCodes.forEach(function(a) {
          that.temp.msgNotifyTypeCode = that.temp.msgNotifyTypeCode + a + ','
        })
      }
      if (this.temp.msgNotifyTypeCode.length > 0) {
        this.temp.msgNotifyTypeCode = this.temp.msgNotifyTypeCode.substring(0, this.temp.msgNotifyTypeCode.lastIndexOf(','))
      }
    },
    setUserIdsData() {
      const that = this
      const userIds = new Set()
      this.temp.userIds = ''
      if (this.tags) {
        this.tags.forEach(function(a) {
          userIds.add(a.id)
        })
      }
      if (userIds.size > 0) {
        userIds.forEach(function(a) {
          that.temp.userIds = that.temp.userIds + a + ','
        })
      }
      if (this.temp.userIds.length > 0) {
        this.temp.userIds = this.temp.userIds.substring(0, this.temp.userIds.lastIndexOf(','))
      }
    },
    setClassAndClassTypeData() {
      const that = this
      this.temp.classTypeIds = ''
      this.temp.classIds = ''
      const classTypeIds = new Set()
      const classIds = new Set()
      this.listHwHomeworkClassRef.forEach(function(a, b) {
        classTypeIds.add(a.classTypeId)
        classIds.add(a.classId)
      })
      if (classTypeIds.size > 0) {
        classTypeIds.forEach(function(c, d) {
          that.temp.classTypeIds = that.temp.classTypeIds + c + ','
        })
      }
      if (classIds.size > 0) {
        classIds.forEach(function(c, d) {
          that.temp.classIds = that.temp.classIds + c + ','
        })
      }
      if (this.temp.classTypeIds.length > 0) {
        this.temp.classTypeIds = this.temp.classTypeIds.substring(0, this.temp.classTypeIds.lastIndexOf(','))
      }
      if (this.temp.classIds.length > 0) {
        this.temp.classIds = this.temp.classIds.substring(0, this.temp.classIds.lastIndexOf(','))
      }
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      const that = this
      getListByConfigMilestone('5').then(res => {
        if (res.success) {
          this.configIds = res.data
          getRoleList(this.roleListQuery).then(response => {
            this.roleList = response.data.records
            this.dialogFormVisible = true
            // 根据id获取详情数据，根据通知对象组装不同的数据
            getSysMsgDetails(row.id).then(res => {
              if (res.success) {
                const data = res.data
                this.msgContent = this.unescape(data.sysMsgQueryVo.msgContent)
                /* this.listHwHomeworkClassRef = data.listHwHomeworkClassRef*/
                if (data.sysMsgQueryVo.msgNotifyTypeCode) {
                  data.sysMsgQueryVo.msgNotifyTypeCodes = data.sysMsgQueryVo.msgNotifyTypeCode.split(',')
                }
                if (data.sysMsgQueryVo.msgNotifyObjCode === 'roles') {
                  const obj = this.roleList.find(item => item.id === data.sysMsgQueryVo.roleIds)
                  data.sysMsgQueryVo.roleIds = obj.id
                  data.sysMsgQueryVo.roleId = obj.id
                  data.sysMsgQueryVo.roleName = obj.name
                  if (data.sysMsgQueryVo.roleName === '一级老师') {
                    data.sysMsgQueryVo.classTypeAndClass = data.allClassAndClass
                    data.sysMsgQueryVo.classTypeAndClass.forEach(function(a) {
                      a.classList = a.listClass
                    })
                    this.classLists(data.sysMsgQueryVo.classTypeAndClass)
                    // 题型
                    if (data.sysMsgQueryVo.classSubjectIds) {
                      data.sysMsgQueryVo.classSubjectIdss = data.sysMsgQueryVo.classSubjectIds.split(',')
                    }
                  }
                  if (data.sysMsgQueryVo.roleName === '学员') {
                    data.sysMsgQueryVo.classTypeAndClass = data.allClassAndClass
                    data.sysMsgQueryVo.classTypeAndClass.forEach(function(a) {
                      a.classList = a.listClass
                    })
                    this.classLists(data.sysMsgQueryVo.classTypeAndClass)
                  }
                }
                if (data.sysMsgQueryVo.msgNotifyObjCode === 'classs') {
                  data.sysMsgQueryVo.classTypeAndClass = data.allClassAndClass
                  data.sysMsgQueryVo.classTypeAndClass.forEach(function(a) {
                    a.classList = a.listClass
                  })
                  this.classLists(data.sysMsgQueryVo.classTypeAndClass)
                }
                if (data.sysMsgQueryVo.msgNotifyObjCode === 'homework') {
                  this.homeworkMultipleSelection = data.homeworkMultipleSelection
                }
                if (data.sysMsgQueryVo.msgNotifyObjCode === 'user') {
                  this.tags = data.userList
                }
                const tempData = Object.assign({}, this.temp, data.sysMsgQueryVo)
                this.temp = tempData
              }
            })
          })
        }
      })
    },
    updateData(status) {
      this.temp.status = status
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.inPperation = true
          this.setMsgNotifyTypeCodesData()
          if (this.temp.msgNotifyObjCode === 'roles') {
            if (this.temp.roleName === '一级老师') {
              // 组装标签，班级，题型数据
              this.setClassAndClassTypeData()
              this.temp.classSubjectIds = ''
              this.temp.classSubjectIdss.forEach(a => {
                this.temp.classSubjectIds = this.temp.classSubjectIds + a + ','
              })
              if (this.temp.classSubjectIds && this.temp.classSubjectIds.length > 0) {
                this.temp.classSubjectIds = this.temp.classSubjectIds.substring(0, this.temp.classSubjectIds.lastIndexOf(','))
              }
            }
            if (this.temp.roleName === '学员') {
              // 组装班级，标签数据
              this.setClassAndClassTypeData()
            }
          } else if (this.temp.msgNotifyObjCode === 'user') {
            // 组装学员数据
            this.setUserIdsData()
          } else if (this.temp.msgNotifyObjCode === 'homework') {
            // 组装作业数据
          } else if (this.temp.msgNotifyObjCode === 'classs') {
            // 组装班级，标签数据
            this.setClassAndClassTypeData()
          }
          updateSysMsg(this.temp).then(res => {
            // this.list.unshift(this.temp)
            if (res.success) {
              this.listQuery.msgTypeCode = this.temp.msgTypeCode
              this.fetchData()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
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
          }).finally(() => {
            this.inPperation = false
          })
        }
      })
    },
    handleDelete(row) {
      if (row.status === '1') {
        this.$message({
          message: '消息已发布,不能删除!',
          type: 'warning'
        })
        return false
      }
      this.temp.id = row.id // copy obj
      deleteSysMsg(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    rest() { // 重置功能
      this.listQuery.current = 1
      this.listQuery.msgTitle = ''
      this.listQuery.msgContent = ''
      this.listQuery.sendUserName = ''
      this.listQuery.mustRead = undefined
      this.fetchData()
    },
    rest1() {
      this.msgRecordListQuery.status = ''
      this.findMsgNotes()
    },
    close() {
      this.dialogFormVisible2 = false
      this.msgRecordListQuery.status = ''
    },
    displayUsers() {
      // this.findUserList()
      this.getParentTree()
      if (this.temp.msgNotifyObjCode === 'USER') {
        this.thisUserIds = true
        this.thisRoleIds = false
        this.thisClasssIds = false
      }
    },
    displayRoles() {
      this.getRoleList()
      if (this.temp.msgNotifyObjCode === 'roles') {
        this.thisRoleIds = true
        this.thisUserIds = false
        this.thisClasssIds = false
      }
    },
    displayClasss() {
      this.getRoleList()
      this.findByClasss()
      if (this.temp.msgNotifyObjCode === 'classs') {
        this.thisClasssIds = true
        this.thisUserIds = false
        this.thisRoleIds = false
      }
    },
    displayAll() {
      if (this.temp.msgNotifyObjCode === 'ALL') {
        this.thisUserIds = false
        this.thisRoleIds = false
        this.thisClasssIds = false
      }
    },
    lookMsg(row) { // 查看消息
      this.temp = Object.assign({}, row) // copy obj
      this.msgNotifyTypeCode1 = []
      this.msgNotifyTypeCode1 = this.temp.msgNotifyTypeCode.split(',')
      this.value1 = []
      if (this.temp.roleIds.length > 0) {
        var roles = this.temp.roleIds.substring(0, this.temp.roleIds.length - 1)
        this.value1 = roles.split(',')
      }
      if (this.temp.classRoleIds.length > 0) {
        var classrRoles = this.temp.classRoleIds.substring(0, this.temp.classRoleIds.length - 1)
        this.value1 = classrRoles.split(',')
      }
      this.tags = []
      if (this.temp.userIds.length > 0) {
        this.findUsers(row)
      }
      this.displayRoles()
      this.displayUsers()
      this.displayClasss()
      this.displayAll()
      this.updateByClass(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible1 = true
    },
    addPublishMsg() { // 保存并发布消息
      this.createData('1')
    },
    updatePublishMsg() { // 修改并发布消息
      this.updateData('1')
    },
    publishMsg(row) { // 发布消息
      if (row.status === '1') {
        this.$message({
          message: '消息已发布,不能重复发布!',
          type: 'warning'
        })
        return false
      }
      this.temp.id = row.id // copy obj
      const loading = this.load('正在发布...', true)
      publishMsg(this.temp.id).then(res => {
        if (res.success) {
          this.fetchData()
          /*          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })*/
          loading.setText('发布成功')
        } else {
          loading.setText('发布失败')
        }
        setTimeout(() => {
          loading.close()
        }, 1000)
      })
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
    cancelMsg(row) { // 撤销消息
      if (row.status === '0') {
        this.$message({
          message: '消息还未发布,不能撤销!',
          type: 'warning'
        })
        return false
      }
      this.temp.id = row.id
      const loading = this.load('正在取消发布...', true)
      cancelMsg(this.temp.id).then(res => {
        if (res.success) {
          this.fetchData()
          loading.setText('取消发布成功')
        } else {
          loading.setText('取消发布失败')
        }
        setTimeout(() => {
          loading.close()
        }, 1000)
        /*        this.$notify({
          title: '成功',
          message: '撤销成功',
          type: 'success',
          duration: 2000
        })*/
      })
    },
    lll() {
      this.msgContent = undefined
      this.$refs['666s'].editorData = ''
    },
    lookMsgNotes(row) { // 查看消息记录
      if (row.status === '0') {
        this.$message({
          message: '消息还未发布,没有消息记录!',
          type: 'warning'
        })
        return false
      }
      this.msgRecordListQuery.msgId = row.id
      this.findMsgNotes()
      this.row = row
      this.dialogFormVisible2 = true
    },
    findMsgNotes() {
      this.listLoading1 = true
      findMsgNotes(this.msgRecordListQuery).then(response => {
        this.msgRecordList = response.data.records
        this.total1 = parseInt(response.data.total)
        this.listLoading1 = false
      })
    },
    findByUser() { // 查询默认用户
      findByUser().then(response => {
        this.e = response.data.username
        this.f = response.data.id
      })
    },
    getRoleList() { // 获取启用状态的角色列表
      getRoleList(this.roleListQuery).then(response => {
        this.roleList = response.data.records
      })
    },
    findByClasss() { // 指定班级
      getClassAndClassTypeList(this.listClassQuery).then(response => {
        if (response.data.allClassAndClass !== undefined && response.data.allClassAndClass.length > 0) {
          this.classTypes = response.data.allClassAndClass
          if (this.classTypes.listClass !== undefined && this.classTypes.listClass.length > 0) {
            this.classs = this.classTypes.listClass
          }
          this.classTypeIds.push(response.data.allClassAndClass[0])
          this.temp.classTypeIds = response.data.allClassAndClass[0].id
          this.temp.classTypeName = response.data.allClassAndClass[0].typeName
          let ee = []
          this.classTypeIds.forEach(function(a) {
            if (a.listClass !== undefined && a.listClass.length > 0) {
              ee = a.listClass
            }
          })
          this.classs = ee
        }
        if (response.data.allhwSubjectType !== undefined && response.data.allhwSubjectType.length > 0) {
          this.subjectTypes = response.data.allhwSubjectType
        }
      })
    },
    updateByClass(row) {
      getClassAndClassTypeList(this.listQuery).then(response => {
        if (response.data.allClassAndClass !== undefined && response.data.allClassAndClass.length > 0) {
          this.classTypes = response.data.allClassAndClass
          let ee = []
          const gg = []
          this.classTypes.forEach(function(a) {
            if (row.classTypeIds === a.id) {
              gg.push(a)
              ee = a.listClass
            }
          })
          this.classTypeIds = gg
          this.classs = ee
          const kk = []
          ee.forEach(function(c) {
            if (c.id === row.classIds) {
              kk.push(c)
            }
          })
          this.classsxz = kk
        }
        let tt = {}
        if (response.data.allhwSubjectType !== undefined && response.data.allhwSubjectType.length > 0) {
          this.subjectTypes = response.data.allhwSubjectType
          this.subjectTypes.forEach(function(r) {
            if (row.classSubjectIds === r.id) {
              tt = r
            }
          })
          this.subjectTypeIds = tt
        }
      })
    },
    subjectTypehandleCheckedCitiesChange(value) {
      if (value !== undefined) {
        this.temp.classSubjectIds = value.id
        this.temp.subjectTypeName = value.typeName
      }
    },
    roleChange(val) {
      this.temp.roleId = val.id
      this.temp.roleIds = val.id
      this.temp.roleName = val.name
    },
    classChoiceSetting() {
      this.classChoice = true
    },
    classhandleCheckedCitiesChange(value) {
      if (value !== undefined && value.length > 0) {
        this.temp.classIds = value[0].id
        this.temp.className = value[0].className
      } else {
        this.temp.classIds = undefined
        this.temp.className = undefined
      }
    },
    handleCheckedCitiesChange(value) {
      const dd = this.classsxz
      const ee = []
      const cc = []
      if (value !== undefined && value.length > 0) {
        this.temp.classTypeIds = value[0].id
        this.temp.classTypeName = value[0].typeName
        value.forEach(function(a) {
          if (a.listClass !== undefined && a.listClass.length > 0) {
            a.listClass.forEach(function(b) {
              if (dd.length > 0) {
                dd.forEach(function(c) {
                  if (b.id === c.id) {
                    ee.push(b)
                  }
                })
              }
              cc.push(b)
            })
          }
        })
      } else {
        this.temp.classTypeName = undefined
        this.temp.classTypeIds = undefined
      }
      this.classs = cc
      this.classsxz = ee
    },
    getParentTree() { // 获取机构树结构
      getParentCodeTrees({}).then(response => {
        this.officeList = response.data
        this.listLoading1 = false
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    treeClick(val) {
      this.userListQuery.officeId = val.id
      this.handleData()
    },
    findUsersList() { // 查找指定用户集合
      getUserList(this.userListQuery).then(response => {
        console.log(response.data)
        this.userList = response.data.records
        this.userTotal = parseInt(response.data.total)
        this.userListLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    findUsers(row) {
      findUsersByIds(row.userIds).then(response => {
        this.tags = response.data
      })
    },
    switchObj(val) {
      this.temp.classIds = undefined
      this.temp.classTypeIds = undefined
      this.temp.classSubjectIds = undefined
      this.temp.classTypeAndClass = undefined
      this.listHwHomeworkClassRef = undefined
      this.temp.homeworkIds = undefined
      this.homeworkMultipleSelection = undefined
      this.temp.roleId = undefined
      this.temp.roleName = undefined
      this.temp.userIds = undefined
      this.userList = undefined
      this.tags = undefined
    },
    openUserList() {
      this.userListQuery.username = undefined
      this.dialogFormVisible3 = true
    },
    handleData() {
      if (this.uids != null) {
        findUsersByIds(this.uids).then(response => {
          this.uList = response.data
          console.log(this.uList)
          if (this.uList.length > 0) {
            getUserList(this.userListQuery).then(response => {
              this.userList = response.data.records
              console.log(this.userList)
              this.userTotal = parseInt(response.data.total)
              this.userListLoading = false
              this.$nextTick(() => {
                for (let i = 0; i < this.userList.length; i++) {
                  for (let j = 0; j < this.uList.length; j++) {
                    if (this.uList[j].id === this.userList[i].id) {
                      this.$refs.multipleTable.toggleRowSelection(this.userList[i], true)
                    }
                  }
                }
              })
            })
          }
        })
      } else {
        getUserList(this.userListQuery).then(response => {
          console.log(response.data)
          this.userList = response.data.records
          this.userTotal = parseInt(response.data.total)
          this.userListLoading = false
        })
      }
    },
    addUsers() { // 添加指定用户
      this.tags = []
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
      const tagsxz = this.tags
      const mm = {}
      const ee = []
      tagsxz.forEach(function(a, b) {
        mm[a['id']] = a
      })
      this.multipleSelection.forEach(function(c, d) {
        mm[c['id']] = c
      })
      for (var key in mm) { // 此处遍历map
        ee.push(mm[key])
      }
      const differenceSet = this.userList.filter(ea => this.multipleSelection.every(eb => eb.id !== ea.id))
      ee.forEach(function(n, m) {
        differenceSet.forEach(function(v, p) {
          if (n.id === v.id) {
            ee.splice(n, 1)
          }
        })
      })
      this.tags = ee
      this.dialogFormVisible3 = false
    },
    handleClose(tag) {
      const tagss = this.tags
      tagss.forEach(function(a, b) {
        if (a['id'] === tag.id) {
          tagss.splice(b, 1)
        }
      })
      // this.deleteSysUserRoleByMap(tag)
      this.$refs.multipleTable.toggleRowSelection(tag)
    },
    msgTypeCodeFormat(row) {
      let vv = '-'
      const typ = this.msgTypeCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.msgTypeCode) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    msgNotifyObjCodeFormat(row) {
      let vv = '-'
      const typ = this.msgNofityObjCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.msgNotifyObjCode) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    statusFormat(row) {
      let vv = '-'
      const typ = this.msgStatusCodes
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
    statusCodeFormat(row) {
      let vv = '-'
      const typ = this.msgReadStatusCodes
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
    msgNotifyTypeCodeFormat(row) {
      let vv = ''
      const typ = this.msgNofityTypeCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      let msgNotifyTypes = []
      msgNotifyTypes = row.msgNotifyTypeCode.split(',')
      typ.forEach(function(aa, bb) {
        for (let i = 0; i < msgNotifyTypes.length; i++) {
          if (aa.dictValue === msgNotifyTypes[i]) {
            vv += aa.dictLabel + ','
          }
        }
      })
      return vv.substring(0, vv.length - 1)
    }
  }
}
</script>
<style scoped>
  /deep/ .document-editor .editable-container{
    overflow-y: auto !important;
  }

  /deep/ .document-editor .editable-container .ck-editor__editable {
    height: 200px;
  }

  /deep/ .el-radio__label {
     overflow: inherit;
  }

  /deep/ .adds .el-dialog__body{
    height: 700px;
    overflow-y: auto;
  }
  .rowStytle{
    margin-bottom: 18px;
  }
  .msgtit{
    font-weight: 900;
  }

  .extra {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
  }
  /deep/ .huad .el-table__fixed {
    height:auto !important;
    bottom:17px;
    position: absolute;
    top: 0;
    left: 0;
  }

  /deep/ .pagination-container{
    overflow-x: auto;
  }
  /deep/ .el-dialog{
    margin-top: 6vh !important;
  }

  /deep/ .msgContentClass .el-form-item__content{
    line-height: 20px;
  }
</style>
<style>
  .el-tooltip__popper{
    max-width: 500px;
  }
</style>
