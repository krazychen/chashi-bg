// 本地 vuex 緩存所有用戶的用戶名和頭像地址

import { getInfo } from '@/api/system/user'

const state = {
  users: {}
}

const mutations = {
  SET_USER: (state, data) => {
    state.users[data.id] = data
  }
}

const actions = {
  getUserInfo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const { force, userId } = payload
      if (!force && state.users[userId]) {
        resolve(state.users[userId])
      } else {
        getInfo(userId).then(response => {
          const { data } = response
          commit('SET_USER', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
