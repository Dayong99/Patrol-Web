<template>
  <!--  eslint-disable  -->
  <div class="app-container">
    <div class="top-container">
      <div class="top_select">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @input="search"
          @clear="search"
        >
        </el-input>
      </div>
      <div class="top_btn">
        <el-button class="search" @click="search">
          <div class="img"></div>
          <span>搜索</span>
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
      ref="table"
      :data="villagelist"
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
      tooltip-effect="dark"
      @selection-change="onSelectChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" align="center" width="45px" />
      <el-table-column label="名称" align="center" width="400px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shorter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column label="联系人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <img
            class="el-icon"
            :src="imgEdit"
            @click="edit(row)"
            title="修改信息"
          />
          <img class="el-icon" :src="imgDeL" @click="singleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.num"
      :limit.sync="pagination.size"
      @pagination="search"
      class="page_hhx"
    />

    <!-- 新建/修改 -->
    <edit-village
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :icon="icon"
      @success="editSuccess"
      @close="editClose"
    />
  </div>
</template>

<script>

/* eslint-disable */
import Pagination from "@/components/Pagination";
import EditVillage from './EditVillage.vue';
export default {
  name: "district_level",
  components: { Pagination, EditVillage },
  data() {
    return {
      dialog: {
        isVisible: false,
        title: "",
      },
      icon: '',
      name: '',
      villagelist: [],//村级列表
      queryParams: {},//搜索框
      selection: [],
      pagination: {
        size: 15,
        num: 1,
      },
      total: 0,
      imgEdit: require('@/assets/main_images/edit.png'), //图片
      imgDeL: require('@/assets/main_images/del.png'),
      imgAdd: require('@/assets/index_images/add1.png')
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if(rowIndex % 2 == 0) {
        return 'odd_row'
      } else {
        return 'even_row'
      }
    },
    edit(row) {
      this.$refs.edit.setVillage(row);
      this.dialog.title = "修改";
      this.icon = "el-icon-s-tools table-operation";
      this.dialog.isVisible = true;
    },
    add() {
      this.dialog.title = "添加";
      this.icon = "el-icon-circle-plus-outline nav-operation";
      this.dialog.isVisible = true;

    },
    editSuccess() {
      this.dialog.isVisible = false;
      this.search();
    },
    editClose() {
      this.dialog.isVisible = false;
    },
    //加载村级巡察对象
    fetch(params = {}) {
      params.num = this.pagination.size;
      params.page = this.pagination.num;
      params.sort = "村级"
      this.$get("/inspection/unit/list", {
        ...params,
      }).then((r) => {
        if (r.data.code == 20000) {
          const data = r.data.data;
          this.total = data.nums;
          this.villagelist = data.list;
          console.log("村级列表", this.villagelist);
          // console.log(params);
        }
      });
    },
    search() {
      this.fetch({
        ...this.queryParams
      })
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
        this.$delete(`/inspection/unit?id=${e}`).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success",
          });
          this.search();
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
/* eslint-disable */
.filter-span {
  position: relative;
  bottom: 3px;
}
.page_hhx {
  display: inline-block;
  padding: 22px 10px 16px 10px;
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
.el-icon {
  cursor: pointer;
  vertical-align: middle;
  width: 23px;
  height: 23px;
}
//    /deep/  .el-table, .el-table__expanded-cell {
//     background-color: #EEF0F2!important;
//   }

//  /deep/ .el-table tr {
//     background-color:  #EEF0F2!important;
//   }

//   /deep/  .el-table--enable-row-transition .el-table__body td, .el-table .cell{
//     background-color:  #EEF0F2!important;
//   }

/deep/ .el-table .odd_row {
  background: #EEF0F2;
  height: 42px;
  text-align: center;
  font-size: 16px;
  color: #5D5D5D;
  font-family: 微软雅黑;
}
/deep/ .el-table .even_row {
  background: rgb(246, 247, 248);
  height: 42px;
  text-align: center;
  font-size: 16px;
  color: #5D5D5D;
  font-family: 微软雅黑;
}
</style>