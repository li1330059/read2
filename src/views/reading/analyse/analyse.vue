<!-- 使用场景: 文章页面 - 弹出菜单 - 语法分析 -->
<template>
  <div class="wrapper" style="width: 100%" :style="bodyStyle">
    <!-- 标题 -->
    <div
      v-if="!type"
      class="
        position-fiexd position-relative
        font-bold
        left-0
        top-0
        right-0
        text-center
      "
      style="
        padding: 15px;
        color: #333;
        background-color: #f8f8f8;
        font-size: 16px;
        width: 100%;
        z-index: 1;
      "
    >
      分析结果
      <div
        class="position-absolute top-0 right-0 bottom-0 flex align-center"
        style="left: 15px"
      >
        <img
          @click="back()"
          src="../../../../public/img/left1.png"
          style="width: 10px; height: 15px"
        />
      </div>
    </div>
    <!-- 标题 -->

    <div class="box">
      <div class="flex" v-if="!type && !inAnalyse">
        <img src="../../../../public/img/avatar.png" class="teacher-img" />
        <div class="notice" v-if="empty_vis">
          <div style="width: 90%; margin-top: 12px" class="">
            我已经为你分析了所有句子，点击确认你要分析的语句
          </div>
        </div>
        <div class="notice" v-if="translation">
          <div style="width: 90%; margin-top: 12px" class="">
            小提示：点击具体单词可以查询解释，如果有红色词条，那就是这个词在本句中的唯一解释。
          </div>
        </div>
      </div>
      <div
        v-if="inAnalyse"
        class="flex align-center justify-center"
        style="font-weight: 700; padding-top: 20px"
      >
        <img
          src="../../../../public/kid_a.png"
          style="height: 60px; width: 45px; margin-right: 10px"
        />
        <div style="color: #333333" class="flex align-center">
          <span style="padding: 5px; background-color: #f2f2f2">
            AI老师分析中...
          </span>
        </div>
      </div>
      <!-- 点击句子后显示的部分 -->
      <div class="bg-white w-100" style="position: relative; margin-top: 50px">
        <img
          src="../../../assets/jqr2.png"
          style="position: absolute; top: -40px; left: 0px"
        />
        <div
          id="section"
          v-if="empty_vis"
          style="
            padding: 20px;
            color: #032b72;
            background: #e7f6ff;
            border: 1px solid #0086f0;
            border-radius: 16px;
          "
        >
          <div
            @click="chooseHandler(item)"
            v-for="(item, index) in txt.data"
            :key="index"
          >
            {{ item }}
          </div>
        </div>

        <!-- 用户选择分析的句子 -->
        <div
          v-if="
            !empty_vis &&
            (animationIndex >= animationList.dataValue.length ||
              animationIndex == 0)
          "
          style="
            padding: 20px;
            color: #032b72;
            background: #e7f6ff;
            border: 1px solid #0086f0;
            border-radius: 16px;
          "
          @click="word_popup"
          class="html-box"
          v-html="nowSentence"
        ></div>
        <!-- 读音频时的↓ 读完音频可以翻译的↑ -->
        <div
          v-if="
            !empty_vis &&
            animationIndex < animationList.dataValue.length &&
            animationIndex >= 1
          "
          style="
            padding: 20px;
            color: #032b72;
            background: #e7f6ff;
            border: 1px solid #0086f0;
            border-radius: 16px;
          "
          class="html-box"
          v-html="animationList.dataValue[animationIndex - 1].markLine"
        ></div>
        <!-- 用户选择分析的句子 -->

        <!-- 单词的弹出层 -->
        <div
          v-if="popVis"
          style="
            padding: 3px;
            border-width: 0.1px;
            border-style: solid;
            border-radius: 5px;
            border-color: #cccccc;
          "
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
                src="../../../../public/img/close2.png"
                style="width: 20px; height: 20px"
              />
            </div>
          </div>
          <div style="height: 20px" class="flex align-center">
            <span style="color: #485860; margin-left: 5px">
              [<span v-if="phonetic">{{ phonetic }}</span
              >]
            </span>
            <span v-if="!audioUrl" style="margin-left: 5px; font-size: 12px">
              音频加载中...
            </span>
            <div v-else @click="toSpeak" style="width: 40px;height: 20px;display: flex;align-items: center;">
              <img
                src="../../../assets/laba.png"
                style="margin-left: 5px; width: 15px; height: 15px"
              />
            </div>
            <!-- img @click="toSpeak" src="../../../../public/img/laba.png" style="margin-left: 5px; width: 15px; height: 15px"/ -->
          </div>
          <div style="margin-top: 5px; margin-bottom: 5px; margin-left: 5px">
            <div
              v-for="(item, index) in translationsV2.data"
              :key="index"
              style="
                color: #032b72;
                border-bottom-color: #dddddd;
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
                    background-color: #9f35f9;
                  "
                  v-if="item.isVariant"
                  >↓词性要点</span
                >
                <span
                  style="
                    font-size: 0.6rem;
                    color: #ffffff;
                    background-color: #f2460a;
                  "
                  v-else-if="item.bestIndexes.length > 0"
                  >↓最佳解释</span
                >
              </div>
              <div>
                <span
                  :style="item.bestIndexes.length > 0 ? 'color: #f2460a;' : ''"
                  >{{ item.pos }}</span
                >
                <span v-for="(explain, idxL2) in item.explains" :key="idxL2">
                  <template v-if="idxL2 > 0">,</template>
                  <span
                    :style="
                      item.isVariant
                        ? 'color:#9f35f9;'
                        : item.bestIndexes.indexOf(idxL2) != -1
                        ? 'color: #f2460a;'
                        : ''
                    "
                    >{{ explain }}</span
                  >
                </span>
              </div>
            </div>
          </div>

          <div v-if="lemma" style="font-style: italic">
            <div style="margin-left: 5px; margin-right: 5px">
              <div style="width: 90%; padding-left: 5px; padding-top: 5px">
                <span>原型:</span><br />
                <span>{{ lemma.word }}</span
                ><br />
                <span v-if="lemma.phonetic" style="color: #485860">{{
                  "[ " + lemma.phonetic + " ]"
                }}</span>
              </div>
              <div
                v-for="(item, index) in lemma.translationsV2"
                :key="index"
                style="
                  color: #032b72;
                  border-bottom-color: #dddddd;
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
                      background-color: #9f35f9;
                    "
                    v-if="item.isVariant"
                    >↓词性要点</span
                  >
                  <span
                    style="
                      font-size: 0.6rem;
                      color: #ffffff;
                      background-color: #f2460a;
                    "
                    v-else-if="item.bestIndexes.length > 0"
                    >↓最佳解释</span
                  >
                </div>
                <div>
                  <span
                    :style="
                      item.bestIndexes.length > 0 ? 'color: #f2460a;' : ''
                    "
                    >{{ item.pos }}</span
                  >
                  <span v-for="(explain, idxL2) in item.explains" :key="idxL2">
                    <template v-if="idxL2 > 0">,</template>
                    <span
                      :style="
                        item.isVariant
                          ? 'color:#9f35f9;'
                          : item.bestIndexes.indexOf(idxL2) != -1
                          ? 'color: #f2460a;'
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

        <!-- 几个音频 -->
        <div v-for="(item, index) in animationList.dataValue" :key="index">
          <template v-if="index == animationIndex">
            <div class="position-relative">
              <div
                class="html-box"
                style="margin: 5px; padding: 0 5px 5px 5px; width: 100%"
                v-html="item.text"
                v-if="!(canPlay && !animationIndex)"
              ></div>
              <div
                @click="next"
                v-if="
                  animationIndex < animationList.dataValue.length &&
                  animationIndex >= 1 &&
                  canPlay
                "
                class="button flex align-center justify-center"
              >
                点击查看下一步
              </div>
              <div
                v-if="
                  !animationIndex && animationList.dataValue.length && canPlay
                "
              >
                <div @click="next" style="color: #032b72; text-align: center">
                  AI分析完毕<br />点击查看结果(有声音哦)
                  <img
                    src="../../../assets/click.png"
                    style="display: block; margin: 10px auto 0"
                  />
                </div>
              </div>
              <div class="text-center">
                <audio @ended="audioEnd" :src="item.audio" ref="audio"></audio>
              </div>
            </div>
          </template>
        </div>
        <!-- 几个音频 -->

        <!-- 解释 -->
        <div
          v-if="!empty_vis && animationIndex >= animationList.dataValue.length"
        >
          <div
            style="
              padding: 3px;
              border-width: 0.1px;
              border-style: solid;
              border-radius: 5px;
              border-color: #cccccc;
            "
          >
            <div class="chinese" style="color: #999">中文释义</div>
            <div class="black" style="margin-top: 10px">
              {{ translation }}
            </div>
          </div>
          <div
            style="
              padding: 3px;
              border-width: 0.1px;
              border-style: solid;
              border-radius: 5px;
              border-color: #cccccc;
              margin-top: 10px;
            "
          >
            <div v-if="!subLRlist.data.length">
              <div
                style="margin-top: 5px; color: #2b9af3"
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
              <div style="margin-top: 20px" v-if="obj" class="black">
                宾语: {{ obj }}
              </div>
              <div style="margin-top: 20px" v-if="prej" class="black">
                表语: {{ prej }}
              </div>
            </div>
            <div v-else>
              <div v-for="(item, index) in subLRlist.data" :key="index">
                <div style="margin-top: 40px" class="black">
                  并列句{{ index + 1 }}: {{ item.origLine }}
                </div>
                <div style="margin-top: 20px; color: #2b9af3" class="black">
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
          </div>

          <!-- 两个button -->
          <div
            class="flex align-center"
            style="justify-content: space-between; margin-top: 40px"
          >
            <div
              style="width: 45%"
              class="button flex align-center justify-center"
              @click="chooseAnother"
            >
              返回换一句
            </div>
            <div
              style="
                width: 45%;
                background: #e7f6ff;
                color: #2b9af3;
                border: 1px solid #2b9af3;
              "
              class="button flex align-center justify-center"
              @click="back"
            >
              返回首页
            </div>
          </div>
          <!-- 两个button -->
        </div>
        <!-- 解释 -->
      </div>
      <!-- 点击句子 -->

      <!-- 选择 new2 -->
      <div
        v-if="!empty_vis && animationIndex >= animationList.dataValue.length"
      >
        <div
          class="black"
          style="padding: 5px 0; margin-top: 20px; font-weight: bold"
        >
          选择本句包含的知识点：
        </div>
        <div
          v-for="(name, idx) in knowledgeNames2.data"
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
              color: #2e9df6;
              text-align: right;
              width: fit-content;
              float: right;
            "
          >
            {{ knowledgeNamesGrade2.data[name] }}
          </div>
        </div>

        <hr />
        <template v-for="(item, idx) in knowledgePoints2.data">
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
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, reactive, defineEmits, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { bizTts, translate, grammarAnalysis } from "../../../api/index";
import { ElMessage } from "element-plus";
const store = useStore();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["toView"]);
const safeMes = computed(() => store.state.safeMes);
const sentence = computed(() => store.state.sentence);

const empty_vis = ref(true);
let linshi = "";
const nowSentence = ref("");
const txt = reactive({ data: [] });
const inAnalyse = ref(false);
const translation = ref("");
const mSentType = ref("");
const sub = ref("");
const pred = ref("");
const obj = ref("");
const prej = ref("");
const isZWB = ref(true);
const subLRlist = reactive({ data: [] });
let grammer = {};
const popVis = ref(false);
const clicked_word = ref("");
let linshiOffset = "";
const audioUrl = ref("");
const phonetic = ref("");
const translationsV2 = reactive({ data: [] });
const lemma = ref(null);
const animationList = reactive({ dataValue: [] });
const animationIndex = ref(0);
const canPlay = ref(false);
let odl = null;
const knowledgePoints2 = reactive({ data: [] });
const knowledgeNames2 = reactive({ data: [] });
const knowledgeNamesGrade2 = reactive({ data: {} });
const activeKnowledgeName2 = ref("");
const audio = ref(null);

const props = defineProps({
  bodyStyle: {
    type: String,
    default: "",
  },
  type: {
    type: String,
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

onMounted(() => {
  if (props.type === "component") {
    txt.data = [sentence.value];
    chooseHandler(sentence.value);
  } else {
    if (typeof route.query.txt === "string") {
      txt.data = [route.query.txt] || ["you can"];
    } else {
      txt.data = route.query.txt || ["you can"];
    }
  }
});
const toView = () => {
  emit("toView");
};
const next = () => {
  if (!canPlay.value) return;
  audio.value[0].play();
  canPlay.value = false;
};
const audioEnd = () => {
  animationIndex.value++;
  canPlay.value = true;
};
const getSpeaker = () => {
  bizTts(
    encodeURIComponent(
      JSON.stringify({
        ...safeMes.value,
        articleId: props.articleId,
        readLogId: props.readLogId,
        content: clicked_word.value,
      })
    )
  )
    .then(({ data }) => {
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      audioUrl.value = data.data.audioUrl;
    })
    .catch(() => {
      ElMessage.error("获取音频失败");
    });
};
const toSpeak = () => {
  odl = new Audio();
  odl.src = audioUrl.value;
  odl.play();
};
const getTranslate = () => {
  translate(
    encodeURIComponent(
      JSON.stringify({
        ...safeMes.value,
        articleId: props.articleId,
        readLogId: props.readLogId,
        content: clicked_word.value,
        sentence: linshi,
        offset: linshiOffset,
      })
    )
  )
    .then(({ data }) => {
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      lemma.value = data.data.wordResult.lemma;
      phonetic.value = data.data.wordResult.phonetic;
      translationsV2.data = data.data.wordResult.translationsV2;
      getSpeaker();
    })
    .catch(() => {
      ElMessage.error("翻译失败");
    });
};
const word_popup = (e) => {
  if (!e.target || e.target.className.indexOf("word") === -1) return;
  const text = e.target.childNodes[0].nodeValue;
  linshiOffset = e.target.attributes["offset0"].nodeValue;
  clicked_word.value = (text || "").trim();
  getTranslate();
  popVis.value = true;
};
const back = () => {
  router.go(-1);
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
const chooseHandler = (content) => {
  animationIndex.value = 0;
  nowSentence.value = getHtml(content);
  linshi = content;
  console.log("content", content);
  inAnalyse.value = true;
  grammarAnalysis(
    encodeURIComponent(
      JSON.stringify({
        ...safeMes.value,
        articleId: props.articleId ? props.articleId - 0 : 0,
        readLogId: props.readLogId ? props.readLogId - 0 : 0,
        content: content,
      })
    )
  )
    .then(({ data }) => {
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      empty_vis.value = false;
      inAnalyse.value = false;
      let res = data.data.lineResults[0];

      translation.value = res.translation;
      // 主谓宾
      if (!res.subLRs.length) {
        mSentType.value = res.sentStruct.mSentType;
        sub.value = res.sentStruct.sub.word;
        pred.value = res.sentStruct.pred.word;
        obj.value = res.sentStruct.obj.word;
        prej.value = res.sentStruct.prej.word;
        isZWB.value = res.sentStruct.isZWB;

        // 获取动画
        animationList.dataValue = [...res.animation];
        canPlay.value = true;
        if (props.type === "component") {
          toView();
        }
      } else {
        while (subLRlist.data.length < res.subLRs.length) {
          subLRlist.data.push({});
        }
        for (let i = 0; i < res.subLRs.length; i++) {
          subLRlist.data.splice(i, 1, res.subLRs[i]);
        }
      }
      // 主谓宾
      // 年级
      let index = 0;
      for (let key in res.gradeGrammars) {
        if (!index) res.gradeGrammars[key].active = true;
        else res.gradeGrammars[key].active = false;
        index++;
        for (var i = 0; i < res.gradeGrammars[key].length; i++) {
          if (!i) res.gradeGrammars[key][i].active = false;
          else res.gradeGrammars[key][i].active = false;
        }
      }
      grammer = res.gradeGrammars;

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
  for (let grade in grammer) {
    let grammarArr = grammer[grade];
    for (let i = 0; i < grammarArr.length; i++) {
      let point = grammarArr[i];
      point.grade = grade;
      knowledgePoints2.data.push(point);
    }
  }
  knowledgePoints2.data.sort(function (a, b) {
    return b["levelId"] - a["levelId"];
  });

  for (let i = 0; i < knowledgePoints2.data.length; i++) {
    let item = knowledgePoints2.data[i];
    if (knowledgeNames2.data.indexOf(item.name) < 0) {
      knowledgeNames2.data.push(item.name);
      knowledgeNamesGrade2.data[item.name] = item.grade;
    }
  }
};
const changeKnowledgePointActive2 = (knowledgePointName) => {
  activeKnowledgeName2.value = knowledgePointName;
};
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
}
@media screen and (max-width: 767px) {
  .teacher-img {
    width: 50px;
    height: 50px;
  }
  .notice {
    width: 252px;
    height: 88px;
  }
  .notice div {
    font-size: 13px;
  }
  .decorate-height {
    height: 32px;
  }
  .inner-text {
    font-size: 13px;
  }
  .empty {
    height: 100px;
  }
  .chinese {
    font-size: 12px;
  }
  .buttons {
    width: 124px;
    height: 39px;
  }
  .choose-text {
    font-size: 14px;
  }
}
@media screen and (min-width: 768px) {
  .teacher-img {
    width: 120px;
    height: 120px;
  }
  .box {
    width: 651px;
  }
  .notice {
    width: 525px;
    height: 142px;
    font-size: 28px;
  }
  .notice div {
    font-size: 28px;
  }
  .decorate-height {
    height: 100px;
  }
  .inner-text {
    font-size: 28px;
  }
  .empty {
    height: 300px;
  }
  .chinese {
    font-size: 26px;
  }
  .buttons {
    width: 260px;
    height: 82px;
  }
  .choose-text {
    font-size: 30px;
  }
}
.box {
  margin: 0 auto;
}
.notice {
  background-image: url(../../../../public/img/bubble2.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #fee096;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.buttons {
  background-image: url(../../../../public/img/buttton2.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.active {
  border: 1px solid #c4e0f1;
  padding: 5px;
  border-radius: 5px;
  color: #ffffff;
  background-image: linear-gradient(-58deg, #2b9af3 6%, #4bb1fa 100%);
  text-align: center;
}
.bg-dec {
  border: 1px solid #c4e0f1;
  padding: 5px;
  border-radius: 5px;
  color: #2b9af3;
  text-align: center;
}
::v-deep #section .active {
  color: white;
  background-color: #83b2e1 !important;
}
.button {
  width: 70%;
  height: 45px;
  background-image: linear-gradient(-58deg, #2b9af3 6%, #4bb1fa 100%);
  box-shadow: 0px 8px 14px 0px rgba(74, 144, 226, 0.3);
  border-radius: 100px;
  color: #ffffff;
  box-shadow: none;
  font-size: 17px;
  border: 0 none;
  margin: 0 auto;
  display: block;
  text-align: center;
  line-height: 45px;
}
bbm {
  font-size: 14px;
}
</style>
