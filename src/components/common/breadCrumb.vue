<template>
  <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/main'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#">{{$route.meta.name}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>