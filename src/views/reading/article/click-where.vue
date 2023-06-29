<template>
  <div
    class="position-fiexd position-relative"
    id="source"
    draggable="true"
    @mousedown="dragStart"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @dragstart="dragStart"
    @dragmove="dragMove"
    @dragend="dragEnd"
    @touchstart="dragStart"
    @touchmove="dragMove"
    @touchend="dragEnd"
    @click="jumpToLiveClass"
    style="z-index: 10; display: flex; align-items: center"
    :style="'top:' + top + ';left:' + left + ';'"
  >
    <img src="../../../assets/help.png" style="" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { getLocalPid } from "../../../libs/util";

const pid = getLocalPid();
const store = useStore();
const token = computed(() => store.state.token);
const userId = computed(() => store.state.userId);
const sign = computed(() => store.state.sign);
const getQueryVariable = (variable) => {
  const url = window.location.href;
  const query = url.split("?")[1];
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return false;
};
console.log("getQueryVariable", getQueryVariable("id"));
let isDragging = false;
let diffX = 0;
let diffY = 0;
const top = ref("30%");
const left = ref("55%");
let clickTimeout;
const jumpToLiveClass = () => {
  location.href = `https://readapi.bluebirdabc.com/lessondemo/index.html#/?userId=${
    userId.value
  }&token=${token.value}&sign=${
    sign.value
  }&pid=${pid}&articleId=${getQueryVariable("id")}`;
};
const dragStart = (e) => {
  e.preventDefault();
  isDragging = false;
  clickTimeout = setTimeout(() => {
    isDragging = true;
  }, 200); // 设置一个阈值，例如 200 毫秒
  let ele = document.getElementById("source");
  if (e.type == "touchstart") {
    let _e = e.changedTouches[0];
    diffX = _e.clientX - ele.offsetLeft;
    diffY = _e.clientY - ele.offsetTop;
  } else if (e.type == "mousedown") {
    diffX = e.clientX - ele.offsetLeft;
    diffY = e.clientY - ele.offsetTop;
  }
};

const dragMove = (e) => {
  if (!isDragging) return;
  e.preventDefault();
  if (e.type == "touchmove") {
    let _e = e.changedTouches[0];
    left.value = _e.clientX - diffX + "px";
    top.value = _e.clientY - diffY + "px";
  } else if (e.type == "mousemove") {
    left.value = e.clientX - diffX + "px";
    top.value = e.clientY - diffY + "px";
  }
};
const dragEnd = () => {
  clearTimeout(clickTimeout);
  if (!isDragging) {
    jumpToLiveClass();
  }
  isDragging = false;
};
</script>

<style>
</style>
