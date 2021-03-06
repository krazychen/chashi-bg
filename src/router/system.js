const Layout = () => import('@/layout')

// 後台管理相關的 routes
export const systemRoutes = [
  {
    path: '/system',
    component: Layout,
    name: '系统管理',
    meta: { roles: ['sys:user:page'], title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'usersMgn',
        name: '用户管理',
        component: () => import('@/views/system/usersMgn'),
        meta: { roles: ['sys:user:page'], title: '用户管理', faicon: 'table' }
      }
    ]
  },
  {
    path: '/room',
    component: Layout,
    name: '茶室管理',
    meta: { roles: ['cs:tearoom:page'], title: '茶室管理', icon: 'example' },
    children: [
      {
        path: 'roomMgn',
        name: '茶室管理',
        component: () => import('@/views/chashi/csRoom'),
        meta: { roles: ['cs:tearoom:page'], title: '茶室管理', faicon: 'table' }
      }
    ]
  },
  {
    path: '/merchantOrder',
    component: Layout,
    name: '订单管理',
    meta: { roles: ['cs:merchant:order:page'], title: '订单管理', icon: 'example' },
    children: [
      {
        path: 'merchantOrder',
        name: '订单列表',
        component: () => import('@/views/chashi/csMerchantOrder'),
        meta: { roles: ['cs:merchant:order:page'], title: '订单列表', faicon: 'table' }
      }
    ]
  },
  {
    path: '/roomUsed',
    component: Layout,
    name: '房态管理',
    meta: { roles: ['cs:tearoom:page'], title: '房态管理', icon: 'example' },
    children: [
      {
        path: 'merchantSetting',
        name: '房态管理',
        component: () => import('@/views/chashi/csRoomUsed'),
        meta: { roles: ['cs:tearoom:page'], title: '房态管理', faicon: 'table' }
      }
    ]
  },
  {
    path: '/merchantSetting',
    component: Layout,
    name: '商户设置',
    meta: { roles: ['cs:merchant:info'], title: '商户设置', icon: 'example' },
    children: [
      {
        path: 'merchantSetting',
        name: '商户设置',
        component: () => import('@/views/chashi/csMerchantSetting'),
        meta: { roles: ['cs:merchant:info'], title: '商户设置', faicon: 'table' }
      }
    ]
  }

]
