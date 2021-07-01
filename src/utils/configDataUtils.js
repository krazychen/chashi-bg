import { getAllConfigDataCache } from '@/api/system/sysConfig'
import { getLocalStorageKeyValue } from '@/utils/auth'

/**
 * 根据参数key获取参数对象
 * @param {string} configKey
 * @returns {config data}
 */
export function getConfigData(configKey) {
  if (!configKey) {
    new Error('请输入参数键值!')
  }
  let configDataList = JSON.parse(getLocalStorageKeyValue('config_data'))
  if (!configDataList) {
    getAllConfigDataCache().then(response => {
      configDataList = response.data
    })
  }
  return configDataList.find(function(item, index) {
    if (item.configKey === configKey) {
      return item
    }
  })
}

/**
 * 根据参数key获取参数值
 * @param {string} configKey
 * @returns {config value}
 */
export function getConfigValue(configKey) {
  if (!configKey) {
    new Error('请输入参数键值!')
  }
  let configDataList = JSON.parse(getLocalStorageKeyValue('config_data'))
  if (!configDataList) {
    getAllConfigDataCache().then(response => {
      configDataList = response.data
    })
  }
  return configDataList.find(function(item, index) {
    if (item.configKey === configKey) {
      return item.configValue
    }
  }).configValue
}
