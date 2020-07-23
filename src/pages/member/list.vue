<template>
 <el-table :data="getStatemembersList" border style="width: 100%" row-key="id">
      <el-table-column prop="id" label="用户编号"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <el-tag v-if="item.row.status==1" type="success">启动</el-tag>
          <el-tag v-if="item.row.status==2" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="item1">
          <el-button type="danger" size="small" @click="del(item1.row.uid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
//引入接口
import {getmemberInfo } from "../../util/axios";
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["getStatemembersList"])
  },
  mounted(){
      //触发菜单列表
      this.getActionMemberList();
  },
  methods: {
    ...mapActions(["getActionMemberList"]),
    //点击编辑按钮去修改父组件的数据
    update(id){
        this.$emit('edit',{
            dialogIsShow:true,
            id
        })

    },
  }
};
</script>

<style>
</style>