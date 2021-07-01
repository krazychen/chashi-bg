import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
// import Layout from '@/layout'

import { scoreRoutes } from './score'
import { systemRoutes } from './system'
import { studentRoutes } from './student'
import { teacherRoutes } from './teacher'
import { studentNoWXRoutes } from './studentnowx'
import { teacherNoWXRoutes } from './teachernowx'
import { leve2teacherRoutes } from './leve2teacher'
import { teacherSeeRoutes } from './seeteacher'
import { superadminRoutes } from './superadmin'
import { adviserRoutes } from './adviser'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/users/login'),
    hidden: true
  },
  {
    path: '/smslogin',
    component: () => import('@/views/users/smslogin'),
    hidden: true
  },
  {
    path: '/wxlogin',
    component: () => import('@/views/users/wxlogin'),
    hidden: true
  }, {
    path: '/certificate',
    component: () => import('@/views/users/certificate'),
    hidden: true
  },
  {
    path: '/reg',
    component: () => import('@/views/users/reg'),
    hidden: true
  },
  {
    path: '/wx',
    component: () => import('@/views/users/wx'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
  // {
  //   path: '/',
  //   redirect: '/homework',
  //   component: Layout,
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // }
]

export const anonymousRoutes = [
  {
    path: '/homeworkShare/:id/studetailsShare/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/StudentDetailsViewShare'),
    meta: { title: '学生作业详情' }
  },
  {
    path: '/homeworkShare/showOneImageShare',
    hidden: true,
    component: () => import('@/views/homework/assignments/showOneImageShare'),
    meta: { title: '图片详情' }
  },
  {
    path: '/homeworkShare/:id/relatedStudetailsShare/:stu',
    hidden: true,
    component: () => import('@/views/homework/assignments/relatedStudentDetailsViewShare'),
    meta: { title: '学生作业详情' }
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // TODO: 必須要有辦法保證下面的每個 reotes 的 root 不重複
  ...systemRoutes,
  ...superadminRoutes
  // TODO: refactor below

  // { path: '*', redirect: '/404', hidden: true }
]

export const roleTypeRoutes = {
  'sysadmin': systemRoutes,
  'superadmin': superadminRoutes
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
