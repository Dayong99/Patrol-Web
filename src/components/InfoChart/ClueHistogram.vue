<template>
  <div id="chart"></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      // 图表
      qCharts: null,
    }
  },
  mounted() {
    // 初始化图表
    this.qCharts = this.$echarts.init(document.getElementById("chart"))
    
    // 重置图表
    window.onresize = () => {
      this.qCharts.resize();
    }
  },
  computed: {
    ...mapState({
      clueData: state => state.graph.clueData,
    })
  },
  watch: {
    // 问题清单列表数据
    clueData: {
      handler(newval, oldval) {
        if(newval.type == 0) {
          this.initHistogram()
        } else if(newval.type == 1) {
          this.initLineChart()
        }
      },
      deep: true,
    }
  },
  methods: {
    // 初始化echarts
    initHistogram() {
      // 设置option参数
      let option = {
        // backgroundColor: '#00265f',
        title: {
          text: this.clueData.title,
          textStyle: {
            align: 'center',
            color: '#000',
            fontSize: 20,
          },
          left: '5%',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: this.clueData.legendData,
          align: 'right',
          right: 10,
          textStyle: {
            color: "#333"
          },
          itemWidth: 10,
          itemHeight: 15,
          itemGap: 35
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.clueData.xData,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#000",
              width: 1,
              type: "solid"
            }
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000",
            }
          },
        }],
        yAxis: [{
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#000",
              width: 1,
              type: "solid"
            },
          },
          splitLine: {
            lineStyle: {
              color: "#ccc",
              width: 1,
              type: "dashed"
            }
          }
        }],
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

      this.clueData.seriesData.forEach(item => {
        let obj = {
          name: item.name,
          type: 'bar',
          data: item.data,
          barWidth: 10, //柱子宽度
          barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
              color: item.color,
              opacity: 1,
            }
          }
        }
        option.series.push(obj)
      })
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
			this.qCharts.setOption(option, true, false)
    },
    initLineChart() {
      // 设置option参数
      let option = {
        title: {
          text: this.clueData.title,
          textStyle: {
            align: 'center',
            color: '#000',
            fontSize: 20,
          },
          left: '5%',
        },
        legend: {
          data: this.clueData.legendData,
          // top: '5%',
          right: 10,
          textStyle: {
            color: '#333', //坐标的字体颜色
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: "shadow",
            label: {
              show: true
            },
          },
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            show: true
          },
          splitArea: {
            // show: true,
            color: '#f00',
            lineStyle: {
              color: '#f00'
            },
          },
          axisLabel: {
            color: '#000'
          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: this.clueData.xData,
        }],

        yAxis: [{
          type: 'value',
          min: 0,
          // max: 140,
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ccc",
              width: 1,
              type: "dashed"
            },
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value} %',
            textStyle: {
              color: '#000',
            },
          },
          axisTick: {
            show: false,
          },
        }],
        series: []
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
      this.clueData.seriesData.forEach(item => {
        let obj = {
          name: item.name,
          type: 'line',
          showAllSymbol: true,
          symbol: 'circle',
          symbolSize: 15,
          lineStyle: {
            normal: {
              color: item.color,
            },
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: item.color,
            }
          },

          itemStyle: {
            color: item.color,
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
        }
        option.series.push(obj)
      })
      this.qCharts.setOption(option, true, false)
    },
  }
}
</script>

<style lang="scss" scoped>
  // 图表
  #chart {
    // width: 100%;
    // height: 100%;
    margin-top: 15px;
    padding-top: 10px;
    // border: 1px solid #ccc;
  }
</style>