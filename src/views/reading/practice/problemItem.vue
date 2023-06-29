<template>
  <div
    class="flex"
    style="
      flex-wrap: wrap;
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-top: none;
    "
  >
    <div class="flex-two" style="border: 1px solid #dddddd">
      <div class="flex-1 flex align-center">
        <input
          @change="emit('A')"
          type="radio"
          :name="tag"
          value=""
          style="margin-left: 5px"
        />
        <span style="margin-left: 10px">(A) {{ aProblem[0] }}</span>
      </div>
      <div
        class="flex-1 flex align-center"
        style="padding: 5px; border-left: 1px solid #dddddd"
      >
        <input @change="emit('B')" type="radio" :name="tag" value="" />
        <span style="margin-left: 10px">(B) {{ aProblem[1] }}</span>
      </div>
    </div>

    <div class="flex-two" style="border: 1px solid #dddddd; margin-top: 5px">
      <div class="flex-1 flex align-center">
        <input
          @change="emit('C')"
          type="radio"
          :name="tag"
          value=""
          style="margin-left: 5px"
        />
        <span style="margin-left: 10px">(C) {{ aProblem[2] }}</span>
      </div>
      <div
        class="flex-1 flex align-center"
        style="border-left: 1px solid #ddd; padding: 5px"
      >
        <input @change="emit('D')" type="radio" :name="tag" value="" />
        <span style="margin-left: 10px">(D) {{ aProblem[3] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  tag: {
    type: String,
    default: Math.random() + "",
  },
  aProblem: {
    type: Array,
    default: () => ["", "", "", ""],
  },
  index: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits(["getAns"]);
const emit = (ans) => {
  let obj = {
    index: props.index,
    ans,
  };
  emits("getAns", obj);
};
</script>

<style scoped>
.flex-two {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
