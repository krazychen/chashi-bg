import { getUnreadedMsgCount } from '@/api/system/sysMsg'

// 學生相關的 routes
export const studentRoutes = [
  {
    path: '/homework',
    redirect: '/homework/allMessages',
    component: () => import('@/views/homework'),
    // meta: { roles: ['pub:student:home', 'pub:teacher:home'], title: '考研作业批改', icon: 'example' },
    meta: { roles: ['pub:student:home'], icon: 'example' },
    children: [
      {
        path: 'allMessages',
        component: () => import('@/views/homework/messages'),
        meta: { roles: ['pub:student:messages'], title: '通知',faicon: 'comment',
          bgcolor: '#69c1a6' },
        children: [
          {
            path: 'messages',
            component: () => import('@/views/homework/messages'),
            meta: {
              roles: ['pub:student:messages'],
              title: '最新通知',
              // faicon: 'comment',
              // bgcolor: '#69c1a6',
              badgeAPI: getUnreadedMsgCount,
              frequency: 600 // update badge every N second
            }
          },
          {
            path: 'myMessages',
            component: () => import('@/views/homework/myMessages'),
            meta: {
              roles: ['pub:student:myMessages'],
              title: '我的通知',
              // faicon: 'comments',
              // bgcolor: 'rgb(57, 173, 137)'
            }
          }
        ]
      },
      // {
      //   path: 'messages',
      //   component: () => import('@/views/homework/messages'),
      //   meta: {
      //     roles: ['pub:student:messages'],
      //     title: '最新通知',
      //     faicon: 'comment',
      //     bgcolor: '#69c1a6',
      //     badgeAPI: getUnreadedMsgCount,
      //     frequency: 600 // update badge every N second
      //   }
      // },
      // {
      //   path: 'myMessages',
      //   component: () => import('@/views/homework/myMessages'),
      //   meta: {
      //     roles: ['pub:student:myMessages'],
      //     title: '我的通知',
      //     faicon: 'comments',
      //     bgcolor: 'rgb(57, 173, 137)'
      //   }
      // },
      {
        path: 'myClassSchedule',
        component: () => import('@/views/homework/myClassSchedule'),
        meta: {
          roles: ['hw:student:schedule:info'],
          title: '我的课程',
          faicon: 'comments',
          bgcolor: 'rgb(57, 173, 137)'
        }
      },
      {
        path: 'account',
        redirect: 'info',
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
      },
      {
        path: 'assignments',
        component: () => import('@/views/homework/assignments/list'),
        meta: { roles: ['pub:student:assignments'], title: '我的作业', faicon: 'bookmark-o', bgcolor: 'rgb(209, 159, 115)' }
      },
      {
        path: 'myInfo',
        component: () => import('@/views/homework/account/info'),
        meta: { roles: ['pub:student:assignments'], title: '我的资料', faicon: 'bookmark-o', bgcolor: 'rgb(209, 159, 115)' }
      }
      // {
      //   path: 'show',
      //   component: () => import('@/views/homework/assignments/show'),
      //   meta: { roles: ['pub:student:assignments'], title: '作业提交', icon: 'table', faicon: 'dashboard', bgcolor: '#ff7d00' }
      // },
      // {
      //   path: 'documents',
      //   component: () => import('@/views/homework/documents'),
      //   meta: { roles: ['pub:student:documents'], title: '资料下载', faicon: 'download', bgcolor: 'rgb(234, 213, 169)' }
      // }
    ]
  },
  {
    path: '/homework/:id/studentView/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/StudentView'),
    meta: { title: '作业提交', roles: ['pub:student:assignments'] }
  },
  {
    path: '/homework/:id/studetails/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/StudentDetailsView'),
    meta: { title: '学生作业详情', roles: ['pub:student:home'] }
  },
  {
    path: '/homeworkShare/:id/studetailsShare/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/StudentDetailsViewShare'),
    meta: { title: '学生作业详情' }
  },
  {
    path: '/homework/showOneImage',
    hidden: true,
    component: () => import('@/views/homework/assignments/showOneImage'),
    meta: { title: '图片批改详情', roles: ['pub:student:home'] }
  }
]
