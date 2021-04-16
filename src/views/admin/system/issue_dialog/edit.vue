<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="issue_editdlg"
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
          :model="oneissue"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="修改标签" prop="result">
            <el-input v-model="oneissue.result" size="small" />
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
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: false,
      width: "500px",
      oneissue: this.initIssue(),
      rules: {
        result: {
          required: true,
          message: "标签名不能为空",
          trigger: "blur",
        }
      }
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

  methods: {
    //加载相关信息
    setIssue(val) {
      this.oneissue.id = val.id;
      this.oneissue.labletype = val.labletype;
      this.oneissue.level = val.level;
      this.oneissue.ordernum = val.ordernum;
      this.oneissue.parentid = val.parentid;
      this.oneissue.result = val.result;
    },
    initIssue() {
      return {
        id: null,
        labletype: null,
        level: null,
        ordernum: null,
        parentid: null,
        result: '',
      }
    },
    close() {
      this.$emit("close");
    },
    //重置弹窗
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneissue = this.initIssue();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    //提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$put("/inspection/t-label", { ...this.oneissue }).then((r) => {
            if (r.data.code == 20000) {
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.updateSuccess"),
                type: "success",
              });
              this.$emit("success");
            } else if (r.data.code == 500) {
              this.$message({
                message: "标签名不可重复！",
                type: "warning",
              });
            }
          });
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  width: 200px;
}
// 添加对话框
/deep/ .issue_editdlg {
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