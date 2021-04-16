<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="suggest_editdlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <span>{{ title }}</span>
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <el-form
          ref="form"
          :model="onespecial"
          :rules="rules"
          label-position="right"
          label-width="120px"
          class="form_height"
        >
          <el-form-item label="届次" prop="session">
            <el-input
              v-model.number="onespecial.session"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="年度" prop="year">
            <el-input
              v-model.number="onespecial.year"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="轮次" prop="round">
            <!-- <el-input
              v-model.number="onespecial.round"
              size="small"
              class="input"
            /> -->
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

          <el-form-item label="移交对象" prop="transferingUnit">
            <el-select
              v-model="onespecial.transferingUnit"
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

          <el-form-item label="移交时间" prop="transferingTime">
            <el-date-picker
              v-model="onespecial.transferingTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="移交问题建议数" prop="transferingNum">
            <el-input
              v-model.number="onespecial.transferingNum"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="是否办结" prop="end">
            <el-select
              v-model="onespecial.end"
              class="filter-item"
              clearable
              placeholder="是否办结"
            >
              <el-option
                v-for="item in ends"
                :key="item.id"
                :label="item.message"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="具体办理情况" prop="message">
            <el-input v-model="onespecial.message" size="small" class="input" />
          </el-form-item>

          <el-form-item label="成果运用情况" prop="information">
            <el-input
              v-model="onespecial.information"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="期限提醒" prop="remind">
            <el-select
              v-model="onespecial.remind"
              class="filter-item"
              clearable
              placeholder="请选择期限提醒"
            >
              <el-option
                v-for="item in deadlines"
                :key="item.id"
                :label="item.message"
                :value="item.message"
              >
              </el-option>
            </el-select>
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
  name: "EditInspection",
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
      width: "480px",
      onespecial: {
        session: "",
        round: "",
        year: "",
        unitName: "",
        groupName: "",
        transferingUnit: "",
        transferingTime: "",
        transferingNum: "",
        end: "",
        message: "",
        information: "",
        remind: ""
      },
      ends: [
        {
          id: "0",
          message: "正在办理中",
        },
        {
          id: "1",
          message: "已办结",
        },
      ],
      deadlines: [
        {
          id: "0",
          message: "未到期",
        },
        {
          id: "1",
          message: "即将到期",
        },
        {
          id: "2",
          message: "已到期",
        },
      ],
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
        uderDepartment: {
          required: true,
          message: "巡察部门不能为空",
          trigger: "blur",
        },
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
    getPatrol(val) {
      this.onespecial.id = val.id;
      this.onespecial.session = val.session;
      this.onespecial.year = val.year;
      this.onespecial.round = val.round;
      this.onespecial.unitName = val.unitName;
      this.onespecial.groupName = val.groupName;
      this.onespecial.transferingUnit = val.proposal.transferingUnit
      this.onespecial.transferingTime = val.proposal.transferingTime
      this.onespecial.transferingNum = val.proposal.transferingNum
      this.onespecial.end = val.proposal.end
      this.onespecial.message = val.proposal.message
      this.onespecial.information = val.proposal.information
      this.onespecial.remind = val.proposal.remind
      this.onespecial.patrolUnitId = val.patrolunitid;
      this.onespecial.proposalId = val.proposal.id
      this.onespecial.type = 6;
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
          await this.$put("/inspection/patrol", {
            id: this.onespecial.id,
            session: this.onespecial.session,
            round: this.onespecial.round,
            year: this.onespecial.year,
            unitName: String(this.onespecial.unitName),
            groupName: this.onespecial.groupName,
            patrolUnitId: this.onespecial.patrolUnitId,
            type: this.type,
          }).then((r) => {
            if (r.data.code == 20000) {
              // this.$message.success("修改成功")
              //  this.$emit("success");
            }
          });

          this.$put("/inspection/t-proposal", {
            id: this.onespecial.proposalId,
            patrolId: this.onespecial.patrolUnitId,
            end: this.onespecial.end,
            information: this.onespecial.information,
            message: this.onespecial.message,
            remind: this.onespecial.remind,
            transferingNum: this.onespecial.transferingNum,
            transferingTime: this.onespecial.transferingTime,
            transferingUnit: this.onespecial.transferingUnit,
          }).then((r) => {
            if (r.data.code === 20000) {
              this.$message.success("修改成功");
              this.$emit("success");
            }
          });

          // this.$get("/inspection/special/add_or_upd",{
          //     endtime:this.onespecial.endtime,
          //     handoverTime:this.onespecial.handoverTime,
          //     id:this.onespecial.specialId,
          //     patrolId:this.onespecial.id,
          //     uderDepartment:this.onespecial.uderDepartment
          // }).then((r)=>{
          //     if(r.data.code === 20000){
          //     console.log('修改成功')
          //     this.$emit("success");
          //     }

          // })
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// /deep/ .el-dialog__body {
//   padding: 30px 150px;
// }
// 添加对话框
/deep/ .suggest_editdlg {
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

  // 内容区域
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

    // 设置最大高度
    .form_height {
      width: 85%;
      max-height: 450px;
      overflow-y: overlay;

      /* 设置滚动条的样式 */
      &::-webkit-scrollbar {
          width: 4px;
          background-color: #fff;
      }

      /* 滚动槽 */
      &::-webkit-scrollbar-track {
          border-radius: 10px;
      }

      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: rgba(194, 194, 194, 0.8);
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
.input {
  width: 200px;
}
</style>