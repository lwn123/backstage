<template>
  <div>
    <el-container>
      <el-header>
        <h1 id="title">小U商城后台管理系统</h1>
        <div class="info">
          <div class="username">
              {{getName}}
          </div>
          <el-button type='danger' @click='logOut' size='small'>退出</el-button>
        </div>

      </el-header>
     
    <el-container>
        <el-aside width="250px">
             <asideNav></asideNav>
  
        </el-aside>
        <el-main>
          <!-- 二级路由出口 -->
          <router-view/>
        </el-main>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import asideNav from '../common/asideNzv'
export default {
   
    components:{
      asideNav
    },
    computed: {
        getName(){
            let data =''
            data = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : ''
            return data.username
        }
    },
    methods: {
        //退出事件
        logOut(){
          //移除session信息
          sessionStorage.removeItem('userInfo')
          //跳转到登录页
          this.$router.push('/login')
        }
    },
};
</script>

<style lang='stylus' scoped>
  .el-header,.el-footer{
    position relative
    background-color: #00BFFF;
    color: #333;
    font-size 30px
    font-weight bold
    text-align: center;
    height 60px
  }
  
  .el-aside {
    background-color: #87CEEB;
    color: #333;
    text-align: center;
    line-height: 200px;
    min-height 600px
  }
  
  .el-main {
    background-color: #87CEFA;
    color: #333;
    text-align left 
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  #title
    line-height 60px
  .info 
    position absolute
    top 10px
    right 20px 
    display flex
    .username
        color #fff 
        margin-right 10px
</style>