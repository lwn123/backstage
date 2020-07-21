<template>
  <el-table :data="getStateSpecList" border style="width: 100%" row-key="id">
    <el-table-column prop="id" label="商品规格编号"></el-table-column>
    <el-table-column prop="specsname" label="商品规格名称"></el-table-column>
    <el-table-column prop="attrs" label="商品规格属性">
      <template slot-scope="item">
        <el-tag v-for="val in item.row.attrs" :key="val" type="info">{{val}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态">
      <template slot-scope="item">
        <el-tag v-if="item.row.status==1" type="success">启动</el-tag>
        <el-tag v-if="item.row.status==2" type="danger">禁用</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template slot-scope="item">
        <el-button size="small" type="primary" @click="update(item.row.id)">编辑</el-button>
        <el-button size="small" type="danger" @click="del(item.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
//引入接口
import { getspecDelete } from "../../util/axios";
//引入辅助性函数
import { mapGetters } from "vuex";
export default {
  props: ["getCount"],
  computed: {
    ...mapGetters(["getStateSpecList"])
  },
  mounted() {
    //触发菜单列表
    this.getCount();
  },
  methods: {
    //点击编辑按钮去修改父组件的数据
    update(id) {
      this.$emit("edit", {
        isAdd: false,
        dialogIsShow: true,
        id
      });
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
          getspecDelete({ id }).then(res => {
            if (res.data.code == 200) {
              //重新调取接口列表
              this.getCount();
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