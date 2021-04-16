<template>
  <div class="app-container">
    <div class="top-container">
      <div class="top_select">
        <el-select
          v-model="queryParams.session"
          clearable
          placeholder="选择届次"
          @change="getRound"
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
          v-model="queryParams.year"
          clearable
          placeholder="选择年度"
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
          v-model="queryParams.round"
          clearable
          placeholder="选择轮次"
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
          v-model="queryParams.groupName"
          clearable
          placeholder="选择巡察组"
        >
          <template slot="prefix">
            <img class="select-icon" :src="imgGroup" />
          </template>
          <el-option
            v-for="item in groups"
            :key="item.groupName"
            :label="item.groupName + '组'"
            :value="item.groupName"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="queryParams.name"
          placeholder="输入巡察单位"
          clearable
          @clear="search"
        />
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
        <el-button class="create" @click="add">
          <div class="img"></div>
          <span>添加</span>
        </el-button>
      </div>
    </div>

    <el-table
      class="p_manager"
      ref="table"
      :key="tableKey"
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
      tooltip-effect="light"
      :span-method="objectSpanMethod"
    >
      <!-- @selection-change="handleSelectionChange"> -->
      <el-table-column label="届次">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.main.session + "届" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年度">
        <template slot-scope="scope">
          <span>{{ scope.row.main.year + "年" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="轮次">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.main.round + "轮" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡察组">
        <template slot-scope="scope">
          <span>{{ scope.row.main.groupName + "组" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被巡察单位" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.unit.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span>{{ scope.row.unit.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡察时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.main.patrolTime | showTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.main.endTime | showTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="operation1">
            <img
              class="el-icon"
              :src="imgEdit"
              alt=""
              @click="edit(scope.row)"
            />
            <img class="el-icon" :src="imgDel" alt="" @click="del(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加对话框 -->
    <Add
      ref="add"
      :dialog-visible="addlog.isVisible"
      :title="addlog.title"
      :sessions="sessions"
      :years="years"
      :groups="groups"
      :units="units"
      @getNewInfo="getInfo"
      @success="addSuccess"
      @close="addClose"
    />

    <!-- 修改对话框 -->
    <Edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :sessions="sessions"
      :years="years"
      :groups="groups"
      :units="units"
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Add from "./inspection_management/add";
import Edit from "./inspection_management/edit"

export default {
  name: 'system_inspection_management',
  props: {},
  components: { Pagination, Add, Edit },
  data() {
    return {
      addlog: {
        isVisible: false,
        title: "添加巡察任务",
      },
      dialog: {
        isVisible: false,
        title: "修改",
      },
      tableKey: 0,
      pagination: {
        pageSize: 15,
        pageNum: 1,
      },
      total: 0,
      queryParams: {
        session: null,
        year: null,
        round: null,
        groupName: null,
        name: null,
      },
      selection: [],
      list: [],
      tableData: null,
      sessions: [],
      years: [],
      rounds: [],
      groups: [],
      units: [],
      imgSearch: require('@/assets/main_images/search.png'),
      imgReset: require('@/assets/icon_img/重置标.png'),
      imgEdit: require('@/assets/icon_img/edit.png'),
      imgDel: require('@/assets/icon_img/delete.png'),
      imgSession: require("@/assets/main_images/session.png"),
      imgYear: require("@/assets/main_images/year.png"),
      imgRound: require("@/assets/main_images/round.png"),
      imgGroup: require("@/assets/main_images/group.png"),
      imgUnit: require("@/assets/main_images/unit.png"),
    }
  },
  created() {
    this.getInfo();
    this.fetch();
  },
  watch: {
    tableData(val) {
      this.buildMerge(val)
    },
    "queryParams.session"(val) {
      this.search(val);
    },
    "queryParams.year"(val) {
      this.search(val);
    },
    "queryParams.round"(val) {
      this.search(val);
    },
    "queryParams.groupName"(val) {
      this.search(val);
    },
    "queryParams.name"(val) {
      this.search(val);
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
    getInfo() {
      //获取届次
      this.$get("/inspection/patrol/getSession").then((r) => {
        if (r.data.code == 20000) {
          this.sessions = r.data.data;
        }
      });
      //获取年度
      this.$get("/inspection/patrol/getYear").then((r) => {
        if (r.data.code == 20000) {
          this.years = r.data.data;
        }
      });
      //获取巡察组
      this.$get("/inspection/patrol/getGroupName").then((r) => {
        if (r.data.code == 20000) {
          this.groups = r.data.data;
        }
      });
      //获取巡察单位
      this.$get("/inspection/patrol/getUnit").then((r) => {
        if (r.data.code == 20000) {
          this.units = r.data.data;
        }
      });
    },
    getRound() {
      let params = {};
      params.session = this.queryParams.session;
      // console.log("届：",params.session);
      if (params.session != null && params.session != "") {
        this.$get("/inspection/patrol/getRound", { ...params }).then((r) => {
          if (r.data.code == 20000) {
            this.rounds = r.data.data;
            // console.log("轮次：",this.rounds);
          }
        });
      } else {
        this.clearRound();
      }
    },
    clearRound() {
      this.rounds = [];
    },
    //加载表格
    fetch(params = {}) {
      params.size = this.pagination.pageSize;
      params.current = this.pagination.pageNum;
      this.$get("/inspection/patrol/getPatrolUnit", { ...params }).then((r) => {
        if (r.data.code = 20000) {
          const data = r.data.data;
          this.total = data.total;
          this.list = data.records;
          let i = 0;
          this.tableData = [];
          this.list.forEach((item, index) => {

            if (item.units.length != 0) {
              item.units.forEach((item1, index) => {
                item.reportPatrolUnits.forEach((item2, index) => {
                  if (item2.unitId == item1.id) {
                    let obj = {
                      main: item,
                      unit: item1,
                      maps: item2,
                      id1: String(i)
                    }; i++;
                    this.tableData.push(obj);
                  }
                });
              });
            } else {
              let empty = {
                id: null, name: null, shorter: null, mobile: null,
                user: null, email: null, sort: null
              };
              let obj1 = {
                main: item,
                unit: empty,
                id1: String(i)
              }; i++;
              this.tableData.push(obj1);
            }
          });
          console.log("tableData:", this.tableData);
        }
      });
    },
    search() {
      if (this.queryParams.id) {
        this.fetch({ ...this.queryParams });
      } else {
        delete this.queryParams.id;
        this.fetch({ ...this.queryParams });
      }
    },
    //重置
    reset() {
      this.queryParams = {
        session: null,
        year: null,
        round: null,
        groupName: null,
        name: null,
      };
      this.sort = {};
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.search();
    },
    tableCell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3 || columnIndex == 5 ||
        columnIndex == 6 || columnIndex == 7 || columnIndex == 8) {
        if (row.main.groupName % 2 == 0) {
          return "qian";
        } else {
          return "shen";
        }
      } else if (columnIndex == 2) {
        return "qian"
      } else if (columnIndex == 4) {
        if (row.main.groupName % 2 == 0) {
          return "blueq";
        } else {
          return "blues";
        }
      }
    },
    tableHeader({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4) {
        return "blueHeader";
      }
    },
    //新增
    add() {
      this.addlog.isVisible = true;
    },
    addClose() {
      this.addlog.isVisible = false;
    },
    addSuccess() {
      this.search();
    },
    //编辑
    edit(row) {
      this.$refs.edit.setInspection(row);
      this.dialog.isVisible = true;
    },
    editClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      this.search();
    },

    del(row) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        this.$delete("/inspection/patrol", {
          id: row.main.id
        }).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success",
          });
          this.search();
        });
      });
    },

    //合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return this.ret(row, 'firstSpan')
      } else if (columnIndex === 1) {
        return this.ret(row, 'secondSpan')
      } else if (columnIndex === 2) {
        return this.ret(row, 'thirdSpan')
      } else if (columnIndex === 3) {
        return this.ret(row, 'fourthSpan')
      }
    },
    ret(row, obj) {
      if (row && row[obj] != 0) {
        return {
          rowspan: row[obj],
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },

    // 计算第一列合并总数
    computeFirstSpan(firstObj, secondObj, thirdObj, fourthObj) {
      // 遍历计算第一列合并行数
      for (let obj in firstObj) {
        let fristData = this.tableData.filter(d => d.id1 === firstObj[obj][0])[0]
        // 获取第一条数据，对其添加 'firstSpan' 属性，并设置值
        if (fristData) fristData['firstSpan'] = firstObj[obj].length
        this.computeSecondSpan(firstObj[obj], secondObj, thirdObj, fourthObj)
      }
    },
    // 计算第二列合并总数
    computeSecondSpan(classList, secondObj, thirdObj, fourthObj) {
      let secondList = []
      // 遍历计算第二列合并行数
      for (let obj in secondObj) {
        // 判断两个id数组，取其并集，并集的长度就是合并列的行数
        let secondIds = secondObj[obj].filter(val => {
          return classList.indexOf(val) > -1
        })
        let fristData = this.tableData.filter(d => d.id1 === secondIds[0])[0]
        // 获取第一条数据，对其添加 'secondSpan' 属性，并设置值
        if (fristData) fristData['secondSpan'] = secondIds.length
        secondList.push(secondIds)
      }
      secondList.forEach(list => {
        this.computeThirdSpan(list, thirdObj, fourthObj)
      })
    },
    // 计算第三列合并总数
    computeThirdSpan(list, thirdObj, fourthObj) {
      let thirdList = []
      // 遍历计算第三列合并行数
      for (let obj in thirdObj) {
        let thirdIds = thirdObj[obj].filter(val => {
          return list.indexOf(val) > -1
        })
        let fristData = this.tableData.filter(d => d.id1 === thirdIds[0])[0]
        // 获取第一条数据，对其添加 'thirdSpan' 属性，并设置值
        if (fristData) fristData['thirdSpan'] = thirdIds.length
        thirdList.push(thirdIds)
      }
      thirdList.forEach(list => {
        this.computeFourthSpan(list, fourthObj)
      })
    },
    // 计算第四列合并总数
    computeFourthSpan(list, fourthObj) {
      // 遍历计算第四列合并行数
      for (let obj in fourthObj) {
        let fourthIds = fourthObj[obj].filter(val => {
          return list.indexOf(val) > -1
        })
        let fristData = this.tableData.filter(d => d.id1 === fourthIds[0])[0]
        // 获取第一条数据，对其添加 'fourthSpan' 属性，并设置值
        if (fristData) fristData['fourthSpan'] = fourthIds.length
      }
    },
    buildMerge(dataList) {
      let firstObj = {},
        secondObj = {},
        thirdObj = {},
        fourthObj = {}
      let firstObjKey = '',
        secondObjKey = '',
        thirdObjKey = '',
        fourthObjKey = ''
      // console.log('this.total',this.total)
      for (let i = 0, len = dataList.length; i < len; i++) {
        firstObjKey = dataList[i].main.session
        secondObjKey = dataList[i].main.year
        thirdObjKey = dataList[i].main.round
        fourthObjKey = dataList[i].main.groupName
        if (!firstObj[firstObjKey])
          firstObj[firstObjKey] = new Array(dataList[i].id1)
        else {
          firstObj[firstObjKey].push(dataList[i].id1)
        }
        if (!secondObj[secondObjKey])
          secondObj[secondObjKey] = new Array(dataList[i].id1)
        else {
          secondObj[secondObjKey].push(dataList[i].id1)
        }
        if (!thirdObj[thirdObjKey])
          thirdObj[thirdObjKey] = new Array(dataList[i].id1)
        else {
          thirdObj[thirdObjKey].push(dataList[i].id1)
        }
        if (!fourthObj[fourthObjKey])
          fourthObj[fourthObjKey] = new Array(dataList[i].id1)
        else {
          fourthObj[fourthObjKey].push(dataList[i].id1)
        }

      }
      this.computeFirstSpan(firstObj, secondObj, thirdObj, fourthObj)
    }
  },
}
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
}

.operation1 > img {
  cursor: pointer;
  // padding: 0px 5px;
  margin: 0px 5px;
}
.op {
  cursor: pointer;
  margin: 0 5px;
}
.fa {
  overflow: hidden;
}
//分页样式
.page_hhx {
  display: inline-block;
  padding: 22px 10px 16px 10px;
  // transform: translateX(10px);
}
.el-icon {
  cursor: pointer;
  vertical-align: middle;
  width: 23px;
  height: 23px;
}
</style>