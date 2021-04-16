<template>
  <div>
    <el-dialog
      :width="width"
      top="150px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="importFileDialog.isVisible"
      custom-class="import_dlg"
      v-dialogDrag
    >
      <!-- <div class="import_dlg" v-show="importFileDialog.isVisible"> -->
      <div slot="title" class="dialog-title">
        <span>{{ importFileDialog.title }}</span>
        <!-- <img src="@/assets/index_images/close.png"> -->
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <!-- 上传文件区域 -->
        <div class="dialog_upload">
          <div class="upload_special">
            <el-upload
              ref="importFile"
              style="display: inline"
              :data="specialfile"
              :file-list="fileList"
              :on-error="onError"
              :on-success="onSuccess"
              :action="getURL()"
              :on-progress="uploadProcess"
              :limit="1"
              @close="changeVisible(false)"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
            </el-upload>
            <span class="blue">导入文件</span>
            <!-- <el-progress
              v-if="progress"
              :text-inside="true"
              :status="uploadStatus"
              :stroke-width="15"
              :percentage="uploadPercentage"
              style="width: 210px"
            ></el-progress> -->
          </div>
        </div>

        <!-- <div slot="footer" class="dialog-footer">
          <el-button type="warning" plain @click="changeVisible(false)"
            >取消</el-button
          >
          <el-button type="primary" plain @click="changeVisible(false)">确认</el-button>
        </div> -->
      </div>
      <!-- </div> -->
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
      rounds: [],
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
    };
  },
  mounted() {
    //    this.fetch()
  },
  watch: {
    'importFileDialog.isVisible': {
      handler(newval, oldval) {
        // 每次对话框打开，重置刷新通知
        if(newval) {
          this.reSetList()
        }
      }
    }
  },
  computed: {
    ...mapState({
      importFileDialog: state => state.graph.importFileDialog,
    })
  },
  methods: {
    ...mapMutations({
      setImportFileDialog: "graph/setImportFileDialog",
      reSetList: "graph/reSetList",
      setRefreshList: "graph/setRefreshList",
    }),
    uploadProcess(event, file, fileList) {
      this.progress = true;
      this.uploadPercentage = Number(file.percentage.toFixed(0));
    },
    close() {

    },
    onError() {
      // this.uploadStatus = 'exception'
      this.$message.error("文件上传失败");
    },
    onSuccess() {
      // this.progress = false;
      // this.uploadPercentage = Number(0);
      // 上传之后刷新界面
      if (this.importFileDialog.type == 'district') {
        this.setRefreshList({
          districtRefresh: true
        })
      } else if (this.importFileDialog.type == 'village') {
        this.setRefreshList({
          villageRefresh: true
        })
      } else if (this.importFileDialog.type == 'clue') {
        this.setRefreshList({
          clueRefresh: true
        })
      }
      this.$message.success("文件上传成功");
      this.$refs.importFile.clearFiles();
      this.changeVisible(false)
    },
    getURL() {
      if (this.importFileDialog.type == 'district') {
        // 区级问题清单
        return globalConfig.baseURL + "inspection/t-problem/inserts";
      } else if (this.importFileDialog.type == 'village') {
        // 村社级问题清单
        return globalConfig.baseURL + "inspection/t-problem/inserts";
      } else if (this.importFileDialog.type == 'clue') {
        // 线索
        return globalConfig.baseURL + "inspection/special/inserts_clus";
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
    reset() {

    },
    changeVisible(flag) {
      // this.progress = false
      this.setImportFileDialog({
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
