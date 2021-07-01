import { constantRoutes, roleTypeRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  accessableRoutes: null,
  dynamicRoutes: null
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.dynamicRoutes = routes
    state.accessableRoutes = constantRoutes.concat(routes)
  },

  RESET: (state) => {
    state.dynamicRoutes = null
    state.accessableRoutes = null
  }
}

const actions = {
  generateRoutes({ commit, dispatch, rootGetters }) {
    return dispatch('user/getSysMenuByUserId', null, { root: true }).then(permissions => {
      // console.log('-- permissions', permissions)

      const currentRoleType = rootGetters.currentRoleType
      // console.log('-- currentRoleType', currentRoleType)

      // 角色類型的所有可用的 routes
      const availableRoutes = roleTypeRoutes[currentRoleType]

      const accessableRoutes = filterRoutes(availableRoutes, permissions)
      commit('SET_ROUTES', accessableRoutes)

      return accessableRoutes
    })
  }

}

function collectPath(paths, routes, prefix = '') {
  if (!routes) {
    return
  }

  routes.forEach(ro => {
    let path
    if (ro.path.startsWith('/')) {
      path = ro.path
    } else {
      path = [prefix, ro.path].join('/')
    }
    paths.push(path)
    collectPath(paths, ro.children, path)
  })
}

const getters = {
  accessablePaths(state) {
    const paths = []
    collectPath(paths, state.accessableRoutes)
    return paths
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
