<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- 表格 -->
    <el-table :data="getStateClassifyList" border style="width: 100%" row-key="id">
      <el-table-column prop="uid" label="规格编号"></el-table-column>
      <el-table-column prop="username" label="规格名称"></el-table-column>
      <el-table-column prop="roleid" label="规格属性">
        <!--  -->
      </el-table-column>
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
    <!-- <el-dialog
      :title="isAdd ? '添加商品规格':'编辑信息'"
      :visible.sync="dialogIsShow"
      center
      :before-close="cancel"
    >
<el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
  <el-form-item
    prop="email"
    label="规格名称"
  >
    <el-input v-model="dynamicValidateForm.email"></el-input>
  </el-form-item>
  <el-form-item
    v-for="(domain, index) in dynamicValidateForm.domains"
    :label="'规格属性' + index"
    :key="domain.key"
    :prop="'domains.' + index + '.value'"
   
  >
    <el-input v-model="domain.value"></el-input>
    <el-button @click="addDomain">新增规格属性</el-button>
  </el-form-item>
  <el-form-item
    v-for="(domain, index) in dynamicValidateForm.domains"
    :label="'规格属性' + index"
    :key="domain.key"
    :prop="'domains.' + index + '.value'"
   
  >
    <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    
    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item>
</el-form>

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
    </el-dialog> -->
  </div>
</template>

<script>
import breadCrumb from "@/components/common/breadCrumb";
export default {
  data() {
    return {
       dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        },
      dialogImageUrl: "",
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
     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
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