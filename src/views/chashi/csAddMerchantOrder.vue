<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 500px; margin-left:50px;">
      <el-form-item label="商店" prop="merchant">
        <el-select v-model="listQuery.merchantId" placeholder="请选择商店" @change="changeMerchant">
          <el-option
            v-for="item in merchantOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="茶室" prop="tearoom">
        <el-select v-model="listQuery.tearoomId" placeholder="请选择茶室" @change="changeTearoom">
          <el-option
            v-for="item in roomOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="起步价" prop="hoursAmount">
        <el-input v-model="listQuery.hoursAmount" disabled>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="输入用户ID" prop="wxuserId">
        <el-input v-model="listQuery.wxuserId" style="width: 71%; padding-right: 10px" placeholder="输入用户ID获取优惠卷和会员卡信息"></el-input>
        <el-button @click="getWxUser" type="primary">点击获取</el-button>
      </el-form-item>

      <el-tag>会员卡信息</el-tag><br/><br/>
      <el-col :span="12">
        <el-form-item label="会员卡名称" prop="membercardName">
          <el-input v-model="listQuery.membercardName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="会员折扣" prop="discountOff">
          <el-input v-model="listQuery.discountOff" disabled></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="剩余优惠金额" prop="restDiscountPrice">
          <el-input v-model="listQuery.restDiscountPrice" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="剩余优惠时长" prop="restDiscountTime">
          <el-input v-model="listQuery.restDiscountTime" disabled></el-input>
        </el-form-item>
      </el-col>

      <el-tag>优惠卷信息</el-tag><br/><br/>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 150%;" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" prop="couponName" label="优惠卷名称" width="150" />
        <el-table-column align="center" prop="fullAmount" label="满" width="150" />
        <el-table-column align="center" prop="reductionAmount" label="减" width="150" />
      </el-table>

      <br/>
      <el-form-item label="预定日期" prop="orderDate">
        <el-date-picker v-model="listQuery.orderDate" style="width: 90%" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="预订时长范围" prop="orderTimerage">
        <el-input v-model="listQuery.orderTimerage" placeholder="14:00-14:30,14:30-15:00"></el-input>
      </el-form-item>
      <el-form-item label="预订时长数" prop="orderOriginTimenum">
        <el-input v-model="listQuery.orderOriginTimenum"></el-input>
      </el-form-item>

      <el-form-item label="剩余充值余额" prop="balance">
        <el-input v-model="listQuery.balance" disabled></el-input>
      </el-form-item>

      <el-form-item label="控制选项" prop="controlType">
        <el-checkbox v-model="listQuery.isUseDiscountTime">是否用优惠时长</el-checkbox>
        <el-checkbox v-model="listQuery.isUseDiscountPrice">是否用优惠金额</el-checkbox>
        <el-checkbox v-model="listQuery.isUseRecharge">是否使用余额</el-checkbox>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer" style="float: right; margin-right: 90px;">
      <el-button type="primary" @click="createData()">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getMerchantList } from '@/api/chashi/csMerchant'
import { createMerchantOrder } from '@/api/chashi/csMerchantOrder'
import { getRoomList } from '@/api/chashi/csRoom'
import { getMemberCard } from '@/api/chashi/csMemberCardOrder'
import { getReleasedCouponForUser } from '@/api/chashi/csCoupon'
import { getWxUser } from '@/api/chashi/wxUser'
import { accAdd, accSub, accMul, accDiv } from '../../utils'
import waves from '@/directive/waves'

export default {
  name: 'CsAddMerchantOrder',
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: false,
      listQuery: {
        sort: '',
        queryType: 1,
        merchant: '',
        merchantId: '',
        tearoom: '',
        tearoomId: '',
        hoursAmount: '',
        wxuserId: '',
        wxuserPhone: '',
        openid: '',
        memberCard: '',
        membercardName: '',
        discountOff: '',
        restDiscountPrice: '',
        restDiscountTime: '',
        orderDate: '',
        orderTimerage: '',
        orderOriginTimenum: '',
        isUseDiscountTime: '',
        isUseDiscountPrice: '',
        isUseRecharge: '',
        balance: '',
        coupon: ''
      },
      temp: {
        merchantId: '',
        tearoomId: '',
        roomName: '',
        wxuserId: '',
        wxuserPhone: '',
        openid: '',
        orderDate: '',
        orderTimerage: '',
        orderOriginTimenum: '',
        orderUnitOriginPrice: '',
        orderOriginPrice: '',
        orderPrice: '',
        paymentType: '',
        couponReleasedId: '',
        orderCpAmount: '',
        orderUnitPrice: '',
        membercardOrderId: '',
        orderMbTimenum: '',
        orderTimenum: '',
        orderMbAmount: ''
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      rulesText: {
      },
      merchantOptions: [],
      merchantList: [],
      roomOptions: [],
      roomList: []
    }
  },
  beforeCreate() {
  },
  created() {
    getMerchantList({}).then(response => {
      const merchantOptionss = [{}]
      this.merchantList = response.data.records
      this.merchantList.forEach(function(obj) {
        const merchantOption = { value: obj.id, label: obj.merchantName }
        merchantOptionss.push(merchantOption)
      })
      this.merchantOptions = merchantOptionss
    })
  },
  methods: {
    changeMerchant(event) {
      const that = this
      this.merchantList.forEach(function(obj, index) {
        // console.log(obj)
        if (obj.id === event) {
          that.listQuery.merchant = obj
        }
      })
      console.log(this.listQuery.merchantId)
      getRoomList({ 'merchantId': this.listQuery.merchantId }).then(response => {
        const optionss = [{}]
        this.roomList = response.data.records
        this.roomList.forEach(function(obj) {
          const option = { value: obj.id, label: obj.roomName }
          optionss.push(option)
        })
        this.roomOptions = optionss
      })
    },
    changeTearoom(event) {
      const that = this
      this.roomList.forEach(function(obj, index) {
        // console.log(obj)
        if (obj.id === event) {
          that.listQuery.tearoom = obj
        }
      })
      this.listQuery.hoursAmount = this.listQuery.tearoom.hoursAmount
    },
    fetchData() {
      this.listLoading = true
      getReleasedCouponForUser(this.listQuery.wxuserId).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    getWxUser() {
      console.log(this.listQuery.wxuserId)
      if (this.listQuery.wxuserId.trim() === '') {
        this.$message('请输入用户ID！')
        return
      }
      getMemberCard(this.listQuery.wxuserId).then(response => {
        console.log(response.data)
        this.listQuery.memberCard = response.data
        if (this.listQuery.memberCard) {
          this.listQuery.membercardName = response.data.membercardName
          this.listQuery.discountOff = response.data.discountOff
          this.listQuery.restDiscountTime = response.data.restDiscountTime
          this.listQuery.restDiscountPrice = response.data.restDiscountPrice
        }
      })
      this.fetchData()
      getWxUser(this.listQuery.wxuserId).then(response => {
        console.log(response.data)
        this.listQuery.balance = response.data.balance
        this.listQuery.wxuserPhone = response.data.phoneNumber
        this.listQuery.openid = response.data.openid
      })
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$message('只能选择一个优惠卷！')
        return
      }
      this.listQuery.coupon = val
    },
    createData() {
      // 未使用优惠卷和没有会员卡情况,并且未使用余额
      // 需要传的字段merchantId,tearoomId,roomName,wxuserId,wxuserPhone,openid,orderDate,orderTimerage,orderOriginTimenum,
      // orderUnitOriginPrice,orderOriginPrice,orderPrice
      this.temp.merchantId = this.listQuery.merchant.id
      this.temp.tearoomId = this.listQuery.tearoom.id
      this.temp.roomName = this.listQuery.tearoom.roomName
      this.temp.wxuserId = this.listQuery.wxuserId
      this.temp.wxuserPhone = this.listQuery.wxuserPhone
      this.temp.openid = this.listQuery.openid
      this.temp.orderDate = this.listQuery.orderDate
      this.temp.orderTimerage = this.listQuery.orderTimerage
      this.temp.orderOriginTimenum = this.listQuery.orderOriginTimenum
      // 原单价
      this.temp.orderUnitOriginPrice = this.listQuery.hoursAmount
      // 原总价
      this.temp.orderOriginPrice = accMul(this.temp.orderOriginTimenum, this.temp.orderUnitOriginPrice)

      // 如果有会员卡，则计算会员卡优惠单价金额， 增加membercardOrderId, orderUnitPrice
      if (this.listQuery.memberCard) {
        this.temp.membercardOrderId = this.listQuery.memberCard.id
        // 会员卡优惠后的单价
        this.temp.orderUnitPrice = accMul(this.temp.orderUnitOriginPrice, accDiv(this.listQuery.discountOff, 10))
        this.temp.orderTimenum = 0
        this.temp.orderPrice = accMul(this.temp.orderOriginTimenum, this.temp.orderUnitPrice)

        // 如果有会员卡，并且使用优惠时长， 则增加 orderMbTimenum, orderTimenum
        if (this.listQuery.isUseDiscountTime) {
          console.log('使用优惠时长')
          if (this.listQuery.restDiscountTime > this.temp.orderOriginTimenum) {
            this.temp.orderTimenum = 0
            this.temp.orderMbTimenum = this.temp.orderOriginTimenum
            this.temp.orderPrice = 0
          } else {
            this.temp.orderTimenum = accSub(this.temp.orderOriginTimenum, this.listQuery.restDiscountTime)
            this.temp.orderMbTimenum = this.listQuery.restDiscountTime
            this.temp.orderPrice = accMul(this.temp.orderTimenum, this.temp.orderUnitPrice)
          }
        } else {
          this.temp.orderMbTimenum = 0
        }

        // 如果有会员卡，并且使用优惠金额， 则增加 orderMbAmount
        if (this.listQuery.isUseDiscountPrice) {
          console.log('使用优惠金额')
          const tempOrderPrice = accMul(this.temp.orderTimenum, this.temp.orderUnitPrice)
          // 因为有可能优惠时长后，时长为0，则这时候不需要使用优惠金额了
          if (tempOrderPrice === 0) {
            this.temp.orderMbAmount = 0
            this.temp.orderPrice = 0
          } else {
            if (this.listQuery.restDiscountPrice > tempOrderPrice) {
              this.temp.orderMbAmount = tempOrderPrice
              this.temp.orderPrice = 0
            } else {
              this.temp.orderMbAmount = tempOrderPrice
              this.temp.orderPrice = accSub(tempOrderPrice, this.listQuery.restDiscountPrice)
            }
          }
        }
      } else {
        console.log('not member')
        this.temp.orderUnitPrice = 0
        this.temp.orderTimenum = 0
        this.temp.orderPrice = this.temp.orderOriginPrice
      }

      // 如果使用优惠卷，需要增加couponReleasedId, orderCpAmount, 需要控制满X才能使用优惠卷
      if (this.listQuery.coupon && this.listQuery.coupon.length > 0) {
        // 判断金额是否够优惠卷满减金额
        console.log('使用优惠卷')
        const tempCoupon = this.listQuery.coupon[0]
        console.log(tempCoupon)
        if (tempCoupon.fullAmount > this.temp.orderPrice) {
          this.$message('优惠卷满减金额小于订单价格，不能使用！')
          return
        } else {
          this.temp.couponReleasedId = tempCoupon.id
          this.temp.orderCpAmount = tempCoupon.reductionAmount
          this.temp.orderPrice = accSub(this.temp.orderPrice, this.temp.orderCpAmount)
        }
      } else {
        this.temp.orderCpAmount = 0
      }

      // 如果使用余额，需要增加paymentType=1, 微信paymentType=2，余额支付需要控制必须满足总金额才能使用余额支付
      if (this.listQuery.isUseRecharge) {
        this.temp.paymentType = 1
      }

      console.log(this.temp)
      createMerchantOrder(this.temp).then(() => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$notify({
          title: '订单下单成功',
          message: '订单下单成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

