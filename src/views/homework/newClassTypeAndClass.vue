<template>
  <el-dialog title="选择发布班级" :visible.sync="classChoice" width="950px" @opened="addRef">
    <div class="control">
      <div style="border-top: 1px solid #DCDFE6;height: 100%;">
        <el-row>
          <el-col :span="5">
            <div class="thiscontainer" style="align-content: center">
              <p style="padding-left:30px;margin-bottom: 0px;font-size: 15px;">
                班级标签
              </p>
              <span style="text-align: center;font-size: 15px;">
                <!--                <el-tree-->
                <!--                  :data="data"-->
                <!--                  show-checkbox-->
                <!--                  node-key="id"-->
                <!--                />-->

              </span>
              <el-radio-group v-model="currentClassType" @change="classTypeChange">
                <p v-for="item in leftDataList" style="font-size: 15px;">
                  <el-tooltip v-if="item.typeName && item.typeName.length>=9" class="item" effect="dark" :content="item.typeName" placement="top-start">
                    <el-radio :key="item.id" :label="item" :value="item.id">{{ item.typeName }}</el-radio>
                  </el-tooltip>
                  <el-radio v-else :key="item.id" :label="item" :value="item.id">{{ item.typeName }}</el-radio>
                </p>
              </el-radio-group>

            </div>
          </el-col>
          <el-col :span="19">
            <div class="thiscontainer" style="border-left:1px solid #DCDFE6;padding-left: 20px;">
              <el-table
                ref="multip"
                v-loading="listLoading"
                :data="rightDataList"
                :row-key="getRowKeysecond"
                height="480px"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  label="勾选"
                  width="55px"
                  fixed
                />
                <el-table-column prop="className" label="班级名称" />
                <el-table-column prop="number" label="班级人数" />
                <el-table-column prop="teachers" label="一级老师" />
              </el-table>
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="listQuery.current"
                :limit.sync="listQuery.size"
                class="box2"
                @pagination="onPageListByClassType"
              />
            </div>
          </el-col>
        </el-row>

        <!--    <div class="filter-container">-->
        <!--    </div>-->
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <span style="margin: 0 10px;">已选<span style="color: red">{{ classTypeNumber }}</span>标签</span><span style="margin: 0 10px;">已选<span
        style="color: red"
      >{{ classNumber }}</span>班级</span>
      <el-button @click="chongzhi">重置</el-button>
      <el-button @click="ceshi">取 消</el-button>
      <el-button type="primary" @click="zuzhuang">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'ClassTypeAndClass',
  components: {
    Pagination
  },
  props: {
    fatherClassChoice: {
      type: Boolean,
      default: false
    },
    getHwHomeworkClassRef: {
      type: Function,
      default: null
    },
    classTypeAndClass: {
      type: Function,
      default: null
    },
    pageListByClassType: {

      type: Function,
      default: null
    }
  },
  data() {
    return {
      pandfirst: '0',
      listClassType: {},
      beifenxuanzhong: [],
      xuanzhong: [],
      classTypeIdAndClassId: {},
      classTypeNumber: 0,
      classNumber: 0,
      fenleiMap: {},
      currentClassType: {},
      classChoice: this.fatherClassChoice,
      listQuery: {
        current: 1,
        id: undefined
      },
      total: 0,
      leftDataList: [],
      rightDataList: [],
      currentClassTypeMap: {},
      currentClassTypeClass: {},
      listLoading: false,
      data: [{ id: 1, label: '2020全程班全程班全程班全程班全程班全程班全程班全程班全程班' }, { id: 2, label: '2020全程班全程班全程班全程班全程班全程班全程班全程班全程班' }]
    }
  },
  watch: {
    classChoice(newValue, oldvalue) {
      this.$emit('update:father-class-choice', newValue)
    },
    fatherClassChoice(newValue) {
      this.classChoice = newValue
    }
  },
  mounted() {
  },
  beforeUpdate() {

  },
  created() {
    this.onClassTypeAndClass()
  },
  methods: {
    async addRef() {
      const that = this
      this.xuanzhong = await this.getHwHomeworkClassRef()
      this.beixuanzhong = []
      this.rightDataList.forEach(r => {
        that.xuanzhong.forEach(m => {
          if (r.id === m.classId) {
            this.beixuanzhong.push(r)
          }
        })
      })
      this.toggleSelection(this.beixuanzhong)
      // this.onPageListByClassType()
    },
    chongzhi() {
      this.$refs.multip.clearSelection()
      console.log(this.beixuanzhong)
    },
    ceshi() {
      this.$refs.multip.clearSelection()
      this.toggleSelection(this.xuanzhong)
      this.onPageListByClassType()
      this.classChoice = false
    },
    zuzhuang() {
      const that = this
      this.xuanzhong = this.beixuanzhong
      const dataList = []
      const dataClass = {}
      this.xuanzhong.forEach(function(a, b) {
        dataClass[a.id] = a
      })

      for (const key in that.currentClassTypeMap) {
        const data = that.listClassType[key]
        const listClass = []
        for (const key1 in that.classTypeIdAndClassId) {
          if (that.classTypeIdAndClassId[key1] === data.id) {
            if (dataClass[key1]) {
              listClass.push(dataClass[key1])
            }
          }
        }
        data['classList'] = listClass
        dataList.push(data)
      }
      this.$emit('classListsss', dataList)
      console.log(dataList)
      this.classChoice = false
    },
    getRowKeysecond(row) {
      return row.id
    },
    toggleSelection(rows) {
      const that = this
      if (rows && rows.length > 0) {
        console.log(rows)
        rows.forEach(row => {
          that.$refs.multip.toggleRowSelection(row, true)
        })
      } else {
        that.$refs.multip.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.beixuanzhong = val
      const that = this
      // 判断标签数据设置为空
      this.currentClassTypeMap = []

      val.forEach(function(a, b) {
        that.currentClassTypeMap[that.classTypeIdAndClassId[a.id]] = true
      })

      this.classTypeNumber = Object.keys(this.currentClassTypeMap).length
      this.classNumber = val.length
    },
    async onPageListByClassType() {
      /*
        this.toggleSelection(this.xuanzhong)
  */
      const that = this
      this.listQuery.id = this.currentClassType.id
      const res = await this.pageListByClassType(this.listQuery)
      this.total = parseInt(res.data.total)
      this.rightDataList = res.data.records
      this.rightDataList.forEach(function(c, d) {
        if (!that.classTypeIdAndClassId[c.id]) {
          // 这个记录了每个用户的归属标签
          that.classTypeIdAndClassId[c.id] = that.listQuery.id
        }
      })
    },
    async onClassTypeAndClass() {
      const that = this
      /*      this.classTypeAndClass(function(res) {
        })*/
      that.leftDataList = await this.classTypeAndClass()
      this.currentClassType = this.leftDataList[0]
      this.leftDataList.forEach(function(a, b) {
        that.listClassType[a.id] = a
      })
      this.xuanzhong = await this.getHwHomeworkClassRef()
      this.xuanzhong.forEach(function(c, d) {
        that.classTypeIdAndClassId[c.id] = c.classTypeId
      })
      this.onPageListByClassType()
      this.handleSelectionChange(this.xuanzhong)
      this.zuzhuang()
    },
    classTypeChange(e) {
      this.listQuery.current = 1
      this.onPageListByClassType()
    }
  }
}
</script>

<style>

  .el-radio__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display:inherit;
    width: 100%;
  }

  /*.el-radio__label:hover {*/
  /*  text-overflow: inherit;*/
  /*  overflow: visible;*/
  /*  white-space: pre-wrap;*/
  /*  background: #606266;*/
  /*  color: #FFF;*/
  /*  opacity: 100;*/
  /*}*/

</style>

<style scoped>
  .thiscontainer {
    padding: 20px;
    height: 100%;
    position: relative
  }

  .box2 {
    position: absolute;
    padding: 0 0px;
    right: 0;
    bottom: 0
  }

  .el-row {
    height: 100%;
  }

  .el-col {
    height: 100%;
  }

  .el-radio-group{
    width: 100%;
  }
  .el-radio{
    width: 100%;
    display: inline-flex;
  }
  .control{
    height: 555px;
  }

</style>
