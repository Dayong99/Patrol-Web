<template>
  <div class="app-container fa">
    <div class="top-container">
      <div class="top_select">
        <el-input
          v-model="searchobject.name"
          placeholder="请输入文字"
          @input="searchBytype"
          @clear="searchBytype"
        />
        <el-select
          v-model="searchobject.labletype"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in tiptypeList"
            :key="item.label"
            :label="item.value"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </div>

      <div class="top_btn">
        <el-button class="search" @click="searchBytype">
          <div class="img"></div>
          <span>搜索</span>
        </el-button>

        <el-button class="reset" @click="reset">
          <div class="img"></div>
          <span>重置</span>
        </el-button>

        <el-button class="create" @click="add(sort)">
          <div class="img"></div>
          <span>添加</span>
        </el-button>
      </div>
    </div>
    <div class="title">六项纪律 <span class="span">>>></span></div>
    <div class="box">
      <template v-for="(item, index) in discipline_list">
        <div :key="index" class="flexitems">
          <span
            style="
              vertical-align: middle;
              margin-right: 20px;
              line-height: 40px;
            "
            >{{ item.result }}</span
          >
          <img
            style="vertical-align: middle"
            class="icon"
            :src="imgEdit"
            @click="edit(item)"
          />
          <!-- <img
            style="vertical-align: middle"
            class="icon"
            :src="imgDel"
            @click="del()"
          /> -->
        </div>
      </template>
    </div>
    <!-- <span class="" :key="index">
                {{item.result}}

                </span> -->

    <div class="title">处理结果 >>></div>
    <el-table
      class="punish"
      :data="list"
      ref="table1"
      border
      fit
      style="width: 100%"
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
      <el-table-column prop="first" label="处理结果1级" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.first.result }}
          </span>

          <div class="operation1">
            <img class="icon" :src="imgAdd" @click="addTwo(scope.row.first)" />
            <img class="icon" :src="imgEdit" @click="edit(scope.row.first)" />
            <img class="icon" :src="imgDel" @click="del(scope.row.first)" />
            <!-- <i class="el-icon-plus" @click="addTwo(scope.row.first)"></i>
									<i class="el-icon-edit-outline table-operation" @click="edit(scope.row.first)"></i>
									<i class="el-icon-delete table-operation" @click="del(scope.row.first)"></i> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="second" label="处理结果2级">
        <template slot-scope="scope">
          {{ scope.row.second.result }}
          <div class="operation1">
            <img class="icon" :src="imgEdit" @click="edit(scope.row.second)" />
            <img class="icon" :src="imgDel" @click="del(scope.row.second)" />
            <!-- <i class="el-icon-edit-outline table-operation" @click="edit(scope.row.second)"></i>
						<i class="el-icon-delete table-operation" @click="del(scope.row.second)"></i> -->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      style=""
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.num"
      :limit.sync="pagination.size"
      @pagination="search"
      class="page_hhx"
    />

    <div class="title">线索分类 >>></div>
    <el-table
      class="punish"
      border
      fit
      style="width: 100%"
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
      :data="cluelist"
      ref="table2"
      tooltip-effect="dark"
      :span-method="objectSpanMethod"
    >
      <!-- :span-method="objectSpanMethod" -->
      <!-- @selection-change="handleSelectionChange"> -->
      <el-table-column label="线索1级">
        <template slot-scope="scope">
          {{ scope.row.first.result }}
          <div class="operation1">
            <img
              class="icon"
              :src="imgAdd"
              @click="addTwoClue(scope.row.first)"
            />
            <img class="icon" :src="imgEdit" @click="edit(scope.row.first)" />
            <img class="icon" :src="imgDel" @click="del(scope.row.first)" />
            <!-- <i class="el-icon-plus" @click="addTwoClue(scope.row.first)"></i>
									<i class="el-icon-edit-outline table-operation" @click="edit(scope.row.first)"></i>
									<i class="el-icon-delete table-operation" @click="del(scope.row.first)"></i> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="线索2级">
        <template slot-scope="scope">
          {{ scope.row.second.result }}
          <div class="operation1">
            <img class="icon" :src="imgEdit" @click="edit(scope.row.second)" />
            <img class="icon" :src="imgDel" @click="del(scope.row.second)" />
            <!-- <i class="el-icon-edit-outline table-operation" @click="edit(scope.row.second)"></i>
						<i class="el-icon-delete table-operation" @click="del(scope.row.second)"></i> -->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加新 -->
    <!-- <Add
			ref="add" @add="change($event)"
			:addlog-visible="addlog.isVisible"
			:title="addlog.title" @close="addClose"/> -->

    <!-- 编辑对话框 -->
    <pagination
      style=""
      v-show="total1 > 0"
      :total="total1"
      :page.sync="pagination1.num"
      :limit.sync="pagination1.size"
      @pagination="fetchClue"
      class="page_hhx"
    />

    <clue-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />

    <!-- 添加二级标签 -->
    <clue-add
      ref="add"
      :dialog-visible="addlog.isVisible"
      :title="addlog.title"
      @success="addSuccess"
      @close="addClose"
    />

    <!-- 添加一级二级标签 -->
    <clue-addall
      ref="addAll"
      :dialog-visible="alladdlog.isVisible"
      :title="alladdlog.title"
      @success="addSuccess"
      @close="addClose"
    />
  </div>
</template>

<script>
import clueEdit from "./clue_dialog/edit";
import clueAdd from "./clue_dialog/add";
import Pagination from "@/components/Pagination";
import clueAddall from "./clue_dialog/addAll";
export default {
  name: "system_clue",
  props: {},
  components: {
    Pagination,
    clueEdit,
    clueAdd,
    clueAddall,
  },
  data() {
    return {
      pagination: {
        size: 15,
        num: 1,
      },
      total: 0,
      one: "",
      list: [],
      sort: 0, //处理结果一级排序
      sort2: 0, //处理结果二级排序
      sortClue: 0, //线索一级排序
      discipline_list: [],
      cluelist: [],
      addlog: {
        isVisible: false,
        title: "新增",
      },
      alladdlog: {
        isVisible: false,
        title: "新增一二级",
      },
      dialog: {
        isVisible: false,
        title: "修改",
      },
      searchobject: {},
      total: 0,
      total1: 0,
      pagination: {
        size: 10,
        num: 1,
      },
      labelType: "",
      pagination1: {
        size: 10,
        num: 1,
      },
      tiptypeList: [
        {
          value: "处理结果",
          label: "0",
        },
        {
          value: "线索分类",
          label: "4",
        },
      ],
      imgEdit: require("@/assets/main_images/edit.png"), //图片
      imgDel: require("@/assets/main_images/del.png"),
      imgAdd: require("@/assets/main_images/add.png"),
      imgSearch: require("@/assets/main_images/search.png"),
      imgReset: require("@/assets/main_images/reset.png"),
    };
  },
  mounted() {
    //加载处理结果表格
    this.fetch();
    //加载线索表格
    this.fetchClue();
  },
  watch: {
    list(newval) {
      this.buildMerge(newval);
    },
    cluelist(newval) {
      this.buildMerge(newval);
    },
  },
  methods: {
    //编辑
    edit(val) {
      this.$refs.edit.setTip(val);
      this.dialog.isVisible = true;
    },
    editDiscipline(val) {
      this.$refs.edit.setDiscipline(val);
      this.dialog.isVisible = true;
    },
    add(val) {
      this.$refs.addAll.setSort(val);
      this.alladdlog.isVisible = true;
      this.alladdlog.title = "添加标签";
    },
    //处理结果
    addTwo(val) {
      this.$refs.addAll.setResultTip(val);
      this.alladdlog.isVisible = true;
      this.alladdlog.title = "添加二级处理结果";
    },
    addTwoClue(val) {
      this.$refs.addAll.setClueTip(val);
      this.alladdlog.isVisible = true;
      this.alladdlog.title = "添加二级线索";
    },
    editClose() {
      this.dialog.isVisible = false;
    },
    //编辑成功
    editSuccess() {
      this.dialog.isVisible = false;
      this.search();
      this.fetchClue();
    },
    //添加成功
    addSuccess() {
      this.addlog.isVisible = false;
      this.alladdlog.isVisible = false;
      this.search();
      this.fetchClue();
    },
    addClose() {
      this.addlog.isVisible = false;
      this.alladdlog.isVisible = false;
    },
    reset() {
      this.searchobject.name = "";
      this.search();
      this.fetchClue();
    },

    //删除
    del(val) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          this.$delete(`/inspection/t-label?id=${val.id}`).then(() => {
            this.$message({
              message: this.$t("tips.deleteSuccess"),
              type: "success",
            });
            this.search();
            this.fetchClue();
          });
        })
        .catch(() => { });
    },
    //初始化加载处理结果和六项纪律表格
    fetch(params = {}, params1 = {}) {
      params.size = this.pagination.size;
      params.current = this.pagination.num;
      params.labletype = 0;
      this.$get("/inspection/t-label/getResult", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          console.log("params", params);
          const data = r.data.data;
          this.total = data.total;
          console.log("data.total", data.total);
          this.sort = data.records.length + 1;
          let i = 0;
          this.list = [];
          let obj = {
            first: null,
            second: null,
            id1: null,
          };
          data.records.forEach((item, index) => {
            if (item.lists.length != 0) {
              item.lists.forEach((item1, index) => {
                let obj = {
                  first: item,
                  second: item1,
                  id1: String(i),
                };
                // obj.first=item
                // obj.second=item1
                // obj.id1=String(i)
                i++;
                this.list.push(obj);
              });
            } else {
              let obj = {
                first: item,
                second: "",
                id1: String(i),
              };
              i++;
              this.list.push(obj);
            }
          });

          // console.log(params);
        }
      });
      params1.size = 10;
      params1.current = 1;
      params1.labletype = 2;
      this.$get("/inspection/t-label/getResult", {
        ...params1,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.discipline_list = data.records;
          console.log("六项纪律", this.discipline_list);
          // console.log(params);
        }
      });
    },
    search() {
      this.fetch({
        ...this.searchobject,
      });
    },
    //两个表搜索
    searchBytype() {
      console.log("this.searchobject.labletype", this.searchobject.labletype);
      if (this.searchobject.labletype === "0") {
        this.search();
      } else if (this.searchobject.labletype === "4") {
        this.fetchClue({
          ...this.searchobject,
        });
      }
    },

    //加载线索表格
    fetchClue(params = {}) {
      params.size = this.pagination1.size;
      params.current = this.pagination1.num;
      params.labletype = 4;
      this.$get("/inspection/t-label/getResult", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.total1 = data.total;
          // console.log("data.total",data.total)
          this.sortClue = data.records.length + 1;
          let i = 0;
          this.cluelist = [];
          let obj = {
            first: null,
            second: null,
            id1: null,
          };
          data.records.forEach((item, index) => {
            if (item.lists.length != 0) {
              item.lists.forEach((item1, index) => {
                let obj = {
                  first: item,
                  second: item1,
                  id1: String(i),
                };
                // obj.first=item
                // obj.second=item1
                // obj.id1=String(i)
                i++;
                this.cluelist.push(obj);
              });
            } else {
              let obj = {
                first: item,
                second: "",
                id1: String(i),
              };
              i++;
              this.cluelist.push(obj);
            }
          });

          console.log("线索等级", this.cluelist);
          // console.log(params);
        }
      });
    },
    //合并表格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return this.ret(row, "firstSpan");
      } else if (columnIndex === 1) {
        return this.ret(row, "secondSpan");
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
    computeFirstSpan(firstObj, secondObj, dataList) {
      // 遍历计算第一列合并行数
      for (let obj in firstObj) {
        let fristData = dataList.filter((d) => d.id1 === firstObj[obj][0])[0];
        // 获取第一条数据，对其添加 'firstSpan' 属性，并设置值
        if (fristData) fristData["firstSpan"] = firstObj[obj].length;
        this.computeSecondSpan(firstObj[obj], secondObj, dataList);
      }
    },

    // 计算第二列合并总数
    computeSecondSpan(classList, secondObj, dataList) {
      let secondList = [];
      // 遍历计算第二列合并行数
      for (let obj in secondObj) {
        // 判断两个id数组，取其并集，并集的长度就是合并列的行数
        let secondIds = secondObj[obj].filter((val) => {
          return classList.indexOf(val) > -1;
        });
        let fristData = dataList.filter((d) => d.id1 === secondIds[0])[0];
        // 获取第一条数据，对其添加 'secondSpan' 属性，并设置值
        if (fristData) fristData["secondSpan"] = secondIds.length;
        secondList.push(secondIds);
      }
    },

    //构建合并列数据
    buildMerge(dataList) {
      let firstObj = {},
        secondObj = {};

      let firstObjKey = "",
        secondObjKey = "";

      console.log("this.total", this.total);
      for (let i = 0, len = dataList.length; i < len; i++) {
        firstObjKey = dataList[i].first.result;
        secondObjKey = dataList[i].second.result;

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
      }
      this.computeFirstSpan(firstObj, secondObj, dataList);
    },
    // add() {
    //     this.addlog.isVisible = true;
    // },
    // addClose() {
    //     this.addlog.isVisible = false;
    // },
  },
};
</script>

<style lang="scss" scoped>
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

.fa {
  overflow: hidden;
}
//   .punish {
//     float: left;
//   }
.discipline {
  float: right;
}
//   .pagin {
//     float: right;
//   }
.template {
  position: relative;
}
.operation1 {
  //  display: inline-block;
  display: inline;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 5px;
  img {
    cursor: pointer;
  }
}
.box {
  display: flex;
  margin-bottom: 20px;
  //    flex-flow: row nowrap
  justify-content: space-around;
}
.flexitems {
  flex-grow: 1;
  text-align: center;
  background-color: #eef0f2;
  border: 1px solid #ffffff;
  font-size: 16px;
  color: #5d5d5d;
  font-family: "微软雅黑";
}
.title {
  height: 40px;
  color: #409eff;
  font-size: 18px;
  font-weight: 800;
}
.span {
  font-size: 15px;
}
.page_hhx {
  display: inline-block;
  padding: 22px 10px 16px 10px;
}
.icon {
  //   width: 21.75px;
  //   height: 26px;
  margin-right: 1px;
  cursor: pointer;
  vertical-align: middle;
  width: 23px;
  height: 23px;
}
</style>
