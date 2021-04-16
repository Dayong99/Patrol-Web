<template>
  <div id="chartGroup">
    <ul class="picGroup" style="display: flex">
      <li
        v-for="(item, index) in clueLineData"
        @click.stop="initOneLineChart(index, item)"
        :key="index"
        :class="{ box: true, chart_hover: index == chartIndex }"
      >
        <el-card class="oneChart" style="padding: 2px">
          <div :id="getDivID(index)" style="width: 200px; height: 150px"></div>
        </el-card>

        <div :class="{ title: true, title_focus: index == chartIndex }">
          {{ item.name }}
        </div>
      </li>
    </ul>
    <!-- <div class="chartBox"> -->
    <el-card class="chartBox" shadow="hover">
      <div id="chartDetail"></div>
    </el-card>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    // session: {
    //   type: Number,
    //   default: "",
    // },
  },
  data() {
    return {
      // 图表组
      qCharts: [],
      //单个具体图表
      qChart: null,
      chartIndex: 0,
    };
  },
  mounted() {
    this.qChart = this.$echarts.init(document.getElementById("chartDetail"));

    // 重置图表
    window.onresize = () => {
      this.qCharts.resize();
    };
  },
  computed: {
    ...mapState({
      clueLineData: (state) => state.graph.clueLineData,
    }),
  },
  watch: {
    // 问题清单列表数据
    clueLineData: {
      handler(newval, oldval) {
        console.log("newval.length", newval.length);
        if (newval.length > 0) {
          this.$nextTick(() => {
            console.log("----clueLineData", this.clueLineData);
            this.clueLineData.forEach((item, index) => {
              this.qCharts[index] = this.$echarts.init(
                document.getElementById("chart_" + index)
              );
              console.log("item", item);
              //构建图组
              this.initLineChart(item, index);
            });
            //构建单个图
            this.initOneLineChart(0, this.clueLineData[0]);
          });
        }
      },

      // deep: true,
    },
    session: {
      handler(newval, oldval) {
        // console.log("----clueLineData",this.clueLineData)
        // this.clueLineData.forEach((item, index) => {
        //   this.qCharts[index] = this.$echarts.init(
        //     document.getElementById("chart" + index)
        //   );
        //   this.initLineChart(item, index);
        // });
      },
      deep: true,
    },
  },
  methods: {
    //获取div id
    getDivID(index) {
      return "chart_" + index;
    },
    // 初始化echarts
    initHistogram() {
      // 设置option参数
      let option = {
        // backgroundColor: '#00265f',
        title: {
          text: this.clueLineData.title,
          textStyle: {
            align: "center",
            color: "#000",
            fontSize: 20,
          },
          left: "5%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          type: 'scroll',
          // orient: 'vertical',
          data: this.clueLineData.legendData,
          align: "right",
          right: 10,
          textStyle: {
            color: "#333",
          },
          itemWidth: 10,
          itemHeight: 15,
          itemGap: 35,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.clueLineData.xData,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000",
                width: 1,
                type: "solid",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#000",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value} ",
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000",
                width: 1,
                type: "solid",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#ccc",
                width: 1,
                type: "dashed",
              },
            },
          },
        ],
        // "dataZoom": [{
        //   "show": true,
        //   "height": 12,
        //   "xAxisIndex": [
        //       0
        //   ],
        //   bottom: '5%',
        //   "start": 10,
        //   "end": 90,
        //   handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        //   handleSize: '110%',
        //   handleStyle: {
        //     color: "#fff",
        //   },
        //   textStyle: {
        //     color: "#000"
        //   },
        //   borderColor: "#90979c"
        // }, {
        //     "type": "inside",
        //     "show": true,
        //     "height": 15,
        //     "start": 1,
        //     "end": 35
        // }],
        dataZoom: [
          {
            type: "slider",
            show: true,
            start: 0,
            end: 50,
            handleSize: 8,
          },
          {
            type: "inside",
            start: 0,
            end: 50,
          },
        ],
        series: [],
      };

      this.clueLineData.seriesData.forEach((item) => {
        let obj = {
          name: item.name,
          type: "bar",
          data: item.data,
          barWidth: 10, //柱子宽度
          barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
              color: item.color,
              opacity: 1,
            },
          },
        };
        option.series.push(obj);
      });
      /*  series 的配置参数
        {
          name: '问题一',
          type: 'bar',
          data: [20, 50, 80, 58, 83, 68, 57, 80, 42, 66],
          barWidth: 20, //柱子宽度
          barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
							color: '#5b8ff9',
              opacity: 1,
            }
          }
        }
      */
      this.qCharts.setOption(option, true, false);
    },
    initLineChart(clueData, index) {
      // 设置option参数
      let option = {
        title: {
          text: clueData.title,
          textStyle: {
            align: "center",
            color: "#000",
            fontSize: 7,
          },
          left: "5%",
        },
        // legend: {
        //   data: clueData.legendData,
        //   // top: '5%',
        //   right: 20,
        //   textStyle: {
        //     color: "#333",
        //     fontSize :5,//坐标的字体颜色
        //   },
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
            },
          },
        },
        grid: {
          top: "15%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: true,
            },
            splitArea: {
              // show: true,
              color: "#f00",
              lineStyle: {
                color: "#f00",
              },
            },
            axisLabel: {
              color: "#000",
              textStyle: {
                fontSize: 5,
              },
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
            data: clueData.xData,
          },
        ],

        yAxis: [
          {
            type: "value",
            min: 0,
            // max: 140,
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: "#ccc",
                width: 1,
                type: "dashed",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              formatter: "{value} ",
              textStyle: {
                color: "#000",
                fontSize: 5,
              },
            },
            axisTick: {
              show: false,
            },
            textStyle: {
              fontSize: 5,
            },
          },
        ],
        series: [],
      };
      /* 配置信息
        {
          name: '注册',
          type: 'line',
          showAllSymbol: true,
          symbol: 'circle',
          symbolSize: 15,
          lineStyle: {
            normal: {
              color: "#00ca95",
            },
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#00ca95',
            }
          },

          itemStyle: {
            color: "#00ca95",
            borderColor: "#fff",
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, .3)',
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2,
          },
          tooltip: {
            show: true
          },
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0,202,149,0.3)'
              },
              {
                offset: 1,
                color: 'rgba(0,202,149,0)'
              }
              ], false),
              shadowColor: 'rgba(0,202,149, 0.9)',
              shadowBlur: 20
            }
          },
          data: [281.55, 398.35, 214.02, 179.55, 289.57, 356.14,],
        }
      */
      clueData.seriesData.forEach((item) => {
        let obj = {
          name: item.name,
          type: "line",
          showAllSymbol: true,
          symbol: "circle",
          symbolSize: 5,
          lineStyle: {
            normal: {
              color: item.color,
            },
          },
          label: {
            show: true,
            position: "top",
            textStyle: {
              color: item.color,
              fontSize: 5,
            },
          },

          itemStyle: {
            color: item.color,
            borderColor: "#fff",
            borderWidth: 1,
            shadowColor: "rgba(0, 0, 0, .3)",
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2,
          },
          tooltip: {
            show: true,
          },
          // areaStyle: {
          //   normal: {
          //     color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //       offset: 0,
          //       color: 'rgba(0,202,149,0.3)'
          //     },
          //     {
          //       offset: 1,
          //       color: 'rgba(0,202,149,0)'
          //     }
          //     ], false),
          //     shadowColor: 'rgba(0,202,149, 0.9)',
          //     shadowBlur: 20
          //   }
          // },
          data: item.data,
        };
        option.series.push(obj);
      });
      this.qCharts[index].setOption(option, true, false);
    },
    initOneLineChart(index, itemdata) {
      this.chartIndex = index;
      // 设置option参数
      let option = {
        title: {
          text: itemdata.title,
          textStyle: {
            align: "center",
            color: "#000",
            fontSize: 18,
          },
          left: "5%",
        },
        legend: {
          data: itemdata.legendData,
          left: "5%",
          top: '15%',
          // right: 10,
          textStyle: {
            color: "#333", //坐标的字体颜色
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
            },
          },
        },
        grid: {
          top: "35%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: true,
            },
            splitArea: {
              // show: true,
              color: "#f00",
              lineStyle: {
                color: "#f00",
              },
            },
            axisLabel: {
              color: "#000",
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
            data: itemdata.xData,
          },
        ],

        yAxis: [
          {
            type: "value",
            min: 0,
            // max: 140,
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: "#ccc",
                width: 1,
                type: "dashed",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              formatter: "{value} ",
              textStyle: {
                color: "#000",
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [],
      };
      /* 配置信息
        {
          name: '注册',
          type: 'line',
          showAllSymbol: true,
          symbol: 'circle',
          symbolSize: 15,
          lineStyle: {
            normal: {
              color: "#00ca95",
            },
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#00ca95',
            }
          },

          itemStyle: {
            color: "#00ca95",
            borderColor: "#fff",
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, .3)',
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2,
          },
          tooltip: {
            show: true
          },
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0,202,149,0.3)'
              },
              {
                offset: 1,
                color: 'rgba(0,202,149,0)'
              }
              ], false),
              shadowColor: 'rgba(0,202,149, 0.9)',
              shadowBlur: 20
            }
          },
          data: [281.55, 398.35, 214.02, 179.55, 289.57, 356.14,],
        }
      */
      itemdata.seriesData.forEach((item) => {
        let obj = {
          name: item.name,
          type: "line",
          showAllSymbol: true,
          symbol: "circle",
          symbolSize: 15,
          lineStyle: {
            normal: {
              color: item.color,
            },
          },
          label: {
            show: true,
            position: "top",
            textStyle: {
              color: item.color,
            },
          },

          itemStyle: {
            color: item.color,
            borderColor: "#fff",
            borderWidth: 2,
            shadowColor: "rgba(0, 0, 0, .3)",
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2,
          },
          tooltip: {
            show: true,
          },
          // areaStyle: {
          //   normal: {
          //     color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //       offset: 0,
          //       color: 'rgba(0,202,149,0.3)'
          //     },
          //     {
          //       offset: 1,
          //       color: 'rgba(0,202,149,0)'
          //     }
          //     ], false),
          //     shadowColor: 'rgba(0,202,149, 0.9)',
          //     shadowBlur: 20
          //   }
          // },
          data: item.data,
        };
        option.series.push(obj);
      });
      this.qChart.setOption(option, true, false);
    },
  },
};
</script>

<style lang="scss" scoped>
// 图表
#chartGroup {
  // width: 100%;
  // height: 100%;
  margin-top: 15px;
  // padding-top: 10px;
  display: flex;
  flex-direction: column;
  width: 800px;
  align-items: center;
  // border: 1px solid #ccc;
}
.chartBox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 450px;
  width: 700px;
  margin-top: 50px;
  padding: 20px;
  // border: 1px solid #000;
}
#chartDetail {
  height: 410px;
  width: 680px;
}
.oneChart /deep/ .el-card__body {
  padding: 2px;
  border: 4px solid white;
}
.picGroup {
  display: flex;
  max-width: 700px;
  height: 240px;
  overflow-x: auto;
  padding: 10px;
}
// #chart0{
//   margin-top: 15px;
//   padding-top: 10px;
// }
.box {
  display: flex;
  // justify-content: space-around;
  flex-direction: column;
  align-items: center;
  margin-right: 5px;

  .el-card.is-always-shadow {
    box-shadow: 0 0 12px 4px rgba(0,0,0,0.1);
  }
}
.chart_hover {
  .el-card {
    border: 2px solid #008fff;
  }
}
.title {
  margin-top: 4px;
  color: #9BA4AA;
}
.title_focus {
  font-family: MicrosoftYaHei;
  color: #008fff;
  font-weight: bold;
}
::-webkit-scrollbar {
  width: 210px;
  height: 2px;
  background-color:#D5D8DA;
  cursor: pointer;
}
</style>