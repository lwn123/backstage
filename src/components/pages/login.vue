<template>
  <div class="wrap">
    <h1 class="title">欢迎登陆</h1>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" clearable show-password></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
//获取登录接口
import {getuserlogin} from "../../util/axios";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 1 到 16 个字符", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      //console.log(this.ruleForm,'表单对象');
      this.$refs[formName].validate(valid => {
        //validate 它的验证是基于什么都不填直接登录的一个验证
        if (valid) {
          getuserlogin(this.ruleForm).then(res => {
            //console.log(res,'接口返回信息');
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //把登录信息存储到本地存储中
                sessionStorage.setItem('userInfo',JSON.stringify(res.data.list))
              //登录成功之后就要跳转到index
              this.$router.push("/index");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../stylus/index.styl';

.wrap {
  position: relative;
  background: $bgColorOne;
  width: 100vw;
  height: 100vh;

  .title {
    font-size: 40px;
    line-height: 200px;
    font-weight: bold;
    text-align: center;
    color: #008B8B;
  }

  .demo-ruleForm {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 500px;
    height: 200px;
    padding: 30px 20px 0px;
    background-color: $bgColorTwo;
    border-radius: 30px;

    .el-input {
      width: 350px;
    }
  }
}
</style>