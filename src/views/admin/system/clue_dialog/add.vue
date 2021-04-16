<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-circle-plus-outline nav-operation"></i>
        <span>{{ title }}</span>
      </div>
      <el-form
        ref="form"
        :model="result_one"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="名称" prop="level_one">
          <el-input type="text" size="small" v-model="result_one.result" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="warning" plain @click="isVisible = false"
          >取消</el-button
        >
        <el-button type="primary" plain @click="submitForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import intelligent_analysisVue from '../../../normal_user/issue_list/intelligent_analysis.vue';
export default {
  name: 'clueAdd',
  props: {
    title: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    //    sort:{
    //        type:Number ,
    //        default: ""
    //    }
  },
  data() {
    return {
      width: "600px",
      result_one: {},
      sort: 0,
      rules: {
        level_one: {
          required: true,
          message: "名称不能为空",
          trigger: "blur",
        },
      }
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    //获取一级排序
    setSort(val) {
      console.log("val", val)
      this.result_one.labletype = 0
      this.result_one.level = 1
      this.result_one.ordernum = val
    },
    //获取二级排序
    setSort1(val) {
      this.result_one.labletype = 0
      this.result_one.level = 2
      this.result_one.ordernum = val.lists.length + 1
      this.result_one.parentid = val.id
      console.log("result_one", this.result_one)
      // this.result_one.ordernum=val
    },

    submitForm() {
      //初始化标签
      // this.result_one.labletype=0
      // this.result_one.level=1
      // this.result_one.ordernum=this.sort
      this.$post("inspection/t-label", { ...this.result_one }).then(
        () => {
          this.isVisible = false;
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.$emit("success");
        })
      console.log("result_one", this.result_one)
    },
    //初始化一级标签
    // initResultOne(){
    //     return{

    //         result:null
    //     }
    // },
    //重置弹出信息
    reset() {
      this.result_one.result = '';
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();


      });
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    },
  },
}
</script>

<style scoped>
</style>