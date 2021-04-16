<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="clue_editdlg"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
      v-dialogDrag
    >
      <div slot="title" class="dialog-title">
        <span>{{ title }}</span>
      </div>

      <!-- 对话框内容 包括内容区域和确认取消按钮 -->
      <div class="dialog_content">
        <el-form
          ref="form"
          :rules="rules"
          :model="oneClue"
          label-position="right"
          label-width="120px"
          class="form_height"
        >
          <el-form-item label="届次" prop="session">
            <el-select
              v-model="oneClue.session"
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
              v-model="oneClue.year"
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
              v-model="oneClue.round"
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
              v-model="oneClue.groupName"
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
              v-model="oneClue.unitName"
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

          <el-form-item label="被反映人姓名" prop="reactionName">
            <el-input v-model="oneClue.reactionName" width="80%" />
          </el-form-item>
          <el-form-item label="被反映人职务" prop="reactionPost">
            <el-input v-model="oneClue.reactionPost" width="80%" />
          </el-form-item>
          <el-form-item label="被反映人级别" prop="reactionLevel">
            <el-input v-model="oneClue.reactionLevel" width="80%" />
          </el-form-item>
          <el-form-item label="具体问题" prop="problem">
            <!-- <el-input v-model="oneClue.problem" width="80%" /> -->
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="oneClue.problem">
            </el-input>
          </el-form-item>
          <el-form-item label="六项纪律" prop="discipline">
            <el-select
              v-model="oneClue.discipline"
              class="filter-item"
              placeholder="请选择纪律"
              clearable
            >
              <el-option
                v-for="item in sixList"
                :key="item.id"
                :label="item.result"
                :value="item.result"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一级分类" prop="firstcategory">
            <el-select
              v-model="oneClue.firstcategory"
              class="filter-item"
              placeholder="请选择一级分类"
              clearable
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
              v-model="oneClue.twoCategory"
              class="filter-item"
              placeholder="请选择二级分类"
              clearable
            >
              <el-option
                v-for="item in screen(this.oneClue.firstcategory, secondList)"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移交时间" prop="handoverTime">
            <el-date-picker
              v-model="oneClue.handoverTime"
              type="datetime"
              placeholder="选择移交时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="移交方式" prop="handoverType">
            <el-select
              v-model="oneClue.handoverType"
              class="filter-item"
              placeholder="请选择移交方式"
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移交单位" prop="transferingUnit">
            <el-input v-model="oneClue.transferingUnit" width="80%" />
          </el-form-item>
          <el-form-item label="分类处理意见" prop="classification">
            <el-select
              v-model="oneClue.classification"
              class="filter-item"
              placeholder="请选择处理意见"
              clearable
            >
              <el-option
                v-for="item in suggestList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理结果" prop="result">
            <el-input v-model="oneClue.result" width="80%" />
          </el-form-item>
          <el-form-item label="具体办理情况" prop="situation">
            <el-input v-model="oneClue.situation" width="80%" />
          </el-form-item>
          <el-form-item label="是否办结" prop="end">
            <el-select
              v-model="oneClue.end"
              class="filter-item"
              placeholder="请选择是否办结"
            >
              <el-option
                v-for="item in endList"
                :key="item.id"
                :label="item.name"
                :value="item.value"
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
      default: false,
    },
    title: {
      type: String,
      default: "",
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
      default: [],
    },
    secondList: {
      type: Array,
      default: [],
    },
    sixList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      width: "500px",
      oneClue: this.initoneClue(),
      // sixList: [],
      // rounds: [],
      tempList: [],
      typeList: [
        {
          id: 0,
          name: "单移交",
          value: "0",
        }, {
          id: 1,
          name: "双移交",
          value: "1",
        }
      ],
      endList: [
        {
          id: 0,
          name: "正在办理中",
          value: 0,
        }, {
          id: 1,
          name: "已办结",
          value: 1,
        }
      ],
      suggestList: [
        {
          id: 0,
          name: "进一步了解关注",
        },
        {
          id: 1,
          name: "了解关注",
        },
        {
          id: 2,
          name: "建议参考",
        },
      ],
      rules: {
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
        reactionName: {
          required: true,
          message: "被反映人不能为空",
          trigger: "blur",
        },
      },
    };
  },
  mounted() {
    // this.getSix();
  },
  methods: {
    //获取轮次
    // getRound() {
    //   let params = {};
    //   params.session = this.oneClue.session;
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
      this.oneClue.twoCategory = null;
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
    initoneClue() {
      return {
        id: null,
        session: null,
        year: null,
        round: null,
        groupName: null,
        unitName: null,
        classification: null,
        discipline: null,
        end: null,
        firstcategory: null,
        firstcategoryStr: null,
        handoverTime: null,
        handoverType: null,
        patrolId: null,
        problem: null,
        reactionLevel: null,
        reactionName: null,
        reactionPost: null,
        result: null,
        situation: null,
        transferingUnit: null,
        twoCategory: null,
        twoCategoryStr: null,
      }
    },
    setMessage(row) {
      this.oneClue.id = row.clueInfo.id;
      this.oneClue.pId = row.main.id;
      this.oneClue.session = row.main.session;
      this.oneClue.year = row.main.year;
      this.oneClue.round = row.main.round;
      this.oneClue.groupName = row.main.groupName;
      this.oneClue.unitName = row.main.unitName;
      this.oneClue.classification = row.clueInfo.classification;
      this.oneClue.discipline = row.clueInfo.discipline;
      this.oneClue.end = row.clueInfo.end;
      this.oneClue.firstcategory = row.clueInfo.firstcategory;
      this.oneClue.firstcategoryStr = row.clueInfo.firstcategoryStr;
      this.oneClue.handoverTime = row.clueInfo.handoverTime;
      this.oneClue.handoverType = row.clueInfo.handoverType;
      this.oneClue.patrolId = row.clueInfo.patrolId;
      this.oneClue.problem = row.clueInfo.problem;
      this.oneClue.reactionLevel = row.clueInfo.reactionLevel;
      this.oneClue.reactionName = row.clueInfo.reactionName;
      this.oneClue.reactionPost = row.clueInfo.reactionPost;
      this.oneClue.result = row.clueInfo.result;
      this.oneClue.situation = row.clueInfo.situation;
      this.oneClue.transferingUnit = row.clueInfo.transferingUnit;
      this.oneClue.twoCategory = row.clueInfo.twoCategory;
      this.oneClue.twoCategoryStr = row.clueInfo.twoCategoryStr;
    },

    //表单提交
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // console.log("oneClue:",this.oneClue);
          await this.$put("/inspection/patrol/updateGroup", {
            groupName: this.oneClue.groupName,
            id: this.oneClue.pId,
            patrolUnitId: this.oneClue.patrolId,
            round: this.oneClue.round,
            session: this.oneClue.session,
            unitName: this.oneClue.unitName,
            year: this.oneClue.year,
          })

          this.$get("/inspection/clue/upd", { ...this.oneClue }).then((r) => {
            if (r.data.code == 20000) {
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.updateSuccess"),
                type: "success",
              });
              this.$emit("success");
            }
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
      this.oneClue = this.initoneClue();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
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
      },
    },
  },
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
// 	padding: 30px 120px;
// }
// /deep/.dialog-title span{
// 	color: #0082E7;
// }

// 添加对话框
/deep/ .clue_editdlg {
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

  // 内容区域
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

      .el-textarea{
        width: 90%;
      }

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
  }
}
</style>
