import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export default new Router({
  mode:'history',
  routes: [
    {
      path: '/login',
      component: () => import('@/components/pages/login')
     },
    {
      path: '/index',
      component: () => import('@/components/pages/index'),
      children:[
        {
          path:'/menu',
          component:() =>import('@/pages/menu/menu'),
          meta:{
            name:'菜单管理'
          }
        },{
          path:'/role',
          component:() => import('@/components/views/role'),
          meta:{
            name:'角色管理'
          }
        },{
          path:'/admin',
          component:() =>import('@/components/views/admin'),
          meta:{
            name:'管理员管理'
          }
        },{
          path:'/classify',
          component:() =>import('@/components/views/classify'),
          meta:{
            name:'商品分类'
          }
         },{
           path:'/spec',
           component:() => import ('@/pages/spec/spec'),
           meta:{
             name:'商品规格'
           }
         },{
           path:'/goods',
           component:() => import ('@/pages/goods/goods'),
           meta:{
             name:'商品管理'
           }
         },{
          path:'/main',
          component:() =>import('@/components/views/main')
         },{
          path:'',
          redirect:'/main'
        }
      ]
    },{
      path:'*',
      redirect:'/login'
    }
  ]
})
