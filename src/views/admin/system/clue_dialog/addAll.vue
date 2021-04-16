<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="clue_dlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-circle-plus-outline nav-operation"></i>
        <span>{{ title }}</span>
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <el-form
          ref="form"
          :model="onetip"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="标签类型" prop="value">
            <el-select
              v-model="onetip.value"
              placeholder="请选择标签类别"
              :disabled="flag"
            >
              <el-option
                v-for="item in tiptypeList"
                :key="item.label"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="一级标签" prop="result">
            <!-- <el-select
                    v-model="onetip.result"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请输入一级标签">
                    <el-option
                    v-for="(item,index) in tipOne"
                    :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select> -->
            <el-input
              style="width: 200px"
              v-model="onetip.result"
              placeholder="请输入一级标签"
              clearable
              :disabled="flag"
            >
            </el-input>
            <img :src="imgAdd" class="img" @click="addTip" />
            <!-- <i class="el-icon-circle-plus-outline" @click="addTip"></i> -->
          </el-form-item>

          <el-form-item label="二级标签" prop="tipTwo">
            <div v-for="(item, i) of onetip.tipTwo" :key="i">
              <el-input
                style="width: 200px"
                v-model="onetip.tipTwo[i]"
                :key="i"
                placeholder="请输入内容"
                clearable
              >
              </el-input>
              <img :src="imgDel" class="img" @click="delTip(i)" />
              <!-- <i class="el-icon-remove-outline" @click="delTip(i)"></i> -->
            </div>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button
            type="warning"
            plain
            @click="(isVisible = false), (flag = false)"
            >取消</el-button
          >
          <el-button type="primary" plain @click="submitForm">确认</el-button>
        </div>
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
      width: "500px",
      result_one: {},
      sort: 0,
      rules: {
        value: {
          required: true,
          message: "标签类型不能为空",
          trigger: "blur",
        },
        result: {
          required: true,
          message: "一级标签不能为空",
          trigger: "blur",
        },
        tipTwo: {
          required: true,
          message: "二级标签不能为空",
          trigger: "blur",
        },
      },
      tiptypeList: [{
        value: '处理结果',
        label: '0'
      }, {
        value: '线索分类',
        label: '4'
      },],
      tipTwo: [""],
      tipOne: [],
      tipClue: [],
      tipResult: [],
      onetip: {
        value: '',
        result: '',
        tipTwo: [""],
      },
      value: '',
      flag: false,
      imgAdd: require('@/assets/main_images/add1.png'),
      imgDel: require('@/assets/main_images/minus.png')
    }
  },
  mounted() {
    //    this.fetch()
  },
  watch: {
    //    value(newval){

    //         if(newval==="0"){
    //             // this.tipOne = []
    //             this.onetip={}
    //             this.tipOne = this.tipResult
    //         }else if(newval === "4"){
    //             // this.tipOne = []
    //             this.onetip={}
    //             this.tipOne = this.tipClue
    //         }

    //    }
  },
  methods: {
    close() {
      this.$emit("close");
    },

    //表头添加调用方法
    setSort(val) {
      this.flag = false;
      //    this.onetip={}
      this.onetip.value = ""
      this.onetip.result = ""
      this.onetip.tipTwo = [""]
    },
    //传递一级处理结果标签的值
    setResultTip(val) {
      this.flag = true;
      this.onetip.result = val.result;
      this.onetip.id = val.id;
      this.onetip.tipTwo = [""]
      this.onetip.value = "处理结果"
    },
    setClueTip(val) {
      this.flag = true;
      this.onetip.result = val.result;
      this.onetip.id = val.id;
      this.onetip.tipTwo = [""]
      this.onetip.value = "线索分类"
    },
    addTip() {
      this.onetip.tipTwo.push("")
    },
    delTip(i) {
      this.onetip.tipTwo.splice(i, 1)
    },


    submitForm(params = {}) {
      this.$refs.form.validate((valid) => {
        if (valid) {

          if (this.flag === false) {
            params.labelName1 = String(this.onetip.result)
            params.labelName2s = String(this.onetip.tipTwo)
            if (this.onetip.value === "处理结果") {
              params.labelType = 0
            } else if (this.onetip.value === "线索分类") {
              params.labelType = 4
            }
            this.$post("inspection/t-label/addAll", { ...params }).then(
              (r) => {
                if (r.data.data === 0) {
                  this.$message({
                    message: "添加的二级标签重复",
                    type: "warning",
                  });


                } else {
                  this.isVisible = false;
                  this.$message({
                    message: "添加成功",
                    type: "success",
                  });
                  this.$emit("success");
                }

              })

          } else {
            params.labelName1 = String(this.onetip.result)
            params.labelName2s = String(this.onetip.tipTwo)
            if (this.onetip.value === "处理结果") {
              params.labelType = 0
            } else if (this.onetip.value === "线索分类") {
              params.labelType = 4
            }
            params.parentId = this.onetip.id
            this.$post("inspection/t-label/addAll", { ...params }).then(
              (r) => {
                if (r.data.data === 0) {
                  this.$message({
                    message: "请勿添加重复二级标签",
                    type: "warning",
                  });
                } else {
                  this.isVisible = false;
                  this.flag = false
                  this.$message({
                    message: "添加成功",
                    type: "success",
                  });
                  this.$emit("success");
                }

              })

          }
        } else {
          return false
        }
      })


      console.log("params", params)
    },
    // //加载下拉框
    // fetch(params = {}){
    //     params.labletype=0
    //     params.type=1
    //     this.$get("/inspection/t-label/getLable1",{...params,}).then((r)=>{

    //         if(r.data.code == 20000){
    //             const data = r.data.data;
    //             this.tipResult = []
    //             data.forEach((item,index) => {
    //                 this.tipResult.push(item.result)
    //             });
    //             console.log("tipResult",this.tipResult)
    //         }
    //     })
    //     params.labletype=4
    //     params.type=1
    //     this.$get("/inspection/t-label/getLable1",{...params,}).then((r)=>{

    //         if(r.data.code == 20000){
    //             const data = r.data.data;
    //             this.tipClue = []
    //             data.forEach((item,index) => {
    //                 this.tipClue.push(item.result)
    //             });
    //             console.log("tipClue",this.tipClue)
    //         }
    //     })
    // },


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

<style lang="scss" scoped>
/deep/ .el-input__inner {
  width: 200px;
}
// 添加对话框
/deep/ .clue_dlg {
  border-radius: 4px;

  .el-dialog__header {
    padding: 10px 20px;

    .el-dialog__headerbtn {
      top: 10px;
    }
  }

  .dialog-title {
    font-family: "微软雅黑";
    span {
      font-size: 16px;
    }
  }

  .el-dialog__body {
    padding: 0 20px 20px;
  }

  .dialog-footer {
    margin-top: 10px;
  }

  // 对话框内容
  .dialog_content {
    padding: 15px 0;
    display: flex;
    flex-flow: column nowrap;
    // justify-content: space-between;
    align-items: center;
    // box-shadow: 2px 2px 8px 0px rgba(127, 136, 154, 0.36);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #f1f3f6;

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-form-item__error {
      padding-top: 0;
    }
  }
}
.img {
  vertical-align: middle;
  width: 25px;
  height: 25px;
  margin-left: 10px;

  &:hover {
    cursor: pointer;
  }
}
// /deep/.dialog-title span{
//     color: #0082E7;
// }
</style>
