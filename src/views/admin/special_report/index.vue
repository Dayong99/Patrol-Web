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

        <el-input
          v-model="searchDepartment"
          size="small"
          class="input"
          placeholder="输入承办部门"
          style="width: 160px"
        />
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
          <span>{{ "第" + scope.row.groupName + "组" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="专题报告"
        width="210px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span class="spanReport">
            <a class="" @click="download(scope.row.specialMaterials[0])">
              {{ scope.row.specialMaterials[0].fileName }}</a
            >
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
                    :on-success="onSuccess"
                    :data="file"
                    :action="getURL()"
                  >
                    <img
                      class="icon"
                      :src="imgAdd"
                      @click="getParams(scope.row, (type = 'special'))"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="previewReport(scope.row.specialMaterials[0])"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="delReport(scope.row.specialMaterials[0])"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="问题涉及单位" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.unitName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="领导批示"
        width="200px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span class="spanReport">
            <a class="" @click="download(scope.row.leaderMaterials[0])">
              {{ scope.row.leaderMaterials[0].fileName }}
            </a>
          </span>
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
                      @click="getParams(scope.row, (type = 'leader'))"
                      type="button"
                    />
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click="previewReport(scope.row.leaderMaterials[0])"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <img
                    class="icon"
                    :src="imgDel"
                    @click="delReport(scope.row.leaderMaterials[0])"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="承办部门" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.special.uderDepartment }}</span>
        </template>
      </el-table-column>

      <el-table-column label="移交时间" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.special.handoverTime | showTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="办理期限" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.special.endtime | showTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="办结材料" width="230px">
        <template slot-scope="scope">
          <!-- <a class="report">{{ scope.row.materials[0].fileName }}</a> -->

          <el-dropdown trigger="click" size="mini" placement="bottom">
            <span class="spanReport">材料列表</span>
            <el-dropdown-menu slot="dropdown" class="special_drop">
              <el-dropdown-item
                v-show="scope.row.materials[0].attachId !== ''"
                v-for="(item, index) in scope.row.materials"
                :key="index"
                style="padding: 3px"
                class="special_drop_item"
              >
                <span class="report">
                  <a style="display: inline" @click="download(item)">{{
                    index + 1 + ". " + item.fileName
                  }}</a>
                </span>
                <div>
                  <img
                    class="icon"
                    :src="imgSearch"
                    @click.stop="previewReport(item)"
                  />
                  <img
                    class="icon"
                    :src="imgDel"
                    @click.stop="delReport(item)"
                  />
                </div>
              </el-dropdown-item>
              <div
                v-show="scope.row.materials[0].attachId === ''"
                style="padding: 5px"
              >
                <span class="report noreport">暂无文件</span>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="icondiv">
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
                @click="getParams(scope.row, (type = 'material'))"
                type="button"
              />
            </el-upload>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <img class="el-icon" :src="imgEdit" @click="editPatrol(scope.row)" />
          <img
            class="el-icon"
            :src="imgDel"
            @click="delPatrol(scope.row.special.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <special-add
      ref="add"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :sessions="sessions"
      :years="years"
      :searchUnits="searchUnits"
      @success="addSuccess"
      @close="addClose"
    />

    <special-edit
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
      <span>专题报告办理流程</span>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import specialAdd from "./add.vue";
import specialEdit from "./edit.vue";
import { mapState, mapMutations } from 'vuex';
export default {
  name: "special_report",
  components: { Pagination, specialAdd, specialEdit, },
  mounted() {
    this.fetch();
  },
  created() {
    //初始化下拉框
    this.init();
  },
  data() {
    return {
      year: "", //年
      session: "", //届次
      round: "", //轮次
      searchUnit: "", //巡察单位
      searchGroup: "", //巡察组
      searchDepartment: "", //承办部门
      sessions: [],
      // rounds: [],
      years: [],
      file: {},
      // searchGroups: [],
      searchUnits: [],
      searchDepartments: [],
      total: 0,
      searchobject: {
        session: null,
        round: null,
        groupName: null,
        year: null,
        unitName: null,
        department: null,
      }, //搜索对象
      addobject: {}, //添加 巡察表对象

      //合并单元格数组
      spanArr: [],
      //貌似是个中间变量，我也不知道是个什么
      pos: 0,
      pagination: {
        size: 15,
        num: 1,
      },
      tableData: [],
      dialog: {
        isVisible: false,
        title: "创建",
      },
      editlog: {
        isVisible: false,
        title: "修改",
      },
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
  watch: {
    // 监听批量导入，刷新页面
    'refreshList.specialRefresh': {
      handler(newval, oldval) {
        if (newval) {
          this.fetch();
        }
      }
    },
    tableData(newval) {
      this.buildMerge(newval);
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
    searchDepartment(newval) {
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
    // getRounds(type) {
    // 	this.rounds = []
    // 	this.round = ''
    // 	this.testDate.forEach((itme,index)=>{
    // 		if(itme.type === type){
    // 			this.rounds.push(itme)
    // 		}
    // 	})
    // },

    //加载表格
    fetch(params = {}) {
      params.num = this.pagination.size;
      params.page = this.pagination.num;
      this.$get("/inspection/special/list", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.total = data.nums;
          this.tableData = data.list;
          console.log('专题报告');
          let obj = {
            id: "",
            patrolId: "",
            attachId: "",
            fileName: "",
            filetype: "",
          };

          let obj1 = {
            id: "",
            patrolId: "",
            uderDepartment: "",
            handoverTime: "",
            endtime: "",
          };

          //封装得到的数据
          this.tableData.forEach((item, index) => {
            if (item.special === null) {
              item.special = obj1;
            }
            item["id1"] = String(index);
            if (item.specialMaterials == null) {
              obj.patrolId = item.id;
              obj.filetype = "4";
              item.specialMaterials = [];
              item.specialMaterials.push(this.$_.cloneDeep(obj));
            }
            if (item.leaderMaterials == null) {
              obj.patrolId = item.id;
              obj.filetype = "5";
              item.leaderMaterials = [];
              item.leaderMaterials.push(this.$_.cloneDeep(obj));
            }
            if (item.materials == null) {
              obj.patrolId = item.id;
              obj.filetype = "6";
              item.materials = [];
              item.materials.push(this.$_.cloneDeep(obj));
            }
          });

          console.log("专项报告", this.tableData);
          // console.log(params);
        }
      });
    },

    search() {
      this.searchobject.session = this.session;
      this.searchobject.round = this.round;
      this.searchobject.groupName = String(this.searchGroup);
      this.searchobject.year = this.year;
      this.searchobject.unitName = this.searchUnit;
      this.searchobject.department = this.searchDepartment;
      this.fetch({
        ...this.searchobject,
      });
    },

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
      if (columnIndex == 3 || columnIndex == 7 || columnIndex == 8 ||
        columnIndex == 9 || columnIndex == 10 || columnIndex == 11) {
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
      } else if (columnIndex == 4) {
        if (row.groupName % 2 == 0) {
          return "redq report_colume";
        } else {
          return "reds report_colume";
        }
      } else if (columnIndex == 6) {
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
      } else if (columnIndex == 4) {
        return "redHeader"
      } else if (columnIndex == 6) {
        return "greenHeader"
      }
    },
    //创建巡察表
    add() {
      this.dialog.isVisible = true;
      this.$refs.add.init();
    },
    //搜索巡察表
    searchPatrol() {
      this.search();
    },
    //修改专项报告表
    editPatrol(item) {
      this.editlog.isVisible = true;
      this.$refs.edit.getSpecial(item);
    },
    //删除巡察表
    delPatrol(id) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        if (id != "") {
          this.$post("/inspection/special/del", {
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

    //创建专项报告成功
    addSuccess() {
      this.dialog.isVisible = false;
      this.search();
    },
    //取消专项报告添加
    addClose() {
      this.dialog.isVisible = false;
    },
    //修改专项报告
    editSuccess() {
      this.editlog.isVisible = false;
      this.search();
    },
    //
    editClose() {
      this.editlog.isVisible = false;
    },

    getURL() {
      return globalConfig.baseURL + "inspection/special/upload";
    },
    //获取上传文件参数
    getParams(row, type) {
      this.file.patrolunitid = row.patrolunitid;
      this.file.specialid = row.special.id;
      this.file.type = type;
      console.log("this.file", this.file);
      return this.file;
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
    // 文件预览
    previewReport(item) {
      // 打开单独页面进行预览
      if(item.id === "" || item.attachId === "") {
        this.$message.warning("暂无文件");
        return;
      }
      let fileNameArr = item.fileName.split('.');
      let router = null;
      console.log('object', fileNameArr);
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
      this.$get("/inspection/special/delfile", {
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
        title: "专题报告批量导入",
        type: "special",
      })
    },

    // 导出文件
    exportExcel() {
      this.searchobject.session = this.session;
      this.searchobject.round = this.round;
      this.searchobject.groupName = String(this.searchGroup);
      this.searchobject.year = this.year;
      this.searchobject.unitName = this.searchUnit;
      this.searchobject.department = this.searchDepartment;

      let filename = this.returnFileName(this.searchobject)

      this.$downloadZip("/inspection/special/export", {
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
        filename += params.unitName + '_';
      }
      if(params.department !== null && params.department !== "") {
        filename += params.department + '_';
      }
      filename += '专题报告.zip';
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

.input {
  margin-right: 10px;
}

/deep/ .el-table td {
  padding: 4px 0;
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
  color: #008fff;
  font-size: 14px;
  margin-right: 10px;
}
.spanReport {
  cursor: pointer;
  font-size: 16px;
  width: 100px;
  color: #008fff;
}

// 材料列表下拉
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
// /deep/ .el-input--small .el-input__inner {
//   margin-bottom: 10px;
//   vertical-align: middle;
//   // height: 38px;
// }
</style>