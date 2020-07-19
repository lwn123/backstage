<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- //表格 -->
    <el-table
      :data="getStateMenuList"
      border
      style="width: 100%"
      row-key="id"
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="菜单编号"></el-table-column>
      <el-table-column prop="title" label="菜单名称"></el-table-column>
      <el-table-column prop="pid" label="上级菜单"></el-table-column>
      <el-table-column prop="icon" label="菜单图标"></el-table-column>
      <el-table-column prop="url" label="菜单地址"></el-table-column>
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

    <!-- <Dialog
      :isAdd="isAdd"
      :dialogFormShow="dialogFormShow"
      :getMenuList="getMenuList"
      :menuInfo='menuInfo'
      :editId='editId'
      @fromFather="fromFather"
      @getMenu='getMenu'
    ></Dialog>-->
    <!-- 弹框内容 -->
    <el-dialog
      :title="isAdd ? '菜单添加':'菜单编辑'"
      :visible.sync="dialogIsShow"
      center
      :before-close="cancel"
    >
      <el-form :model="menuInfo" :rules="rules" ref="menuInfo">
        <el-form-item label="菜单名称：" :label-width="formLabelWidth" prop="title">
          <el-input v-model="menuInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：" :label-width="formLabelWidth" prop="pid">
          <el-select v-model="menuInfo.pid" placeholder="请选择">
            <el-option label="顶级菜单" :value="0">顶级菜单</el-option>
            <el-option v-for='item in getStateMenuList' :key='item.id' :label="item.title" :value="item.id">{{item.title}}</el-option>
            
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型：" :label-width="formLabelWidth" prop="type">
          <el-radio :disabled='menuInfo.pid != 0' v-model="menuInfo.type" :label="menuInfo.type">目录</el-radio>
          <el-radio :disabled='menuInfo.pid == 0' v-model="menuInfo.type" :label="menuInfo.type">菜单</el-radio>
        </el-form-item>
        <el-form-item v-if='menuInfo.pid == 0' label="菜单图标：" :label-width="formLabelWidth">
          <el-input v-model="menuInfo.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址：" :label-width="formLabelWidth"  v-if='menuInfo.pid != 0'>
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
  </div>
</template>

<script>
//引入菜单接口
import {
  getMenuList,
  getMenuAdd,
  getMenuDelete,
  getMenuInfo,
  getMenuEdit
} from "../../../util/axios";
//调取辅助性函数
import { mapActions, mapGetters } from "vuex";

import breadCrumb from "@/components/common/breadCrumb";
//import Dialog from "@/components/views/menu/dialog";
export default {
  data() {
    return {
      isAdd: true, //添加
      formLabelWidth: "100px", //label宽度
      menuInfo: {
        pid: 0, //上级分类编号
        title: "", //菜单名称
        icon: "", //图标
        url: "", //菜单地址
        type: "1", //类型1目录2菜单
        status: "1"
      },
      editId: 0,
      dialogIsShow: false, //是否出现弹框
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
    //触发才调取vuex中的菜单列表
    this.getActionMenuList();
  },
  computed:{
    ...mapGetters(['getStateMenuList'])
  },
  methods: {
    //封装一个获取菜单列表事件
    ...mapActions(["getActionMenuList"]),
    //关闭弹框事件
    cancel() {
      this.reset();
      this.dialogIsShow = false;
    },
    //重置输入内容
    reset() {
      this.menuInfo = {
        pid: 0, //上级分类编号
        title: "", //菜单名称
        icon: "", //图标
        url: "", //菜单地址
        type: "1", //类型1目录2菜单
        status: "1" //1是启用 2是禁用
      };
    },
    //封装一个获取菜单列表事件
    getMenuList() {
      getMenuList({istree: 1})
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
          }
          //console.log(res, '响应')
        })
        .catch(err => {
          console.log(err, "错误拦截");
        });
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
      getMenuInfo({ id }).then(res => {
        if (res.data.code == 200) {
          //console.log(res);
          this.menuInfo = res.data.list;
          this.menuInfo.type = this.menuInfo.type.toString();
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
          getMenuDelete({ id }).then(res => {
            if (res.data.code == 200) {
              //重新调取接口列表
              this.getActionMenuList();
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
            getMenuAdd(this.menuInfo).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //重新调取接口列表
                this.getActionMenuList();
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
            getMenuEdit(data).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //重新调取接口列表
                this.getActionMenuList();
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
</style>