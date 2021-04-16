<template>
  <div style="width: 100%; height: 100%">
    <div id="model_box">
      <div class="title">
        <!-- <div class="icon_box">
          <img :src="url" />
        </div> -->
        <img :src="url"/>
        <p>基层工作巡察系统</p>
      </div>
      <ul>
        <li
          v-for="(item, index) in modelList"
          :key="index"
          @click="enter(item)"
        >
          <div class="img_box">
            <img :src="item.img"/>
          </div>
          <div class="text_box">
            {{ item.title }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: require("@/assets/model/logo.png"),
      modelList: [
        {
          img: require("../../assets/model/1.png"),
          title: "巡察对象",
        },
        {
          img: require("../../assets/model/2.png"),
          title: "操作指引",
        },
        {
          img: require("../../assets/model/result.png"),
          title: "成果应用",
        },
        {
          img: require("../../assets/model/4.png"),
          title: "巡察整改",
        },
        {
          img: require("../../assets/model/5.png"),
          title: "队伍建设",
        },
        {
          img: require("../../assets/model/6.png"),
          title: "主体建设",
        },
        {
          img: require("../../assets/model/7.png"),
          title: "制度文献",
        },
      ],
    };
  },
  methods: {
    enter(item) {
      if (item.title === "成果应用") {
        this.$router.push("/dashboard");
      }
    },
  },
};
</script>

