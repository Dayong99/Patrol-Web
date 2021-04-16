<template>
  <div
    class="content"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.5)"
  >
    <div class="table" v-show="tableShow">
      <el-table
        :data="tableData"
        style="width: 100%"
        :height="tableHeight"
        border
        fit
        :header-cell-style="{
          background: '#EEF0F2',
          height: '50px',
          textAlign: 'center',
          color: '#585E66',
          fontFamily: '微软雅黑',
        }"
      >
        <el-table-column
          v-for="(value, key, index) in tableData[mostTableKey]"
          :fixed="index == 0"
          :key="index"
          :prop="key"
          :label="key"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  data() {
    return {
      tableData: [],
      workbook: {},
      id: "",
      excelURL: "",
      mostTableKey: undefined,
      tableHeight: "",
      loading: true,
      tableShow: false,
    };
  },
  created() {
    // 设置table高度，固定头部
    let height = document.body.clientHeight;
    this.tableHeight = height - 100;

    // 生成表数据
    this.id = this.$route.query.id;
    this.readWorkbookFromRemoteFile(this.id);
  },
  methods: {
    readWorkbookFromRemoteFile(id) {
      this.$getbuffer("preview",
        {
          materialId: id,
        }).then(res => {
          if (res.status === 200) {
            let data = new Uint8Array(res.data);
            let workbook = XLSX.read(data, { type: "array" });
            // console.log('workbook', workbook);

            let sheetNames = workbook.SheetNames; // 工作表名称集合
            this.workbook = workbook;
            this.getTable(sheetNames[0]);
          }
        })
      // var xhr = new XMLHttpRequest();
      // xhr.open("get", url, true);
      // xhr.responseType = "arraybuffer";
      // let _this = this;
      // xhr.onload = function (e) {
      //   if (xhr.status === 200) {
      //     var data = new Uint8Array(xhr.response);
      //     var workbook = XLSX.read(data, { type: "array" });
      //     console.log(workbook);

      //     var sheetNames = workbook.SheetNames; // 工作表名称集合
      //     _this.workbook = workbook;
      //     _this.getTable(sheetNames[0]);
      //   }
      // };
      // xhr.send();
    },
    getTable(sheetName) {
      // console.log(sheetName);
      var worksheet = this.workbook.Sheets[sheetName];
      this.tableData = XLSX.utils.sheet_to_json(worksheet);
      let len = -999;
      // 找到最完整的
      this.tableData.forEach((item, index) => {
        if (len < Object.keys(item).length) {
          len = Object.keys(item).length;
          this.mostTableKey = index;
        }
      })
      this.loading = false;
      this.tableShow = true;
      // console.log(len, this.mostTableKey);
      // console.log(this.tableData);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .table {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    // margin-top: 20px;
    border: 1px solid #ebebeb;
    padding: 20px;
    width: 80%;
    // overflow-y: overlay;
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    border-radius: 10px;
  }
}
</style>

<style scoped>
.is-active {
  background-color: #409eff;
}
span {
  background-color: red;
}
</style>
