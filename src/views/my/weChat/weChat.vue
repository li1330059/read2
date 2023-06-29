<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div id="" style="height: 100vh; background-color: #f7f7f7">
      <Title></Title>
      <div
        style="
          width: 98%;
          margin: 0 auto;
          box-shadow: 0 0 0.5em #ddd;
          border-radius: 0.5em;
          padding-left: 10px;
          padding-top: 10px;
          padding-bottom: 10px;
        "
        class="bg-white"
      >
        <div
          id=""
          class="text font-bold text-center line-height"
          style="
            padding: 5px;
            margin-top: 10px;
            margin-right: 10px;
            background-color: #f7f7f7;
          "
        >
          微信登录
        </div>

        <div id="" class="line-height">使用微信的方式登录</div>
        <div
          class="font-bold text-center"
          style="
            background-color: #66afe9;
            color: white;
            width: 99%;
            padding: 5px;
            border-radius: 0.3em;
            margin-top: 5px;
          "
          @click="login()"
          :disabled="disabled"
        >
          {{ disabled ? "获取appid中..." : "登录" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { getWxappid } from "../../../api/index";
import { getLocalPid } from "../../../libs/util";
import Title from "../../../components/title.vue";
const isMobile = computed(() => {
  let userAgentInfo = navigator.userAgent;
  let Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  let getArr = Agents.filter((i) => userAgentInfo.includes(i));
  return getArr.length ? true : false;
});
const store = useStore();
const disabled = ref(true);
const pid = getLocalPid();
const wxAppId = computed(() => store.state.wxAppId);
onMounted(() => {
  if (!wxAppId.value) {
    getWxAppIdFn()
      .then(() => {
        disabled.value = false;
      })
      .catch((err) => {
        ElMessage.error(err);
      });
  } else {
    disabled.value = false;
  }
  let urlStr = window.location.href;
  let theRequest = {};
  // 发现url中含有token和userId
  if (urlStr.indexOf("?") != -1) {
    urlStr = urlStr.split("?")[1];
    let strs = urlStr.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
    let msg = JSON.stringify(theRequest);
    ElMessage.success("登录成功");
    localStorage.setItem("ways", "wechat");
    localStorage.setItem("userMes", msg);
    store.commit("login", theRequest);
  }
});
const login = () => {
  // 去授权 然后重定向
  let wxRedirectUrl = "http://read.bluebirdabc.com/readapi/user/wxoauthcb";
  let state = pid + ":" + wxAppId.value + ":" + window.location.href;
  window.location.href =
    "https://open.weixin.qq.com/connect/oauth2/authorize" +
    "?appid=" +
    wxAppId.value +
    "&redirect_uri=" +
    wxRedirectUrl +
    "&response_type=code" +
    "&scope=snsapi_userinfo" +
    "&state=" +
    state +
    "#wechat_redirect";
};

const getWxAppIdFn = () => {
  disabled.value = true;
  return new Promise((resolve, reject) => {
    getWxappid({ pid: getLocalPid() })
      .then((res) => {
        console.log(res);
        let msg = res.data;
        if (msg.code === 0) {
          resolve();
          store.commit("saveAppId", msg.data.wxAppId);
        } else {
          reject(msg.msg);
        }
      })
      .catch(() => {
        reject("请求appid失败");
      });
  });
};
</script>

<style scoped lang="less">
.container {
  .text {
    margin-bottom: 0.5em;
    padding: 0.3em 0;
    font-size: 17px;
    font-weight: bold;
    background-color: #f5f5f5;
    border-radius: 0.1em;
  }
  .line-height {
    line-height: 24px;
  }

  input,
  button,
  select {
    border: 1px solid #ddd;
    border-radius: 0.3em;
    outline: 0;
    padding: 0.5em 0.5em;
    background-color: white;
    color: #555;
    font-size: 1em;
  }
  .active {
    box-shadow: 0.1px 0.1px 4px 0.5px rgba(49, 142, 253, 0.4);
  }
}
.containerPc {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  background: url(http://localhost:8080/img/56.c6a378cc.png) no-repeat;
  background-size: 100% 100%;
  > div {
    width: 750px !important;
    height: 80% !important;
    .position-fiexd {
      position: static;
      /deep/ .position-relative {
        padding: 0 !important;
      }
    }
    .bg-white {
      width: 100% !important;
      border-radius: 0 !important;
    }
  }
  .text {
    margin-bottom: 0.5em;
    padding: 0.3em 0;
    font-size: 17px;
    font-weight: bold;
    background-color: #f5f5f5;
    border-radius: 0.1em;
  }
  .line-height {
    line-height: 24px;
  }

  input,
  button,
  select {
    border: 1px solid #ddd;
    border-radius: 0.3em;
    outline: 0;
    padding: 0.5em 0.5em;
    background-color: white;
    color: #555;
    font-size: 1em;
  }
  .active {
    box-shadow: 0.1px 0.1px 4px 0.5px rgba(49, 142, 253, 0.4);
  }
}
</style>
