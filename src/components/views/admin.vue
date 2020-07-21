<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- 表格 -->
    <el-table :data="getStateUserList" border style="width: 100%" row-key="id">
      <el-table-column prop="uid" label="用户编号"></el-table-column>
      <el-table-column prop="username" label="用户名称"></el-table-column>
      <el-table-column prop="rolename" label="所属角色"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <el-tag v-if="item.row.status==1" type="success">启动</el-tag>
          <el-tag v-if="item.row.status==2" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="item1">
          <el-button type="primary" size="small" @click="update(item1.row.uid)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(item1.row.uid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
            分页器 
            background 是否为分页按钮添加背景色
            layout  组件布局，子组件名用逗号分隔
            total 总条目数
            page-size 每页显示条目个数，支持 .sync 修饰符
            currentPage 改变时会触发 当前页
        -->
    <el-pagination background layout="prev, pager, next" :total="count" :page-size='pageInfo.size' @current-change="getPage"></el-pagination>
    <!-- 弹窗 -->
    <el-dialog
      :title="isAdd ? '添加管理员':'编辑信息'"
      :visible.sync="dialogIsShow"
      center
      :before-close="cancel"
    >
      <el-form :model="menuInfo" :rules="rules" ref="menuInfo">
        <el-form-item label="所属角色：" :label-width="formLabelWidth" prop="roleid">
          <el-select v-model="menuInfo.roleid" placeholder="请选择">
            <el-option :label="item.rolename" :value="item.id" v-for='item in getStateRoleList' :key='item.id'>{{item.rolename}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名称：" :label-width="formLabelWidth" prop="username">
        <el-input v-model="menuInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth" >
        <el-input v-model="menuInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-radio v-model="menuInfo.status" label="1">启用</el-radio>
          <el-radio v-model="menuInfo.status" label="2">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="isAdd" type="primary" @click="subInfo('menuInfo')">新 增</el-button>
        <el-button v-else type="primary" @click="subInfo('menuInfo')">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入管理员接口
import {
  getuserlist,
  getuserinfo,
  getuserAdd,
  getusercount,
  getuseredit,
  getuserdelete,
} from "../../util/axios";
import breadCrumb from "@/components/common/breadCrumb";
import {mapGetters,mapActions} from 'vuex'
export default {
  data() {
    return {
      count:0,//总条目
      isAdd: true, //添加
      dialogIsShow: false, //是否出现弹框
      formLabelWidth: "100px", //label宽度
      menuInfo: {
        roleid: '', //角色编号
        username: '', //用户名称
        password: '', //密码
        status: '1'
      },
      //分页数据
      pageInfo:{
        size:2,
        page:1
      },
      editUid: 0,
      rules: {
        roleid:[
          {
            required: true,
            message: "请选择所属角色名称",
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 30,
            message: "长度在 2 到 30 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    //触发才调取vuex中的菜单列表
    this.getActionRoleList();
    this.getCount();
  },
  computed: {
    ...mapGetters(["getStateRoleList",'getStateUserList'])
  },
  methods: {
    //获取管理员列表
    ...mapActions(['getActionRoleList']),
    reset(){
      this.menuInfo = {
        roleid: "", //角色编号
        username: "", //用户名称
        password: "", //密码
        status: "1"
      }
    },
    add() {
      //出现弹框
      this.dialogIsShow = true;
      this.isAdd = true;
    },
    cancel(){
       this.reset();
       this.dialogIsShow = false;
    },
    //删除事件
    del(uid) {
      //console.log(uid);
      this.$confirm("你确定要删除这条数据吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then((res) => {
          //调取删除逻辑
          getuserdelete({ uid }).then(res => {
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
    },
    update(uid){
      this.dialogIsShow = true;
      this.isAdd = false;
      this.editUid = uid;
      //调取菜单查询一条数据
      getuserinfo({ uid }).then(res => {
        if (res.data.code == 200) {
          //console.log(res);
          this.menuInfo = res.data.list;

          this.menuInfo.status = this.menuInfo.status.toString();
        }
      });


    },
    subInfo(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          //根据isAdd状态去判断执行接口
          if (this.isAdd) {
            //调取添加接口
            getuserAdd(this.menuInfo).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //重新调取接口列表
                this.getCount();
                this.$message.success(res.data.msg);
              } else if (res.data.code == 500) {
                this.$message.warning(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            let data = this.menuInfo;
            data.uid = this.editUid;
            console.log(data);
            //调取更新接口
            getuseredit(data).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //重新调取接口列表
                this.getCount();
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

    },
    //获取总条目窗口
    getCount(){
      getusercount().then(res => {
        if(res.data.code ==200){
          this.count = res.data.list[0].total;
         //如果当前不是第一页并且只有一条数据，我就让页面数量--
          if(this.pageInfo.page !=1 && this.getStateUserList.length==1){
              this.pageInfo.page--;
          }
          //获取用户接口列表的行动
          this.$store.dispatch('getActionUserList',this.pageInfo)
        }
        //console.log(this.count,'count');
      })
    },
    //当页面发生变化时候，触发
    getPage(n){ //elementui中的currter-page 回调
      //n是当前页
        this.pageInfo.page = n ;
      //重新调取列表页
      this.$store.dispatch('getActionUserList',this.pageInfo)
    }
  },
  
  
  components: {
    breadCrumb
  }
};
</script>

<style lang="stylus" scoped>
.el-breadcrumb {
  height: 25px;
}
.el-pagination
    text-align right 
    margin-top 20px 
</style>