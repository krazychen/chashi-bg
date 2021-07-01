<template>
  <div class="app-container">
    <p-nav style="margin-bottom: 3em;" :index="$route.path" />

    <el-form v-if="!loading" ref="dataForm" :model="form" label-width="80px">

      <el-form-item label="地址">
        <el-cascader
          v-model="cityVal"
          :options="cityOptions"
          style="width: 100%"
          @change="handleAddressChange"
        />

        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>

      <el-form-item label="报考院校">
        <el-select v-model="form.schoolId" filterable clearable placeholder="请选择报考院校" @change="handleSchoolChange">
          <el-option
            v-for="item in schoolList"
            :key="item.label"
            :label="item.value"
            :value="item.schoolId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报考专业">
        <el-select v-model="form.collegeId" filterable clearable placeholder="请选择报考专业" @change="handleCollegeChange">
          <el-option
            v-for="item in schoolCollegeList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { getSysAreaRedisSimplifyPageList } from '@/api/system/sysArea.js'
import { getCurrentUserInfo } from '@/api/system/user.js'
import { getCurrentStudentInfo, getSchoolListByCode, getSchooCollegelList } from '@/api/homework/student.js'
// import { updateStudent } from '@/api/homework/student'
import { update } from '@/api/system/user.js'
import PNav from './nav'

export default {
  components: {
    PNav
  },
  data() {
    return {
      loading: true,
      form: {},
      cityVal: [],
      cityOptions: [],
      schoolList: [],
      schoolCollegeList: [],
      loadings: true
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'userInfo'
    ])
  },
  watch: {
    // 'form.schoolId': function(val) {
    //   if (val) {
    //     getSchooCollegelList(val).then((res) => {
    //       this.schoolCollegeList = res.data
    //     })
    //   }
    // }
  },
  created() {

  },
  mounted() {
    this.loadData()
  },
  methods: {
    async onSubmit() {
      console.log('on submit!')
      const res = await update(this.form)

      if (res.success) {
        this.$store.dispatch('user/getInfo')
        this.$notify({
          title: '成功',
          message: '资料已变更',
          type: 'success',
          duration: 2000
        })
      } else {
        this.$notify({
          title: '出问题啦',
          message: '资料未变更',
          type: 'error',
          duration: 2000
        })
      }
    },
    formatOptions(oriArr = []) {
      const newArr = []
      oriArr.forEach(item => {
        if (item.children && item.children.length > 0) {
          const { children } = item
          newArr.push({ value: item.id, label: item.label, children: this.formatOptions(children) })
        } else {
          newArr.push({ value: item.id, label: item.label })
        }
      })
      return newArr
    },
    async loadData() {
      this.loading = true

      let res = await getCurrentStudentInfo()

      const { provinceCode, cityCode, districtCode } = res.data

      this.cityVal = [provinceCode, cityCode, districtCode]
      Vue.set(this, 'form', { ...res.data })

      this.loading = false

      res = await getSysAreaRedisSimplifyPageList()
      this.cityOptions = this.formatOptions(res.data)

      if (provinceCode) {
        res = await getSchoolListByCode({ 'provinceCode': provinceCode })
        this.schoolList = res.data
        res = await getSchooCollegelList(this.form.schoolId)
        this.schoolCollegeList = res.data
      }
    },
    handleSchoolChange() {
      // should not post code and name from client !!!
      const school = this.schoolList.find(sc => sc.schoolId === this.form.schoolId)
      this.form.schoolCode = school.label
      this.form.schoolName = school.value
      getSchooCollegelList(this.form.schoolId).then((res) => {
        this.schoolCollegeList = res.data
      })
    },
    handleCollegeChange() {
      const college = this.schoolCollegeList.find(co => co.id === this.form.collegeId)
      this.form.collegeName = college.value
      this.form.collegeCode = college.label
    },
    async handleAddressChange() {
      const [provinceCode, cityCode, districtCode, ...rest] = this.cityVal

      // shit....
      const province = this.cityOptions.find(obj => obj.value === provinceCode)
      const res = await getSchoolListByCode({ 'provinceCode': provinceCode })
      this.schoolList = res.data
      this.form.schoolId = ''
      this.form.schoolName = ''
      this.form.collegeId = ''
      this.form.collegeCode = ''
      this.form.collegeName = ''
      this.schoolCollegeList = []
      const city = province.children.find(obj => obj.value === cityCode)
      const district = city.children.find(obj => obj.value === districtCode)
      Object.assign(this.form, {
        provinceCode: province.value,
        provinceName: province.label,
        cityCode: city.value,
        cityName: city.label,
        districtCode: district.value,
        districtName: district.label
      })
    }
  }
}
</script>
