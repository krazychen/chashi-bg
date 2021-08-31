const Layout = () => import('@/layout')

// 後台管理相關的 routes
export const superadminRoutes = [
  {
    path: '/system',
    component: Layout,
    name: '系统管理',
    meta: { roles: ['sys:user:page'], title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'officeMgn',
        name: '组织机构',
        component: () => import('@/views/system/officeMgn'),
        meta: { roles: ['sys:office:page'], title: '组织机构', faicon: 'table' }
      },
      {
        path: 'usersMgn',
        name: '用户管理',
        component: () => import('@/views/system/usersMgn'),
        meta: { roles: ['sys:user:page'], title: '用户管理', faicon: 'table' }
      },
      {
        path: 'roleMgn',
        name: '角色管理',
        component: () => import('@/views/system/roleMgn'),
        meta: { roles: ['sys:role:page'], title: '角色管理', faicon: 'table' }
      },
      {
        path: 'sysMenu',
        name: '菜单管理',
        component: () => import('@/views/system/sysMenu'),
        meta: { roles: ['sys:menu:page'], title: '菜单管理', faicon: 'table' }
      }, {
        path: 'sysDictType',
        name: '数据字典',
        component: () => import('@/views/system/sysDictType'),
        meta: { roles: ['sys:dict:type:page'], title: '数据字典', faicon: 'table' }
      }, {
        path: 'sysArea',
        name: '行政区划',
        component: () => import('@/views/system/sysArea'),
        meta: { roles: ['sys:area:page'], title: '行政区划', faicon: 'table' }
      }, {
        path: 'sysConfig',
        name: '参数配置',
        component: () => import('@/views/system/sysConfig'),
        meta: { roles: ['sys:user:page'], title: '参数配置', faicon: 'table' }
      }, {
        path: 'taskMonitoring',
        name: '任务监控',
        component: () => import('@/views/system/taskMonitoring'),
        meta: { roles: ['sys:user:page'], title: '任务监控', faicon: 'table' }
      }
    ]
  },
  {
    path: '/wxmngt',
    component: Layout,
    name: '小程序管理',
    meta: { roles: ['cs:label:page'], title: '小程序管理', icon: 'example' },
    children: [
      {
        path: 'caLabel',
        name: '标签管理',
        component: () => import('@/views/chashi/csLabel'),
        meta: { roles: ['cs:label:page'], title: '标签管理', faicon: 'table' }
      },
      {
        path: 'caAdvertise',
        name: '广告管理',
        component: () => import('@/views/chashi/csAdvertise'),
        meta: { roles: ['cs:advertise:page'], title: '广告管理', faicon: 'table' }
      },
      {
        path: 'caFacilities',
        name: '服务设施管理',
        component: () => import('@/views/chashi/csFacilities'),
        meta: { roles: ['cs:facilities:page'], title: '服务设施管理', faicon: 'table' }
      }
    ]
  },
  {
    path: '/wxuser',
    component: Layout,
    name: '微信用户管理',
    meta: { roles: ['wx:user:page'], title: '用户管理', icon: 'example' },
    children: [
      {
        path: 'wxuser',
        name: '用户列表',
        component: () => import('@/views/chashi/wxUser'),
        meta: { roles: ['wx:user:page'], title: '用户列表', faicon: 'table' }
      }
    ]
  },
  {
    path: '/merchant',
    component: Layout,
    name: '商家管理',
    meta: { roles: ['cs:merchant:page'], title: '商家管理', icon: 'example' },
    children: [
      {
        path: 'merchant',
        name: '商家列表',
        component: () => import('@/views/chashi/csMerchant'),
        meta: { roles: ['cs:merchant:page'], title: '商家列表', faicon: 'table' }
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
    path: '/marketing',
    component: Layout,
    name: '营销管理',
    meta: { roles: ['cs:member:card:page'], title: '营销管理', icon: 'example' },
    children: [
      {
        path: 'csMemberCard',
        name: '会员卡管理',
        component: () => import('@/views/chashi/csMemberCard'),
        meta: { roles: ['cs:member:card:page'], title: '会员卡管理', faicon: 'table' }
      },
      {
        path: 'csCoupon',
        name: '优惠卷管理',
        component: () => import('@/views/chashi/csCoupon'),
        meta: { roles: ['cs:coupon:page'], title: '优惠卷管理', faicon: 'table' }
      },
      {
        path: 'csRecharge',
        name: '充值管理',
        component: () => import('@/views/chashi/csRechargeSetting'),
        meta: { roles: ['cs:recharge:setting:page'], title: '充值管理', faicon: 'table' }
      }
    ]
  }
]
