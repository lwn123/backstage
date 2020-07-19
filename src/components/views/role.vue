<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>

    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- 表格 -->
    <el-table
      :data="getStateRoleList"
      border
      style="width: 100%"
      row-key="id"
    >
      <el-table-column prop="id" label="角色编号"></el-table-column>
      <el-table-column prop="rolename" label="角色名称"></el-table-column>
      <el-table-column prop="menus" label="状态">
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
    <!-- 弹框内容 -->
    <el-dialog
      :title="isAdd ? '角色添加':'角色编辑'"
      :visible.sync="dialogIsShow"
      center
      :before-close="cancel"
    >
      <el-form :model="menuInfo" :rules="rules" ref="menuInfo">
        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="rolename">
          <el-input v-model="menuInfo.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色权限：" :label-width="formLabelWidth" prop="rolename">
          <el-tree
            :data="getStateMenuList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            :props="defaultProps"
            :default-checked-keys="defaultKey"
          ></el-tree>
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
//引入角色接口
import {
  getroleList,
  getroleAdd,
  getroleDelete,
  getroleInfo,
  getroleEdit
} from "../../util/axios";
import breadCrumb from "@/components/common/breadCrumb";
//调取辅助性函数
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      defaultKey:[],//默认tree节点选中
      isAdd: true, //添加
      formLabelWidth: "100px", //label宽度
      menuInfo: {
        rolename: "", //角色名称
        menus: "", //角色权限
        status: "1"
      },
      editId: 0,
      dialogIsShow: false, //是否出现弹框
      rules: {
        rolename: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 6,
            message: "长度在 2 到 6 个字符",
            trigger: "blur"
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    };
  },
  mounted() {
    //触发才调取vuex中的菜单列表
    this.getActionRoleList();
  },
  computed: {
    ...mapGetters(["getStateRoleList","getStateMenuList"])
  },
  methods: {
    //封装一个获取菜单列表事件
    ...mapActions(["getActionRoleList"]),
    //关闭弹框事件
    cancel() {
      this.reset();
      this.dialogIsShow = false;
    },
    //重置输入内容
    reset() {
      this.menuInfo = {
        rolename: "", //角色名称(初级管理员超级管理员)
        menus: "", //角色权限
        status: "1"
      };
    },
    
    //点击添加按钮出现弹框
    add() {
      //console.log("出现弹框");
      //出现弹框
      this.dialogIsShow = true;
      this.isAdd = true;
    },
    //点击编辑按钮出现弹框并携带数据
    update(id) {
      this.dialogIsShow = true;
      this.isAdd = false;
      //给编辑id赋值
      this.editId = id;
      //调取菜单查询一条数据
      getroleInfo({ id }).then(res => {
        if (res.data.code == 200) {
          //console.log(res);
          this.menuInfo = res.data.list;

          this.menuInfo.status = this.menuInfo.status.toString();
        }
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
          getroleDelete({ id }).then(res => {
            if (res.data.code == 200) {
              //重新调取接口列表
              this.getActionRoleList();
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
    //确定添加或者更新事件
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //根据isAdd状态去判断执行接口
          if (this.isAdd) {
            //调取添加接口
            getroleAdd(this.menuInfo).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //重新调取接口列表
                this.getActionRoleList();
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
            getroleEdit(data).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //重新调取接口列表
                this.getActionRoleList();
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

<style lang='stylus' scoped></style>