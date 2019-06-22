import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const r =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/',
      redirect:'/users'
    },
    {
      path: '/home',
      component: () => import('./views/Home.vue'),
      children:[
        {
          path: '/users',
          component: () => import('./views/User.vue')
        }
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
