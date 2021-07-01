import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getLocalStorageKeyValue } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import { isSafari, isChrome } from './browser'

// 在沒開始設置 before 之前就把匿名動態的路徑全加載了
import { anonymousRoutes } from '@/router'
router.addRoutes(anonymousRoutes)

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = [ // no login required
  '/login',
  '/smslogin',
  '/reg',
  '/wx',
  '/certificate',
  '/wxlogin',
  /\/homeworkShare\/\d+\/studetailsShare\//,
  /\/homeworkShare\/\d+\/relatedStudetailsShare\//,
  '/homeworkShare/showOneImageShare'
]

// for test
// const allowedBrowser = (isSafari || isChrome || isOpera || isFirefox || isEdge)

// for product
const allowedBrowser = (isSafari || isChrome)

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (!allowedBrowser) {
    Message({
      message: '为了更好的系统体验，请使用 Chrome 或者 Safari访问系统!',
      type: 'error',
      duration: 5 * 1000
    })
    // next()
    NProgress.done()
    return
  } else {
    const arr = allowedBrowser.input.split(' ')
    let chromeVersion = ''
    for (let i = 0; i < arr.length; i++) {
      if (/chrome/i.test(arr[i])) { chromeVersion = arr[i] }
    }
    if (chromeVersion) {
      const number = Number(chromeVersion.split('/')[1].split('.')[0])
      if (number) {
        if (number < 63) {
          Message({
            message: 'chrome浏览器版本过低，请更新chrome浏览器或者更换浏览器后访问系统！',
            type: 'error',
            duration: 5 * 1000
          })
          // next()
          NProgress.done()
          return
        }
      }
    }
  }

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // console.log('-- to path', to.path)

      try {
        const { dynamicRoutes } = store.getters
        if (dynamicRoutes) {
          let path = ''
          // 若学员绑定了微信，但是学员想访问其他页面却不是用微信扫码登陆的，则都跳转到wx登陆，若学员没有绑定微信，则跳转到绑定页面
          const data = JSON.parse(getLocalStorageKeyValue('user'))
          if (data && data.iswx && data.sysRoleList[0] && (data.sysRoleList[0].type === 'studentnowx' || data.sysRoleList[0].type === 'teachernowx')) {
            store.dispatch('user/logout')
            path = '/wx'
            next()
          } else
          // const accessablePaths = store.getters['permission/accessablePaths']
          // console.log('-- accessablePaths', accessablePaths)
          // if (to.path === '/' || !accessablePaths.includes(to.path)) {
          // Shit, 動態 route 沒法判斷是否在當前 roleTypes 下
          // 直接在 logout 的時候全跳轉到 /，不再記住需要 redirect 的 path
          if (to.path === '/') {
            path = dynamicRoutes[0].path
            next({ path })
          } else {
            store.dispatch('user/getInfo')
            next()
          }
        } else {
          // console.log('---- no rouets')

          // 角色當前所擁有的權限來取得 accessableRoutes (可訪問的 routes)
          await store.dispatch('permission/generateRoutes')
          const { dynamicRoutes, accessableRoutes } = store.getters

          // console.log('-- accessable', accessableRoutes)
          router.addRoutes(accessableRoutes)

          // router.addRoutes 有個 bug， 下一步去哪裡都必須 replace
          if (to.path === '/') {
            const path = dynamicRoutes[0].path
            next({ path, replace: true })
          } else {
            next({ ...to, replace: true })
          }
        }
      } catch (error) {
        // remove token and go to login page to re-login
        console.error(error)
        await store.dispatch('user/resetToken')
        Message({
          message: error || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        // 不加 redirect， 原因如下
        // next(`/login?redirect=${to.path}`)
        next(`/login`)
        NProgress.done()
      }
    }
  } else {
    let inWhiteList = false
    whiteList.forEach(pattern => {
      if (typeof pattern === 'string' && whiteList.indexOf(to.path) !== -1) {
        inWhiteList = true
      } else if (to.path.match(pattern)) {
        inWhiteList = true
      }
    })

    /* has no token*/
    if (inWhiteList) {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // redirect url 暂时无法区分是哪个 roleType 的，登入后有可能不在 accesableRoute 中导致页面空白
      // 所以没 login 时跳转到 login 介面不再附带 redirect
      // next(`/login?redirect=${to.path}`)
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
