<template>
  <div style="padding: 0 20px 20px">
    <div
      v-for="(item, index) in props.labelList"
      :key="index"
      class="inline-block txt"
      style="margin-right: 5px"
      :style="
        activeLabelIndex == index
          ? 'background-color: #1677fe; border-radius: 5px; color: #ffffff'
          : ''
      "
      @click="changeIndex(index)"
    >
      <div>{{ item.word }}</div>
    </div>
    <div
      v-if="activeLabelIndex !== -1"
      style="background: aliceblue; padding: 5px; margin: 10px 0"
    >
      <div style="margin-top: 3px; margin-bottom: 3px">
        {{ labelList[activeLabelIndex].explain }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
const props = defineProps({
  labelList: {
    type: Array,
    default: () => [],
  },
});
const activeLabelIndex = ref(-1);
const changeIndex = (index) => {
  if (activeLabelIndex.value == index) return (activeLabelIndex.value = -1);
  activeLabelIndex.value = index;
};
</script>

<style scoped>
.txt {
  padding: 5px;
}
</style>
