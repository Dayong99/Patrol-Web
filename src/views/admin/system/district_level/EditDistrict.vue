<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="district_dlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <i :class="icon"></i>
        <span>{{ title }}</span>
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <el-form
          ref="form"
          :model="oneDistrict"
          :rules="rules"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="oneDistrict.name" size="small" />
          </el-form-item>

          <el-form-item label="简称" prop="shorter">
            <el-input v-model="oneDistrict.shorter" size="small" />
          </el-form-item>

          <el-form-item label="电话" prop="mobile">
            <el-input v-model="oneDistrict.mobile" size="small" />
          </el-form-item>

          <el-form-item label="联系人" prop="user">
            <el-input v-model="oneDistrict.user" size="small" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="oneDistrict.email" size="small" />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="warning" plain @click="isVisible = false">{{
            "取消"
          }}</el-button>

          <el-button type="primary" plain @click="submitForm">{{
            "确认"
          }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditDistrict",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      width: "450px",
      oneDistrict: this.initDistrict(),
      rules: {
        name: {
          required: true,
          message: "名称不能为空",
          trigger: "blur",
        },
        shorter: {
          required: true,
          message: "简称不能为空",
          trigger: "blur",
        },
        email: [
          {
            type: "email",
            message: this.$t("rules.email"),
            trigger: "blur",
          },
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur",
          },
        ],
        user: {
          required: true,
          message: "联系人不能为空",
          trigger: "blur",
        },
        mobile: [
          {
            required: true,
            message: "电话不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "电话长度在 6 到 15 位数字",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      },
    },
  },

  methods: {
    //加载相关信息
    setDistrict(val) {
      this.oneDistrict = { ...val };
    },
    close() {
      this.$emit("close");
    },

    //重置弹出信息
    reset() {
      this.oneDistrict = this.initDistrict();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // create
          if (!this.oneDistrict.id) {
            console.log("this.oneDistrict", this.oneDistrict);
            this.$post("inspection/unit", { ...this.oneDistrict }).then(() => {
              this.isVisible = false;
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.$emit("success");
            });
          }
          // update
          else {
            this.$put("inspection/unit", { ...this.oneDistrict }).then(() => {
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.updateSuccess"),
                type: "success",
              });
              this.$emit("success");
            });
          }
        } else {
          return false;
        }
      });
    },
    //初始化 表单
    initDistrict() {
      return {
        id: "",
        name: "",
        shorter: "",
        email: "",
        mobile: "",
        user: "",
        sort: "区级",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
// 添加报告对话框
/deep/ .district_dlg {
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