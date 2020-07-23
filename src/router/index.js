import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


 const router = new Router({
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
           path:'/member',
           component:() => import('@/pages/member/member'),
           meta:{
             name:'会员管理'
           }
         },{
           path:'/banner',
           component:() => import('@/components/views/banner'),
           meta:{
             name:'轮播图管理'
           }
         },{
           path:'/seck',
           component:() => import('@/components/views/seck'),
           meta:{
             name:'秒杀管理'
           }
         },
         {
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
//路由导航守卫之钩子函数
router.beforeEach((to, from, next) => {
  //如果跳转的页面是登录页 ，就继续
  if (to.path == '/login') {
    next()
    return
  }
  //如果缓存没数据，就重新登录
  if(!sessionStorage.getItem('userInfo')){
      next('/login')
  }
  //如果你的缓存有值 你就可以继续
  next()

})
export default router