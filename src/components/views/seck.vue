<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- 表格 -->
    <el-table
      :data="getStatesecksList"
      border
      style="width: 100%"
      row-key="id">
      <el-table-column prop="title" label="活动名称"></el-table-column>
      
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
    <!-- 弹窗 -->
    <el-dialog
      :title="isAdd ? '添加秒杀商品信息':'编辑秒杀商品信息'"
      :visible.sync="dialogIsShow"
      center
      :before-close="cancel">
      <el-form :model="seckInfo" :rules="rules" ref="seckInfo">
          <el-form-item label="活动名称：" :label-width="formLabelWidth" prop="title">
              <el-input v-model="seckInfo.title"></el-input>
          </el-form-item>
          <el-form-item label="活动期限" :label-width="formLabelWidth">
            <el-date-picker
                v-model="timeValue"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item
            label="一级分类："
            :label-width="formLabelWidth"
            placeholder="请选择一级分类"
            prop="first_cateid">
            <el-select v-model="seckInfo.first_cateid" placeholder="请选择" @change="cateChange">
                <el-option
                    v-for="item in cateArr"
                    :key="item.id"
                    :label="item.catename"
                    :value="item.id"
                >{{item.catename}}</el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            label="二级分类："
            :label-width="formLabelWidth"
            placeholder="请选择二级分类"
            prop="second_cateid">
            <el-select v-model="seckInfo.second_cateid" placeholder="请选择" @change='getGoodsname'>
                <el-option
                    v-for="item in secondArr"
                    :key="item.id"
                    :label="item.catename"
                    :value="item.id"
                >{{item.catename}}</el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商品：" :label-width="formLabelWidth">
          <el-select v-model="seckInfo.goodsid" placeholder="请选择">
            <el-option
              v-for="item in goods"
              :label="item.goodsname"
              :value="item.id"
              :key="item.id"
            >{{item.goodsname}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-radio v-model="seckInfo.status" label="1">启用</el-radio>
          <el-radio v-model="seckInfo.status" label="2">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="isAdd" type="primary" @click="subInfo('seckInfo')">新 增</el-button>
        <el-button v-else type="primary" @click="subInfo('seckInfo')">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入接口
import {
  getseckList,
  getseckAdd,
  getseckInfo,
  getseckEdit,
  getseckDelete,
  getgoodsList,
  getcateList,
} from "../../util/axios";
import breadCrumb from "@/components/common/breadCrumb";

import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      timeValue:[],//秒杀时间
      dialogImageUrl: "", //显示图片
      dialogVisible: false, //开启图片的弹框
      isAdd: true, //添加
      dialogIsShow: false, //是否出现弹框
      formLabelWidth: "100px", //label宽度
      seckInfo: {
        title:'',//活动名称
        begintime:'',//秒杀开始时间
        endtime:'',//秒杀结束时间
        first_cateid:'',//一级分类
        second_cateid:'',//二级分类
        goodsid:'',//商品
        status: "1"
      },
      imgUrl: "",
      editId: 0, //修改id
      cateArr:[],//商品一级分类
      secondArr:[],//商品二级分类
      firstId:0,//得到一级分类id
      goods:[],//商品
      rules: {
       title: [
          {
            required: true,
            message: "请填写活动名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    //加载时候调取商品分类列表
    this.getActionSeckList();
    //弹框加载的时候获取一级分类
    getcateList({pid:0}).then(res => {
        if(res.data.code == 200){
            this.cateArr = res.data.list
        }
    })
   
  },
  computed: {
    ...mapGetters(["getStatesecksList"])
  },
  methods: {
      //点击一级分类的时候，联动出二级分类
    cateChange(e){
        //e 选中一级时候返回分类编号
        //console.log(e)
         this.firstId = e;
        getcateList({pid:e}).then(res => {
        if(res.data.code == 200){
            this.secondArr = res.data.list
        }
    })
    },
    //点击二级分类的时候，联动出商品名称
    getGoodsname(e){
        getgoodsList({sid:e,fid:this.firstId}).then(res => {
            this.goods = res.data.list
        })

    },
    //商品分类列表
    ...mapActions(["getActionSeckList"]),
    reset() {
      this.timeValue=[],
      this.seckInfo = {
        title:'',//活动名称
        // begintime:'',//秒杀开始时间
        // endtime:'',//秒杀结束时间
        first_cateid:'',//一级分类
        second_cateid:'',//二级分类
        goodsid:'',//商品
        status: "1"
      };
    },
    add() {
      //出现弹框
      this.dialogIsShow = true;
      this.isAdd = true;
    },
    cancel() {
      this.reset();
      this.dialogIsShow = false;
    },
    del(id) {
      this.$confirm("你确定要删除这条数据吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除逻辑
          getseckDelete({ id }).then(res => {
            if (res.data.code == 200) {
              //重新调取接口列表
              this.getActionSeckList();
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
    },
    update(id) {
      this.dialogIsShow = true;
      this.isAdd = false;
      //给编辑id赋值
      this.editId = id;
      //调取分类查询一条数据
      getseckInfo({ id }).then(res => {
        if (res.data.code == 200) {
          //console.log(res);
          this.seckInfo = res.data.list;
          //对时间进行转化
          this.timeValue.push(new Date(parseInt(this.seckInfo.begintime))) ;
          this.timeValue.push(new Date(parseInt(this.seckInfo.endtime))) ;
          this.seckInfo.status = this.seckInfo.status.toString();
        }
      });
    },
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //根据isAdd状态去判断执行接口
          if (this.isAdd) {
              this.seckInfo.begintime = this.timeValue[0].getTime().toString();
              this.seckInfo.endtime = this.timeValue[1].getTime().toString();
            //调取添加接口
            getseckAdd(this.seckInfo).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //添加成功重新查询列表
                this.getActionSeckList();
                console.log('getActionSeckList')
                this.$message.success(res.data.msg);
              } else if (res.data.code == 500) {
                this.$message.warning(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
              this.seckInfo.id = this.editId;
             //处理时间 转时间戳
            this.seckInfo.begintime = this.timeValue[0].getTime().toString();
            this.seckInfo.endtime = this.timeValue[1].getTime().toString();
            //调取更新接口
            getseckEdit(this.seckInfo).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //添加成功重新查询列表
                this.getActionSeckList();
                this.$message.success(res.data.msg);
              } else if (res.data.code == 500) {
                this.$message.warning(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  components: {
    breadCrumb
  }
};
</script>

<style lang='stylus' scoped>
.el-breadcrumb {
  height: 25px;
}

.imgInfo {
  width: 150px;
  height: 150px;
}
</style>