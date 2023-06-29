<template>
  <div
    class="position-fiexd position-relative"
    id="source1"
    style="z-index: 10; display: flex; align-items: center"
    :style="'top:' + top + ';left:' + left + ';'"
    @click.stop="jumpToLiveClass"
  >
    <img src="../../../assets/help.png" style="" />
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";
import { useStore } from "vuex";
import { getLocalPid } from "../../../libs/util";
const props = defineProps({
  articleId: {
    type: [String, Number],
    default: "",
  },
});
// let isDragging = false;
// let diffX = 0;
// let diffY = 0;
const top = ref("40%");
const left = ref("55%");
const articleId = ref(props.articleId);
const pid = getLocalPid();
const store = useStore();
const token = computed(() => store.state.token);
const userId = computed(() => store.state.userId);
const sign = computed(() => store.state.sign);
const jumpToLiveClass = () => {
  location.href = `https://readapi.bluebirdabc.com/lessondemo/index.html#/?userId=${userId.value}&token=${token.value}&sign=${sign.value}&pid=${pid}&articleId=${articleId.value}`;
};
// const dragStart = (e) => {
//   e.preventDefault();
//   isDragging = true;
//   let ele = document.getElementById("source1");
//   if (e.type == "touchstart") {
//     let _e = e.changedTouches[0];
//     diffX = _e.clientX - ele.offsetLeft;
//     diffY = _e.clientY - ele.offsetTop;
//   } else if (e.type == "mousedown") {
//     diffX = e.clientX - ele.offsetLeft;
//     diffY = e.clientY - ele.offsetTop;
//   }
// };

// const dragMove = (e) => {
//   if (!isDragging) return;
//   e.preventDefault();
//   if (e.type == "touchmove") {
//     let _e = e.changedTouches[0];
//     left.value = _e.clientX - diffX + "px";
//     top.value = _e.clientY - diffY + "px";
//   } else if (e.type == "mousemove") {
//     left.value = e.clientX - diffX + "px";
//     top.value = e.clientY - diffY + "px";
//   }
// };
// const dragEnd = () => {
//   isDragging = false;
// };
</script>

<style>
</style>
