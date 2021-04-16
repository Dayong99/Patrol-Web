const state = {
  // 问题清单 区级 柱状图数据
  disBarGraphData: null,
  // 问题清单 村级  柱状图数据
  vilBarGraphData: null,
  // 线索 柱状图数据
  clueData:null,

  // 问题清单 折线图
  disLineData: null,

  //线索智能分析  折线图图数据
  clueLineData:null,
  //线索智能分析  柱状图数据
  clueBarGraphData:null,

  //问题智能分析  折线图图数据
  issusLineData:null,
  //问题智能分析  柱状图数据
  issusBarGraphData:null,

  clueTitle:null,

  // 批量导入压缩文件对话框
  importRarDialog: {
    isVisible: false,
    title: "导入压缩文件",
    type: null,
  },
  // 批量导入文件对话框
  importFileDialog: {
    isVisible: false,
    title: "导入文件",
    type: null,
  },
  // 导入文件后通知刷新
  refreshList: {
    inspectionRefresh: false,
    districtRefresh: false,
    villageRefresh: false,
    clueRefresh: false,
    specialRefresh: false,
    correctIndexRefresh: false,
    correctCheckRefresh: false,
    suggestRefresh: false,
  }
}

const mutations = {
  setDisBarGraphData(state, val) {
    state.disBarGraphData = val
  },
  setVilBarGraphData(state,val){
    state.vilBarGraphData = val
  },
  setClueData(state, val){
    state.clueData = val
  },
  setDisLineData(state, val) {
    state.disLineData = val
  },
  setclueLineData(state,val){
    state.clueLineData = val
  },
  setclueBarGraphData(state,val){
    state.clueBarGraphData = val
  },
  setIssusLineData(state,val){
    state.issusLineData = val
  },
  setIssusBarGraphData(state,val){
    state.issusBarGraphData = val
  },
  setImportRarDialog(state, val) {
    state.importRarDialog = val
  },
  setImportFileDialog(state, val) {
    state.importFileDialog = val
  },
  setRefreshList(state, val) {
    let object = state.refreshList
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        if(key == Object.keys(val)[0]) {
          object[key] = val[key]
        }
      }
    }
  },
  // 重置刷新通知
  reSetList(state) {
    let object = state.refreshList
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        object[key] = false
      }
    }
  }
}


export default {
  namespaced: true,
  state,
  mutations,
}