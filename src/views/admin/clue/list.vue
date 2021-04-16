<template>
  <div class="app-container fa">
    <div class="top-container">
      <div class="top_select">
        <el-select
          v-model="queryParams.session"
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
          v-model="queryParams.year"
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
          v-model="queryParams.round"
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
          v-model="queryParams.groupName"
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
          v-model="queryParams.unitName"
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
          v-model="queryParams.discipline"
          clearable
          placeholder="选择六项纪律"
          filterable
          default-first-option
        >
          <el-option
            v-for="item in sixList"
            :key="item.id"
            :label="item.result"
            :value="item.result"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="queryParams.firstcategory"
          placeholder="选择一级分类"
          clearable
          filterable
          default-first-option
        >
          <el-option
            v-for="item in firstList"
            :key="item.id"
            :label="item.result"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="queryParams.end"
          clearable
          placeholder="选择是否办结"
        >
          <el-option
            v-for="item in endList"
            :key="item.id"
            :label="item.name"
            :value="item.value"
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

    <!-- <el-scrollbar style="height: 100%;"> -->
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
      :span-method="objectSpanMethod"
      tooltip-effect="dark"
    >
      <el-table-column label="届次" width="100px">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.main.session + "届" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="年度" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.main.year + "年" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="轮次" width="100px">
        <template slot-scope="scope">
          <span>{{ "第" + scope.row.main.round + "轮" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="巡察组" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.main.groupName + "组" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="被巡察单位" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.main.unitName }}</span>
          <div class="operation1">
            <img :src="imgAdd" alt="" @click="addclue(scope.row)" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="被反映人姓名" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.reactionName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="被反映人职务" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.reactionPost }}</span>
        </template>
      </el-table-column>

      <el-table-column label="被反映人级别" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.reactionLevel }}</span>
        </template>
      </el-table-column>

      <el-table-column label="具体问题" width="200px" class-name="problem">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title="问题内容"
            
            trigger="click"
            popper-class="problem_popper"
            :content="scope.row.clueInfo.problem">
            <span slot="reference">{{ scope.row.clueInfo.problem }}</span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="六项纪律" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.discipline }}</span>
        </template>
      </el-table-column>

      <el-table-column label="一级分类" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.firstcategoryStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="二级分类" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.twoCategoryStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="移交时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.handoverTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="移交方式" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.handoverType | showType }}</span>
        </template>
      </el-table-column>

      <el-table-column label="移交单位" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.transferingUnit }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类处理意见" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.classification }}</span>
        </template>
      </el-table-column>

      <el-table-column label="处理结果" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.result }}</span>
        </template>
      </el-table-column>

      <el-table-column label="具体办理情况" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.situation }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否办结" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.clueInfo.end | showEnd }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
          <img class="el-icon" :src="imgEdit" alt="" @click="edit(scope.row)" />
          <img class="el-icon" :src="imgDel" alt="" @click="del(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- </el-scrollbar> -->

    <!-- 添加新 -->
    <Add
      ref="add"
      :title="addlog.title"
      :addlog-visible="addlog.isVisible"
      :sessions="sessions"
      :years="years"
      :searchUnits="searchUnits"
      :firstList="firstList"
      :secondList="secondList"
      :sixList="sixList"
      @success="addSuccess"
      @close="addClose"
    />

    <Addclue
      ref="addclue"
      :title="addcluelog.title"
      :addlog-visible="addcluelog.isVisible"
      :firstList="firstList"
      :secondList="secondList"
      :sixList="sixList"
      @success="addclueSuccess"
      @close="addclueClose"
    />

    <Edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :sessions="sessions"
      :years="years"
      :searchUnits="searchUnits"
      :firstList="firstList"
      :secondList="secondList"
      :sixList="sixList"
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

    <!-- <div class="title">
      <span>巡察线索办理一览表</span>
    </div> -->

    <div class="chart_box">
      <!-- 柱形图 -->
      <histogram class="district_chart"></histogram>

      <div class="chart_operation">
        <div
          :class="{
            histogram_btn: true,
            chart_btn: true,
            btn_active: chartFlag == 0,
          }"
          @click.stop="changeChart(0)"
        >
          柱状图
        </div>
        <div
          :class="{
            linechart_btn: true,
            chart_btn: true,
            btn_active: chartFlag == 1,
          }"
          @click.stop="changeChart(1)"
        >
          折线图
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Add from "./add";
import Addclue from "./addClue";
import Edit from "./edit";
import { mapState, mapMutations } from "vuex";
import Histogram from "@/components/InfoChart/ClueHistogram.vue";

export default {
  name: "special_report",
  components: { Pagination, Add, Addclue, Edit, Histogram, },
  data() {
    return {
      addlog: {
        isVisible: false,
        title: "创建",
      },
      addcluelog: {
        isVisible: false,
        title: "新增线索",
      },
      dialog: {
        isVisible: false,
        title: "修改",
      },
      queryParams: {
        firstcategory: "",
        session: "",
        round: "",
        year: "",
        groupName: "",
        unitName: "",
        discipline: "",
        end: "",
      },
      sessions: [],
      // rounds: [],
      years: [],
      // searchGroups: [],
      searchUnits: [],
      sixList: [],
      labelList: [],
      firstList: [],
      secondList: [],
      elseList: [],
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
      pagination: {
        pageSize: 15,
        pageNum: 1,
      },
      total: 0,
      list: [],
      tableData: [],
      // 图表类型标识
      chartFlag: 0,
      colorList: [
        "#5b8ff9",
        "#5ad8a6",
        "#5d7092",
        "#5b8ff9",
        "#5ad8a6",
        "#5d7092",
        "#5b8ff9",
        "#5ad8a6",
        "#5d7092",
      ],
      imgSearch: require("@/assets/main_images/search.png"),
      imgReset: require("@/assets/main_images/reset.png"),
      imgImport: require("@/assets/main_images/import.png"),
      imgAdd: require("@/assets/icon_img/add.png"),
      imgEdit: require("@/assets/icon_img/edit.png"),
      imgDel: require("@/assets/icon_img/delete.png"),
      imgSession: require("@/assets/main_images/session.png"),
      imgYear: require("@/assets/main_images/year.png"),
      imgRound: require("@/assets/main_images/round.png"),
      imgGroup: require("@/assets/main_images/group.png"),
      imgUnit: require("@/assets/main_images/unit.png"),
    };
  },
  filters: {
    showType(val) {
      switch (Number(val)) {
        case 0:
          return "单移交";
        case 1:
          return "双移交";
        default:
          "";
      }
    },
    showEnd(val) {
      switch (Number(val)) {
        case 0:
          return "正在办理中";
        case 1:
          return "已办结";
        default:
          "";
      }
    },
  },
  mounted() {
    this.initSelect();
    this.getSix();
    // this.fetch();
    // this.initHistogram(0);
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
    'refreshList.clueRefresh': {
      handler(newval, oldval) {
        if (newval) {
          // this.fetch({
          //   ...this.queryParams,
          // });
          this.fetch();
        }
      }
    },
    tableData(val) {
      this.buildMerge(val);
    },
    "queryParams.session"(val) {
      this.search(val);
      this.initHistogram(this.chartFlag);
    },
    "queryParams.year"(val) {
      this.search(val);
    },
    "queryParams.round"(val) {
      this.search(val);
      if (this.queryParams.session != "") {
        this.initHistogram(this.chartFlag);
      }
    },
    "queryParams.firstcategory"(val) {
      this.search(val);
      if (this.queryParams.session != "" || this.queryParams.round != "") {
        this.initHistogram(this.chartFlag);
      }
      if (val == "") {
        this.initHistogram(this.chartFlag);
      }
    },
    "queryParams.unitName"(val) {
      this.search(val);
    },
    "queryParams.groupName"(val) {
      this.search(val);
    },
    "queryParams.discipline"(val) {
      this.search(val);
    },
    "queryParams.end"(val) {
      this.search(val);
    },
  },
  methods: {
    ...mapMutations({
      // 打开批量导入对话框
      setImportFileDialog: "graph/setImportFileDialog",
    }),
    //计算百分比
    getPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0;
    },
    ...mapMutations({
      setClueData: "graph/setClueData",
    }),
    // 切换柱状图、折线图  flag == 0 柱状图  flag == 1 折线图
    changeChart(flag) {
      this.chartFlag = flag;
      this.initHistogram(flag);
    },

    // 构造图表数据，通过store传入图表组件中
    async initHistogram(flag) {
      let optionsData = {
        type: flag,
        title: "线索覆盖范围",
        legendData: [],
        xData: [],
        seriesData: [],
      };
      let total = 0; //总数
      await this.$post("inspection/clue/counts", {
        session: this.queryParams.session,
        round: this.queryParams.round,
        firstid: this.queryParams.firstcategory,
      }).then((r) => {
        if (r.data.code === 20000) {
          const data = r.data.data;
          total = data.nums;
        }
      });
      this.$post("/inspection/clue/analysis", {
        session: this.queryParams.session,
        round: this.queryParams.round,
        lableid: this.queryParams.firstcategory,
      }).then((r) => {
        if (r.data.code === 20000) {
          if (this.queryParams.round == "" && this.queryParams.firstcategory == "") {
            if (this.queryParams.session != "") {
              optionsData.title = optionsData.title + "（" + this.queryParams.session + "届）"
            }
            let analysisData = r.data.data;
            console.log("----analysisData", analysisData);
            //数据数量
            let len = analysisData.length - 1;
            if (len <= 0) {
              return
            }
            // 线索类别
            for (let i = 0; i < len; i++) {
              if (
                optionsData.legendData.indexOf(analysisData[i].result) == -1
              ) {
                optionsData.legendData.push(analysisData[i].result);
              }
            }
            //轮次

            let rounds = analysisData[analysisData.length - 1].rounds;
            if (rounds !== undefined) {
              rounds.forEach((item) => {
                optionsData.xData.push("第" + item + "轮");
              });

              // x轴数据和鼠标移入详细信息显示
              optionsData.legendData.forEach((item, index) => {
                let obj = {
                  name: item,
                  color: this.colorList[index],
                  data: [],
                };
                for (let i = 1; i <= rounds.length; i++) {
                  obj.data.push(0);
                }
                for (let i = 1; i <= rounds.length; i++) {
                  for (let j = 0; j < len; j++) {
                    if (
                      i == analysisData[j].round &&
                      item == analysisData[j].result
                    ) {
                      let percent = this.getPercent(
                        analysisData[j].nums,
                        total
                      );
                      obj.data[i - 1] = Number(percent);
                    }
                  }
                }
                optionsData.seriesData.push(obj);
              });
            }
            console.log("optionsData----", optionsData);
            this.setClueData(optionsData);
          } else if (
            //             届次、一级分类
            //   所有轮次中各个二级分类的占比
            this.queryParams.session != "" &&
            this.queryParams.round == "" &&
            this.queryParams.firstcategory != ""
          ) {
            let index = this.firstList.findIndex(firstItem => firstItem.id == this.queryParams.firstcategory)
            if(index != -1) {
              optionsData.title = optionsData.title + "（" + this.queryParams.session + "届-" + this.firstList[index].result + "）"
            } else {
              optionsData.title = optionsData.title + "（" + this.queryParams.session + "届-" + this.queryParams.firstcategory + "）"
            }

            let analysisData = r.data.data;
            console.log("----analysisData", analysisData);
            //数据数量
            let len = analysisData.length - 1;
            // 线索类别
            for (let i = 0; i < len; i++) {
              if (
                optionsData.legendData.indexOf(analysisData[i].result) == -1
              ) {
                optionsData.legendData.push(analysisData[i].result);
              }
            }
            //轮次

            let rounds = analysisData[analysisData.length - 1].rounds;
            if (rounds !== undefined) {
              rounds.forEach((item) => {
                optionsData.xData.push("第" + item + "轮");
              });

              // x轴数据和鼠标移入详细信息显示
              optionsData.legendData.forEach((item, index) => {
                let obj = {
                  name: item,
                  color: this.colorList[index],
                  data: [],
                };
                for (let i = 1; i <= rounds.length; i++) {
                  obj.data.push(0);
                }
                for (let i = 1; i <= rounds.length; i++) {
                  for (let j = 0; j < len; j++) {
                    if (
                      i == analysisData[j].round &&
                      item == analysisData[j].result
                    ) {
                      let percent = this.getPercent(
                        analysisData[j].nums,
                        total
                      );
                      obj.data[i - 1] = Number(percent);
                    }
                  }
                }
                optionsData.seriesData.push(obj);
              });
              this.setClueData(optionsData);
            }
          } else if (
            //届次 轮次 都有
            this.queryParams.session != "" &&
            this.queryParams.round != ""
          ) {
            if(this.queryParams.firstcategory == "") {
              optionsData.title = optionsData.title + "（" + this.queryParams.session + "届-" + this.queryParams.round + "轮）"
            } else {
              let index = this.firstList.findIndex(firstItem => firstItem.id == this.queryParams.firstcategory)
              if(index != -1) {
                optionsData.title = optionsData.title + "（" + this.queryParams.session + "届-" + this.queryParams.round + "轮-" + this.firstList[index].result + "）"
              } else {
                optionsData.title = optionsData.title + "（" + this.queryParams.session + "届-" + this.queryParams.round + "轮-" + this.queryParams.firstcategory + "）"
              }
            }

            let analysisData = r.data.data;
            console.log("----analysisData", analysisData);
            //数据数量
            let len = analysisData.length;
            // 线索类别
            for (let i = 0; i < len; i++) {
              if (optionsData.xData.indexOf(analysisData[i].result) == -1) {
                optionsData.xData.push(analysisData[i].result);
              }
            }
            let obj = {
              name: "占比",
              color: this.colorList[1],
              data: [],
            };
            // x轴数据和鼠标移入详细信息显示
            optionsData.xData.forEach((item, index) => {
              for (let i = 0; i < len; i++) {
                if (item == analysisData[i].result) {
                  let percent = this.getPercent(analysisData[i].nums, total);
                  obj.data[index] = Number(percent);
                }
              }
            });
            optionsData.seriesData.push(obj);
            this.setClueData(optionsData);
          }
        }
      });
    },
    initSelect(params = {}) {
      params.current = 1;
      params.size = 10000;
      params.labletype = 4;
      //获取届次
      this.$get("/inspection/patrol/getSession").then((r) => {
        if (r.data.code == 20000) {
          this.sessions = r.data.data;
          // 初始为最新届次并加载轮次信息
          this.queryParams.session = this.sessions[this.sessions.length - 1].session
          // this.getRound()
          // console.log("sessions:",this.sessions);
        }
      });
      //获取年份
      this.$get("/inspection/patrol/getYear").then((r) => {
        if (r.data.code == 20000) {
          this.years = r.data.data;
          // console.log("years:",this.years);
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
          // console.log("searchUnits:",this.searchUnits);
        }
      });
      //获取分类标签
      this.$get("/inspection/t-label/getResult", { ...params }).then((r) => {
        if (r.data.code == 20000) {
          this.firstList = [];
          this.secondList = [];
          this.labelList = r.data.data.records;
          this.labelList.forEach((item, index) => {
            let obj = {
              id: item.id,
              result: item.result,
            };
            this.firstList.push(obj);
            item.lists.forEach((item1, index) => {
              let obj1 = {
                id: item1.id,
                result: item1.result,
                parentId: item1.parentid,
              };
              this.secondList.push(obj1);
            });
          });
          // console.log("一级分类:",this.firstList);
          // console.log("二级分类:",this.secondList);
        }
      });
      params.labletype = 3;
      this.$get("/inspection/t-label/getResult", { ...params }).then((r) => {
        if (r.data.code == 20000) {
          this.elseList = r.data.data.records;
          // console.log("其他标签:",this.elseList);
        }
      });
    },
    // getRound() {
    //   let params = {};
    //   params.session = this.queryParams.session;
    //   // console.log("届：",params.session);
    //   if (params.session != null && params.session != "") {
    //     this.$get("/inspection/patrol/getRound", { ...params }).then((r) => {
    //       if (r.data.code == 20000) {
    //         this.rounds = r.data.data;
    //         // console.log("轮次：",this.rounds);
    //       }
    //     });
    //   } else {
    //     this.rounds = [];
    //   }
    // },
    //获取六项纪律
    getSix(params = {}) {
      params.current = 1;
      params.size = 10;
      params.labletype = 2;
      this.$get("/inspection/t-label/getResult", { ...params }).then((r) => {
        if (r.data.code == 20000) {
          this.sixList = r.data.data.records;
        }
      });
    },

    //加载表格
    fetch(params = {}) {
      params.num = this.pagination.pageSize;
      params.page = this.pagination.pageNum;
      this.$get("/inspection/clue/list", { ...params }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.total = data.total;
          this.list = data.list;
          let i = 0;
          this.tableData = [];
          if (data.total <= 0) {
            this.$message.warning("暂无相关数据")
            return
          }
          this.list.forEach((item) => {
            item.clues.forEach((item1) => {
              let obj = {
                main: item,
                clueInfo: item1,
                id1: String(i),
              };
              i++;
              this.tableData.push(obj);
            });
          });
          console.log("tableData:", this.tableData);
        }
      });
    },
    search() {
      if (this.queryParams) {
        this.fetch({
          ...this.queryParams,
        });
        // console.log("查询内容：",this.queryParams);
      } else {
        // console.log("查询内容：",this.queryParams);
        delete this.queryParams.name;
        this.fetch({
          ...this.queryParams,
        });
      }
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
        columnIndex == 7 || columnIndex == 9 || columnIndex == 10 ||
        columnIndex == 11 || columnIndex == 12 || columnIndex == 13 ||
        columnIndex == 14 || columnIndex == 16 || columnIndex == 17 ||
        columnIndex == 18 || columnIndex == 19) {
        if (row.main.groupName % 2 == 0) {
          return "qian";
        } else {
          return "shen";
        }
      } else
        if (columnIndex == 2) {
          return "qian"
        } else
          if (columnIndex == 4) {
            if (row.main.groupName % 2 == 0) {
              return "blueq";
            } else {
              return "blues";
            }
          } else
            if (columnIndex == 8) {
              if (row.main.groupName % 2 == 0) {
                return "redq";
              } else {
                return "reds";
              }
            }
            else
              if (columnIndex == 15) {
                if (row.groupName % 2 == 0) {
                  return "greenq";
                } else {
                  return "greens";
                }
              }
    },
    tableHeader({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4) {
        return "blueHeader";
      } else if (columnIndex == 8) {
        return "redHeader"
      } else if (columnIndex == 15) {
        return "greenHeader"
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
      } else if (columnIndex === 4) {
        return this.ret(row, "fifthSpan");
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
    computeFirstSpan(firstObj, secondObj, thirdObj, fourthObj, fifthObj) {
      // 遍历计算第一列合并行数
      for (let obj in firstObj) {
        let fristData = this.tableData.filter(
          (d) => d.id1 === firstObj[obj][0]
        )[0];
        // 获取第一条数据，对其添加 'firstSpan' 属性，并设置值
        if (fristData) fristData["firstSpan"] = firstObj[obj].length;
        this.computeSecondSpan(
          firstObj[obj],
          secondObj,
          thirdObj,
          fourthObj,
          fifthObj
        );
      }
    },
    // 计算第二列合并总数
    computeSecondSpan(classList, secondObj, thirdObj, fourthObj, fifthObj) {
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
        this.computeThirdSpan(list, thirdObj, fourthObj, fifthObj);
      });
    },
    // 计算第三列合并总数
    computeThirdSpan(list, thirdObj, fourthObj, fifthObj) {
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
        this.computeFourthSpan(list, fourthObj, fifthObj);
      });
    },
    // 计算第四列合并总数
    computeFourthSpan(list, fourthObj, fifthObj) {
      let fourthList = [];
      // 遍历计算第四列合并行数
      for (let obj in fourthObj) {
        let fourthIds = fourthObj[obj].filter((val) => {
          return list.indexOf(val) > -1;
        });
        let fristData = this.tableData.filter((d) => d.id1 === fourthIds[0])[0];
        // 获取第一条数据，对其添加 'thirdSpan' 属性，并设置值
        if (fristData) fristData["fourthSpan"] = fourthIds.length;
        fourthList.push(fourthIds);
      }
      fourthList.forEach((list) => {
        this.computeFifthSpan(list, fifthObj);
      });
    },
    // 计算第五列合并总数
    computeFifthSpan(list, fifthObj) {
      // 遍历计算第五列合并行数
      for (let obj in fifthObj) {
        let fifthIds = fifthObj[obj].filter((val) => {
          return list.indexOf(val) > -1;
        });
        let fristData = this.tableData.filter((d) => d.id1 === fifthIds[0])[0];
        // 获取第一条数据，对其添加 'fourthSpan' 属性，并设置值
        if (fristData) fristData["fifthSpan"] = fifthIds.length;
      }
    },
    buildMerge(dataList) {
      let firstObj = {},
        secondObj = {},
        thirdObj = {},
        fourthObj = {},
        fifthObj = {};
      let firstObjKey = "",
        secondObjKey = "",
        thirdObjKey = "",
        fourthObjKey = "",
        fifthObjKey = "";
      // console.log('this.total',this.total)
      for (let i = 0, len = dataList.length; i < len; i++) {
        firstObjKey = dataList[i].main.session;
        secondObjKey = dataList[i].main.year;
        thirdObjKey = dataList[i].main.round;
        fourthObjKey = dataList[i].main.groupName;
        fifthObjKey = dataList[i].main.unitName;
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
        if (!fifthObj[fifthObjKey])
          fifthObj[fifthObjKey] = new Array(dataList[i].id1);
        else {
          fifthObj[fifthObjKey].push(dataList[i].id1);
        }
      }
      this.computeFirstSpan(firstObj, secondObj, thirdObj, fourthObj, fifthObj);
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
    addclue(row) {
      this.$refs.addclue.setPatrolId(row);
      this.addcluelog.isVisible = true;
    },
    addclueClose() {
      this.addcluelog.isVisible = false;
    },
    addclueSuccess() {
      this.search();
    },
    //编辑
    edit(row) {
      this.$refs.edit.setMessage(row);
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
        this.$post("/inspection/clue/del", {
          id: row.clueInfo.id,
        }).then((r) => {
          if (r.data.code == 20000) {
            this.$message({
              message: this.$t("tips.deleteSuccess"),
              type: "success",
            });
            this.search();
          }
        });
      }).catch(() => {
        this.$message.info("取消删除")
      });
    },

    // 打开批量导入对话框
    openImportDlg() {
      this.setImportFileDialog({
        isVisible: true,
        title: "线索办理批量导入",
        type: "clue",
      })
    },

    // 导出文件
    exportExcel() {
      let filename = this.returnFileName(this.queryParams);
      this.$downloadGet("/inspection/clue/export", {
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
      if(params.unitName !== null && params.unitName !== "") {
        filename += params.unitName + '_';
      }
      if(params.discipline !== null && params.discipline !== "") {
        filename += params.discipline + '_';
      }
      if(params.firstcategory !== null && params.firstcategory !== "") {
        let index = this.firstList.findIndex(item => item.id == params.firstcategory)
        if(index != -1) {
          let label = this.firstList[index].result;
          filename += label + '_';
        }
      }
      // if(params.secondLabel !== null && params.secondLabel !== "") {
      //   let index = this.tempList.findIndex(item => item.id == params.secondLabel)
      //   if(index != -1) {
      //     let label = this.tempList[index].result;
      //     filename += label + '_';
      //   }
      // }
      if(params.end !== null && params.end !== "") {
        if(params.end == 0) {
          filename += '正在办理中_';
        } else if(params.end == 1) {
          filename += '已办结_';
        }
      }
      filename += '区级问题清单.xlsx';
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
// .top-box {
//   position: relative;
//   overflow: hidden;
//   padding-bottom: 40px;
// }
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
  margin: 10px 0 0 5px;

  img {
    width: 20px;
    height: 20px;
  }
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
/deep/ .el-button {
  width: 80px;
  height: 32px;
  padding: 0 11px 0 7px;
  font-size: 16px;
  margin-right: 5px;
}

.template {
  position: relative;
}
.operation1 {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-40%);
}
.operation1 > img {
  cursor: pointer;
}
.el-table::before {
  border: 4px;
}
.app-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  // 搜索框
  // .top-box {
  //   align-self: flex-start;
  // }

  // 翻页
  .page_hhx {
    align-self: flex-start;
  }

  .title {
    height: 21px;
    font-size: 16px;
    font-family: MicrosoftYaHeiSemibold;
    color: #008fff;
    line-height: 21px;
    align-self: flex-start;
    color: #008fff;
    padding: 16px;
  }
  // 图表
  .chart_box {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    // 图表区域
    .district_chart {
      width: 90%;
      height: 95%;
    }

    // 按钮
    .chart_operation {
      width: 180px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;

      .chart_btn {
        width: 85px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        color: #666;
        border: 1px solid #aaa;
        border-radius: 25px;

        &:hover {
          cursor: pointer;
        }
      }

      .btn_active {
        color: #fff;
        background: rgba(0, 143, 255, 0.8);
        border: none;
      }
    }
  }
}
.page_hhx {
  padding: 22px 10px 16px 10px;
  // transform: translateX(10px);
}
.el-icon {
  cursor: pointer;
  vertical-align: middle;
  width: 23px;
  height: 23px;
}

// 具体问题点击显示具体内容
.problem {
  .cell {
    .el-popover__reference {
      display: inline-block;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: keep-all;
      cursor: pointer;
    }
  }
}
</style>
<style>
/* 提示框文字居中 */
.el-popover {
  text-align: center;
  max-width: 350px;
}
</style>