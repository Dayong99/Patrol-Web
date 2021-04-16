<template>
  <div>
    <el-dialog
      :width="width"
      top="150px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="importRarDialog.isVisible"
      custom-class="import_dlg"
      @close="close"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <span>{{ importRarDialog.title }}</span>
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <el-form
          ref="uploadForm"
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
                :key="'reportsession_' + item.session"
                :label="'第' + item.session + '届'"
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
                :key="'reportround_' + item.value"
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
                :key="'reportyear_' + item.year"
                :label="item.year + '年'"
                :value="item.year"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="巡察组" prop="groupname">
            <el-select
              v-model.number="inspection.groupname"
              class="filter-item"
              clearable
              placeholder="请选择巡察组"
              filterable
              default-first-option
            >
              <el-option
                v-for="item in searchGroups"
                :key="'reportgroup_' + item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <!-- 上传文件区域 -->
        <div class="dialog_upload">
          <div class="upload_special">
            <el-upload
              ref="uploadReport"
              style="display: inline"
              :data="inspection"
              :file-list="fileList"
              :on-error="onError"
              :on-success="onSuccess"
              :action="getURL()"
              :on-progress="uploadProcess"
              :limit="1"
              :auto-upload="false"
              @close="changeVisible(false)"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="blue">导入文件</span>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button
            type="warning"
            plain
            @click="changeVisible(false)"
            >取消</el-button
          >
          <el-button type="primary" plain @click="submitForm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex"
export default {
  name: "importReport",
  data() {
    return {
      width: "450px",
      type: 3,
      fileList: [],
      fileList1: [],
      fileList2: [],
      handoverTime: "",
      endtime: "",
      specialfile: {
        type: "special",
      },
      // 进度条
      progress: false,
      uploadPercentage: Number(0),
      uploadStatus: 'success',

      // 上传压缩包参数
      inspection: {
        session: "",
        round: "",
        year: "",
        groupname: "",
      },
      sessions: [],
      // rounds: [],
      years: [],
      // searchGroups: [],

      rules: {
        session: [
          { required: true, message: '请选择届次', trigger: 'change' }
        ],
        year: [
          { required: true, message: '请选择年度', trigger: 'change' }
        ],
        round: [
          { required: true, message: '请选择轮次', trigger: 'change' }
        ],
        groupname: [
          { required: true, message: '请选择组', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.getParams()
  },
  mounted() {
  
  },
  watch: {
    'importRarDialog.isVisible': {
      handler(newval, oldval) {
        // 每次对话框打开，重置刷新通知
        if (newval) {
          this.reSetList();

          // 立行立改、立查立处分两部分
          if(this.importRarDialog.type == 'correctIndex') {
            this.$set(this.inspection, 'lixingType', 1)
          } else if(this.importRarDialog.type == 'correctCheck') {
            this.$set(this.inspection, 'lixingType', 0)
          }
        }
      },
      deep: true
    },
  },
  computed: {
    ...mapState({
      importRarDialog: state => state.graph.importRarDialog,
      rounds: state => state.totalData.rounds,
      searchGroups: state => state.totalData.searchGroups,
    })
  },
  methods: {
    ...mapMutations({
      setImportRarDialog: "graph/setImportRarDialog",
      reSetList: "graph/reSetList",
      setRefreshList: "graph/setRefreshList",
    }),
    //初始届次 轮次...
    getParams() {
      //获取届次
      this.$get("/inspection/patrol/getSession").then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          data.forEach((item, index) => {
            // item.session = "第"+item.session+"届"
          });
          this.sessions = data;
        }
      });
      //获取年份
      this.$get("/inspection/patrol/getYear").then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          data.forEach((item, index) => {
            // item.year = item.year+"年"
          });
          this.years = data;
        }
      });
      //获取巡察组
      // this.$get("/inspection/patrol/getGroupName").then((r) => {
      //   if (r.data.code == 20000) {
      //     const data = r.data.data;
      //     data.forEach((item, index) => {
      //       // item.round = "第"+item.round+"轮"
      //     });
      //     this.searchGroups = data;
      //   }
      // });
    },


    uploadProcess(event, file, fileList) {
      this.progress = true;
      this.uploadPercentage = Number(file.percentage.toFixed(0));
    },
    onError() {
      // this.uploadStatus = 'exception'
      this.$message.error("文件上传失败");
    },
    onSuccess() {
      // this.progress = false;
      // this.uploadPercentage = Number(0);
      // 上传之后刷新界面
      if(this.importRarDialog.type == 'inspection') {
        // 巡察报告
        this.setRefreshList({
          inspectionRefresh: true
        })
      } else if (this.importRarDialog.type == 'special') {
        // 专题报告
        this.setRefreshList({
          specialRefresh: true
        })
      } else if (this.importRarDialog.type == 'clue') {
        // 线索报告
        this.setRefreshList({
          clueRefresh: true
        })
      } else if(this.importRarDialog.type == 'correctIndex') {
        // 立行立改
        this.setRefreshList({
          correctIndexRefresh: true
        })
      } else if(this.importRarDialog.type == 'correctCheck') {
        // 立查立处
        this.setRefreshList({
          correctCheckRefresh: true
        })
      } else if(this.importRarDialog.type == 'suggest') {
        // 立查立处
        this.setRefreshList({
          suggestRefresh: true
        })
      }
      this.$message.success("文件上传成功");
      this.$refs.uploadReport.clearFiles();
      this.changeVisible(false)
    },
    submitForm() {
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          this.$refs.uploadReport.submit();
        } else {
          return false;
        }
      });
    },
    getURL() {
      // 压缩包导入
      if (this.importRarDialog.type == 'inspection') {
        // 巡察报告
        return globalConfig.baseURL + "inspection/t-report/inserts_report";
      } else if (this.importRarDialog.type == 'special') {
        // 专题报告
        return globalConfig.baseURL + "inspection/special/inserts_report";
      } else if (this.importRarDialog.type == 'clue') {
        // return globalConfig.baseURL + "inspection/special/inserts_clus";
      } else if (this.importRarDialog.type == 'correctIndex') {
        return globalConfig.baseURL + "inspection/lixing/inserts_report";
      } else if (this.importRarDialog.type == 'correctCheck') {
        return globalConfig.baseURL + "inspection/lixing/inserts_report";
      } else if (this.importRarDialog.type == 'suggest') {
        return globalConfig.baseURL + "inspection/t-proposal/inserts_report";
      } else {
        return '#'
      }
    },
    //设置上传文件的参数
    setFile(r) {
      // this.specialfile.patrolunitid = r.data.data.patrolUnitId;
      // this.specialfile.specialid = r.data.data.specialId;
      // this.leaderfile.patrolunitid = r.data.data.patrolUnitId;
      // this.leaderfile.specialid = r.data.data.specialId;
      // this.materialfile.patrolunitid = r.data.data.patrolUnitId;
      // this.materialfile.specialid = r.data.data.specialId;
    },

    // 对话框关闭重置表单
    close() {
      this.changeVisible(false)
    },

    changeVisible(flag) {
      this.$refs.uploadForm.resetFields();

      this.setImportRarDialog({
        isVisible: flag,
        title: "批量导入文件",
        type: null,
      })
    }
  },
};
</script>
<style lang="scss" scoped>
// 添加报告对话框
/deep/ .import_dlg {
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

    // 上传文件区域
    .dialog_upload {
      width: 90%;
      // height: 200px;
      padding: 30px 0 20px 0;
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
          margin: 10px 0 10px 0;
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
