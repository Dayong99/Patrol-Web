<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      custom-class="correct_editdlg"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <span>{{ title }}</span>
      </div>

      <div class="dialog_content">
        <el-form
          ref="form"
          :model="onecorrect"
          :rules="rules"
          label-position="right"
          label-width="150px"
        >
          <el-form-item label="届次" prop="session">
            <el-input
              v-model.number="onecorrect.session"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="年度" prop="year">
            <el-input
              v-model.number="onecorrect.year"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="轮次" prop="round">
            <!-- <el-input
              v-model.number="onecorrect.round"
              size="small"
              class="input"
            /> -->
            <el-select
              v-model.number="onecorrect.round"
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
              v-model.number="onecorrect.groupName"
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
              v-model="onecorrect.unitName"
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

          <el-form-item label="移交立行立改问题数" prop="problemNum">
            <el-input
              v-model.number="onecorrect.problemNum"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="形成报告时间" prop="uploadtime">
            <el-date-picker
              v-model="onecorrect.uploadtime"
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
  name: "EditCorrect",
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
      onecorrect: {
        session: "",
        round: "",
        year: "",
        unitName: "",
        groupName: "",
        problemNum: "",
        uploadtime: "",
        // endTime:"",
        // patrolTime:""
      },
      report: {},
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
            message: "轮次必须为数字值",
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
        problemNum: [
          {
            required: true,
            message: "立行立改问题数不能为空",
            trigger: "blur",
          },
          {
            type: "number",
            message: "可移交问题数必须为数字值",
            trigger: "blur",
          },
        ],
        uploadtime: {
          required: true,
          message: "移交时间不能为空",
          trigger: "blur",
        },
        // endTime: {
        //   required: true,
        //   message: "办理期限不能为空",
        //   trigger: "blur",
        // },
        // patrolTime: {
        //   required: true,
        //   message: "报告上传时间不能为空",
        //   trigger: "blur",
        // },
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
    getCorrect(val) {
      this.onecorrect.id = val.id;
      this.onecorrect.session = val.session;
      this.onecorrect.year = val.year;
      this.onecorrect.round = val.round;
      this.onecorrect.unitName = val.unitName;
      this.onecorrect.groupName = val.groupName;
      this.onecorrect.lixingId = val.lixing.id;
      this.onecorrect.patrolUnitId = val.patrolunitid;
      this.onecorrect.type = 4;
      this.onecorrect.uploadtime = val.lixing.reportTime;
      this.onecorrect.problemNum = val.lixing.problemNum;
      //   this.report.id = val.reportPatrolUnit.report.id
      //   this.report.patrolId = val.reportPatrolUnit.report.patrolId
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
            ...this.onecorrect,
          }).then((r) => {
            if (r.data.code == 20000) {
              // this.$message.success("修改成功")
              //  this.$emit("success");
            }
          });
          console.log("report", this.report);

          this.$get("/inspection/lixing/add_or_upd", {
            id: this.onecorrect.lixingId,
            patrolId: this.onecorrect.patrolUnitId,
            problemNum: this.onecorrect.problemNum,
            reportTime: this.onecorrect.uploadtime,
          }).then((r) => {
            if (r.data.code === 20000) {
              console.log("修改成功");
              this.$message.success("修改成功");
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
/deep/ .correct_editdlg {
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