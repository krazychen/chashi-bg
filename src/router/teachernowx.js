
// 還沒綁定微信的學生相關的 routes
export const teacherNoWXRoutes = [
  {
    path: '/homework',
    redirect: '/homework/account',
    component: () => import('@/views/homework'),
    // meta: { roles: ['pub:student:home', 'pub:teacher:home'], title: '考研作业批改', icon: 'example' },
    meta: { roles: ['pub:teacher:home'], title: '考研作业批改', icon: 'example' },
    children: [
      {
        path: 'account',
        redirect: 'account/info',
        hidden: true, // Account 的设置不用显示在左侧菜单中
        component: () => import('@/views/homework/account'),
        meta: { roles: ['pub:teacher:home'], title: '个人中心' },
        children: [
          {
            path: 'info',
            component: () => import('@/views/homework/account/teacherInfo'),
            meta: { roles: ['pub:teacher:home'], title: '资料设置' }
          },
          {
            path: 'student',
            component: () => import('@/views/homework/account/studentInfo'),
            meta: { roles: ['pub:teacher:home'], title: '报考资料' },
            hidden: true
          },
          {
            path: 'changePassword',
            component: () => import('@/views/homework/account/changePassword'),
            meta: { roles: ['pub:teacher:home'], title: '修改密码' }
          }
        ]
      }
    ]
  }
]
