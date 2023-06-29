<template>
  <div id="" style="height: 100vh; background-color: #f7f7f7">
    <Title></Title>
    <div
      style="
        width: 98%;
        margin: 0 auto;
        margin-top: 55px;
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
        请先指定一位您专属的在线名师
      </div>
      <div id="" style="margin-top: 10px; margin-right: 10px">
        <input
          :class="ac ? 'active' : ''"
          style="width: 100%; padding: 5px; background-color: #ffffff"
          type=""
          name=""
          id=""
          v-model="teacher_id"
          placeholder="请输入名师ID"
          @click="ac = true"
          @blur="ac = false"
        />
      </div>
      <div
        class="font-bold text-center"
        style="
          background-color: #66afe9;
          color: white;
          width: 99.5%;
          padding: 5px;
          border-radius: 0.3em;
          margin-top: 5px;
        "
        @click="getTeacherList()"
      >
        查找名师
      </div>
      <div
        class="font-bold text-center"
        style="
          background-color: #66afe9;
          color: white;
          width: 99.5%;
          padding: 5px;
          border-radius: 0.3em;
          margin-top: 5px;
        "
        @click="allocate"
      >
        自动为我分配名师
      </div>
    </div>
    <div
      style="
        width: 98%;
        margin: 0 auto;
        margin-top: 15px;
        box-shadow: 0 0 0.5em #ddd;
        border-radius: 0.5em;
        padding-left: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
      "
      class="bg-white"
    >
      <div id="" style="height: 10px" v-if="!teacher_msg.data.nickname"></div>
      <div style="padding: 5px" id="" v-else>
        <div
          id=""
          class="flex align-center"
          style="justify-content: space-between"
        >
          <div id="" class="flex align-center">
            <img
              :src="teacher_msg.data.avatar"
              style="
                border-radius: 10px;
                height: 50px;
                width: 50px;
                margin-right: 30px;
              "
            />
            <div id="" style="font-weight: 700; font-size: 18px">
              {{ teacher_msg.data.nickname }}
            </div>
          </div>
          <div
            id=""
            style="
              background-color: #66afe9;
              color: white;
              font-weight: 700;
              width: 80px;
              padding: 5px 10px;
              border-radius: 5px;
              margin-top: 3px;
              margin-right: 10px;
            "
            @click="selectTeacher"
          >
            选定名师
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { reactive, ref, computed } from "vue";
import Title from "../../../components/title.vue";
import { getLocalPid } from "../../../libs/util";
import {
  bizQueryTeacher,
  bizSetTeacher,
  bizAutoSetTeacher,
} from "../../../api/index";
import { ElMessage } from "element-plus";
const store = useStore();

const safeMes = computed(() => store.state.safeMes );
const ac = ref(false);
const teacher_id = "";
const teacher_msg = reactive({ data: {} });

const getTeacherList = () => {
  let obj = {
    ...safeMes.value,
    pid: getLocalPid(),
    teacher_id: teacher_id,
  };
  bizQueryTeacher(encodeURIComponent(JSON.stringify(obj)))
    .then(({ data }) => {
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      if (!data.data.length) {
        return ElMessage.error("名师id不存在哦");
      }
      teacher_msg.data = { ...data.data[0] };
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
const selectTeacher = () => {
  let obj = {
    ...safeMes.value,
    pid: getLocalPid(),
    teacher_id: teacher_msg.data.teacher_id,
  };
  bizSetTeacher(encodeURIComponent(JSON.stringify(obj)))
    .then(({ data }) => {
      console.log(data);
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      window.location.href = data.data;
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
const allocate = () => {
  //
  let obj = {
    ...safeMes.value,
    pid: getLocalPid(),
  };
  bizAutoSetTeacher(encodeURIComponent(JSON.stringify(obj)))
    .then(({ data }) => {
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      window.location.href = data.data;
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
</script>

<style scoped>
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
</style>
