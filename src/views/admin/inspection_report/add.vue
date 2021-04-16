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
          class="dialog_form"
          :rules="rules"
          :model="inspection"
          label-position="right"
          label-width="120px"
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

          <el-form-item label="年度" prop="year">
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

          <el-form-item label="被巡察对象" prop="unitId">
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

          <!-- <el-form-item label="承办部门" prop="unitId">
            <el-input
              style="width: 200px"
              placeholder="请输入内容"
              v-model="inspection.bumen"
              clearable
            >
            </el-input>
          </el-form-item> -->

          <!-- <el-form-item label="领导小组会报告" prop="">
            <el-upload
              ref="special"
              style="display: inline"
              :data="specialfile"
              :file-list="fileList1"
              :auto-upload="false"
              :http-request="httpRequest1"
              :on-success="onSuccess"
              :action="getURL()"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
          </el-form-item>

          <el-form-item label="书记专题会报告" prop="">
            <el-upload
              ref="leader"
              style="display: inline"
              :data="leaderfile"
              :file-list="fileList2"
              :auto-upload="false"
              :on-success="onSuccess"
              :action="getURL()"
              :http-request="httpRequest2"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
          </el-form-item>

          <el-form-item label="反馈报告" prop="">
            <el-upload
              ref="material"
              style="display: inline"
              :data="materialfile"
              :file-list="fileList3"
              :auto-upload="false"
              :on-success="onSuccess"
              :action="getURL()"
              :http-request="httpRequest3"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
          </el-form-item> -->

          <!-- <el-form-item label="报告上传时间" prop="creatTime">
            <el-date-picker
              v-model="inspection.creatTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item> -->

          <el-form-item label="巡察开始时间" prop="patrolTime">
            <el-date-picker
              v-model="inspection.patrolTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="巡察结束时间" prop="endTime">
            <el-date-picker
              v-model="inspection.endTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>

        <!-- 上传文件区域 -->
        <div class="dialog_upload">
          <div class="upload_special">
            <el-upload
              ref="special"
              style="display: inline"
              :data="specialfile"
              :file-list="fileList1"
              :auto-upload="false"
              :http-request="httpRequest1"
              :on-success="onSuccess1"
              :on-change="onChange1"
              :on-remove="onRemove1"
              :action="getURL()"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="blue">领导小组会报告</span>
          </div>
          <div class="upload_leader">
            <el-upload
              ref="leader"
              style="display: inline"
              :data="leaderfile"
              :file-list="fileList2"
              :auto-upload="false"
              :on-success="onSuccess2"
              :on-change="onChange2"
              :on-remove="onRemove2"
              :action="getURL()"
              :http-request="httpRequest2"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="orange">书记专题会报告</span>
          </div>
          <div class="upload_leader">
            <el-upload
              ref="team"
              style="display: inline"
              :data="teamfile"
              :file-list="fileList12"
              :auto-upload="false"
              :on-success="onSuccess12"
              :on-change="onChange12"
              :on-remove="onRemove12"
              :action="getURL()"
              :http-request="httpRequest12"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="orange">向班子反馈报告</span>
          </div>
          <div class="upload_material">
            <el-upload
              ref="material"
              style="display: inline"
              :data="materialfile"
              :file-list="fileList3"
              :auto-upload="false"
              :on-success="onSuccess3"
              :on-change="onChange3"
              :on-remove="onRemove3"
              :action="getURL()"
              :http-request="httpRequest3"
              :limit="1"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="green">向负责人反馈报告</span>
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
  name: "inspectionAdd",
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
      width: "450px",
      inspection: {
        session: "",
        round: "",
        year: "",
        unitId: "",
        groupName: "",
        creatTime: "",
      },
      // rounds:[],
      type: 1,
      file: {}, //上传的对象
      fileList1: [],
      fileList2: [],
      fileList12: [],
      fileList3: [],
      fileFlag1: true,
      fileFlag2: true,
      fileFlag12: true,
      fileFlag3: true,
      handoverTime: "",
      endtime: "",
      specialfile: {
        type: "special",
      },
      leaderfile: {
        type: "leader",
      },
      teamfile: {
        type: "team",
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
    // "inspection.session"(newval) {
    //   console.log("newval",newval)
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
        // creatTime: "",
        patrolTime: "",
        // handoverTime:"",
        endTime:"",
        // endTime1:"",
      };
      this.fileList1 = [];
      this.fileList2 = [];
      this.fileList12 = [];
      this.fileList3 = [];
    },
    //上传文件
    async httpRequest1(param) {
      this.fileFlag1 = false;
      var formdata = new FormData();
      formdata.append("file1", param.file);
      formdata.append("reportId", this.file.reportId);
      await this.$upload("/inspection/t-report/upload", formdata).then((r) => {
        if (r.data.code === 20000) {
          this.fileFlag1 = true;
        }
      });
    },
    async httpRequest2(param) {
      this.fileFlag2 = false;
      var formdata = new FormData();
      formdata.append("file2", param.file);
      formdata.append("reportId", this.file.reportId);
      await this.$upload("/inspection/t-report/upload", formdata).then((r) => {
        if (r.data.code === 20000) {
          this.fileFlag2 = true;
        }
      });
    },
    async httpRequest12(param) {
      this.fileFlag12 = false;
      var formdata = new FormData();
      formdata.append("file12", param.file);
      formdata.append("reportId", this.file.reportId);
      await this.$upload("/inspection/t-report/upload", formdata).then((r) => {
        if (r.data.code === 20000) {
          this.fileFlag12 = true;
        }
      });
    },
    async httpRequest3(param) {
      this.fileFlag3 = false;
      let file = param.file; // 相当于input里取得的files
      var formdata = new FormData();
      formdata.append("file3", param.file);
      formdata.append("reportId", this.file.reportId);
      await this.$upload("/inspection/t-report/upload", formdata).then((r) => {
        if (r.data.code === 20000) {
          this.fileFlag3 = true;
        }
      });
    },
    //表单提交
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.$np.start();
          await this.$post("inspection/patrol", {
            session: this.inspection.session,
            round: this.inspection.round,
            year: this.inspection.year,
            unitName: String(this.inspection.unitId),
            groupName: this.inspection.groupName,
            patrolTime:this.inspection.patrolTime,
            endTime:this.inspection.endTime,
            type: this.type,
          }).then((r) => {
            if (r.data.code === 20000) {
              this.setFile(r);
            }
          }).catch(error => {
            this.$np.done();
          });
          await this.$refs.special.submit();
          await this.$refs.leader.submit();
          await this.$refs.team.submit();
          await this.$refs.material.submit();
          // setTimeout(() => {
          //   this.$emit("success");
          // })
          if(!this.fileList1.length && !this.fileList2.length && !this.fileList12.length && !this.fileList3.length) {
            this.$np.done();
            this.$message({
              message: "创建成功",
              type: "success",
            });
            this.$emit("success");
          }

          // this.$put("/inspection/t-report",{
          //     id:this.file.reportId,
          //     patrolId:this.file.patrolId,
          //     creatTime:this.inspection.creatTime
          //   }).then((r)=>{
          //     if(r.data.code === 20000 ){
          //       this.$message.success("修改成功")
          //       this.$emit("success");
          //     }
          //   })

          // this.$get("/inspection/special/add_or_upd", {
          //   handoverTime:this.inspection.handoverTime,
          //   endtime:this.inspection.endTime1,
          //   id: this.inspection.specialid,
          //   patrolId: this.inspection.patrolid,
          //   uderDepartment: this.inspection.bumen,
          // }).then((r) => {
          //   if (r.data.code === 20000) {
          //     this.$refs.special.submit();
          //     this.$refs.leader.submit();
          //     this.$refs.material.submit();
          //     this.$message({
          //       message: "创建巡察任务成功",
          //       type: "success",
          //     });
          //     console.log("完成创建")

          //     //添加完成 置空表单

          //     this.fileList1=[]
          //     this.fileList2=[]
          //     this.fileList3=[]
          //     this.$emit("success");
          //     this.inspection=this.initInspection()

          //   }
          // });
        } else {
          return false;
        }
      });
    },
    onSuccess1() {
      if(this.fileFlag1 && this.fileFlag2 && this.fileFlag12 && this.fileFlag3) {
        this.$np.done();
        this.$message({
          message: "创建成功",
          type: "success",
        });
        this.$emit("success");
      }
    },
    onSuccess2() {
      if(this.fileFlag1 && this.fileFlag2 && this.fileFlag12 && this.fileFlag3) {
        this.$np.done();
        this.$message({
          message: "创建成功",
          type: "success",
        });
        this.$emit("success");
      }
    },
    onSuccess12() {
      if(this.fileFlag1 && this.fileFlag2 && this.fileFlag12 && this.fileFlag3) {
        this.$np.done();
        this.$message({
          message: "创建成功",
          type: "success",
        });
        this.$emit("success");
      }
    },
    onSuccess3() {
      if(this.fileFlag1 && this.fileFlag2 && this.fileFlag12 && this.fileFlag3) {
        this.$np.done();
        this.$message({
          message: "创建成功",
          type: "success",
        });
        this.$emit("success");
      }
    },
    onChange1(file, fileList1) {
      this.fileList1 = fileList1;
    },
    onChange2(file, fileList2) {
      this.fileList2 = fileList2;
    },
    onChange12(file, fileList12) {
      this.fileList12 = fileList12;
    },
    onChange3(file, fileList3) {
      this.fileList3 = fileList3;
    },
    onRemove1(file, fileList1) {
      this.fileList1 = fileList1;
    },
    onRemove2(file, fileList2) {
      this.fileList2 = fileList2;
    },
    onRemove12(file, fileList12) {
      this.fileList12 = fileList12;
    },
    onRemove3(file, fileList3) {
      this.fileList3 = fileList3;
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
      return globalConfig.baseURL + "inspection/special/upload";
    },
    //设置上传文件的参数
    setFile(r) {
      this.file.reportId = r.data.data.reportId;
      this.file.patrolId = r.data.data.patrolUnitId;
    },
    reset() {
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
      this.fileFlag1 = true;
      this.fileFlag2 = true;
      this.fileFlag12 = true;
      this.fileFlag3 = true;
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

// 添加巡察报告对话框
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
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    border: 1px solid #F1F3F6;

    // 上传文件区域
    .dialog_upload {
      width: 80%;
      // height: 200px;
      padding: 20px 0 10px 0;
      background: #EEF8FF;
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
          color: #0089FF;
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
          color: #FF6500;
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
          color: #00991A;
        }
      }
      // .el-button
    }

    .dialog-footer {
      margin-top: 10px;
    }

    .dialog_form {
      margin-left: -20px;
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
