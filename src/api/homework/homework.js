import request from '@/utils/request'
// 获取班初始化数据
export function initial(data) {
  return request({
    url: '/homework/initial',
    method: 'post',
    data
  })
}

// 刷新列表
export function getAuditHomeworkList(data) {
  return request({
    url: '/homework/getAuditHomeworkList',
    method: 'post',
    data
  })
}

// 查看老师刷新列表
export function getAuditHomeworkListSee(data) {
  return request({
    url: '/homework/getAuditHomeworkListSee',
    method: 'post',
    data
  })
}

// 委托班列表
export function entrust(data) {
  return request({
    url: '/homework/entrust',
    method: 'post',
    data
  })
}

// 查看老师委托班列表
export function entrustsee(data) {
  return request({
    url: '/homework/entrustsee',
    method: 'post',
    data
  })
}

// 委托班列表
export function getEntrustCount(data) {
  return request({
    url: '/homework/getEntrustCount',
    method: 'post',
    data
  })
}

// 查看老师委托班列表
export function getSeeEntrustCount(data) {
  return request({
    url: '/homework/getSeeEntrustCount',
    method: 'post',
    data
  })
}

// 委托班二级老师
export function entrustRepeat(data) {
  return request({
    url: '/homework/entrustRepeat',
    method: 'post',
    data
  })
}

// 委托班带回复数量
export function getEntrustReplyCount(data) {
  return request({
    url: '/homework/getEntrustReplyCount',
    method: 'post',
    data
  })
}

// 委托班列表
export function submitHomeworkTotalAudit(data) {
  return request({
    url: '/homework/submitHomeworkTotalAudit',
    method: 'post',
    data
  })
}

// 委托班列表
export function submitReplyHomeworkTotalAudit(data) {
  return request({
    url: '/homework/submitReplyHomeworkTotalAudit',
    method: 'post',
    data
  })
}

// 委托班列表
export function submitHomeworkTotalRepeat(data) {
  return request({
    url: '/homework/submitHomeworkTotalRepeat',
    method: 'post',
    data
  })
}

// 保存复评和审核标签
export function submitHomeworkRepeatCommentAndexamineTag(data) {
  return request({
    url: '/homework/submitHomeworkRepeatCommentAndexamineTag',
    method: 'post',
    data
  })
}

// 保存总评和批改标签
export function submitHomeworkTagCommentAndexamineTag(data) {
  return request({
    url: '/homework/submitHomeworkTagCommentAndexamineTag',
    method: 'post',
    data
  })
}

// 自动保存复评
export function updateOrAddRepeatComment(data) {
  return request({
    url: '/homework/updateOrAddRepeatComment',
    method: 'post',
    data
  })
}

// 二级老师自动保存总评
export function updateTwoOrAddTagComment(data) {
  return request({
    url: '/homework/updateTwoOrAddTagComment',
    method: 'post',
    data
  })
}

// 自动保存总评
export function updateOrAddTagComment(data) {
  return request({
    url: '/homework/updateOrAddTagComment',
    method: 'post',
    data
  })
}

// 委托班列表
export function submitHomeworkTotalRepeatTwo(data) {
  return request({
    url: '/homework/submitHomeworkTotalRepeatTwo',
    method: 'post',
    data
  })
}

// 追问回复一级老师
export function updateQa(data) {
  return request({
    url: '/homework/updateQa',
    method: 'post',
    data
  })
}

// 追问回复二级老师
export function updateQaRepeat(data) {
  return request({
    url: '/homework/updateQaRepeat',
    method: 'post',
    data
  })
}

// 删除批改
export function deleteAudit(id) {
  return request({
    url: '/homework/deleteAudit/' + id,
    method: 'post'
  })
}

// 删除批改
export function deleteAuditTwo(id) {
  return request({
    url: '/homework/deleteAuditTwo/' + id,
    method: 'post'
  })
}

// 删除复评
export function deleteRepeat(id) {
  return request({
    url: '/homework/deleteRepeat/' + id,
    method: 'post'
  })
}

// 修改批改
export function updateAudit(data) {
  return request({
    url: '/homework/updateAudit',
    method: 'post',
    data
  })
}

// 修改批改二级老师
export function updateAuditTwo(data) {
  return request({
    url: '/homework/updateAuditTwo',
    method: 'post',
    data
  })
}

// 修改复评
export function updateRepeat(data) {
  return request({
    url: '/homework/updateRepeat',
    method: 'post',
    data
  })
}
// 获取当前老师所有的未批改的学员作业
export function getAuditAll() {
  return request({
    url: '/homework/getAuditAll',
    method: 'get'
  })
}

// 获取上一个下一个作业列表
export function getAuditNumber(id, classId) {
  return request({
    url: '/homework/getAuditNumber/' + id + '/' + classId,
    method: 'get'
  })
}

// 获取上一个下一个作业列表
export function getRepeatAuditNumber(data) {
  return request({
    url: '/homework/getRepeatAuditNumber',
    method: 'post',
    data
  })
}

// 获取当前老师所有的未批改的学员作业
export function getRepeatAll() {
  return request({
    url: '/homework/getRepeatAll',
    method: 'get'
  })
}

// 获取当前老师所有的未批改的学员作业
export function getRepeatAllTwo() {
  return request({
    url: '/homework/getRepeatAllTwo',
    method: 'get'
  })
}

// 批改超时的作业
export function getRepeatAllThree() {
  return request({
    url: '/homework/getRepeatAllThree',
    method: 'get'
  })
}

// 更改批改各阶段时间
export function updateAuditTime(data) {
  return request({
    url: '/homework/updateAuditTime',
    method: 'post',
    data
  })
}

// 更改复评各阶段时间
export function updateRepeatTime(data) {
  return request({
    url: '/homework/updateRepeatTime',
    method: 'post',
    data
  })
}

// 二级老师批改已超期作业更改批改读取时间和复评读取时间
export function updateRepeatTimeTwo(data) {
  return request({
    url: '/homework/updateRepeatTimeTwo',
    method: 'post',
    data
  })
}

export function getHwSubjectTypeList(data) {
  return request({
    url: '/homework/getHwSubjectTypeList',
    method: 'post',
    data
  })
}

// 查看老师列表
export function seeInitial(data) {
  return request({
    url: '/homework/seeInitial',
    method: 'post',
    data
  })
}

// 领取作业
export function getReceiveHomework(id) {
  return request({
    url: '/homework/getReceiveHomework/' + id,
    method: 'post'
  })
}

// 取消作业领取
export function updateCancelReceiveHomework(id) {
  return request({
    url: '/homework/updateCancelReceiveHomework/' + id,
    method: 'post'
  })
}

// 获取当前老师对应的题型集合
export function getHwSubjectTypeListTeacher() {
  return request({
    url: '/homework/getHwSubjectTypeListTeacher',
    method: 'post'
  })
}

export function getHwStuHomeworkAuditCount() {
  return request({
    url: '/homework/getHwStuHomeworkAuditCount',
    method: 'post'
  })
}

export function getHwStuHomeworkReplyCount() {
  return request({
    url: '/homework/getHwStuHomeworkReplyCount',
    method: 'post'
  })
}

export function getHwStuHomeworkAuditTwoCount() {
  return request({
    url: '/homework/getHwStuHomeworkAuditTwoCount',
    method: 'post'
  })
}

export function getHwStuHomeworkTwoReplyCount() {
  return request({
    url: '/homework/getHwStuHomeworkTwoReplyCount',
    method: 'post'
  })
}

export function getHwStuHomeworkExamineCount() {
  return request({
    url: '/homework/getHwStuHomeworkExamineCount',
    method: 'post'
  })
}

// 录音总评

// 上传语音
export function uploadAuditAudio(data) {
  return request({
    url: '/upload/',
    method: 'post',
    data,
    contentType: false
  })
}
// 绑定语音一级老师
export function saveAudioRelation(data) {
  return request({
    url: '/homework/saveAudioRelation',
    method: 'post',
    data
  })
}
// 绑定语音二级老师
export function saveAudioRelationRepeat(data) {
  return request({
    url: '/homework/saveAudioRelationRepeat',
    method: 'post',
    data
  })
}

export function getStudentHwSubjectTypeList() {
  return request({
    url: '/hwSubjectType/getStudentHwSubjectTypeList',
    method: 'post'
  })
}
