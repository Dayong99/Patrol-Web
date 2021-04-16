<template>
  <div class="app-container">
    <div class="top-container">
      <div class="top_select">
				<el-input
					v-model="queryParams.name"
					placeholder="输入标签"
					clearable
					@clear="search"
				>
				</el-input>
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
        <el-button class="create" @click="addFirst">
          <div class="img"></div>
          <span>添加</span>
        </el-button>
      </div>
    </div>

    <div class="title">分类标签 <span>>>></span> <img :src="imgSanjiao" /></div>
    <el-table
      class="issue_list"
      ref="table"
      :data="list"
      border
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
      :span-method="objectSpanMethod"
      tooltip-effect="dark"
    >
      <el-table-column label="一级分类">
        <template slot-scope="scope">
          <span>{{ scope.row.firstTip.result }}</span>
          <div class="operation1">
            <img
              class="el-icon"
              :src="imgAdd"
              alt=""
              @click="add(scope.row.firstTip)"
            />
            <img
              class="el-icon"
              :src="imgEdit"
              alt=""
              @click="edit(scope.row.firstTip)"
            />
            <img
              class="el-icon"
              :src="imgDel"
              alt=""
              @click="del(scope.row.firstTip)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="二级分类">
        <template slot-scope="scope">
          <span>{{ scope.row.secondTip.result }}</span>
          <div class="operation1">
            <img
              class="el-icon"
              :src="imgEdit"
              alt=""
              @click="edit(scope.row.secondTip)"
            />
            <img
              class="el-icon"
              :src="imgDel"
              alt=""
              @click="del(scope.row.secondTip)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :page.sync="pagination.pageNum"
      :limit.sync="pagination.pageSize"
      @pagination="search"
      :total="total"
      class="page_hhx"
    />

    <div class="elseTip">
      <div class="title">
        其他标签 <span>>>></span> <img :src="imgSanjiao" />
      </div>
      <div class="flexbox">
        <template v-for="item in elseList">
          <div class="flexitems" :key="item.id">
            {{ item.result }}
            <div class="o1">
              <img class="el-icon" :src="imgEdit" alt="" @click="edit(item)" />
              <img class="el-icon" :src="imgDel" alt="" @click="del(item)" />
            </div>
          </div>
        </template>
        <pagination
          v-show="total2 > 0"
          :page.sync="pagination2.pageNum"
          :limit.sync="pagination2.pageSize"
          @pagination="search"
          :total="total2"
          class="page_hhx"
        />
      </div>
    </div>

    <!-- 添加一级标签 -->
    <Add-first
      ref="addFirst"
      :addlog-visible="addFirstlog.isVisible"
      :title="addFirstlog.title"
      :issuelist="issuelist"
      @success="addSuccess"
      @close="addFirstClose"
    />

    <!-- 编辑对话框 -->
    <issue-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import AddFirst from './issue_dialog/add'
import issueEdit from './issue_dialog/edit'

export default {
  name: 'system_issue_list',
  props: {},
  components: { Pagination, AddFirst, issueEdit },
  data() {
    return {
      addFirstlog: {
        isVisible: false,
        title: "新建分类标签",
      },
      dialog: {
        isVisible: false,
        title: "修改分类标签",
      },
      tableKey: 0,
      pagination: {
        pageSize: 15,
        pageNum: 1,
      },
      pagination2: {
        pageSize: 15,
        pageNum: 1,
      },
      total: 0,
      total2: 0,
      queryParams: { name: null },
      list: [],
      issuelist: null,
      elseList: [],
      imgSearch: require('../../../assets/main_images/search.png'),
      imgReset: require('../../../assets/main_images/reset.png'),
      imgAdd: require('../../../assets/icon_img/add.png'),
      imgEdit: require('../../../assets/icon_img/edit.png'),
      imgDel: require('../../../assets/icon_img/delete.png'),
      imgSanjiao: require('../../../assets/icon_img/三角标.png'),
    }
  },
  mounted() {
    this.getElse();
    this.fetch();
  },
  watch: {
    list(val) {
      this.buildMerge(val)
    },
    "queryParams.name"(val) {
      this.search(val);
    },
  },
  methods: {
    // columnIndex 值表示要合并的列的下标，当前示例是合并前4列。
    // 如果你是要合并多列，需要添加对应的列号进行判断，并且添加对应的计算方法，
    //   和对应的计算合并列的方法。
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return this.ret(row, 'firstSpan')
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
    computeFirstSpan(firstObj, secondObj) {
      // 遍历计算第一列合并行数
      for (let obj in firstObj) {
        let fristData = this.list.filter(d => d.id1 === firstObj[obj][0])[0]
        // 获取第一条数据，对其添加 'firstSpan' 属性，并设置值
        if (fristData) fristData['firstSpan'] = firstObj[obj].length
        // this.computeSecondSpan(firstObj[obj], secondObj)
      }
    },
    /**  构建合并列数据
    *  思路：遍历所有数据，将需要合并的列的内容作为key，数据id作为value，然后依次遍历获取对应的合并列的行数
    */
    buildMerge(dataList) {
      let firstObj = {},
        secondObj = {}
      let firstObjKey = '',
        secondObjKey = ''
      // console.log('this.total',this.total)
      for (let i = 0, len = dataList.length; i < len; i++) {
        firstObjKey = dataList[i].firstTip.result
        secondObjKey = dataList[i].secondTip.result

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
      }
      this.computeFirstSpan(firstObj, secondObj)
    },
    //获取其他标签
    getElse(params = {}) {
      params.size = this.pagination2.pageSize;
      params.current = this.pagination2.pageNum;
      params.labletype = 3;
      this.$get("/inspection/t-label/getResult", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          this.total2 = r.data.data.total;
          this.elseList = r.data.data.records;
          // console.log("其他标签：",this.elseList);
        }
      })
    },
    //加载标签表格
    fetch(params = {}) {
      params.size = this.pagination.pageSize;
      params.current = this.pagination.pageNum;
      params.labletype = 1;
      this.$get("/inspection/t-label/getResult", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.total = data.total;
          this.issuelist = data.records;
          // console.log("issuelist:",this.issuelist);
          let i = 0;
          this.list = [];
          this.issuelist.forEach((item, index) => {
            // console.log("item:",item);
            if (item.lists.length != 0) {
              item.lists.forEach((item1, index) => {
                let obj = {
                  firstTip: item,
                  secondTip: item1,
                  id1: String(i)
                }; i++;
                this.list.push(obj);
              });
            } else {
              let empty = {
                result: null,
              };
              let obj1 = {
                firstTip: item,
                secondTip: empty,
                id1: String(i)
              }; i++;
              this.list.push(obj1);
            }
          });
          // console.log("list",this.list);
        }
      });
    },
    search() {
      if (this.queryParams.id) {
        this.fetch({
          ...this.queryParams
        });
        this.getElse({
          ...this.queryParams
        });
        // console.log("这是query",this.queryParams);
      } else {
        // console.log("query:",this.queryParams);
        delete this.queryParams.id
        this.fetch({
          ...this.queryParams
        });
        this.getElse({
          ...this.queryParams
        });
      }
    },
    // 重置相关信息
    reset() {
      this.queryParams = { name: null };
      this.sort = {};
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.search();
    },
    //编辑
    edit(val) {
      // console.log("val:",val);
      if (val.result == null) {
        alert("此选项为空，请先在一级分类中创建二级分类！")
      } else {
        this.$refs.edit.setIssue(val);
        this.dialog.isVisible = true;
      }
    },
    editClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      // this.dialog.isVisible = false;
      this.search();
    },
    //删除
    del(val) {
      if (val.result != null) {
        this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }).then(() => {
          this.delete(val.id);
        })
      } else {
        alert("此选项为空！")
      }
    },
    delete(id) {
      this.$delete(`/inspection/t-label?id=${id}`).then(() => {
        this.$message({
          message: this.$t("tips.deleteSuccess"),
          type: "success",
        });
        this.search();
      });
    },
    //新增一级标签
    addFirst() {
      this.addFirstlog.isVisible = true;
    },
    //新增二级标签
    add(val) {
      this.$refs.addFirst.setFirstTip(val);
      this.addFirstlog.isVisible = true;
    },
    addFirstClose() {
      this.addFirstlog.isVisible = false;
    },
    addSuccess() {
      this.search();
    },
  },
}
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
.el-input {
  margin-right: 15px;
}

.fa {
  overflow: hidden;
}
.title {
  position: relative;
  height: 30px;
  color: #008cf9;
  font-size: 16px;
  font-weight: 900;
  font-family: "微软雅黑";
}
.title > span {
  font-size: 12px;
}
.title > img {
  position: absolute;
  right: 20px;
}
.flexbox {
  // display: flex;
  // flex-wrap: wrap;
  width: 100%;
  margin-bottom: 20px;
  overflow: hidden;
}
.flexitems {
  display: inline-block;
  height: 40px;
  width: 260px;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #5d5d5d;
  line-height: 40px;
  text-align: center;
  margin-left: 4px;
  margin-bottom: 4px;
  background: #eef0f2;
  overflow: hidden;
}
.o1 {
  cursor: pointer;
  float: right;
  transform: translate(-10px, 0);
  margin: 0 5px;
}
.template {
  position: relative;
}
.operation1 {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 5px;
}
.operation1 > img {
  cursor: pointer;
}
.elseTip {
  margin-top: 10px;
}
.page_hhx {
  display: inline-block;
  padding: 22px 10px 16px 10px;
}
.el-icon {
  cursor: pointer;
  vertical-align: middle;
  width: 23px;
  height: 23px;
}
</style>