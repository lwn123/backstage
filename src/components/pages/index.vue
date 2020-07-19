<template>
  <div>
    <el-container>
      <el-header>XXX后台管理系统</el-header>
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
    }
};
</script>

<style lang='stylus' scoped>
  .el-header,.el-footer{
    background-color: #00BFFF;
    color: #333;
    font-size 30px
    font-weight bold
    text-align: center;
    line-height: 60px;
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
</style>