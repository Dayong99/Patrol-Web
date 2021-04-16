<template>
  <div>
    <el-dialog
      :width="width"
      top="50px"
      custom-class="issue_dlg"
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
          :model="newissue"
          :rules="rules"
          label-position="right"
          label-width="120px"
          class="form_height"
        >
          <el-form-item label="届次" prop="session">
            <el-select
              placeholder="请选择届次"
              v-model="newissue.session"
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
              v-model="newissue.year"
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
              v-model="newissue.round"
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
              v-model="newissue.groupName"
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
              v-model="newissue.unitName"
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
              v-model="newissue.patrolTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="newissue.endTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="具体问题" prop="message">
            <!-- <el-input v-model="newissue.message" width="80%" /> -->
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="newissue.message">
            </el-input>
            <el-checkbox
              v-model="newissue.stress"
              true-label="1"
              false-label="0"
              width="20%"
              >重点问题</el-checkbox
            >
          </el-form-item>
          <el-form-item label="一级分类" prop="firstCategory">
            <el-select
              placeholder="请选择一级分类"
              v-model="newissue.firstCategory"
              clearable
              size="small"
              @change="clearTwo"
            >
              <el-option
                v-for="item in firstList"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类" prop="twoCategory">
            <el-select
              placeholder="请选择二级分类"
              v-model="newissue.twoCategory"
              clearable
              size="small"
            >
              <el-option
                v-for="item in screen(this.newissue.firstCategory, secondList)"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="其他标签" prop="otherCategory">
            <el-select
              placeholder="请选择其他标签"
              v-model="newissue.otherCategory"
              clearable
              size="small"
            >
              <el-option
                v-for="item in elseList"
                :key="item.id"
                :label="item.result"
                :value="item.id"
              />
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
    elseList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      checked: 0,
      modal: false,
      width: "430px",
      height: 240,
      newissue: this.initnewissue(),
      // rounds: [],
      tempList: [],
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
        // patrolTime: {
        // 	required: true,
        // 	message: "巡察时间不能为空",
        // 	trigger: "blur",
        // },
        // endTime: {
        // 	required: true,
        // 	message: "结束时间不能为空",
        // 	trigger: "blur",
        // },
        message: {
          required: true,
          message: "问题内容不能为空",
          trigger: "blur",
        },
        // firstCategory: {
        //   required: true,
        // 	message: "一级分类不能为空",
        // 	trigger: "blur",
        // },
        // twoCategory: {
        //   required: true,
        // 	message: "二级分类不能为空",
        // 	trigger: "blur",
        // },
        // otherCategory: {
        //   required: true,
        // 	message: "其他标签不能为空",
        // 	trigger: "blur",
        // },
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
    show() {
      console.log("checked:", this.checked);
    },
    initnewissue() {
      return {
        id: null,
        session: null,
        year: null,
        round: null,
        groupName: null,
        unitName: null,
        type: 2,
        patrolTime: null,
        endTime: null,
        stress: 0,
        message: null,
        firstCategory: null,
        twoCategory: null,
        otherCategory: null,
        patrolId: null,
      };
    },
    // //获取轮次
    // getRound() {
    //   let params = {};
    //   params.session = this.newissue.session;
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
      this.newissue.twoCategory = null;
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
      this.newissue = this.initnewissue();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    setPatrolid(r) {
      this.newissue.id = r.data.data.problemId
      this.newissue.patrolId = r.data.data.patrolUnitId;
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.$post("/inspection/patrol", {
            session: this.newissue.session,
            round: this.newissue.round,
            year: this.newissue.year,
            unitName: this.newissue.unitName,
            groupName: this.newissue.groupName,
            type: this.newissue.type,
            patrolTime: this.newissue.patrolTime,
            endTime: this.newissue.endTime,
          }).then((r) => {
            if (r.data.code == 20000) {
              // console.log("r.data.data:",r.data.data);
              this.setPatrolid(r);
            }
          });

          this.$put("/inspection/t-problem", {
            id: this.newissue.id,
            patrolId: this.newissue.patrolId,
            firstCategory: this.newissue.firstCategory,
            twoCategory: this.newissue.twoCategory,
            otherCategory: this.newissue.otherCategory,
            message: this.newissue.message,
            stress: this.newissue.stress,
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
// 添加对话框
/deep/ .issue_dlg {
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
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    border: 1px solid #F1F3F6;
    
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
// /deep/.dialog-title span {
//   color: #0082e7;
// }
</style>