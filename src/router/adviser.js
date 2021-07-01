const Layout = () => import('@/layout')
// 课程顾问 routes
export const adviserRoutes = [
  {
    path: '/adviser',
    component: Layout,
    name: '系统对接',
    meta: { roles: ['cctalk:salse:order:page'], title: '系统对接', icon: 'example' },
    children: [
      {
        path: 'cctalk',
        component: () => import('@/views/homework/cctalk'),
        meta: {
          roles: ['cctalk:salse:order:page'],
          title: 'cctalk订单查看',
          frequency: 600, // update badge every N second
          faicon: 'table'
        }
      },
      {
        path: 'cctalkReg',
        component: () => import('@/views/homework/cctalkReg'),
        meta: {
          roles: ['cctalk:salse:order:page'],
          title: '课程顾问-登记',
          frequency: 600, // update badge every N second
          faicon: 'table'
        }
      },
      {
        path: 'cctalkRef',
        component: () => import('@/views/homework/cctalkRef'),
        meta: {
          roles: ['cctalk:salse:order:page'],
          title: '课程顾问-退课',
          frequency: 600, // update badge every N second
          faicon: 'table'
        }
      }
    ]
  }
]
