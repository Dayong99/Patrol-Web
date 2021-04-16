<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      custom-class="report_dlg"
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
          :model="special"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="届次" prop="session">
            <el-select
              v-model.number="special.session"
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
              v-model.number="special.round"
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

          <el-form-item label="年度" prop="year">
            <el-select
              v-model.number="special.year"
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
              v-model.number="special.groupName"
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
              v-model="special.unitId"
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

          <el-form-item label="承办部门" prop="unitId">
            <el-input
              style="width: 200px"
              placeholder="请输入内容"
              v-model="special.bumen"
              clearable
            >
            </el-input>
          </el-form-item>

          <!-- <el-form-item label="巡察开始时间" prop="patrolTime">
            <el-date-picker
              v-model="special.patrolTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item> -->

          <!-- <el-form-item label="巡察结束时间" prop="endTime">
            <el-date-picker
              v-model="special.endTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item> -->

          <el-form-item label="报告移交时间" prop="handoverTime">
            <el-date-picker
              v-model="special.handoverTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="报告办理期限" prop="endTime1">
            <el-date-picker
              v-model="special.endTime1"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <!-- <el-form-item label="专题报告" prop="">
            <el-upload
              ref="special"
              style="display: inline"
              :data="specialfile"
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

          <el-form-item label="领导批示" prop="">
            <el-upload
              ref="leader"
              style="display: inline"
              :data="leaderfile"
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
          </el-form-item>

          <el-form-item label="办结材料" prop="">
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
          </el-form-item> -->
        </el-form>

        <!-- 上传文件区域 -->
        <div class="dialog_upload">
          <div class="upload_special">
            <el-upload
              ref="special"
              style="display: inline"
              :data="specialfile"
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
            <span class="blue">专题报告</span>
          </div>
          <div class="upload_leader">
            <el-upload
              ref="leader"
              style="display: inline"
              :data="leaderfile"
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
            <span class="orange">领导批示</span>
          </div>
          <div class="upload_material">
            <el-upload
              ref="material"
              style="display: inline"
              :data="materialfile"
              :file-list="fileList2"
              :auto-upload="false"
              :on-success="onSuccess2"
              :on-progress="onProgress2"
              :on-change="onChange2"
              :on-remove="onRemove2"
              :action="getURL()"
              multiple
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="green">办结材料</span>
          </div>
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
  name: "specialAdd",
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
      special: {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        // patrolTime: "",
        handoverTime: "",
        // endTime: "",
        endTime1: "",
      },
      type: 3,
      // rounds: [],
      fileList: [],
      fileList1: [],
      fileList2: [],
      fileFlag: true,
      fileFlag1: true,
      fileFlag2: true,
      handoverTime: "",
      endtime: "",
      specialfile: {
        type: "special",
      },
      leaderfile: {
        type: "leader",
      },
      materialfile: {
        type: "material",
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
        handoverTime: {
          required: true,
          message: "报告移交时间不能为空",
          trigger: "blur",
        },
        endTime1: {
          required: true,
          message: "报告办理期限不能为空",
          trigger: "blur",
        },
      },
    };
  },
  mounted() {
    //    this.fetch()
  },
  watch: {
    // "special.session"(newval) {
    //   this.$get("/inspection/patrol/getRound", newval).then((r) => {
    //     this.rounds = r.data.data;
    //   });
    // },
  },

  methods: {
    close() {
      this.$emit("close");
    },
    time(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    //表单提交
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$np.start();
          await this.$post("inspection/patrol", {
            session: this.special.session,
            round: this.special.round,
            year: this.special.year,
            unitName: String(this.special.unitId),
            groupName: this.special.groupName,
            // patrolTime: this.special.patrolTime,
            // endTime: this.special.endTime,
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
          this.$get("/inspection/special/add_or_upd", {
            handoverTime: this.special.handoverTime,
            endtime: this.special.endTime1,
            id: this.specialfile.specialid,
            patrolId: this.specialfile.patrolunitid,
            uderDepartment: this.special.bumen,
          }).then(async (r) => {
            console.log("r", r);
            if (r.data.code === 20000) {
              await this.$refs.special.submit();
              await this.$refs.leader.submit();
              await this.$refs.material.submit();
              
              //添加完成 置空表单
              if(!this.fileList.length && !this.fileList1.length && !this.fileList2.length) {
                this.$np.done();
                this.$message({
                  message: "创建巡察任务成功",
                  type: "success",
                });
                this.$emit("success");
              }
              this.special = this.initSpecial();
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
      this.fileFlag = true;
      if(this.fileFlag && this.fileFlag1 && this.fileFlag2) {
        this.$np.done();
        this.$message({
          message: "创建巡察任务成功",
          type: "success",
        });
        this.$emit("success");
      }
    },
    onSuccess1() {
      this.fileFlag1 = true;
      if(this.fileFlag && this.fileFlag1 && this.fileFlag2) {
        this.$np.done();
        this.$message({
          message: "创建巡察任务成功",
          type: "success",
        });
        this.$emit("success");
      }
    },
    onSuccess2() {
      this.fileFlag2 = true;
      if(this.fileFlag && this.fileFlag1 && this.fileFlag2) {
        this.$np.done();
        this.$message({
          message: "创建巡察任务成功",
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
    onProgress2() {
      this.fileFlag2 = false;
    },
    onChange(file, fileList) {
      this.fileList = fileList;
    },
    onChange1(file, fileList1) {
      this.fileList1 = fileList1;
    },
    onChange2(file, fileList2) {
      this.fileList2 = fileList2;
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    onRemove1(file, fileList1) {
      this.fileList1 = fileList1;
    },
    onRemove2(file, fileList2) {
      this.fileList2 = fileList2;
    },
    initSpecial() {
      return {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        // patrolTime: "",
        handoverTime: "",
        // endTime: "",
        endTime1: "",
      };
    },
    init() {
      this.special = {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        // patrolTime: "",
        handoverTime: "",
        // endTime: "",
        endTime1: "",
      };
      this.fileList = [];
      this.fileList1 = [];
      this.fileList2 = [];
    },
    getURL() {
      return globalConfig.baseURL + "inspection/special/upload";
    },
    //设置上传文件的参数
    setFile(r) {
      this.specialfile.patrolunitid = r.data.data.patrolUnitId;
      this.specialfile.specialid = r.data.data.specialId;
      this.leaderfile.patrolunitid = r.data.data.patrolUnitId;
      this.leaderfile.specialid = r.data.data.specialId;
      this.materialfile.patrolunitid = r.data.data.patrolUnitId;
      this.materialfile.specialid = r.data.data.specialId;
    },
    reset() {
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
      this.fileFlag = true;
      this.fileFlag1 = true;
      this.fileFlag2 = true;
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
    // getRounds: {
    //   get() {
    //     return this.rounds;
    //   },
    //   set() { },
    // },
  },
};
</script>
<style lang="scss" scoped>
// 添加报告对话框
/deep/ .report_dlg {
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
