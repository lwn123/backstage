<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- 表格 -->
    <el-table :data="getStateClassifyList" border style="width: 100%" row-key="id">
      <el-table-column prop="uid" label="分类编号"></el-table-column>
      <el-table-column prop="username" label="分类名称"></el-table-column>
      <el-table-column prop="roleid" label="图片"></el-table-column>
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
    <!-- 弹窗 -->
    <el-dialog
      :title="isAdd ? '添加商品分类':'编辑信息'"
      :visible.sync="dialogIsShow"
      center
      :before-close="cancel"
    >
      <el-form :model="menuInfo" :rules="rules" ref="menuInfo">
        <el-form-item label="上级分类：" :label-width="formLabelWidth" prop="roleid">
          <el-select v-model="menuInfo.roleid" placeholder="请选择">
            <el-option
              :label="item.rolename"
              :value="item.id"
              v-for="item in getStateRoleList"
              :key="item.id"
            >{{item.rolename}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称：" :label-width="formLabelWidth" prop="username">
          <el-input v-model="menuInfo.username"></el-input>
        </el-form-item>

        
        <el-form-item label="图片：" :label-width="formLabelWidth" >
          <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
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
import breadCrumb from "@/components/common/breadCrumb";
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      getStateClassifyList: [],
      getStateRoleList: [],
      isAdd: true, //添加
      dialogIsShow: false, //是否出现弹框
      formLabelWidth: "100px", //label宽度
      menuInfo: {
        roleid: "", //角色编号
        username: "", //用户名称
        password: "", //密码
        status: "1"
      },
      rules: {
        roleid: [
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
  methods: {
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    add() {
      //出现弹框
      this.dialogIsShow = true;
      this.isAdd = true;
    },
    cancel() {
      this.dialogIsShow = false;

    },
    del() {},
    update() {},
    subInfo() {}
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