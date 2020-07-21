<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- //表格 -->
    <v-List @edit='edit'></v-List>
    <!-- 弹框内容 -->
   <v-Add :addInfo='addInfo' @cancel='cancel' ref="vadd"></v-Add>
  </div>
</template>

<script>
//引入子组件
import vList from './list';
import vAdd from './add';
import breadCrumb from "@/components/common/breadCrumb";

export default {
  data() {
    return {
      addInfo:{
        dialogIsShow: false, //是否出现弹框
        isAdd: true, //添加

      }
    };
  },
  methods: {
    //点击添加按钮出现弹框
    add() {
      //console.log("出现弹框");
      //出现弹框
      this.addInfo={
        dialogIsShow: true, //出现弹框
        isAdd: true, //添加事件
      }
    },
    //子传父去修改父级的数据
    cancel(e){
      //add子组件传过来的值
      this.addInfo.dialogIsShow = e; 
    },
    //list子组件传值并修改数据
    edit(obj){
      //obj传过来的对象
      this.addInfo.isAdd = obj.isAdd;
      this.addInfo.dialogIsShow = obj.dialogIsShow;
      //通过 ref属性拿到add子组件  上的update方法
      this.$refs.vadd.update(obj.id);
    }
    
    
   
  },
  components: {
    breadCrumb,
    vList,
    vAdd
  }
};
</script>

<style lang='stylus' scoped>
.el-breadcrumb {
  height: 25px;
}
</style>