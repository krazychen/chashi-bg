
export function responseNotifier(vm, res) { // vm => vue instance / compontent
  if (res.success) {
    vm.$notify({
      title: '成功',
      message: '资料已变更',
      type: 'success',
      duration: 2000
    })
  } else {
    vm.$notify({
      title: '出问题啦',
      message: '资料未变更',
      type: 'error',
      duration: 2000
    })
  }
}
