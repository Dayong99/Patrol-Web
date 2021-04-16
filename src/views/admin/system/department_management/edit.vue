<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="department_editdlg"
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
          :model="oneDepartment"
          :rules="rules"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="部门名" prop="name">
            <el-input v-model="oneDepartment.name" size="small" />
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
  },
  data() {
    return {
      modal: false,
      width: "600px",
      oneDepartment: this.initDepartment(),
      rules: {
        name: {
          required: true,
          message: "部门名不能为空",
          trigger: "blur",
        },
      },
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
    }
  },

  methods: {
    //加载相关信息
    setdepartment(val) {
      this.oneDepartment.id = val.id;
      this.oneDepartment.name = val.name;
      // console.log("oneDepartment:",this.oneDepartment);
    },
    initDepartment() {
      return {
        id: '',
        name: '',
      };
    },
    close() {
      this.$emit("close");
    },

    //重置弹窗
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneDepartment = this.initDepartment();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    //提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$put("/inspection/t-department", { ...this.oneDepartment }).then(() => {
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
    // show() {
    // 	console.log("传：",this.oneDepartment);
    // },
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
// 添加对话框
/deep/ .department_editdlg {
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
</style>