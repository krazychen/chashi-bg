import { getAllDictDataCache } from '@/api/system/SysDictData'
import { getLocalStorageKeyValue } from '@/utils/auth'

/**
 * 根据字典类型获取字典数据列表
 * @param {string} dictType
 * @returns {List}
 */
export function getDictDataList(dictType) {
  if (!dictType) {
    new Error('请输入字典类型!')
  }
  let dictDataMap = JSON.parse(getLocalStorageKeyValue('dict_data'))
  if (!dictDataMap) {
    getAllDictDataCache().then(response => {
      dictDataMap = response.data
    })
  }
  return dictDataMap[dictType]
}
