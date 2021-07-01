// 老師相關的 routes
export const teacherSeeRoutes = [
  {
    path: '/homework',
    redirect: '/homework/teacherMain',
    component: () => import('@/views/homework'),
    meta: { roles: ['pub:teacher:home'], title: '所有作业', icon: 'example', faicon: 'bookmark-o', bgcolor: '#ff6900' },
    children: [
      {
        path: 'teacherMain',
        component: () => import('@/views/homework/assignments/teacherSeeMain'),
        meta: {
          roles: ['pub:teacher:home'],
          title: '查看所有作业',
          faicon: 'edit',
          bgcolor: '#ff6900'
        }
      },
      {
        path: 'account',
        redirect: '/homework/account/info',
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
  },
  {
    path: '/homework/showOneImage',
    hidden: true,
    component: () => import('@/views/homework/assignments/showOneImage'),
    meta: { title: '图片批改', roles: ['pub:teacher:home'] }
  },
  {
    path: '/homework/:id/seeDetails/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/teacherSeeDetailsView'),
    meta: { title: '学员作业详情', roles: ['pub:teacher:home'] }
  }
]
