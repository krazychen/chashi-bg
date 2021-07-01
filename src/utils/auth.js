import Cookies from 'js-cookie'

const TokenKey = 'whyy_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTokenKeyValue(key, token) {
  return Cookies.set(key, token)
}

export function removeTokenKeyValue(key) {
  return Cookies.remove(key)
}

export function getTokenKeyValue(key) {
  return Cookies.get(key)
}

export function setLocalStorageKeyValue(key, token) {
  return localStorage.setItem(key, token)
}

export function removeLocalStorageKeyValue(key) {
  return localStorage.removeItem(key)
}

export function getLocalStorageKeyValue(key) {
  return localStorage.getItem(key)
}

export function getLoginSysUserVo() {
  const userToken = getLocalStorageKeyValue('user')
  let loginSysUserVo = null
  if (!userToken) {
    // loginSysUserVo = state.loginSysUserVo // loginSysUserVo never stored to Vuex
  } else {
    loginSysUserVo = JSON.parse(userToken)
  }
  return loginSysUserVo
}
