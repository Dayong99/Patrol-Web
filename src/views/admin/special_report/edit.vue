<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      custom-class="report_editdlg"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <span>{{ title }}</span>
      </div>

      <div class="dialog_content">
        <el-form
          ref="form"
          :model="onespecial"
          :rules="rules"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="届次" prop="session">
            <el-input v-model.number="onespecial.session" size="small" class="input" />
          </el-form-item>

          <el-form-item label="年度" prop="year">
            <el-input v-model.number="onespecial.year" size="small" class="input" />
          </el-form-item>

          <el-form-item label="轮次" prop="round">
            <!-- <el-input v-model.number="onespecial.round" size="small" class="input" /> -->
            <el-select
              v-model.number="onespecial.round"
              class="filter-item"
              clearable
              placeholder="请选择轮次"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in rounds"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="巡察组" prop="groupName">
            <el-select
              v-model.number="onespecial.groupName"
              class="filter-item"
              clearable
              placeholder="请选择巡察组"
              filterable
              default-first-option
            >
              <el-option
                v-for="item in searchGroups"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="问题涉及单位" prop="unitName">
            <el-select
              v-model="onespecial.unitName"
              class="filter-item"
              clearable
              placeholder="被巡察单位"
              filterable
              default-first-option
            >
              <el-option
                v-for="item in searchUnits"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="承办部门" prop="uderDepartment">
            <el-input
              v-model="onespecial.uderDepartment"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="移交时间" prop="handoverTime">
            <el-date-picker
              v-model="onespecial.handoverTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="办理期限" prop="endtime">
            <el-date-picker
              v-model="onespecial.endtime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
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
import { mapState, mapMutations } from 'vuex';
export default {
  name: "EditSpecial",
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
    // searchGroups: {
    //   type: Array,
    //   default: "",
    // },
    searchUnits: {
      type: Array,
      default: "",
    },
  },
  data() {
    return {
      width: "450px",
      onespecial: {
        session: "",
        round: "",
        year: "",
        unitName: "",
        groupName: "",
        uderDepartment: "",
        handoverTime: "",
        endtime: "",
      },
      rules: {
        session: [
          {
            required: true,
            message: "届次不能为空",
            trigger: "blur",
          },
          {
            type: "number",
            message: "届次必须为数字值",
            trigger: "blur",
          },
        ],
        round: [
          {
            required: true,
            message: "轮次不能为空",
            trigger: "blur",
          },
          {
            type: "number",
            message: "届次必须为数字值",
            trigger: "blur",
          },
        ],
        year: [
          {
            required: true,
            message: "年次不能为空",
            trigger: "blur",
          },
           {
            type: "number",
            message: "年次必须为数字值",
            trigger: "blur",
          },
        ],
        groupName: [
          {
            required: true,
            message: "巡察组不能为空",
            trigger: "blur",
          },
          {
            type: "number",
            message: "巡察组必须为数字值",
            trigger: "blur",
          },
        ],
        unitName: {
          required: true,
          message: "巡察对象不能为空",
          trigger: "blur",
        },
        uderDepartment: {
          required: true,
          message: "巡察部门不能为空",
          trigger: "blur",
        },
        handoverTime: {
          required: true,
          message: "移交时间不能为空",
          trigger: "blur",
        },
        endtime: {
          required: true,
          message: "办理期限不能为空",
          trigger: "blur",
        },
      },
    };
  },
  computed: {
    ...mapState({
      rounds: state => state.totalData.rounds,
      searchGroups: state => state.totalData.searchGroups,
    }),

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
    getSpecial(val) {
      this.onespecial.id = val.id;
      this.onespecial.session = val.session;
      this.onespecial.year = val.year;
      this.onespecial.round = val.round;
      this.onespecial.unitName = val.unitName;
      this.onespecial.groupName = val.groupName;
      this.onespecial.specialId = val.special.id;
      this.onespecial.uderDepartment = val.special.uderDepartment;
      this.onespecial.handoverTime = val.special.handoverTime;
      this.onespecial.endtime = val.special.endtime;
      this.onespecial.patrolUnitId = val.patrolunitid;
      this.onespecial.type = 3;
    },
    close() {
      this.$emit("close");
    },

    //重置弹出信息
    reset() {
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.$put("/inspection/patrol/updateGroup", {
            ...this.onespecial,
          }).then((r) => {
            if (r.data.code === 20000) {
            }
          });
          this.$get("/inspection/special/add_or_upd", {
            endtime: this.onespecial.endtime,
            handoverTime: this.onespecial.handoverTime,
            id: this.onespecial.specialId,
            patrolId: this.onespecial.patrolUnitId,
            uderDepartment: this.onespecial.uderDepartment,
          }).then((r) => {
            if (r.data.code === 20000) {
              console.log("修改成功");
              this.$emit("success");
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// 添加报告对话框
/deep/ .report_editdlg {
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
.input {
  width: 200px;
}
</style>