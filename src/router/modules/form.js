/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const formRouter = {
  path: '/form',
  component: Layout,
  name: 'Form',
  meta: {
    title: 'form',
    icon: 'table',
    roles: ['admin']
  },
  children: [
    {
      path: 'createForm',
      component: () => import('@/views/form/index'),
      name: 'CreateForm',
      meta: { title: 'createForm' },
      children: [
        {
          path: 'online',
          component: () => import('@/views/form/createForm/web'),
          name: 'OnlineCreate',
          meta: { title: 'onlineCreate' }
        }
        // {
        //   path: 'upload',
        //   component: () => import('@/views/form/createForm/upload'),
        //   name: 'UploadCreate',
        //   meta: { title: 'uploadCreate' }
        // }
      ]
    }
    // {
    //   path: 'editForm',
    //   component: () => import('@/views/form/index'),
    //   name: 'EditForm',
    //   meta: { title: 'editForm' },
    //   children: [
    //     {
    //       path: 'online',
    //       component: () => import('@/views/form/editForm/web'),
    //       name: 'OnlineEdit',
    //       meta: { title: 'onlineEdit' }
    //     },
    //     {
    //       path: 'upload',
    //       component: () => import('@/views/form/editForm/upload'),
    //       name: 'UploadEdit',
    //       meta: { title: 'uploadEdit' }
    //     }
    //   ]
    // }
  ]
}

export default formRouter
