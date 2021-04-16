<template>
  <div class="app-container fa">
    <div class="top-box">
      <div class="sel">
        <el-select
          v-model="queryParams.session"
          class="filter-item"
          clearable
          placeholder="请选择届次"
        >
          <el-option
            v-for="item in sessions"
            :key="item.session"
            :label="'第' + item.session + '届'"
            :value="item.session"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="queryParams.round"
          class="filter-item"
          clearable
          placeholder="请选择轮次"
        >
          <el-option
            v-for="item in rounds"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="queryParams.year"
          class="filter-item"
          clearable
          placeholder="请选择年度"
        >
          <el-option
            v-for="item in years"
            :key="item.year"
            :label="item.year + '年'"
            :value="item.year"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="queryParams.name"
          class="filter-item"
          clearable
          placeholder="被巡察单位"
        >
          <el-option
            v-for="item in searchUnits"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="queryParams.first"
          class="filter-item"
          placeholder="请选择一级分类"
          clearable
        >
          <el-option
            v-for="item in firstList"
            :key="item.id"
            :label="item.result"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="main">
      <div class="left">
        <div class="chart_map">
          <div id="chart_map1"></div>
        </div>
        <el-card class="chartBox" shadow="hover">
          <div class="chart_box his_chart">
            <histogram class="district_chart"></histogram>

            <div class="chart_operation">
              <div
                :class="{
                  histogram_btn: true,
                  chart_btn: true,
                  btn_active: chartFlag == 0,
                }"
                @click.stop="changeChart(0)"
              >
                柱状图
              </div>
              <div
                :class="{
                  linechart_btn: true,
                  chart_btn: true,
                  btn_active: chartFlag == 1,
                }"
                @click.stop="changeChart(1)"
              >
                折线图
              </div>
            </div>
          </div>
        </el-card>
        <!-- <div class="chart_box">
          <histogram class="district_chart"></histogram>

          <div class="chart_operation">
            <div
              :class="{
                histogram_btn: true,
                chart_btn: true,
                btn_active: chartFlag == 0,
              }"
              @click.stop="changeChart(0)"
            >
              柱状图
            </div>
            <div
              :class="{
                linechart_btn: true,
                chart_btn: true,
                btn_active: chartFlag == 1,
              }"
              @click.stop="changeChart(1)"
            >
              折线图
            </div>
          </div>
        </div> -->
      </div>
      <div class="right">
        <div class="chart_box">
          <histogram-group class="district_chart"></histogram-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import Histogram from "@/components/InfoChart/ClueHistogramNum.vue";
import HistogramGroup from "@/components/InfoChart/ClueHistogramGroup.vue";
export default {
  name: "clueAnalysis",
  components: { Histogram, HistogramGroup },
  data() {
    return {
      queryParams: {
        round: "",
        session: null,
        name: "",
        first:"",
        year:''
      },
      // rounds: [],
      sessions: [],
      years: [],
      firstList: [],
      labelList: [],
      searchUnits: [],
      // 图表类型标识
      chartFlag: 0,
      colorList: [
        "#FFAD5F",
        "#BBD85A",
        "#77BA33",
        "#CCCCFF",
        "#CCCC33",
        "#660033",
        "#5b8ff9",
        "#5ad8a6",
        "#5d7092",
      ],
      colorList1: [
        "#5B8FF9",
        "#5D7092",
        "#5AD8A6",
        "#CCCCFF",
        "#CCCC33",
        "#660033",
        "#5b8ff9",
        "#5ad8a6",
        "#5d7092",
      ],
    };
  },
  mounted() {
    this.init();
    this.initChartMap();
    // this.queryParams.session = 1;
  },
  watch: {
    "queryParams.session"(newval) {
      if (newval != null && newval != "") {
        // this.$get("/inspection/patrol/getRound", {
        //   session: newval,
        // }).then((r) => {
        //   if (r.data.code == 20000) {
        //     this.rounds = r.data.data;
        //     // console.log("轮次：",this.rounds);
        //   }
        // });
        this.initHistogram(this.chartFlag);
        this.initLineChart();
      } else {
        // this.rounds = [];
      }
    },
    "queryParams.round"(newval) {
      if (this.queryParams.session != "") {
        this.initHistogram(this.chartFlag);
      }
    },
    "queryParams.first"(val) {
      if (
        (this.queryParams.session != "" || this.queryParams.round != "") &&
        this.queryParams.year == ""
      ) {
        this.initHistogram(this.chartFlag);
      } else if (this.queryParams.year != "") {
        this.initHistogramByYear(this.chartFlag);
      }
      if (val == "" && this.queryParams.year == "") {
        this.initHistogram(this.chartFlag);
      }
    },
    "queryParams.name"(val) {
      this.initHistogram(this.chartFlag);
    },
    "queryParams.year"(val) {
      if (val != "") {
        this.initHistogramByYear(this.chartFlag);
      } else if (val == "" && this.queryParams.year == "") {
        this.initHistogram(this.chartFlag);
      }else if(val == "" && this.queryParams.year !=""){
        this.initHistogramByYear(this.chartFlag);
      }
    },
  },
  computed: {
    ...mapState({
      rounds: state => state.totalData.rounds,
      // searchGroups: state => state.totalData.searchGroups,
    })
  },
  methods: {
    //计算百分比
    // getPercent(num, total) {
    //   num = parseFloat(num);
    //   total = parseFloat(total);
    //   if (isNaN(num) || isNaN(total)) {
    //     return "-";
    //   }
    //   return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0;
    // },
    ...mapMutations({
      setclueBarGraphData: "graph/setclueBarGraphData",
      setclueLineData: "graph/setclueLineData",
    }),
    // 切换柱状图、折线图  flag == 0 柱状图  flag == 1 折线图
    changeChart(flag) {
      this.chartFlag = flag;
      this.initHistogram(flag);
    },
    //根据年 来画图
    initHistogramByYear(flag) {
      let optionsData = {
        type: flag,
        title: "线索办理智能分析(一级分类)",
        legendData: [],
        xData: [],
        seriesData: [],
      };
      this.$get("/inspection/clue/analysis", {
        year: this.queryParams.year,
        lableid: this.queryParams.first,
      }).then((r) => {
        let analysisData = r.data.data;
        //数据数量
        let len = analysisData.length;
        // 线索类别
        for (let i = 0; i < len; i++) {
          if (optionsData.xData.indexOf(analysisData[i].result) == -1) {
            optionsData.xData.push(analysisData[i].result);
          }
        }
        let obj = {
          name: "数量",
          color: this.colorList[1],
          data: [],
        };
        // x轴数据和鼠标移入详细信息显示
        optionsData.xData.forEach((item, index) => {
          for (let i = 0; i < len; i++) {
            if (item == analysisData[i].result) {
              //   let percent = this.getPercent(analysisData[i].nums, total);
              obj.data[index] = Number(analysisData[i].nums);
            }
          }
        });
        optionsData.seriesData.push(obj);
        this.setclueBarGraphData(optionsData);
      });
    },
    // 构造图表数据，通过store传入图表组件中
    initHistogram(flag) {
      let optionsData = {
        type: flag,
        title: "线索办理智能分析(一级分类)",
        legendData: [],
        xData: [],
        seriesData: [],
      };
      let total = 0; //总数
      // await this.$post("inspection/clue/counts", {
      //   session: this.queryParams.session,
      //   round: this.queryParams.round,
      //   firstid: this.queryParams.first,
      // }).then((r) => {
      //   if (r.data.code === 20000) {
      //     const data = r.data.data;
      //     total = data.nums;
      //   }
      // });
      this.$post("/inspection/clue/analysis", {
        session: this.queryParams.session,
        round: this.queryParams.round,
        lableid: this.queryParams.first,
        unitName: this.queryParams.name,
      }).then((r) => {
        if (r.data.code === 20000) {
          if (this.queryParams.round == "") {
            let analysisData = r.data.data;
            console.log("----analysisData", analysisData);
            //数据数量
            let len = analysisData.length - 1;
            // 线索类别
            for (let i = 0; i < len; i++) {
              if (
                optionsData.legendData.indexOf(analysisData[i].result) == -1
              ) {
                optionsData.legendData.push(analysisData[i].result);
              }
            }
            //轮次

            let rounds = analysisData[analysisData.length - 1].rounds;
            if (rounds !== undefined) {
              rounds.forEach((item) => {
                optionsData.xData.push("第" + item + "轮");
              });

              // x轴数据和鼠标移入详细信息显示
              optionsData.legendData.forEach((item, index) => {
                let obj = {
                  name: item,
                  color: this.colorList[index],
                  data: [],
                };
                for (let i = 1; i <= rounds.length; i++) {
                  obj.data.push(0);
                }
                for (let i = 1; i <= rounds.length; i++) {
                  for (let j = 0; j < len; j++) {
                    if (
                      i == analysisData[j].round &&
                      item == analysisData[j].result
                    ) {
                      // let percent = this.getPercent(
                      //   analysisData[j].nums,
                      //   total
                      // );
                      obj.data[i - 1] = Number(analysisData[j].nums);
                    }
                  }
                }
                optionsData.seriesData.push(obj);
              });
            }
            console.log("optionsData----", optionsData);
            this.setclueBarGraphData(optionsData);
          } else if (
            this.queryParams.session != "" &&
            this.queryParams.round == ""
            // this.queryParams.first != ""
          ) {
            let analysisData = r.data.data;
            console.log("----analysisData", analysisData);
            //数据数量
            let len = analysisData.length - 1;
            // 线索类别
            for (let i = 0; i < len; i++) {
              if (
                optionsData.legendData.indexOf(analysisData[i].result) == -1
              ) {
                optionsData.legendData.push(analysisData[i].result);
              }
            }
            //轮次

            let rounds = analysisData[analysisData.length - 1].rounds;
            if (rounds !== undefined) {
              rounds.forEach((item) => {
                optionsData.xData.push("第" + item + "轮");
              });

              // x轴数据和鼠标移入详细信息显示
              optionsData.legendData.forEach((item, index) => {
                let obj = {
                  name: item,
                  color: this.colorList[index],
                  data: [],
                };
                for (let i = 1; i <= rounds.length; i++) {
                  obj.data.push(0);
                }
                for (let i = 1; i <= rounds.length; i++) {
                  for (let j = 0; j < len; j++) {
                    if (
                      i == analysisData[j].round &&
                      item == analysisData[j].result
                    ) {
                      // let percent = this.getPercent(
                      //   analysisData[j].nums,
                      //   total
                      // );
                      obj.data[i - 1] = Number(analysisData[j].nums);
                    }
                  }
                }
                optionsData.seriesData.push(obj);
              });
              this.setclueBarGraphData(optionsData);
            }
          } else if (
            //届次 轮次 都有
            this.queryParams.session != "" &&
            this.queryParams.round != ""
          ) {
            let analysisData = r.data.data;
            console.log("----analysisData", analysisData);
            //数据数量
            let len = analysisData.length;
            // 线索类别
            for (let i = 0; i < len; i++) {
              if (optionsData.xData.indexOf(analysisData[i].result) == -1) {
                optionsData.xData.push(analysisData[i].result);
              }
            }
            let obj = {
              name: "数量",
              color: this.colorList[1],
              data: [],
            };
            // x轴数据和鼠标移入详细信息显示
            optionsData.xData.forEach((item, index) => {
              for (let i = 0; i < len; i++) {
                if (item == analysisData[i].result) {
                  // let percent = this.getPercent(analysisData[i].nums, total);
                  obj.data[index] = Number(analysisData[i].nums);
                }
              }
            });
            optionsData.seriesData.push(obj);
            this.setclueBarGraphData(optionsData);
          }
        }
      });
    },
    async initLineChart() {
      let LineChartData = [];
      let total = 0; //总数
      let nameArr = [];
      let labelNameArr = [];
      try {
        let counts = await this.$post("inspection/clue/counts", {
          session: this.queryParams.session,
          // round: this.queryParams.round,
          // firstid: this.queryParams.first,
        });
        total = counts.data.data.nums;

        let analysis = await this.$post("/inspection/clue/analysis", {
          session: this.queryParams.session,
          // round: this.queryParams.round,
          // lableid: this.queryParams.first,
        });
        console.log(analysis);
        if (analysis.data.code === 20000) {
          let analysisData = analysis.data.data;
          //数据数量
          let len = analysisData.length - 1;
          let obj = {
            name: "",
            id: "",
          };
          //获取一级标签或二级标签 name和id
          for (let i = 0; i < len; i++) {
            if (nameArr.indexOf(analysisData[i].result) == -1) {
              nameArr.push(analysisData[i].result);
              obj.name = analysisData[i].result;
              obj.id = analysisData[i].category;
              labelNameArr.push(this.$_.cloneDeep(obj));
            }
          }
        }

        for (let i = 0; i < labelNameArr.length; i++) {
          let optionsData = {
            type: 0,
            title: "线索办理智能分析(二级分类)",
            name: "",
            labelId: "",
            legendData: [],
            xData: [],
            seriesData: [],
          };
          let detaildata = await this.$post("/inspection/clue/analysis", {
            session: this.queryParams.session,
            lableid: labelNameArr[i].id,
          });
          let detailData = detaildata.data.data;
          let length = detailData.length - 1;
          //标签name和id
          optionsData.name = labelNameArr[i].name;
          optionsData.labelId = labelNameArr[i].id;
          // 线索类别
          for (let i = 0; i < length; i++) {
            if (optionsData.legendData.indexOf(detailData[i].result) == -1) {
              optionsData.legendData.push(detailData[i].result);
            }
          }
          //轮次
          let rounds = detailData[detailData.length - 1].rounds;
          if (rounds !== undefined) {
            rounds.forEach((item) => {
              optionsData.xData.push("第" + item + "轮");
            });

            // x轴数据和鼠标移入详细信息显示
            optionsData.legendData.forEach((item1, index) => {
              let obj = {
                name: item1,
                color: this.colorList1[index],
                data: [],
              };
              for (let i = 1; i <= rounds.length; i++) {
                obj.data.push(0);
              }
              for (let i = 1; i <= rounds.length; i++) {
                for (let j = 0; j < length; j++) {
                  if (
                    i == detailData[j].round &&
                    item1 == detailData[j].result
                  ) {
                    // let percent = this.getPercent(detailData[j].nums, total);
                    obj.data[i - 1] = Number(detailData[j].nums);
                  }
                }
              }
              optionsData.seriesData.push(obj);
            });
            LineChartData.push(optionsData);
          }
        }

        console.log("------LineChartData", LineChartData);
        if (LineChartData.length > 0) {
          this.setclueLineData(LineChartData);
        } else {
          this.$message.warning("当前届次没有智能分析");
        }
      } catch (error) {
        this.$message.error("获取数据失败");
      }
    },
    init() {
      //获取届次
      this.$get("/inspection/patrol/getSession").then((r) => {
        if (r.data.code == 20000) {
          this.sessions = r.data.data;
          this.queryParams.session = this.sessions[this.sessions.length - 1].session;
        }
      });
      //获取分类标签
      this.$get("/inspection/t-label/getResult", {
        current: 1,
        size: 1000,
        labletype: 4,
      }).then((r) => {
        if (r.data.code == 20000) {
          this.labelList = r.data.data.records;
          this.labelList.forEach((item, index) => {
            let obj = {
              id: item.id,
              result: item.result,
            };
            this.firstList.push(obj);
          });
        }
      });
      //获取年度
      this.$get("/inspection/patrol/getYear").then((r) => {
        if (r.data.code == 20000) {
          this.years = r.data.data;
        }
      });
      //获取巡察单位
      this.$get("/inspection/patrol/getUnit", {}).then((r) => {
        if (r.data.code == 20000) {
          this.searchUnits = r.data.data;
        }
      });
    },

    // 地图数据
    initChartMap() {
      // 测试加载地图
      let center = {
        "禄口街道": [1083.147094726562727, -711.15118408203125],
        "湖熟街道": [1086.83392333984375, -710.01239013671875],
        "汤山街道": [1088.001525878906705, -706.231689453125],
        "淳化街道": [1088.525878906250455, -708.909484863281136],
        "东山街道": [1086.094299316406477, -704.667724609375],
        "麒麟街道": [1084.527709960937727, -704.897277832031364],
        "秣陵街道": [1085.1790771484375, -706.01300048828125],
        "谷里街道": [1081.742086032627185, -708.557345834173361],
        "江宁街道": [1075.741882324219205, -712.6304931640625],
        "横溪街道": [1084.28387451171875, -715.95867919921875],
      }
      let chartMap = this.$echarts.init(document.getElementById("chart_map1"))
      let option = null
      this.$getLocal('/static/json/jnall.json').then(data => {
        let geojson = data.data
        this.$echarts.registerMap('jn', geojson);
        option = {
          visualMap: {
            show: false,
            max: 100,
            seriesIndex: [3],
            inRange: {
              color: ['#A5DCF4', '#006edd']
            }
          },
          geo: [{
            map: 'jn',
            roam: false, //是否允许缩放
            zoom: 1.1, //默认显示级别
            scaleLimit: {
              min: 0,
              max: 3
            }, //缩放级别
            itemStyle: {
              normal: {
                areaColor: '#013C62',
                shadowColor: '#013C62',
                shadowBlur: 20,
                shadowOffsetX: -5,
                shadowOffsetY: 15,
              }
            },
            tooltip: {
              show: false
            }
          }],
          series: [{
            type: 'effectScatter',
            coordinateSystem: 'geo',
            z: 5,
            data: [],
            symbolSize: 14,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return '{fline|地点：' + params.data.city + '}\n{tline|' + (params.data.info || '发生xx集件') + '}';
                },
                position: 'top',
                backgroundColor: 'rgba(254,174,33,.8)',
                padding: [0, 0],
                borderRadius: 3,
                lineHeight: 32,
                color: '#f7fafb',
                rich: {
                  fline: {
                    padding: [0, 10, 10, 10],
                    color: '#ffffff'
                  },
                  tline: {
                    padding: [10, 10, 0, 10],
                    color: '#ffffff'
                  }
                }
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              color: '#feae21',
            }
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            z: 5,
            data: [],
            symbolSize: 14,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return '{fline|地点：' + params.data.city + '}\n{tline|' + (params.data.info || '发生xx集件') + '}';
                },
                position: 'top',
                backgroundColor: 'rgba(233,63,66,.9)',
                padding: [0, 0],
                borderRadius: 3,
                lineHeight: 32,
                color: '#ffffff',
                rich: {
                  fline: {
                    padding: [0, 10, 10, 10],
                    color: '#ffffff'
                  },
                  tline: {
                    padding: [10, 10, 0, 10],
                    color: '#ffffff'
                  }
                }
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              color: '#e93f42',
            }
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            z: 5,
            data: [],
            symbolSize: 14,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return '{fline|地点：' + params.data.city + '}\n{tline|' + (params.data.info || '发生xx集件') + '}';
                },
                position: 'top',
                backgroundColor: 'rgba(8,186,236,.9)',
                padding: [0, 0],
                borderRadius: 3,
                lineHeight: 32,
                color: '#ffffff',
                rich: {
                  fline: {
                    padding: [0, 10, 10, 10],
                    color: '#ffffff'
                  },
                  tline: {
                    padding: [10, 10, 0, 10],
                    color: '#ffffff'
                  }
                }
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              color: '#08baec',
            }
          },
          //地图
          {
            type: 'map',
            mapType: 'jn',
            geoIndex: -1,
            zoom: 1.1, //默认显示级别
            label: {
              show: true,
              color: '#ffffff',
              emphasis: {
                color: 'white',
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#2980b9',
                borderWidth: 1,
                areaColor: '#12235c'
              },
              emphasis: {
                areaColor: '#FA8C16',
                borderWidth: 0,
                color: 'green'
              }
            },
            data: Object.keys(center).map(name => {
              return {
                name: name,
                value: Math.random() * 100
              }
            })
          }
          ]
        };
        chartMap.setOption(option);
      });
      let cityIndex = 0
      var timer = setInterval(() => {
        //数据情况重绘，清除formatter移动效果，也可根据自身需求是否需要，删除这两行代码
        /*option.series[seriesjson[runidx].createType-1].data = [];
        myChart.setOption(option, true);*/
        for (var i = 0; i < 3; i++) {
          option.series[i].data = [];
        }
        var runidx = Math.floor(Math.random() * 3);
        var coordCity = Object.keys(center)[cityIndex];
        cityIndex = cityIndex + 1 >= 10 ? 0 : cityIndex + 1
        var coord = center[coordCity];
        option.series[runidx].data = [{
          city: coordCity,
          value: coord
        }];
        // console.log(option.series[runidx].data)
        // option.series[4].data = option.series[4].data.sort(function(a,b){
        //     return b.value-a.value;
        // });
        chartMap.setOption(option, true);
      }, 3000);

      chartMap.on('click', function (params) {
        console.log(params);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.fa {
  overflow: hidden;
}
.top-box {
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
}
.main {
  width: 100%;
  // height: 1000px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .left {
    width: 48%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    .chart_map {
      width: 70%;
      height: 280px;
      // border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
      // display: flex;
      // justify-content: center;

      #chart_map1 {
        width: 100%;
        height: 100%;
      }
    }

    .chartBox {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 450px;
      width: 700px;
      margin-top: 25px;
    }
  }
  .right {
    width: 48%;
  }
  // display: flex;
  // flex-direction: row;
  // width: 100%;
  // height: 1000px;
  // .left {
  //   width: 800px;
  // }
  // .right {
  //   width: 800px;
  // }
}
.sel {
  display: inline-block;
  text-align: left;
}
.sel > .el-select {
  margin-bottom: 5px;
  width: 150px;
}
// 左下方柱状图
.his_chart {
  // box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.1);
  height: 435px;
}
.chart_box {
  // width: 95%;
  width: 600px;
  // height: 500px;
  // border: 1px solid #ccc;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  // 图表区域
  .district_chart {
    width: 95%;
    height: 95%;
  }

  // 按钮
  .chart_operation {
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;

    .chart_btn {
      width: 85px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border: 1px solid #aaa;
      border-radius: 25px;

      &:hover {
        cursor: pointer;
      }
    }

    .btn_active {
      color: #fff;
      background: rgba(0, 143, 255, 0.8);
      border: none;
    }
  }
}
</style>