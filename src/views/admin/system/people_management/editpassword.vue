<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="password_dlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      :modal-append-to-body="false"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <span>{{ title }}</span>
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <el-form
          ref="form"
          :model="onepassword"
          :rules="rules"
          label-position="right"
          label-width="60px"
        >
          <el-form-item label="密码" prop="password">
            <el-input v-model="onepassword.password" />
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
    editlogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: false,
      width: "600px",
      onepassword: this.initpassword(),
      rules: {
        password: {
          required: true,
          message: "密码不能为空",
          trigger: "blur",
        },
      },
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.editlogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    }
  },

  methods: {
    //加载相关信息
    setId(val) {
      this.onepassword.id = val;
    },
    initpassword() {
      return {
        id: null,
        password: null,
      };
    },
    close() {
      this.$emit("close");
    },

    //重置弹窗
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.onepassword = this.initpassword();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    //提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$put("/inspection/t-user/adminPutPassword", { ...this.onepassword }).then(() => {
            this.isVisible = false;
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success",
            });
            this.$emit("success");
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
/deep/ .password_dlg {
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
		margin-left: 40px;
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
</style>