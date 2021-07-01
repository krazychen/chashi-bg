import { login, wxlogin, wxlogin1, logout, getInfo, getRoleTypes, checkLoginQr } from '@/api/system/user'
// import { getSysMenuByUserId } from '@/api/system/sysMenu'
import { getLoginSysUserVo, getToken, setToken, removeToken, setLocalStorageKeyValue, getLocalStorageKeyValue, removeLocalStorageKeyValue, setTokenKeyValue, removeTokenKeyValue } from '@/utils/auth'
import { resetRouter } from '@/router'
// import { openWechatQRCode } from '@/views/users/utils'
// import code from '@ckeditor/ckeditor5-basic-styles/src/code'
// import de from 'element-ui/src/locale/lang/de'
// import store from '@/store'
// import list from '@ckeditor/ckeditor5-list/src/list'

const stateTemplate = {
  token: null,
  // loginSysUserVo: '',
  dictDataCacheMap: null,
  userInfo: {},
  roles: [],
  roleTypes: [],
  currentRoleType: null
}

const state = { ...stateTemplate, ...{ token: getToken() }}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_DICT_DATA: (state, dictDataCacheMap) => {
    state.dictDataCacheMap = dictDataCacheMap
  },
  SET_CONFIG_DATA: (state, configDataCacheList) => {
    state.configDataCacheList = configDataCacheList
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE_TYPES: (state, data) => {
    state.roleTypes = data
  },
  SET_CURRENT_ROLE_TYPE: (state, roleType) => {
    state.currentRoleType = roleType
    setLocalStorageKeyValue('currentRoleType', roleType)
  },
  RESET: (state) => {
    Object.keys(stateTemplate).forEach(key => {
      state[key] = JSON.parse(JSON.stringify(stateTemplate[key]))
    })
  }
}

const actions = {

  storeUserProfile({ commit }, data) {
    commit('SET_TOKEN', data.token)
    commit('SET_USER', data.loginSysUserVo)
    commit('SET_DICT_DATA', data.dictDataCacheMap)
    commit('SET_CONFIG_DATA', data.configDataCacheList)
    setToken(data.token)
    setLocalStorageKeyValue('user', JSON.stringify(data.loginSysUserVo))
    setLocalStorageKeyValue('dict_data', JSON.stringify(data.dictDataCacheMap))
    setLocalStorageKeyValue('config_data', JSON.stringify(data.configDataCacheList))
  },

  // user login
  login({ dispatch }, userInfo) {
    const { username, password, code, verifyToken } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: code, verifyToken: verifyToken }).then(response => {
        const { data } = response
        dispatch('storeUserProfile', data)

        resolve()
      }).catch(error => {
        console.log('---- here???', error)
        reject(error)
      })
    })
  },

  wxlogin({ dispatch }, values) {
    const { code, id } = values
    return new Promise((resolve, reject) => {
      wxlogin({ code: code, id: id }).then(response => {
        const { data } = response
        dispatch('storeUserProfile', data)

        setTokenKeyValue('iswx', data.loginSysUserVo.iswx)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  wxlogin1({ dispatch }, values) {
    const { code, id } = values
    return new Promise((resolve, reject) => {
      wxlogin1({ code: code, id: id }).then(response => {
        const { data } = response
        dispatch('storeUserProfile', data)

        setTokenKeyValue('iswx', data.loginSysUserVo.iswx)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  checkLoginQr({ dispatch }, values) {
    const code = values
    return new Promise((resolve, reject) => {
      checkLoginQr(code).then(response => {
        if (response.success && response.data !== null && response.data) {
          const { data } = response
          dispatch('storeUserProfile', data)

          setTokenKeyValue('iswx', data.loginSysUserVo.iswx)
          resolve(response)
        } else {
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(getLoginSysUserVo().id).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_USER_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getRoleTypes({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getRoleTypes().then(response => {
  //       const { data } = response
  //       commit('SET_ROLE_TYPES', data)
  //
  //       // 如果當前用戶並沒有 localStorage 裡存儲的 currentRoleType，就把他的第一個 roleType 放進去
  //       let current = getLocalStorageKeyValue('currentRoleType')
  //       if (!data.map(d => d.type).includes(current)) {
  //         current = data[0].type
  //       }
  //       commit('SET_CURRENT_ROLE_TYPE', current)
  //
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // get permission list for checking the permission to every route
  getSysMenuByUserId({ commit, dispatch }) {
    // 20200713 登陆的时候已经有获取菜单了，不需要再去取一次
    console.log(getLoginSysUserVo())
    const sysMenuList = getLoginSysUserVo().sysMenuList
    let permissions = []
    for (let i = 0; i < sysMenuList.length; i++) {
      permissions = permissions.concat(listPermissions(sysMenuList[i]))
    }
    commit('SET_ROLES', permissions) // set role to permission, u kidding me...

    // 取得 role 的同時順便把 roleType 給設置了
    const sysRoleList = getLoginSysUserVo().sysRoleList
    console.log(sysRoleList)
    commit('SET_ROLE_TYPES', sysRoleList)

    // 如果當前用戶並沒有 localStorage 裡存儲的 currentRoleType，就把他的第一個 roleType 放進去
    let current = getLocalStorageKeyValue('currentRoleType')
    if (!sysRoleList.map(d => d.type).includes(current)) {
      current = sysRoleList[0].type
    }
    commit('SET_CURRENT_ROLE_TYPE', current)

    return permissions

    // return new Promise((resolve, reject) => {
    //   getSysMenuByUserId(getLoginSysUserVo().id).then(response => {
    //     const { data } = response
    //     let permissions = []
    //     for (let i = 0; i < data.length; i++) {
    //       permissions = permissions.concat(listPermissions(data[i]))
    //     }
    //     commit('SET_ROLES', permissions) // set role to permission, u kidding me...
    //
    //     // 取得 role 的同時順便把 roleType 給設置了
    //     dispatch('getRoleTypes').then(res => {
    //       resolve(permissions)
    //     })
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        dispatch('resetToken')
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('RESET')
      removeToken() // remove token from cookie
      removeTokenKeyValue('iswx') // 全部都放到 cookie 裡就要這麼一個個去刪除。。shit
      resetRouter()
      commit('permission/RESET', null, { root: true })

      removeLocalStorageKeyValue('user')
      removeLocalStorageKeyValue('dict_data')
      removeLocalStorageKeyValue('config_data')
      // removeLocalStorageKeyValue('currentRoleType') // 不需要清理，記住當前角色，登入後自動切換
      resolve()
    })
  }
}

function listPermissions(sysMenuQueryVo) {
  let permissions = []
  if (sysMenuQueryVo.children != null && sysMenuQueryVo.children.length !== 0) {
    permissions.push(sysMenuQueryVo.permission)
    const child = sysMenuQueryVo.children
    for (let i = 0; i < child.length; i++) {
      permissions = permissions.concat(listPermissions(child[i]))
    }
  } else {
    permissions.push(sysMenuQueryVo.permission)
  }
  return permissions
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

