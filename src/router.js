import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const r =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/',
      redirect:'/reports'
    },
    {
      path: '/home',
      component: () => import('./views/Home.vue'),
      children:[
        {
          path: '/users',
          component: () => import('./views/User.vue')
        },
        {
          path: '/goods',
          component: () => import('./views/goods/Goods.vue')
        },
        {
          path: '/addGoods',
          component: () => import('./views/goods/addGoods.vue')
        },
        {
          path: '/reports',
          component: () => import('./views/reports.vue')
        },
        {
          path: '/roles',
          component: () => import('./views/roles.vue')
        },
        {
          path: '/categories',
          component: () => import('./views/category.vue')
        },
        {
          path: '/rights',
          component: () => import('./views/rights/rights.vue')
        },
        {
          path: '/params',
          component: () => import('./views/params/params.vue')
        },
        {
          path: '/orders',
          component: () => import('./views/orders/orders.vue')
        },
        
      ]
    },
    {
      path: '/login',
      component: () => import('./views/Login.vue')
    }
  ]
})

r.beforeEach((to,from,next)=>{

  if(to.path == '/login')  return next();

  let token = sessionStorage.getItem('token')

  if(token)
    return next() 
  else 
    return next('/login')
})
export default r
