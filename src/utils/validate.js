/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 验证只能为数字
 * @param rule
 * @param value
 * @param callback
 */
export function isNum(rule, value, callback) {
  const age = /^[0-9]*$/
  if (!age.test(value)) {
    callback(new Error('只能为数字'))
  } else {
    callback()
  }
}

/**
 * 正整数
 * @param rule
 * @param value
 * @param callback
 */
export function dialogFormRules(rule, value, callback) {
  if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正整数'))
  }
}

/**
 *
 * 校验链接
 * @param rule
 * @param value
 * @param callback
 */
export function isHref(rule, value, callback) {
  if (value === undefined || value === '') {
    callback()
  }
  const age = /^(\/([A-Za-z0-9-~]+))+(\/([A-Za-z0-9-~]+))/
  if (!age.test(value)) {
    callback(new Error('请输入链接地址'))
  } else {
    callback()
  }
}

/**
 * 校验权限
 * @param rule
 * @param value
 * @param callback
 */
export function isPermission(rule, value, callback) {
  if (value === undefined || value === '') {
    callback()
  }
  const age = /^(([A-Za-z0-9-~]+):)+(([A-Za-z0-9-~]+):)+(([A-Za-z0-9-~]+))+$/
  if (!age.test(value)) {
    callback(new Error('格式aa:bb:cc'))
  } else {
    callback()
  }
}

export function validatePhone(rule, value, callback) {
  const phone = value.replace(/\s/g, '')// 去除空格
  // 校验手机号，号段主要有(不包括上网卡)：130~139、150~153，155~159，180~189、170~171、176~178。14号段为上网卡专属号段
  const regs = /^((1[0-9][0-9]))\d{8}$/
  if (value.length === 0) {
    callback()
  } else {
    if (!regs.test(phone)) {
      callback([new Error('手机号输入不合法')])
    } else {
      callback()
    }
  }
}

export function isCardNo(rule, value, callback) {
  const card = value.replace(/\s/g, '')// 去除空格
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/
  if (value.length === 0) {
    callback()
  } else {
    if (!reg.test(card)) {
      callback([new Error('身份证输入不合法')])
    } else {
      callback()
    }
  }
}

// 银行卡号Luhn校验算法
// luhn校验规则：16位银行卡号（19位通用）:
// 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
// 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
// 3.将加法和加上校验位能被 10 整除。

// bankno为银行卡号
function luhnCheck(bankno, callback) {
  const lastNum = bankno.substr(bankno.length - 1, 1)// 取出最后一位（与luhn进行比较）

  const first15Num = bankno.substr(0, bankno.length - 1)// 前15或18位
  const newArr = new Array()
  for (let i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1))
  }
  const arrJiShu = new Array() // 奇数位*2的积 <9
  const arrJiShu2 = new Array() // 奇数位*2的积 >9

  const arrOuShu = new Array() // 偶数位数组
  for (let j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 === 1) { // 奇数位
      if (parseInt(newArr[j]) * 2 < 9) { arrJiShu.push(parseInt(newArr[j]) * 2) } else { arrJiShu2.push(parseInt(newArr[j]) * 2) }
    } else // 偶数位
    { arrOuShu.push(newArr[j]) }
  }

  const jishu_child1 = new Array()// 奇数位*2 >9 的分割之后的数组个位数
  const jishu_child2 = new Array()// 奇数位*2 >9 的分割之后的数组十位数
  for (let h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
  }

  let sumJiShu = 0 // 奇数位*2 < 9 的数组之和
  let sumOuShu = 0 // 偶数位数组之和
  let sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
  let sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
  let sumTotal = 0
  for (let m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m])
  }

  for (let n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n])
  }

  for (let p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
  }
  // 计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)

  // 计算luhn值
  const k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10
  const luhn = 10 - k
  if (parseInt(lastNum) === luhn) {
    callback()
  } else {
    callback('银行卡号必须符合luhn校验')
  }
}

// 检查银行卡号
export function checkBankNo(rule, value, callback) {
  const bankno = value.replace(/\s/g, '')
  if (bankno === '') {
    callback('请填写银行卡号')
    return false
  }
  if (bankno.length < 16 || bankno.length > 19) {
    callback('银行卡号长度必须在16到19之间')
    return false
  }
  const num = /^\d*$/// 全数字
  if (!num.exec(bankno)) {
    callback('银行卡号必须全为数字')
    return false
  }
  // 开头6位
  const strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
  if (strBin.indexOf(bankno.substring(0, 2)) === -1) {
    callback('银行卡号开头6位不符合规范')
    return false
  }
  // Luhn校验
  luhnCheck(bankno, callback)
}
