const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  user: state => state.user,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.avatar,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.id,
  userInfo: state => state.user.userInfo,
  dynamicRoutes: state => state.permission.dynamicRoutes, // 沒有包含 constantRoutes 的有權訪問的 routes
  accessableRoutes: state => state.permission.accessableRoutes, // 包含 constantRoutes 的所有有權限訪問的 routes
  // permission_routes: state => state.permission.routes,
  roles: state => state.user.roles,
  roleTypes: state => state.user.roleTypes,
  currentRoleType: state => state.user.currentRoleType
}
export default getters
