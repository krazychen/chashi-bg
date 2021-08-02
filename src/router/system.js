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
        path: 'officeMgn',
        name: '组织机构',
        component: () => import('@/views/system/officeMgn'),
        meta: { roles: ['sys:office:page'], title: '组织机构', faicon: 'tree' }
      },
      {
        path: 'usersMgn',
        name: '用户管理',
        component: () => import('@/views/system/usersMgn'),
        meta: { roles: ['sys:user:page'], title: '用户管理', faicon: 'table' }
      },
      {
        path: 'sysMenu',
        name: '菜单管理',
        component: () => import('@/views/system/sysMenu'),
        meta: { roles: ['sys:menu:page'], title: '菜单管理', faicon: 'tree' }
      }, {
        path: 'sysDictType',
        name: '数据字典',
        component: () => import('@/views/system/sysDictType'),
        meta: { roles: ['sys:dict:type:page'], title: '数据字典', faicon: 'table' }
      }, {
        path: 'sysArea',
        name: '行政区划',
        component: () => import('@/views/system/sysArea'),
        meta: { roles: ['sys:area:page'], title: '行政区划', faicon: 'tree' }
      },
      // {
      //   path: 'sysSchool',
      //   name: '学校管理',
      //   component: () => import('@/views/system/sysSchool'),
      //   meta: { roles: ['sys:school:page'], title: '学校管理', faicon: 'table' }
      // },
      // {
      //   path: 'msgMgn',
      //   name: '消息管理',
      //   component: () => import('@/views/system/msgMgn'),
      //   meta: { roles: ['sys:user:page'], title: '消息管理', faicon: 'tree' }
      // }, {
      {
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
  }

  // ,
  // {
  //   path: '/homework/submission/review',
  //   component: () => import('@/views/homework/submissions/review'),
  //   meta: { roles: ['sys:user:page'], title: '作业批改' }
  //   // hidden: false
  // }
]
