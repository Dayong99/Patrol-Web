<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="clue_editdlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-s-tools table-operation"></i>
        <span>{{ title }}</span>
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <el-form
          ref="form"
          :model="oneTip"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="修改项目" prop="result">
            <el-input size="small" v-model="oneTip.result" />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
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
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    //    one: {
    //        type: String,
    //        default: "",
    //    }
  },
  data() {
    return {
      width: "500px",
      oneTip: "",
      rules: {
        result: {
          required: true,
          message: "一级标签不能为空",
          trigger: "blur",
        },
      },
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    setTip(val) {
      this.oneTip = { ...val };
      console.log("oneTip", this.oneTip)
    },
    setDiscipline(val) {

    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {

          this.$put("/inspection/t-label", { ...this.oneTip }).then((r) => {
            console.log("r", r)
            if (r.data.code === 20000) {
              this.isVisible = false;
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.$emit("success");
            } else if (r.data.code === 500) {
              this.$message({
                message: "未作修改",
                type: "warning",
              });
            }
          });
        } else {
          return false
        }
      })
    }

  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// 添加对话框
/deep/ .clue_editdlg {
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

    .edit_password {
      .el-form-item__content {
        display: flex;
        align-items: center;
      }
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-form-item__error {
      padding-top: 0;
    }
  }
}
</style>