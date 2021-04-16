<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      custom-class="correct_dlg"
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
          :model="correct"
          label-position="right"
          label-width="130px"
        >
          <el-form-item label="届次" prop="session">
            <el-select
              v-model.number="correct.session"
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
              v-model.number="correct.round"
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
              v-model.number="correct.year"
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
              v-model.number="correct.groupName"
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

          <el-form-item label="巡察对象" prop="unitId">
            <el-select
              v-model="correct.unitId"
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

          <el-form-item label="可移交问题数" prop="problemNum">
            <el-input
              style="width: 200px"
              placeholder="请输入内容"
              v-model.number="correct.problemNum"
              clearable
            >
            </el-input>
          </el-form-item>

          <el-form-item label="形成报告时间" prop="">
            <el-date-picker
              v-model="correct.reportTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <!-- <el-form-item label="移交立行立改问题" prop="">
            <el-upload
              ref="problem"
              style="display: inline"
              :data="problemfile"
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
          </el-form-item>

          <el-form-item label="整改情况报告" prop="">
            <el-upload
              ref="rectreport"
              style="display: inline"
              :data="rectreportfile"
              :file-list="fileList1"
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
              ref="problem"
              style="display: inline"
              :data="problemfile"
              :file-list="fileList"
              :auto-upload="false"
              :on-success="onSuccess"
              :on-progress="onProgress"
              :on-change="onChange"
              :on-remove="onRemove"
              :action="getURL()"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="blue">移交立行立改问题</span>
          </div>
          <div class="upload_leader">
            <el-upload
              ref="rectreport"
              style="display: inline"
              :data="rectreportfile"
              :file-list="fileList1"
              :auto-upload="false"
              :on-success="onSuccess1"
              :on-progress="onProgress1"
              :on-change="onChange1"
              :on-remove="onRemove1"
              :action="getURL()"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="orange">整改情况报告</span>
          </div>
          <!-- <div class="upload_material">
            <el-upload
              ref="material"
              style="display: inline"
              :data="materialfile"
              :file-list="fileList2"
              :auto-upload="false"
              :on-success="onSuccess"
              :action="getURL()"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="green">办结材料</span>
          </div> -->
        </div>

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
import { mapState, mapMutations } from 'vuex';
export default {
  name: "correctAdd",
  props: {
    lixingType: {
      type: Number,
    },
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
      width: "470px",
      correct: {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        problemNum: "",
        reportTime: "",
      },
      type: 4,
      // rounds: [],
      fileList: [],
      fileList1: [],
      fileList2: [],
      fileFlag: true,
      fileFlag1: true,
      handoverTime: "",
      endtime: "",
      problemfile: {
        type: "problem",
      },
      rectreportfile: {
        type: "rectreport",
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
        problemNum: [
          {
            required: true,
            message: "可移交问题数不能为空",
            trigger: "blur",
          },
          {
            type: "number",
            message: "可移交问题数必须为数字值",
            trigger: "blur",
          },
        ],
        // patrolTime :  {
        //     required: true,
        //     message: "届次",
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
    // "correct.session"(newval) {
    //   this.$get("/inspection/patrol/getRound", newval).then((r) => {
    //     this.rounds = r.data.data;
    //   });
    // },
  },

  methods: {
    close() {
      this.$emit("close");
    },
    //表单提交
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$np.start();
          await this.$post("inspection/patrol", {
            session: this.correct.session,
            round: this.correct.round,
            year: this.correct.year,
            unitName: String(this.correct.unitId),
            groupName: this.correct.groupName,
            type: this.type,
          }).then((r) => {
            if (r.data.code === 20000) {
              this.setFile(r);
            }
          }).catch(error => {
            this.$np.done();
          });
          // this.$refs.special.submit();
          // this.$refs.leader.submit();
          // this.$emit("success")
          this.$get("/inspection/lixing/add_or_upd", {
            problemNum: this.correct.problemNum,
            id: this.problemfile.lixingid,
            patrolId: this.problemfile.patrolunitid,
            reportTime: this.correct.reportTime,
            lixingType: this.lixingType,
          }).then(async (r) => {
            console.log("r", r);
            if (r.data.code === 20000) {
              await this.$refs.problem.submit();
              await this.$refs.rectreport.submit();
              // this.$message({
              //   message: "创建成功",
              //   type: "success",
              // });
              //添加完成 置空表单
              if(!this.fileList.length && !this.fileList1.length) {
                this.$np.done();
                this.$message({
                  message: "创建成功",
                  type: "success",
                });
                this.$emit("success");
              }
            }
          }).catch(error => {
            this.$np.done();
            this.$message.error("创建失败")
          });
        } else {
          return false;
        }
      });
    },
    onSuccess() {
      this.fileFlag = true
      if(this.fileFlag && this.fileFlag1) {
        this.$np.done();
        this.$message({
          message: "创建成功",
          type: "success",
        });
        this.$emit("success");
      }
    },
    onSuccess1() {
      this.fileFlag1 = true;
      if(this.fileFlag && this.fileFlag1) {
        this.$np.done();
        this.$message({
          message: "创建成功",
          type: "success",
        });
        this.$emit("success");
      }
    },
    onProgress() {
      this.fileFlag = false;
    },
    onProgress1() {
      this.fileFlag1 = false;
    },
    onChange(file, fileList) {
      this.fileList = fileList;
    },
    onChange1(file, fileList1) {
      this.fileList1 = fileList1;
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    onRemove1(file, fileList1) {
      this.fileList1 = fileList1;
    },
    init() {
      this.correct = {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        problemNum: "",
        reportTime: "",
      };
      this.fileList = [];
      this.fileList1 = [];
      this.fileList2 = [];
    },
    getURL() {
      return globalConfig.baseURL + "inspection/lixing/upload";
    },
    //设置上传文件的参数
    setFile(r) {
      this.problemfile.patrolunitid = r.data.data.patrolUnitId;
      this.problemfile.lixingid = r.data.data.lixingId;
      this.rectreportfile.patrolunitid = r.data.data.patrolUnitId;
      this.rectreportfile.lixingid = r.data.data.lixingId;
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
// 添加报告对话框
/deep/ .correct_dlg {
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
</style>
