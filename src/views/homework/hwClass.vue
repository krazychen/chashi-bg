<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.className" placeholder="班级名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.remarks" placeholder="班级备注" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.typeId" placeholder="标签" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in typeIds" :key="item.id" :label="item.typeName" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetListQuery">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="deleteRow('','deletes')">
        删除
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <el-table-column label="班级名称">
        <template slot-scope="scope">
          {{ scope.row.className }}
        </template>
      </el-table-column>

      <el-table-column
        prop="typeName"
        label="班级标签"
      />
      <el-table-column
        prop="status"
        label="班级状态"
        :formatter="menuTypeFormat1"
      />
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i
            v-if="scope.row.status===0 || scope.row.status===1"
            class="el-icon-edit"
            style="color: #67C23A;margin-left:10px;"
            type="primary"
            title="编辑"
            @click="handleUpdate(scope.row)"
          />
          <i v-if="scope.row.status===0 || scope.row.status===1" title="删除" class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" @click="tableDeleteRow(scope.row,'delete')" />
          <i v-if="scope.row.status===1" title="禁用" class="fa fa-ban" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :show-close="false" width="890px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="temp.className" placeholder="请输入班级名称" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="班级标签" prop="typeId">
          <el-select v-model="temp.typeName" placeholder="请选择班级标签" :style="selectwidthz" class="filter-item" @change="_selectChange1">
            <el-option v-for="item in typeIds" :key="item.id" :label="item.typeName" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remarks" type="textarea" placeholder="请输入备注" :style="selectwidthz" />
        </el-form-item>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="学员列表" name="first">
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="firstwxList">新增学员</el-button>
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="firstDelete(1)">批量删除</el-button>
            <div class="el-dialog-div">
              <el-table
                v-loading="listLoadingfirstyx"
                :data="firstyx"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @selection-change="firstDeleteChange"
              >
                <el-table-column
                  type="selection"
                  label="勾选"
                  width="55px"
                />
                <el-table-column label="账户" prop="username" />
                <el-table-column label="昵称" prop="nickname" />
                <el-table-column label="学号">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.studentNumber" @blur="repeat(scope,scope.row.studentNumber)" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="手机"
                />
                <el-table-column
                  prop="wxOpenid"
                  label="微信"
                />
                <el-table-column
                  prop="address"
                  label="地址"
                />
                <el-table-column
                  prop="schoolName"
                  label="报考院校"
                />
                <el-table-column
                  prop="collegeName"
                  label="报考专业"
                />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRelation(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="一级老师列表" name="second">
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="secondwxList">新增一级老师</el-button>
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="firstDelete(2)">批量删除</el-button>
            <div class="el-dialog-div">
              <el-table
                v-loading="listLoadingsecoendyx"
                :data="secondyx"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @selection-change="secondDeleteChange"
              >
                <el-table-column
                  type="selection"
                  label="勾选"
                  width="55"
                />
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
                <el-table-column
                  prop="wxOpenid"
                  label="微信"
                />
                <el-table-column
                  prop="delegetionStartTime"
                  label="委托开始时间"
                />
                <el-table-column
                  prop="delegetionEndTime"
                  label="委托结束时间"
                />

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRelationSen(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="二级老师列表" name="third">
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="thirdwxList">新增二级老师</el-button>
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="firstDelete(3)">批量删除</el-button>
            <div class="el-dialog-div">
              <div class="el-dialog-div">
                <el-table
                  v-loading="listLoadingthirdyx"
                  :data="thirdyx"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;"
                  @selection-change="thirdDeleteChange"
                >
                  <el-table-column
                    type="selection"
                    label="勾选"
                    width="55"
                  />
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
                  <el-table-column
                    prop="wxOpenid"
                    label="微信"
                  />
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRelationSen1(scope.row)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div></el-tab-pane>
          <el-tab-pane label="查看老师列表" name="four">
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="fourdwxList">新增查看老师</el-button>
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="firstDelete(4)">批量删除</el-button>
            <div class="el-dialog-div">
              <div class="el-dialog-div">
                <el-table
                  v-loading="listLoadingthirdyx"
                  :data="fouryx"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;"
                  @selection-change="fourDeleteChange"
                >
                  <el-table-column
                    type="selection"
                    label="勾选"
                    width="55"
                  />
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
                  <el-table-column
                    prop="wxOpenid"
                    label="微信"
                  />
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRelationSen2(scope.row)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div></el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAll">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" :show-close="false" width="300px" center>
      <div class="del-dialog-cnt">请确认是否删除数据！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="学员" :visible.sync="delVisiblefirstwx" width="1300px" :show-close="false" reight @open="fourOpen(1)">
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="listQueryfirstwx.username" placeholder="账户" style="width: 130px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfirstwx" />
          <el-input v-model="listQueryfirstwx.nickname" placeholder="昵称" style="width: 130px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfirstwx" />
          <el-input v-model="listQueryfirstwx.phone" placeholder="手机" style="width: 130px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfirstwx" />
          <el-input v-model="listQueryfirstwx.wxOpenid" placeholder="微信" style="width: 130px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfirstwx" />
          <el-input v-model="listQueryfirstwx.schoolName" placeholder="报考院校" style="width: 130px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfirstwx" />
          <el-input v-model="listQueryfirstwx.collegeName" placeholder="报考专业" style="width: 130px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfirstwx" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleFilterfirstwx">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="restfirst">
            重置
          </el-button>
        </div>
        <div class="el-dialog-div1">
          <el-table
            ref="firstTable"
            v-loading="listLoadingfirstwx"
            :data="firstwx"
            style="width: 100%;"
            :row-key="getRowKeyfirst"
            @selection-change="SelectionChangefirstwx"
          >
            <el-table-column
              type="selection"
              label="勾选"
              width="55px"
              :reserve-selection="true"
            />
            <el-table-column align="center" label="账户" width="140">
              <template slot-scope="scope">
                {{ scope.row.username }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="昵称" width="140">
              <template slot-scope="scope">
                {{ scope.row.nickname }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="学号" width="140">
              <template slot-scope="scope">
                {{ scope.row.studentNumbers }}
              </template>
            </el-table-column>
            <el-table-column label="手机" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="微信" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.wxOpenid }}</span>
              </template>
            </el-table-column>
            <el-table-column label="地址" align="center">
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
            <el-table-column label="班级" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.hwClassNames }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="totalfirstwx>0" :total="totalfirstwx" :page.sync="listQueryfirstwx.current" :limit.sync="listQueryfirstwx.size" :page-sizes="[500, 1000, 1500, 2000]" @pagination="fetchDatafirstwx" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmCheckfirstNo">取 消</el-button>
        <el-button type="primary" @click="confirmCheckfirst">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="老师一" :visible.sync="delVisiblesecondwx" width="1300px" :show-close="false" reight @open="fourOpen(2)">
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="listQuerysecondwx.username" placeholder="用户名" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFiltersecondwx" />
          <el-input v-model="listQuerysecondwx.nickname" placeholder="昵称" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFiltersecondwx" />
          <el-input v-model="listQuerysecondwx.phone" placeholder="手机" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFiltersecondwx" />
          <el-input v-model="listQuerysecondwx.wxOpenid" placeholder="微信" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFiltersecondwx" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleFiltersecondwx">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="restsecond">
            重置
          </el-button>
        </div>
        <div class="el-dialog-div1">
          <el-table
            ref="secondTable"
            v-loading="listLoadingsecoendwx"
            :row-key="getRowKeysecond"
            :data="secondwx"
            style="width: 100%;"
            @selection-change="selectionChangeSecondwx"
          >
            <el-table-column
              type="selection"
              label="勾选"
              width="55px"
              :reserve-selection="true"
            /><!--:reserve-selection="true"-->
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
            <el-table-column label="手机" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="微信" width="150" align="center">
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
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="班级" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.hwClassNames }}</span>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="totalsecondwx>0" :total="totalsecondwx" :page.sync="listQuerysecondwx.current" :limit.sync="listQuerysecondwx.size" :page-sizes="[500, 1000, 1500, 2000]" @pagination="fetchDatasecondwx" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmChecksecondNo">取 消</el-button>
        <el-button type="primary" @click="confirmChecksecond">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="老师二" :visible.sync="delVisiblethirdwx" :show-close="false" width="1300px" reight @open="fourOpen(3)">
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="listQuerythirdwx.username" placeholder="用户名" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterthirdwx" />
          <el-input v-model="listQuerythirdwx.nickname" placeholder="昵称" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterthirdwx" />
          <el-input v-model="listQuerythirdwx.phone" placeholder="手机" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterthirdwx" />
          <el-input v-model="listQuerythirdwx.wxOpenid" placeholder="微信" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterthirdwx" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleFilterthirdwx">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="restthird">
            重置
          </el-button>
        </div>
        <div class="el-dialog-div1">
          <el-table
            ref="thirdTable"
            v-loading="listLoadingthirdwx"
            :row-key="getRowKeythird"
            :data="thirdwx"
            style="width: 100%;"
            @selection-change="selectionChangethirdwx"
          >
            <el-table-column
              type="selection"
              label="勾选"
              width="55px"
              :reserve-selection="true"
            /><!--:reserve-selection="true"-->
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
            <el-table-column label="手机" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="微信" width="150" align="center">
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
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="班级" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.hwClassNames }}</span>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="totalthirdwx>0" :total="totalthirdwx" :page.sync="listQuerythirdwx.current" :limit.sync="listQuerythirdwx.size" :page-sizes="[500, 1000, 1500, 2000]" @pagination="fetchDatathirdwx" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmCheckthirdNo">取 消</el-button>
        <el-button type="primary" @click="confirmCheckthird">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看老师" :visible.sync="delVisiblefourwx" :show-close="false" width="1300px" reight @open="fourOpen(4)">
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="listQueryfourwx.username" placeholder="用户名" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfourwx" />
          <el-input v-model="listQueryfourwx.nickname" placeholder="昵称" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfourwx" />
          <el-input v-model="listQueryfourwx.phone" placeholder="手机" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfourwx" />
          <el-input v-model="listQueryfourwx.wxOpenid" placeholder="微信" style="width: 200px;" size="mini" class="filter-item" @keyup.enter.native="handleFilterfourwx" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleFilterfourwx">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="restfour">
            重置
          </el-button>
        </div>
        <div class="el-dialog-div1">
          <el-table
            ref="fourTable"
            v-loading="listLoadingfourwx"
            :row-key="getRowKeyfour"
            :data="fourwx"
            style="width: 100%;"
            @selection-change="selectionChangefourwx"
          >
            <el-table-column
              type="selection"
              label="勾选"
              width="55px"
              :reserve-selection="true"
            /><!--:reserve-selection="true"-->
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
            <el-table-column label="手机" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="微信" width="150" align="center">
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
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="班级" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.hwClassNames }}</span>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="totalfourwx>0" :total="totalfourwx" :page.sync="listQueryfourwx.current" :limit.sync="listQueryfourwx.size" :page-sizes="[500, 1000, 1500, 2000]" @pagination="fetchDatafourwx" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmCheckfourNo">取 消</el-button>
        <el-button type="primary" @click="confirmCheckfour">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getHwClassList, createHwClass, updateHwClass, deleteHwClass, checkClassName, deleteHwClasss, updateStatusById, getRoleIds, deleteHwClassAndStudent, deleteHwClassAndStudentList, deleteHwClassAndTeacher, deleteHwClassAndTeacherList } from '@/api/homework/hwClass.js'
import { getHwTeacherPageListOpen, getHwClassCheckBox } from '@/api/homework/teacher'
import { getHwTeacherPageListOpens, getIsExis } from '@/api/homework/student'
import { getHwClassTypeAll } from '@/api/homework/hwClassType'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'
import { getDictDataList } from '@/utils/dictUtils'

// 让data数据在创建阶段透传到全局变量
export default {
  name: 'UserMgn',
  components: { Pagination, DictSelect },
  directives: { waves },
  data() {
    return {
      firstDeleteList: [],
      secondDeleteList: [],
      thirdDeleteList: [],
      fourDeleteList: [],
      ysnchong: {},
      activeName: 'first',
      roleIdOne: undefined,
      roleIdTwo: undefined,
      roleIdSee: undefined,
      firstyx: [],
      firstyxcs: [],
      firstwx: [],
      secondyx: [],
      secondyxcs: [],
      secondwx: [],
      thirdyx: [],
      thirdyxcs: [],
      thirdwx: [],
      fourwx: [],
      fouryxcs: [],
      fouryx: [],
      statuss: [],
      typeIds: [], // 状态
      statusQueryParam: {},
      delVisiblefirstwx: false,
      delVisiblesecondwx: false,
      delVisiblethirdwx: false,
      delVisiblefourwx: false,
      getRowKeyfirst(row) {
        return row.id
      },
      getRowKeysecond(row) {
        return row.id
      },
      getRowKeythird(row) {
        return row.id
      },
      getRowKeyfour(row) {
        return row.id
      },
      delVisible: false,
      rowrows: [],
      multipleSelection: [],
      selectionfirstwx: [],
      selectionsecondwx: [],
      selectionthirdwx: [],
      selectionfourwx: [],
      list: null,
      listLoading: false,
      listLoadingfirstyx: false,
      listLoadingfirstwx: false,
      listLoadingsecoendyx: false,
      listLoadingsecoendwx: false,
      listLoadingthirdyx: false,
      listLoadingthirdwx: false,
      listLoadingfourwx: false,
      listLoadingfouryx: false,
      total: 0,
      totalfirstwx: 0,
      totalsecondwx: 0,
      totalthirdwx: 0,
      totalfourwx: 0,
      deleteor: 'delete',
      listQuery: {
        current: 1,
        className: undefined,
        typeId: undefined,
        remarks: undefined
      },
      listQueryfirstwx: {
        current: 1,
        size: 500,
        username: undefined,
        nickname: undefined,
        wxOpenid: undefined,
        schoolName: undefined,
        collegeName: undefined,
        phone: undefined,
        classId: undefined
      },
      listQuerysecondwx: {
        current: 1,
        size: 500,
        username: undefined,
        nickname: undefined,
        wxOpenid: undefined,
        phone: undefined,
        type: undefined
      },
      listQuerythirdwx: {
        current: 1,
        size: 500,
        username: undefined,
        nickname: undefined,
        wxOpenid: undefined,
        phone: undefined,
        type: undefined,
        classId: undefined
      },
      listQueryfourwx: {
        current: 1,
        size: 500,
        username: undefined,
        nickname: undefined,
        wxOpenid: undefined,
        phone: undefined,
        type: undefined,
        classId: undefined
      },
      temp: {
        className: undefined,
        typeId: undefined,
        remarks: undefined,
        typeName: undefined,
        idLists: [],
        idList1: [],
        idList2: [],
        idList3: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        className: [{ required: true, message: '请输入班级名称', trigger: 'blur' }, { validator: this.checkName, trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择班级标签', trigger: 'change' }]
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
    this.statuss = getDictDataList('hw_class_type_status')
    this.getHwClassType()
    this.fetchData()
    this.getRoleId()
  },
  updated() {
    /*    if (this.pandfirst === '1') {
      if (this.firstyx !== undefined && this.firstyx.length > 0) {
        const jj = this.firstwx.filter(x => this.firstyx.some(y => y.id === x.id))
        const ddd = this.$refs.firstTable
        jj.forEach(function(aaa) {
          ddd.toggleRowSelection(aaa, true)
        })
      }
      this.pand = '2'
    }
    if (this.pandsecond === '1') {
      if (this.secondyx !== undefined && this.secondyx.length > 0) {
        const jj = this.secondwx.filter(x => this.secondyx.some(y => y.id === x.id))
        const ddd = this.$refs.secondTable
        jj.forEach(function(aaa) {
          ddd.toggleRowSelection(aaa, true)
        })
      }
      this.pandsecond = '2'
    }
    if (this.pandthird === '1') {
      if (this.thirdyx !== undefined && this.thirdyx.length > 0) {
        const jj = this.thirdwx.filter(x => this.thirdyx.some(y => y.id === x.id))
        const ddd = this.$refs.thirdTable
        jj.forEach(function(aaa) {
          ddd.toggleRowSelection(aaa)
        })
      }
      this.pandthird = '2'
    }
    if (this.pandfour === '1') {
      if (this.fouryx !== undefined && this.fouryx.length > 0) {
        const jj = this.fourwx.filter(x => this.fouryx.some(y => y.id === x.id))
        const ddd = this.$refs.fourTable
        jj.forEach(function(aaa) {
          ddd.toggleRowSelection(aaa)
        })
      }
      this.pandthird = '2'
    }*/
  },
  methods: {
    checkName(rule, value, callback) {
      if (value && value.length > 0) {
        checkClassName({ id: this.classIdNew, className: value }).then(res => {
          if (res.success && res.data) {
            callback()
          } else {
            callback(new Error(res.msg))
          }
        })
      } else {
        callback(new Error('请输入班级名称'))
      }
    },
    fourOpen(type) {
      let obj
      let rows
      if (type === 1) {
        obj = this.$refs.firstTable
        rows = this.firstyx
      } else if (type === 2) {
        obj = this.$refs.secondTable
        rows = this.secondyx
      } else if (type === 3) {
        obj = this.$refs.thirdTable
        rows = this.thirdyx
      } else if (type === 4) {
        obj = this.$refs.fourTable
        rows = this.fouryx
      }
      if (obj !== undefined && rows !== undefined) {
        this.toggleSelection(rows, obj)
      }
    },
    toggleSelection(rows, obj) {
      // debugger
      if (rows) {
        rows.forEach(row => {
          if (!row.relationId) {
            obj.toggleRowSelection(row)
          }
        })
      } else {
        obj.clearSelection()
      }
    },
    deleteRelation(row) {
      if (row.relationId) {
        deleteHwClassAndStudent(row.relationId).then(res => {
          if (res.success && res.data !== null && res.data) {
            this.firstyxcs.splice(this.firstyxcs.findIndex(item => item.id === row.id), 1)
            this.firstyx.splice(this.firstyx.findIndex(item => item.id === row.id), 1)
            this.$message.success('删除关联成功')
          } else {
            this.$message.error('删除关联失败')
          }
        })
      } else {
        this.firstyx.splice(this.firstyx.findIndex(item => item.id === row.id), 1)
        this.$message.success('移除成功')
      }
    },
    async deleteRelationSen1(row) {
      if (row.relationId) {
        const res = await deleteHwClassAndTeacher(row.relationId)
        if (res.success && res.data !== null && res.data) {
          this.thirdyx.splice(this.thirdyx.findIndex(item => item.id === row.id), 1)
          this.thirdyxcs.splice(this.thirdyxcs.findIndex(item => item.id === row.id), 1)
          this.$message.success('删除关联成功')
        } else {
          this.$message.error('删除关联失败')
        }
      } else {
        await this.thirdyx.splice(this.thirdyx.findIndex(item => item.id === row.id), 1)
        this.$message.success('移除成功')
      }
    },
    async deleteRelationSen2(row) {
      if (row.relationId) {
        const res = await deleteHwClassAndTeacher(row.relationId)
        if (res.success && res.data !== null && res.data) {
          this.fouryx.splice(this.fouryx.findIndex(item => item.id === row.id), 1)
          this.fouryxcs.splice(this.fouryxcs.findIndex(item => item.id === row.id), 1)
          this.$message.success('删除关联成功')
        } else {
          this.$message.error('删除关联失败')
        }
      } else {
        await this.fouryx.splice(this.fouryx.findIndex(item => item.id === row.id), 1)
        this.$message.success('移除成功')
      }
    },
    async deleteRelationSen(row) {
      if (row.relationId) {
        const res = await deleteHwClassAndTeacher(row.relationId)
        if (res.success && res.data !== null && res.data) {
          console.log(this.secondyx)
          this.secondyx.splice(this.secondyx.findIndex(item => item.id === row.id), 1)
          this.secondyxcs.splice(this.secondyxcs.findIndex(item => item.id === row.id), 1)
          this.$message.success('删除关联成功')
        } else {
          this.$message.error('删除关联失败')
        }
      } else {
        await this.secondyx.splice(this.secondyx.findIndex(item => item.id === row.id), 1)
        this.$message.success('移除成功')
      }
    },
    repeat(scope, value) {
      let aa = 0
      this.firstyx.find(item => {
        if (item.studentNumber === value && scope.row.id !== item.id) {
          aa = 1
          return
        }
      })
      if (aa === 1) {
        this.$message.error('此学号已存在！')
        return false
      }
      if (value) {
        if (this.ysnchong[value] && this.ysnchong[value] !== scope.row.id) {
          this.$message.error('此学号已存在！')
        }
      }
      const data = { classId: this.classIdNew, studentNumber: value, studentId: scope.row.id }
      getIsExis(data).then(res => {
        if (res.data) {
          this.$message.error('此学号已存在！')
          scope.row.studentNumber = undefined
        }
      })
    },
    cancelAll() {
      this.dialogFormVisible = false
      this.resetTemp()
    },
    confirmCheckfirst() {
      const arr = [...this.firstyxcs, ...this.selectionfirstwx]
      this.firstyx = arr
      // this.firstyx = this.quchong(arr)
      this.delVisiblefirstwx = false
      this.$refs.firstTable.clearSelection()
    },
    confirmChecksecond() {
      const arr = [...this.secondyxcs, ...this.selectionsecondwx]
      this.secondyx = [...arr]
      // this.secondyx = this.selectionsecondwx
      this.delVisiblesecondwx = false
      this.$refs.secondTable.clearSelection()
    },
    confirmCheckthird() {
      const arr = [...this.thirdyxcs, ...this.selectionthirdwx]
      this.thirdyx = [...arr]
      // this.thirdyx = this.selectionthirdwx
      this.delVisiblethirdwx = false
      this.$refs.thirdTable.clearSelection()
    },
    confirmCheckfour() {
      const arr = [...this.fouryxcs, ...this.selectionfourwx]
      this.fouryx = [...arr]
      // this.thirdyx = this.selectionthirdwx
      this.delVisiblefourwx = false
      this.$refs.fourTable.clearSelection()
    },
    confirmCheckfirstNo() {
      this.delVisiblefirstwx = false
      this.$refs.firstTable.clearSelection()
    },
    confirmChecksecondNo() {
      this.delVisiblesecondwx = false
      this.$refs.secondTable.clearSelection()
    },
    confirmCheckthirdNo() {
      this.delVisiblethirdwx = false
      this.$refs.thirdTable.clearSelection()
    },
    confirmCheckfourNo() {
      this.delVisiblefourwx = false
      this.$refs.fourTable.clearSelection()
    },
    getRoleId() {
      getRoleIds({ 'oneRoleType': 'leve1teacher', 'twoRoleType': 'leve2teacher', 'seeRoleType': 'seeteacher' }).then(response => {
        this.roleIdOne = response.data.oneRoleType
        this.roleIdTwo = response.data.twoRoleType
        this.roleIdSee = response.data.seeRoleType
      })
    },
    firstwxList() {
      this.listLoadingfirstwx = true
      this.delVisiblefirstwx = true
      this.fetchDatafirstwx()
    },
    secondwxList() {
      this.listLoadingsecoendwx = true
      this.delVisiblesecondwx = true
      this.listQuerysecondwx.type = 'leve1teacher'
      this.fetchDatasecondwx()
      this.listLoadingsecoendwx = false
    },
    thirdwxList() {
      this.listLoadingthirdwx = true
      this.delVisiblethirdwx = true
      this.listQuerythirdwx.type = 'leve2teacher'
      this.fetchDatathirdwx()
      this.listLoadingthirdwx = false
    },
    fourdwxList() {
      this.listLoadingfourwx = true
      this.delVisiblefourwx = true
      this.listQueryfourwx.type = 'seeteacher'
      this.fetchDatafourwx()
      this.listLoadingfourwx = false
    },
    restfirst() { // 重置
      this.listQueryfirstwx.username = undefined
      this.listQueryfirstwx.nickname = undefined
      this.listQueryfirstwx.wxOpenid = undefined
      this.listQueryfirstwx.schoolName = undefined
      this.listQueryfirstwx.collegeName = undefined
      this.listQueryfirstwx.phone = undefined
      this.fetchDatafirstwx()
    },
    restsecond() { // 重置
      this.listQuerysecondwx.username = undefined
      this.listQuerysecondwx.nickname = undefined
      this.listQuerysecondwx.wxOpenid = undefined
      this.listQuerysecondwx.phone = undefined
      this.fetchDatasecondwx()
    },
    restthird() { // 重置
      this.listQuerythirdwx.username = undefined
      this.listQuerythirdwx.nickname = undefined
      this.listQuerythirdwx.wxOpenid = undefined
      this.listQuerythirdwx.phone = undefined
      this.fetchDatathirdwx()
    },
    restfour() { // 重置
      this.listQueryfourwx.username = undefined
      this.listQueryfourwx.nickname = undefined
      this.listQueryfourwx.wxOpenid = undefined
      this.listQueryfourwx.phone = undefined
      this.fetchDatafourwx()
    },
    handleClick(tab, event) {
    },
    _selectChange1(val) {
      this.temp.typeId = val.id
      this.temp.typeName = val.typeName
    },
    resetListQuery() {
      this.listQuery.className = undefined
      this.listQuery.typeId = undefined
      this.listQuery.remarks = undefined
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const that = this
      getHwClassList(this.listQuery).then(response => {
        this.list = response.data.records
        this.list.forEach(function(a, b) {
          if (a.studentNumber) {
            that.ysnchong[a.studentNumber] = a.id
          }
        })
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    fetchDatafirstyx() {
      this.listLoading = true
      getHwClassList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    }, fetchDatafirstwx() {
      this.listLoadingfirstwx = true
      this.listQueryfirstwx.classId = this.classIdNew
      getHwTeacherPageListOpens(this.listQueryfirstwx).then(response => {
        this.firstwx = response.data.records
        this.totalfirstwx = parseInt(response.data.total)
        this.listLoadingfirstwx = false
        this.pandfirst = '1'
      })
    },
    quchong(arr) {
      const hash = {}
      arr = arr.reduce(function(item, next) {
        hash[next.id] ? '' : hash[next.id] = true && item.push(next)
        return item
      }, [])
      return arr
    },
    fetchDatasecondwx() {
      this.listLoadingsecoendwx = true
      this.listQuerysecondwx.classId = this.classIdNew
      getHwTeacherPageListOpen(this.listQuerysecondwx).then(response => {
        this.secondwx = response.data.records
        this.totalsecondwx = parseInt(response.data.total)
        this.listLoadingsecoendwx = false
        this.pandsecond = '1'
      })
    },
    fetchDatathirdwx() {
      this.listLoadingthirdyx = true
      this.listQuerythirdwx.classId = this.classIdNew
      getHwTeacherPageListOpen(this.listQuerythirdwx).then(response => {
        this.thirdwx = response.data.records
        this.totalthirdwx = parseInt(response.data.total)
        this.listLoadingthirdyx = false
        this.pandthird = '1'
      })
    },
    fetchDatafourwx() {
      this.listLoadingfouryx = true
      this.listQueryfourwx.classId = this.classIdNew
      getHwTeacherPageListOpen(this.listQueryfourwx).then(response => {
        this.fourwx = response.data.records
        this.totalfourwx = parseInt(response.data.total)
        this.listLoadingfouryx = false
        this.pandfour = '1'
      })
    },
    getHwClassType() {
      getHwClassTypeAll({ status: 1 }).then(response => {
        this.typeIds = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleFilterfirstwx() {
      this.listQueryfirstwx.page = 1
      this.fetchDatafirstwx()
    },
    handleFiltersecondwx() {
      this.listQuerysecondwx.page = 1
      this.fetchDatasecondwx()
    },
    handleFilterthirdwx() {
      this.listQuerythirdwx.page = 1
      this.fetchDatathirdwx()
    },
    handleFilterfourwx() {
      this.listQueryfourwx.page = 1
      this.fetchDatafourwx()
    },
    handleDelete() {
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteHwClass(this.temp.id).then(() => {
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
    tableDeleteRow(row, or) {
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        if (this.multipleSelection.length < 1) {
          this.$message('请勾选要删除的项！')
        } else {
          this.delVisible = true
        }
      }
    },
    handleDeletes() {
      const length = this.multipleSelection.length
      const delarr = []
      for (let i = 0; i < length; i++) {
        delarr.push(this.multipleSelection[i].id)
      }
      deleteHwClasss(delarr).then(() => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickname: ''
      }
      this.firstyx = []
      this.firstyxcs = []
      this.secondyx = []
      this.secondyxcs = []
      this.thirdyx = []
      this.thirdyxcs = []
      this.fouryx = []
      this.fouryxcs = []
      this.activeName = 'first'
    },
    handleCreate() {
      if (this.$refs.firstTable !== undefined) {
        this.$refs.firstTable.clearSelection()
      }
      if (this.$refs.secondTable !== undefined) {
        this.$refs.secondTable.clearSelection()
      }
      if (this.$refs.thirdTable !== undefined) {
        this.$refs.thirdTable.clearSelection()
      }
      if (this.$refs.fourTable !== undefined) {
        this.$refs.thirdTable.clearSelection()
      }
      this.classIdNew = undefined
      this.resetTemp()
      this.getHwClassType()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.usernameDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        const aa = this.firstyx
        const idLists = []
        if (aa !== undefined && aa.length > 0) {
          aa.forEach(function(a) {
            const mm = { 'studentId': a.id, 'studentNumber': a.studentNumber }
            idLists.push(mm)
          })
        }
        this.temp.idLists = idLists
        const bb = this.secondyx
        const idList1 = []
        if (bb !== undefined && bb.length > 0) {
          bb.forEach(function(a) {
            const mm = { 'teacherId': a.id, 'teacherRoleId': a.roleId }
            idList1.push(mm)
          })
        }
        this.temp.idList1 = idList1
        const cc = this.thirdyx
        const idList2 = []
        if (cc !== undefined && cc.length > 0) {
          cc.forEach(function(a) {
            const mm = { 'teacherId': a.id, 'teacherRoleId': a.roleId }
            idList2.push(mm)
          })
        }
        this.temp.idList2 = idList2
        const dd = this.fouryx
        const idList3 = []
        if (dd !== undefined && dd.length > 0) {
          dd.forEach(function(a) {
            const mm = { 'teacherId': a.id, 'teacherRoleId': a.roleId }
            idList3.push(mm)
          })
        }
        this.temp.idList3 = idList3

        if (valid) {
          createHwClass(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.resetTemp()
          })
        }
      })
    },
    handleUpdate(row) {
      const mm = { 'id': row.id }
      this.classIdNew = row.id
      getHwClassCheckBox(mm).then(response => {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.usernameDisabled = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.firstyx = response.data.idLists
        this.firstyxcs = [...response.data.idLists]
        this.secondyx = response.data.idList1
        this.secondyxcs = [...response.data.idList1]
        this.thirdyx = response.data.idList2
        this.thirdyxcs = [...response.data.idList2]
        this.fouryx = response.data.idList3
        this.fouryxcs = [...response.data.idList3]
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const aa = this.firstyx
          const idLists = []
          if (aa !== undefined && aa.length > 0) {
            aa.forEach(function(a) {
              const mm = { 'studentId': a.id, 'studentNumber': a.studentNumber }
              idLists.push(mm)
            })
          }
          this.temp.idLists = idLists
          const bb = this.secondyx
          const idList1 = []
          if (bb !== undefined && bb.length > 0) {
            bb.forEach(function(a) {
              const mm = { 'teacherId': a.id }
              idList1.push(mm)
            })
          }
          this.temp.idList1 = idList1
          const cc = this.thirdyx
          const idList2 = []
          if (cc !== undefined && cc.length > 0) {
            cc.forEach(function(a) {
              const mm = { 'teacherId': a.id }
              idList2.push(mm)
            })
          }
          this.temp.idList2 = idList2
          const dd = this.fouryx
          const idList3 = []
          if (dd !== undefined && dd.length > 0) {
            dd.forEach(function(a) {
              const mm = { 'teacherId': a.id }
              idList3.push(mm)
            })
          }
          this.temp.idList3 = idList3
          this.temp.roleIdOne = this.roleIdOne
          this.temp.roleIdTwo = this.roleIdTwo
          this.temp.roleIdSee = this.roleIdSee
          const tempData = Object.assign({}, this.temp)
          updateHwClass(tempData).then(() => {
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
            this.resetTemp()
          })
        }
      })
    },
    menuTypeFormat(row, type) {
      let vv = '-'
      const typ = this[type.property + 's']
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.id === (row[type.property] + '')) {
          vv = aa.typeName
        }
      })
      return vv
    }, menuTypeFormat1(row, type) {
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
            this.delarr.push(this.multipleSelection[i].areaCode)
          }
          this.delVisible = true
        }
      }
    },
    firstDelete(type) {
      if (type === 1) {
        this.firstDeleteBatch(this.firstDeleteList, this.firstyx, this.firstyxcs, '学员')
      } else if (type === 2) {
        this.firstDeleteBatch(this.secondDeleteList, this.secondyx, this.secondyxcs, '一级老师')
      } else if (type === 3) {
        this.firstDeleteBatch(this.thirdDeleteList, this.thirdyx, this.thirdyxcs, '二级老师')
      } else if (type === 4) {
        this.firstDeleteBatch(this.fourDeleteList, this.fouryx, this.fouryxcs, '查看老师')
      }
    },
    firstDeleteChange(val) {
      this.firstDeleteList = val
    },
    secondDeleteChange(val) {
      this.secondDeleteList = val
    },
    thirdDeleteChange(val) {
      this.thirdDeleteList = val
    },
    fourDeleteChange(val) {
      this.fourDeleteList = val
    },
    firstDeleteBatch(val, obj, objcs, name) {
      // 批量删除学员
      const that = this
      const ids = []
      if (val !== undefined && val.length > 0) {
        val.forEach(function(a, b) {
          if (a.relationId) {
            ids.push(a.relationId)
          } else {
            obj.splice(obj.findIndex(item => item.id === a.id), 1)
          }
        })
        if (ids.length > 0) {
          // 执行批量删除
          if (name === '学员') {
            deleteHwClassAndStudentList(ids).then(res => {
              if (res.success && res.data !== null && res.data) {
                for (let i = 0; i < ids.length; i++) {
                  obj.splice(obj.findIndex(item => item.relationId === ids[i]), 1)
                  objcs.splice(objcs.findIndex(item => item.relationId === ids[i]), 1)
                }
                that.$message.success('删除' + name + '成功')
              } else {
                that.$message.success('删除' + name + '失败')
              }
            })
          } else {
            deleteHwClassAndTeacherList(ids).then(res => {
              if (res.success && res.data !== null && res.data) {
                for (let i = 0; i < ids.length; i++) {
                  obj.splice(obj.findIndex(item => item.relationId === ids[i]), 1)
                  objcs.splice(objcs.findIndex(item => item.relationId === ids[i]), 1)
                }
                that.$message.success('删除' + name + '成功')
              } else {
                that.$message.success('删除' + name + '失败')
              }
            })
          }
        } else {
          that.$message.success('删除' + name + '成功')
        }
      } else {
        this.$message.error('请先选择要删除的' + name)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    SelectionChangefirstwx(val) {
      this.selectionfirstwx = val
    },
    selectionChangeSecondwx(val) {
      this.selectionsecondwx = val
    },
    selectionChangethirdwx(val) {
      this.selectionthirdwx = val
    },
    selectionChangefourwx(val) {
      // debugger
      this.selectionfourwx = val
    },
    updateStatus(row) {
      let vv = 0
      let msg = '已启用'
      if (row.status === 0) {
        vv = 1
      }
      if (row.status === 1) {
        vv = 2
        msg = '已停用'
      }
      if (row.status === 2) {
        vv = 1
      }
      this.statusQueryParam.status = vv
      this.statusQueryParam.id = row.id
      updateStatusById(this.statusQueryParam).then(() => {
        this.fetchData()
        // const mess = vv === 0 ? '未发布' : (vv === 1 ? '发布' : '冻结')
        this.$message(msg)
        this.delVisible = false
      })
    }
  }
}
</script>

<style>

  .el-dialog-div{
    height: 300px;
    overflow: auto;
  }

  .el-dialog-div1{
    height: 400px;
    overflow: auto;
  }
</style>
