<template>
  <div>
    <!-- 面包屑 -->
    <bread-Crumb></bread-Crumb>
    <el-button type="primary" size="small" @click="add">添加</el-button>
    <!-- 表格 -->
    <el-table
      :data="getStateCateList"
      border
      style="width: 100%"
      row-key="id"
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="分类编号"></el-table-column>
      <el-table-column prop="catename" label="分类名称"></el-table-column>
      <el-table-column prop="img" label="图片">
        <template slot-scope="item2">
          <img :src="'http://localhost:3000/'+item2.row.img" alt class="imgInfo" />
        </template>
      </el-table-column>
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
    <!-- 弹窗 -->
    <el-dialog
      :title="isAdd ? '添加商品分类':'编辑信息'"
      :visible.sync="dialogIsShow"
      center
      :before-close="cancel"
    >
      <el-form :model="cateInfo" :rules="rules" ref="cateInfo">
        <el-form-item label="上级分类：" :label-width="formLabelWidth" prop="pid">
          <el-select v-model="cateInfo.pid" placeholder="请选择">
            <el-option label="顶级分类" :value="0">顶级分类</el-option>
            <el-option
              v-for="item in getStateCateList"
              :label="item.catename"
              :value="item.id"
              :key="item.id"
            >{{item.catename}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称：" :label-width="formLabelWidth" prop="catename">
          <el-input v-model="cateInfo.catename"></el-input>
        </el-form-item>

        <!-- 
            上传图片
            auto-upload	是否在选取文件后立即进行上传
            action	必选参数，上传的地址
            file-list 上传的文件列表
        -->
        <el-form-item label="图片：" :label-width="formLabelWidth">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="fileList"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="changeInfo"
            :limit='1'
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>

        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-radio v-model="cateInfo.status" label="1">启用</el-radio>
          <el-radio v-model="cateInfo.status" label="2">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="isAdd" type="primary" @click="subInfo('cateInfo')">新 增</el-button>
        <el-button v-else type="primary" @click="subInfo('cateInfo')">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入接口
import {
  getcateList,
  getcateAdd,
  getcateInfo,
  getcateEdit,
  getcateDelete
} from "../../util/axios";
import breadCrumb from "@/components/common/breadCrumb";

import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      fileList: [], //文件上传列表
      dialogImageUrl: "", //显示图片
      dialogVisible: false, //开启图片的弹框
      isAdd: true, //添加
      dialogIsShow: false, //是否出现弹框
      formLabelWidth: "100px", //label宽度
      cateInfo: {
        pid: 0, //上级分类编号
        catename: "", //分类名称
        img: "", //图片
        status: "1"
      },
      imgUrl: "",
      editId: 0, //修改id
      rules: {
        pid: [
          {
            required: true,
            message: "请选择所属角色名称",
            trigger: "blur"
          }
        ],
        catename: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    //加载时候调取商品分类列表
    this.getActionCateList();
  },
  computed: {
    ...mapGetters(["getStateCateList"])
  },
  methods: {
    //商品分类列表
    ...mapActions(["getActionCateList"]),
    reset() {
      this.fileList=[];
      this.cateInfo = {
        pid: 0, //上级分类编号
        catename: "", //分类名称
        img: "", //图片
        status: "1"
      };
    },
    //上传文件超过最大上传个数时候
    handleExceed(files, fileList){
       this.$message.warning(`当前限制选择 1 张图片，本次选择了 ${files.length} 张图片，共选择了 ${files.length + fileList.length} 张图片，请删除多余图片`);
    },
    //文件内容发生改变时
    changeInfo(file) {
      // console.log(file, "修改文件");
      this.imgUrl = file.raw;
    },
    //文件列表移除文件时
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //点击文件列表中已上传的文件时
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    add() {
      //出现弹框
      this.dialogIsShow = true;
      this.isAdd = true;
    },
    cancel() {
      this.reset();
      this.dialogIsShow = false;
    },
    del(id) {
      this.$confirm("你确定要删除这条数据吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除逻辑
          getcateDelete({ id }).then(res => {
            if (res.data.code == 200) {
              //重新调取接口列表
              this.getActionCateList();
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
    update(id) {
      this.dialogIsShow = true;
      this.isAdd = false;
      //给编辑id赋值
      this.editId = id;
      //调取分类查询一条数据
      getcateInfo({ id }).then(res => {
        if (res.data.code == 200) {
          //console.log(res);
          this.cateInfo = res.data.list;
          //对获取的图片进行格式转化
          this.fileList = this.cateInfo.img ? [{url:`http://localhost:3000${this.cateInfo.img}`}] :[];
          this.cateInfo.status = this.cateInfo.status.toString();
        }
      });
    },
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = this.cateInfo;
          //如果有上传文件 那我们不能直接传值 需要利用FormData转化
          let file = new FormData();
          for (let i in data) {
            file.append(i, data[i]);
          }
          // console.log(file);
          //单独对图片地址进行操作
          file.append("img", this.imgUrl);
          //根据isAdd状态去判断执行接口
          if (this.isAdd) {
            //调取添加接口
            getcateAdd(file).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //添加成功重新查询列表
                this.getActionCateList();
                this.$message.success(res.data.msg);
              } else if (res.data.code == 500) {
                this.$message.warning(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
           //添加id
           file.append('id',this.editId)
            //调取更新接口
            getcateEdit(file).then(res => {
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogIsShow = false;
                //清空输入框
                this.reset();
                //添加成功重新查询列表
                this.getActionCateList();
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

.imgInfo {
  width: 150px;
  height: 150px;
}
</style>