<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="people_dlg"
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
          :model="newPeople"
          :rules="rules"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="newPeople.username"
              size="small"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="newPeople.password"
              size="small"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="newPeople.name"
              size="small"
              placeholder="请输入姓名"
            />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="newPeople.phone"
              size="small"
              placeholder="请输入电话"
            />
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              placeholder="请选择角色"
              v-model="newPeople.roleId"
              clearable
              size="small"
            >
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="departmentId">
            <el-select
              placeholder="请选择部门"
              v-model="newPeople.departmentId"
              clearable
              size="small"
            >
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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
    departmentList: {
      type: Array,
      default: [],
    },
    roleList: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      modal: false,
      width: "450px",
      height: 240,
      newPeople: this.initnewpeople(),
      rules: {
        username: {
          required: true,
          message: "用户名不能为空",
          trigger: "blur",
        },
        password: {
          required: true,
          message: "密码不能为空",
          trigger: "blur",
        },
        name: {
          required: true,
          message: "姓名不能为空",
          trigger: "blur",
        },
        phone: {
          required: true,
          message: "电话不能为空",
          trigger: "blur",
        },
        roleId: {
          required: true,
          message: "角色不能为空",
          trigger: "blur",
        },
        departmentId: {
          required: true,
          message: "部门不能为空",
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
    initnewpeople() {
      return {
        beforeDepartmentId: null,
        departmentId: null,
        id: null,
        name: '',
        password: '',
        phone: '',
        beforeRoleId: null,
        roleId: null,
        state: '',
        username: '',
      };
    },
    close() {
      this.$emit("close");
    },
    //重置弹窗
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.newPeople = this.initnewpeople();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.newPeople.id) {
            //create
            this.$post("/inspection/t-user", { ...this.newPeople }).then((r) => {
              if (r.data.code == 20000) {
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.createSuccess"),
                  type: "success",
                });
                this.$emit("success");
              } else if (r.data.code == 500) {
                this.$message({
                  message: "改用户已存在",
                  type: "warning",
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    // show() {
    // 	console.log("传：",this.newPeople);
    // },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  width: 200px;
}
// 添加对话框
/deep/ .people_dlg {
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