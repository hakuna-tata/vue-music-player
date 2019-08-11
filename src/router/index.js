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
        component: () => import('@/components/recommend')
    }
  ]
})
