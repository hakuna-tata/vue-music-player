import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
        path: '/recommend',
        name: 'recommend',
        component: () => import('@/components/recommend/recommend.vue'),
        children:[
          {
            path:':id',
            component: () => import('@/components/recommend-detail/recommend-detail.vue'),
          }
        ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: () => import('@/components/singer/singer.vue'),
      children:[
        {
          path:':id',
          component: () => import('@/components/singer-detail/singer-detail.vue')
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import('@/components/rank/rank.vue'),
      children:[
        {
          path:':id',
          component: () => import('@/components/rank-detail/rank-detail.vue')
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/components/search/search.vue'),
      children:[
        {
          path: 'singer/:id',
          component: () => import('@/components/singer-detail/singer-detail.vue')
        },
        {
          path:'list/:id',
          component: () => import('@/components/recommend-detail/recommend-detail.vue')
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/components/user/user.vue')
    }
  ]
})
