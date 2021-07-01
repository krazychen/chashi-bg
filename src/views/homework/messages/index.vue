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
    <el-dialog :visible.sync="dialogFormVisible" width="750px" class="msgCla" :show-close="temp.mustRead ==='1' && temp.msgTypeCode === '2'?false:true" :before-close="temp.mustRead === '0'?closeMsg:closeMsg1">
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
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import CommentEditor from '@/views/homework/submissions/CommentEditor'

export default {
  name: 'Messages',
  components: { Pagination, CommentEditor },
  directives: { waves },
  data() {
    return {
      timer: undefined,
      determine: true,
      mustReadTime: 0,
      unreadNumber: undefined,
      list: [],
      msgEnty: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        status: '2',
        msgTypeCode: '2'
      },
      temp: {
        id: undefined,
        msgTypeCode: '',
        msgTitle: '',
        msgContent: '',
        publishTime: '',
        sendUserName: '',
        msgRecordId: ''
      },
      dialogFormVisible: false,
      msgTypeCodes: [{
        value: 1,
        label: '系统消息'
      }, {
        value: 2,
        label: '通知公告'
      }]
    }
  },
  beforeCreate() {
  },
  created() {
    this.setUnreadNumber()
    this.fetchData()
  },
  methods: {
    setUnreadNumber() {
      getUnreadedMsgCount().then(res => {
        if (res.success) {
          this.unreadNumber = res.data
        }
      })
    },
    closeMsg1() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.dialogFormVisible = false
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
    fetchData() {
      this.listLoading = true
      getMsgList(this.listQuery).then(response => {
        this.list = response.data.records
        if (this.list && this.list.length > 0) {
          if (this.list[0].redStatus === '2' && this.list[0].mustRead === '1' && this.list[0].msgTypeCode === '2') {
            this.listQuery.msgTypeCode = '2'
            this.viewDetails(this.list[0])
          }
        }
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
          this.setUnreadNumber()
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
