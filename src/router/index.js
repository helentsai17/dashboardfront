import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import formRouter from './modules/form'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/patient',
    component: Layout,
    name: 'Patient',
    meta: {
      title: 'patient',
      icon: 'peoples'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/patient/list/index'),
        name: 'ListPatient',
        meta: { title: 'listPatient' }
      },
      {
        path: 'eligibility',
        component: () => import('@/views/patient/eligibility/index'),
        name: 'EligibilityPatient',
        meta: { title: 'eligibilityPatient' }
      },
      {
        path: 'dev',
        component: () => import('@/views/patient/dev/index'),
        name: 'DevMenu',
        meta: { title: 'Develop Menu', roles: ['admin'] }
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    redirect: '/message/index',
    name: 'Message',
    children: [
      {
        path: 'index',
        component: () => import('@/views/message/index'),
        name: 'MessageList',
        meta: { title: 'message', icon: 'message' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/message/edit'),
        name: 'EditMessage',
        meta: { title: 'editMessage', noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: '/userManage',
    component: Layout,
    name: 'User Management',
    meta: {
      title: 'User Management',
      icon: 'peoples',
      roles: ['admin']
    },
    children: [
      {
        path: 'newUser',
        component: () => import('@/views/userManage/newUser/index'),
        name: 'Create New User',
        meta: { title: 'Create New User', roles: ['admin'] }
      },
      {
        path: 'addRemoveUser',
        component: () => import('@/views/userManage/addRemoveUser/index'),
        name: 'Add/Remove User',
        meta: { title: 'Add/Remove User', roles: ['admin'] }
      }
    ]
  },

  formRouter,

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/setting/index'),
        name: 'Setting',
        meta: { title: 'setting' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
