<template>
  <div
    class="pdfView"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!-- 固定切换页面按钮 -->
    <!-- <div class="float_btn">
      <el-tooltip class="item" effect="dark" content="上一页" placement="bottom" :enterable="false">
        <button @click="changePage('last')"><i class="el-icon el-icon-arrow-left"></i></button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="下一页" placement="bottom" :enterable="false">
        <button @click="changePage('next')"><i class="el-icon el-icon-arrow-right"></i></button>
      </el-tooltip>
    </div> -->

    <div class="view_content" v-show="contentShow">
      <div class="top">
        <span>{{ currentPage }} / {{ pageCount }}</span>
        <div class="top_btn">
          <div class="btn_page">
            <el-tooltip
              class="item"
              effect="dark"
              content="上一页"
              placement="bottom"
              :enterable="false"
            >
              <button @click="changePage('last')">
                <i class="el-icon el-icon-arrow-left"></i>
              </button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="下一页"
              placement="bottom"
              :enterable="false"
            >
              <button @click="changePage('next')">
                <i class="el-icon el-icon-arrow-right"></i>
              </button>
            </el-tooltip>
            <!-- <button><i class="el-icon el-icon-arrow-left"></i></button>
            <button><i class="el-icon el-icon-arrow-right"></i></button> -->
          </div>
          <img
            src="@/assets/index_images/minus-bold.png"
            @click.stop="minusWidth"
          />
          <img
            src="@/assets/index_images/add-bold.png"
            @click.stop="addWidth"
          />
        </div>
      </div>
      <div class="content" :style="{ width: contentWidth + 'px' }">
        <!-- 回到顶部 -->
        <el-backtop
          target=".content"
          :right="50"
          :bottom="50"
          :visibility-height="100"
          :style="{
            'background-color': '#eee',
            'box-shadow': 'rgb(0,0,0) 0px 0px 6px',
          }"
        ></el-backtop>
        <pdf
          :src="pdfUrl"
          :page="currentPage"
          @num-pages="pageCount = $event"
          @page-loaded="currentPage = $event"
        ></pdf>
      </div>
      <div class="btn">
        <!-- <button v-for="i in numPages" :key="'btn_' + i" @click="changePage(i)">
          {{ i }}
        </button> -->
        <el-pagination
          background
          :current-page.sync="currentPage"
          layout="prev, pager, next, jumper"
          :page-size="1"
          :total="numPages"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf';
export default {
  name: "text_document",
  components: { pdf },
  data() {
    return {
      id: undefined,
      pdfUrl: '',
      numPages: undefined,
      pageCount: 0,
      currentPage: 1,
      loading: true,
      contentWidth: '1500',
      contentShow: false,
    }
  },
  created() {
    this.id = this.$route.query.id
    this.previewReport(this.id)
  },
  methods: {
    // 切换上下页面
    changePage(type) {
      if (type == 'last') {
        this.currentPage = this.currentPage > 1 ? --this.currentPage : 1;
      } else if (type == 'next') {
        this.currentPage = this.currentPage < this.numPages ? ++this.currentPage : this.numPages;
      }
    },
    // 文件预览
    previewReport(id) {
      this.pdfUrl = pdf.createLoadingTask(globalConfig.baseURL + 'preview?materialId=' + id);
      this.pdfUrl.promise.then(pdf => {
        this.numPages = pdf.numPages;
        this.contentShow = true;
        this.loading = false;
      });

      // this.$getbuffer("/download",
      //   {
      //     materialId: item.id,
      //   }).then(res => {
      //     console.log(res);
      //     this.wordShow = true;
      //     mammoth.convertToHtml({ arrayBuffer: new Uint8Array(res.data) })
      //     .then(resultObject => {
      //       this.$nextTick(() => {
      //         this.vHtml=resultObject.value;
      //         console.log('-------', this.vHtml);
      //       });
      //     })
      //   })
    },

    // 页面缩放
    addWidth() {
      this.contentWidth = Number(this.contentWidth) >= 2000 ? 2000 : Number(this.contentWidth) + 100;
    },
    minusWidth() {
      this.contentWidth = Number(this.contentWidth) <= 1000 ? 1000 : Number(this.contentWidth) - 100;
    }
  }
}
</script>

<style lang="scss" scoped>
.pdfView {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  // 右侧浮动翻页
  .float_btn {
    position: fixed;
    top: 50px;
    right: 50px;
  }

  // 主体内容区域
  .view_content {
    width: 80%;
    min-width: 1000px;
    height: 100%;
    // overflow-y: overlay;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    // 最上层 页码、缩放、切换页面
    .top {
      font-size: 18px;
      padding: 10px 160px 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;

      .top_btn {
        // width: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .btn_page {
          display: flex;
          margin-right: 15px;

          button {
            height: 25px;
            margin: 0 5px;
            background-color: #f4f4f5;
            color: #606266;
            min-width: 30px;
            border: none;
            border-radius: 2px;
            cursor: pointer;

            &:focus {
              outline: none;
            }
          }
        }

        img {
          width: 25px;
          height: 25px;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .content {
      flex: 1;
      overflow-y: overlay;
    }

    // 下方按钮
    .btn {
      align-self: center;
      padding-top: 5px;
      padding-bottom: 10px;

      /deep/ .el-pagination.is-background .btn-prev,
      /deep/ .el-pagination.is-background .btn-next,
      /deep/ .el-pagination.is-background .el-pager li {
        background-color: #eee;
      }

      /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #1890ff;
      }
    }
  }
}
</style>