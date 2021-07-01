const Layout = () => import('@/layout')

export const scoreRoutes = [
  {
    path: '/score',
    component: Layout,
    name: '查分管理',
    meta: { roles: ['score:student:page'], title: '查分管理', icon: 'example' },
    children: [
      {
        path: 'scoreMgn',
        name: '查分管理',
        component: () => import('@/views/score/score'),
        meta: { roles: ['sys:office:page'], title: '查分管理', icon: 'tree' }
      },
      {
        path: 'scoreStatistics',
        name: '学员统计',
        component: () => import('@/views/dashboard/index1.vue'),
        meta: { title: '学员统计', icon: 'tree' }
      }
    ]
  }
]
