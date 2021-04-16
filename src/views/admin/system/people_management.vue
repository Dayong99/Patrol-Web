<template>
  <div class="app-container fa">
    <div class="top-container">
      <div class="top_select">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户姓名"
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
        <el-button class="create" @click="add">
          <div class="img"></div>
          <span>添加</span>
        </el-button>

        <el-button class="delbtn" @click="batchDelete()">
          <span>批量删除</span>
        </el-button>
      </div>
    </div>

    <el-table
      class="p_manager"
      ref="table"
      :key="tableKey"
      :data="peopleList"
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
      tooltip-effect="light"
      @selection-change="onSelectChange"
    >
      <!-- @selection-change="handleSelectionChange"> -->
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <span>{{ scope.row.roles[0].roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          <span>{{ scope.row.department.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span
            :style="{
              color: scope.row.state == 0 ? 'rgba(78, 183, 132, 1)' : 'red',
            }"
          >
            {{ scope.row.state | showState }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.datatime | showTime }}</span>
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
            <img
              class="el-icon"
              :src="imgDel"
              alt=""
              @click="singleDelete(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加新 -->
    <Add
      ref="add"
      :title="addlog.title"
      :addlog-visible="addlog.isVisible"
      :departmentList="departmentList"
      :roleList="roleList"
      @success="addSuccess"
      @close="addClose"
    />

    <!-- 编辑对话框 -->
    <people-edit
      ref="edit"
      :title="dialog.title"
      :dialog-visible="dialog.isVisible"
      :departmentList="departmentList"
      :roleList="roleList"
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
import peopleEdit from './people_management/edit'
import Add from './people_management/add'

export default {
  name: 'system_people_management',
  props: {},
  components: { Pagination, peopleEdit, Add },
  data() {
    return {
      addlog: {
        isVisible: false,
        title: "添加",
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
      queryParams: { name: null },
      selection: [],
      peopleList: [],
      departmentList: [],
      roleList: [],
      imgSearch: require('../../../assets/main_images/search.png'),
      imgReset: require('../../../assets/icon_img/重置标.png'),
      imgEdit: require('../../../assets/icon_img/edit.png'),
      imgDel: require('../../../assets/icon_img/delete.png'),
    }
  },
  filters: {
    showState(val) {
      switch (Number(val)) {
        case 0: return "有效";
        case 1: return "无效";
        default: return "";
      }
    },
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
  mounted() {
    // this.getuser();
    this.getDepartment();
    this.getRole();
    this.fetch();
  },
  watch: {
    "queryParams.name"(val) {
      this.search(val);
    },
  },
  methods: {
    //部门表
    getDepartment(params = {}) {
      params.size = this.pagination.pageSize;
      params.current = this.pagination.pageNum;
      this.$get("/inspection/t-department", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.departmentList = data.records;
          console.log("部门", this.departmentList);
        }
      });
    },
    //角色表
    getRole(params = {}) {
      params.size = this.pagination.pageSize;
      params.current = this.pagination.pageNum;
      this.$get("/inspection/t-role", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.roleList = data.records;
          // console.log("角色",this.roleList);
        }
      });
    },
    //加载人员表格
    fetch(params = {}) {
      params.size = this.pagination.pageSize;
      params.current = this.pagination.pageNum;
      this.$get("/inspection/t-user/queryDepartmentUser", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.total = data.total;
          this.peopleList = data.records;
          console.log("人员列表", this.peopleList);
        }
      });
    },
    search() {
      if (this.queryParams.id) {
        this.fetch({
          ...this.queryParams
        });
        console.log("query", this.queryParams);
      } else {
        console.log("这是query:", this.queryParams);
        delete this.queryParams.id
        this.fetch({
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
    edit(row) {
      this.$refs.edit.setpeople(row);
      this.dialog.isVisible = true;
    },
    editClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      // this.dialog.isVisible = false;
      this.search();
    },

    //删除单个数据项
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true);
      this.batchDelete();
    },
    //批量删除
    onSelectChange(selection) {
      this.selection = selection;
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t("tips.noDataSelected"),
          type: "warning",
        });
        return;
      }
      const contain = false;
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          const peopleIds = [];
          this.selection.forEach((u) => {
            peopleIds.push(u.id);
          });
          this.delete(peopleIds);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(peopleIds) {
      peopleIds.forEach((e) => {
        this.$delete(`/inspection/t-user?id=${e}`).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success",
          });
          this.search();
        });
      });
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

.operation1 > img {
  cursor: pointer;
  margin: 0px 5px;
}
.op {
  cursor: pointer;
  margin: 0 5px;
}
.fa {
  overflow: hidden;
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