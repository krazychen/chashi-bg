import request from '@/utils/request'

// 作业列表
export function gethwHomeworkList(data) {
  return request({
    url: '/hwHomework/getPageList',
    method: 'post',
    data
  })
}

export function getRepeatPageList(data) {
  return request({
    url: '/hwHomework/getRepeatPageList',
    method: 'post',
    data
  })
}

// 作业列表
export function getReportFormList(data) {
  return request({
    url: '/hwHomework/getReportFormList',
    method: 'post',
    data
  })
}

// 学员作业数据
export function getStudentFormList(data) {
  return request({
    url: '/hwHomework/getStudentFormList',
    method: 'post',
    data
  })
}

// 老师作业数据
export function getTeacherFormList(data) {
  return request({
    url: '/hwHomework/getTeacherFormList',
    method: 'post',
    data
  })
}

// 老师分类数据
export function getTeacherFormClass(data) {
  return request({
    url: '/hwHomework/getTeacherFormClass',
    method: 'post',
    data
  })
}

// 老师分类数据
export function getTeacherFormClassInfoList(data) {
  return request({
    url: '/hwHomework/getTeacherFormClassInfoList',
    method: 'post',
    data
  })
}

// 标签数据数据
export function getClassTypeFormList(data) {
  return request({
    url: '/hwHomework/getClassTypeFormList',
    method: 'post',
    data
  })
}

// 标签数据数据
export function getRepeatFormList(data) {
  return request({
    url: '/hwHomework/getRepeatFormList',
    method: 'post',
    data
  })
}

export function getClassReportFormList(data) {
  return request({
    url: '/hwHomework/getClassReportFormList',
    method: 'post',
    data
  })
}

export function getStudentReportFormList(data) {
  return request({
    url: '/hwHomework/getStudentReportFormList',
    method: 'post',
    data
  })
}

// 创建作业
export function createhwHomework(data) {
  return request({
    url: '/hwHomework/add',
    method: 'post',
    data
  })
}

// 更新作业
export function updatehwHomework(data) {
  return request({
    url: '/hwHomework/update',
    method: 'post',
    data
  })
}

// 更新作业
export function updatehwHomeworkOne(id) {
  return request({
    url: '/hwHomework/updateHwHomeworkOne/' + id,
    method: 'post'
  })
}

// 删除作业
export function deletehwHomework(id) {
  return request({
    url: '/hwHomework/delete/' + id,
    method: 'post'
  })
}

// 批量删除作业
export function deletehwHomeworks(data) {
  return request({
    url: '/hwHomework/delete/',
    method: 'post',
    data
  })
}

// 修改字典类型状态
export function updateStatusById(data) {
  return request({
    url: '/hwHomework/updateStatus/',
    method: 'post',
    data
  })
}

// 获取所有的作业
export function gethwHomeworkAll() {
  return request({
    url: '/hwHomework/gethwHomeworkAll',
    method: 'post'
  })
}

// 获取所有的作业
export function releases(data) {
  return request({
    url: '/hwHomework/releases',
    method: 'post',
    data
  })
}

// 删除作业
export function getAllHwHomeworkMaterial(id) {
  return request({
    url: '/hwHomeworkMaterial/getAllHwHomeworkMaterial/' + id,
    method: 'post'
  })
}

// 发送通知
export function sendMsg(data) {
  return request({
    url: '/hwHomework/sendMsg',
    method: 'post',
    data
  })
}

// 作业列表
export function getHwStuHomeworkPageList(data) {
  return request({
    url: '/hwStuHomework/getPageList',
    method: 'post',
    data
  })
}
// 更新委托人
export function updateEntrust(data) {
  return request({
    url: '/hwHomework/updateEntrust',
    method: 'post',
    data
  })
}

// 作业列表
export function getStuHomeworkList(data) {
  return request({
    url: '/hwHomework/getStuHomeworkList',
    method: 'post',
    data
  })
}

// 前台作业详情
export function getTobeStuHomeworkList() {
  return request({
    url: '/hwStuHomework/getTobeStuHomeworkList',
    method: 'get'
  })
}

// 保存学员作业
export function updateContent(data) {
  return request({
    url: '/hwStuHomework/updateContent',
    method: 'post',
    data
  })
}

// 作业列表
export function updateContentSub(data) {
  return request({
    url: '/hwStuHomework/updateContentSub',
    method: 'post',
    data
  })
}

// 更新作业
export function getTobeStuHomeworkListOne(id) {
  return request({
    url: '/hwStuHomework/getTobeStuHomeworkListOne/' + id,
    method: 'get'
  })
}

// 更新作业
export function getTobeListStudent(id) {
  return request({
    url: '/hwStuHomework/getTobeListStudent/' + id,
    method: 'get'
  })
}

export function getTobeStuHomeworkListOneShare(id) {
  return request({
    url: '/hwStuHomework/getTobeStuHomeworkListOneShare/' + id,
    method: 'get'
  })
}

// 下载材料
export function downloadMaterial(id) {
  return request({
    url: '/hwHomeworkMaterial/downloadMaterial/' + id,
    method: 'post'
  })
}

// 作业列表
export function saveQa(data) {
  return request({
    url: '/hwHomeworkQa/saveQa',
    method: 'post',
    data
  })
}

// 批改作业
export function addHwHomeworkAudit(data) {
  return request({
    url: '/hwHomeworkAudit/add',
    method: 'post',
    data
  })
}

// 批改作业
export function addTwoHwHomeworkAudit(data) {
  return request({
    url: '/hwHomeworkAudit/addTwo',
    method: 'post',
    data
  })
}

// 更新复评
export function updateRepeatById(data) {
  return request({
    url: '/hwHomeworkAudit/updateRepeatById',
    method: 'post',
    data
  })
}

// 更新复评二级老师
export function updateRepeatByIdTwo(data) {
  return request({
    url: '/hwHomeworkAudit/updateRepeatByIdTwo',
    method: 'post',
    data
  })
}

export function updateReadTime(id) {
  return request({
    url: '/hwStuHomework/updateReadTime/' + id,
    method: 'post'
  })
}

export function getImgUrl(date) {
  return request({
    url: '/hwHomework/getImgUrl',
    method: 'post',
    data: date
  })
}

export function getBaiduShortURL(date) {
  return request({
    url: '/hwHomework/getBaiduShortURL',
    method: 'post',
    data: date
  })
}

export function getPageRepeatList(date) {
  return request({
    url: '/hwStuHomework/getPageRepeatList',
    method: 'post',
    data: date
  })
}

export function getPageRepeatListOnly(date) {
  return request({
    url: '/hwStuHomework/getPageRepeatListOnly',
    method: 'post',
    data: date
  })
}
export function getRepeatJudge(id) {
  return request({
    url: '/homework/getRepeatJudge/' + id,
    method: 'get'
  })
}

export function getPageRepeatListNew(date) {
  return request({
    url: '/hwStuHomework/getPageRepeatListNew',
    method: 'post',
    data: date
  })
}

export function repeateInitial(date) {
  return request({
    url: '/hwStuHomework/repeateInitial',
    method: 'post',
    data: date
  })
}

export function addHwStuHomeworkOtherAdd(date) {
  return request({
    url: '/hwStuHomework/addHwStuHomeworkOtherAdd',
    method: 'post',
    data: date
  })
}

export function updateHwHomeworkSubjectStateByHomework(id) {
  return request({
    url: '/hwHomework/updateHwHomeworkSubjectStateByHomework/' + id,
    method: 'post'
  })
}

export function cancelalls(data) {
  return request({
    url: '/hwHomework/cancelalls',
    method: 'post',
    data
  })
}

export function getHwHomeworkAndClass(data) {
  return request({
    url: '/hwHomework/getHwHomeworkAndClass',
    method: 'post',
    data
  })
}

export function excelWriter(data) {
  return request({
    url: '/hwHomework/excelWriter',
    method: 'post',
    responseType: 'blob',
    data
  })
}

export function excelWriterRepeat(data) {
  return request({
    url: '/hwHomework/excelWriterRepeat',
    method: 'post',
    responseType: 'blob',
    data
  })
}

export function getHwHomework(id) {
  return request({
    url: '/hwHomework/info/' + id,
    method: 'get'
  })
}

export function getHwHomeworkEndPageList(data) {
  return request({
    url: '/hwStuHomework/getStuHwHomeworkEndPageList',
    method: 'post',
    data
  })
}

export function hwStuHomeworkReset(data) {
  return request({
    url: '/hwStuHomeworkReset/restEnd',
    method: 'post',
    data
  })
}

export function getPageList(data) {
  return request({
    url: '/hwStuHomeworkReset/getPageList',
    method: 'post',
    data
  })
}

// 重置次数
export function applyReset(id) {
  return request({
    url: '/hwStuHomeworkResetApply/applyReset/' + id,
    method: 'post'
  })
}

export function getResetApplyPageList(data) { // 获取重置记录列表
  return request({
    url: '/hwStuHomeworkResetApply/getPageList',
    method: 'post',
    data
  })
}

export function getRechargeApplyPageList(data) { // 获取重置记录列表
  return request({
    url: '/hwStuHomeworkResetRecharge/getPageList',
    method: 'post',
    data
  })
}

export function recharge(data) { // 获取重置记录列表
  return request({
    url: '/hwStuHomeworkResetRecharge/recharge',
    method: 'post',
    data
  })
}

export function deleteHwStuHomeworkPic(id) {
  return request({
    url: '/hwStuHomeworkPic/delete/' + id,
    method: 'post'
  })
}

// 提交图片作业
export function submitUploadContent(id) {
  return request({
    url: '/hwStuHomework/submitUploadContent/' + id,
    method: 'post'
  })
}

// 提交图片作业
export function getHwStuHomeworkPicList(id) {
  return request({
    url: '/hwStuHomeworkPic/getHwStuHomeworkPicList/' + id,
    method: 'get'
  })
}

// 提交图片作业
export function getHwStuHomeworkPicListShare(id) {
  return request({
    url: '/hwStuHomeworkPic/getHwStuHomeworkPicListShare/' + id,
    method: 'get'
  })
}

// 提交图片作业
export function upateImgJsonById(data) {
  return request({
    url: '/hwStuHomeworkPic/upateImgJsonById',
    method: 'post',
    data
  })
}

// 提交图片作业二级老师
export function upateImgJsonByIdRepeat(data) {
  return request({
    url: '/hwStuHomeworkPic/upateImgJsonByIdRepeat',
    method: 'post',
    data
  })
}

// 提交图片作业
export function updateImgJsonAndAudit(data) {
  return request({
    url: '/hwStuHomeworkPic/updateImgJsonAndAudit',
    method: 'post',
    data
  })
}

// 提交图片作业
export function updateImgJsonAndAuditRepeat(data) {
  return request({
    url: '/hwStuHomeworkPic/updateImgJsonAndAuditRepeat',
    method: 'post',
    data
  })
}

// 查看图片作业
export function getAuditById(id) {
  return request({
    url: '/hwStuHomeworkPic/getAuditById/' + id,
    method: 'get'
  })
}

// 提交图片作业
export function getAuditByIdShare(id) {
  return request({
    url: '/hwStuHomeworkPic/getAuditByIdShare/' + id,
    method: 'get'
  })
}

// 二级老师
export function updateAuditByIdRepeat(data) {
  return request({
    url: '/hwStuHomeworkPic/updateAuditByIdRepeat',
    method: 'post',
    data
  })
}

export function updateAuditById(data) {
  return request({
    url: '/hwStuHomeworkPic/updateAuditById',
    method: 'post',
    data
  })
}

export function updateRepeatImgById(data) {
  return request({
    url: '/hwStuHomeworkPic/updateRepeatById',
    method: 'post',
    data
  })
}

export function deleteRepeatImgById(data) {
  return request({
    url: '/hwStuHomeworkPic/deleteRepeatById',
    method: 'post',
    data
  })
}

export function getAuditByImgId(id) {
  return request({
    url: '/hwStuHomeworkPic/getAuditByImgId/' + id,
    method: 'get'
  })
}

export function getAuditByImgIdShare(id) {
  return request({
    url: '/hwStuHomeworkPic/getAuditByImgIdShare/' + id,
    method: 'get'
  })
}

export function deleteImgJsonAndAudit(data) {
  return request({
    url: '/hwStuHomeworkPic/deleteImgJsonAndAudit',
    method: 'post',
    data
  })
}

// 二级老师
export function deleteImgJsonAndAuditRepeat(data) {
  return request({
    url: '/hwStuHomeworkPic/deleteImgJsonAndAuditRepeat',
    method: 'post',
    data
  })
}

// 提交图片作业
export function isReceive(id) {
  return request({
    url: '/hwStuHomeworkPic/isReceive/' + id,
    method: 'get'
  })
}

// 获取所有作业组的基础信息
export function getReissueHomeworkList() {
  return request({
    url: '/hwHomework/getReissueHomeworkList',
    method: 'post'
  })
}

// 学员管理处的补发作业
export function addReissueHomework(data) {
  return request({
    url: '/hwStuHomework/addReissueHomework',
    method: 'post',
    data
  })
}

// 获取关联作业
export function getRelatedHomework(id, studentId) {
  return request({
    url: '/hwStuHomework/getRelatedHomework/' + id + '/' + studentId,
    method: 'get'
  })
}
