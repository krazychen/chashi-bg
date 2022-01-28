<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
          <el-form-item label="订单手续费" prop="orderFee">
            <el-input v-model="temp.orderFee" placeholder="订单手续费 0~100" :disabled="true">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商店名称" prop="merchantName">
            <el-input v-model="temp.merchantName" placeholder="请输入商店名称" />
          </el-form-item>
          <el-form-item label="联系手机" prop="contactPhonse">
            <el-input v-model="temp.contactPhonse" placeholder="联系手机" />
          </el-form-item>
          <el-form-item label="标签" prop="labels">
            <el-select v-model="labels" multiple placeholder="请选择">
              <el-option v-for="item in labelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="所在城市" prop="city">
            <el-input v-model="temp.city" placeholder="所在城市" :disabled="true" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="temp.address" placeholder="地址" style="width: 71%; padding-right: 10px" :disabled="true" />
            <el-button type="primary" @click="selectAddress">选择地址</el-button>
          </el-form-item>
          <el-form-item label="经纬度" prop="longAlat">
            <el-input v-model="temp.longAlat" placeholder="经纬度" :disabled="true" />
          </el-form-item>

          <el-form-item label="后台登录账户" prop="merchantAccount">
            <el-input v-model="temp.merchantAccount" placeholder="后台登录账户" :disabled="true" />
          </el-form-item>
          <el-form-item label="后台登录密码" prop="merchantPassword">
            <el-input v-model="temp.merchantPassword" placeholder="后台登录密码" />
          </el-form-item>
          <el-form-item label="订单退款手续费" prop="orderRefundFee">
            <el-input v-model="temp.orderRefundFee" placeholder="订单退款手续费 0~100" :disabled="true">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-time-select
              v-model="temp.startTime"
              placeholder="起始时间"
              style="width: 47%; padding-right: 5px"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '24:00'
              }"
            />
            <el-time-select
              v-model="temp.endTime"
              placeholder="结束时间"
              style="width: 47%"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '24:00',
                minTime: temp.startTime
              }"
            />
          </el-form-item>
          <el-form-item label="非营业时间">
            <el-time-select
              v-model="temp.exStartTime"
              placeholder="未营业开始时间"
              style="width: 47%; padding-right: 5px"
              :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: temp.startTime,
            }"
            />
            <el-time-select
              v-model="temp.exEndTime"
              placeholder="未营业结束时间"
              style="width: 47%"
              :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: temp.exStartTime,
              maxTime: temp.endTime
            }"
            />
          </el-form-item>
          <el-form-item label="营业时间描述" prop="opDescription">
            <el-input v-model="temp.opDescription" placeholder="营业时间描述" />
          </el-form-item>
          <el-form-item label="营业状态" prop="releaseStatus">
            <el-select v-model="temp.releaseStatus" placeholder="请选择" disabled>
              <el-option v-for="item in releaseStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="updateData()">保存</el-button>
            <el-button v-if="temp.releaseStatus==='1'" type="primary" @click="updateReleaseStatus('0')">开始休息</el-button>
            <el-button v-else type="primary" @click="updateReleaseStatus('1')">开始营业</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商店图片">
        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
          <el-form-item label="商店Logo" prop="logoPicValue">
            <el-upload
              accept="image/png,image/jpg,image/jpeg"
              action="auto"
              :http-request="uploadLogoSectionFile"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleLogoRemove"
              :on-exceed="handleLogoExceed"
              :file-list="logoLocalFileList"
              :headers="headers"
              :limit="1"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>

          <el-form-item label="商店轮播图" prop="bannerPicValue">
            <el-upload
              accept="image/png,image/jpg,image/jpeg"
              action="auto"
              :http-request="uploadBannerSectionFile"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleBannerRemove"
              :on-exceed="handleBannerExceed"
              :file-list="bannerLocalFileList"
              :headers="headers"
              :limit="3"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="updateData()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商户信息">
        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
          <el-form-item label="综合设施" prop="facilities">
            <el-select v-model="facilities" multiple placeholder="请选择">
              <el-option v-for="item in facilitieOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="服务项目" prop="services">
            <el-select v-model="services" multiple placeholder="请选择">
              <el-option v-for="item in facilitieOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="商户简介" prop="merchantInfo">
            <div class="document-editor">
              <div ref="toolbar1" class="toolbar" />
              <div class="editable-container">
                <ckeditor id="editor1" v-model="temp.merchantInfo" :editor="editor1" :config="editorConfig" @ready="onReady1" />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="使用须知" prop="usageNotice">
            <div class="document-editor">
              <div ref="toolbar2" class="toolbar" />
              <div class="editable-container">
                <ckeditor id="editor2" v-model="temp.usageNotice" :editor="editor2" :config="editorConfig" @ready="onReady2" />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="updateData()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="智能锁设备">
        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
          <el-tag>通通锁配置，每个茶室的门锁lockId需要在茶室内维护</el-tag><br>
          <el-form-item label="app_id" prop="ttlClientId">
            <el-input v-model="temp.ttlClientId" placeholder="ttlock开放平台注册时分配的app_id" />
          </el-form-item>
          <el-form-item label="app_secret" prop="ttlClientSecret">
            <el-input v-model="temp.ttlClientSecret" placeholder="ttlock开放平台注册时分配的app_secret" />
          </el-form-item>
          <el-form-item label="大门lockId" prop="ttlLockId">
            <el-input v-model="temp.ttlLockId" placeholder="ttlock锁的id" />
          </el-form-item>
          <el-form-item label="登录账号" prop="ttlUsername">
            <el-input v-model="temp.ttlUsername" placeholder="科技侠或通通锁APP的登录账号" />
          </el-form-item>
          <el-form-item label="账号密码" prop="ttlPassword">
            <el-input v-model="temp.ttlPassword" placeholder="科技侠或通通锁APP的登录账号密码" />
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="updateData()">保存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="智能取电设备" >
        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
          <el-tag>曼顿空开配置</el-tag><br>
          <el-form-item label="client id" prop="kkClientId">
            <el-input v-model="temp.kkClientId" placeholder="曼顿空开client id" />
          </el-form-item>
          <el-form-item label="AppSecret" prop="kkAppSecret">
            <el-input v-model="temp.kkAppSecret" placeholder="曼顿空开appSecret" />
          </el-form-item>
          <el-form-item label="projectCode" prop="kkProjectCode">
            <el-input v-model="temp.kkProjectCode" placeholder="曼顿空开projectCode" />
          </el-form-item>
          <el-form-item label="redirect_uri" prop="kkRedirectUri">
            <el-input v-model="temp.kkRedirectUri" placeholder="曼顿空开redirect_uri" />
          </el-form-item>
          <el-form-item label="曼顿空开uname" prop="kkUname">
            <el-input v-model="temp.kkUname" placeholder="曼顿空开uname" />
          </el-form-item>
          <el-form-item label="曼顿空开password" prop="kkPassword">
            <el-input v-model="temp.kkPassword" placeholder="曼顿空开password" />
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="updateData()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="保洁维护">
        <el-tag>一条记录一个保洁排班信息，可以多条记录，只要时间是生效的，就会通知到对方，用户必须关注公众号，查看openid方法查看https://www.it120.cc/help/dbtods.html</el-tag><br><br>

        <div class="filter-container">
          <el-date-picker v-model="cleanListQuery.queryStartTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择值班开始时间" />
          <el-date-picker v-model="cleanListQuery.queryEndTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择值班开始时间" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleCleanFilter">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetClean">
            重置
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCleanDialog(null, 'create')">
            新增
          </el-button>
        </div>

        <el-table v-loading="cleanListLoading" :data="cleanList" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="startTime" label="值班开始时间" />
          <el-table-column align="center" prop="endTime" label="值班结束时间" />
          <el-table-column align="center" prop="notifyTime" label="通知时点" :formatter="notifyTimeFormat" />
          <el-table-column align="center" prop="notifyFrontTime" label="时点前" />
          <el-table-column align="center" prop="notifyRearTime" label="时点后" />
          <el-table-column align="center" prop="openid" label="保洁员OpenId" />
          <el-table-column align="center" prop="remark" label="备注" />
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleCleanDialog(scope.row, 'view')" />
              <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleCleanDialog(scope.row, 'update')" />
              <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="cleanTotal>0" :total="cleanTotal" :page.sync="cleanListQuery.current" :limit.sync="cleanListQuery.size" @pagination="fetchCleanData" />

        <el-dialog :title="textMap[dialogCleanStatus]" :visible.sync="dialogCleanFormVisible">
          <el-form ref="cleanDataForm" :rules="rulesCleanText" :model="tempClean" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
            <el-form-item label="值班开始时间" prop="startTime">
              <el-date-picker v-model="tempClean.startTime" placeholder="请输入值班开始时间" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
            </el-form-item>
            <el-form-item label="值班结束时间" prop="endTime">
              <el-date-picker v-model="tempClean.endTime" placeholder="请输入值班结束时间" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
            </el-form-item>
            <el-form-item label="通知时点" prop="notifyTime">
              <el-select v-model="tempClean.notifyTime" placeholder="请选择" @change="notifyTimeChange">
                <el-option v-for="item in notifyTimeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="提早X分钟前" prop="notifyFrontTime">
              <el-input v-model="tempClean.notifyFrontTime" placeholder="请输入时间" :disabled="notifyFrontTimeState">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="结束X分钟后" prop="notifyRearTime">
              <el-input v-model="tempClean.notifyRearTime" placeholder="请输入时间">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="保洁员" prop="openid">
              <el-input v-model="tempClean.openid" placeholder="请选择值班保洁员的openid" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="tempClean.remark" type="textarea" :rows="3" placeholder="请输入备注，用来区分保洁员" />
            </el-form-item>
          </el-form>
          <div v-if="!cleanChakan" slot="footer" class="dialog-footer">
            <el-button @click="dialogCleanFormVisible = false">
              取消
            </el-button>
            <el-button type="primary" @click="dialogCleanStatus==='create'?createCleanData():updateCleanData()">
              确定
            </el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="值班维护">

        <el-tag>一条记录一个值班排班信息，可以多条记录，只要时间是生效的，就会通知到对方，用户必须关注公众号，查看openid方法查看https://www.it120.cc/help/dbtods.html</el-tag><br><br>

        <div class="filter-container">
          <el-date-picker v-model="workListQuery.queryStartTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择值班开始时间" />
          <el-date-picker v-model="workListQuery.queryEndTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择值班开始时间" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleWorkFilter">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetWork">
            重置
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleWorkDialog(null, 'create')">
            新增
          </el-button>
        </div>

        <el-table v-loading="workListLoading" :data="workList" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;">
          <el-table-column align="center" prop="startTime" label="值班开始时间" />
          <el-table-column align="center" prop="endTime" label="值班结束时间" />
          <el-table-column align="center" prop="notifyTime" label="通知时点" :formatter="notifyTimeFormat" />
          <el-table-column align="center" prop="notifyFrontTime" label="时点前" />
          <el-table-column align="center" prop="notifyRearTime" label="时点后" />
          <el-table-column align="center" prop="openid" label="值班员OpenId" />
          <el-table-column align="center" prop="remark" label="备注" />
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleWorkDialog(scope.row, 'view')" />
              <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleWorkDialog(scope.row, 'update')" />
              <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="workTotal>0" :total="workTotal" :page.sync="workListQuery.current" :limit.sync="workListQuery.size" @pagination="fetchWorkData" />

        <el-dialog :title="textMap[dialogWorkStatus]" :visible.sync="dialogWorkFormVisible">
          <el-form ref="workDataForm" :rules="rulesCleanText" :model="tempWork" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
            <el-form-item label="值班开始时间" prop="startTime">
              <el-date-picker v-model="tempWork.startTime" placeholder="请输入值班开始时间" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
            </el-form-item>
            <el-form-item label="值班结束时间" prop="endTime">
              <el-date-picker v-model="tempWork.endTime" placeholder="请输入值班结束时间" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
            </el-form-item>
            <el-form-item label="通知时点" prop="notifyTime">
              <el-select v-model="tempWork.notifyTime" placeholder="请选择" @change="workNotifyTimeChange">
                <el-option v-for="item in notifyTimeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="提早X分钟前" prop="notifyFrontTime">
              <el-input v-model="tempWork.notifyFrontTime" placeholder="请输入时间" :disabled="workNotifyFrontTimeState">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="结束X分钟后" prop="notifyRearTime">
              <el-input v-model="tempWork.notifyRearTime" placeholder="请输入时间">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="保洁员" prop="openid">
              <el-input v-model="tempWork.openid" placeholder="请选择值班保洁员的openid" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="tempWork.remark" type="textarea" :rows="3" placeholder="请输入备注，用来区分值班员" />
            </el-form-item>
          </el-form>
          <div v-if="!workChakan" slot="footer" class="dialog-footer">
            <el-button @click="dialogWorkFormVisible = false">
              取消
            </el-button>
            <el-button type="primary" @click="dialogWorkStatus==='create'?createWorkData():updateWorkData()">
              确定
            </el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

<!--      <el-tab-pane label="提醒设备配置" >-->
<!--        <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">-->
<!--          <el-tag>提醒声音配置</el-tag><br>-->
<!--          <el-form-item label="门锁开启提醒声音I" prop="txApi1">-->
<!--            <el-input v-model="temp.txApi1" placeholder="第二个门锁开启后的提醒声音" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="结束前10分钟的提醒声音" prop="txApi2">-->
<!--            <el-input v-model="temp.txApi2" placeholder="结束前10分钟的提醒声音" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="结束前2分钟的提醒声音" prop="txApi3">-->
<!--            <el-input v-model="temp.txApi3" placeholder="结束前2分钟的提醒声音" />-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button>取消</el-button>-->
<!--            <el-button type="primary" @click="updateData()">保存</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </el-tab-pane>-->
    </el-tabs>

    <el-dialog title="选择地址" :visible.sync="dialogMapVisible">
      <iframe
        id="mapPage"
        width="100%"
        height="450px"
        frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=FMXBZ-TXULW-2SVRL-RY734-IDFSF-2QFWF&referer=chashi"
      />
      <br>
      <br>
      <el-row :gutter="20">
        <el-col :offset="19">
          <el-button type="primary" @click="configSelectAddress">
            确定选中地址
          </el-button>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
import { getMerchant, updateMerchant, getCleanList, updateCleanObj, createCleanObj, deleteCleanObj, updateReleaseStatusById } from '@/api/chashi/csMerchant'
import { getLoginSysUserVo } from '@/utils/auth'
import { getCsLabelList } from '@/api/chashi/csLabel.js'
import { getFacilitiesList } from '@/api/chashi/csFacilities.js'
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
import Pagination from '@/components/Pagination'

export default {
  name: 'MerchantSetting',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      editor1: DecoupledEditor,
      editor2: DecoupledEditor,
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
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
      labelOptions: [],
      facilitieOptions: [],
      temp: {
        id: undefined,
        merchantName: '',
        merchantAccount: '',
        merchantPassword: '',
        orderFee: '',
        city: '',
        address: '',
        longitude: '',
        latitude: '',
        longAlat: '',
        logoUrlValue: '',
        logoUrlName: '',
        carouselUrlValue: '',
        carouselUrlName: '',
        officeCode: '',
        contactPhonse: '',
        labelId: '',
        labelName: '',
        facilitiesId: '',
        facilitiesName: '',
        servicesId: '',
        servicesName: '',
        orderRefundFee: '',
        merchantInfo: '',
        usageNotice: '',
        logoUploadFile: [],
        bannerUploadFile: [],
        startTime: '',
        endTime: '',
        exStartTime: '',
        exEndTime: '',
        opDescription: '',
        ttlClientId: '',
        ttlClientSecret: '',
        ttlLockId: '',
        ttlUsername: '',
        ttlPassword: '',
        kkClientId: '',
        kkAppSecret: '',
        kkProjectCode: '',
        kkRedirectUri: '',
        kkUname: '',
        kkPassword: '',
        txApi1: '',
        txApi2: '',
        txApi3: '',
        releaseStatus: ''
      },
      releaseStatusOptions: [{ value: '0', label: '歇业' }, { value: '1', label: '营业' }],
      cleanList: null,
      cleanListLoading: false,
      cleanTotal: 0,
      cleanListQuery: {
        current: 1,
        queryStartTime: '',
        queryEndTime: '',
        notifyType: 0
      },
      labels: [],
      facilities: [],
      services: [],
      logoFileLists: [],
      logoDelFileList: [],
      bannerFileLists: [],
      logoLocalFileList: [],
      bannerLocalFileList: [],
      bannerDelFileList: [],
      dialogMapVisible: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      rulesText: {
        merchantName: [{ required: true, message: '请输入商店名称', trigger: 'blur' }],
        merchantAccount: [{ required: true, message: '请输入账户', trigger: 'blur' }],
        merchantPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        orderFee: [{ required: true, message: '请输入订单手续费', trigger: 'blur' }],
        contactPhonse: [{ required: true, message: '请输入联系手机', trigger: 'blur' }]
      },
      cleanChakan: null,
      dialogCleanFormVisible: false,
      dialogCleanStatus: '',
      tempClean: {
        merchantId: '',
        startTime: '',
        endTime: '',
        notifyType: '0',
        notifyTime: '',
        notifyFrontTime: '',
        notifyRearTime: '',
        wxuserId: '',
        nickname: '',
        openid: '',
        remark: ''
      },
      notifyFrontTimeState: false,
      notifyTimeOptions: [{ value: '0', label: '订单预定' }, { value: '1', label: '消费结束' }],
      rulesCleanText: {
        startTime: [{ required: true, message: '请输入开始日期', trigger: 'blur' }],
        endTime: [{ required: true, message: '请输入结束日期', trigger: 'blur' }],
        notifyTime: [{ required: true, message: '请输入结束日期', trigger: 'blur' }],
        openid: [{ required: true, message: '请输入保洁员的openid', trigger: 'blur' }]
      },
      workList: null,
      workListLoading: false,
      workTotal: 0,
      workListQuery: {
        current: 1,
        queryStartTime: '',
        queryEndTime: '',
        notifyType: 1
      },
      workChakan: null,
      dialogWorkFormVisible: false,
      dialogWorkStatus: '',
      tempWork: {
        merchantId: '',
        startTime: '',
        endTime: '',
        notifyType: '0',
        notifyTime: '',
        notifyFrontTime: '',
        notifyRearTime: '',
        wxuserId: '',
        nickname: '',
        openid: '',
        remark: ''
      },
      workNotifyFrontTimeState: false,
      rulesWorkText: {
        tempWorkstartTime: [{ required: true, message: '请输入开始日期', trigger: 'blur' }],
        tempWorkendTime: [{ required: true, message: '请输入结束日期', trigger: 'blur' }],
        tempWorknotifyTime: [{ required: true, message: '请输入结束日期', trigger: 'blur' }],
        tempWorkopenid: [{ required: true, message: '请输入值班员的openid', trigger: 'blur' }]
      },
      statusQueryParam: {
        id: undefined,
        releaseStatus: undefined
      }
    }
  },
  beforeCreate() {
  },
  mounted() {
    window.addEventListener('message', this.handleMapEvent)
  },
  created() {
    this.statuss = getDictDataList('sys_status')
    getCsLabelList({}).then(response => {
      const labelOptionss = []
      response.data.records.forEach(function(labelObj) {
        const labelOption = { value: labelObj.id, label: labelObj.titleName }
        labelOptionss.push(labelOption)
      })
      this.labelOptions = labelOptionss
    })
    getFacilitiesList({}).then(response => {
      console.log(response.data.records)
      const optionss = []
      response.data.records.forEach(function(labelObj) {
        const option = { value: labelObj.id, label: labelObj.titleName }
        optionss.push(option)
      })
      this.facilitieOptions = optionss
    })
    this.fetchData()
  },
  methods: {
    handleMapEvent(event) {
      const loc = event.data
      if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        console.log('location', loc)
        this.temp.city = loc.cityname
        this.temp.address = loc.poiaddress
        const latlng = loc.latlng
        this.temp.longAlat = latlng['lng'] + ',' + latlng['lat']
      }
    },
    fetchData() {
      const userInfo = getLoginSysUserVo()
      getMerchant(userInfo.officeCode).then(response => {
        this.temp = response.data

        if (this.temp.logoUrlValue) {
          const logoPicLists = this.temp.logoUrlValue.split(',')
          const logoNameLists = this.temp.logoUrlName.split(',')
          this.logoLocalFileList = []
          for (let i = 0; i < logoPicLists.length; i++) {
            const cop = {}
            cop['name'] = logoNameLists[i]
            cop['url'] = logoPicLists[i]
            this.logoLocalFileList.push(cop)
          }
        }
        if (this.temp.carouselUrlValue) {
          const bannerPicLists = this.temp.carouselUrlValue.split(',')
          const bannerNameLists = this.temp.carouselUrlName.split(',')
          this.bannerLocalFileList = []
          for (let i = 0; i < bannerPicLists.length; i++) {
            const cop = {}
            cop['name'] = bannerNameLists[i]
            cop['url'] = bannerPicLists[i]
            this.bannerLocalFileList.push(cop)
          }
        }
        if (this.temp.labelId) {
          const idArr = this.temp.labelId.split(',')
          const optionss = []
          idArr.forEach(function(obj, index) {
            optionss.push(obj)
          })
          this.labels = optionss
        }
        if (this.temp.facilitiesId) {
          const idArr = this.temp.facilitiesId.split(',')
          const optionss = []
          idArr.forEach(function(obj, index) {
            optionss.push(obj)
          })
          this.facilities = optionss
        }
        if (this.temp.servicesId) {
          const idArr = this.temp.servicesId.split(',')
          const optionss = []
          idArr.forEach(function(obj, index) {
            optionss.push(obj)
          })
          this.services = optionss
        }
        if (this.temp.merchantInfo) {
          this.temp.merchantInfo = unescape(this.temp.merchantInfo)
        }
        if (this.temp.usageNotice) {
          this.temp.usageNotice = unescape(this.temp.usageNotice)
        }
        if (this.temp.longitude) {
          this.temp.longAlat = this.temp.longitude + ',' + this.temp.latitude
        }
      })
    },
    updateData() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          const formData = new FormData()

          // 新增的文件
          if (this.logoFileLists) {
            this.logoFileLists.forEach(function(file) {
              if (!file.url) {
                formData.append('logoUploadFileAdd', file, file.name)
              }
            })
          }
          // 处理删除的文件
          if (this.logoDelFileList.length > 0) {
            const logoDelFiles = []
            this.logoDelFileList.forEach(function(fileName) {
              logoDelFiles.push(fileName.name)
            })
            formData.append('logoUploadFileDel', logoDelFiles)
          }

          // 新增的文件
          if (this.bannerFileLists) {
            this.bannerFileLists.forEach(function(file) {
              if (!file.url) {
                formData.append('bannerUploadFileAdd', file, file.name)
              }
            })
          }
          // 处理删除的文件
          if (this.bannerDelFileList.length > 0) {
            const bannerDelFiles = []
            this.bannerDelFileList.forEach(function(fileName) {
              bannerDelFiles.push(fileName.name)
            })
            formData.append('bannerUploadFileDel', bannerDelFiles)
          }

          formData.append('merchantName', this.temp.merchantName)
          formData.append('merchantAccount', this.temp.merchantAccount)
          formData.append('merchantPassword', this.temp.merchantPassword)
          formData.append('orderFee', this.temp.orderFee)
          formData.append('city', this.temp.city)
          formData.append('address', this.temp.address)
          if (this.temp.longAlat) {
            const lnglat = this.temp.longAlat.split(',')
            formData.append('longitude', lnglat[0])
            formData.append('latitude', lnglat[1])
          }
          // formData.append('longAlat', this.temp.longAlat)
          formData.append('logoUrlValue', this.temp.logoUrlValue)
          formData.append('logoUrlName', this.temp.logoUrlName)
          formData.append('carouselUrlValue', this.temp.carouselUrlValue)
          formData.append('carouselUrlName', this.temp.carouselUrlName)
          formData.append('id', this.temp.id)
          formData.append('officeCode', this.temp.officeCode)
          formData.append('contactPhonse', this.temp.contactPhonse)
          formData.append('orderRefundFee', this.temp.orderRefundFee)
          formData.append('startTime', this.temp.startTime)
          formData.append('endTime', this.temp.endTime)
          formData.append('exStartTime', this.temp.exStartTime)
          formData.append('exEndTime', this.temp.exEndTime)
          formData.append('opDescription', this.temp.opDescription)
          formData.append('ttlClientId', this.temp.ttlClientId)
          formData.append('ttlClientSecret', this.temp.ttlClientSecret)
          formData.append('ttlUsername', this.temp.ttlUsername)
          formData.append('ttlPassword', this.temp.ttlPassword)
          formData.append('ttlLockId', this.temp.ttlLockId)

          formData.append('kkClientId', this.temp.kkClientId)
          formData.append('kkAppSecret', this.temp.kkAppSecret)
          formData.append('kkProjectCode', this.temp.kkProjectCode)
          formData.append('kkRedirectUri', this.temp.kkRedirectUri)
          formData.append('kkUname', this.temp.kkUname)
          formData.append('kkPassword', this.temp.kkPassword)

          formData.append('txApi1', this.temp.txApi1)
          formData.append('txApi2', this.temp.txApi2)
          formData.append('txApi3', this.temp.txApi3)
          if (this.labels) {
            let tempLabelId = ''
            let tempLabelName = ''
            this.labels.forEach(function(label, index, arr) {
              const obj = that.labelOptions.find((item) => {
                return item.value === label
              })
              if (index === (arr.length - 1)) {
                tempLabelId += label
                tempLabelName += obj.label
              } else {
                tempLabelId += label + ','
                tempLabelName += obj.label + ','
              }
            })
            formData.append('labelId', tempLabelId)
            formData.append('labelName', tempLabelName)
          }
          if (this.facilities) {
            let tempFacilitieId = ''
            let tempFacilitieName = ''
            this.facilities.forEach(function(facilitie, index, arr) {
              const obj = that.facilitieOptions.find((item) => {
                return item.value === facilitie
              })
              if (index === (arr.length - 1)) {
                tempFacilitieId += facilitie
                tempFacilitieName += obj.label
              } else {
                tempFacilitieId += facilitie + ','
                tempFacilitieName += obj.label + ','
              }
            })
            formData.append('facilitiesId', tempFacilitieId)
            formData.append('facilitiesName', tempFacilitieName)
          }
          if (this.services) {
            let tempServicesId = ''
            let tempServicesName = ''
            this.services.forEach(function(service, index, arr) {
              const obj = that.facilitieOptions.find((item) => {
                return item.value === service
              })
              if (index === (arr.length - 1)) {
                tempServicesId += service
                tempServicesName += obj.label
              } else {
                tempServicesId += service + ','
                tempServicesName += obj.label + ','
              }
            })
            formData.append('servicesId', tempServicesId)
            formData.append('servicesName', tempServicesName)
          }
          if (this.temp.merchantInfo) {
            formData.append('merchantInfo', unescape(this.temp.merchantInfo))
          }
          if (this.temp.usageNotice) {
            formData.append('usageNotice', unescape(this.temp.usageNotice))
          }

          for (var pair of formData.entries()) {
            console.log(pair[0] + ' - ' + pair[1].toString())
          }
          updateMerchant(formData).then(() => {
            this.fetchData()
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
    handleLogoRemove(file, fileList) {
      // this.temp.uploadFile = []
      // for (let i = 0; i < fileList.length; i++) {
      //   this.temp.uploadFile.push(new File([fileList[i]], new Date().getTime() + '.jpg', {
      //     type: 'image/jpeg'
      //   }))
      // }
      if (fileList.length > 0) {
        this.logoFileLists = fileList
      }
      if (this.logoLocalFileList.length > 0) {
        const templogoLocalFileList = []
        const templogoDelFileList = this.logoDelFileList
        var tempLogoUrlName = this.temp.logoUrlName
        this.logoLocalFileList.forEach(function(logoFile) {
          if (logoFile.name !== file.name) {
            templogoLocalFileList.push(logoFile)
          } else {
            templogoDelFileList.push(logoFile)
            tempLogoUrlName = ''
          }
        })
        this.logoLocalFileList = templogoLocalFileList
        this.logoDelFileList = templogoDelFileList
        this.temp.logoUrlName = tempLogoUrlName
      }
    },
    handleLogoExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadLogoSectionFile(param) {
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
        this.logoFileLists.push(param.file)
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        this.logoFileLists.push(param.file)
      } else {
        this.$message.error('只能上传jpg/png文件')
        return
      }
    },

    handleBannerRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // this.temp.uploadFile = []
      // for (let i = 0; i < fileList.length; i++) {
      //   this.temp.uploadFile.push(new File([fileList[i]], new Date().getTime() + '.jpg', {
      //     type: 'image/jpeg'
      //   }))
      // }
      if (fileList.length > 0) {
        this.bannerFileLists = fileList
      }
      if (this.bannerLocalFileList.length > 0) {
        const tempBannerLocalFileList = []
        const tempbannerDelFileList = this.bannerDelFileList
        const bannerUrlNameArr = this.temp.carouselUrlName.split(',')
        const bannerUrlValueArr = this.temp.carouselUrlValue.split(',')
        const tempBannerUrlNameArr = []
        const tempBannerUrlValueArr = []
        let remIndex = 0
        this.bannerLocalFileList.forEach(function(bannerFile) {
          if (bannerFile.name !== file.name) {
            tempBannerLocalFileList.push(bannerFile)
          } else {
            tempbannerDelFileList.push(bannerFile)
            bannerUrlNameArr.forEach(function(fileName) {
              if (fileName !== bannerFile.name) {
                tempBannerUrlNameArr.push(fileName)
                tempBannerUrlValueArr.push(bannerUrlValueArr[remIndex])
              }
              remIndex++
            })
            // console.log(tempBannerUrlName.indexOf(bannerFile.name))
            // if (tempBannerUrlName.indexOf(bannerFile.name) !== -1) {
            //   if (tempBannerUrlName.indexOf(bannerFile.name) - 1 > 0) {
            //     tempBannerUrlName = tempBannerUrlName.slice(0, tempBannerUrlName.indexOf(bannerFile.name) - 1)
            //   } else {
            //     tempBannerUrlName = tempBannerUrlName.slice(bannerFile.name.length + 1, tempBannerUrlName.length  )
            //   }
            // }
          }
        })
        this.bannerLocalFileList = tempBannerLocalFileList
        this.bannerDelFileList = tempbannerDelFileList
        this.temp.carouselUrlName = tempBannerUrlNameArr.toString()
        this.temp.carouselUrlValue = tempBannerUrlValueArr.toString()
        console.log(this.temp.carouselUrlName)
        console.log(this.temp.carouselUrlValue)
      }
    },
    handleBannerExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    uploadBannerSectionFile(param) {
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
        this.bannerFileLists.push(param.file)
      } else if (fileObj.type === 'image/png') {
        // this.temp.uploadFile.push(new File([fileObj], new Date().getTime() + '.png', {
        //   type: 'image/png'
        // }))
        this.bannerFileLists.push(param.file)
      } else {
        this.$message.error('只能上传jpg/png文件')
        return
      }
    },
    onReady1(editor) {
      // Insert the toolbar before the editable are.
      const toolbarContainer = this.$refs.toolbar1
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)

      // const wordCountPlugin = editor.plugins.get('WordCount')
      // console.log(wordCountPlugin)

      // editor.model.document.on('change', () => {
      //   this.$emit('content-change', editor.getData())
      // })
    },
    onReady2(editor) {
      // Insert the toolbar before the editable are.
      const toolbarContainer = this.$refs.toolbar2
      toolbarContainer.appendChild(editor.ui.view.toolbar.element)

      // const wordCountPlugin = editor.plugins.get('WordCount')
      // console.log(wordCountPlugin)

      // editor.model.document.on('change', () => {
      //   this.$emit('content-change', editor.getData())
      // })
    },

    selectAddress() {
      this.dialogMapVisible = true
    },

    configSelectAddress() {
      this.dialogMapVisible = false
    },

    // ============== 保洁相关 =======================
    resetClean() { // 重置
      this.cleanListQuery.queryStartTime = ''
      this.cleanListQuery.queryStartTime = ''
      this.fetchCleanData()
    },
    notifyTimeChange(item) {
      if (item === '0') {
        this.notifyFrontTimeState = true
        this.tempClean.notifyFrontTime = ''
      } else {
        this.notifyFrontTimeState = false
      }
    },
    handleCleanFilter() {
      this.cleanListQuery.page = 1
      this.fetchCleanData()
    },
    fetchCleanData() {
      this.cleanListLoading = true
      getCleanList(this.cleanListQuery).then(response => {
        this.cleanList = response.data.records
        this.cleanTotal = parseInt(response.data.total)
        this.cleanListLoading = false
      })
    },
    handleCleanDialog(row, type) { // 创建/查看/编辑详情
      if (type === 'create') {
        this.cleanChakan = false
        this.dialogCleanStatus = 'create'
        this.tempClean.startTime = ''
        this.tempClean.endTime = ''
        this.tempClean.notifyType = '0'
        this.tempClean.notifyTime = ''
        this.tempClean.notifyFrontTime = ''
        this.tempClean.notifyRearTime = ''
        this.tempClean.wxuserId = ''
        this.tempClean.nickname = ''
        this.tempClean.openid = ''
        this.tempClean.remark = ''
      } else if (type === 'update') {
        this.cleanChakan = false
        this.dialogCleanStatus = 'update'
        this.tempClean = Object.assign({}, row) // copy obj
        this.tempClean.notifyTime = this.tempClean.notifyTime.toString()
        if (!this.tempClean.notifyTime === '0') {
          this.notifyFrontTimeState = true
        } else {
          this.notifyFrontTimeState = false
        }
      } else {
        this.cleanChakan = true
        this.dialogCleanStatus = 'view'
        this.tempClean = Object.assign({}, row) // copy obj
        this.tempClean.notifyTime = this.tempClean.notifyTime.toString()
        if (!this.tempClean.notifyTime === '0') {
          this.notifyFrontTimeState = true
        } else {
          this.notifyFrontTimeState = false
        }
      }
      this.dialogCleanFormVisible = true
      this.$nextTick(() => {
        this.$refs['cleanDataForm'].clearValidate()
      })
    },
    createCleanData() {
      this.$refs['cleanDataForm'].validate((valid) => {
        if (valid) {
          this.tempClean.merchantId = this.temp.id
          console.log(this.tempClean)
          createCleanObj(this.tempClean).then(() => {
            this.fetchCleanData()
            this.dialogCleanFormVisible = false
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
    updateCleanData() {
      this.$refs['cleanDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempClean)
          console.log(tempData)
          updateCleanObj(tempData).then(() => {
            this.fetchCleanData()
            this.dialogCleanFormVisible = false
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
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      deleteCleanObj(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    notifyTimeFormat(row) {
      let vv = '-'
      const typ = this.notifyTimeOptions
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      const temp = row.notifyTime.toString()
      typ.forEach(function(aa, bb) {
        if (aa.value === temp) {
          console.log(1111)
          vv = aa.label
        }
      })
      return vv
    },
    // ============== 保洁相关 =======================

    // ============== 值班相关 =======================
    resetWork() { // 重置
      this.workListQuery.queryStartTime = ''
      this.workListQuery.queryStartTime = ''
      this.fetchWorkData()
    },
    workNotifyTimeChange(item) {
      if (item === '0') {
        this.workNotifyFrontTimeState = true
        this.tempWork.notifyFrontTime = ''
      } else {
        this.workNotifyFrontTimeState = false
      }
    },
    handleWorkFilter() {
      this.workListQuery.page = 1
      this.fetchWorkData()
    },
    fetchWorkData() {
      this.workListLoading = true
      getCleanList(this.workListQuery).then(response => {
        this.workList = response.data.records
        this.workTotal = parseInt(response.data.total)
        this.workListLoading = false
      })
    },
    handleWorkDialog(row, type) { // 创建/查看/编辑详情
      if (type === 'create') {
        this.workChakan = false
        this.dialogWorkStatus = 'create'
        this.tempWork.startTime = ''
        this.tempWork.endTime = ''
        this.tempWork.notifyType = '1'
        this.tempWork.notifyTime = ''
        this.tempWork.notifyFrontTime = ''
        this.tempWork.notifyRearTime = ''
        this.tempWork.wxuserId = ''
        this.tempWork.nickname = ''
        this.tempWork.openid = ''
        this.tempWork.remark = ''
      } else if (type === 'update') {
        this.workChakan = false
        this.dialogWorkStatus = 'update'
        this.tempWork = Object.assign({}, row) // copy obj
        this.tempWork.notifyTime = this.tempWork.notifyTime.toString()
        if (!this.tempWork.notifyTime === '0') {
          this.workNotifyFrontTimeState = true
        } else {
          this.workNotifyFrontTimeState = false
        }
      } else {
        this.workChakan = true
        this.dialogWorkStatus = 'view'
        this.tempWork = Object.assign({}, row) // copy obj
        this.tempWork.notifyTime = this.tempWork.notifyTime.toString()
        if (!this.tempWork.notifyTime === '0') {
          this.workNotifyFrontTimeState = true
        } else {
          this.workNotifyFrontTimeState = false
        }
      }
      this.dialogWorkFormVisible = true
      this.$nextTick(() => {
        this.$refs['workDataForm'].clearValidate()
      })
    },
    createWorkData() {
      this.$refs['workDataForm'].validate((valid) => {
        if (valid) {
          this.tempWork.merchantId = this.temp.id
          console.log(this.tempWork)
          createCleanObj(this.tempWork).then(() => {
            this.fetchWorkData()
            this.dialogWorkFormVisible = false
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
    updateWorkData() {
      this.$refs['workDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempWork)
          console.log(tempData)
          updateCleanObj(tempData).then(() => {
            this.fetchWorkData()
            this.dialogWorkFormVisible = false
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
    // ============== 值班相关 =======================

    updateReleaseStatus(newStatus) {
      let msg = '营业中'
      if (newStatus === '1') {
        msg = '休息中'
      }
      this.statusQueryParam.releaseStatus = newStatus
      this.statusQueryParam.id = this.temp.id
      updateReleaseStatusById(this.statusQueryParam).then(() => {
        this.fetchData()
        this.$message(msg)
      })
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
