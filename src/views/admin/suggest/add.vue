<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="suggest_dlg"
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
          :rules="rules"
          :model="inspection"
          label-position="right"
          label-width="120px"
          class="form_height"
        >
          <el-form-item label="届次" prop="session">
            <el-select
              v-model.number="inspection.session"
              class="filter-item"
              clearable
              placeholder="请选择届次"
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

          <el-form-item label="轮次" prop="round">
            <el-select
              v-model.number="inspection.round"
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

          <el-form-item label="年次" prop="year">
            <el-select
              v-model.number="inspection.year"
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

          <el-form-item label="巡察组" prop="groupName">
            <el-select
              v-model.number="inspection.groupName"
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

          <el-form-item label="被巡察单位" prop="unitId">
            <el-select
              v-model="inspection.unitId"
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

          <el-form-item label="移交单位" prop="transferingUnit">
            <el-input
              v-model.number="inspection.transferingUnit"
              size="small"
              class="input"
            />
            <!-- <el-select
              v-model="inspection.transferingUnit"
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
            </el-select> -->
          </el-form-item>

          <el-form-item label="移交时间" prop="transferingTime">
            <el-date-picker
              v-model="inspection.transferingTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="移交问题建议数" prop="transferingNum">
            <el-input
              v-model.number="inspection.transferingNum"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="是否办结" prop="end">
            <el-select
              v-model="inspection.end"
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
            <el-input v-model="inspection.message" size="small" class="input" />
          </el-form-item>

          <el-form-item label="成果运用情况" prop="information">
            <el-input
              v-model="inspection.information"
              size="small"
              class="input"
            />
          </el-form-item>

          <el-form-item label="期限提醒" prop="remind">
            <el-select
              v-model="inspection.remind"
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

          <!-- <el-form-item label="移交具体问题建议" prop="">
            <el-upload
              ref="special"
              style="display: inline"
              :data="suggestfile"
              :file-list="fileList"
              :auto-upload="false"
              :on-success="onSuccess"
              :action="getURL()"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
          </el-form-item> -->
        </el-form>

        <!-- 上传文件区域 -->
        <div class="dialog_upload">
          <div class="upload_special">
            <el-upload
              ref="special"
              style="display: inline"
              :data="suggestfile"
              :file-list="fileList"
              :auto-upload="false"
              :on-success="onSuccess"
              :on-change="onChange"
              :on-remove="onRemove"
              :action="getURL()"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="blue">移交具体问题建议</span>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button
            type="warning"
            plain
            @click="(isVisible = false), init()"
            >取消</el-button
          >
          <el-button type="primary" plain @click="submitForm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: "suggestAdd",
  props: {
    title: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    sessions: {
      type: Array,
      default: "",
    },
    // rounds: {
    //   type: Array,
    //   default: "",
    // },
    years: {
      type: Array,
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
      inspection: {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        transferingUnit: "",
        transferingTime: "",
        transferingNum: "",
        end: "",
        message: "",
        information: "",
        remind: ""
      },
      // rounds: [],
      suggestfile: {},
      type: 6,
      file: {
        id: ''
      }, //上传的对象
      fileList: [],
      handoverTime: "",
      endtime: "",
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
        unitId: {
          required: true,
          message: "巡察对象不能为空",
          trigger: "blur",
        },
        // creatTime :  {
        //     required: true,
        //     message: "报告上传时间不能为空",
        //     trigger: "blur",
        // },
        // endTime :  {
        //     required: true,
        //     message: "届次",
        //     trigger: "blur",
        // },
      },
    };
  },
  mounted() {
    //    this.fetch()
  },
  watch: {
    // "special.patrolTime": {
    //   handler(newValue) {
    //     console.log("special.patrolTime", newValue);
    //     // this.handoverTime = this.time(newValue);
    //     console.log("this.handoverTime", this.handoverTime);
    //   },
    // //   deep: true,
    // },

    // "inspection.session"(newval) {
    //   this.$get("/inspection/patrol/getRound", newval).then((r) => {
    //     this.rounds = r.data.data;
    //   });
    // },
  },

  methods: {
    close() {
      this.$emit("close");
    },
    init() {
      this.inspection = {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        transferingUnit: "",
        transferingTime: "",
        transferingNum: "",
        end: "",
        message: "",
        information: "",
        remind: ""
        // patrolTime: "",
        // handoverTime:"",
        // endTime:"",
        // endTime1:"",
      };
      this.fileList = [];
    },
    //表单提交
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$np.start();
          await this.$post("inspection/patrol", {
            session: this.inspection.session,
            round: this.inspection.round,
            year: this.inspection.year,
            unitName: String(this.inspection.unitId),
            groupName: this.inspection.groupName,
            type: this.type,
          }).then((r) => {
            if (r.data.code === 20000) {
              console.log("r", r)
              this.setFile(r);
            }
          }).catch(error => {
            this.$np.done();
          });
          
          this.$put("/inspection/t-proposal", {
            patrolId: this.file.patrolId,
            end: this.inspection.end,
            information: this.inspection.information,
            message: this.inspection.message,
            remind: this.inspection.remind,
            transferingNum: this.inspection.transferingNum,
            transferingTime: this.inspection.transferingTime,
            transferingUnit: this.inspection.transferingUnit,
            id: this.file.id
          }).then(async(r) => {
            if (r.data.code === 20000) {
              await this.$refs.special.submit();
              if(!this.fileList.length) {
                this.$np.done();
                this.$message.success("添加成功")
                this.$emit("success");
              }
            }
          }).catch(error => {
            this.$np.done();
            this.$message.error("添加失败")
          })
        } else {
          return false;
        }
      });
    },
    onSuccess() {
      this.$np.done();
      this.$message.success("添加成功")
      this.$emit("success");
    },
    onChange(file, fileList) {
      this.fileList = fileList;
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    initInspection() {
      return {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        // patrolTime: "",
        handoverTime: "",
        endTime: "",
        endTime1: "",
      };
    },
    getURL() {
      return globalConfig.baseURL + "inspection/t-proposal/upload";
    },
    //设置上传文件的参数
    setFile(r) {
      console.log(r);
      this.suggestfile.proposalId = r.data.data.proposalId;
      this.file.id = r.data.data.proposalId;
      this.file.patrolId = r.data.data.patrolUnitId;
    },
    reset() {
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
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
};
</script>
<style lang="scss" scoped>
// /deep/ .el-dialog__body {
//   padding: 30px 100px;
// }
// 添加报告对话框
/deep/ .suggest_dlg {
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

    // 上传文件区域
    .dialog_upload {
      width: 80%;
      // height: 200px;
      padding: 20px 0 10px 0;
      background: #eef8ff;
      border-radius: 4px;

      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      div {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        span {
          margin: 5px 0 10px 0;
        }
      }

      .upload_special {
        .el-button {
          background: rgb(36, 135, 255);
          border: none;

          &:hover {
            background: rgb(3, 193, 255);
          }
        }

        .blue {
          color: #0089ff;
        }
      }
      .upload_leader {
        .el-button {
          background: rgb(255, 81, 14);
          border: none;

          &:hover {
            background: rgb(255, 152, 1);
          }
        }

        .orange {
          color: #ff6500;
        }
      }
      .upload_material {
        .el-button {
          background: rgb(55, 165, 0);
          border: none;

          &:hover {
            background: rgb(106, 210, 3);
          }
        }

        .green {
          color: #00991a;
        }
      }
      // .el-button
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-form-item__error {
      padding-top: 0;
    }

    .dialog-footer {
      margin-top: 10px;
    }

    .dialog_form {
      margin-left: -20px;
    }
  }
}
.input {
  width: 200px;
}
</style>
