<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="issue_dlg"
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
          :model="newissue"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="分类标签" prop="labletype">
            <el-select
              placeholder="请选择分类标签"
              v-model="newissue.labletype"
              :disabled="flag"
              clearable
              size="small"
            >
              <el-option
                v-for="item in labletypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="一级分类"
            prop="result"
            v-show="newissue.labletype != 3"
          >
            <div class="first_label">
              <el-select
                placeholder="选择或新建一级分类"
                v-model="newissue.result"
                :disabled="flag"
                clearable
                filterable
                allow-create
                size="small"
              >
                <el-option
                  v-for="item in issuelist"
                  :key="item.id"
                  :label="item.result"
                  :value="item.result"
                />
              </el-select>
              <!-- <i class="el-icon-plus table-operation plus" @click="addTip"></i> -->
              <img
                :src="imgAdd"
                class="img table-operation plus"
                @click="addTip"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="二级分类"
            prop="secondTip"
            v-show="newissue.labletype != 3"
          >
            <div
              v-for="(item, i) of newissue.secondTip"
              :key="i"
              class="second_label"
            >
              <el-input
                v-model="newissue.secondTip[i]"
                :key="i"
                size="small"
                style="width: 200px"
                placeholder="请输入分类名"
                clearable
              />
              <!-- <i class="el-icon-minus table-operation minus" @click="delTip(i)"></i> -->
              <img
                :src="imgDel"
                class="img table-operation minus"
                @click="delTip(i)"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="标签名"
            prop="result"
            v-show="newissue.labletype == 3"
          >
            <div>
              <el-input
                v-model="newissue.result"
                :key="i"
                size="small"
                placeholder="请输入标签名"
                clearable
              />
            </div>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="warning" plain @click="reset">重置</el-button>
          <el-button type="primary" plain @click="submitForm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    title: {
      type: String,
      default: "",
    },
    addlogVisible: {
      type: Boolean,
      default: false,
    },
    issuelist: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      modal: false,
      width: "500px",
      newissue: this.initIssue(),
      flag: false,
      labletypeList: [
        {
          name: '分类标签',
          id: 1
        }, {
          name: '其他标签',
          id: 3
        }],
      rules: {
        result: {
          required: true,
          message: "标签名不能为空",
          trigger: "blur",
        },
        labletype: {
          required: true,
          // message: "标签类型不能为空",
          message: "分类标签不能为空",
          trigger: "blur",
        },
        // secondTip: {
        // 	required: true,
        // 	message: "子标签不能为空",
        // 	trigger: "blur",
        // },
      },
      imgAdd: require('@/assets/main_images/add1.png'),
      imgDel: require('@/assets/main_images/minus.png'),
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.addlogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    },
  },

  watch: {
    newissue: {
      handler(newval, oldval) {
        console.log('---------', newval)
      },
      deep: true,
    }
  },

  methods: {
    setFirstTip(val) {
      this.newissue.labletype = val.labletype;
      this.newissue.parentId = val.id;
      this.newissue.result = val.result;
      this.flag = true;
    },
    initIssue() {
      return {
        labletype: null,
        result: null,
        secondTip: [""],
        parentId: null,
      }
    },
    close() {
      this.$emit("close");
      this.flag = false;
    },
    addTip() {
      this.newissue.secondTip.push("");
    },
    delTip(i) {
      this.newissue.secondTip.splice(i, 1);
      console.log(this.newissue.secondTip.length);
    },
    show() {
      if (this.newissue.secondTip.length <= 0) {
        return false;
      } else {
        return true;
      }
    },
    //重置弹窗
    reset() {
      if (this.flag == false) {
        // 先清除校验，再清除表单，不然有奇怪的bug
        this.newissue = this.initIssue();
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      } else {
        this.newissue.secondTip = [""];
      }
    },
    //提交
    submitForm(params = {}) {
      params.labelName1 = this.newissue.result;
      params.labelName2s = this.newissue.secondTip;
      params.labelType = this.newissue.labletype;
      params.parentId = this.newissue.parentId;
      // this.setOrd();
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.newissue.id) {
            //create
            this.$post("/inspection/t-label/addAll", { ...params }).then((r) => {
              // if (r.data.code == 500) {
              // 	console.log(r.data.message);
              // }
              if (r.data.data == 0) {
                this.$message({
                  message: "该标签已存在或为空！",
                  type: "warning",
                })
              } else if (r.data.data >= 0) {
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.createSuccess"),
                  type: "success",
                });
                this.$emit("success");
                // console.log("message:",r.data.message,"data:",r.data.data,"code:",r.data.code);
              }
            });
          } else {
            alert("标签已存在！")
          }
        } else {
          return false;
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.plus,
.minus {
  display: inline-block;
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  margin-left: 10px;
}
// .minus {
// 	transform: translateX(-7px);
// }
/deep/ .el-input__inner {
  width: 200px;
}
// 添加对话框
/deep/ .issue_dlg {
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

.first_label {
  display: flex;
  align-items: center;
}

.second_label {
  width: 200px;
  display: flex;
  align-items: center;
}
</style>