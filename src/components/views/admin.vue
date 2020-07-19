<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- 表格 -->
    <el-table :data="getStateUserList" border style="width: 100%" row-key="id">
      <el-table-column prop="uid" label="用户编号"></el-table-column>
      <el-table-column prop="username" label="用户名称"></el-table-column>
      <el-table-column prop="roleid" label="所属角色"></el-table-column>
      <el-table-column prop="menus" label="状态">
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
    <el-pagination background layout="prev, pager, next" :total="4" :page-size='size'></el-pagination>
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
  getuserlogin
} from "../../util/axios";
import breadCrumb from "@/components/common/breadCrumb";
import {mapGetters,mapActions} from 'vuex'
export default {
  data() {
    return {
      isAdd: true, //添加
      dialogIsShow: false, //是否出现弹框
      size:2,
      formLabelWidth: "100px", //label宽度
      menuInfo: {
        roleid: "", //角色编号
        username: "", //用户名称
        password: "", //密码
        status: "1"
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
    this.getActionUserList();
  },
  computed: {
    ...mapGetters(["getStateRoleList",'getStateUserList'])
  },
  methods: {
    //获取管理员列表
    ...mapActions(['getActionUserList','getActionRoleList']),
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
         console.log(uid);
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
              this.getActionUserList();
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
                this.getActionUserList();
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
                this.getActionUserList();
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

<style lang="stylus" scoped>
.el-breadcrumb {
  height: 25px;
}
.el-pagination
    text-align right 
    margin-top 20px 
</style>