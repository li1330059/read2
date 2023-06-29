<!-- 使用场景: AI工具 - 语法分析 -->
<template>
  <div>
    <div style="padding: 20px">
      <div v-if="!inAnalyse">
        <div v-if="empty_vis">
          <div class="css6">
            <img
              src="../assets/jqr2.png"
              style="position: absolute; left: -30px"
            />
            我已经为你分析了所有句子，点击确认你要分析的语句
          </div>
        </div>
        <div v-if="translation" style="margin-top: 1rem">
          <div class="css6">
            <img
              src="../assets/jqr2.png"
              style="position: absolute; left: -30px"
            />
            小提示：点击具体单词可以查询解释，如果有红色词条，那就是这个词在本句中的唯一解释。
          </div>
        </div>
      </div>
      <div v-if="inAnalyse" style="font-weight: 700; padding-top: 20px">
        <div style="color: #333333">
          <span style="padding: 5px"> AI老师分析中... </span>
        </div>
      </div>
      <div
        v-if="!animationIndex && data.animationList.length && canPlay"
        style="font-weight: 700; padding-top: 20px"
      >
        <div style="color: #333333">
          <span style="padding: 5px"> AI老师分析完毕 </span>
        </div>
      </div>
      <div
        style="
          background: #e7f6ff;
          border: 1px solid #0086f0;
          border-radius: 16px;
          padding: 20px;
          color: #032b72;
          font-size: 17px;
          margin-top: 60px;
          position: relative;
        "
      >
        <img
          src="../assets/jqr2.png"
          style="position: absolute; left: -15px; top: -40px"
        />
        <div v-if="empty_vis">
          <div
            @click="chooseHandler(item)"
            v-for="(item, index) in txt"
            :key="index"
          >
            {{ item }}
          </div>
        </div>

        <!-- 用户选择分析的句子 -->
        <div
          v-if="
            !empty_vis &&
            (animationIndex >= data.animationList.length || animationIndex == 0)
          "
          style="font-size: 18px; color: #666"
          @click="word_popup"
          class="html-box"
          v-html="nowSentence"
        ></div>
        <!-- 读音频时的↓ 读完音频可以翻译的↑ -->
        <div
          v-if="
            !empty_vis &&
            animationIndex < data.animationList.length &&
            animationIndex >= 1
          "
          style="padding: 20px; font-size: 18px; color: #666"
          class="html-box"
          v-html="data.animationList[animationIndex - 1].markLine"
        ></div>
        <!-- 用户选择分析的句子 -->

        <!-- 单词的弹出层 -->
        <div
          style="
            position: absolute;
            left: 50%;
            width: 96%;
            background-color: #2b85e4;
            color: white;
            border-radius: 5px;
            transform: translateX(-50%);
          "
          :style="'top:' + word_top + 'px;'"
          v-if="popVis"
        >
          <div class="flex">
            <div
              style="
                width: 85%;
                padding-left: 5px;
                padding-top: 5px;
                word-break: break-all;
              "
            >
              {{ clicked_word }}
            </div>
            <div
              style="
                z-index: 15;
                width: 15%;
                font-size: 24px;
                font-weight: 700;
                color: white;
                text-align: center;
                padding-right: 10px;
              "
              @click="popVis = false"
            >
              <img
                src="../../public/img/close.png"
                style="width: 20px; height: 20px"
              />
            </div>
          </div>

          <div
            style="height: 2px; background-color: #ccc; margin-top: 3px"
          ></div>
          <div style="height: 20px" class="flex align-center">
            <span v-if="phonetic" style="color: #485860; margin-left: 5px">
              {{ "[ " + phonetic + " ]" }}
            </span>
            <div @click="toSpeak" style="width: 40px;height: 20px;display: flex;align-items: center;">
              <img
                src="../../public/img/laba.png"
                style="margin-left: 5px; width: 15px; height: 15px"
              />
            </div>
            <span v-if="!audioUrl" style="margin-left: 5px; font-size: 12px">
              加载中...
            </span>
          </div>
          <div style="margin-top: 5px; margin-bottom: 5px; margin-left: 5px">
            <div
              v-for="(item, index) in data.translationsV2"
              :key="index"
              style="
                border-bottom-color: #58a6e3;
                border-bottom-style: dashed;
                border-bottom-width: 0.05rem;
                padding: 1px;
              "
            >
              <div style="text-align: left; width: fit-content">
                <span
                  style="
                    font-size: 0.6rem;
                    color: #ffffff;
                    background-color: violet;
                  "
                  v-if="item.isVariant"
                  >↓词性要点</span
                >
                <span
                  style="
                    font-size: 0.6rem;
                    color: #ffffff;
                    background-color: #fad960;
                  "
                  v-else-if="item.bestIndexes.length > 0"
                  >↓最佳解释</span
                >
              </div>
              <div>
                <span
                  :style="item.bestIndexes.length > 0 ? 'color: #fad960;' : ''"
                  >{{ item.pos }}</span
                >
                <span v-for="(explain, idxL2) in item.explains" :key="idxL2">
                  <template v-if="idxL2 > 0">,</template>
                  <span
                    :style="
                      item.isVariant
                        ? 'color:violet;'
                        : item.bestIndexes.indexOf(idxL2) != -1
                        ? 'color: #fad960;'
                        : ''
                    "
                    >{{ explain }}</span
                  >
                </span>
              </div>
            </div>
          </div>

          <div v-if="data.lemma" style="font-style: italic">
            <div
              style="height: 2px; background-color: #ccc; margin-top: 3px"
            ></div>
            <div style="margin-left: 5px; margin-right: 5px">
              <div style="width: 90%; padding-left: 5px; padding-top: 5px">
                <span>原型:</span><br />
                <span>{{ data.lemma.word }}</span
                ><br />
                <span v-if="data.lemma.phonetic" style="color: #485860">{{
                  "[ " + data.lemma.phonetic + " ]"
                }}</span>
              </div>
              <div
                v-for="(item, index) in data.lemma.translationsV2"
                :key="index"
                style="
                  border-bottom-color: #58a6e3;
                  border-bottom-style: dashed;
                  border-bottom-width: 0.05rem;
                  padding: 1px;
                "
              >
                <div style="text-align: left; width: fit-content">
                  <span
                    style="
                      font-size: 0.6rem;
                      color: #ffffff;
                      background-color: violet;
                    "
                    v-if="item.isVariant"
                    >↓词性要点</span
                  >
                  <span
                    style="
                      font-size: 0.6rem;
                      color: #ffffff;
                      background-color: #fad960;
                    "
                    v-else-if="item.bestIndexes.length > 0"
                    >↓最佳解释</span
                  >
                </div>
                <div>
                  <span
                    :style="
                      item.bestIndexes.length > 0 ? 'color: #fad960;' : ''
                    "
                    >{{ item.pos }}</span
                  >
                  <span v-for="(explain, idxL2) in item.explains" :key="idxL2">
                    <template v-if="idxL2 > 0">,</template>
                    <span
                      :style="
                        item.isVariant
                          ? 'color:violet;'
                          : item.bestIndexes.indexOf(idxL2) != -1
                          ? 'color: #fad960;'
                          : ''
                      "
                      >{{ explain }}</span
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 单词的弹出层 -->

        <!-- 用户选择分析的句子 -->
        <div style="margin-top: 10px"></div>

        <div
          class=""
          v-if="
            canPlay &&
            data.animationList.length &&
            animationIndex < data.animationList.length
          "
          style="
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 10;
            background-color: rgba(0, 0, 0, 0);
          "
          @click="next"
        ></div>

        <!-- 几个音频 -->
        <div v-for="(item, index) in data.animationList" :key="index">
          <template v-if="index == animationIndex">
            <div class="position-relative" style="margin-bottom: 20px">
              <div
                class="html-box"
                style="margin: 5px; padding: 0 5px 5px 5px; width: 100%"
                v-html="item.text"
                v-if="!(canPlay && !animationIndex)"
              ></div>
              <div
                v-if="
                  animationIndex < data.animationList.length &&
                  animationIndex >= 1 &&
                  canPlay
                "
                class="flex align-center justify-center"
              >
                <div style="color: #333333; font-weight: 700">
                  点击查看下一步
                </div>
              </div>
              <div class="text-center">
                <audio
                  @ended="audioEnd"
                  :src="item.audio"
                  :ref="
                    (el) => {
                      if (el) audio[i] = el;
                    }
                  "
                ></audio>
              </div>
            </div>
          </template>
        </div>
        <!-- 几个音频 -->

        <div style="width: 100%" class="empty" v-if="empty_vis"></div>

        <!-- 解释 -->
        <div
          style="padding: 20px"
          v-if="!empty_vis && animationIndex >= data.animationList.length"
        >
          <div class="chinese" style="color: #999">中文释义</div>
          <div class="black" style="margin-top: 10px">
            {{ translation }}
          </div>
          <div v-if="!data.subLRlist.length">
            <div
              style="margin-top: 40px; color: #2b9af3"
              v-if="mSentType"
              class="black"
            >
              本句为: {{ castSentenceTypeName(mSentType) }}
            </div>
            <div style="margin-top: 20px" v-if="sub" class="black">
              主语: {{ sub }}
            </div>
            <div style="margin-top: 20px" v-if="pred" class="black">
              <template v-if="isZWB">谓语: </template>
              <template v-else>系动词: </template>
              {{ pred }}
            </div>
            <div style="margin-top: 20px" v-if="object" class="black">
              宾语: {{ object }}
            </div>
            <div style="margin-top: 20px" v-if="prej" class="black">
              表语: {{ prej }}
            </div>
          </div>
          <div v-else>
            <div v-for="(item, index) in data.subLRlist" :key="index">
              <div style="margin-top: 40px" class="black">
                并列句{{ index + 1 }}: {{ item.origLine }}
              </div>
              <div
                style="margin-top: 20px; color: #2b9af3"
                v-if="item.sentStruct.mSentType"
                class="black"
              >
                本句为: {{ castSentenceTypeName(item.sentStruct.mSentType) }}
              </div>
              <div
                style="margin-top: 20px"
                v-if="item.sentStruct.sub.word"
                class="black"
              >
                主语: {{ item.sentStruct.sub.word }}
              </div>
              <div
                style="margin-top: 20px"
                v-if="item.sentStruct.pred.word"
                class="black"
              >
                <template v-if="item.sentStruct.isZWB">谓语: </template>
                <template v-else>系动词: </template>
                {{ item.sentStruct.pred.word }}
              </div>
              <div
                style="margin-top: 20px"
                v-if="item.sentStruct.obj.word"
                class="black"
              >
                宾语: {{ item.sentStruct.obj.word }}
              </div>
              <div
                style="margin-top: 20px"
                v-if="item.sentStruct.prej.word"
                class="black"
              >
                表语: {{ item.sentStruct.prej.word }}
              </div>
            </div>
          </div>

          <!-- 两个button -->
          <div
            class="flex align-center"
            style="justify-content: space-between; margin-top: 40px"
          >
            <div
              style="color: #fee096"
              class="buttons flex align-center justify-center"
              @click="chooseAnother"
            >
              返回换一句
            </div>
            <div
              style="color: #fee096"
              class="buttons flex align-center justify-center"
              @click="back"
            >
              返回工具首页
            </div>
          </div>
          <!-- 两个button -->
        </div>
        <!-- 解释 -->
      </div>
      <!-- 点击句子 -->

      <!-- 选择 new2 -->
      <div v-if="!empty_vis && animationIndex >= data.animationList.length">
        <div
          class="black"
          style="padding: 5px 0; margin-top: 20px; font-weight: bold"
        >
          选择本句包含的知识点：
        </div>
        <div
          v-for="(name, idx) in data.knowledgeNames2"
          :key="'point-name-' + idx"
          style="margin: 5px"
          class="inline-block"
          @click="changeKnowledgePointActive2(name)"
          :class="activeKnowledgeName2 == name ? 'active' : 'bg-dec'"
        >
          <div>{{ name }}</div>
          <div
            style="
              font-size: 0.6rem;
              font-style: italic;
              color: #ddd255;
              text-align: right;
              width: fit-content;
              float: right;
            "
          >
            {{ knowledgeNamesGrade2[name] }}
          </div>
        </div>

        <hr />
        <template v-for="(item, idx) in data.knowledgePoints2">
          <div
            v-if="item.name == activeKnowledgeName2"
            :key="'point-value-' + idx"
            style="padding: 5px"
          >
            <div style="color: #4c99a9; margin-bottom: 5px; font-weight: bold">
              {{ item.name }}
            </div>
            <div
              style="margin-bottom: 5px"
              class="html-box"
              v-html="item.markLine"
            ></div>
            <div style="color: #4c99a9; padding-bottom: 5px">
              <span class="html-box" v-html="item.description"></span>
            </div>
            <div style="padding-bottom: 5px">{{ item.sample }}</div>
            <hr
              style="border-width: 0.001rem; border-style: dashed; margin: 3px"
            />
          </div>
        </template>
      </div>
      <!-- 选择 new2 -->
    </div>
    <div style="height: 10px"></div>
  </div>
</template>

<script setup>
import { defineProps, reactive, computed, ref, onMounted, onBeforeUpdate } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { grammarAnalysis, bizTts, translate } from "../api/index";
const store = useStore();
const safeMes = computed(() => store.state.safeMes);
const props = defineProps({
  queryTxt: {
    type: [String, Array],
    default: "",
  },
  articleId: {
    type: [String, Number],
    default: "",
  },
  readLogId: {
    type: [String, Number],
    default: "",
  },
});
const queryTxt = ref(props.queryTxt);
const articleId = ref(props.articleId);
const readLogId = ref(props.readLogId);
const txt = ref("");
let currentNode = null;
const empty_vis = ref(true);
let linshi = "";
const nowSentence = ref("");
const inAnalyse = ref(false);
const translation = ref("");
const mSentType = ref("");
const sub = ref("");
const pred = ref("");
const object = ref("");
const prej = ref("");
const isZWB = ref(true);
const data = reactive({
  subLRlist: [],
  grammer: {},
  translationsV2: [],
  lemma: null,
  animationList: [],
  knowledgePoints2: [],
  knowledgeNames2: [],
});
const popVis = ref(false); //单词的弹出层
const word_top = ref(0);
const clicked_word = ref(""); // 单词
let linshiOffset = ""; // offset
const audioUrl = ref("");
const phonetic = ref("");
let translations = [];
const animationIndex = ref(0);
const canPlay = ref(false);
let odl = null;
const knowledgeNamesGrade2 = reactive({});
const activeKnowledgeName2 = ref("");
const audio = ref([]);

const next = () => {
  if (!canPlay.value) return;
  audio.value[0].play();
  canPlay.value = false;
};
//音频播放完毕 切换下一个
const audioEnd = () => {
  animationIndex.value++;
  console.log(animationIndex.value, "播放第 条语音");
  canPlay.value = true;
};
// 获取音频
const getSpeaker = () => {
  let obj = {
    ...safeMes.value,
    articleId: articleId.value,
    readLogId: readLogId.value,
    content: clicked_word.value,
  };
  bizTts(encodeURIComponent(JSON.stringify(obj)))
    .then((v) => {
      const res = v.data;
      if (res.code)
        return store.commit("judgeCode", {
          code: res.code,
          msg: res.msg,
        });
      audioUrl.value = res.data.audioUrl;
    })
    .catch(() => {
      ElMessage.error("获取音频失败");
    });
};
// 播放语音
const toSpeak = () => {
  odl = new Audio();
  odl.src = audioUrl.value;
  odl.play();
};
// 得到翻译
const getTranslate = () => {
  let obj = {
    ...safeMes.value,
    articleId: articleId.value,
    readLogId: readLogId.value,
    content: clicked_word.value,
    sentence: linshi,
    offset: linshiOffset,
  };
  translate(encodeURIComponent(JSON.stringify(obj)))
    .then((v) => {
      const res = v.data;
      if (res.code)
        return store.commit("judgeCode", {
          code: res.code,
          msg: res.msg,
        });
      data.lemma = res.data.wordResult.lemma;
      phonetic.value = res.data.wordResult.phonetic;
      translations = [];
      data.translationsV2 = res.data.wordResult.translationsV2;
      let index = 0;
      while (translations.length < res.data.wordResult.translations.length) {
        translations.push("");
        translations.splice(index, 1, res.data.wordResult.translations[index]);
        index++;
      }
      getSpeaker();
    })
    .catch(() => {
      ElMessage.error("翻译失败");
    });
};

// 弹出层
const word_popup = (e) => {
  // 如果没用点击到dom或者点击的不是单词，就不执行
  if (!e.target || e.target.className.indexOf("word") === -1) return;
  if (currentNode) {
    currentNode.style.background = "inherit";
    currentNode.style.color = "inherit";
    currentNode = null;
  }
  currentNode = e.target;
  currentNode.style.background = "#83b2e1";
  currentNode.style.color = "#fff";
  const text = e.target.childNodes[0].nodeValue;
  linshiOffset = e.target.attributes["offset0"].nodeValue;
  clicked_word.value = (text || "").trim();
  getTranslate();
  console.log(clicked_word.value, "单词", linshiOffset, "offset");
  popVis.value = true;
  console.log(e);
  word_top.value = e.offsetY + 40;
};
//  返回到工具首页
const back = () => {
  location.reload();
};

const castSentenceTypeName = (sentType) => {
  switch (sentType) {
    case "incomplete_sentence":
      return "句式结构不完整";
    case "general_question":
      return "一般疑问句";
    case "special_question":
      return "特殊疑问句";
    case "complete_inversion":
      return "完全倒装句";
    case "partial_inversion":
      return "部分倒装句";
    case "imperative":
      return "祈使句";
    case "declarative":
      return "陈述句";
    default:
      return "";
  }
};
//  详细分析
const chooseHandler = (content) => {
  linshi = content;
  animationIndex.value = 0;
  nowSentence.value = getHtml(content);
  console.log("", content);
  let obj = {
    ...safeMes.value,
    articleId: articleId.value ? articleId.value - 0 : 0,
    readLogId: readLogId.value ? readLogId.value - 0 : 0,
    content: content,
  };
  inAnalyse.value = true;
  grammarAnalysis(encodeURIComponent(JSON.stringify(obj)))
    .then((result) => {
      console.log(result);
      if (result.code)
        return store.commit("judgeCode", {
          code: result.code,
          msg: result.msg,
        });
      empty_vis.value = false;
      inAnalyse.value = false;
      let res = result.data.data.lineResults[0];

      translation.value = res.translation;
      // 主谓宾
      if (!res.subLRs.length) {
        mSentType.value = res.sentStruct.mSentType;
        sub.value = res.sentStruct.sub.word;
        pred.value = res.sentStruct.pred.word;
        object.value = res.sentStruct.obj.word;
        prej.value = res.sentStruct.prej.word;
        isZWB.value = res.sentStruct.isZWB;

        // 获取动画
        data.animationList = [...res.animation];
        canPlay.value = true;
        for (let i = 0; i < data.animationList.length; i++) {
          console.log(data.animationList[i].audio);
        }
      } else {
        while (data.subLRlist.length < res.subLRs.length) {
          data.subLRlist.push({});
        }
        for (let i = 0; i < res.subLRs.length; i++) {
          data.subLRlist.splice(i, 1, res.subLRs[i]);
        }
      }
      // 主谓宾
      // 年级
      let index = 0;
      for (let key in res.gradeGrammars) {
        if (!index) res.gradeGrammars[key].active = true;
        else res.gradeGrammars[key].active = false;
        index++;
        for (let i = 0; i < res.gradeGrammars[key].length; i++) {
          if (!i) res.gradeGrammars[key][i].active = false;
          else res.gradeGrammars[key][i].active = false;
        }
      }
      data.grammer = res.gradeGrammars;

      buildKnowledgePoints2();
    })
    .catch((err) => {
      inAnalyse.value = false;
      console.log(err);
      return ElMessage.error("分析失败");
    });
};
const chooseAnother = () => {
  empty_vis.value = true;
  inAnalyse.value = false;
};
const getHtml = (str) => {
  return str.replace(/\b(\w+)\b/g, function (m, w, pos) {
    return `<span class="word" offset0="${pos}">${w}</span>`;
  });
};
const buildKnowledgePoints2 = () => {
  for (let grade in data.grammer) {
    //年级名称：小学一年级
    let grammarArr = data.grammer[grade]; //知识点数组
    for (let i = 0; i < grammarArr.length; i++) {
      let point = grammarArr[i]; //知识点对象
      point.grade = grade;
      data.knowledgePoints2.push(point);
    }
  }
  //sort: order by levelId desc
  data.knowledgePoints2.sort(function (a, b) {
    return b["levelId"] - a["levelId"];
  });

  //fill knowledgePoints2
  for (let i = 0; i < data.knowledgePoints2.length; i++) {
    let obj = data.knowledgePoints2[i];
    if (data.knowledgeNames2.indexOf(obj.name) < 0) {
      data.knowledgeNames2.push(obj.name);
      knowledgeNamesGrade2[obj.name] = obj.grade;
    }
  }
};
const changeKnowledgePointActive2 = (knowledgePointName) => {
  activeKnowledgeName2.value = knowledgePointName;
};
onMounted(() => {
  if (typeof queryTxt.value === "string") {
    txt.value = [queryTxt.value] || ["you can"];
  } else {
    txt.value = queryTxt.value || ["you can"];
  }
});
onBeforeUpdate(() => {
  audio.value = [];
});
</script>

<style scoped>
::v-deep .html-box,
.wrapper,
#section {
  word-break: break-all;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 10px;
  hyphens: auto;
}
.black {
  color: #333;
  font-size: 18px;
}
.box {
  margin: 0 auto;
}
.buttons {
  background-image: url(../../public/img/buttton2.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.active {
  background-image: radial-gradient(50% 216%, #ffd200 0, #ff8520 100%);
  padding: 10px;
  border-radius: 4px;
  color: white;
  font-weight: 700;
}
.bg-dec {
  background-image: url(../../public/img/box.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 10px;
  color: #ffd200;
  font-weight: bold;
}
::v-deep #section .active {
  color: white;
  background-color: #83b2e1 !important;
}
.css6 {
  width: 90%;
  height: 70px;
  background-image: linear-gradient(180deg, #00c6f9 2%, #0077ed 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  padding: 0 20px;
  border-radius: 20px;
  margin: 0 auto;
  position: relative;
}
</style>
