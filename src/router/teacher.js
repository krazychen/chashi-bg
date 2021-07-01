const Layout = () => import('@/layout')
import { getUnreadedMsgCount } from '@/api/system/sysMsg'
import { getHwStuHomeworkReplyCount, getHwStuHomeworkAuditCount } from '@/api/homework/homework'

// 老師相關的 routes
export const teacherRoutes = [
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
      {
        path: 'account',
        redirect: 'account/info',
        component: () => import('@/views/homework/account'),
        meta: { roles: ['pub:teacher:home'], title: '个人中心' },
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
      }
    ]
  },
  {
    path: '/homeworkMsg',
    component: Layout,
    name: '消息管理',
    meta: { roles: ['pub:teacher:home'], title: '消息管理', icon: 'example' },
    children: [
      {
        path: 'messages',
        component: () => import('@/views/homework/messages'),
        meta: {
          roles: ['pub:teacher:home'],
          title: '最新通知',
          faicon: 'comment',
          badgeAPI: getUnreadedMsgCount,
          frequency: 600 // update badge every N second
        }
      },
      {
        path: 'myMessages',
        component: () => import('@/views/homework/myMessages'),
        meta: {
          roles: ['pub:teacher:home'],
          title: '我的通知',
          faicon: 'comments'
        }
      },
      {
        path: 'teacherClassSchedule',
        component: () => import('@/views/homework/teacherClassSchedule'),
        meta: {
          roles: ['pub:teacher:home'],
          title: '我的课程',
          faicon: 'comments'
        }
      }
    ]
  },
  {
    path: '/homeworkAud',
    component: Layout,
    name: '批改管理',
    meta: { roles: ['pub:teacher:home'], title: '批改管理', icon: 'example' },
    children: [
      {
        path: 'correctionTeacherMain',
        component: () => import('@/views/homework/assignments/correctionTeacherMain'),
        meta: {
          roles: ['pub:teacher:home'],
          title: '待批改作业',
          faicon: 'edit',
          badgeAPI: getHwStuHomeworkAuditCount,
          frequency: 600
        }
      },
      {
        path: 'replyTeacherMain',
        component: () => import('@/views/homework/assignments/replyTeacherMain'),
        meta: {
          roles: ['pub:teacher:home'],
          title: '待回复作业',
          faicon: 'edit',
          badgeAPI: getHwStuHomeworkReplyCount,
          frequency: 600
        }
      },
      {
        path: 'teacherMain',
        component: () => import('@/views/homework/assignments/teacherMain'),
        meta: {
          roles: ['pub:teacher:home'],
          title: '所有作业',
          faicon: 'edit'
        }
      },
      {
        path: 'teacherForm',
        redirect: '/homeworkAud/teacherForm/teacherForm',
        name: '我的作业数据',
        component: () => import('@/views/homework/shared/ChildView'),
        meta: {
          title: '我的作业数据',
          roles: ['hw:teacher:form:page'],
          faicon: 'table'
        },
        children: [
          {
            path: 'teacherForm',
            name: '数据报表',
            hidden: false,
            component: () => import('@/views/homework/teacherFormOneFrame'),
            meta: {
              roles: ['hw:teacher:form:page']
            }
          },
          {
            path: 'class',
            redirect: '/homeworkAud/teacherForm/class/classs/',
            name: '老师分类报表',
            hidden: true,
            component: () => import('@/views/homework/shared/ChildView'),
            meta: { roles: ['hw:teacher:form:page'], title: '老师分类报表' },
            children: [
              {
                path: 'classs',
                name: '老师分类报表',
                hidden: false,
                component: () => import('@/views/homework/teacherFormClassOneFrame'),
                meta: { roles: ['hw:teacher:form:page'] }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/classCctalk',
    component: Layout,
    name: '数据管理',
    meta: { roles: ['hw:cctalk:class:page'], title: '数据管理', icon: 'example' },
    children: [
      {
        path: 'cctalk',
        redirect: '/classCctalk/cctalk/cctalkForm',
        name: 'cctalk课程',
        component: () => import('@/views/homework/shared/ChildView'),
        meta: { roles: ['hw:cctalk:class:page'], title: 'cctalk课程', faicon: 'table' },
        children: [
          {
            path: 'cctalkForm',
            name: 'cctalk课程',
            hidden: false,
            component: () => import('@/views/homework/classCctalk'),
            meta: { roles: ['hw:cctalk:class:page'] }
          },
          {
            path: 'classCctalkStudent',
            redirect: '/classCctalk/cctalk/classCctalkStudent/classCctalkStudentForm/',
            name: '班级学员详情',
            hidden: true,
            component: () => import('@/views/homework/shared/ChildView'),
            meta: { roles: ['hw:cctalk:class:page'], title: '班级学员详情' },
            children: [
              {
                path: 'classCctalkStudentForm/:id',
                name: '班级学员详情',
                hidden: false,
                component: () => import('@/views/homework/classCctalkStudent'),
                meta: { roles: ['hw:cctalk:class:page'] }
              },
              {
                path: 'student',
                name: '作业班级学员数据报表',
                redirect: '/classCctalk/cctalk/classCctalkStudent/student/details/',
                hidden: true,
                component: () => import('@/views/homework/shared/ChildView'),
                meta: { roles: ['hw:cctalk:class:page'], title: '作业班级学员数据报表' },
                children: [
                  {
                    path: 'details/:id/:classId',
                    name: '班级学员详情',
                    hidden: false,
                    component: () => import('@/views/homework/cctalkGroupMain'),
                    meta: { roles: ['hw:cctalk:class:page'] }
                  }
                ]
              }
            ]
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
    path: '/homework/:id/teacherView/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/TeacherView'),
    meta: { title: '批改', roles: ['pub:teacher:home'] }
  },
  {
    path: '/homework/:id/details/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/TeacherDetailsView'),
    meta: { title: '学员作业详情', roles: ['pub:teacher:home'] }
  },
  {
    path: '/homework/submission/review',
    component: () => import('@/views/homework/submissions/review'),
    meta: { roles: ['pub:teacher:home'], title: '作业批改' },
    hidden: true
  },
  {
    path: '/system/homework/:id/formView/:stu',
    hidden: true,
    component: () => import('@/views/homework/FromView'),
    meta: { title: '复评查看', roles: ['hw:teacher:form:page'] }
  }
]
