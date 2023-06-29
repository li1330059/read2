<template>
  <div>
    <Title></Title>
    <div
      class="text-center font-bold"
      style="padding-top: 100px"
      v-if="!questions.dataValue.length"
    >
      {{ waiting ? "题目获取中..." : "暂时没有题目哦!" }}
    </div>
    <div
      v-if="questions.dataValue.length"
      style="margin: 0 10px 10px 10px; padding-top: 65px"
    >
      <div style="padding-left: 10px">
        <span
          style="color: #333; margin-left: 4px"
          class="font-bold"
          @click="chooseSentence(-1)"
          :class="activeSentenceIndex == -1 ? 'active' : ''"
          v-html="title"
        >
        </span>
      </div>
    </div>
    <div v-for="(item, index) in questions.dataValue" :key="index">
      <div style="margin: 20px 5px 10px 5px; padding: 10px" class="bg-white">
        <div
          style="
            padding: 20px;
            font-size: 10px;
            background-color: #f7f7f7;
            border: 1px solid #ddd;
            line-height: 24px;
          "
          class="font-bold"
          v-html="item.title"
        ></div>

        <!-- 题目 -->
        <problem-item
          :aProblem="[item.selectA, item.selectB, item.selectC, item.selectD]"
          :tag="item.id + ''"
          :index="index"
          @getAns="getAns"
        ></problem-item>
        <div style="padding-top: 10px; padding-left: 10px" v-if="isSubmit">
          <span style="line-height: 24px; color: #333; font-weight: bold">
            您选择的答案：
            {{
              questions.dataValue[index][
                "select" + answerList.dataValue[index].answer
              ]
            }}
            正确答案：
          </span>
          <span
            style="line-height: 24px; color: #333; font-weight: bold"
            :style="
              questions.dataValue[index][
                'select' + answerList.dataValue[index].answer
              ] == questions.dataValue[index].answer
                ? ''
                : 'color:red;'
            "
            >{{ questions.dataValue[index].answer }}</span
          >
          <br />
          <span style="line-height: 24px; color: #333; font-weight: bold"
            >知识点：</span
          >
          <span
            style="line-height: 24px; font-weight: bold"
            v-html="questions.dataValue[index].explanation"
          >
          </span>
        </div>
        <!-- 题目 -->
      </div>
    </div>
    <div
      class="font-bold flex align-center justify-center"
      style="margin-top: 20px"
    >
      <div
        style="
          margin-bottom: 50px;
          padding: 8px 14px;
          border: 1px solid #d3d3d3;
          border-radius: 4px;
        "
        class="bg-white hover"
        @click="backOrSubmit"
        :disabled="disabled"
        v-if="questions.dataValue.length"
      >
        {{ isSubmit ? "下一篇" : "提交" }}
      </div>
      <div
        style="
          margin-bottom: 50px;
          padding: 8px 14px;
          border: 1px solid #d3d3d3;
          border-radius: 4px;
        "
        class="bg-white hover"
        @click="backOrSubmit"
        :disabled="disabled"
        v-if="!questions.dataValue.length"
      >
        返回
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { useStore } from "vuex";
import { questionList, questionSubmit } from "../../../api/index";
import { useRoute, useRouter } from "vue-router";
import problemItem from "./problemItem.vue";
import Title from "../../../components/title.vue";
import { ElMessage } from "element-plus";
const store = useStore();
const route = useRoute();
const router = useRouter();
const safeMes = computed(() => store.state.safeMes);
const activeSentenceIndex = ref(-2);
const questions = reactive({ dataValue: [] });
const answerList = reactive({ dataValue: [] });
const waiting = ref(true);
const disabled = ref(false);
const isSubmit = ref(false);
const title = ref("");
onMounted(() => {
  if (!safeMes.value.sign) store.commit("saveSafeMes");
  title.value = route.params.obj.title;
  getProblems();
});
const chooseSentence = (index) => {
  if (activeSentenceIndex.value == index) {
    return (activeSentenceIndex.value = -2);
  }
  activeSentenceIndex.value = index;
};

const getProblems = () => {
  let obj = {
    ...route.params.obj,
    ...safeMes.value,
  };
  questionList(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      let data = res.data;
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      questions.dataValue = data.data.questions;
      waiting.value = false;
      while (questions.dataValue.length != answerList.dataValue.length) {
        answerList.dataValue.push("");
      }
    })
    .catch(() => {
      waiting.value = false;
      ElMessage.error("获取题目失败");
    });
};

const getAns = (data) => {
  let item = {
    answer: data.ans,
    questionId: questions.dataValue[data.index].id,
  };
  answerList.dataValue.splice(data.index, 1, item);
};
const backOrSubmit = () => {
  disabled.value = true;
  if (!questions.dataValue.length) router.go(-1);
  if (isSubmit.value) {
    store.commit("changeArticle", true);
    router.go(-1);
  } else {
    let index = answerList.dataValue.findIndex((v) => v === "");
    if (index != -1) {
      return ElMessage.warning("请填写所有题目哦");
    }
    let obj = {
      ...safeMes.value,
      articleId: route.params.obj.articleId,
      readLogId: route.params.obj.readLogId,
      answers: answerList.dataValue,
    };
    questionSubmit(encodeURIComponent(JSON.stringify(obj)))
      .then((res) => {
        let data = res.data;
        if (data.code) {
          return store.commit("judgeCode", {
            code: data.code,
            msg: data.msg,
          });
        }
        ElMessage.success("提交成功");
        disabled.value = false;
        isSubmit.value = true;
      })
      .catch(() => {
        disabled.value = false;
        ElMessage.error("提交答案失败");
      });
  }
};
</script>

<style scoped>
.active {
  color: white;
  background-color: #318efd;
}

.hover:hover {
  color: white;
  background-color: #318efd;
}
</style>
