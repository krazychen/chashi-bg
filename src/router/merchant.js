const Layout = () => import('@/layout')

// 商家相關的 routes
export const merchantRoutes = [
  {
    path: '/homework',
    component: Layout,
    name: '设置',
    redirect: '/homeworkMsg/messages',
    meta: { roles: ['pub:teacher:home'], title: '设置', icon: 'example' },
    children: [

      // {
      //   path: 'documents',
      //   component: () => import('@/views/homework/documents'),
      //   meta: { roles: ['pub:teacher:home'], title: '资料下载', icon: 'table', faicon: 'download', bgcolor: '#4fb9f0' }
      // },
      // {
      //   path: 'account',
      //   redirect: 'account/info',
      //   component: () => import('@/views/homework/account'),
      //   meta: { roles: ['pub:teacher:home'], title: '个人中心' },
      //   children: [
      //     {
      //       path: 'info:state',
      //       component: () => import('@/views/homework/account/teacherInfo'),
      //       meta: { roles: ['pub:teacher:home'], title: '资料设置' }
      //     },
      //     {
      //       path: 'student:state',
      //       component: () => import('@/views/homework/account/studentInfo'),
      //       meta: { roles: ['pub:teacher:home'], title: '报考资料' },
      //       hidden: true
      //     },
      //     {
      //       path: 'changePassword:state',
      //       component: () => import('@/views/homework/account/changePassword'),
      //       meta: { roles: ['pub:teacher:home'], title: '修改密码' }
      //     }
      //   ]
      // }
    ]
  }
]
