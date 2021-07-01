<template>
  <div class="app-container">
    <div class="app-container1">
      <el-form ref="dataForm" :rules="rules" label-position="left" :model="temp" label-width="140px">
        <h2>作业信息</h2>
        <el-divider style="margin-top: 0px" />
        <el-form-item label="题目名称" prop="subjectName">
          <el-input v-model="temp.subjectName" placeholder="请输入题目名称" :style="selectwidthz" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="作业开始时间">
          <el-date-picker
            v-model="temp.startTime"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :disabled="chakan"
          />
        </el-form-item>
        <el-form-item label="作业提交截止时间" prop="endTime">
          <el-date-picker
            v-model="temp.endTime"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :disabled="chakan"
          />
        </el-form-item>
        <el-form-item label="老师批改截止时间" prop="auditEndTime">
          <el-date-picker
            v-model="temp.auditEndTime"
            :picker-options="start_Date"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :disabled="chakan"
          />
        </el-form-item>
        <el-form-item label="学生追问截止时间" prop="qaEndTime">
          <el-date-picker
            v-model="temp.qaEndTime"
            :picker-options="start_DateEndTime"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            :disabled="chakan"
          />
        </el-form-item>
        <el-form-item v-show="!quote" label="发布班级" prop="classTypeId">
          <el-button v-show="!chakan" size="small" type="primary" plain :disabled="chakan" @click="classChoiceSetting()">选择班级+
          </el-button>
          <div
            v-if="classTypeAndClass.length>0"
            style="width: 500px;height:210px;border:1px solid #DCDFE6;padding: 10px 20px;margin-top: 10px;color: #606266;overflow: auto;"
          >
            <el-row>
              <el-col :span="12">标签</el-col>
              <el-col :span="12">班级名称</el-col>
            </el-row>
            <el-row v-for="item in classTypeAndClass">
              <el-col :span="12">{{ item.typeName }}</el-col>
              <el-col :span="12"><span v-for="(ite,index) in item.classList">{{ item.classList.length==index+1?ite.className:(ite.className+ '，') }}</span>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="关联作业" prop="relatedHomeworkId">
          <el-button v-if="!temp.relatedHomeworkId" size="small" type="primary" plain :disabled="chakan" @click="homeworkSetting()">选择作业+
          </el-button>
          <el-tag v-else @click="!chakan?homeworkSetting():''">{{ temp.relatedHomeworkName }}</el-tag>
        </el-form-item>
        <!--        <el-form-item label="发布班级" prop="classTypeId">-->
        <!--          <el-radio-group v-model="classTypeIdss" @change="handleCheckedCitiesChange">-->
        <!--            <el-radio v-for="item in classTypes" :key="item.id" :value="item" :label="item">{{ item.typeName }}</el-radio>-->
        <!--          </el-radio-group>-->
        <!--          <el-checkbox-group
            v-model="classTypeIds"
            :min="0"
            :max="1"
            :disabled="chakan"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox v-for="item in classTypes" :key="item.id" :value="item" :label="item" :disabled="chakan">{{ item.typeName }}</el-checkbox>
          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="班级" prop="classId">-->
        <!--          <el-checkbox-group-->
        <!--            v-model="classsxz"-->
        <!--            :disabled="chakan"-->
        <!--            @change="classhandleCheckedCitiesChange"-->
        <!--          >-->
        <!--            <el-checkbox v-for="item in classs" :key="item.id" :label="item" :disabled="chakan">{{ item.className }}</el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <el-form-item label="题型" prop="subjectTypeId">
          <el-radio-group v-model="subjectTypeIds" @change="subjectTypehandleCheckedCitiesChange">
            <el-radio v-for="item in subjectTypes" :key="item.id" :label="item" :value="item.id" :disabled="chakan">{{
              item.typeName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <h2>其他信息</h2>
        <el-divider style="margin-top: 0px" />
        <el-form-item label="作业说明">
          <el-input v-model="temp.completeExplain" type="textarea" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="材料">
          <el-upload
            class="upload-demo"
            :action="doUpload"
            :headers="myHeaders"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :on-remove="tests"
            :file-list="fileList"
            :disabled="chakan"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <!--accept=".jpg,.pdf,.PDF,.xls,.xlsx,.docx,.doc"-->
            <el-button v-show="!chakan" size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <h2>配置信息</h2>
        <el-divider style="margin-top: 0px" />
        <el-form-item label="启用图片批改" prop="isContentType">
          <el-radio-group v-model="temp.isContentType" :style="selectwidthz">
            <el-radio
              v-for="item in isSyss"
              :key="item.dictValue"
              :label="item.dictValue"
              :value="item.dictValue"
              :disabled="chakan"
            >{{ item.dictLabel }}
            </el-radio>
          </el-radio-group>
          <!-- @change="testt(temp.isQa,['qaNumber'])"-->
        </el-form-item>
        <el-form-item label-width="0px" prop="subScoreCount">
          <!--          <el-form-item label="子分数个数" label-width="120px">
            <el-input v-model="temp.subScoreCount" placeholder="请输入子分数个数" :style="selectwidthz" :disabled="chakan" />
          </el-form-item>-->
          <el-form-item label="子分数配置" label-width="120px">
            <el-table
              ref="singleTable"
              :data="temp.tableData"
              style="width: 40%"
              border
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"
              />
              <el-table-column
                label="子分数名称"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.'+scope.$index + '.name'" :rules="rules.name" style="height: 16px">
                    <el-input v-model="scope.row.name" class="biaoge" :disabled="chakan" @blur="cece()" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="子分数"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.'+scope.$index + '.score'" :rules="rules.score" style="height: 16px">
                    <el-input v-model="scope.row.score" class="biaoge" :disabled="chakan" @blur="cece()" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="50" align="center">
                <template slot-scope="scope">
                  <i v-if="!chakan" title="删除" class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" @click="handleDelete(scope.$index, scope.row)" />
                </template>
              </el-table-column>
            </el-table>
            <el-button v-show="!chakan" type="primary" size="mini" @click="addLine">新增</el-button>
          </el-form-item>
          <el-form-item label="启用追问" prop="isQa">
            <el-radio-group v-model="temp.isQa" :style="selectwidthz">
              <el-radio
                v-for="item in isSyss"
                :key="item.dictValue"
                :label="item.dictValue"
                :value="item.dictValue"
                :disabled="chakan"
              >{{ item.dictLabel }}
              </el-radio>
            </el-radio-group>
            <!-- @change="testt(temp.isQa,['qaNumber'])"-->
          </el-form-item>

          <el-form-item v-show="temp.isQa === '0'?false:true" label="追问配置" label-width="120px">
            <el-table
              ref="qaTable"
              :data="temp.qaTableData"
              style="width: 40%"
              border
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"
              />
              <el-table-column
                label="字数"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item :prop="'qaTableData.'+scope.$index + '.num'" :rules="rules.num" style="height: 16px">
                    <el-input v-model="scope.row.num" class="biaoge" :disabled="chakan" @blur="cece()" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="50" align="center">
                <template slot-scope="scope">
                  <i v-if="!chakan" title="删除" class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" @click="qaHandleDelete(scope.$index, scope.row)" />
                </template>
              </el-table-column>
            </el-table>
            <el-button v-show="!chakan" type="primary" size="mini" @click="addLineQa">新增</el-button>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-row :gutter="20" style="margin-right: 0px">
              <el-col :span="8">
                <el-form-item label="启用系统提醒" prop="isRemind">
                  <el-radio-group v-model="temp.isRemind" :style="selectwidthz">
                    <el-radio
                      v-for="item in isSyss"
                      :key="item.dictValue"
                      :label="item.dictValue"
                      :value="item.dictValue"
                      :disabled="chakan"
                      @change="testt(temp.isRemind,['sysCycle'])"
                    >{{ item.dictLabel }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item
                  label="提醒频率"
                  :prop="temp.isRemind==1?'sysCycle':''"
                  :required="temp.isRemind==0?false:true "
                  label-width="120px"
                >
                  <el-select
                    v-model="temp.sysCycle"
                    placeholder="请选择提醒频率"
                    clearable
                    class="filter-item"
                    :style="selectwidthz"
                    :disabled="chakan"
                  >
                    <el-option
                      v-for="item in sysCycles"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="chakan"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-row :gutter="20" style="margin-right: 0px">
              <el-col :span="8">
                <el-form-item label="启用微信提醒">
                  <el-radio-group v-model="temp.isWxremind">
                    <el-radio
                      v-for="item in isSyss"
                      :key="item.dictValue"
                      :label="item.dictValue"
                      :value="item.dictValue"
                      :disabled="chakan"
                      @change="testt(temp.isWxremind,['wxremindTime1','wxremindTime2'])"
                    >{{
                      item.dictLabel }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="截止前（小时）"
                  :prop="temp.isWxremind==1?'wxremindTime1':''"
                  :required="temp.isWxremind==0?false:true "
                  label-width="120px"
                >
                  <el-input v-model="temp.wxremindTime1" placeholder="请输入小时" :disabled="chakan" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="截止前（小时）"
                  :prop="temp.isWxremind==1?'wxremindTime2':''"
                  :required="temp.isWxremind==0?false:true "
                  label-width="120px"
                >
                  <el-input v-model="temp.wxremindTime2" placeholder="请输入小时" :disabled="chakan" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-row :gutter="20" style="margin-right: 0px">
              <el-col :span="8">
                <el-form-item label="启用短信提醒" prop="isSys">
                  <el-radio-group v-model="temp.isMsg">
                    <el-radio
                      v-for="item in isSyss"
                      :key="item.dictValue"
                      :label="item.dictValue"
                      :value="item.dictValue"
                      :disabled="chakan"
                      @change="testt(temp.isMsg,['msgTime1','msgTime2'])"
                    >{{ item.dictLabel }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="截止前（小时）"
                  :prop="temp.isMsg==1?'msgTime1':''"
                  :required="temp.isMsg==0?false:true "
                  label-width="120px"
                >
                  <el-input v-model="temp.msgTime1" placeholder="请输入小时" :disabled="chakan" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="截止前（小时）"
                  :prop="temp.isMsg==1?'msgTime2':''"
                  :required="temp.isMsg==0?false:true "
                  label-width="120px"
                >
                  <el-input v-model="temp.msgTime2" placeholder="请输入小时" :disabled="chakan" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="!chakan" style="text-align:right;padding-right: 10px">
            <el-button
              v-show="!quote"
              type="primary"
              icon="el-icon-check"
              @click="dialogStatus==='create'?createData('0'):updateData('0')"
            >
              保存
            </el-button>
            <el-button v-show="!quote" icon="el-icon-check" type="primary" @click="fabuqian">
              发布
            </el-button>

            <!--            <el-button icon="el-icon-close">
              关闭
            </el-button>-->
          </el-form-item>
        </el-form-item></el-form>
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="fabuVisible" width="600px">
        <!--<div class="del-dialog-cnt">您将发布 {{ tishiyu }} 的作业，请确认后发布！</div>-->
        <div style="font-size: 16px;font-weight: 800;">您将发布作业：</div><br>
        <div>
          <span style="font-weight: 700">题目名称：</span>{{ temp.subjectName }}
        </div><br>
        <div>
          <span style="font-weight: 700">作业提交截止时间：</span>{{ temp.endTime }}
        </div><br>
        <div>
          <span style="font-weight: 700">老师批改截止时间：</span>{{ temp.auditEndTime }}
        </div><br>
        <div v-for="(item ,index) in classTypeAndClass" style="width: 100%; overflow:auto; height:70px">
          <div style="height: 1em;">
            <el-row>
              <el-col :span="6">
                <span style="font-weight: 700">
                  标签{{ index+1 }}（{{ item.typeName }}）：
                </span>
              </el-col>
              <el-col :span="18">
                <div v-for="(ite,index) in item.classList" style="float: left;margin-right: 10px;line-height: 1.5em">
                  {{ item.classList.length==index+1?ite.className:(ite.className+ '，') }}
                </div>
              </el-col>
            </el-row>
          </div><br>
        </div>
        <div style="font-size: 16px;font-weight: 800;margin-top: 20px">
          请确认是否发布！
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fabuVisible = false">取 消</el-button>
          <el-button :disabled="kongzhi" type="primary" @click="dialogStatus==='create'?createData('1'):updateData('1')">发布</el-button>
        </span>
      </el-dialog>
      <classTypeAndClass
        :father-class-choice.sync="classChoice"
        :page-list-by-class-type="getPageListByClassTypes"
        :class-type-and-class="getClassAndClassType"
        :get-hw-homework-class-ref="getHwHomeworkClassRefList"
        @classListsss="classLists"
      />
      <el-dialog title="关联作业列表" :visible.sync="homeworkVisible" :append-to-body="true" width="80%" @open="openHomework" @opened="openedHomework" @close="closeHomework">
        <div class="filter-container">
          <el-table
            ref="multipleTable"
            v-loading="homeworkListLoading"
            class="dan"
            :data="homeworkList"
            border
            highlight-current-row
            height="500px"
            :row-key="getKey"
            @select-all="selectAll"
            @selection-change="handleSelectionChange"
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
                    <div v-if="scope.row.className" class="extras">
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
                    <div v-if="scope.row.teacherNames" class="extras">
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
            @pagination="fetchData"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { gethwHomeworkList, createhwHomework, updatehwHomework, getAllHwHomeworkMaterial } from '@/api/homework/hwHomework'
import {
  getClassAndClassTypeList,
  getPageListByClassType,
  getHwHomeworkClassRefListByHomeworkId
} from '@/api/homework/hwClassType'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import { getConfigData } from '@/utils/configDataUtils'
import { getToken } from '@/utils/auth'
import { dialogFormRules } from '@/utils/validate'
import classTypeAndClass from '@/views/homework/classTypeAndClass'
import { isNum } from '@/utils/validate'
import Pagination from '@/components/Pagination'
// 让data数据在创建阶段透传到全局变量
export default {
  name: 'UserMgn',
  directives: { waves },
  components: {
    classTypeAndClass,
    Pagination
  },
  props: {
    quote: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      homeworkList: [],
      homeworkTotal: 0,
      homeworkListLoading: false,
      homeworkVisible: false,
      homeworkListQuery: {
        current: 1
      },
      homeworkMultipleSelection: [],
      kongzhi: false,
      defaultNames: [],
      qaDefaultNumbers: 0,
      maxScoreCount: 10,
      defaultScore: 10,
      maxQaCount: 10,
      minScoreCount: 3,
      minQaCount: 3,
      fabuVisible: false,
      classChoice: false,
      start_Date: {
        disabledDate: time => {
          return time.getTime() + (1000 * 60 * 60 * 24) <= new Date(this.temp.endTime).getTime()
        }
      },
      start_DateEndTime: {
        disabledDate: time => {
          return time.getTime() + (1000 * 60 * 60 * 24) <= new Date(this.temp.auditEndTime).getTime()
        }
      },
      classTypeAndClass: [],
      listOne: [],
      listTwo: [],
      listThi: [],
      listHwHomeworkClassRef: [], // 题目班级标签关联数据
      myHeaders: {},
      doUpload: '/hwHomeworkMaterial/import',
      chakan: false,
      sysCycles: [{ label: '1天', value: 1 }, { label: '2天', value: 2 }],
      fileList: [],
      statuss: [], // 状态
      statusQueryParam: {},
      subjectTypes: [],
      isSyss: [],
      subjectTypeIds: {},
      delVisible: false,
      rowrows: [],
      multipleSelection: [],
      list: null,
      listLoading: true,
      classTypeIds: [],
      classTypeIdss: {},
      classsxz: [],
      total: 0,
      deleteor: 'delete',
      classTypes: [],
      classs: [],
      listQuery: {
        current: 1,
        typeName: undefined,
        status: undefined,
        remarks: undefined
      },
      temp: {
        isContentType: '0',
        tableData: [],
        qaTableData: [],
        qaEndTime: undefined,
        subScoreCount: 3,
        subScores: undefined,
        subjectName: undefined, // 题目名称
        startTime: undefined, // 开始时间
        endTime: undefined, // 结束时间
        auditEndTime: undefined, // 批改时间
        classTypeName: undefined, // 班级标签名称
        classTypeId: undefined, // 班级标签id
        classId: undefined,
        relatedHomeworkId: undefined,
        relatedHomeworkName: undefined,
        className: undefined,
        subjectTypeId: undefined, // 题目类型id
        subjectTypeName: undefined, // 题型名称
        completeExplain: undefined,
        isQa: '1', // 启用追问
        qaNumber: 1, // 追问次数
        isRemind: '1', // 启用系统提醒
        sysCycle: 1, // 系统提醒周期
        isWxremind: '1', // 是否微信提醒
        wxremindTime1: 12, // 微信提醒时间1
        wxremindTime2: 32,
        isMsg: '1', // 是否短信提醒
        msgTime1: 12, // 短信提醒时间
        msgTime2: 32,
        subjectState: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        subjectName: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
        score: [{ required: true, message: '请输入子分数', trigger: 'submit' }, { validator: isNum, trigger: 'submit' }],
        name: [{ required: true, message: '请填写子分数名称', trigger: 'submit' }],
        num: [{ required: true, message: '请输入追问字数上限', trigger: 'submit' }],
        endTime: [{ required: true, message: '请选择作业提交截止时间', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.updateAuditEndTime
        }],
        auditEndTime: [{ required: true, message: '请选择作业批改截止时间', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.updateQaEndTime
        }],
        qaEndTime: [{ required: true, message: '请选择追问截止时间', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.updateQaEnd
        }],
        classTypeId: [{ trigger: 'submit', validator: this.listHwHomeworkClassRefpd }],
        classId: [{ required: true, message: '请选择班级', trigger: 'blur', validator: this.classIdValidator }],
        subjectTypeId: [{ required: true, message: '请选择题型', trigger: 'blur' }],
        qaNumber: [{ required: true, message: '请输入追问次数', trigger: 'blur' }, {
          validator: dialogFormRules,
          trigger: 'blur'
        }],
        sysCycle: [{ required: true, message: '请选择题型频率', trigger: 'blur' }],
        wxremindTime1: [{ required: true, message: '请输入小时', trigger: 'blur' }],
        wxremindTime2: [{ required: true, message: '请输入小时', trigger: 'blur' }],
        msgTime1: [{ required: true, message: '请输入小时', trigger: 'blur' }],
        msgTime2: [{ required: true, message: '请输入小时', trigger: 'blur' }]
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
  created() {
    this.maxScoreCount = getConfigData('homework_score_max_num')
    this.maxQaCount = getConfigData('homework_qa_max_num')
    this.minScoreCount = getConfigData('homewor_score_default_num')
    this.minQaCount = getConfigData('homewor_qa_default_num')
    const defaultName = getConfigData('homewor_score_default_name')
    this.defaultNames = defaultName.configValue.split(',')
    console.log(getConfigData('homework_default_score'))
    this.defaultScore = new Number(getConfigData('homework_default_score').configValue)
    const qaDefaultNumberss = getConfigData('homewor_qa_default_numbers')
    this.qaDefaultNumbers = qaDefaultNumberss.configValue
    this.statuss = getDictDataList('hw_class_type_status')
    if (!this.quote) {
      const row = this.$route.query.row
      if (row === undefined) {
        this.handleCreate()
      } else {
        const pd = this.$route.query.pd
        this.handleUpdate(row, pd)
      }
    } else {
      this.handleCreate()
    }
  },
  mounted() {
    const token = getToken()
    this.myHeaders = { token: token }
    this.statuss = getDictDataList('hw_class_type_status')
    this.subjectStates = getDictDataList('hw_homework_status')
    this.auditStates = getDictDataList('hw_homework_audit_status')
    this.repeatStates = getDictDataList('hw_homework_reaudit_status')
    this.isSyss = getDictDataList('sys_yes_no')
  },
  methods: {
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
    selectAll(val) {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.homeworkMultipleSelection = val[val.length - 1]
        const objs = []
        objs.push(this.homeworkMultipleSelection)
        this.toggleSelection(objs)
      } else {
        this.homeworkMultipleSelection = val[0]
      }
    },
    getKey(row) {
      return row.id
    },
    toggleSelection(rows) {
      this.$refs.multipleTable.clearSelection()
      const that = this
      if (rows) {
        rows.forEach(row => {
          that.$refs.multipleTable.toggleRowSelection(row, true)
        })
      }
    },
    openHomework() {
      this.fetchData()
    },
    openedHomework() {

    },
    closeHomework() {
      if (this.homeworkMultipleSelection) {
        this.temp.relatedHomeworkId = this.homeworkMultipleSelection.id
        this.temp.relatedHomeworkName = this.homeworkMultipleSelection.subjectName
      } else {
        this.temp.relatedHomeworkId = undefined
        this.temp.relatedHomeworkName = undefined
      }
    },
    fetchData() {
      this.homeworkListLoading = true
      this.homeworkListQuery.state = 1
      gethwHomeworkList(this.homeworkListQuery).then(response => {
        this.homeworkList = response.data.records
        this.homeworkTotal = parseInt(response.data.total)
        this.homeworkListLoading = false
        this.$nextTick(() => {
          if (this.temp.relatedHomeworkId) {
            const obj = this.homeworkList.find(item => item.id === this.temp.relatedHomeworkId)
            const objs = []
            objs.push(obj)
            this.toggleSelection(objs)
          }
        })
      })
    },
    transmissionUpdateDate(row, pd) {
      const that = this
      if (!row.hwHomework.id) {
        this.listOne = row.hwHomeworkMaterialYNParam.listOne
        this.listTwo = row.hwHomeworkMaterialYNParam.listTwo
        this.listThi = row.hwHomeworkMaterialYNParam.listThi
        if (row.fileList && row.fileList.length > 0) {
          this.fileList = row.fileList
        } else {
          // 判断是否有id
          if (row.hwHomework.id) {
            this.getFileList(row.hwHomework.id)
          }
        }
        this.temp = row.hwHomework
        // 编辑状态下获取选中的题型
        // 如果说数据中存在，就直接沿用，如果存在就对比确定
        if (row.subjectTypeIds) {
          this.subjectTypeIds = row.subjectTypeIds
        } else {
          this.subjectTypes.forEach(function(r) {
            if (row.hwHomework.subjectTypeId === r.id) {
              that.subjectTypeIds = r
            }
          })
        }
      } else {
        this.handleUpdate(row.hwHomework, pd)
      }
    },
    transmissionDate(state) {
      this.temp.subjectState = state
      let obj
      if (this.temp.tableData.length < 1) {
        this.$message.error('最少需要配置一个子分数')
        this.kongzhi = false
        return false
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const ll = {}
          ll['listOne'] = this.listOne
          ll['listTwo'] = this.listTwo
          ll['listThi'] = this.listThi
          ll['listHwHomeworkClassRef'] = this.listHwHomeworkClassRef
          let scoreNames = ''
          let scores = ''
          this.temp.tableData.forEach(function(a, b) {
            scoreNames = scoreNames + a.name + ','
            scores = scores + a.score + ','
          })
          scoreNames = scoreNames.substring(0, scoreNames.lastIndexOf(','))
          scores = scores.substring(0, scores.lastIndexOf(','))
          this.temp.subScoreCount = scoreNames
          this.temp.subScores = scores
          if (this.temp.isQa === '1') {
            let qaNumbers = ''
            this.temp.qaTableData.forEach(function(a, b) {
              qaNumbers = qaNumbers + a.num + ','
            })
            qaNumbers = qaNumbers.substring(0, qaNumbers.lastIndexOf(','))
            this.temp.qaNumber = qaNumbers
          } else {
            this.temp.qaNumber = ''
          }
          this.temp = Object.assign({}, this.temp)
          obj = { hwHomework: this.temp, hwHomeworkMaterialYNParam: ll, subjectTypeIds: this.subjectTypeIds, fileList: this.fileList }
        }
      })
      return obj
    },
    eliminate() {
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    settingTime(obj) {
      this.temp.startTime = obj.hwHomeworkGroup.groupStartTime
      this.temp.endTime = obj.hwHomeworkGroup.groupEndTime
      this.temp.auditEndTime = obj.hwHomeworkGroup.groupAuditEndTime
      this.temp.qaEndTime = obj.hwHomeworkGroup.groupQaEndTime
    },
    handleExceed() {
      this.$message.error('超出最大上传数')
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('附件大小不得大于20M')
        return isLt20M
      }
    },
    initializationTable(num) {
      const tableData = []
      for (let i = 1; i < num + 1; i++) {
        tableData.push({ name: this.defaultNames[i - 1], score: this.defaultScore })
      }
      this.temp.tableData = tableData
    },
    initializationQaTable(num) {
      const qaTableData = []
      for (let i = 1; i < num + 1; i++) {
        qaTableData.push({ num: this.qaDefaultNumbers })
      }
      this.temp.qaTableData = qaTableData
    },
    addLine() { // 添加行数
      if (this.temp.tableData.length >= parseInt(this.maxScoreCount.configValue)) {
        this.$message.error('无法添加，最大子分数个数为' + this.maxScoreCount.configValue + '个')
      } else {
        var newValue = {
          name: '',
          score: this.defaultScore
        }
        // 添加新的行数
        this.temp.tableData.push(newValue)
        console.log(this)
      }
    },
    addLineQa() { // 添加行数
      if (this.temp.qaTableData.length >= parseInt(this.maxQaCount.configValue)) {
        this.$message.error('无法添加，最大追问次数为' + this.maxQaCount.configValue + '次')
      } else {
        var newValue = {
          num: ''
        }
        // 添加新的行数
        this.temp.qaTableData.push(newValue)
        console.log(this)
      }
    },
    handleDelete(index) { // 删除行数
      /*      if (this.temp.tableData.length <= parseInt(this.minScoreCount.configValue)) {
          this.$message.error('无法删除，默认子分数个数为' + parseInt(this.minScoreCount.configValue) + '个')
        } else {*/
      this.temp.tableData.splice(index, 1)
      /*      }*/
    },
    qaHandleDelete(index) {
      // 删除行数
      this.temp.qaTableData.splice(index, 1)
    },
    cece() {
      console.log(this)
    },
    fabuqian() {
      if (this.temp.tableData.length < 1) {
        this.$message.error('最少需要配置一个自分数')
        return false
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 题目名称，作业提交截止时间XXX，老师批改截止时间XX， 标签1：班级A、班级B；标签2：班级a
          this.fabuVisible = true
        }
      })
    },
    listHwHomeworkClassRefpd(rule, value, callback) {
      if (this.quote) {
        callback()
      } else if (this.listHwHomeworkClassRef.length < 1) {
        callback(new Error('请选择标签和班级'))
      } else {
        callback()
      }
    },
    classLists(val) {
      const that = this
      that.listHwHomeworkClassRef = []
      this.classTypeAndClass = val
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
    classChoiceSetting() {
      this.classChoice = true
    },
    homeworkSetting() {
      this.homeworkVisible = true
    },
    updateAuditEndTime(rule, value, callback) {
      if (this.temp.auditEndTime) {
        if (new Date(this.temp.auditEndTime).getTime() <= new Date(this.temp.endTime).getTime()) {
          this.temp.auditEndTime = undefined
          this.temp.qaEndTime = undefined
          callback(new Error('老师批改截止时间需要大于作业提交截止时间'))
          return false
        }
      }
      callback()
    },
    updateQaEndTime(rule, value, callback) {
      if (this.temp.auditEndTime) {
        if (new Date(this.temp.auditEndTime).getTime() <= new Date(this.temp.endTime).getTime()) {
          this.temp.auditEndTime = undefined
          this.temp.qaEndTime = undefined
          callback(new Error('老师批改截止时间需要大于作业提交截止时间'))
          return false
        }
      } else {
        callback(new Error('请选择老师批改截止时间'))
        return false
      }

      if (this.temp.qaEndTime) {
        if (new Date(this.temp.qaEndTime).getTime() <= new Date(this.temp.auditEndTime).getTime()) {
          this.temp.qaEndTime = undefined
          callback(new Error('学生追问截止时间需要大于老师批改截止时间'))
          return false
        }
      }
      callback()
    },
    updateQaEnd(rule, value, callback) {
      if (this.temp.qaEndTime) {
        if (new Date(this.temp.qaEndTime).getTime() <= new Date(this.temp.auditEndTime).getTime()) {
          this.temp.qaEndTime = undefined
          callback(new Error('学生追问截止时间需要大于老师批改截止时间'))
          return false
        }
      } else {
        callback(new Error('请选择追问截止时间'))
        return false
      }
      callback()
    },
    classIdValidator(rule, value, callback) {
      if (this.temp.classId) {
        callback()
      } else {
        callback(new Error('只能为数字'))
      }
    },
    testt(value, names) {
      if (value === 0) {
        if (this.temp[names[0]] === undefined) {
          for (var i = 0; i < names.length; i++) {
            this.temp[names[i]] = ''
          }
          return false
        } else {
          for (var i = 0; i < names.length; i++) {
            this.temp[names[i]] = undefined
          }
        }
      } else {

      }
    },
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.fileList.push({ name: res.data.materialName, url: res.data.materialAddress })
        if (res.data.id !== undefined) {
          this.listOne.push({
            homeworkId: this.temp.id,
            materialName: res.data.materialName,
            materialAddress: res.data.materialAddress
          })
        }
      }
    },
    handleAvatarError(res, file) {
      this.fileList = []
      this.$message('导入失败')
    },
    async getClassAndClassType() {
      const ddd = await getClassAndClassTypeList(this.listQuery)
      return ddd.data.allClassAndClass
    },
    async getHwHomeworkClassRefList() {
      if (this.temp.id) {
        const res = await getHwHomeworkClassRefListByHomeworkId(this.temp.id)
        return res.data
      }
      return []
    },
    async getPageListByClassTypes(data) {
      const ddd = await getPageListByClassType(data)
      return ddd
    },
    getFileList(id) {
      getAllHwHomeworkMaterial(id).then(res => {
        if (res.data !== undefined && res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.fileList.push({
              id: res.data[i].id,
              name: res.data[i].materialName,
              url: res.data[i].materialAddress
            })
          }
        }
      })
    },
    handleUpdate(row, pd) {
      this.temp = row
      if (pd === 'info') {
        this.chakan = true
      } else {
        this.chakan = false
      }
      getClassAndClassTypeList(this.listQuery).then(response => {
        if (response.data.allClassAndClass !== undefined && response.data.allClassAndClass.length > 0) {
          // 初始化数据标签类型
          this.classTypes = response.data.allClassAndClass
          // 初始化班级数据
          let ee = []
          // 选中的标签数据
          let gg = {}
          if (row.classTypeId) {
            response.data.allClassAndClass.forEach(function(a, b) {
              if (a.id === row.classTypeId) {
                gg = a
                ee = a.listClass
                return
              }
            })
          }
          // 选中的班级数组
          const classsxz = []
          if (row.classId) {
            ee.forEach(function(a, b) {
              if (row.classId.indexOf(a.id) !== -1) {
                classsxz.push(a)
              }
            })
          }
          this.classs = ee
          this.classTypeIdss = gg
          this.classsxz = classsxz
        }
        let tt = {}
        if (response.data.allhwSubjectType !== undefined && response.data.allhwSubjectType.length > 0) {
          this.subjectTypes = response.data.allhwSubjectType
          this.subjectTypes.forEach(function(r) {
            if (row.subjectTypeId === r.id) {
              tt = r
            }
          })
          this.subjectTypeIds = tt
        }
        this.getFileList(row.id)
        let scoreNameArrs = []
        if (row.subScoreCount) {
          scoreNameArrs = row.subScoreCount.split(',')
        }
        let scores = []
        if (row.subScores) {
          scores = row.subScores.split(',')
        }

        const tabelData = []
        scoreNameArrs.forEach(function(aa, bb) {
          tabelData.push({ name: aa, score: scores[bb] })
        })
        this.temp.tableData = tabelData
        const qaTabelData = []
        if (row.qaNumber) {
          const qaNumbers = row.qaNumber.split(',')
          qaNumbers.forEach(function(aa, bb) {
            qaTabelData.push({ num: aa })
          })
        }
        this.temp.qaTableData = qaTabelData
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.usernameDisabled = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    beforeRemove(file, fileList) {
      if (file.id !== undefined) {
        this.listTwo.push({ id: file.id, materialName: file.name, materialAddress: file.url })
      } else {
        this.listThi.push({ materialName: file.name, materialAddress: file.url })
      }
    },
    tests(file, fileList) {
      this.fileList = fileList
      var kk = []
      this.fileList.forEach(function(a) {
        if (a.id === undefined) {
          kk.push({ materialName: a.name, materialAddress: a.url })
        }
      })
      this.listOne = kk
    },
    subjectTypehandleCheckedCitiesChange(value) {
      if (value !== undefined) {
        this.temp.subjectTypeId = value.id
        this.temp.subjectTypeName = value.typeName
      }
    },
    classhandleCheckedCitiesChange(value) {
      let classid = ''
      let className = ''
      if (value !== undefined && value.length > 0) {
        value.forEach(function(a, b) {
          classid = classid + a.id + ','
          className = className + a.className + ','
        })
        this.temp.classId = classid
        this.temp.className = className
      } else {
        this.temp.classId = undefined
        this.temp.className = undefined
      }
    },
    handleCheckedCitiesChange(value) {
      this.classTypeIdss = value
      const ee = []
      const cc = []
      if (value !== undefined) {
        this.temp.classTypeId = value.id
        this.temp.classTypeName = value.typeName
        let classId = ''
        let className = ''
        const a = value
        if (a.listClass !== undefined && a.listClass.length > 0) {
          a.listClass.forEach(function(b) {
            classId = classId + b.id + ','
            className = className + b.className + ','
            ee.push(b)
            cc.push(b)
          })
        }
        this.temp.classId = classId
        this.temp.className = className
      } else {
        this.temp.classTypeName = undefined
        this.temp.classTypeId = undefined
      }
      this.classs = cc
      this.classsxz = ee
    },
    resetTemp() {
      this.temp = {
        isContentType: '0',
        qaEndTime: undefined,
        subScoreCount: 3,
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
        isQa: '1', // 启用追问
        qaNumber: 1, // 追问次数
        isRemind: '1', // 启用系统提醒
        sysCycle: 1, // 系统提醒周期
        isWxremind: '1', // 是否微信提醒
        wxremindTime1: 12, // 微信提醒时间1
        wxremindTime2: 32,
        isMsg: '1', // 是否短信提醒
        msgTime1: 12, // 短信提醒时间
        msgTime2: 32
      }
      this.classsxz = []
      this.classTypes = []
      this.initializationTable(parseInt(this.minScoreCount.configValue))
      this.initializationQaTable(parseInt(this.minQaCount.configValue))
      this.fileList = []
      this.listOne = []
      this.listTwo = []
      this.listThi = []
      this.subjectTypeIds = {}
    },
    handleCreate() {
      this.resetTemp()
      getClassAndClassTypeList(this.listQuery).then(response => {
        if (response.data.allClassAndClass !== undefined && response.data.allClassAndClass.length > 0) {
          this.classTypes = response.data.allClassAndClass
          this.classTypeIdss = response.data.allClassAndClass[0]
          this.temp.classTypeId = response.data.allClassAndClass[0].id
          this.temp.classTypeName = response.data.allClassAndClass[0].typeName
          let ee = []
          if (this.classTypeIdss.listClass !== undefined && this.classTypeIdss.listClass.length > 0) {
            ee = this.classTypeIdss.listClass
          }
          this.classs = ee
          this.classsxz = ee
          let classid = ''
          let className = ''
          if (ee !== undefined && ee.length > 0) {
            ee.forEach(function(a, b) {
              classid = classid + a.id + ','
              className = className + a.className + ','
            })
          }
          this.temp.classId = classid
          this.temp.className = className
        }
        if (response.data.allhwSubjectType !== undefined && response.data.allhwSubjectType.length > 0) {
          this.subjectTypes = response.data.allhwSubjectType
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.usernameDisabled = false
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    createData(state) {
      this.temp.subjectState = state
      if (this.temp.tableData.length < 1) {
        this.$message.error('最少需要配置一个子分数')
        this.kongzhi = false
        return false
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.kongzhi = true
          let val = '正在发布中...'
          let valend = '发布成功'
          if (state === '0') {
            val = '正在保存中...'
            valend = '保存成功'
          }
          const loading = this.load(val, true)
          const ll = {}
          ll['listOne'] = this.listOne
          ll['listTwo'] = this.listTwo
          ll['listThi'] = this.listThi
          ll['listHwHomeworkClassRef'] = this.listHwHomeworkClassRef
          let scoreNames = ''
          let scores = ''
          this.temp.tableData.forEach(function(a, b) {
            scoreNames = scoreNames + a.name + ','
            scores = scores + a.score + ','
          })
          scoreNames = scoreNames.substring(0, scoreNames.lastIndexOf(','))
          scores = scores.substring(0, scores.lastIndexOf(','))
          this.temp.subScoreCount = scoreNames
          this.temp.subScores = scores
          if (this.temp.isQa === '1') {
            let qaNumbers = ''
            this.temp.qaTableData.forEach(function(a, b) {
              qaNumbers = qaNumbers + a.num + ','
            })
            qaNumbers = qaNumbers.substring(0, qaNumbers.lastIndexOf(','))
            this.temp.qaNumber = qaNumbers
          } else {
            this.temp.qaNumber = ''
          }

          createhwHomework({ hwHomework: this.temp, hwHomeworkMaterialYNParam: ll }).then(response => {
            loading.setText(valend)
            setTimeout(() => {
              loading.close()
            }, 1000)
            this.kongzhi = false
            this.fabuVisible = false
            /* if (response.success && this.temp.subjectState === '1') {*/
            if (response.success) {
              this.$router.push({
                path: '/system/homework/hwHomework'
              })
            }
            /*            this.$notify({
              title: '成功',
              message: '发布成功',
              type: 'success',
              duration: 1000
            })*/
          })
        }
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
    updateData(state) {
      this.temp.subjectState = state
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let val = '正在发布中...'
          let valend = '发布成功'
          if (state === '0') {
            val = '正在保存中...'
            valend = '保存成功'
          }
          const loading = this.load(val, true)
          this.kongzhi = true
          const tempData = Object.assign({}, this.temp)
          const ll = {}
          ll['listOne'] = this.listOne
          ll['listTwo'] = this.listTwo
          ll['listThi'] = this.listThi
          ll['homeworkId'] = this.temp.id
          ll['listHwHomeworkClassRef'] = this.listHwHomeworkClassRef
          let scoreNames = ''
          let scores = ''
          this.temp.tableData.forEach(function(a, b) {
            scoreNames = scoreNames + a.name + ','
            scores = scores + a.score + ','
          })
          scoreNames = scoreNames.substring(0, scoreNames.lastIndexOf(','))
          scores = scores.substring(0, scores.lastIndexOf(','))
          tempData.subScoreCount = scoreNames
          tempData.subScores = scores
          let qaNumbers = ''
          if (this.temp.isQa === '1') {
            this.temp.qaTableData.forEach(function(a, b) {
              qaNumbers = qaNumbers + a.num + ','
            })
            qaNumbers = qaNumbers.substring(0, qaNumbers.lastIndexOf(','))
          }
          tempData.qaNumber = qaNumbers
          updatehwHomework({ hwHomework: tempData, hwHomeworkMaterialYNParam: ll }).then(response => {
            loading.setText(valend)
            setTimeout(() => {
              loading.close()
            }, 1000)
            this.kongzhi = false
            /* if (response.success && this.temp.subjectState === '1') {*/
            if (response.success) {
              this.$router.push({
                path: '/system/homework/hwHomework'
              })
            }
            this.dialogFormVisible = false
            /*            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 1000
            })*/
          }).catch(error => {
            console.log('---- here???', error)
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .addForm {
    height: 830px;
    overflow: auto;
  }

  .el-upload-list {
    height: 70px;
    overflow: auto;
  }

  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .el-divider--horizontal {
    margin-top: 0px;
  }

  h2 {
    margin-bottom: 5px;
  }

  .app-container1 {
    padding-left: 100px;
    padding-right: 100px;
    padding-top: 0px;
  }
  .biaoge input{
    text-align: center;
  }

  /deep/ .el-table__fixed {
    height:auto !important;
    bottom:17px;
    position: absolute;
    top: 0;
    left: 0;
  }

  /deep/ .dan thead .el-checkbox{
    display: none;
  }

  .extras {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
  }

</style>
<style>
  .el-tooltip__popper{
    max-width: 500px;
  }
</style>
