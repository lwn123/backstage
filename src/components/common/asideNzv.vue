<template>
    <div>
        <!--        
        el-menu 属性
        default-active	当前激活菜单的 index 
        background-color 背景色
        text-color 文本颜色
        active-text-color 选中颜色
        router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
        -->
        <el-row class="tac">
            <el-col :span="24">
                <el-menu
                    :default-active="defaultActive"
                    class="el-menu-vertical-demo"
                    router
                    unique-opened
                >
                    <el-menu-item index="/home">
                        <i class="el-icon-menu"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-submenu v-for='item in navMenu' :key='item.id' :index="item.id.toString()">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{item.title}}</span>
                        </template>
                        <el-menu-item v-for="menu in item.children"  :key='menu.id' :index="menu.url">{{menu.title}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {getMenuList} from '../../util/axios'
import {mapGetters,mapActions} from 'vuex'
export default {
    data() {
        return {
            defaultActive:'/home'
        }
    },
    computed: {
        navMenu(){
            let data = {} 
            data = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) :{}

            return data.menus
        }
    },
    mounted() {
        //组件挂载,更改选中的默认值
        //把路由地址赋值给默认选中状态
        this.defaultActive = this.$route.path
        //页面一加载就调取菜单列表
        //this.getActionMenuList()
    },
    methods: {
       // ...mapActions(['getActionMenuList'])
    },
}
</script>

<style  lang="" scoped>
.el-menu {
    min-height: 600px;
}
</style>
