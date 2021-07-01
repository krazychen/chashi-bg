const Layout = () => import('@/layout')
import { getHwStuHomeworkAuditTwoCount, getHwStuHomeworkTwoReplyCount, getHwStuHomeworkExamineCount } from '@/api/homework/homework'
// 後台管理相關的 routes
export const leve2teacherRoutes = [
  {
    path: '/system',
    component: Layout,
    name: '系统管理',
    meta: { roles: ['sys:user:page'], title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'account',
        name: '个人中心',
        redirect: '/system/account/info:state',
        component: () => import('@/views/homework/account/'),
        meta: { roles: ['sys:user:page'], title: '个人中心' },
        children: [
          {
            path: 'info:state',
            component: () => import('@/views/homework/account/teacherInfo'),
            meta: { roles: ['pub:teacher:home'], title: '资料设置' }
          },
          {
            path: 'student:state',
            component: () => import('@/views/homework/account/studentInfo'),
            meta: { roles: ['pub:teacher:home'], title: '报考资料' },
            hidden: true
          },
          {
            path: 'changePassword:state',
            component: () => import('@/views/homework/account/changePassword'),
            meta: { roles: ['pub:teacher:home'], title: '修改密码' }
          }
        ]
      },
      {
        path: 'usersMgn',
        name: '用户管理',
        component: () => import('@/views/system/usersMgn'),
        meta: { roles: ['sys:user:page'], title: '用户管理', faicon: 'table' }
      },
      {
        path: 'teacherClassSchedule',
        name: '消息管理',
        component: () => import('@/views/system/msgMgn'),
        meta: { roles: ['sys:user:page'], title: '消息管理', faicon: 'table' }
      },
      {
        path: 'my',
        name: '我的课程',
        component: () => import('@/views/homework/teacherClassSchedule'),
        meta: { roles: ['sys:user:page'], title: '我的课程', faicon: 'table' }
      },
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
  },
  {
    path: '/repeat',
    name: '复评管理',
    redirect: 'repeat/correctionRepeat',
    // component: () => import('@/views/homework/account'),
    component: Layout,
    meta: { roles: ['homework:repeat:page'], title: '复评管理', icon: 'example' },
    children: [
      {
        path: 'correctionRepeat',
        name: '待批改作业',
        component: () => import('@/views/homework/correctionRepeat'),
        meta: { roles: ['homework:repeat:page'], title: '待批改作业', badgeAPI: getHwStuHomeworkAuditTwoCount, frequency: 600 }

      }, {
        path: 'ToExamineRepeat',
        name: '待审核作业',
        component: () => import('@/views/homework/ToExamineRepeatNew'),
        meta: { roles: ['homework:repeat:page'], title: '待审核作业', badgeAPI: getHwStuHomeworkExamineCount, frequency: 600 }
      }, {
        path: 'ReplyRepeat',
        name: '待回复作业',
        component: () => import('@/views/homework/ReplyRepeatAudit'),
        meta: { roles: ['homework:repeat:page'], title: '待回复作业', badgeAPI: getHwStuHomeworkTwoReplyCount, frequency: 600 }
      }, {
        path: 'repeat',
        name: '所有作业',
        component: () => import('@/views/homework/repeat'),
        meta: { roles: ['homework:repeat:page'], title: '所有作业' }
      }
    ]
  },
  {
    path: '/system/:id/showRepeatAudit/:stu',
    hidden: true,
    component: () => import('@/views/homework/RepeatView'),
    meta: { title: '批改', roles: ['homework:repeat:page'] }
  },
  {
    path: '/system/:id/repeatDetails/:stu',
    hidden: true,
    component: () => import('@/views/homework/RepeatDetailsView'),
    meta: { title: '复评查看', roles: ['homework:repeat:page'] }
  },
  {
    path: '/homework/showOneImage',
    hidden: true,
    component: () => import('@/views/homework/assignments/showOneImageRepeat'),
    meta: { title: '图片批改', roles: ['pub:teacher:home'] }
  },
  {
    path: '/system/:id/showRepeatExamine/:stu',
    hidden: true,
    component: () => import('@/views/homework/RepeatViewExamine'),
    meta: { title: '复评', roles: ['homework:repeat:page'] }
  },
  {
    path: '/system/:id/showDetails/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/TeacherDetailsView'),
    meta: { title: '作业详情', roles: ['homework:repeat:page'] }
  },
  {
    path: '/system/:id/formView/:stu',
    hidden: true,
    component: () => import('@/views/homework/FromView'),
    meta: { title: '复评查看', roles: ['hw:teacher:form:page'] }
  }
]
