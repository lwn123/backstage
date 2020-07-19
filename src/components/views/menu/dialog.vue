<template>
  <!-- 弹框 -->
  <el-dialog
    :title="isAdd ? '菜单添加':'菜单编辑'"
    :visible.sync="dialogFormShow"
    center
    :before-close="cancel"
  >
    <el-form :model="menuInfo" ref="menuInfo" :rules="rules">
      <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="title">
        <el-input v-model="menuInfo.title"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单：" :label-width="formLabelWidth" prop="pid">
        <el-select v-model="menuInfo.pid" placeholder="请选择">
          <el-option label="顶级菜单" :value="0">顶级菜单</el-option>
          <el-option label="系统管理" :value="1">系统管理</el-option>
          <el-option label="商城管理" :value="2">商城管理</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单类型：" :label-width="formLabelWidth">
        <el-radio v-model="menuInfo.type" label="1">目录</el-radio>
        <el-radio v-model="menuInfo.type" label="2">菜单</el-radio>
      </el-form-item>
      <el-form-item v-if='menuInfo.type==1' label="菜单图标" :label-width="formLabelWidth">
        <el-input v-model="menuInfo.icon"></el-input>
      </el-form-item>
      <el-form-item v-if='menuInfo.type==2' label="菜单地址" :label-width="formLabelWidth">
        <el-input v-model="menuInfo.url"></el-input>
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
</template>

<script>
import {getMenuAdd,getMenudit} from '../../../util/axios'
export default {
  data() {
    return {
      formLabelWidth: "100px",
      isShow:false,
      menuIn: {
        pid: 0, //上级分类编号
        title: "", //菜单名称
        icon: "", //图标
        url: "", //菜单地址
        type: "1", //类型1目录2菜单
        status: "1"
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 6,
            message: "长度在 2 到 6 个字符",
            trigger: "blur"
          }
        ],
        pid: [
          {
            required: true,
            message: "请选择菜单",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    
  },
  props: ["isAdd", "dialogFormShow", "getMenuList",'menuInfo','editId'],
  methods: {
    cancel() {
      this.reset();
      this.isShow = false;
      this.$emit('fromFather',this.isShow);

    },
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //根据isAdd状态去判断执行接口
          if (this.isAdd) {
            //调取添加接口
            getMenuAdd(this.menuInfo).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.isShow = false;
                this.$emit('fromFather',this.isShow);
                //清空输入框
                this.reset();
                //添加成功重新查询列表
                this.getMenuList();
                this.$message.success(res.data.msg);
              } else if (res.data.code == 500) {
                this.$message.warning(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            let data = this.menuInfo;
            data.id = this.editId;
            //调取更新接口
           getMenudit(data).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.isShow = false;
                this.$emit('fromFather',this.isShow);
                //清空输入框
                this.reset();
                //添加成功重新查询列表
                this.getMenuList();
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
    //重置输入内容
    reset() {
      this.menuIn = {
        pid: 0, //上级分类编号
        title: "", //菜单名称
        icon: "", //图标
        url: "", //菜单地址
        type: "1", //类型1目录2菜单
        status: "1" //1是启用 2是禁用
      };
      this.$emit('getMenu',this.menuIn);
    }
  }
};
</script>

<style lang='stylus' scoped>
.el-dialog
    height 400px
    width 300px
    .el-input
      width 300px 
  

</style>