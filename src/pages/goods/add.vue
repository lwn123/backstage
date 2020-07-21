<template>
    <div>
        <el-dialog
            :title="addInfo.isAdd ? '商品添加':'商品编辑'"
            :visible.sync="addInfo.dialogIsShow"
            center
            :before-close="cancel"
        >
            <el-form :model="goodsInfo" :rules="rules" ref="goodsInfo">
                <el-form-item
                    label="一级分类："
                    :label-width="formLabelWidth"
                    placeholder="请选择一级分类"
                    prop="first_cateid"
                >
                    <el-select v-model="goodsInfo.first_cateid" placeholder="请选择">
                        <el-option
                            v-for="item in getStateGoodsList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                        >{{item.title}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="二级分类："
                    :label-width="formLabelWidth"
                    placeholder="请选择二级分类"
                    prop="second_cateid"
                >
                    <el-select v-model="goodsInfo.second_cateid" placeholder="请选择">
                        <el-option
                            v-for="item in getStateGoodsList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                        >{{item.title}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称：" :label-width="formLabelWidth" prop="goodsname">
                    <el-input v-model="goodsInfo.goodsname"></el-input>
                </el-form-item>
                <el-form-item label="商品价格：" :label-width="formLabelWidth" prop="price">
                    <el-input v-model="goodsInfo.price"></el-input>
                </el-form-item>
                <el-form-item label="市场价格：" :label-width="formLabelWidth" prop="market_price">
                    <el-input v-model="goodsInfo.market_price"></el-input>
                </el-form-item>
                <el-form-item label="商品图片：" :label-width="formLabelWidth">
                    <el-upload
                        action="#"
                        list-type="picture-card"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :auto-upload="false"
                        :on-change="changeInfo"
                        :limit="1"
                        :on-exceed="handleExceed"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                </el-form-item>
                <el-form-item
                    label="商品规格："
                    :label-width="formLabelWidth"
                    placeholder="请选择商品规格"
                    prop="specsid"
                >
                    <el-select v-model="goodsInfo.specsid" placeholder="请选择">
                        <el-option
                            v-for="item in getStateGoodsList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                        >{{item.title}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="规格属性："
                    :label-width="formLabelWidth"
                    placeholder="请选择规格属性"
                    prop="specsattr"
                >
                    <el-select v-model="goodsInfo.specsattr" placeholder="请选择">
                        <el-option
                            v-for="item in getStateGoodsList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                        >{{item.title}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否新品：" :label-width="formLabelWidth" prop="isnew">
                    <el-radio v-model="goodsInfo.isnew" label="1">是</el-radio>
                    <el-radio v-model="goodsInfo.isnew" label="2">否</el-radio>
                </el-form-item>
                <el-form-item label="是否热卖：" :label-width="formLabelWidth" prop="ishot">
                    <el-radio v-model="goodsInfo.ishot" label="1">是</el-radio>
                    <el-radio v-model="goodsInfo.ishot" label="2">否</el-radio>
                </el-form-item>
                <el-form-item label="状态：" :label-width="formLabelWidth">
                    <el-radio v-model="goodsInfo.status" label="1">启用</el-radio>
                    <el-radio v-model="goodsInfo.status" label="2">禁用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button v-if="addInfo.isAdd" type="primary" @click="subInfo('goodsInfo')">新 增</el-button>
                <el-button v-else type="primary" @click="subInfo('goodsInfo')">更 新</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
//引入商品接口
import { getgoodsAdd, getgoodsEdit, getgoodsInfo } from '../../util/axios'
//调取辅助性函数
import { mapActions, mapGetters } from 'vuex'
export default {
    props: ['addInfo'],
    data() {
        return {
            fileList: [], //文件上传列表
            dialogImageUrl: '', //显示图片
            dialogVisible: false, //开启图片的弹框
            imgUrl: '', //上传之后的图片地址
            formLabelWidth: '100px', //label宽度
            goodsInfo: {
                first_cateid: '', //一级分类编号
                second_cateid: '', //二级分类编号
                goodsname: '', //商品名称
                price: '', //商品价格
                market_price: '', //市场价格
                img: '', //商品图片（文件）
                description: '', //商品描述
                specsid: '', //商品规格编号
                specsattr: '', //商品规格属性
                isnew: '1', //是1否2新品
                ishot: '1', //是1否2热卖推荐
                status: '1'
            },
            rules: {
                goodsname: [
                    {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }
                ],
                second_cateid: [
                    {
                        required: true,
                        message: '请选择二级分类',
                        trigger: 'blur'
                    }
                ],
                first_cateid: [
                    {
                        required: true,
                        message: '请选择一级分类',
                        trigger: 'blur'
                    }
                ],
                price: [
                    {
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }
                ],
                market_price: [
                    {
                        required: true,
                        message: '请输入市场',
                        trigger: 'blur'
                    }
                ],
                specsid: [
                    {
                        required: true,
                        message: '请选择商品规格',
                        trigger: 'blur'
                    }
                ],
                specsattr: [
                    {
                        required: true,
                        message: '请选择规格属性',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {
        //计算属性
        ...mapGetters(['getStateGoodsList'])
    },
    methods: {
        //当文件个数被限制时触发的函数
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            )
        },
        //移除图片
        handleRemove(file, fileList) {
            console.log(file, fileList)
        },
        //放大图片
        handlePreview(file) {
            this.dialogImageUrl = file.url
            console.log(file.url, '图片的地址。。。')
            this.dialogVisible = true

            console.log(file, '文件地址')
        },
        changeInfo(file) {
            console.log(file, '修改文件')
            this.imgUrl = file.raw
        },
        //封装一个获取商品列表事件
        ...mapActions(['getActionMenuList']),
        //关闭弹框事件
        cancel() {
            this.reset()
            this.$emit('cancel', false)
        },
        //重置输入内容
        reset() {
            ;(this.fileList = []), //上传文件列表
                (this.goodsInfo = {
                    first_cateid: '', //一级分类编号
                    second_cateid: '', //二级分类编号
                    goodsname: '', //商品名称
                    price: '', //商品价格
                    market_price: '', //市场价格
                    img: '', //商品图片（文件）
                    description: '', //商品描述
                    specsid: '', //商品规格编号
                    specsattr: '', //商品规格属性
                    isnew: '1', //是1否2新品
                    ishot: '1', //是1否2热卖推荐
                    status: '1'
                })
        },
        //点击编辑按钮出现弹框并携带数据
        update(id) {
            //给编辑id赋值
            this.editId = id
            //调取商品查询一条数据
            getgoodsInfo({ id }).then(res => {
                if (res.data.code == 200) {
                    console.log(res)
                    this.goodsInfo = res.data.list
                    this.goodsInfo.type = this.goodsInfo.type.toString()
                    this.goodsInfo.status = this.goodsInfo.status.toString()
                }
            })
        },
        //确定添加或者更新事件
        subInfo(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //根据isAdd状态去判断执行接口
                    if (this.addInfo.isAdd) {
                        //调取添加接口
                        getMenuAdd(this.goodsInfo).then(res => {
                            if (res.data.code == 200) {
                                //关闭弹框 清空输入框
                                this.cancel()
                                //添加成功重新查询列表
                                this.getActionMenuList()
                                this.$message.success(res.data.msg)
                            } else if (res.data.code == 500) {
                                this.$message.warning(res.data.msg)
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    } else {
                        let data = this.goodsInfo
                        data.id = this.editId
                        //调取更新接口
                        getMenuEdit(data).then(res => {
                            if (res.data.code == 200) {
                                //关闭弹框 清空输入框
                                this.cancel()
                                //添加成功重新查询列表
                                this.getActionMenuList()
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
}
</script>

<style  lang="" scoped>
</style>
