<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="people_editdlg"
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
          :model="onepeople"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="onepeople.username" />
          </el-form-item>
          <el-form-item label="密码" prop="editPassword" class="edit_password">
            <el-input v-model="onepeople.editPassword" :disabled="true" />
            <img :src="imgEdit" class="img" @click="editPassword" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="onepeople.name" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="onepeople.phone" />
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              placeholder="请选择角色"
              v-model="onepeople.roleId"
              clearable
              size="medium"
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
              v-model="onepeople.departmentId"
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

        <edit-password
          ref="editpassword"
          :title="editdialog.title"
          :editlog-visible="editdialog.isVisible"
          @close="editClose"
          @success="close"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import editPassword from './editpassword'

export default {
  name: '',
  components: { editPassword },
  props: {
    title: {
      type: String,
      default: "",
    },
    dialogVisible: {
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
      editdialog: {
        isVisible: false,
        title: "修改密码",
      },
      modal: false,
      width: "450px",
      onepeople: this.initpeople(),
      rules: {
        username: {
          required: true,
          message: "用户名不能为空",
          trigger: "blur",
        },
        editPassword: {
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
      imgEdit: require('../../../../assets/icon_img/edit.png'),
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
    setpeople(val) {
      this.onepeople.beforeDepartmentId = val.department.id;
      this.onepeople.departmentId = val.department.id;
      this.onepeople.id = val.id;
      this.onepeople.name = val.name;
      this.onepeople.password = val.password;
      this.onepeople.phone = val.phone;
      this.onepeople.beforeRoleId = val.roles[0].roleId;
      this.onepeople.roleId = val.roles[0].roleId;
      this.onepeople.state = val.state;
      this.onepeople.username = val.username;
      // console.log("onepeople:",this.onepeople);
    },
    initpeople() {
      return {
        beforeDepartmentId: null,
        departmentId: null,
        id: null,
        name: '',
        editPassword: '******',
        password: null,
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
    editClose() {
      this.$emit("close");
      this.editdialog.isVisible = false;
    },
    editPassword() {
      this.$refs.editpassword.setId(this.onepeople.id);
      this.editdialog.isVisible = true;
    },

    //重置弹窗
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.onepeople = this.initpeople();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    //提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$put("/inspection/t-user", { ...this.onepeople }).then(() => {
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
.img {
  display: inline-block;
  vertical-align: middle;
  width: 25px;
  height: 25px;
  margin-left: 10px;
}
// 添加对话框
/deep/ .people_editdlg {
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
      
      img {
        cursor: pointer;
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