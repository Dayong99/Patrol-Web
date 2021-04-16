<template>
  <div class="app-container fa">
    <div class="top-container">
      <div class="top_select">
        <el-select
          v-model="session"
          clearable
          placeholder="请选择届次"
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
          placeholder="请选择年度"
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
          placeholder="请选择轮次"
          filterable
          allow-create
          default-first-option
        >
          <template slot="prefix">
            <img class="select-icon" :src="imgRound" />
          </template>
          <el-option
            v-for="item in rounds"
            :key="item.round"
            :label="'第' + item.round + '轮'"
            :value="item.round"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="searchGroup"
          clearable
          placeholder="请选择巡察组"
          filterable
          default-first-option
        >
          <template slot="prefix">
            <img class="select-icon" :src="imgGroup" />
          </template>
          <el-option
            v-for="item in searchGroups"
            :key="item.id"
            :label="item.groupName + '组'"
            :value="item.groupName"
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
        <el-button class="search" @click="search">
          <div class="img"></div>
          <span>搜索</span>
        </el-button>

        <el-button class="reset" @click="reset">
          <div class="img"></div>
          <span>重置</span>
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

      <el-table-column label="移交立行立改问题" :fit="true" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span
            @click="download(scope.row.problemMaterials[0])"
            class="spanReport"
            >{{ scope.row.problemMaterials[0].fileName }}</span
          >
        </template>
      </el-table-column>

      <el-table-column label="移交立行立改问题数" :fit="true">
        <template slot-scope="scope">
          <span>{{ scope.row.lixing.problemNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="整改情况报告" :fit="true" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span
            @click="download(scope.row.rectreportMaterials[0])"
            class="spanReport"
            >{{ scope.row.rectreportMaterials[0].fileName }}</span
          >
        </template>
      </el-table-column>

      <el-table-column label="形成报告时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.lixing.reportTime | showTime }}</span>
        </template>
      </el-table-column>
    </el-table>


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
export default {
  name: "correct_report",
  components: { Pagination, },
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
      rounds: [],
      years: [],
      searchGroups: [],
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
        title: "添加",
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
  created() {},
  mounted() {
    this.fetch();
    this.init();
  },
  watch: {
    session(newval) {
      this.$get("/inspection/patrol/getRound", newval).then((r) => {
        this.rounds = r.data.data;
      });
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
            id: "0",
            patrolId: "",
            attachId: "",
            fileName: "",
            filetype: "",
          };
          this.tableData.forEach((item, index) => {
            item["id1"] = String(index);
            if (item.problemMaterials == null) {
              item.problemMaterials = [];
              item.problemMaterials.push(obj);
            }
            if (item.rectreportMaterials == null) {
              item.rectreportMaterials = [];
              item.rectreportMaterials.push(obj);
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
        if (row.groupName%2 == 0) {
          return "qian";
        } else {
          return "shen";
        }
      } else if (columnIndex == 2) {
        return "qian"
      } else if (columnIndex == 4) {
        if (row.groupName%2 == 0) {
          return "blueq";
        } else {
          return "blues";
        }
      } else if (columnIndex == 5) {
        if (row.groupName%2 == 0) {
          return "redq";
        } else {
          return "reds";
        }
      } else if (columnIndex == 7) {
        if (row.groupName%2 == 0) {
          return "greenq";
        } else {
          return "greens";
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
      //获取巡察组
      this.$get("/inspection/patrol/getGroupName").then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          data.forEach((item, index) => {
            // item.round = "第"+item.round+"轮"
          });
          this.searchGroups = data;
        }
      });
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
  },
};
</script>

<style lang="scss" scoped>
/deep/ .shen {
  background: #EEF0F2 !important;
}
/deep/ .qian {
  background: #F6F7F8 !important;
}
/deep/ .blues {
  color: #008CF7 !important;
  background: #DDEEFF !important;
}
/deep/ .blueq {
  color: #008CF7 !important;
  background: #EDF5FC !important;
}
/deep/ .blueHeader {
  color: #008CF7 !important;
  background: #B5DAFF !important;
}
/deep/ .reds {
  color: #FF4307 !important;
  background: #FFE5DD !important;
  .spanReport {
    color: #FF4307 !important;
  }
}
/deep/ .redq {
  color: #FF4307 !important;
  background: #FFF3EF !important;
  .spanReport {
    color: #FF4307 !important;
  }
}
/deep/ .redHeader {
  color: #FF4307 !important;
  background: #FFCBB9 !important;
}
/deep/ .greens {
  color: #00B200 !important;
  background: #D3F7CD !important;
  .spanReport {
    color: #00B200 !important;
  }
}
/deep/ .greenq {
  color: #00B200 !important;
  background: #EEFCEB !important;
  .spanReport {
    color: #00B200 !important;
  }
}
/deep/ .greenHeader {
  color: #00B200 !important;
  background: #ADF6A1 !important;
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
}
/deep/ .el-table td {
  padding: 4px 0;
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
.title {
  width: 230px;
  height: 30px;
  background: #EBF5FF;
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
.page_hhx{
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