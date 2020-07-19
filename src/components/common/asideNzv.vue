<template>
  <el-menu
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    unique-opened
    router
    
  >
    <el-menu-item index="/main">
      <i class="el-icon-menu"></i>
      <span slot="title">首 页</span>
    </el-menu-item>

    <el-submenu :index="item.url" v-for="item in getStateMenuList" :key="item.id">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{item.title}}</span>
      </template>
      <el-menu-item
        :index="child.url"
        v-for="child in item.children"
        :key="child.id"
      >{{child.title}}</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import {getMenuList} from '../../util/axios'
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      defaultActive: "/home"
    };
  },
  mounted() {
    this.getActionMenuList();
    this.defaultActive = this.$route.path;
  },
  computed: {
    ...mapGetters(["getStateMenuList"])
  },
  methods: {
   ...mapActions(['getActionMenuList']),
   
  }
};
</script>

<style lang='stylus' scoped>
.el-menu {
  height: 600px;
}
</style>