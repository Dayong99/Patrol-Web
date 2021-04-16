const state = {
  /**
   * 巡察办默认条件    轮次、组
   */
  // 轮次， 需求最多16轮
  rounds: [{
    label: '第1轮',
    value: 1,
  }, {
    label: '第2轮',
    value: 2,
  }, {
    label: '第3轮',
    value: 3,
  }, {
    label: '第4轮',
    value: 4,
  }, {
    label: '第5轮',
    value: 5,
  }, {
    label: '第6轮',
    value: 6,
  }, {
    label: '第7轮',
    value: 7,
  }, {
    label: '第8轮',
    value: 8,
  }, {
    label: '第9轮',
    value: 9,
  }, {
    label: '第10轮',
    value: 10,
  }, {
    label: '第11轮',
    value: 11,
  }, {
    label: '第12轮',
    value: 12,
  }, {
    label: '第13轮',
    value: 13,
  }, {
    label: '第14轮',
    value: 14,
  }, {
    label: '第15轮',
    value: 15,
  }, {
    label: '第16轮',
    value: 16,
  }, {
    label: '第17轮',
    value: 17,
  }, {
    label: '第18轮',
    value: 18,
  }],
  // 巡察组， 需求最多6组 外加专项组
  searchGroups: [{
    label: '第1组',
    value: 1,
  }, {
    label: '第2组',
    value: 2,
  }, {
    label: '第3组',
    value: 3,
  }, {
    label: '第4组',
    value: 4,
  }, {
    label: '第5组',
    value: 5,
  }, {
    label: '第6组',
    value: 6,
  }, {
    label: '第7组',
    value: 7,
  }, {
    label: '第8组',
    value: 8,
  }, {
    label: '专项组',
    value: 999,
  }],
}

const mutations = {
  
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
