<template>
  <div :class="succ?'external':'externalno'">
    <el-form
      ref="messageTeimplate"
      :rules="rules"
      :model="formData"
      label-position="left"
      label-width="100px"
    >
      <el-form-item v-if="succ" label="微信模板ID" prop="wxConfigId">
        <el-input v-model="formData.wxConfigId" :style="selectwidthz" />
      </el-form-item>
      <el-form-item label="消息内容" prop="configTemplate">
        <el-input v-model="formData.configTemplate" type="textarea" :rows="6" :style="selectwidthz" />
      </el-form-item>

      <div>
        <div class="ziduan">
          <el-button type="primary" @click="addLine">
            添加字段
          </el-button>
        </div>
        <div class="tab">
          <el-table
            v-loading="configLoading"
            :data="formData.tableData"
            element-loading-text="Loading"
            border
            fit
            height="373"
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column align="center" label="模板字段">
              <template slot-scope="scope">
                <el-form-item
                  class="juzhong"
                  :prop="'tableData.'+scope.$index + '.templateField'"
                  :rules="rules.templateField"
                >
                  <el-input v-model="scope.row.templateField" class="biaoge" placeholder="请输模板字段" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型">
              <template slot-scope="scope">
                <el-form-item
                  class="juzhong"
                  :prop="'tableData.'+scope.$index + '.type'"
                  :rules="rules.type"
                >
                  <el-select
                    v-model="scope.row.type"
                    style="width: 100%"
                    placeholder="请选择类型"
                    @change="handleTypeChange(scope.row)"
                  >
                    <el-option
                      v-for="item in objTypes"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="对应实体字段">
              <template slot-scope="scope">
                <el-form-item
                  class="juzhong"
                  :prop="'tableData.'+scope.$index + '.teimplateFiledObj'"
                  :rules="rules.teimplateFiledObj"
                >
                  <el-select
                    v-if="scope.row.type ==='0'"
                    v-model="scope.row.teimplateFiledObj"
                    style="width: 100%"
                    placeholder="请选择对应实体字段"
                    @change="handleConfigMilestoneChange(scope.row)"
                  >
                    <el-option
                      v-for="item in objFields"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                  <el-input v-else v-model="scope.row.teimplateFiledObj" class="biaoge" placeholder="请输模板字段" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <i
                  title="删除"
                  class="el-icon-delete"
                  style="color: #F56C6C;margin-left:10px;"
                  @click="handleDelete(scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="confirm">
          <el-button @click="cancel()">
            取消
          </el-button>
          <el-button type="primary" @click="submit()">
            确定
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'AddMessageTeimplateVue',
  props: {
    succ: {
      type: Boolean,
      default: true
    },
    configId: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      objFields: [],
      objTypes: [],
      configLoading: false,
      rules: {
        wxConfigId: [{ required: true, message: '微信模板ID', trigger: 'blur' }],
        configTemplate: [{ required: true, message: '消息模板', trigger: 'blur' }],
        templateField: [{ required: true, message: '请输模板字段', trigger: 'blur' }],
        teimplateFiledObj: [{ required: true, message: '请选择对应实体字段', trigger: 'change' }],
        type: [{ required: true, message: '请选择对应实体字段', trigger: 'change' }]
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
    this.objFields = getDictDataList('hw_message_obj_field')
    this.objTypes = getDictDataList('hw_message_obj_type')
  },
  methods: {
    closetep() {
      this.$nextTick(() => {
        this.$refs['messageTeimplate'].clearValidate()
      })
    },
    handleConfigMilestoneChange(row) {
      const filedObj = this.objFields.find(co => co.dictValue === row.teimplateFiledObj)
      row['teimplateFiledObjName'] = filedObj.dictLabel
    },
    handleTypeChange(row) {
      row['teimplateFiledObj'] = ''
      row['teimplateFiledObjName'] = ''
    },
    cancel() {
      this.$emit('cancel')
      this.closetep()
    },
    submit() {
      this.$refs['messageTeimplate'].validate((valid) => {
        if (valid) {
          this.formData.configId = this.configId
          this.$emit('submit', this.formData)
        }
      })
    },
    handleDelete(index) {
      this.formData.tableData.splice(index, 1)
    },
    addLine() { // 添加行数
      var newValue = {
        templateField: '',
        teimplateFiledObj: '',
        configId: this.configId,
        type: '0'
      }
      // 添加新的行数
      this.formData.tableData.push(newValue)
      console.log(this)
    }
  }
}
</script>

<style scoped>
  .ziduan {
    padding-bottom: 20px;
    padding-top: 20px;
    padding-left: 20px;
  }

  .external {
    width: 760px;
    height: 723px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .externalno {
    width: 760px;
    height: 673px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .tab {
    height: 373px;
  }

  .confirm {
    padding-top: 25px;
    padding-bottom: 25px;
    width: 200px;
    float: right;
  }

  .biaoge input {
    text-align: center;
  }

  /deep/ .juzhong .el-form-item__content {
    margin-left: 0px !important;
  }

  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    height: 6px;

  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }
</style>
