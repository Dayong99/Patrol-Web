<template>
  <div class="app-container fa">
    <div class="top-container">
      <div class="top_select">
        <el-select
          v-model="queryParams.session"
          clearable
          placeholder="选择届次"
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

        <el-select v-model="queryParams.year" clearable placeholder="选择年度">
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

        <el-select v-model="queryParams.round" clearable placeholder="选择轮次">
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
          v-model.number="queryParams.groupName"
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
          v-model="queryParams.name"
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

        <el-select
          v-model="queryParams.end"
          clearable
          placeholder="是否办结"
        >
          <el-option
            v-for="item in endList"
            :key="item.id"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <!-- <el-select
          v-model="queryParams.message"
          clearable
          placeholder="具体办理情况"
        >
          <el-option
            v-for="item in situations"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select> -->

        <!-- <el-select
          v-model="queryParams.information"
          clearable
          placeholder="具体成果运用情况"
        >
          <el-option
            v-for="item in achievements"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select> -->
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
      class="suggest_index"
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
      <!-- :span-method="objectSpanMethod" -->
      <el-table-column label="届次">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.session + "届" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="年度">
        <template slot-scope="scope">
          <span>{{ scope.row.year + "年" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="轮次">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.round + "轮" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="巡察组">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName + "组" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="被巡察单位" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.unitName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="移交单位">
        <template slot-scope="scope">
          <span>{{ scope.row.proposal.transferingUnit }}</span>
        </template>
      </el-table-column>

      <el-table-column label="移交时间" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.proposal.transferingTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="移交具体问题建议"
        width="230px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span class="report" @click="download(scope.row.material)">
            {{ scope.row.material.fileName }}
          </span>
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
                      @click="getParams(scope.row.proposal.id)"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="previewReport(scope.row.material)"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="delReport(scope.row.material)"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="移交问题建议数" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.proposal.transferingNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否办结" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.proposal.end | showState }}</span>
          <div class="icondiv">
            <el-dropdown
              @command="handleCommand"
              trigger="click"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="special_drop">
                <el-dropdown-item
                  :command="setResult(scope.row.proposal, (message = 1))"
                  class="special_drop_item"
                >
                  已办结
                </el-dropdown-item>
                <el-dropdown-item
                  :command="setResult(scope.row.proposal, (message = 0))"
                  class="special_drop_item"
                >
                  正在办理中
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="具体办理情况" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.proposal.message }}</span>
        </template>
      </el-table-column>

      <el-table-column label="成果运用情况" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.proposal.information }}</span>
        </template>
      </el-table-column>

      <el-table-column label="期限提醒">
        <template slot-scope="scope">
          <span>{{ scope.row.proposal.remind }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="80px" align="center">
        <template slot-scope="scope">
          <img class="el-icon" :src="imgEdit" @click="editSuggest(scope.row)" />
          <img
            class="el-icon"
            :src="imgDel"
            @click="delSuggest(scope.row.proposal.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <suggest-add
      ref="add"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :sessions="sessions"
      :years="years"
      :searchUnits="searchUnits"
      @success="addSuccess"
      @close="addClose"
    />

    <suggest-edit
      ref="edit"
      :dialog-visible="editlog.isVisible"
      :title="editlog.title"
      :searchUnits="searchUnits"
      @success="editSuccess"
      @close="editClose"
    />

    <pagination
      v-show="total > 0"
      :page.sync="pagination.pageNum"
      :limit.sync="pagination.pageSize"
      @pagination="search"
      :total="total"
      class="page_hhx"
    />
    <div class="title">
      <span>移交问题建议情况一览表</span>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import suggestAdd from "./add.vue";
import suggestEdit from "./edit.vue";
import { mapState, mapMutations } from 'vuex';
export default {
  name: "special_report",
  components: { Pagination, suggestAdd, suggestEdit },
  data() {
    return {
      queryParams: {
        session: null,
        round: null,
        year: null,
        groupName: null,
        name: null,
        end: null,
      },
      endList: [
        {
          id: 0,
          name: "正在办理中",
          value: 0,
        },
        {
          id: 1,
          name: "已办结",
          value: 1,
        },
      ],
      sessions: [],
      years: [],
      // rounds: [],
      // searchGroups: [],
      searchUnits: [],
      situations: [],
      achievements: [],
      list: [],
      tableData: [],
      dialog: {
        isVisible: false,
        title: "创建",
      },
      editlog: {
        isVisible: false,
        title: "修改",
      },
      pagination: {
        pageSize: 15,
        pageNum: 1,
      },
      file: {}, //上传文件的参数
      total: 0,
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
  mounted() {
    this.fetch();
    this.initSelect();
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
    'refreshList.specialRefresh': {
      handler(newval, oldval) {
        if (newval) {
          this.fetch();
        }
      }
    },

    tableData(val) {
      this.buildMerge(val);
    },
    "queryParams.session"(newval) {
      // this.$get("/inspection/patrol/getRound", newval).then((r) => {
      //   this.rounds = r.data.data;
      // });
      this.search();
    },
    "queryParams.year"(newval) {
      this.search();
    },
    "queryParams.round"(newval) {
      this.search();
    },
    "queryParams.groupName"(newval) {
      this.search();
    },
    "queryParams.name"(newval) {
      this.search();
    },
    "queryParams.end"() {
      this.search();
    },
  },
  filters: {
    showState(val) {
      switch (val) {
        case "0":
          return "正在办理中";
        case "1":
          return "已办结";
        case null:
          return "";
        default:
          return "";
      }
    },
  },
  methods: {
    ...mapMutations({
      // 打开批量导入对话框
      setImportRarDialog: "graph/setImportRarDialog",
    }),
    //上传文件成功的回调
    onSuccess() {
      this.$message({
        message: "上传文件成功",
        type: "success",
      });
      this.search();
    },
    //设置上传文件的参数
    getParams(id) {
      this.file.proposalId = id;
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
    // 文件预览
    previewReport(item) {
      // 打开单独页面进行预览
      if(item.id === "" || item.attachId === "") {
        this.$message.warning("暂无文件");
        return;
      }
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
    //删除报告
    delReport(item) {
      if(item.id === "" || item.attachId === ""){
        return;
      }
      this.$delete("/inspection/t-proposal/delFile", {
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
    //修改建议
    editSuggest(item) {
      this.editlog.isVisible = true;
      this.$refs.edit.getPatrol(item);
    },
    //删除建议
    delSuggest(id) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        this.$delete("/inspection/t-proposal", {
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
    //增加移交问题建议
    add() {
      this.dialog.isVisible = true;
      this.$refs.add.init();
    },
    //创建移交问题建议
    addSuccess() {
      this.dialog.isVisible = false;
      this.search();
    },
    addClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      this.editlog.isVisible = false;
      this.search();
    },
    editClose() {
      this.editlog.isVisible = false;
    },
    initSelect() {
      //获取届次
      this.$get("/inspection/patrol/getSession").then((r) => {
        if (r.data.code == 20000) {
          this.sessions = r.data.data;
          console.log("sessions:", this.sessions);
        }
      });
      //获取轮次
      // this.$get("/inspection/patrol/getRound").then((r) => {
      //   if (r.data.code == 20000) {
      //     this.rounds = r.data.data;
      //     console.log("rounds:", this.rounds);
      //   }
      // });
      //获取年份
      this.$get("/inspection/patrol/getYear").then((r) => {
        if (r.data.code == 20000) {
          this.years = r.data.data;
          console.log("years:", this.years);
        }
      });
      // //获取巡察组
      // this.$get("/inspection/patrol/getGroupName").then((r) => {
      //   if (r.data.code == 20000) {
      //     this.searchGroups = r.data.data;
      //     console.log("searchGroups:", this.searchGroups);
      //   }
      // });
      //获取巡察单位
      this.$get("/inspection/patrol/getUnit").then((r) => {
        if (r.data.code == 20000) {
          this.searchUnits = r.data.data;
          console.log("searchUnits:", this.searchUnits);
        }
      });
    },

    //加载表格
    fetch(params = {}) {
      params.size = this.pagination.pageSize;
      params.current = this.pagination.pageNum;
      this.$get("/inspection/t-proposal", { ...params }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.total = data.total;
          this.tableData = data.records;
          let obj = {
            id: "",
            patrolId: "",
            attachId: "",
            fileName: "",
            filetype: "",
            uptime: "",
          };
          this.tableData.forEach((item, index) => {
            item["id1"] = String(index);
            if (item.material == null) {
              item.material = this.$_.cloneDeep(obj);
            }
          });

          console.log("移交问题建议:", this.tableData);
        }
      });
    },
    search() {
      if (this.queryParams) {
        this.fetch({
          ...this.queryParams,
        });
      } else {
        delete this.queryParams.name;
        this.fetch({
          ...this.queryParams,
        });
      }
    },
    //上传文件
    getURL() {
      return globalConfig.baseURL + "inspection/t-proposal/upload";
    },
    setResult(proposal, message) {
      return {
        proposal: proposal,
        message: message,
      };
    },
    //设置是否办结
    handleCommand(command) {
      console.log("command", command);
      this.$put("/inspection/t-proposal", {
        end: command.message,
        id: command.proposal.id,
        patrolId: command.proposal.patrolId,
      }).then((r) => {
        if (r.data.code === 20000) {
          this.search();
        }
      });
    },
    // 重置相关信息
    reset() {
      this.queryParams = {};
      this.sort = {};
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.search();
    },
    tableCell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3 || columnIndex == 5 || columnIndex == 6 ||
        columnIndex == 8 || columnIndex == 9 || columnIndex == 10 ||
        columnIndex == 11 || columnIndex == 12 || columnIndex == 13) {
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
      } else if (columnIndex == 7) {
        if (row.groupName % 2 == 0) {
          return "redq report_colume";
        } else {
          return "reds report_colume";
        }
      }
    },
    tableHeader({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4) {
        return "blueHeader";
      } else if (columnIndex == 7) {
        return "redHeader"
      }
    },

    //合并单元格
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
      console.log("this.total", this.total);
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
        title: "移交问题建议批量导入",
        type: "suggest",
      })
    },

    // 导出文件
    exportExcel() {
      let filename = this.returnFileName(this.queryParams)

      this.$downloadZip("/inspection/t-proposal/export", {
        ...this.queryParams
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
        filename += params.name + '_';
      }
      if(params.end !== null && params.end !== "") {
        if(params.end == 0) {
          filename += '正在办理中_';
        } else if(params.end == 1) {
          filename += '已办结_';
        }
      }
      filename += '移交问题建议.zip';
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

.fa {
  overflow: hidden;
}
.top-box {
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
}
.sel {
  display: inline-block;
  text-align: left;
}
.sel > .el-select {
  margin-bottom: 5px;
  width: 150px;
}
.btn {
  display: inline-block;
  margin: 10px 0 0 40px;

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
}
/deep/ .el-table {
  .report_colume {
    .cell {
      white-space: nowrap;
      padding: 0 20px 0 15px;

      span {
        cursor: pointer;
      }
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
/deep/ .el-button {
  width: 80px;
  height: 32px;
  padding: 0 11px 0 7px;
  font-size: 16px;
  margin-right: 5px;
}
//分页样式
.page_hhx {
  display: inline-block;
  padding: 22px 10px 16px 10px;
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
.icondiv {
  display: inline;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  img {
    cursor: pointer;
  }
  i {
    cursor: pointer;
  }
}
.more1 {
  height: 23px;
  width: 17px;
  content: url("../../../assets/icon_img/更多-橙.png");
}

// 下拉列表
.special_drop {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  .special_drop_item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      flex: 1;
    }

    img {
      &:hover {
        background-color: #c9e3fc;
        color: #46a6ff;
      }
    }
  }

  // 无文件
  .noreport {
    margin-left: 10px;
  }
}
</style>