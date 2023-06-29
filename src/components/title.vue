<template>
  <div
    id=""
    class="position-fiexd"
    style="left: 0; top: 0; right: 0; z-index: 12"
    :style="maxW ? 'max-width:' + maxW + 'px;' : ''"
  >
    <div
      id=""
      class="position-relative"
      style="
        height: 45px;
        box-sizing: border-box;
        padding: 2px 3px 0 3px;
        z-index: 12;
      "
    >
      <!-- 标题 -->
      <div
        id=""
        style="background-color: #3982cc"
        class="h-100 w-100 flex align-center justify-center text-white"
      >
        <em style="font-size: 12px; margin-top: 5px; margin-left: 5px">
          {{ userInfo.id ? "ID:" + userInfo.id : "" }}
        </em>
        <span class="font-bold" style="margin: 0 5px; font-size: 16px">
          {{ title }}
        </span>
        <em style="font-size: 12px; margin-top: 3px">
          {{ userInfo.level ? "Level:" + userInfo.level : "" }}
        </em>
      </div>
      <!-- 标题 -->

      <!-- 左边图片 -->
      <div
        v-if="timer"
        id=" "
        style="line-height: 45px"
        class="
          top-0
          left-0
          right-0
          bottom-0
          text-left
          position-absolute
          flex
          align-center
        "
      >
        <img
          class=""
          src="../assets/alarm_clock.png"
          style="width: 25px; height: 25px; margin-left: 10px"
        />
        <div
          style="margin-left: 3px; margin-top: 6px"
          class="text-white font-bold"
        >
          {{ timeFomat }}
        </div>
      </div>
      <!-- 左边图片 -->

      <!-- 右边图片 -->
      <div
        id=" "
        style="line-height: 45px"
        class="top-0 left-0 right-0 bottom-0 text-right position-absolute"
      >
        <img
          @click="doCopy()"
          class=""
          src="../assets/copy_url.png"
          style="
            width: 25px;
            height: 25px;
            margin-top: 10px;
            margin-right: 10px;
          "
        />
      </div>
      <!-- 右边图片 -->
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, computed } from "vue";
import { useStore } from "vuex";
import useClipboard from "vue-clipboard3";
import { ElMessage } from "element-plus";
import { getLocalPid } from "../libs/util";
import { getSitename } from "../api/index";
const props = defineProps({
  timer: {
    type: Number,
    default: 0,
  },
  articleId: {
    type: [String, Number],
    default: "",
  },
});
const { toClipboard } = useClipboard();
const store = useStore();
const timer = ref(props.timer);
const articleId = ref(props.articleId);
const time = ref(0);
let maxW = ref(100000);
const pid = getLocalPid();
const title = computed(() => store.state.title);
const userInfo = computed(() => store.state.userInfo);
const timeFomat = computed(() => {
  if (time.value < 0) {
    return "0:00";
  }
  if (time.value % 60 < 10) {
    return Math.floor(time.value / 60) + " : 0" + (time.value % 60);
  }
  return Math.floor(time.value / 60) + ":" + (time.value % 60);
});
onMounted(() => {
  maxW.value = document.body.clientWidth;
  if (!title.value) getTitle();
  var a = setInterval(() => {
    if (timer.value > 0) {
      time.value = timer.value;
      timerMinus();
      clearInterval(a);
    }
  }, 500);
});
const timerMinus = () => {
  setInterval(() => {
    time.value--;
  }, 1000);
};
const getTitle = () => {
  // 请求title
  setTimeout(() => {
    getSitename({ pid: pid })
      .then((res) => {
        let data = res.data;
        if (data.code === 0) {
          store.commit("getTitle", data.data.siteName);
          localStorage.setItem("title", data.data.siteName);
          document.title = data.data.siteName;
        } else {
          ElMessage.error(data.msg);
        }
      })
      .catch(() => {
        ElMessage.error("标题请求失败");
      });
  }, 500);
};
const doCopy = async () => {
  if (pid) {
    let index = window.location.href.lastIndexOf("/");
    let url = window.location.href.substring(0, index);
    url += "/index?pid=" + pid;
    if (articleId.value) {
      url = window.location.href;
    }
    try {
      await toClipboard(url);
      ElMessage.success("复制地址成功");
    } catch (e) {
      console.log(e);
      ElMessage.success("复制失败");
    }
  } else {
    ElMessage.error("请先获取pid");
  }
};
</script>

<style>
</style>
