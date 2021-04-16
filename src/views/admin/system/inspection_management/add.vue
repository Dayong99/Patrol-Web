<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="management_dlg"
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
          :rules="rules"
          :model="newInspection"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="届次" prop="session">
            <el-select
              v-model="newInspection.session"
              class="filter-item"
              clearable
              placeholder="请选择届次"
              @change="getRound"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in sessions"
                :key="item.session"
                :label="item.session"
                :value="item.session"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="年度" prop="year">
            <el-select
              v-model="newInspection.year"
              clearable
              placeholder="请选择年度"
              class="filter-item"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in years"
                :key="item.year"
                :label="item.year"
                :value="item.year"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="轮次" prop="round">
            <el-select
              v-model="newInspection.round"
              class="filter-item"
              clearable
              placeholder="请选择轮次"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in rounds"
                :key="item.round"
                :label="item.round"
                :value="item.round"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="巡察组" prop="groupName">
            <el-select
              v-model="newInspection.groupName"
              class="filter-item"
              clearable
              placeholder="请选择巡察组"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in groups"
                :key="item.id"
                :label="item.groupName + '组'"
                :value="item.groupName"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="被巡察单位" prop="unitName">
            <el-select
              v-model="newInspection.unitName"
              class="filter-item"
              clearable
              placeholder="被巡察单位"
              filterable
              default-first-option
            >
              <el-option
                v-for="item in units"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="巡察时间" prop="patrolTime">
            <el-date-picker
              v-model="newInspection.patrolTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="newInspection.endTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
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
  name: "inspectionAdd",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    sessions: {
      type: Array,
      default: "",
    },
    years: {
      type: Array,
      default: "",
    },
    groups: {
      type: Array,
      default: "",
    },
    units: {
      type: Array,
      default: "",
    },
  },
  data() {
    return {
      width: "500px",
      newInspection: this.initnewInspection(),
      rounds: [],
      rules: {
        session: {
          required: true,
          message: "届次不能为空",
          trigger: "blur",
        },
        round: {
          required: true,
          message: "轮次不能为空",
          trigger: "blur",
        },
        year: {
          required: true,
          message: "年次不能为空",
          trigger: "blur",
        },
        groupName: {
          required: true,
          message: "巡察组不能为空",
          trigger: "blur",
        },
      },
    };
  },
  mounted() {
    //    this.fetch()
  },

  methods: {
    initnewInspection() {
      return {
        id: null,
        session: null,
        round: null,
        year: null,
        groupName: null,
        unitName: null,
        patrolTime: null,
        endTime: null,
        type: null,
      }
    },
    getRound() {
      let params = {};
      params.session = this.newInspection.session;
      // console.log("届：",params.session);
      if (params.session != null && params.session != "") {
        this.$get("/inspection/patrol/getRound", { ...params }).then((r) => {
          if (r.data.code == 20000) {
            this.rounds = r.data.data;
            // console.log("轮次：",this.rounds);
          }
        });
      } else {
        this.rounds = [];
      }
    },
    close() {
      this.$emit("close");
    },
    //表单提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.newInspection.id) {
            this.$post("/inspection/patrol", { ...this.newInspection }).then(res => {
              if (res.data.code == 20000) {
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.createSuccess"),
                  type: "success",
                });
                this.$emit("success");
                this.$emit("getNewInfo");
              } else if (res.data.code == 50000) {
                this.$message.warning(res.data.message)
              }
            }).catch(err => {
              this.$message.error("创建巡察任务失败")
            });
          } else {
            alert("该巡察任务已存在！")
          }
        } else {
          return false;
        }
      });
    },

    reset() {
      this.newInspection = this.initnewInspection();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
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
};
</script>

<style lang="scss" scoped>
// 添加对话框
/deep/ .management_dlg {
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
