<template>
  <div>
    <div
      class="text-center font-bold"
      style="padding-top: 100px"
      v-if="!data.questions.length"
    >
      <span>{{ waiting ? "题目获取中..." : "暂时没有题目哦!" }}</span>
      <button
        v-if="!waiting && !data.questions.length"
        style="margin-left: 10px; padding: 0 10px 0 10px"
        @click="getProblems"
      >
        重试
      </button>
    </div>

    <div
      v-if="data.questions.length"
      style="margin: 0 10px 10px 10px; padding-top: 10px"
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

    <div v-for="(item, index) in data.questions" :key="index">
      <div style="margin: 20px 5px 10px 5px; padding: 10px" class="bg-white">
        <!-- 题目 -->
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
        <problem-item
          :aProblem="[item.selectA, item.selectB, item.selectC, item.selectD]"
          :tag="item.id + ''"
          :index="index"
          @getAns="getAns"
        >
        </problem-item>

        <!-- 答案与解释 -->
        <div style="padding-top: 10px; padding-left: 10px" v-if="isSubmit">
          <span style="line-height: 24px; color: #333; font-weight: bold">
            您的答案： {{ data.answerList[index].answer }}
            <br />
            正确答案：
          </span>
          <span
            style="line-height: 24px; color: #333; font-weight: bold"
            :style="
              data.questions[index]['select' + data.answerList[index].answer] ==
              data.questions[index].answer
                ? ''
                : 'color:red;'
            "
          >
            {{ getCorrectAnswerTag(index) }}
          </span>
          <br />
          <span style="line-height: 24px; color: #333; font-weight: bold"
            >知识点：</span
          >
          <div
            style="line-height: 24px; font-weight: bold; margin-left: 20px"
            v-html="data.questions[index].explanation"
          ></div>
        </div>
        <!-- 答案与解释 -->
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
        @click="submitOrNextArticle"
        :disabled="disabled"
        v-if="data.questions.length"
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
        @click="nextArticle"
        :disabled="disabled"
        v-if="!data.questions.length"
      >
        下一篇
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineProps, ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import {
  questionList,
  articleComplete,
  articleNext,
  questionSubmit,
} from "../../../api/index";
import { getLocalPid } from "../../../libs/util";
import problemItem from "../practice/problemItem.vue";

const store = useStore();
const safeMes = computed(() => store.state.safeMes);
onMounted(() => {
  getProblems();
});
const props = defineProps({
  articleId: { type: [Number, String], default: 0 },
  readLogId: { type: [Number, String], default: 0 },
  timestamp: { type: [Number, String], default: 0 },
});
let isCompleted = false;
const activeSentenceIndex = ref(-2);
const data = reactive({
  questions: [],
  answerList: [],
});
const waiting = ref(true);
const disabled = ref(false);
const isSubmit = ref(false);
const title = "请完成以下练习：";

const getCorrectAnswerTag = (questIdx) => {
  let q = data.questions[questIdx];
  let a = q.answer;
  if (a == q.selectA) return "A";
  if (a == q.selectB) return "B";
  if (a == q.selectC) return "C";
  if (a == q.selectD) return "D";
  return "";
};
const chooseSentence = (index) => {
  if (activeSentenceIndex.value == index) {
    return (activeSentenceIndex.value = -2);
  }
  activeSentenceIndex.value = index;
};
const getProblems = () => {
  let obj = {
    ...safeMes.value,
    articleId: props.articleId,
    readLogId: props.readLogId,
    timestamp: props.timestamp,
  };
  questionList(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      if (res.data.code)
        return store.commit("judgeCode", {
          code: res.data.code,
          msg: res.data.msg,
        });
      data.questions = res.data.data.questions;
      waiting.value = false;
      while (data.questions.length != data.answerList.length) {
        data.answerList.push("");
      }
    })
    .catch(() => {
      waiting.value = false;
      ElMessage.error("获取题目失败");
    });
};
const getAns = (val) => {
  let item = {
    answer: val.ans,
    questionId: data.questions[val.index].id,
  };
  data.answerList.splice(val.index, 1, item);

  if (!isCompleted) {
    completeReading();
  }
};
const completeReading = () => {
  isCompleted = true;
  let obj = {
    ...safeMes.value,
    articleId: props.articleId,
    readLogId: props.readLogId,
    timestamp: props.timestamp,
  };
  articleComplete(encodeURIComponent(JSON.stringify(obj)))
    .then(() => {})
    .catch(() => {
      isCompleted = false;
    });
};
const submitOrNextArticle = () => {
  console.log("submitOrNextArticle");
  disabled.value = true;
  if (isSubmit.value) {
    nextArticle();
  } else {
    submitAnswers();
  }
};
const nextArticle = () => {
  console.log("nextArticle");
  disabled.value = true;
  let obj = {
    ...safeMes.value,
    articleId: props.articleId,
    readLogId: props.readLogId,
    timestamp: props.timestamp,
    reason: "next",
    pid: getLocalPid(),
  };
  articleNext(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      if (res.data.code) {
        return store.commit("judgeCode", {
          code: res.data.code,
          msg: res.data.msg,
        });
      }
      let href = window.location.href;
      window.location.href =
        href.substring(0, href.lastIndexOf("/")) +
        "/article?id=" +
        res.data.data.articleId +
        "&pid=" +
        getLocalPid();
    })
    .catch(() => {
      return ElMessage.error("获取文章失败");
    });
};
const submitAnswers = () => {
  disabled.value = true;
  let index = data.answerList.findIndex((v) => v === "");
  if (index != -1) return ElMessage.warning("请填写所有题目哦");
  let obj = {
    ...safeMes.value,
    articleId: props.articleId,
    readLogId: props.readLogId,
    answers: data.answerList,
  };
  console.log("submitAnswers", obj);
  questionSubmit(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      if (res.data.code)
        return store.commit("judgeCode", {
          code: res.data.code,
          msg: res.data.msg,
        });
      ElMessage.success("提交成功");
      disabled.value = false;
      isSubmit.value = true;
    })
    .catch((err) => {
      disabled.value = false;
      console.log(err);
      ElMessage.error("提交答案失败");
    });
};
</script>

<style scoped>
/* 句子高亮 */
.active {
  color: white;
  background-color: #318efd;
}

.hover:hover {
  color: white;
  background-color: #318efd;
}
</style>
