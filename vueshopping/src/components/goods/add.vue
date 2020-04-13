<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tabs 标签页     -->
            <el-form
                :model="addFrom"
                :rules="addFromRules"
                ref="addFromRef"
                label-width="100px"
                label-position="top"
            >
                <el-tabs
                    v-model="activeIndex"
                    :tab-position="'left'"
                    :before-leave="beforeTabLeave"
                    @tab-click="tabClicked"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addFrom.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addFrom.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addFrom.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addFrom.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addFrom.goods_cat"
                                :options="catelist"
                                :props="cateProps"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的Item项 -->
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in manyTableData"
                            :key="item.attr_id"
                        >
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox
                                    :label="cd"
                                    v-for="(cd , i) in item.attr_vals"
                                    :key="i"
                                    border=""
                                ></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in onlyTableData"
                            :key="item.attr_id"
                        >
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 表示图片要上传到的后台API地址 -->
                        <el-upload
                            action="https://www.liulongbin.top:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="perviewVisible" width="50%">
            <img :src="perviewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      // 所有的商品列表
      catelist: [],
      // 默认步骤条的激活状态
      activeIndex: "0",
      //   添加商品的表单的数据对象
      addFrom: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详细描述
        goods_introduce: "",
        attrs: []
      },
      //   添加商品的表单的数据验证规则
      addFromRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //   动态参数的列表
      manyTableData: [],
      // 静态参数的列表
      onlyTableData: [],
      //   图片上传组件的headerObj请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      //   预览的图片
      perviewPath: "",
      //   控制图片预览对话框的显示与隐藏
      perviewVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取所有商品的列表
    async getCateList() {
      const { data: res } = await this.$http.get(
        "https://www.liulongbin.top:8888/api/private/v1/categories"
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败!");
      }
      this.catelist = res.data;
    },
    // 级联选择器选中项变化会触发的函数
    handleChange() {
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = [];
      }
    },
    // 判断是否切换tabs标签页却换事件
    beforeTabLeave(activeName, oldactiveName) {
      if (oldactiveName === "0" && this.addFrom.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类!");
        return false;
      }
    },
    // 点击tabs标签页事件
    async tabClicked() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `https://www.liulongbin.top:8888/api/private/v1/categories/${
            this.cateId
          }/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败!");
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `https://www.liulongbin.top:8888/api/private/v1/categories/${
            this.cateId
          }/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败!");
        }
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.perviewPath = file.response.data.url;
      this.perviewVisible = true;
    },
    // 处理图片一出的操作
    handleRemove(file) {
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从 pics 数据中，找到这个图片对应的索引值
      const i = this.addFrom.pics.findIndex(x => x.pic === filePath);
      // 3.调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addFrom.pics.splice(i, 1);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象push 到pics数组之中
      this.addFrom.pics.push(picInfo);
    },
    // 添加商品
    add() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项!");
        }
        // 执行添加业务逻辑
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addFrom);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态属性
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.addFrom.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addFrom.attrs.push(newInfo);
        });
        form.attrs = this.addFrom.attrs;
        console.log(form);
        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post(
          "https://www.liulongbin.top:8888/api/private/v1/goods",
          form
        );
        if(res.meta.status !== 201){
            return this.$message.error('添加商品失败!')
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      });
    }
  },
  computed: {
    cateId() {
      if (this.addFrom.goods_cat.length === 3) {
        return this.addFrom.goods_cat[2];
      }
      return null;
    }
  }
};
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>


