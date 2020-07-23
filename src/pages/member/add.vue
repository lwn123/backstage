<template>
 <el-dialog
      title="编辑信息"
      :visible.sync="dialogIsShow"
      center
      :before-close="cancel"
    >
      <el-form :model="memberInfo" :rules="rules" ref="memberInfo">
       
        <el-form-item label="手机号：" :label-width="formLabelWidth" prop="phone">
        <el-input v-model="memberInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称：" :label-width="formLabelWidth" prop="nickname" >
        <el-input v-model="memberInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth"  >
        <el-input v-model="memberInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-radio v-model="memberInfo.status" label="1">启用</el-radio>
          <el-radio v-model="memberInfo.status" label="2">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subInfo('memberInfo')">更 新</el-button>
      </div>
    </el-dialog>
</template>

<script>
//引入菜单接口
import {
  getmemberList,
  getmemberInfo,
  getmemberEdit
} from "../../util/axios";
//调取辅助性函数
import { mapActions, mapGetters } from "vuex";
export default {
  props:['dialogIsShow'],
  data() {
    return {
      editId: 0,
      formLabelWidth: "100px", //label宽度
      memberInfo: {
       phone:'',//手机号
       nickname:'',//昵称
       password:'',//密码
       status:'1',//注册状态
      },
      rules: {
        phone: [
          {
            required: true,
            message: "请输入手机号名称",
            trigger: "blur"
          },
          {
            type:'number',
            min:11,
            max:11,
            message: "手机号输入格式错误",
            trigger: "blur"
          }
        ],
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    //计算属性
    ...mapGetters(['getStatemembersList'])
  },
  methods:{
      ...mapActions(['getActionMemberList']),
    //关闭弹框事件
    cancel() {
      this.reset();
      //子传父，触发一个方法,传参数
      this.$emit('cancel',false);
    },
    //重置输入内容
    reset() {
      this.memberInfo = {
      id:'',//用户编号
       phone:'',//手机号
       nickname:'',//昵称
       password:'',//密码
       status:'1',//注册状态
      };
    },
     //点击编辑按钮出现弹框并携带数据
    update(id) {
      //给编辑id赋值
      this.editId = id;
      //调取菜单查询一条数据
      getmemberInfo({ id }).then(res => {
        if (res.data.code == 200) {
          //console.log(res);
          this.memberInfo = res.data.list;
          this.memberInfo.type = this.memberInfo.type.toString();
          this.memberInfo.status = this.memberInfo.status.toString();
        }
      });
    },
     //编辑事件
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            let data = this.memberInfo;
            data.id = this.editId;
            data.password = data.password ? data.password: this.memberInfo.password;
            //调取更新接口
            getmemberEdit(data).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                //清空输入框
                this.cancel();
                //重新调取接口列表
                this.getActionMemberList();
                this.$message.success(res.data.msg);
              } else if (res.data.code == 500) {
                this.$message.warning(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            });
         
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }


  },
};
</script>

<style>
</style>