<template>
  <el-dialog
    :title="addInfo.isAdd ? '商品规格添加':'商品规格编辑'"
    :visible.sync="addInfo.dialogIsShow"
    center
    :before-close="cancel"
  >
    <el-form :model="specsInfo" :rules="rules" ref="specsInfo">
      <el-form-item label="规格名称：" :label-width="formLabelWidth" prop="specsname">
        <el-input v-model="specsInfo.specsname"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in specsArr"
        label="规格属性:"
        :key="item.value"
        :label-width="formLabelWidth"
      >
        <el-input style="width:70%" v-model="item.value"></el-input>
        <el-button v-if="index==0" type="primary" @click="addSpecs">新增规格</el-button>
        <el-button v-else type="primary" @click="removeSpecs(item)">删除</el-button>
      </el-form-item>
      <el-form-item label="状态：" :label-width="formLabelWidth">
        <el-radio v-model="specsInfo.status" label="1">启用</el-radio>
        <el-radio v-model="specsInfo.status" label="2">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="addInfo.isAdd" type="primary" @click="subInfo('specsInfo')">新 增</el-button>
      <el-button v-else type="primary" @click="subInfo('specsInfo')">更 新</el-button>
    </div>
  </el-dialog>
</template>

<script>
//引入菜单接口
import { getspecAdd, getspecInfo, getspecEdit } from "../../util/axios";
//调取辅助性函数
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["addInfo",'getCount'],
  data() {
    return {
      //动态的表单域
      specsArr: [
        {
           value: ''
        }
      ],
      editId: 0,
      formLabelWidth: "100px", //label宽度
      specsInfo: {
        specsname: "", //商品规格名称
        attrs: "", //商品规格属性值
        status: "1"
      },
      rules: {
        specsname: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    //计算属性
    ...mapGetters(["getStateSpecList"])
  },
  methods: {
    ...mapActions(["getActionSpecsList"]),
    //添加表单
    addSpecs() {
      //根据产品需求对添加规格属性进行限制,最多添加6个规格
      if (this.specsArr.length <= 6) {
        //在规格属性数组中添加对象
        this.specsArr.push({
          value: "",
          key: Date.now()
        });
      } else {
        this.$message.warning("最多添加6个规格，不能再多了呦");
      }
    },
    //移除属性
    removeSpecs(item) {
      var index = this.specsArr.indexOf(item);
      if (index !== -1) {
        this.specsArr.splice(index, 1);
      }
    },
    //关闭弹框事件
    cancel() {
      this.reset();
      //子传父，触发一个方法,传参数
      this.$emit("cancel", false);
    },
    //重置输入内容
    reset() {
      this.specsInfo = {
        specsname: "", //商品规格名称
        attrs: '', //商品规格属性值
        status: "1"
      };
    },
    //点击编辑按钮出现弹框并携带数据
    update(id) {
        //给编辑id赋值
        this.editId = id
        //调取商品规格查询一条数据
        getspecInfo({ id }).then(res => {
            if (res.data.code == 200) {
                this.specsInfo = res.data.list[0]
                // console.log(this.specsInfo, '信息')
                //对数据类型进行转化
                //映射属性 取出每一个item 并赋值给 specsArr对象中的value
                this.specsInfo.attrs.map((item, i) => {
                    if (i == 0) {
                        this.specsArr[0].value =item
                    } else {
                        this.specsArr.push({
                            value: item
                        })
                    }
                })
                this.specsInfo.status = this.specsInfo.status.toString()
            }
        })
    },
  //确定添加或者更新事件
    subInfo(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
                //对提交数据进行转化 '红色，奶奶灰，白色。。'
                let data = this.specsInfo
                //对规格属性数组进行映射 映射成一个新数组 新数组有你的value
                let arr = this.specsArr.map(item => {
                    return item.value
                })
                data.attrs = arr ? arr.join(',') : ''
                //根据isAdd状态去判断执行接口
                if (this.addInfo.isAdd) {
                    //调取添加接口
                    getspecAdd(this.specsInfo).then(res => {
                        if (res.data.code == 200) {
                            //关闭弹框
                            //清空输入框
                            this.cancel();
                            //添加成功重新查询列表
                            this.getCount()
                            this.$message.success(res.data.msg)
                        } else if (res.data.code == 500) {
                            this.$message.warning(res.data.msg)
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    let data = this.specsInfo
                    data.id = this.editId
                    //调取更新接口
                    getspecEdit(data).then(res => {
                        if (res.data.code == 200) {
                            //关闭弹框
                            //清空输入框
                            this.cancel();
                            //添加成功重新查询列表
                            this.getCount()
                            this.$message.success(res.data.msg)
                        } else if (res.data.code == 500) {
                            this.$message.warning(res.data.msg)
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            } else {
                console.log('error submit!!')
                return false
            }
        })
    }

  }
};
</script>

<style>
</style>