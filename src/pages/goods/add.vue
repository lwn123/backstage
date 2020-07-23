<template>
    <div>
        <el-dialog width="65%"
            :title="addInfo.isAdd ? '商品添加':'商品编辑'"
            :visible.sync="addInfo.dialogIsShow"
            center
            :before-close="cancel"
            @open='openEditor'
        >
            <el-form :model="goodsInfo" :rules="rules" ref="goodsInfo">
                <el-form-item
                    label="一级分类："
                    :label-width="formLabelWidth"
                    placeholder="请选择一级分类"
                    prop="first_cateid"
                >
                    <el-select v-model="goodsInfo.first_cateid" placeholder="请选择" @change="cateChange">
                        <el-option
                            v-for="item in cateArr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id"
                        >{{item.catename}}</el-option>
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
                            v-for="item in secondArr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id"
                        >{{item.catename}}</el-option>
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
                    <el-select v-model="goodsInfo.specsid" placeholder="请选择" @change="specChange">
                        <el-option
                            v-for="item in  goodsSpecs"
                            :key="item.id"
                            :label="item.specsname"
                            :value="item.id"
                        >{{item.specsname}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="规格属性："
                    :label-width="formLabelWidth"
                    placeholder="请选择规格属性"
                    prop="specsattr">
                    <el-select v-model="goodsInfo.specsattr" placeholder="请选择" multiple ref='selectattr'>
                        <el-option
                            v-for="item in specAttrs"
                            :key="item"
                            :label="item"
                            :value="item"
                        >{{item}}</el-option>
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
                <el-form-item label="商品描述：" :label-width="formLabelWidth">
                    <div id="editor" ref="editor">

                    </div>
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
//引入富文本编译器
import E from 'wangeditor';
//引入商品接口
import { getgoodsAdd, getgoodsEdit, getgoodsInfo,getcateList,getspecList ,getspecInfo} from '../../util/axios'
//调取辅助性函数
import { mapActions, mapGetters } from 'vuex'
export default {
    props: ['addInfo','getCount'],
    data() {
        return {
            editor:null,
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
            cateArr:[],//一级分类
            secondArr:[],//二级分类
            goodsSpecs:[],//商品规格
            specAttrs:[],
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
    mounted(){
        //弹框组件加载时候获取一级分类
        getcateList({pid:0}).then(res => {
            if(res.data.code == 200){
                this.cateArr = res.data.list
            }
        })
        getspecList().then(res => {
            if(res.data.code == 200){
                this.goodsSpecs = res.data.list
            }
        })
        
    },
    computed: {
        //计算属性
        ...mapGetters(['getStateGoodsList'])
    },
    methods: {
        //扒开弹框之前的回调
        openEditor(){
            setTimeout(()=>{
            this.editor = new E('#editor');
            this.editor.create();
        },0)
        },
        //点击一级分类的时候，联动出二级分类
        cateChange(e){
            //e 选中一级时候返回分类编号
            //console.log(e)
            getcateList({pid:e}).then(res => {
            if(res.data.code == 200){
                this.secondArr = res.data.list
            }
        })
        },
        //点击商品规格，联动商品属性
        specChange(id){
            getspecInfo({id}).then(res => {
                if(res.data.code ==200){
                    this.specAttrs=res.data.list? res.data.list[0].attrs:[];
                }
            })

        },
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
            
            this.imgUrl = file.raw
        },
        //封装一个获取商品列表事件
        ...mapActions(['getActionGoodsList']),
        //关闭弹框事件
        cancel() {
            this.reset()
            this.$emit('cancel', false)
        },
        //重置输入内容
        reset() {
            this.fileList = [], //上传文件列表
            this.goodsInfo = {
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
            this.$refs.editor.innerHTML ='';
        },
        //点击编辑按钮出现弹框并携带数据
        update(id) {
            //给编辑id赋值
            this.editId = id
            //调取商品查询一条数据
            getgoodsInfo({ id }).then(res => {
                if (res.data.code == 200) {
                    this.goodsInfo = res.data.list
                    this.goodsInfo.status = this.goodsInfo.status.toString()
                    this.goodsInfo.ishot = this.goodsInfo.isnew.toString()
                    this.goodsInfo.isnew = this.goodsInfo.isnew.toString()
                    }
                    //二级分类
                    this.cateChange(this.goodsInfo.first_cateid)
                    //商品规格属性
                    this.specChange(this.goodsInfo.specsid);
                    //对规格属性进行拆分
                   this.goodsInfo.specsattr =this.goodsInfo.specsattr ? this.goodsInfo.specsattr.split(','):[];
                   //图片
                   this.fileList = this.goodsInfo.img? [{url:`${this.$imgUrl}${this.goodsInfo.img}`}] :[];
                   
                   //文本编译器
                   this.goodsInfo.description = this.editor.txt.html(this.goodsInfo.description);
                    
            })
        },
        //确定添加或者更新事件
        subInfo(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //转化数据数据库中specsattr是字符串
                    let data = this.goodsInfo;
                    data.specsattr =  data.specsattr? data.specsattr.join(','):"";
                    //对编辑器的内容进行转换
                    data.description = this.editor.txt.html()
                    let file = new FormData();
                    for(let i in data){
                        file.append(i,data[i]);
                    }
                    file.append('img',this.imgUrl);
                    //根据isAdd状态去判断执行接口
                    if (this.addInfo.isAdd) {
                        //调取添加接口
                        getgoodsAdd(file).then(res => {
                            if (res.data.code == 200) {
                                //关闭弹框 清空输入框
                                this.cancel()
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
                        file.append('id',this.editId);
                        //如果图片未修改 沿用上次图片地址 如果图片被修改使用新图片地址
                        this.imgUrl  = this.imgUrl ?this.imgUrl : this.goodsInfo.img;
                        file.append('img',this.imgUrl);
                        //调取更新接口
                        getgoodsEdit(file).then(res => {
                            if (res.data.code == 200) {
                                //关闭弹框 清空输入框
                                this.cancel()
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
}
</script>

<style  lang="" scoped>
/* #editor{
    width: 90%;
    height: 90%;
} */
</style>
