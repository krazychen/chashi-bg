
// 還沒綁定微信的學生相關的 routes
export const studentNoWXRoutes = [
  {
    path: '/homework',
    redirect: '/homework/account',
    component: () => import('@/views/homework'),
    // meta: { roles: ['pub:student:home', 'pub:teacher:home'], title: '考研作业批改', icon: 'example' },
    meta: { roles: ['pub:student:home'], title: '考研作业批改', icon: 'example' },
    children: [
      {
        path: 'account',
        redirect: 'account/info',
        hidden: true, // Account 的设置不用显示在左侧菜单中
        component: () => import('@/views/homework/account'),
        meta: { roles: ['pub:student:account'], title: '个人中心' },
        children: [
          {
            path: 'info',
            component: () => import('@/views/homework/account/info'),
            meta: { roles: ['pub:student:account'], title: '资料设置' }
          },
          {
            path: 'student',
            component: () => import('@/views/homework/account/studentInfo'),
            meta: { roles: ['pub:student:info'], title: '报考资料' }
          },
          {
            path: 'changePassword',
            component: () => import('@/views/homework/account/changePassword'),
            meta: { roles: ['pub:student:pw'], title: '修改密码' }
          }
        ]
      }
    ]
  }
]
