<template>
  <el-table
    :data="getStateMenuList"
    border
    style="width: 100%"
    row-key="id"
    :tree-props="{children: 'children'}"
  >
    <el-table-column prop="id" label="菜单编号"></el-table-column>
    <el-table-column prop="title" label="菜单名称"></el-table-column>
    <el-table-column prop="pid" label="上级菜单"></el-table-column>
    <el-table-column prop="icon" label="菜单图标"></el-table-column>
    <el-table-column prop="url" label="菜单地址"></el-table-column>
    <el-table-column prop="status" label="状态">
      <template slot-scope="item">
        <el-tag v-if="item.row.status==1" type="success">启动</el-tag>
        <el-tag v-if="item.row.status==2" type="danger">禁用</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180px">
      <template slot-scope="item1">
        <el-button type="primary" size="small" @click="update(item1.row.id)">编辑</el-button>
        <el-button type="danger" size="small" @click="del(item1.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
//引入接口
import { getMenuDelete, getMenuInfo } from "../../util/axios";
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["getStateMenuList"])
  },
  mounted(){
      //触发菜单列表
      this.getActionMenuList();
  },
  methods: {
    ...mapActions(["getActionMenuList"]),
    //点击编辑按钮去修改父组件的数据
    update(id){
        this.$emit('edit',{
            isAdd:false,
            dialogIsShow:true,
            id
        })

    },
    //删除事件
    del(id) {
      this.$confirm("你确定要删除这条数据吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除逻辑
          getMenuDelete({ id }).then(res => {
            if (res.data.code == 200) {
              //重新调取接口列表
              this.getActionMenuList();
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
</style>