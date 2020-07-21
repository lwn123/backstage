<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- //表格 -->
    <spec-List @edit="edit" :getCount="getCount"></spec-List>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageInfo.size"
      :total="count"
      @current-change="getPage"
    ></el-pagination>
    <!-- 弹框内容 -->
    <spec-Add :addInfo="addInfo" @cancel="cancel" ref="vadd" :getCount="getCount"></spec-Add>
  </div>
</template>

<script>
//引入子组件
import specList from "./list";
import specAdd from "./add";
import breadCrumb from "@/components/common/breadCrumb";
//接口
import { getspecCount } from "../../util/axios";
import { mapActions,mapGetters } from "vuex";
export default {
  data() {
    return {
      addInfo: {
        dialogIsShow: false, //是否出现弹框
        isAdd: true //添加
      },
      count: 0, //总条目
      //分页数据
      pageInfo: {
        size: 2, //代表一个页面查询2条数据
        page: 1 //一共有多少页面
      }
    };
  },
  mounted() {
    this.getCount();
  },
  computed:{
   ...mapGetters(['getStateSpecList'])
  },
  methods: {
    ...mapActions(["getActionSpecsList"]),
    //点击添加按钮出现弹框
    add() {
      //console.log("出现弹框");
      //出现弹框
      this.addInfo = {
        dialogIsShow: true, //出现弹框
        isAdd: true //添加事件
      };
    },
    //子传父去修改父级的数据
    cancel(e) {
      //add子组件传过来的值
      this.addInfo.dialogIsShow = e;
    },
    //list子组件传值并修改数据
    edit(obj) {
      //obj传过来的对象
      this.addInfo.isAdd = obj.isAdd;
      this.addInfo.dialogIsShow = obj.dialogIsShow;
      //通过 ref属性拿到add子组件  上的update方法
      this.$refs.vadd.update(obj.id);
    },
    //封装获取总条目接口
    getCount() {
      //调取总条数接口
      getspecCount().then(res => {
        if (res.data.code == 200) {
          this.count = res.data.list[0].total;
          //如果当前不是第一页并且只有一条数据，我就让页面数量--
          if (this.pageInfo.page != 1 && this.getStateSpecList.length == 1) {
            this.pageInfo.page--;
          }
          //调取获取商品规格接口列表的行动
          this.$store.dispatch("getActionSpecsList", this.pageInfo);
        }
      });
    },
    //当页面发生变化的时候触发该方法
    getPage(n) {
      //n是当前页
      this.pageInfo.page = n;
      //重新调取列表页面
      this.$store.dispatch("getActionSpecsList", this.pageInfo);
    }
  },
  components: {
    breadCrumb,
    specList,
    specAdd
  }
};
</script>

<style lang='stylus' scoped>
.el-breadcrumb {
  height: 25px;
}

.el-pagination {
  float: right;
  margin: 16px 0;
}
</style>