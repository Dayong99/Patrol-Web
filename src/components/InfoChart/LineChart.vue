<template>
  <div id="line_chart"></div>
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
    this.qCharts = this.$echarts.init(document.getElementById("line_chart"))
  },
  computed: {
    ...mapState({
      disLineData: state => state.graph.disLineData,
    })
  },
  watch: {
    // 问题清单列表数据
    disLineData: {
      handler(newval, oldval) {
        console.log('折线图', newval);
        this.initChart()
      },
      deep: true,
    }
  },
  methods: {
    // 初始化echarts
    initChart() {
      // if (this.qCharts) {
      //   // 清除数据，下面重新添加
      //   this.qCharts.clear()
      // }

      // 设置option参数
      let option = {
        title: {
          text: this.disLineData.title,
          textStyle: {
            align: 'center',
            color: '#000',
            fontSize: 20,
          },
          left: '5%',
        },
        legend: {
          type: 'scroll',
          data: this.disLineData.legendData,
          top: '5%',
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
          bottom: '15%',
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
          data: this.disLineData.xData,
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
      this.disLineData.seriesData.forEach(item => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
// 图表
#line_chart {
  // width: 100%;
  // height: 100%;
  margin-top: 15px;
  padding-top: 10px;
  // border: 1px solid #ccc;
}
</style>