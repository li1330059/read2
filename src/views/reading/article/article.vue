<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div class="bg-white" :style="{ height: isMobile ? '100%' : '80%' }">
      <Header :title="'阅读中心'"></Header>
      <div style="padding: 20px">
        <div
          style="
            display: flex;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddebff;
          "
        >
          <div
            style="
              width: 65px;
              height: 65px;
              margin-right: 15px;
              background-image: linear-gradient(
                -41deg,
                #2b9af3 0%,
                #4bb1fa 100%
              );
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-flow: column;
              color: #ffffff;
              font-size: 13px;
            "
          >
            <img
              src="../../../assets/clock.png"
              style="width: 45%; margin-bottom: 5px"
            />
            {{ timeFomat }}
          </div>
          <div style="flex: 1">
            <div style="margin-bottom: 5px">ID：{{ userId }}</div>
            <div style="display: flex; align-items: center">
              <span
                style="
                  font-size: 23px;
                  color: rgb(38, 158, 253);
                  display: flex;
                  align-items: flex-start;
                "
                >{{ userInfo.level
                }}<i style="font-size: 12px; font-style: normal; margin: 0 5px"
                  >level</i
                ></span
              >
              <span class="css2">
                <span
                  class="css1"
                  :style="{ width: (userInfo.level / 396) * 100 + '%' }"
                ></span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <title-label :title="title" :labelList="wordExplains.data"></title-label>
      <div style="padding: 0 20px">
        <div
          style="
            color: #181818;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
          "
        >
          {{ title }}
        </div>
        <div
          ref="contentRef"
          id="content-wrapper"
          style="
            color: #4a4a4a;
            line-height: 22px;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: keep-all;
            white-space: pre-line;
          "
          v-html="content"
          @click="popVis"
        ></div>
      </div>

      <!-- 弹出层 -->
      <popup
        :menu="menu"
        :width="280"
        ref="popupRef"
        :sentence="currenSentence"
        @menuItemClick="menuItemClick"
        :articleId="articleId"
        :readLogId="readLogId"
        @close="hideTextColorHandler"
      />
      <!-- 弹出层 -->

      <!-- 哪里不懂点哪里 -->
      <click-where :articleId="articleId"></click-where>

      <!-- 哪里不懂点哪里 -->

      <!-- 三个按钮 -->
      <div
        class="text-center font-bold"
        style="padding-top: 20px"
        v-if="getting"
      >
        获取中...
      </div>
      <div
        class="flex align-center justify-center"
        style="margin-top: 20px"
        v-if="store.state.userId"
      >
        <button
          style="
            background-color: #ec5f74;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            margin: 0 5px;
          "
          class="text-white font-bold"
          @click="changeArticle('tooHard')"
        >
          看不懂
        </button>
        <button
          style="
            background-color: #9adfbf;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
          "
          class="text-white font-bold"
          @click="changeArticle('changeSubject')"
        >
          换主题
        </button>
      </div>
      <!-- 三个按钮 -->

      <div
        style="
          box-sizing: border-box;
          height: 1px;
          width: 99%;
          border-bottom: 1px solid #9a9a9a;
          margin: 20px auto 5px;
        "
      ></div>

      <Questions
        v-if="bShowQuestions && store.state.userId"
        :articleId="articleId"
        :readLogId="readLogId"
        :timestamp="timestamp"
      ></Questions>

      <div
        class="text-center"
        style="
          font-size: 4px;
          font-style: italic;
          color: #ababab;
          padding-bottom: 150px;
        "
      >
        标识号: 09383181-F271-G153-S162-W271-3522
      </div>
    </div>
    <div class="footer">
      <a
        href="javascript: void(0)"
        style="color: #35b9ff"
        @click="router.push({ name: 'index', query: { pid: pid } })"
      >
        <img src="../../../assets/new/8.png" />
        原版阅读
      </a>
      <a
        href="javascript: void(0)"
        @click="router.push({ name: 'photo', query: { pid: pid } })"
      >
        <img src="../../../assets/new/9.png" />
        AI工具
      </a>
      <a
        href="javascript: void(0)"
        @click="router.push({ name: 'my', query: { pid: getLocalPid() } })"
      >
        <img src="../../../assets/new/10.png" />
        个人中心
      </a>
    </div>
  </div>
</template>

<script setup>
import { getLocalPid } from "../../../libs/util";
import { Highlight, removeActive } from "../../../libs/Highlight.js";
import popup from "../popup/popup.vue";
import clickWhere from "./click-where.vue";
// import liveClass from "./live-class.vue";
import Header from "../../../components/header.vue";
import Questions from "./questions.vue";
import titleLabel from "./title_label.vue";
import { wechatSharefund } from "../../../libs/wechat_record.js";
import { onMounted, ref, reactive, computed, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  articleEnter,
  articleAAr,
  bizTts,
  bizOralscore,
  articleNext,
} from "../../../api/index";
const isMobile = computed(() => {
  let userAgentInfo = navigator.userAgent;
  let Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  let getArr = Agents.filter((i) => userAgentInfo.includes(i));
  return getArr.length ? true : false;
});
const store = useStore();
const router = useRouter();
const route = useRoute();

const time = ref(0);
let keepOrigStyles = "";
let maxLevelSentences = [];
let maxLevelWords = [];
let outStandardWords = [];
const currentText = ref("");
const currenSentence = ref("");
const content = ref("");
let countdown = 0;
const timestamp = ref(0);
const title = ref("");
const readLogId = ref(0);
const wordExplains = reactive({ data: [] });
const articleId = ref(0);
const bShowQuestions = ref(false);
const contentRef = ref(null);
const popupRef = ref(null);
const menu = [
  {
    name: "单词翻译",
    event: "search",
  },
  {
    name: "语法分析",
    event: "analyse",
  },
  {
    name: "句子翻译",
    event: "translate",
  },
  {
    name: "智能朗读",
    event: "speak",
  },
  {
    name: "语音评分",
    event: "record",
  },
  {
    name: "复制句子",
    event: "copy",
  },
  {
    name: "名师在线",
    event: "teacher",
  },
  {
    name: "更多资源",
    event: "more",
  },
];
const getting = ref(false);
const safeMes = computed(() => store.state.safeMes);
const jsApiTicket = computed(() => store.state.jsApiTicket);
const userInfo = computed(() => store.state.userInfo);
const userId = computed(() => store.state.userId);
onMounted(() => {
  store.commit("saveArticleId", route.query.id);
  let documentTitle = window.localStorage.getItem("title");
  if (documentTitle) document.title = documentTitle;
  if (!safeMes.value.sign) store.commit("saveSafeMes");
  getArticleData();
  const t = setInterval(() => {
    if (countdown > 0) {
      time.value = countdown;
      timerMinus();
      clearInterval(t);
    }
  }, 500);
});
const timeFomat = computed(() => {
  if (time.value < 0) {
    return "0:00";
  }
  if (time.value % 60 < 10) {
    return Math.floor(time.value / 60) + " : 0" + (time.value % 60);
  }
  return Math.floor(time.value / 60) + ":" + (time.value % 60);
});
const offset = computed(() => {
  if (!currentText.value || !currenSentence.value) return -1;
  return currenSentence.value.indexOf(currentText.value);
});

watch(currenSentence, (v) => {
  store.commit("changeSentence", v);
});
watch(currentText, (v) => {
  console.log(v);
  console.log("vvvvvvvvvv");
  store.commit("changeWord", v);
});
watch(offset, (v) => {
  store.commit("changeOffset", v);
});
const timerMinus = () => {
  setInterval(() => {
    time.value--;
  }, 1000);
};
const onContentContainerLoad = () => {
  let arr = contentRef.value.getElementsByTagName("IMG");
  for (let i = 0; i < arr.length; i++) {
    arr[i].style.width = "100%";
    arr[i].style.height = "auto";
    arr[i].style.maxWidth = "100%";
    arr[i].style.justifyContent = "center";
  }
};
const getArticleData = () => {
  let id = route.query.id;
  if (!id) id = localStorage.getItem("articleId");
  else {
    localStorage.setItem("articleId", id);
  }
  articleId.value = id;
  let obj = {
    ...safeMes.value,
    articleId: id,
    pid: getLocalPid(),
  };
  Promise.all([
    articleEnter(encodeURIComponent(JSON.stringify(obj))),
    articleAAr(encodeURIComponent(JSON.stringify(obj))),
  ])
    .then(async (res) => {
      let data = res[0].data;
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      let ret = data.data;
      content.value = ret.content;
      readLogId.value = ret.readLogId;
      countdown = ret.countdown;
      timestamp.value = ret.timestamp;
      keepOrigStyles = ret.keepOrigStyles;
      title.value = ret.title;
      store.commit("saveArticleTitle", title.value);

      if (safeMes.value.sign) {
        if (!jsApiTicket.value) {
          store.dispatch("getWxAppIdAndJsapi_ticket");
        } else {
          wechatSharefund();
        }
      }
      wordExplains.data = ret.wordExplains;
      maxLevelSentences = res[1].data.data.maxLevelSentences || [];
      maxLevelWords = res[1].data.data.maxLevelWords || [];
      outStandardWords = res[1].data.data.outStandardWords || [];
      maxLevelSentences = maxLevelSentences.map((item) => {
        const prefix = item.split(/[\\.|\\?|!|！|？|。]\s*["|”]/)[0];
        let sss = "";
        if (prefix.length > (item.length / 4) * 3) {
          sss = prefix;
        } else {
          sss = item;
        }
        return sss;
      });
      await nextTick();
      onContentContainerLoad();
      Highlight(
        contentRef.value,
        maxLevelSentences,
        maxLevelWords,
        outStandardWords
      );
      bShowQuestions.value = true;
    })
    .catch(() => {
      return ElMessage.error("获取文章内容失败");
    });
};
const copyHandler = (txt = "") => {
  let iscopy = false;
  if (document) {
    let textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = txt;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      iscopy = true;
    } catch (err) {
      console.log("不能使用这种方法复制内容" + err.toString());
    }
    document.body.removeChild(textArea);
  }
  return iscopy;
};
const speakHandler = (value) => {
  let id = route.query.id;
  if (!id) {
    id = localStorage.getItem("articleId");
  } else {
    localStorage.setItem("articleId", id);
  }
  articleId.value = id;
  let obj = {
    ...safeMes.value,
    articleId: id,
    readLogId: readLogId.value,
    content: encodeURI(value),
  };
  bizTts(encodeURIComponent(JSON.stringify(obj))).then(
    ({ data: { code, msg } }) => {
      if (code !== 0) {
        ElMessage.error(msg || "操作失败！");
      }
    }
  );
};
const remarkHandler = () => {
  let id = route.query.id;
  if (!id) id = localStorage.getItem("articleId");
  else {
    localStorage.setItem("articleId", id);
  }

  articleId.value = id;
  let obj = {
    ...safeMes.value,
    articleId: id,
    cardNumber: "",
  };
  bizOralscore(encodeURIComponent(JSON.stringify(obj))).then(
    ({ data: { code, msg } }) => {
      if (code !== 0) {
        ElMessage.error(msg || "操作失败！");
      }
    }
  );
};
const menuItemClick = ({ event }) => {
  console.log(event);
  console.log("**********");
  if (event === "search") {
    speakHandler(currentText.value);
  } else if (event === "copy") {
    const isOk = copyHandler(currenSentence.value);
    if (isOk) {
      ElMessage.success("复制成功！");
    }
  } else if (event === "speak") {
    speakHandler(currenSentence.value);
  } else if (event === "remark") {
    remarkHandler();
  }
};
const popVis = (e) => {
  if (
    !e.target ||
    !e.target.classList.contains("word") ||
    !e.target.textContent.trim()
  ) {
    return;
  }
  const parent = e.target.parentNode;
  if (parent && parent.childNodes) {
    if (keepOrigStyles) {
      currenSentence.value = [...parent.childNodes].reduce((t, v) => {
        const s = v.childNodes[0] && v.childNodes[0].nodeValue;
        if (s) {
          t += s;
        }
        return t;
      }, "");
    } else {
      currenSentence.value = parent.textContent.trim();
    }
  }
  console.log(e);
  console.log(e.target.childNodes[0].nodeValue);
  console.log("eeeeeeee");
  const text = e.target.childNodes[0].nodeValue;
  currentText.value = text || "";
  popupRef.value.show(e.pageX + 15, e.pageY + 10);
};

const changeArticle = (type) => {
  console.log(getLocalPid());
  let obj = {
    ...safeMes.value,
    articleId: articleId.value,
    readLogId: readLogId.value,
    timestamp: timestamp.value,
    reason: type,
    pid: getLocalPid(),
  };
  getting.value = true;
  articleNext(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      let data = res.data;
      if (data.code) {
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      }
      let ret = data.data;
      let href = window.location.href;
      window.location.href =
        href.substring(0, href.lastIndexOf("/")) +
        "/article?id=" +
        ret.articleId +
        "&pid=" +
        getLocalPid();
    })
    .catch(() => {
      getting.value = false;
      return ElMessage.error("获取文章失败");
    });
};
const hideTextColorHandler = () => {
  removeActive();
};
</script>

<style scoped lang="less">
.container {
  .bg-white {
    img {
      max-width: 100%;
    }
    ::v-deep .sentence {
      font-size: 20px;
    }
    ::v-deep .sentence .word {
      font-size: 20px;
    }

    .footer {
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      position: fixed;
      width: 100%;
      bottom: 0;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
      a {
        font-size: 0.5rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #808080;
        line-height: 0.7rem;
        text-align: center;
        img {
          height: 1.1rem;
          display: block;
          margin: 0 auto;
          margin-bottom: 0.175rem;
        }
      }
    }
  }
}

.containerPc {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  background: url(http://localhost:8080/img/56.c6a378cc.png) no-repeat;
  background-size: 100% 100%;
  .bg-white {
    width: 750px;
    height: 80%;
    overflow-y: scroll;
    margin: 0 auto;
    img {
      max-width: 100%;
    }
    ::v-deep .sentence {
      font-size: 20px;
    }
    ::v-deep .sentence .word {
      font-size: 20px;
    }
  }
  .footer {
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    width: 750px;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
    a {
      font-size: 0.5rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #808080;
      line-height: 0.7rem;
      text-align: center;
      img {
        height: 1.1rem;
        display: block;
        margin: 0 auto;
        margin-bottom: 0.175rem;
      }
    }
  }
}
</style>
