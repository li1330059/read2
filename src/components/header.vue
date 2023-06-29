<template>
  <div class="title">
    {{ title }}
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({ title: { type: String, default: "" } });
</script>
<style scoped>
.title {
  width: 100%;
  height: 64px;
  text-align: center;
  line-height: 64px;
  background: #1677fe;
  color: #ffffff;
  font-size: 17px;
}
</style>