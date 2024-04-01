import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'
import mjlayout from '@/views/mj/layout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
   {
    path: '/g',
    name: 'g',
    component: ChatLayout,
    redirect: '/g/g-2fkFE8rbu',
    children: [
      {
        path: '/g/:gid',
        name: 'GPTs',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
   {
    path: '/m',
    name: 'm',
    component: ChatLayout,
    redirect: '/m/gpt-3.5-turbo',
    children: [
      {
        path: '/m/:gid',
        name: 'Model',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },

  {
    path: '/draw',
    name: 'Rootdraw',
    component: mjlayout,
    redirect: '/draw/index',
    children: [
      {
        path: '/draw/:uuid?',
        name: 'draw',
        component: () => import('@/views/mj/draw.vue'),
      },
    ],
  },

  {
    path: '/sound',
    name: 'Sound',
    component: ChatLayout,
    redirect: '/sound/t',
    children: [
      {
        path: 't',
        name: 'sound1',
        component: () => import('@/views/sound/index.vue'),
      },
    ],
  },

  {
    path: '/knowledge',
    name: 'Knowledge',
    component: ChatLayout,
    redirect: '/knowledge/t',
    children: [
      {
        path: 't',
        name: 'knowledge1',
        component: () => import('@/views/knowledge/index.vue'),
      },
    ],
  },

  {
    path: '/annex',
    name: 'Annex',
    component: ChatLayout,
    redirect: '/annex/t',
    children: [
      {
        path: 't',
        name: 'annex1',
        component: () => import('@/views/knowledge/annex.vue'),
      },
    ],
  },

  {
    path: '/fragment',
    name: 'Fragment',
    component: ChatLayout,
    redirect: '/fragment/t',
    children: [
      {
        path: 't',
        name: 'fragment1',
        component: () => import('@/views/knowledge/fragment.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/regist',
    name: 'regist',
    component: () => import('@/views/regist/index.vue'),
  },
  {
    path: '/resetpassword',
    name: 'resetpassword',
    component: () => import('@/views/resetpassword/index.vue'),
  },
  
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
