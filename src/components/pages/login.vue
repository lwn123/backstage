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
      <el-form-item label="用户名" prop="name">
        <el-input v-model="ruleForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" clearable show-password></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
         ruleForm: {
          name: '',
          pass:'',
          
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          pass:[
              {
                 required: true, message: '请输入密码', trigger: 'blur' 
              }
          ]
        }
    };
  },
   methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            //validate 它的验证是基于什么都不填直接登录的一个验证
          if (valid) {
              //不为空的时候进入
             if(this.ruleForm.name=='admin' && this.ruleForm.pass=='123456'){
                  this.$message.success('登录成功');
                  //登录成功之后就要跳转到index
                  this.$router.push('/index')
              }else{
                   this.$message.error('用户名或者密码错误');
                  }
          } else {
            console.log('error submit!!');
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
@import '../../stylus/index.styl'
.wrap
    position relative
    background $bgColorOne
    width 100vw
    height 100vh
    .title
        font-size 40px
        line-height 200px
        font-weight bold
        text-align center
        color #008B8B
    .demo-ruleForm
        position absolute
        left 0
        right 0
        bottom 0
        top 0
        margin auto
        width 500px
        height 200px
        padding 30px 20px 0px
        background-color $bgColorTwo
        border-radius 30px
        .el-input
            width 350px
</style>