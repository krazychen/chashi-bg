<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.configName" placeholder="参数名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.configKey" placeholder="参数键名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.isSys" placeholder="是否系统" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in isSysCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>
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
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="参数名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.configName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数键名" width="180 ">
        <template slot-scope="scope">
          {{ scope.row.configKey }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数类型" width="70" :formatter="configTypeFormat" />
      <el-table-column align="center" label="参数值" :formatter="configValueFormat" />
      <el-table-column align="center" label="系统参数" width="70" prop="isSys" :formatter="isSysFormat" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-camera" title="查看" tooltip="true" style="color: #315FC2;margin-left:15px;" type="primary" @click="lookConfig(scope.row)" />
          <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleUpdate(scope.row)" />
          <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="temp.configType==='0'?rulesText:rulesPic" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="temp.configName" placeholder="请输入参数名称" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="temp.configKey" placeholder="请输入参数键名" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="参数类型" prop="configType">
          <el-radio-group v-model="temp.configType">
            <el-radio v-for="(item, key) in configTypes" :key="key" :label="item.dictValue">
              {{ item.dictLabel }}
            </el-radio>
          </el-radio-group>
          <!--          <dictSelect v-model="temp.configType" type="radio" :triggerChange="true" class="filter-item" dictType="sys_config_type" @change="handleConfigType"/>-->
        </el-form-item>
        <el-form-item v-if="temp.configType==='0'" label="文本参数" prop="configTextValue">
          <el-input v-model="temp.configTextValue" placeholder="请输入参数键值" type="textarea" :rows="3" :disabled="chakan" />
        </el-form-item>
        <el-form-item v-else-if="temp.configType==='1'" label="图片参数" prop="configPicValue">
          <el-upload
            accept="image/png,image/jpg,image/jpeg"
            action="auto"
            :http-request="uploadSectionFile"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :file-list="localFileList"
            :headers="headers"
            :limit="15"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item v-else-if="temp.configType==='2'" label="富文本参数" prop="configContentValue">
          <div class="document-editor">
            <div ref="toolbar" class="toolbar" />
            <div class="editable-container">
              <ckeditor id="editor" v-model="temp.configContentValue" :editor="editor" :config="editorConfig" @ready="onReady" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="是否系统" prop="isSys">
          <el-radio v-model="temp.isSys" label="1" :disabled="chakan">是</el-radio>
          <el-radio v-model="temp.isSys" label="0" :disabled="chakan">否</el-radio>
        </el-form-item>
        <el-form-item label="参数描述">
          <el-input v-model="temp.remarks" placeholder="请输入参数描述" type="textarea" :rows="3" :disabled="chakan" />
        </el-form-item>
      </el-form>
      <div v-if="!chakan" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getConfigList, createPicConfig, createConfig, updateConfig, deleteConfig, updatePicConfig  } from '@/api/system/sysConfig'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline'
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import ListPlugin from '@ckeditor/ckeditor5-list/src/list'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import { unescape } from '../../utils'

export default {
  name: 'SysConfig',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      editor: DecoupledEditor,
      editorConfig: {
        // The configuration of the editor.
        plugins: [
          EssentialsPlugin,
          HeadingPlugin,
          BoldPlugin,
          ItalicPlugin,
          UnderlinePlugin,
          LinkPlugin,
          ParagraphPlugin,
          ListPlugin
        ],
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'link',
            'undo',
            'redo'
          ]
        }
      },
      chakan: false,
      isSysCodes: [],
      configTypes: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        configName: '',
        configKey: '',
        isSys: ''
      },
      temp: {
        id: undefined,
        configName: '',
        configKey: '',
        configTextValue: '',
        configPicValue: '',
        configPicName: '',
        configContentValue: '',
        configType: '0',
        uploadFile: [],
        isSys: '1',
        remarks: ''
      },
      fileLists: [],
      delFileList: [],
      localFileList: [],
      headers: { 'Content-Type': 'multipart/form-data' },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rulesText: {
        configName: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        configKey: [{ required: true, message: '请输入参数键名', trigger: 'blur' }],
        configType: [{ required: true, message: '请选择参数类型', trigger: 'blur' }],
        configTextValue: [{ required: true, message: '请输入文本值', trigger: 'blur' }],
        isSys: [{ required: true, message: '请选择是否系统', trigger: 'change' }]
      },
      rulesPic: {
        configName: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        configKey: [{ required: true, message: '请输入参数键名', trigger: 'blur' }],
        configType: [{ required: true, message: '请选择参数类型', trigger: 'blur' }],
        isSys: [{ required: true, message: '请选择是否系统', trigger: 'change' }]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  beforeCreate() {
  },
  created() {
    this.isSysCodes = getDictDataList('sys_yes_no')
    this.configTypes = getDictDataList('sys_config_type')
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getConfigList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        configName: '',
        configKey: '',
        configTextValue: '',
        configPicValue: '',
        configPicName: '',
        configContentValue: '',
        configType: '0',
        uploadFile: [],
        isSys: '1',
        remarks: ''
      }
    },
    handleCreate() {
      this.chakan = false
      this.resetTemp()
      this.fileLists = []
      this.localFileList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.configType === '1') {
            const formData = new FormData()
            this.fileLists.forEach(function(file) {
              formData.append('uploadFile', file, file.name)
            })
            formData.append('configName', this.temp.configName)
            formData.append('configKey', this.temp.configKey)
            formData.append('configType', this.temp.configType)
            formData.append('isSys', this.temp.isSys)
            formData.append('remarks', this.temp.remarks)
            createPicConfig(formData).then(() => {
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
          } else {
            createConfig(this.temp).then(() => {
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
        }
      })
    },
    handleUpdate(row) {
      this.chakan = false
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.configPicValue) {
        const picPicLists = this.temp.configPicValue.split(',')
        const picNameLists = this.temp.configPicName.split(',')
        this.localFileList = []
        for (let i = 0; i < picPicLists.length; i++) {
          const cop = {}
          cop['name'] = picNameLists[i]
          cop['url'] = picPicLists[i]
          this.localFileList.push(cop)
        }
      }
      if (this.temp.configContentValue) {
        this.temp.configContentValue = unescape(this.temp.configContentValue)
      }
      this.temp.configTextValue = unescape(this.temp.configTextValue)
      this.temp.configContentValue = unescape(this.temp.configContentValue)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.configType === '1') {
            const formData = new FormData()

            // 新增的文件
            if (this.fileLists) {
              this.fileLists.forEach(function(file) {
                if (!file.url) {
                  formData.append('uploadFileAdd', file, file.name)
                }
              })
            }
            // 处理删除的文件
            if (this.delFileList.length > 0) {
              const delFiles = []
              this.delFileList.forEach(function(fileName) {
                delFiles.push(fileName.name)
              })
              formData.append('uploadFileDel', delFiles)
            }

            formData.append('id', this.temp.id)
            formData.append('configName', this.temp.configName)
            formData.append('configKey', this.temp.configKey)
            formData.append('configType', this.temp.configType)
            formData.append('configPicValue', this.temp.configPicValue)
            formData.append('configPicName', this.temp.configPicName)
            formData.append('isSys', this.temp.isSys)
            formData.append('remarks', this.temp.remarks)
            updatePicConfig(formData).then(() => {
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
          } else {
            const tempData = Object.assign({}, this.temp)
            updateConfig(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
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
        }
      })
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      deleteConfig(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    rest() { // 重置
      this.listQuery.configName = ''
      this.listQuery.configKey = ''
      this.listQuery.isSys = ''
      this.fetchData()
    },
    lookConfig(row) { // 查看详情
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.chakan = true
    },
    isSysFormat(row) {
      let vv = '-'
      const typ = this.isSysCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.isSys) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      // this.temp.uploadFile = []
      // for (let i = 0; i < fileList.length; i++) {
      //   this.temp.uploadFile.push(new File([fileList[i]], new Date().getTime() + '.jpg', {
      //     type: 'image/jpeg'
      //   }))
      // }
      // this.fileLists = fileList

      this.fileLists = fileList
      if (this.localFileList.length > 0) {
        const tempLocalFileList = []
        const tempDelFileList = this.delFileList
        const urlNameArr = this.temp.configPicName.split(',')
        const urlValueArr = this.temp.configPicValue.split(',')
        const tempUrlNameArr = []
        const tempUrlValueArr = []
        let remIndex = 0
        this.localFileList.forEach(function(bannerFile) {
          if (bannerFile.name !== file.name) {
            tempLocalFileList.push(bannerFile)
          } else {
            tempDelFileList.push(bannerFile)
            urlNameArr.forEach(function(fileName) {
              if (fileName !== bannerFile.name) {
                tempUrlNameArr.push(fileName)
                tempUrlValueArr.push(urlValueArr[remIndex])
              }
              remIndex++
            })
          }
        })
        this.localFileList = tempLocalFileList
        this.delFileList = tempDelFileList
        this.temp.configPicName = tempUrlNameArr.toString()
        this.temp.configPicValue = tempUrlValueArr.toString()
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 15 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadSectionFile(param) {
      const fileObj = param.file

      const isLt2M = fileObj.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return
      }
      if (fileObj.type === 'image/jpeg') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.jpg', {
        //   type: 'image/jpeg'
        // }))
        this.fileLists.push(param.file)
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        this.fileLists.push(param.file)
      } else {
        this.$message.error('只能上传jpg/png文件')
        return
      }
    },
    configTypeFormat(row) {
      let configTypeName = ''
      this.configTypes.some(function(item, index) {
        if (item.dictValue === row.configType) {
          configTypeName = item.dictLabel
          return true
        }
      })
      return configTypeName
    },
    configValueFormat(row) {
      let configValue = ''
      if (row.configType === '0') {
        configValue = unescape(row.configTextValue)
      } else if (row.configType === '1') {
        configValue = row.configPicValue
      } else {
        configValue = unescape(row.configContentValue)
      }
      return configValue
    },
    onReady(editor) {
      // Insert the toolbar before the editable are.
      const toolbarContainer = this.$refs.toolbar
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)

      // const wordCountPlugin = editor.plugins.get('WordCount')
      // console.log(wordCountPlugin)

      // editor.model.document.on('change', () => {
      //   this.$emit('content-change', editor.getData())
      // })
      this.editorHandler = editor
    }
  }
}
</script>

<style>
  .el-upload--picture-card{
    width: 70px!important;
    height: 70px!important;
    line-height: 74px!important;
  }
  .el-upload--picture-card i{
    font-size: 24px!important;
  }

  .el-upload-list--picture-card li{
    width: 70px!important;
    height: 70px!important;
  }
  .el-upload-list__item{
    width: 70px!important;
    height: 70px!important;
  }
</style>

<style lang="scss" scoped>
  /deep/ #editor a {
    color: #1b3af2;
    text-decoration: none;
  }

  .document-editor {
    .toolbar {
      /* Make sure the toolbar container is always above the editable. */
      z-index: 1;

      /* Create the illusion of the toolbar floating over the editable. */
      // box-shadow: 0 0 5px hsla( 0,0%,0%,.2 );

      /* Use the CKEditor CSS variables to keep the UI consistent. */
      // border-bottom: 1px solid var(--ck-color-toolbar-border);
      border: 1px solid var(--ck-color-base-border);
      border-bottom: none;

      /* Adjust the look of the toolbar inside of the container. */
      .ck-toolbar {
        border: 0;
        border-radius: 0;
      }
    }

    /* Make the editable container look like the inside of a native word processor app. */
    .editable-container {
      // border: 1px solid var(--ck-color-base-border);
      // border-radius: var(--ck-border-radius);

      // /* Set vertical boundaries for the document editor. */
      // max-height: 600px;

      // /* This element is a flex container for easier rendering. */
      // display: flex;
      // flex-flow: column nowrap;

      // padding: calc( 2 * var(--ck-spacing-large) );
      padding: 0;
      background: var(--ck-color-base-foreground);

      /* Make it possible to scroll the "page" of the edited content. */
      overflow-y: scroll;

      .ck-editor__editable {
        /* Set the dimensions of the "page". */
        // width: 15.8cm;
        min-height: 3cm;

        /* Keep the "page" off the boundaries of the container. */
        // padding: 1cm 2cm 2cm;

        border: 1px hsl( 0,0%,82.7% ) solid;
        border-radius: var(--ck-border-radius);
        background: white;

        /* The "page" should cast a slight shadow (3D illusion). */
        box-shadow: 0 0 5px hsla( 0,0%,0%,.1 );

        /* Center the "page". */
        // margin: 0 auto;
      }
    }
  }
</style>
