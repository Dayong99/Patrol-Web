<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="department_dlg"
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
          :model="newDepartment"
          :rules="rules"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="新增部门" prop="name">
            <el-input
              v-model="newDepartment.name"
              size="small"
              placeholder="请输入部门名"
            />
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
  },
  data() {
    return {
      modal: false,
      width: "600px",
      height: 240,
      newDepartment: this.initnewDepartment(),
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
        return this.addlogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    }
  },
  methods: {
    initnewDepartment() {
      return {
        id: null,
        name: '',
      };
    },
    close() {
      this.$emit("close");
    },
    //重置弹窗
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.newDepartment = this.initnewDepartment();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.newDepartment.id) {
            //create
            this.$post("/inspection/t-department", { ...this.newDepartment }).then(
              () => {
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.createSuccess"),
                  type: "success",
                });
                this.$emit("success");
              }
            );
          } else {
            alert("该部门已存在！")
          }
        } else {
          return false;
        }
      });
    },
    // show() {
    // 	console.log("传：",this.newDepartment);
    // },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  width: 200px;
}
// 添加对话框
/deep/ .department_dlg {
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