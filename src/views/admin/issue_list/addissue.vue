<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="issue_dlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <span>{{ title }}</span>
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <el-form
          ref="form"
          :model="newissue"
          :rules="rules"
          label-position="right"
          label-width="130px"
        >
          <el-form-item label="具体问题" prop="message">
            <!-- <el-input v-model="newissue.message" width="80%" /> -->
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="newissue.message">
            </el-input>
            <el-checkbox
              v-model="newissue.stress"
              true-label="1"
              false-label="0"
              width="20%"
              >重点问题</el-checkbox
            >
          </el-form-item>
          <el-form-item label="一级分类" prop="firstCategory">
            <el-select
              placeholder="请选择一级分类"
              v-model="newissue.firstCategory"
              clearable
              size="small"
              @change="clearTwo"
            >
              <el-option
                v-for="item in firstList"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类" prop="twoCategory">
            <el-select
              placeholder="请选择二级分类"
              v-model="newissue.twoCategory"
              clearable
              size="small"
            >
              <el-option
                v-for="item in screen(this.newissue.firstCategory, secondList)"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="其他标签" prop="otherCategory">
            <el-select
              placeholder="请选择其他标签"
              v-model="newissue.otherCategory"
              clearable
              size="small"
            >
              <el-option
                v-for="item in elseList"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <!-- <el-button type="warning" plain @click="reset">重置</el-button> -->
          <el-button type="warning" plain @click="isVisible = false"
            >取消</el-button
          >
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
    searchUnits: {
      type: Array,
      default: [],
    },
    firstList: {
      type: Array,
      default: [],
    },
    secondList: {
      type: Array,
      default: [],
    },
    elseList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      checked: 0,
      modal: false,
      width: "450px",
      height: 240,
      newissue: this.initnewissue(),
      rounds: [],
      tempList: [],
      rules: {
        message: {
          required: true,
          message: "问题内容不能为空",
          trigger: "blur",
        },
      },
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
    }
  },
  methods: {
    setPatrolId(row) {
      this.newissue.patrolId = row.main.patrolUnitId;
    },
    initnewissue() {
      return {
        stress: 0,
        message: null,
        firstCategory: null,
        twoCategory: null,
        otherCategory: null,
        patrolId: null,
      };
    },
    //加载对应的二级分类
    clearTwo() {
      this.newissue.twoCategory = null;
    },
    screen(val, secondList) {
      let tempList = [];
      secondList.forEach(item => {
        if (item.parentId == val) {
          tempList.push(item);
        }
      });
      return tempList;
    },
    close() {
      this.$emit("close");
    },
    //重置弹窗
    reset() {
      // console.log("otherca:",this.newissue.otherCategory);
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.newissue = this.initnewissue();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$post("/inspection/t-problem", {
            patrolId: this.newissue.patrolId,
            firstCategory: this.newissue.firstCategory,
            twoCategory: this.newissue.twoCategory,
            otherCategory: this.newissue.otherCategory,
            message: this.newissue.message,
            stress: this.newissue.stress,
          }).then((r) => {
            if (r.data.code == 20000) {
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.createSuccess"),
                type: "success",
              });
              this.$emit("success");
            }
          });
        } else {
          return false;
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  width: 200px;
}
// .el-input {
// 	width: 80%;
// }
// /deep/ .el-dialog__body {
// 	padding: 30px 120px;
// }
// /deep/.dialog-title span{
// 	color: #0082E7;
// }

// 添加报告对话框
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

    /deep/ .el-textarea {
      width: 80%;
    }
  }
}
</style>