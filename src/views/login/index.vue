<template>
  <div class="login-container">
    <div class="login-box" v-show="loginShow">
      <!-- 登录 -->
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        autocomplete="off"
        label-position="left"
      >
        <div class="title-container">
          <img src="@/assets/model/logo.png" />
          <h3 class="title">{{ $t("login.title") }}</h3>
          <!-- <lang-select class="set-language" /> -->
        </div>
        <div class="login_content">
          <div class="login-item">
            <i class="el-icon-user"></i>
            <el-form-item prop="username">
              <el-input
                ref="username"
                v-model="loginForm.username"
                :placeholder="$t('login.username')"
                name="username"
                type="text"
                autocomplete="off"
                @keyup.enter.native="handleLogin"
                clearable
              />
            </el-form-item>
          </div>
          <div class="login-item">
            <i class="el-icon-key"></i>
            <el-form-item prop="password">
              <el-input
                ref="password"
                v-model="loginForm.password"
                type="password"
                :placeholder="$t('login.password')"
                name="password"
                autocomplete="off"
                :show-password="true"
                @keyup.enter.native="handleLogin"
                clearable
              />
            </el-form-item>
          </div>

          <el-button type="primary" @click.native.prevent="handleLogin"
            >登 录</el-button
          >
        </div>
      </el-form>
    </div>
    <span class="login-footer">
      © 2021
      <a target="_blank" href="#"></a>
    </span>
  </div>
</template>

<script>
import LangSelect from "@/components/LangSelect";
import db from "@/utils/localstorage";
import { randomNum } from "@/utils";
import axios from "axios";
import { socialLoginUrl } from "@/settings";

export default {
  name: "Login",
  components: { LangSelect },
  data() {
    return {
      classList: [],
      loginShow: true,
      studentShow: false,

      teacherShow: false,
      tabActiveName: "bindLogin",
      codeUrl: `${process.env.VUE_APP_BASE_API}auth/captcha`,
      socialLoginUrl: socialLoginUrl,
      login: {
        type: "up",
      },
      logo: [
        { img: "gitee.png", name: "gitee", radius: true },
        { img: "github.png", name: "github", radius: true },
        { img: "tencent_cloud.png", name: "tencent_cloud", radius: true },
        { img: "qq.png", name: "qq", radius: false },
        { img: "dingtalk.png", name: "dingtalk", radius: true },
        { img: "microsoft.png", name: "microsoft", radius: false },
      ],
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur",
        },
        password: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur",
        },
        code: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur",
        },
      },
      authUser: null,
      loginLoading: false,
      registerLoading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      randomId: randomNum(24, 16),
      imageCode: "",
      page: {
        width: window.screen.width * 0.5,
        height: window.screen.height * 0.5,
      },

    };
  },
  mounted() {
    db.clear();
    // this.getCodeImage();
  },
  destroyed() {
    window.removeEventListener("message", this.resolveSocialLogin);
  },
  methods: {
    // 班级
    getClass() {
      this.$get("case/user/showCalss").then((r) => {
        if (r.data.code === 20000) {
          this.classList = r.data.data;
        }
      });
    },


    resolveLogo(logo) {
      // return require(`@/assets/logo/${logo}`);
    },
    handleLogin() {
      //  this.$post("/login", {
      //       username: this.loginForm.username,
      //       password: this.loginForm.password,
      //     }).then((r)=>{
      //       console.log(r)
      //     })
      // this.$store.commit("account/setUser", {
      //   position:'管理员'
      // });
      // this.$router.push("/model");


      let username_c = false;
      let password_c = false;
      let code_c = false;
      this.$refs.loginForm.validateField("username", (e) => {
        if (!e) {
          username_c = true;
        }
      });
      this.$refs.loginForm.validateField("password", (e) => {
        if (!e) {
          password_c = true;
        }
      });
      this.$refs.loginForm.validateField("code", (e) => {
        if (!e) {
          code_c = true;
        }
      });
      if (this.loginShow) {
        if (username_c && password_c) {
          // this.loginLoading = true;
          // this.registerLoading = false;
          const that = this;
          this.$post("/login", {
            username: that.loginForm.username,
            password: that.loginForm.password,
          })
            .then((r) => {
              // this.loginLoading = false;
              if (r.data.code === 20000) {
                const data = r.data.data
                let user = data.user
                user["role"] = data.role[0]
                // this.$store.commit("account/setUser", {
                //   position:'管理员'
                // });

                // this.$router.push("/model");
                this.getUserDetailInfo(user)

                // this.$router.push("/dashboard");


              }
              // if (r.data.code === 800) {
              //   this.$message.error(r.data.message);
              // } else {
              //   // location.reload()
              //   const data = r.data.data;
              //   this.$store.commit("account/setPosition", data.user.position);

              //   this.getUserDetailInfo(data.user);
              // }

              // this.loginSuccessCallback();
            })
            .catch((error) => {
              this.$message.error("用户名或密码错误")
            });
        }
      }
    },
    saveLoginData(data) {
      this.$store.commit("account/setAccessToken", data.token);
      // this.$store.commit("account/setAccessToken", data.access_token);
      // this.$store.commit("account/setRefreshToken", data.refresh_token);
      const current = new Date();
      const expireTime = current.setTime(
        current.getTime() + 1000 * data.expires_in
      );
      this.$store.commit("account/setExpireTime", expireTime);
    },
    getUserDetailInfo(user) {
      this.$store.commit("account/setUser", user);
      this.$message({
        message: this.$t("tips.loginSuccess"),
        type: "success",
      });
      // this.$router.push("/dashboard");
      this.$router.push("/model");
    }
  },
};
</script>

<style lang="scss">
@import "login";
</style>
<style lang="scss" scoped>
@import "login-scoped";
.login-item {
  /deep/ .el-input__inner {
    caret-color: #fff;
  }
}
</style>
