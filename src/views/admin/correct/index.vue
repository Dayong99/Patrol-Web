<template>
  <div class="app-container fa">
    <div class="top-container">
      <div class="top_select">
        <el-select
          v-model="session"
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
            :key="item.session"
            :label="'第' + item.session + '届'"
            :value="item.session"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="year"
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
            :key="item.year"
            :label="item.year + '年'"
            :value="item.year"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="round"
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
          v-model="searchGroup"
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
          v-model="searchUnit"
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
    <!-- :row-class-name="tableRowClassName" -->
    <el-table
      ref="table"
      :data="tableData"
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
        height: '42px',
        textAlign: 'center',
        fontSize: '16px',
        color: '#5D5D5D',
        fontFamily: '微软雅黑',
      }"
      tooltip-effect="dark"
      :span-method="objectSpanMethod"
    >
      <!-- :span-method="arraySpanMethod" -->
      <el-table-column label="届次" width="120px">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.session + "届" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="年度" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.year + "年" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="轮次" width="120px">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.round + "轮" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="巡察组" width="120px">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.groupName + "组" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="被巡察单位" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.unitName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="移交立行立改问题"
        :fit="true"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span
            @click="download(scope.row.problemMaterials[0])"
            class="spanReport"
            >{{ scope.row.problemMaterials[0].fileName }}</span
          >
          <div class="icondiv">
            <el-dropdown
              trigger="hover"
              size="mini"
              placement="bottom"
              :show-timeout="100"
              :hide-timeout="600"
            >
              <img class="more1" />
              <el-dropdown-menu slot="dropdown" class="file_dropdown">
                <el-dropdown-item>
                  <el-upload
                    style="display: inline"
                    :show-file-list="false"
                    :data="file"
                    :on-success="onSuccess"
                    :action="getURL()"
                  >
                    <img
                      class="icon"
                      :src="imgAdd"
                      @click="getParams(scope.row, (type = 'problem'))"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="previewReport(scope.row.problemMaterials[0])"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="delReport(scope.row.problemMaterials[0])"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="移交立行立改问题数" :fit="true">
        <template slot-scope="scope">
          <span>{{ scope.row.lixing.problemNum }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="整改情况报告"
        :fit="true"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span
            @click="download(scope.row.rectreportMaterials[0])"
            class="spanReport"
            >{{ scope.row.rectreportMaterials[0].fileName }}</span
          >
          <div class="icondiv">
            <el-dropdown
              trigger="hover"
              size="mini"
              placement="bottom"
              :show-timeout="100"
              :hide-timeout="600"
            >
              <img class="more2" />
              <el-dropdown-menu slot="dropdown" class="file_dropdown">
                <el-dropdown-item>
                  <el-upload
                    style="display: inline"
                    :show-file-list="false"
                    :data="file"
                    :on-success="onSuccess"
                    :action="getURL()"
                  >
                    <img
                      class="icon"
                      :src="imgAdd"
                      @click="getParams(scope.row, (type = 'rectreport'))"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="previewReport(scope.row.rectreportMaterials[0])"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="delReport(scope.row.rectreportMaterials[0])"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="形成报告时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.lixing.reportTime | showTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <img class="el-icon" :src="imgEdit" @click="editCorrect(scope.row)" />
          <img
            class="el-icon"
            :src="imgDel"
            @click="delCorrect(scope.row.lixing.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <correct-add
      ref="add"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :lixingType="lixingType"
      :sessions="sessions"
      :years="years"
      :searchUnits="searchUnits"
      @success="addSuccess"
      @close="addClose"
    />

    <correct-edit
      ref="edit"
      :dialog-visible="editlog.isVisible"
      :title="editlog.title"
      :searchUnits="searchUnits"
      @success="editSuccess"
      @close="editClose"
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
      <span>移交立行立改问题情况一览表</span>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import correctAdd from "./add.vue";
import correctEdit from "./edit.vue";
import { mapState, mapMutations } from 'vuex';
export default {
  name: "correct_report",
  components: { Pagination, correctAdd, correctEdit },
  data() {
    return {
      lixingType: 1, //立行立改
      session: "", //届次
      round: "", //轮次
      year: "",
      searchGroup: "", //巡察组
      searchUnit: "", //巡察单位
      report: "", //报告
      total: 0,
      sessions: [],
      // rounds: [],
      years: [],
      // searchGroups: [],
      searchUnits: [],
      reports: [],
      testDate: [],
      pagination: {
        size: 15,
        num: 1,
      },
      //合并单元格数组
      tableData: [],
      dialog: {
        isVisible: false,
        title: "创建",
      },
      editlog: {
        isVisible: false,
        title: "修改",
      },
      searchobject: {},
      file: {},
      imgDel: require("@/assets/icon_img/delete.png"),
      imgEdit: require("@/assets/icon_img/edit.png"),
      imgAdd: require("@/assets/main_images/add.png"),
      imgSearch: require("@/assets/main_images/search.png"),
      imgReset: require("@/assets/main_images/reset.png"),
      imgImport: require("@/assets/main_images/import.png"),
      imgSession: require("@/assets/main_images/session.png"),
      imgYear: require("@/assets/main_images/year.png"),
      imgRound: require("@/assets/main_images/round.png"),
      imgGroup: require("@/assets/main_images/group.png"),
      imgUnit: require("@/assets/main_images/unit.png"),
    };
  },
  created() { },
  mounted() {
    this.fetch();
    this.init();
  },
  computed: {
    ...mapState({
      refreshList: state => state.graph.refreshList,
      rounds: state => state.totalData.rounds,
      searchGroups: state => state.totalData.searchGroups,
    })
  },
  watch: {
    // 监听批量导入，刷新页面
    'refreshList.correctIndexRefresh': {
      handler(newval, oldval) {
        if (newval) {
          this.fetch();
        }
      }
    },

    session(newval) {
      // this.$get("/inspection/patrol/getRound", newval).then((r) => {
      //   this.rounds = r.data.data;
      // });
      this.search();
    },
    year(newval) {
      this.search();
    },
    round(newval) {
      this.search();
    },
    searchGroup(newval) {
      this.search();
    },
    searchUnit(newval) {
      this.search();
    },

    tableData(newval) {
      this.buildMerge(newval);
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
  methods: {
    ...mapMutations({
      // 打开批量导入对话框
      setImportRarDialog: "graph/setImportRarDialog",
    }),

    fetch(params = {}) {
      params.num = this.pagination.size;
      params.page = this.pagination.num;
      params.lixingType = this.lixingType;
      this.$get("inspection/lixing/list", {
        ...params,
      }).then((r) => {
        if (r.data.code === 20000) {
          const data = r.data.data;
          this.total = data.nums;
          this.tableData = data.list;
          let obj = {
            id: "",
            patrolId: "",
            attachId: "",
            fileName: "",
            filetype: "",
          };
          this.tableData.forEach((item, index) => {
            item["id1"] = String(index);
            if (item.problemMaterials == null) {
              item.problemMaterials = [];
              item.problemMaterials.push(this.$_.cloneDeep(obj));
            }
            if (item.rectreportMaterials == null) {
              item.rectreportMaterials = [];
              item.rectreportMaterials.push(this.$_.cloneDeep(obj));
            }
          });

          console.log("立行立改", this.tableData);
        }
      });
    },
    //搜索
    search() {
      this.searchobject.session = this.session;
      this.searchobject.round = this.round;
      this.searchobject.groupName = String(this.searchGroup);
      this.searchobject.year = this.year;
      this.searchobject.unitName = this.searchUnit;
      this.fetch({
        ...this.searchobject,
      });
    },
    //重置
    reset() {
      this.searchobject = {};
      this.session = "";
      this.round = "";
      this.searchGroup = "";
      this.year = "";
      this.searchUnit = "";
      this.fetch();
    },
    tableCell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3 || columnIndex == 6 ||
        columnIndex == 8 || columnIndex == 9) {
        // console.log("rowIndex", rowIndex);
        // console.log("rowInde%2", rowIndex%2);
        if (row.groupName % 2 == 0) {
          return "qian";
        } else {
          return "shen";
        }
      } else if (columnIndex == 2) {
        return "qian"
      } else if (columnIndex == 4) {
        if (row.groupName % 2 == 0) {
          return "blueq";
        } else {
          return "blues";
        }
      } else if (columnIndex == 5) {
        if (row.groupName % 2 == 0) {
          return "redq report_colume";
        } else {
          return "reds report_colume";
        }
      } else if (columnIndex == 7) {
        if (row.groupName % 2 == 0) {
          return "greenq report_colume";
        } else {
          return "greens report_colume";
        }
      }
    },
    tableHeader({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4) {
        return "blueHeader";
      } else if (columnIndex == 5) {
        return "redHeader"
      } else if (columnIndex == 7) {
        return "greenHeader"
      }
    },
    //创建
    add() {
      this.dialog.isVisible = true;
      this.$refs.add.init();
    },
    //上传成功的回调
    onSuccess() {
      this.$message({
        message: "上传文件成功",
        type: "success",
      });
      this.search();
    },
    //构造上传文件的其他参数
    getParams(row, type) {
      this.file.patrolunitid = row.patrolunitid;
      this.file.lixingid = row.lixing.id;
      this.file.type = type;
    },
    //上传文件
    getURL() {
      return globalConfig.baseURL + "inspection/lixing/upload";
    },
    // 文件预览
    previewReport(item) {
      // 打开单独页面进行预览
      if(item.id === "" || item.attachId === "") {
        this.$message.warning("暂无文件");
        return;
      }
      // 打开单独页面进行预览
      let fileNameArr = item.fileName.split('.');
      let router = null;
      if (fileNameArr[fileNameArr.length - 1] == 'docx' || fileNameArr[fileNameArr.length - 1] == 'doc' || fileNameArr[fileNameArr.length - 1] == 'pdf') {
        router = this.$router.resolve(
          {
            path: '/document',
            query: {
              id: item.id,
              name: item.fileName
            },
          }
        );
      } else if (fileNameArr[fileNameArr.length - 1] == 'xlsx' || fileNameArr[fileNameArr.length - 1] == 'xls') {
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
    //删除文件
    delReport(item) {
      if(item.id === "" || item.attachId === ""){
        return;
      }
      this.$get("/inspection/lixing/delfile", {
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
    //创建成功
    addSuccess() {
      this.dialog.isVisible = false;
      this.search();
    },
    addClose() {
      this.dialog.isVisible = false;
    },
    //修改专项报告
    editSuccess() {
      this.editlog.isVisible = false;
      this.search();
    },
    editClose() {
      this.editlog.isVisible = false;
    },
    //编辑一条立行立改
    editCorrect(item) {
      this.$refs.edit.getCorrect(item);
      this.editlog.isVisible = true;
    },
    //删除一条立行立改
    delCorrect(id) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        if (id != "") {
          this.$post("/inspection/lixing/del", {
            id: id,
          }).then((r) => {
            if (r.data.code === 20000) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.search();
            }
          });
        }
      }).catch(() => {
        this.$message.info("取消删除")
      });
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
      //获取轮次
      // this.$get("/inspection/patrol/getRound").then((r) => {
      //   if (r.data.code == 20000) {
      //     const data = r.data.data;
      //     data.forEach((item, index) => {
      //       // item.round = "第"+item.round+"轮"
      //     });
      //     this.rounds = data;
      //   }
      // });
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
      //获取巡察单位
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
        let fristData = this.tableData.filter(
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
        let fristData = this.tableData.filter((d) => d.id1 === secondIds[0])[0];
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
        let fristData = this.tableData.filter((d) => d.id1 === thirdIds[0])[0];
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
        let fristData = this.tableData.filter((d) => d.id1 === fourthIds[0])[0];
        // 获取第一条数据，对其添加 'fourthSpan' 属性，并设置值
        if (fristData) fristData["fourthSpan"] = fourthIds.length;
      }
    },
    buildMerge(dataList) {
      let firstObj = {},
        secondObj = {},
        thirdObj = {},
        fourthObj = {};
      let firstObjKey = "",
        secondObjKey = "",
        thirdObjKey = "",
        fourthObjKey = "";
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

    // 打开批量导入对话框
    openImportDlg() {
      this.setImportRarDialog({
        isVisible: true,
        title: "立行立改批量导入",
        type: "correctCheck",
      })
    },

    // 导出文件
    exportExcel() {
      this.searchobject.session = this.session;
      this.searchobject.round = this.round;
      this.searchobject.groupName = String(this.searchGroup);
      this.searchobject.year = this.year;
      this.searchobject.unitName = this.searchUnit;
      this.searchobject.lixingType = 1;

      let filename = this.returnFileName(this.searchobject)

      this.$downloadZip("/inspection/lixing/export", {
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
      if(params.unitName !== null && params.unitName !== "") {
        let index = this.searchUnits.findIndex(item => item.id == params.unitName)
        if(index != -1) {
          let label = this.searchUnits[index].unitName;
          filename += label + '_';
        }
      }
      filename += '立行立改.zip';
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

.fa {
  overflow: hidden;
}
.sel {
  text-align: left;
  float: left;
}
.btn {
  display: inline-block;
  margin-left: 40px;

  img {
    width: 20px;
    height: 20px;
  }
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
  // border-collapse: collapse;
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
  width: 230px;
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
//分页样式
.page_hhx {
  display: inline-block;
  padding: 22px 10px 16px 10px;
  // transform: translateX(10px);
}
.pagin {
  float: right;
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
  color: #008fff;
  font-size: 14px;
  margin-right: 10px;
}
.spanReport {
  width: 100px;
  // color: #008fff;
  cursor: pointer;
}
.icondiv {
  display: inline;
  position: absolute;
  right: 5px;
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
</style>