<template>
  <div class="app-container">
    <el-tabs v-model="listQuery.msgTypeCode" type="border-card" @tab-click="fetchData">
      <el-tab-pane label="系统消息" :name="'1'">
        <el-table v-loading="listLoading" :data="list" style="width: 100%" :default-sort="{prop: 'publishTime', order: 'descending'}">
          <el-table-column prop="msgTypeCode" label="消息类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.msgTypeCode === '1'" effect="dark" size="small" disable-transitions>系统消息</el-tag>
              <el-tag v-if="scope.row.msgTypeCode === '2'" effect="dark" type="success" size="small" disable-transitions>通知公告</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="msgTitle" label="消息名称" sortable />
          <el-table-column prop="msgContent" label="消息内容" sortable>
            <template slot-scope="scope">
              <div class="extra">
                <span style="font-weight: 800;cursor:pointer;" @click="viewDetails(scope.row)" v-html="unescape(scope.row.msgContent).length>33?unescape(scope.row.msgContent).substring(0,33)+'...':unescape(scope.row.msgContent)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="消息时间" sortable />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="通知公告" :name="'2'">
        <el-table v-loading="listLoading" :data="list" style="width: 100%" :default-sort="{prop: 'publishTime', order: 'descending'}">
          <el-table-column prop="msgTypeCode" label="消息类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.msgTypeCode === '1'" effect="dark" size="small" disable-transitions>系统消息</el-tag>
              <el-tag v-if="scope.row.msgTypeCode === '2'" effect="dark" type="success" size="small" disable-transitions>通知公告</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="msgTitle" label="消息名称" sortable />
          <el-table-column prop="msgContent" label="消息内容" sortable>
            <template slot-scope="scope">
              <div class="extra">
                <span style="font-weight: 800;cursor:pointer;" @click="viewDetails(scope.row)" v-html="unescape(scope.row.msgContent).length>33?unescape(scope.row.msgContent).substring(0,33)+'...':unescape(scope.row.msgContent)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="消息时间" sortable />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
    <el-dialog :visible.sync="dialogFormVisible" width="750px" class="msgCla" :before-close="temp.mustRead === '0'?closeMsg:closeMsg1">
      <div class="assignment">
        <p style="font-weight: 900;font-size: 15px">未读消息数:{{ unreadNumber }}</p>
        <p style="font-weight: 900;font-size: 15px">{{ temp.msgTitle }}</p>
        <comment-editor :key="'666s'" :content="unescape(temp.msgContent)" :max-length="10000" :editable="false" />
        <div style="width: 100%;text-align: center;margin-top: 20px;">
          <el-button v-if="temp.mustRead === '1'" size="medium" type="primary" :disabled="determine" @click="closeMsg">我知道了（{{ mustReadTime }}s）</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMsgList, getSysMsg, updateMsgRecord } from '@/api/homework/messages'
import { getUnreadedMsgCount } from '@/api/system/sysMsg'
import CommentEditor from '@/views/homework/submissions/CommentEditor'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'MyMessages',
  components: { Pagination, CommentEditor },
  directives: { waves },
  data() {
    return {
      list: [],
      msgEnty: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        status: '',
        msgTypeCode: '1'
      },
      timer: undefined,
      determine: true,
      mustReadTime: 0,
      unreadNumber: undefined,
      temp: {
        id: undefined, // 消息Id
        msgTypeCode: '', // 消息类型
        msgTitle: '', // 消息标题
        msgContent: '', // 消息内容
        publishTime: '', // 发布时间
        sendUserName: '', // 发布人
        msgRecordId: '', // 消息记录表id
        redStatus: '' // 消息记录表读取状态
      },
      dialogFormVisible: false,
      msgTypeCodes: [{
        value: 1,
        label: '系统消息'
      }, {
        value: 2,
        label: '通知公告'
      }],
      redStatusCodes: [{
        value: 0,
        label: '未送达'
      }, {
        value: 1,
        label: '已读'
      }, {
        value: 2,
        label: '未读'
      }]
    }
  },
  beforeCreate() {
  },
  created() {
    getUnreadedMsgCount().then(res => {
      if (res.success) {
        this.unreadNumber = res.data
      }
    })
    this.fetchData()
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
    fetchData() {
      this.listLoading = true
      getMsgList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    viewDetails(row) {
      const that = this
      this.temp = Object.assign({}, row) // copy obj
      getSysMsg(this.temp.id).then(response => {
        this.msgEnty = response.data
        if (this.msgEnty.mustRead === '1') {
          this.mustReadTime = parseInt(this.msgEnty.mustReadTime)
          console.log(this.msgEnty.mustReadTime)
          this.timer = setInterval(function() {
            that.mustReadTime = that.mustReadTime - 1
            console.log(that.mustReadTime)
            if (that.mustReadTime === 0) {
              clearInterval(that.timer)
              that.determine = false
            }
          }, 1000)
        }
      })
      this.dialogFormVisible = true
    },
    closeMsg1() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.dialogFormVisible = false
    },
    closeMsg() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.dialogFormVisible = false
      const stat = this.temp.redStatus
      if (stat === '1') { // 已读状态
        this.dialogFormVisible = false
      } else if (stat === '2') { // 未读状态
        updateMsgRecord(this.temp.msgRecordId).then(() => {
          this.fetchData()
          this.dialogFormVisible = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .assignment {
    margin: 1em 0;
    text-align: left;

    .el-col {
      padding: 1em;
      border-bottom: 1px solid #efefef;
    }
  }
  .el-dialog__body {
    padding: 0px 20px;
  }

  /deep/ .document-editor .editable-container{
    overflow-y: auto;
  }

  /deep/ .document-editor .editable-container .ck-editor__editable {
    height: 200px;
  }

  /deep/ .msgCla .el-dialog__body{
    padding-top: 0px;
  }
  .extra {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
</style>
