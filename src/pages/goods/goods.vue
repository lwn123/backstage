<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- //表格 -->
    <v-List @edit='edit' :getCount='getCount'></v-List>
    <!-- 分页器 -->
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageInfo.size"
        :total="count"
        @current-change="getPage"></el-pagination>
    <!-- 弹框内容 -->
   <v-Add :addInfo='addInfo' @cancel='cancel' ref="vadd" :getCount='getCount'></v-Add>
  </div>
</template>

<script>
//引入子组件
import vList from './list';
import vAdd from './add';
import breadCrumb from "@/components/common/breadCrumb";
import {getgoodsCount} from '../../util/axios';
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      addInfo:{
        dialogIsShow: false, //是否出现弹框
        isAdd: true, //添加
      },
      count: 0, //总条目
      pageInfo: {
        //分页数据
        size: 2, //代表一个页面查询2条数据
        page: 1 //一共有多少页面
      }
    };
  },
  mounted(){
    this.getCount()
  },
  computed:{
      ...mapGetters(['getStateGoodsList'])
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
    },
    getCount() {
            //调取总条数接口
            getgoodsCount().then(res => {
                if (res.data.code == 200) {
                    this.count = res.data.list[0].total
                  
                    //如果当前不是第一页并且只有一条数据，我就让页面数量--
                    if (
                        this.pageInfo.page != 1 &&
                        this.getStateGoodsList.length == 1
                    ) {
                        this.pageInfo.page--
                    }
                    //调取获取商品规格接口列表的行动
                    this.$store.dispatch('getActionGoodsList',this.pageInfo)
                }
            })
        },
        //当页面发生变化的时候触发该方法
        getPage(n) {
            //n是当前页
            this.pageInfo.page = n
            //重新调取列表页面
            this.$store.dispatch('getActionGoodsList', this.pageInfo)
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
.el-pagination {
    float: right;
    margin: 16px 0;
}

</style>