<template>
  <div id="" style="width: 100%">
    <div
      v-if="!src"
      style="padding: 100px; text-align: center; font-weight: bold"
    >
      获取中...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { getLocalPid } from "../../../libs/util";
import { urlGuide } from "../../../api/index";
const store = useStore();
const src = ref("");
const safeMes = computed(() => store.state.safeMes)
onMounted(() => {
  let obj = {
    ...safeMes.value,
    pid: getLocalPid(),
  };
  urlGuide(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      let data = res.data;
      if (data.code)
        return this.$store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });

      src.value = data.data;
      location.href = src.value;
    })
    .catch(() => {
      return ElMessage.error("获取失败");
    });
});
</script>

<style scoped>
img {
  width: 100%;
}
</style>
