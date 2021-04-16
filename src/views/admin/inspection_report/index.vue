<template>
  <div class="app-container">
    <div class="top-container">
      <div class="top_select">
        <el-select
          v-model="searchobject.session"
          clearable
          placeholder="选择届次"
          filterable
          allow-create
          default-first-option
        >
          <template slot="prefix">
            <img class="select-icon" :src="imgSession" />
          </template>

          <el-option
            v-for="item in sessions"
            :key="item.id"
            :label="'第' + item.session + '届'"
            :value="item.session"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="searchobject.year"
          clearable
          placeholder="选择年度"
          filterable
          allow-create
          default-first-option
        >
          <template slot="prefix">
            <img class="select-icon" :src="imgYear" />
          </template>

          <el-option
            v-for="item in years"
            :key="item.id"
            :label="item.year + '年'"
            :value="item.year"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="searchobject.round"
          clearable
          placeholder="选择轮次"
          filterable
          allow-create
          default-first-option
        >
          <template slot="prefix">
            <img class="select-icon" :src="imgRound" />
          </template>
          <el-option
            v-for="item in rounds"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="searchobject.groupName"
          clearable
          placeholder="选择巡察组"
          filterable
          default-first-option
        >
          <template slot="prefix">
            <img class="select-icon" :src="imgGroup" />
          </template>

          <el-option
            v-for="item in searchGroups"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="searchobject.name"
          clearable
          placeholder="被巡察单位"
          filterable
          default-first-option
        >
          <template slot="prefix">
            <img class="select-icon" :src="imgUnit" />
          </template>

          <el-option
            v-for="item in searchUnits"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </div>

      <div class="top_btn">
        <el-button class="reset" @click="reset">
          <div class="img"></div>
          <span>重置</span>
        </el-button>

        <el-button class="import" @click="openImportDlg">
          <div class="img"></div>
          <span>导入</span>
        </el-button>

        <el-button class="export" @click="exportExcel">
          <div class="img"></div>
          <span>导出</span>
        </el-button>

        <el-button class="create" @click="add">
          <div class="img"></div>
          <span>创建</span>
        </el-button>
      </div>
    </div>

    <el-table
      ref="table"
      :data="inspectionReport"
      border
      fit
      style="width: 100%"
      :header-cell-class-name="tableHeader"
      :cell-class-name="tableCell"
      :header-cell-style="{
        background: '#E0E3E6',
        height: '50px',
        textAlign: 'center',
        color: '#585E66',
        fontFamily: '微软雅黑',
      }"
      :cell-style="{
        background: '#EEF0F2',
        height: '48px',
        textAlign: 'center',
        fontSize: '16px',
        color: '#5D5D5D',
        fontFamily: '微软雅黑',
      }"
      tooltip-effect="dark"
      :span-method="objectSpanMethod"
    >
      <el-table-column label="届次" align="center" width="90px">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.session + "届" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="年度" align="center" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.year + "年" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="轮次" align="center" width="90px">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.round + "轮" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="巡察组" align="center" width="90px">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.groupName + "组" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="巡察对象分类" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="被巡察单位" align="center" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="领导小组会报告"
        align="center"
        width="210px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span class="report">
            <a
              class=""
              @click="
                download(scope.row.reportPatrolUnit.report.leadershipReport)
              "
            >
              {{
                scope.row.reportPatrolUnit.report.leadershipReport.fileName
              }}</a
            >
          </span>
          <div class="icondiv">
            <el-dropdown trigger="hover" size="mini" placement="bottom" :show-timeout="100" :hide-timeout="600">
              <img class="more2" />
              <el-dropdown-menu slot="dropdown" class="file_dropdown">
                <el-dropdown-item>
                  <el-upload
                    :ref="scope.row"
                    style="display: inline"
                    :show-file-list="false"
                    :data="file"
                    :http-request="httpRequest1"
                    :on-success="onSuccess"
                    :action="getURL()"
                  >
                    <img
                      class="icon"
                      :src="imgAdd"
                      @click="getParams(scope.row.reportPatrolUnit.report.id)"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="
                      previewReport(
                        scope.row.reportPatrolUnit.report.leadershipReport
                      )
                    "
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="
                      delReport(
                        scope.row.reportPatrolUnit.report.leadershipReport
                      )
                    "
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="书记专题会报告"
        align="center"
        width="220px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <a
            class="report"
            @click="download(scope.row.reportPatrolUnit.report.secretaryReport)"
            >{{ scope.row.reportPatrolUnit.report.secretaryReport.fileName }}</a
          >

          <div class="icondiv">
            <el-dropdown trigger="hover" size="mini" :show-timeout="100" :hide-timeout="600">
              <img class="more2" />
              <el-dropdown-menu slot="dropdown" class="file_dropdown">
                <el-dropdown-item>
                  <el-upload
                    style="display: inline"
                    :show-file-list="false"
                    :action="getURL()"
                    :http-request="httpRequest2"
                    :on-success="onSuccess"
                  >
                    <img
                      class="icon"
                      :src="imgAdd"
                      @click="getParams(scope.row.reportPatrolUnit.report.id)"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="
                      previewReport(
                        scope.row.reportPatrolUnit.report.secretaryReport
                      )
                    "
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="
                      delReport(
                        scope.row.reportPatrolUnit.report.secretaryReport
                      )
                    "
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="向班子反馈"
        align="center"
        width="200px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span class="report">
            <a class="" @click="download(scope.row.reportPatrolUnit.report.teamReport)">
              {{ scope.row.reportPatrolUnit.report.teamReport.fileName }}
            </a>
          </span>
          <div class="icondiv">
            <el-dropdown trigger="hover" size="mini" placement="bottom" :show-timeout="100" :hide-timeout="600">
              <img class="more2" />
              <el-dropdown-menu slot="dropdown" class="file_dropdown">
                <el-dropdown-item>
                  <el-upload
                    style="display: inline"
                    :show-file-list="false"
                    :data="file"
                    :on-success="onSuccess"
                    :http-request="httpRequest12"
                    :action="getURL()"
                  >
                    <img
                      class="icon"
                      :src="imgAdd"
                      @click="getParams(scope.row.reportPatrolUnit.report.id)"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="
                      previewReport(
                        scope.row.reportPatrolUnit.report.teamReport
                      )
                    "
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="
                      delReport(
                        scope.row.reportPatrolUnit.report.teamReport
                      )
                    "
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="向负责人反馈"
        align="center"
        width="220px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <a
            class="report"
            @click="download(scope.row.reportPatrolUnit.report.feedbackReport)"
            >{{ scope.row.reportPatrolUnit.report.feedbackReport.fileName }}</a
          >
          <div class="icondiv">
            <el-dropdown trigger="hover" size="mini" :show-timeout="100" :hide-timeout="600">
              <img class="more2" />
              <el-dropdown-menu slot="dropdown" class="file_dropdown">
                <el-dropdown-item>
                  <el-upload
                    style="display: inline"
                    :show-file-list="false"
                    :data="file"
                    :on-success="onSuccess"
                    :http-request="httpRequest3"
                    :action="getURL()"
                  >
                    <img
                      class="icon"
                      :src="imgAdd"
                      @click="getParams(scope.row.reportPatrolUnit.report.id)"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="
                      previewReport(
                        scope.row.reportPatrolUnit.report.feedbackReport
                      )
                    "
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="
                      delReport(
                        scope.row.reportPatrolUnit.report.feedbackReport
                      )
                    "
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="巡察开始时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.patrolTime | showTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="巡察结束时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | showTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="80px" align="center" fixed="right">
        <template slot-scope="scope">
          <img class="el-icon" :src="imgEdit" @click="editPatrol(scope.row)" />
          <img
            class="el-icon"
            :src="imgDel"
            @click="delInpsection(scope.row.reportPatrolUnit.report.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <inspection-edit
      ref="edit"
      :dialog-visible="editlog.isVisible"
      :title="editlog.title"
      :searchUnits="searchUnits"
      @success="editSuccess"
      @close="editClose"
    />

    <inspection-add
      ref="add"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :sessions="sessions"
      :years="years"
      :searchUnits="searchUnits"
      @success="addSuccess"
      @close="addClose"
    />

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.num"
      :limit.sync="pagination.size"
      @pagination="search"
      class="page_hhx"
    />

    <div class="title">
      <span>巡察报告一览表</span>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import inspectionEdit from "./edit.vue";
import inspectionAdd from "./add.vue";
import mammoth from "mammoth";
import pdf from 'vue-pdf';
import { mapState, mapMutations } from 'vuex';

export default {
  name: "inspection_report",
  components: { Pagination, inspectionEdit, inspectionAdd, pdf },
  mounted() {
    this.fetch();
  },
  created() {
    //初始化下拉框
    this.init();
  },
  data() {
    return {
      session: "", //届次
      round: "", //轮次
      year: "", //年度
      searchGroup: "", //巡察组
      searchUnit: "", //巡察单位
      report: "", //报告
      datetime: "",
      file: {},
      total: 0,
      sessions: null,
      searchobject: {
        session: null,
        round: null,
        year: null,
        groupName: null,
        name: null,
      },
      // rounds: [],
      years: [],
      // searchGroups: [],
      searchUnits: [],
      reports: [],
      list: [],
      inspectionReport: [], //巡察报告
      editlog: {
        isVisible: false,
        title: "修改",
      },
      dialog: {
        isVisible: false,
        title: "创建",
      },

      imgAdd: require("@/assets/main_images/add.png"),
      imgSearch: require("@/assets/main_images/search.png"),
      imgReset: require("@/assets/main_images/reset.png"),
      imgImport: require("@/assets/main_images/import.png"),
      imgDel: require("@/assets/icon_img/delete.png"),
      imgEdit: require("@/assets/icon_img/edit.png"),
      imgSession: require("@/assets/main_images/session.png"),
      imgYear: require("@/assets/main_images/year.png"),
      imgRound: require("@/assets/main_images/round.png"),
      imgGroup: require("@/assets/main_images/group.png"),
      imgUnit: require("@/assets/main_images/unit.png"),
      pagination: {
        size: 15,
        num: 1,
      },

      toolTipFlag: false,

      vHtml: "",
      pdfUrl: '',
      numPages: undefined,
      pageCount: 0,
      currentPage: 1,
    };
  },
  watch: {
    // 监听批量导入，刷新页面
    'refreshList.inspectionRefresh': {
      handler(newval, oldval) {
        if (newval) {
          this.fetch();
        }
      }
    },

    inspectionReport(newval) {
      this.buildMerge(newval);
    },
    "searchobject.session"(newval) {
      // this.$get("/inspection/patrol/getRound", newval).then((r) => {
      //   this.rounds = r.data.data;
      // });
      this.search();
    },
    "searchobject.round"(newval) {
      this.search();
    },
    "searchobject.year"(newval) {
      this.search();
    },
    "searchobject.groupName"(newval) {
      this.search();
    },
    "searchobject.name"(newval) {
      this.search();
    },
  },
  filters: {
    showTime(val) {
      if (val != null) {
        let arr = [];
        arr = String(val).split(" ");
        return arr[0];
      } else {
        return "";
      }
    }
  },
  computed: {
    ...mapState({
      refreshList: state => state.graph.refreshList,
      rounds: state => state.totalData.rounds,
      searchGroups: state => state.totalData.searchGroups,
    })
  },
  methods: {
    ...mapMutations({
      // 打开批量导入对话框
      setImportRarDialog: "graph/setImportRarDialog",
    }),

    //创建巡察报告成功
    addSuccess() {
      this.dialog.isVisible = false;
      this.search();
    },
    //取消巡察报告添加
    addClose() {
      this.dialog.isVisible = false;
    },
    //修改巡察报告
    editSuccess() {
      this.editlog.isVisible = false;
      this.search();
    },
    //修改巡察报告 关闭
    editClose() {
      this.editlog.isVisible = false;
    },
    //上传文件 成功 调用
    onSuccess() {
      this.$message({
        message: "上传文件成功",
        type: "success",
      });
      this.search();
    },
    //下载文件
    download(item) {
      this.$download(
        "/download",
        {
          materialId: item.id,
        },
        item.fileName
      );
    },
    changePage(i) {
      this.currentPage = i
    },
    // 文件预览
    previewReport(item) {
      // 打开单独页面进行预览
      console.log('previewReport', item);
      if(item.id === "" || item.attachId === "") {
        this.$message.warning("暂无文件");
        return;
      }
      let fileNameArr = item.fileName.split('.');
      let router = null;
      console.log('object', fileNameArr);
      if(fileNameArr[fileNameArr.length - 1] == 'docx' || fileNameArr[fileNameArr.length - 1] == 'doc' || fileNameArr[fileNameArr.length - 1] == 'pdf') {
        router = this.$router.resolve(
          {
            path: '/document',
            query: {
              id: item.id,
              name: item.fileName
            },
          }
        );
      } else if(fileNameArr[fileNameArr.length - 1] == 'xlsx' || fileNameArr[fileNameArr.length - 1] == 'xls') {
        router = this.$router.resolve(
          {
            path: '/excel',
            query: {
              id: item.id,
              name: item.fileName
            },
          }
        );
      } else {
        this.$message.error("文件类型错误");
        return;
      }
      window.open(router.href, '_blank');
    },
    delReport(item) {
      if(item.id === "" || item.attachId === ""){
        return;
      }
      this.$delete("/inspection/t-report/delFile", {
        attachid: item.attachId,
        id: item.id,
      }).then((r) => {
        if (r.data.code === 20000) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.search();
        }
      });
      // }
    },

    //上传文件
    httpRequest1(param) {
      var formdata = new FormData();
      formdata.append("file1", param.file);
      formdata.append("reportId", this.file.reportId);
      this.$upload("/inspection/t-report/upload", formdata).then((r) => {
        if (r.data.code === 20000) {
          this.$message.success("上传成功");
          this.search();
        }
      });
    },
    httpRequest2(param) {
      var formdata = new FormData();
      formdata.append("file2", param.file);
      formdata.append("reportId", this.file.reportId);
      this.$upload("/inspection/t-report/upload", formdata).then((r) => {
        if (r.data.code === 20000) {
          this.$message.success("上传成功");
          this.search();
        }
      });
    },
    // 向班子反馈
    httpRequest12(param) {
      let file = param.file; // 相当于input里取得的files
      var formdata = new FormData();
      formdata.append("file12", param.file);
      formdata.append("reportId", this.file.reportId);
      this.$upload("/inspection/t-report/upload", formdata).then((r) => {
        if (r.data.code === 20000) {
          this.$message.success("上传成功");
          this.search();
        }
      });
    },
    httpRequest3(param) {
      let file = param.file; // 相当于input里取得的files
      var formdata = new FormData();
      formdata.append("file3", param.file);
      formdata.append("reportId", this.file.reportId);
      this.$upload("/inspection/t-report/upload", formdata).then((r) => {
        if (r.data.code === 20000) {
          this.$message.success("上传成功");
          this.search();
        }
      });
    },

    //创建巡察报告
    add() {
      this.dialog.isVisible = true;
      this.$refs.add.init();
    },
    //修改巡察报告
    editPatrol(item) {
      this.editlog.isVisible = true;
      this.$refs.edit.getPatrol(item);
    },
    //删除巡察报告
    delInpsection(id) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        this.$delete("/inspection/t-report", {
          id: id,
        }).then((r) => {
          if (r.data.code === 20000) {
            this.$message.success("删除成功");
            this.search();
          }
        });
      }).catch(() => {
        this.$message.info("取消删除")
      });
    },
    getURL() {
      return globalConfig.baseURL + "inspection/special/upload";
    },
    getParams(id) {
      this.file.reportId = id;
      return this.file;
    },
    /**
      element-table合并单元格的函数
      columnIndex 值表示要合并的列的下标，当前示例是合并前4列。
      如果你是要合并多列，需要添加对应的列号进行判断，并且添加对应的计算方法，
        和对应的计算合并列的方法。
    */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return this.ret(row, "firstSpan");
      } else if (columnIndex === 1) {
        return this.ret(row, "secondSpan");
      } else if (columnIndex === 2) {
        return this.ret(row, "thirdSpan");
      } else if (columnIndex === 3) {
        return this.ret(row, "fourthSpan");
      }
    },
    ret(row, obj) {
      if (row && row[obj] != 0) {
        return {
          rowspan: row[obj],
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
    // 计算第一列合并总数
    computeFirstSpan(firstObj, secondObj, thirdObj, fourthObj) {
      // 遍历计算第一列合并行数
      for (let obj in firstObj) {
        let fristData = this.inspectionReport.filter(
          (d) => d.id1 === firstObj[obj][0]
        )[0];
        // 获取第一条数据，对其添加 'firstSpan' 属性，并设置值
        if (fristData) fristData["firstSpan"] = firstObj[obj].length;
        this.computeSecondSpan(firstObj[obj], secondObj, thirdObj, fourthObj);
      }
    },
    // 计算第二列合并总数
    computeSecondSpan(classList, secondObj, thirdObj, fourthObj) {
      let secondList = [];
      // 遍历计算第二列合并行数
      for (let obj in secondObj) {
        // 判断两个id数组，取其并集，并集的长度就是合并列的行数
        let secondIds = secondObj[obj].filter((val) => {
          return classList.indexOf(val) > -1;
        });
        let fristData = this.inspectionReport.filter(
          (d) => d.id1 === secondIds[0]
        )[0];
        // 获取第一条数据，对其添加 'secondSpan' 属性，并设置值
        if (fristData) fristData["secondSpan"] = secondIds.length;
        secondList.push(secondIds);
      }
      secondList.forEach((list) => {
        this.computeThirdSpan(list, thirdObj, fourthObj);
      });
    },
    // 计算第三列合并总数
    computeThirdSpan(list, thirdObj, fourthObj) {
      let thirdList = [];
      // 遍历计算第三列合并行数
      for (let obj in thirdObj) {
        let thirdIds = thirdObj[obj].filter((val) => {
          return list.indexOf(val) > -1;
        });
        let fristData = this.inspectionReport.filter(
          (d) => d.id1 === thirdIds[0]
        )[0];
        // 获取第一条数据，对其添加 'thirdSpan' 属性，并设置值
        if (fristData) fristData["thirdSpan"] = thirdIds.length;
        thirdList.push(thirdIds);
      }
      thirdList.forEach((list) => {
        this.computeFourthSpan(list, fourthObj);
      });
    },
    // 计算第四列合并总数
    computeFourthSpan(list, fourthObj) {
      // 遍历计算第四列合并行数
      for (let obj in fourthObj) {
        let fourthIds = fourthObj[obj].filter((val) => {
          return list.indexOf(val) > -1;
        });
        let fristData = this.inspectionReport.filter(
          (d) => d.id1 === fourthIds[0]
        )[0];
        // 获取第一条数据，对其添加 'fourthSpan' 属性，并设置值
        if (fristData) fristData["fourthSpan"] = fourthIds.length;
      }
    },
    /**
     *  构建合并列数据
     *  思路：遍历所有数据，将需要合并的列的内容作为key，数据id作为value，然后依次遍历获取对应的合并列的行数
     */
    buildMerge(dataList) {
      let firstObj = {},
        secondObj = {},
        thirdObj = {},
        fourthObj = {};
      let firstObjKey = "",
        secondObjKey = "",
        thirdObjKey = "",
        fourthObjKey = "";
      console.log("this.total", this.total);
      console.log("巡察报告", this.inspectionReport);
      for (let i = 0, len = dataList.length; i < len; i++) {
        firstObjKey = dataList[i].session;
        secondObjKey = dataList[i].year;
        thirdObjKey = dataList[i].round;
        fourthObjKey = dataList[i].groupName;

        if (!firstObj[firstObjKey])
          firstObj[firstObjKey] = new Array(dataList[i].id1);
        else {
          firstObj[firstObjKey].push(dataList[i].id1);
        }
        if (!secondObj[secondObjKey])
          secondObj[secondObjKey] = new Array(dataList[i].id1);
        else {
          secondObj[secondObjKey].push(dataList[i].id1);
        }
        if (!thirdObj[thirdObjKey])
          thirdObj[thirdObjKey] = new Array(dataList[i].id1);
        else {
          thirdObj[thirdObjKey].push(dataList[i].id1);
        }
        if (!fourthObj[fourthObjKey])
          fourthObj[fourthObjKey] = new Array(dataList[i].id1);
        else {
          fourthObj[fourthObjKey].push(dataList[i].id1);
        }
      }
      this.computeFirstSpan(firstObj, secondObj, thirdObj, fourthObj);
    },

    //初始加载表格
    fetch(params = {}) {
      params.size = this.pagination.size;
      params.current = this.pagination.num;
      this.$get("/inspection/t-report", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          console.log("----", data);
          this.total = data.total;
          this.list = data.records;
          //封装得到的数据
          let obj = {
            id: "",
            parentId: "",
            attachId: "",
            fileName: "",
            filetype: "",
            uptime: "",
          };
          this.inspectionReport = [];

          // this.list.forEach((item, index) => {
          //   item.units.forEach((item1, index1) => {
          //     let reportObj = {
          //       id1: String(index1),
          //       id: item.id,
          //       session: item.session,
          //       round: item.round,
          //       year: item.year,
          //       groupName: item.groupName,
          //       patrolTime: item.patrolTime,
          //       endTime: item.endTime,
          //       unit: item1,
          //       reportPatrolUnit: null,
          //     }
          //     let reportIndex = item.reportPatrolUnits.findIndex(reportItem => reportItem.unitId == item1.id)

          //     if(reportIndex != -1) {
          //       if (item.reportPatrolUnits[reportIndex].report.leadershipReport == null) {
          //         obj.parentId = item.reportPatrolUnits[reportIndex].report.id;
          //         obj.filetype = "1";
          //         item.reportPatrolUnits[reportIndex].report.leadershipReport = this.$_.cloneDeep(obj);
          //         // item1.report.leadershipReport = [];
          //         // item1.report.leadershipReport.push(obj);
          //       }
          //       if (item.reportPatrolUnits[reportIndex].report.secretaryReport == null) {
          //         obj.parentId = item.reportPatrolUnits[reportIndex].report.id;
          //         obj.filetype = "2";
          //         item.reportPatrolUnits[reportIndex].report.secretaryReport = this.$_.cloneDeep(obj);
          //         // item1.report.secretaryReport = [];
          //         // item1.report.secretaryReport.push(obj);
          //       }
          //       if (item.reportPatrolUnits[reportIndex].report.teamReport == null) {
          //         obj.parentId = item.reportPatrolUnits[reportIndex].report.id;
          //         obj.filetype = "12";
          //         item.reportPatrolUnits[reportIndex].report.teamReport = this.$_.cloneDeep(obj);
          //         // item1.report.teamReport = [];
          //         // item1.report.teamReport.push(obj);
          //       }
          //       if (item.reportPatrolUnits[reportIndex].report.feedbackReport == null) {
          //         obj.parentId = item.reportPatrolUnits[reportIndex].report.id;
          //         obj.filetype = "3";
          //         item.reportPatrolUnits[reportIndex].report.feedbackReport = this.$_.cloneDeep(obj);
          //         // item1.report.feedbackReport = [];
          //         // item1.report.feedbackReport.push(obj);
          //       }
          //       reportObj.reportPatrolUnit = item.reportPatrolUnits[reportIndex]
          //     }
          //     // item["unit"] = item1;
          //     this.inspectionReport.push(reportObj);
          //   });
          // })
          // this.$forceUpdate();


          this.list.forEach((item, index) => {
            item.units.forEach((item1, index1) => {
              item["unit"] = item1;
              this.inspectionReport.push(this.$_.cloneDeep(item));
            });
          });

          this.inspectionReport.forEach((item, index) => {
            item.reportPatrolUnits.forEach((item1, index1) => {
              if (item.unit.id == item1.unitId) {
                if (item1.report.leadershipReport == null) {
                  obj.patrolId = item1.report.id;
                  obj.filetype = "1";
                  // item1.report.leadershipReport = this.$_.cloneDeep(obj);
                  item1.report.leadershipReport = [];
                  item1.report.leadershipReport.push(obj);
                }
                if (item1.report.secretaryReport == null) {
                  obj.patrolId = item1.report.id;
                  obj.filetype = "2";
                  // item1.report.secretaryReport = this.$_.cloneDeep(obj);
                  item1.report.secretaryReport = [];
                  item1.report.secretaryReport.push(obj);
                }
                if (item1.report.teamReport == null) {
                  obj.patrolId = item1.report.id;
                  obj.filetype = "12";
                  // item1.report.teamReport = this.$_.cloneDeep(obj);
                  item1.report.teamReport = [];
                  item1.report.teamReport.push(obj);
                }
                if (item1.report.feedbackReport == null) {
                  obj.patrolId = item1.report.id;
                  obj.filetype = "3";
                  // item1.report.feedbackReport = this.$_.cloneDeep(obj);
                  item1.report.feedbackReport = [];
                  item1.report.feedbackReport.push(obj);
                }
                item["reportPatrolUnit"] = item1;
              }
            });
            item["id1"] = String(index);
          });

          console.log("巡察报告", this.inspectionReport);
        }
      });
    },

    search() {
      console.log("this.searchobject", this.searchobject);
      this.fetch({
        ...this.searchobject,
      });
    },
    reset() {
      this.searchobject = {};
      this.search();
    },
    tableCell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3 || columnIndex == 4 || columnIndex == 10 || columnIndex == 11) {
        if (row.groupName % 2 == 0) {
          return "qian";
        } else {
          return "shen";
        }
      } else if (columnIndex == 2) {
        return "qian"
      } else if (columnIndex == 5) {
        if (row.groupName % 2 == 0) {
          return "blueq";
        } else {
          return "blues";
        }
      } else if (columnIndex == 6 || columnIndex == 7 || columnIndex == 8 || columnIndex == 9) {
        if (row.groupName % 2 == 0) {
          return "greenq report_colume";
        } else {
          return "greens report_colume";
        }
      }
    },
    tableHeader({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 5) {
        return "blueHeader";
      } else if (columnIndex == 6 || columnIndex == 7 || columnIndex == 8 || columnIndex == 9) {
        return "greenHeader"
      }
    },

    //初始届次 轮次...
    init() {
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
      // //获取巡察组
      // this.$get("/inspection/patrol/getGroupName").then((r) => {
      //   if (r.data.code == 20000) {
      //     const data = r.data.data;
      //     data.forEach((item, index) => {
      //       // item.round = "第"+item.round+"轮"
      //     });
      //     this.searchGroups = data;
      //   }
      // });
      //获取巡察对象
      this.$get("/inspection/patrol/getUnit").then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          data.forEach((item, index) => {
            // item.name = "第"+item.name+"组"
          });
          this.searchUnits = data;
        }
      });
    },

    // 打开批量导入对话框
    openImportDlg() {
      this.setImportRarDialog({
        isVisible: true,
        title: "巡察报告批量导入",
        type: "inspection",
      })
    },

    // 导出文件
    exportExcel() {
      let filename = this.returnFileName(this.searchobject);
      this.$downloadZip("/inspection/t-report/export", {
        ...this.searchobject
      }, filename);
    },

    // 生成文件名
    returnFileName(params) {
      let filename = "";
      if(params.session !== null && params.session !== "") {
        filename += params.session + '届_';
      }
      if(params.year !== null && params.year !== "") {
        filename += params.year + '年_';
      }
      if(params.round !== null && params.round !== "") {
        filename += params.round + '轮_';
      }
      if(params.groupName !== null && params.groupName !== "") {
        filename += params.groupName + '组_';
      }
      if(params.name !== null && params.name !== "") {
        let index = this.searchUnits.findIndex(item => item.id == params.name)
        if(index != -1) {
          let label = this.searchUnits[index].name;
          filename += label + '_';
        }
      }
      filename += '巡察报告.zip';
      return filename;
    }
  },
};
</script>

<style lang="scss" scoped>

/deep/ .shen {
  background: #eef0f2 !important;
}
/deep/ .qian {
  background: #f6f7f8 !important;
}
/deep/ .blues {
  color: #008cf7 !important;
  background: #ddeeff !important;
}
/deep/ .blueq {
  color: #008cf7 !important;
  background: #edf5fc !important;
}
/deep/ .blueHeader {
  color: #008cf7 !important;
  background: #b5daff !important;
}
/deep/ .reds {
  color: #ff4307 !important;
  background: #ffe5dd !important;
  .spanReport {
    color: #ff4307 !important;
  }
}
/deep/ .redq {
  color: #ff4307 !important;
  background: #fff3ef !important;
  .spanReport {
    color: #ff4307 !important;
  }
}
/deep/ .redHeader {
  color: #ff4307 !important;
  background: #ffcbb9 !important;
}
/deep/ .greens {
  color: #00b200 !important;
  background: #d3f7cd !important;
  .spanReport {
    color: #00b200 !important;
  }
}
/deep/ .greenq {
  color: #00b200 !important;
  background: #eefceb !important;
  .spanReport {
    color: #00b200 !important;
  }
}
/deep/ .greenHeader {
  color: #00b200 !important;
  background: #adf6a1 !important;
}

//分页样式
.page_hhx {
  display: inline-block;
  padding: 22px 10px 16px 10px;
  // transform: translateX(10px);
}
/deep/ .el-table td {
  padding: 4px 0;

  div {
    height: 23px;
    line-height: 23px;
  }
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf,
/deep/ .el-table--border,
/deep/ .el-table--group {
  border-color: #ffffff;
  border: 1px solid #ffffff;
  border-top: 0px;
  border-left: 0px;
  border-collapse: collapse !important;
}
/deep/ .el-table--border::after,
/deep/ .el-table--group::after,
/deep/ .el-table::before {
  background-color: #ffffff;
  border: 1px solid #ffffff;
}
/deep/ .el-table {
  .report_colume {
    // padding: 0 20px;

    .cell {
      white-space: nowrap;
      padding: 0 20px 0 15px;
    }
  }
}
.title {
  width: 150px;
  height: 30px;
  background: #ebf5ff;
  border-radius: 4px;
  font-size: 16px;
  font-family: MicrosoftYaHeiSemibold;
  color: #008fff;
  line-height: 30px;
  text-align: center;
  float: right;
  margin-top: 22px;
}
.icondiv {
  display: inline;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  img {
    cursor: pointer;
  }
}
.icon {
  cursor: pointer;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
.el-icon {
  cursor: pointer;
  vertical-align: middle;
  width: 23px;
  height: 23px;
}
.more1 {
  height: 23px;
  width: 17px;
  content: url("../../../assets/icon_img/更多-橙.png");
}
.more2 {
  height: 23px;
  width: 17px;
  content: url("../../../assets/icon_img/更多-绿.png");
}
.report {
  font-size: 16px;
  margin-right: 10px;
}
.spanReport {
  cursor: pointer;
  font-size: 16px;
  width: 100px;
  color: #008fff;
}
</style>
