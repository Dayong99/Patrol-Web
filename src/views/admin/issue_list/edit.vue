<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="issue_editdlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <span>{{ title }}</span>
      </div>

      <div class="dialog_content">
        <el-form
          ref="form"
          :rules="rules"
          :model="oneIssue"
          label-position="right"
          label-width="120px"
          class="form_height"
        >
          <el-form-item label="届次" prop="session">
            <el-select
              v-model="oneIssue.session"
              class="filter-item"
              clearable
              placeholder="请选择届次"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in sessions"
                :key="item.session"
                :label="item.session"
                :value="item.session"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="年度" prop="year">
            <el-select
              v-model="oneIssue.year"
              clearable
              placeholder="请选择年度"
              class="filter-item"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in years"
                :key="item.year"
                :label="item.year"
                :value="item.year"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="轮次" prop="round">
            <el-select
              v-model="oneIssue.round"
              class="filter-item"
              clearable
              placeholder="请选择轮次"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in rounds"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="巡察组" prop="groupName">
            <el-select
              v-model="oneIssue.groupName"
              class="filter-item"
              clearable
              placeholder="请选择巡察组"
              filterable
              default-first-option
            >
              <el-option
                v-for="item in searchGroups"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="被巡察单位" prop="unitName">
            <el-select
              v-model="oneIssue.unitName"
              class="filter-item"
              clearable
              placeholder="被巡察单位"
              filterable
              default-first-option
            >
              <el-option
                v-for="item in searchUnits"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题内容：" prop="message">
            <!-- <el-input v-model="oneIssue.message" width="80%" /> -->
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="oneIssue.message">
            </el-input>
            <el-checkbox v-model="flag" width="20%">重点问题</el-checkbox>
          </el-form-item>

          <el-form-item label="一级分类" prop="firstCategory">
            <el-select
              v-model="oneIssue.firstCategory"
              class="filter-item"
              placeholder="请选择一级分类"
              @change="clearTwo"
            >
              <el-option
                v-for="item in firstList"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类" prop="twoCategory">
            <el-select
              v-model="oneIssue.twoCategory"
              class="filter-item"
              placeholder="请选择二级分类"
            >
              <el-option
                v-for="item in screen(this.oneIssue.firstCategory, secondList)"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="其他标签" prop="otherCategory">
            <el-select
              v-model="oneIssue.otherCategory"
              class="filter-item"
              placeholder="请选择其他标签"
            >
              <el-option
                v-for="item in elseList"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="warning" plain @click="reset">重置</el-button>
          <el-button type="primary" plain @click="submitForm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: "",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    sessions: {
      type: Array,
      default: [],
    },
    years: {
      type: Array,
      default: [],
    },
    searchUnits: {
      type: Array,
      default: [],
    },
    // searchGroups: {
    //   type: Array,
    //   default: [],
    // },
    firstList: {
      type: Array,
      default: []
    },
    secondList: {
      type: Array,
      default: []
    },
    elseList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      width: "430px",
      oneIssue: this.initoneIssue(),
      tempList: [],
      // rounds: [],
      flag: false,
      rules: {
        message: {
          required: true,
          message: "问题内容不能为空",
          trigger: "blur",
        },
        session: {
          required: true,
          message: "届次不能为空",
          trigger: "blur",
        },
        year: {
          required: true,
          message: "年度不能为空",
          trigger: "blur",
        },
        round: {
          required: true,
          message: "轮次不能为空",
          trigger: "blur",
        },
        groupName: {
          required: true,
          message: "巡察组不能为空",
          trigger: "blur",
        },
        unitName: {
          required: true,
          message: "巡察单位不能为空",
          trigger: "blur",
        },
      }
    };
  },
  mounted() { },
  methods: {
    // //获取轮次
    // getRound() {
    //   let params = {};
    //   params.session = this.oneIssue.session;
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
    //加载对应的二级分类
    clearTwo() {
      this.oneIssue.twoCategory = null;
    },
    screen(val, secondList) {
      let tempList = [];
      secondList.forEach(item => {
        if (item.parentId == val) {
          tempList.push(item);
        }
      });
      return tempList;
    },
    setFlag(row) {
      this.flag = row.main.stress == 1 ? true : false;
    },
    initoneIssue() {
      return {
        id: null,
        patrolId: null,
        session: null,
        year: null,
        round: null,
        groupName: null,
        unitName: null,
        stress: null,
        message: null,
        firstCategory: null,
        twoCategory: null,
        otherCategory: null
      };
    },
    setMessage(row) {
      this.oneIssue.pId = row.main.patrolId;
      this.oneIssue.session = row.main.session;
      this.oneIssue.year = row.main.year;
      this.oneIssue.round = row.main.round;
      this.oneIssue.groupName = row.main.groupName;
      this.oneIssue.unitName = row.main.name;
      this.oneIssue.id = row.main.id;
      this.oneIssue.patrolId = row.main.patrolUnitId;
      // this.oneIssue.flag = row.main.stress == 1 ? true : false;
      this.oneIssue.message = row.main.message;
      this.oneIssue.firstCategory = row.main.firstCategory;
      this.oneIssue.twoCategory = row.main.twoCategory;
      this.oneIssue.otherCategory = row.main.otherCategory;
      this.oneIssue.stress = row.main.stress;
    },

    //表单提交
    submitForm() {
      this.oneIssue.stress = this.flag == true ? 1 : 0;
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log("oneIssue:", this.oneIssue);
          await this.$put("/inspection/patrol/updateGroup", {
            groupName: this.oneIssue.groupName,
            id: this.oneIssue.pId,
            patrolUnitId: this.oneIssue.patrolId,
            round: this.oneIssue.round,
            session: this.oneIssue.session,
            unitName: this.oneIssue.unitName,
            year: this.oneIssue.year,
          })

          this.$put("/inspection/t-problem", { ...this.oneIssue }).then(() => {
            this.isVisible = false;
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success"
            });
            this.$emit("success");
          });
        } else {
          return false;
        }
      });
    },

    close() {
      this.$emit("close");
    },
    reset() {
      this.flag = false;
      this.oneIssue = this.initoneIssue();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    }
  },
  computed: {
    ...mapState({
      rounds: state => state.totalData.rounds,
      searchGroups: state => state.totalData.searchGroups,
    }),

    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  width: 200px;
}
// .el-input {
// 	width: 80%;
// }
// /deep/ .el-dialog__body {
//   padding: 30px 120px;
// }
// /deep/.dialog-title span {
//   color: #0082e7;
// }

// 添加报告对话框
/deep/ .issue_editdlg {
  border-radius: 4px;

  .el-dialog__header {
    padding: 10px 20px;

    .el-dialog__headerbtn {
      top: 10px;
    }
  }

  .dialog-title {
    font-family: "微软雅黑";
    span {
      font-size: 16px;
    }
  }

  .el-dialog__body {
    padding: 0 20px 20px;
  }

  .dialog-footer {
    margin-top: 10px;
  }

  // 对话框内容
  .dialog_content {
    padding: 15px 0;
    display: flex;
    flex-flow: column nowrap;
    // justify-content: space-between;
    align-items: center;
    // box-shadow: 2px 2px 8px 0px rgba(127, 136, 154, 0.36);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #f1f3f6;

    // 设置最大高度
    .form_height {
      max-height: 450px;
      overflow-y: overlay;

      /* 设置滚动条的样式 */
      &::-webkit-scrollbar {
          width: 4px;
          background-color: #fff;
      }

      /* 滚动槽 */
      &::-webkit-scrollbar-track {
          border-radius: 10px;
      }

      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: rgba(194, 194, 194, 0.8);
      }
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-form-item__error {
      padding-top: 0;
    }

    /deep/ .el-textarea {
      width: 80%;
    }
  }
}
</style>
