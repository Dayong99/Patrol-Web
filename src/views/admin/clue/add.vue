<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="clue_dlg"
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
          :model="newClue"
          :rules="rules"
          label-position="right"
          label-width="120px"
          class="form_height"
        >
          <el-form-item label="届次" prop="session">
            <el-select
              placeholder="请选择届次"
              v-model="newClue.session"
              clearable
              size="small"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in sessions"
                :key="item.session"
                :label="item.session"
                :value="item.session"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="年度" prop="year">
            <el-select
              placeholder="请选择年度"
              v-model="newClue.year"
              clearable
              size="small"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in years"
                :key="item.year"
                :label="item.year"
                :value="item.year"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="轮次" prop="round">
            <el-select
              placeholder="请选择轮次"
              v-model="newClue.round"
              clearable
              size="small"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in rounds"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡察组" prop="groupName">
            <el-select
              placeholder="请选择巡察组"
              v-model="newClue.groupName"
              clearable
              size="small"
              filterable
              default-first-option
            >
              <el-option
                v-for="item in searchGroups"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡察单位" prop="unitName">
            <el-select
              placeholder="请选择被巡察单位"
              v-model="newClue.unitName"
              clearable
              size="small"
              filterable
              default-first-option
            >
              <el-option
                v-for="item in searchUnits"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡察时间" prop="patrolTime">
            <el-date-picker
              v-model="newClue.patrolTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="newClue.endTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="被反映人姓名" prop="reactionName">
            <el-input v-model="newClue.reactionName" />
          </el-form-item>
          <el-form-item label="被反映人职务" prop="reactionPost">
            <el-input v-model="newClue.reactionPost" />
          </el-form-item>
          <el-form-item label="被反映人级别" prop="reactionLevel">
            <el-input v-model="newClue.reactionLevel" />
          </el-form-item>
          <el-form-item label="具体问题" prop="problem">
            <!-- <el-input v-model="newClue.problem" /> -->
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="newClue.problem">
            </el-input>
          </el-form-item>
          <el-form-item label="六项纪律" prop="discipline">
            <el-select
              v-model="newClue.discipline"
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
              v-model="newClue.firstcategory"
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
              v-model="newClue.twoCategory"
              class="filter-item"
              placeholder="请选择二级分类"
              clearable
            >
              <el-option
                v-for="item in screen(this.newClue.firstcategory, secondList)"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移交时间" prop="handoverTime">
            <el-date-picker
              v-model="newClue.handoverTime"
              type="datetime"
              placeholder="选择移交时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="移交方式" prop="handoverType">
            <el-select
              v-model="newClue.handoverType"
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
            <el-input v-model="newClue.transferingUnit" />
          </el-form-item>
          <el-form-item label="分类处理意见" prop="classification">
            <el-select
              v-model="newClue.classification"
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
            <el-input v-model="newClue.result" />
          </el-form-item>
          <el-form-item label="具体办理情况" prop="situation">
            <el-input v-model="newClue.situation" />
          </el-form-item>
          <el-form-item label="是否办结" prop="end">
            <el-select
              v-model="newClue.end"
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
          <!-- <el-button type="warning" plain @click="reset">重置</el-button> -->
          <el-button type="warning" plain @click="isVisible = false"
            >取消</el-button
          >
          <el-button type="primary" plain @click="submitForm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: '',
  props: {
    title: {
      type: String,
      default: "",
    },
    addlogVisible: {
      type: Boolean,
      default: false,
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
      checked: 0,
      modal: false,
      width: "500px",
      height: 240,
      newClue: this.initnewClue(),
      // rounds: [],
      tempList: [],
      typeList: [
        {
          id: 0,
          name: "单移交",
          value: 0,
        }, {
          id: 1,
          name: "双移交",
          value: 1,
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
    }
  },
  computed: {
    ...mapState({
      rounds: state => state.totalData.rounds,
      searchGroups: state => state.totalData.searchGroups,
    }),

    isVisible: {
      get() {
        return this.addlogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    }
  },
  methods: {
    initnewClue() {
      return {
        session: null,
        year: null,
        round: null,
        groupName: null,
        unitName: null,
        patrolTime: null,
        endTime: null,
        type: 5,
        id: null,
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
      };
    },
    //获取轮次
    // getRound() {
    //   let params = {};
    //   params.session = this.newClue.session;
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
      this.newClue.twoCategory = null;
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
    close() {
      this.$emit("close");
    },
    //重置弹窗
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.newClue = this.initnewClue();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    setPatrolid(r) {
      this.newClue.patrolId = r.data.data.patrolUnitId;
      this.newClue.id = r.data.data.tCluelId;
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.$post("/inspection/patrol", {
            session: this.newClue.session,
            round: this.newClue.round,
            year: this.newClue.year,
            unitName: this.newClue.unitName,
            groupName: this.newClue.groupName,
            type: this.newClue.type,
            patrolTime: this.newClue.patrolTime,
            endTime: this.newClue.endTime,
          }).then((r) => {
            if (r.data.code == 20000) {
              // console.log("r.data.data:",r.data.data);
              this.setPatrolid(r);
            }
          });

          this.$get("/inspection/clue/upd", {
            id: this.newClue.id,
            classification: this.newClue.classification,
            discipline: this.newClue.discipline,
            end: this.newClue.end,
            firstcategory: this.newClue.firstcategory,
            handoverTime: this.newClue.handoverTime,
            handoverType: this.newClue.handoverType,
            patrolId: this.newClue.patrolId,
            problem: this.newClue.problem,
            reactionLevel: this.newClue.reactionLevel,
            reactionName: this.newClue.reactionName,
            reactionPost: this.newClue.reactionPost,
            result: this.newClue.result,
            situation: this.newClue.situation,
            transferingUnit: this.newClue.transferingUnit,
            twoCategory: this.newClue.twoCategory,
          }).then((r) => {
            if (r.data.code == 20000) {
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.createSuccess"),
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
  },
}
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

// 添加线索对话框
/deep/ .clue_dlg {
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