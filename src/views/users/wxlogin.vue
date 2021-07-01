<template>
  <div />
</template>

<script>
import { debounce } from '../../utils'
import { getLocalStorageKeyValue } from '@/utils/auth'
export default {
  components: {

  },
  data() {
    return {

    }
  },
  created() {
    // 获取code
    const data = {}
    const code = this.$route.query.code
    data.code = code
    const userTokenjson = getLocalStorageKeyValue('user')
    if (userTokenjson !== null) {
      const userToken = JSON.parse(userTokenjson)
      data.id = userToken.id
    }
    this.$store.dispatch('user/wxlogin', data).then(() => {
      this.$router.push({ path: this.redirect || '/' })
    })
    // 拿到code后请求后台验证通过后返回code
  },
  methods: {
    // getQueryObject(url) {
    //   console.log(url)
    //   url = url == null ? window.location.href : url;
    //   const search = url.substring(url.lastIndexOf('?') + 1);
    // },
    // afterQRScan() {
    //   const hash = window.location.hash.slice(1);
    //   const hashObj = getQueryObject(hash);
    //   const codeName = hashObj;
    //   const index = codeName.indexOf('=');
    //   const code = codeName.slice(index + 1);
    //   this.code = code;   // 获取code；
    //   const text = codeName.split('')[0];
    //   if (!codeName && text !== 'c') {
    //     this.$message({
    //       message: '登录失败！',
    //       type: 'error'
    //     });
    //   } else if (codeName && text === 'c') {
    //     this.$message({
    //       message: '微信登录成功！',
    //       type: 'success'
    //     });
    //     this.setOpenId();
    //   }
    // }
  }
}
</script>
