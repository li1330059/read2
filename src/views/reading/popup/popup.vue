<!-- 使用场景: 文章页面 - 弹出菜单 - 单词翻译|句子翻译 -->
<template>
  <div v-if="status">
    <div
      v-if="menuVis"
      :style="
        'left:' + left + 'px;top:' + (top + 5) + 'px;width:' + width + 'px;'
      "
      class="flex align-center items css1"
    >
      <div v-for="(item, index) in menu" :key="index" style="width: 48%">
        <div
          class="flex text-white align-center justify-center css11"
          @click="popEvent(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div @click="allHide" class="css10"></div>
    <!-- 遮罩层 -->

    <!-- 分析 -->
    <div v-if="analyseVis" class="css9">
      <div>
        <div class="flex">
          <div class="css8">
            {{ sentence }}
          </div>
        </div>
        <div id="scroll" ref="scroll" class="css7"></div>
        <analyse
          :articleId="articleId"
          :readLogId="readLogId"
          :type="'component'"
          :bodyStyle="'flex-1;'"
          @toView="toView"
        ></analyse>
      </div>
    </div>
    <!-- 分析 -->

    <!-- 句子翻译 -->
    <div
      v-if="translateVis"
      class="css4"
      :style="
        'left:' + left + 'px;top:' + (top + 5) + 'px;width:' + width + 'px;'
      "
    >
      <div class="flex">
        <div class="css6">
          {{ sentence }}
          <span style="display: flex;align-items: center;flex: 0 0 30px;height: 20px;" @click="toSpeak">
            <img
              v-if="audioUrl"
              src="../../../assets/laba.png"
              style="width: 15px; height: 15px"
            />
          </span>
        </div>
      </div>
      <div
        style="height: 1px; background-color: #ececec; margin-top: 3px"
      ></div>
      <div style="margin-top: 5px; margin-bottom: 5px; color: #032b72">
        {{ translateVal }}
      </div>
    </div>
    <!-- 句子翻译 -->

    <!-- 查单词 -->
    <div
      v-if="wordVis"
      class="css5"
      :style="
        'left:' + left + 'px;top:' + (top + 5) + 'px;width:' + width + 'px;'
      "
    >
      <div class="flex">
        <div style="color: rgb(3, 43, 114);display: flex;align-items: center;">
          {{ word }}
        </div>
        <div style="display: flex;align-items: center;width: 40px;height: 20px;" @click="toSpeak">
          <img
            v-if="audioUrl"
            src="../../../assets/laba.png"
            style="margin-left: 5px; width: 15px; height: 15px"
          />
        </div>
      </div>

      <div
        style="height: 1px; background-color: #ececec; margin-top: 3px"
      ></div>
      <div style="height: 20px" class="flex align-center">
        [<span v-if="translateVal && translateVal.phonetic">{{
          translateVal.phonetic
        }}</span
        >]
      </div>
      <div
        v-if="translateVal && translateVal.translations"
        style="margin-top: 5px; margin-bottom: 5px"
      >
        <div
          v-for="(item, index) in translateVal.translationsV2"
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

      <div v-if="translateVal && translateVal.lemma" style="font-style: italic">
        <div style="height: 2px; background-color: #ccc; margin-top: 3px"></div>
        <div style="margin-left: 5px; margin-right: 5px">
          <div style="width: 90%; padding-left: 5px; padding-top: 5px">
            <span>原型:</span><br />
            <span>{{ translateVal.lemma.word }}</span
            ><br />
            <span v-if="translateVal.lemma.phonetic" style="color: #485860">{{
              "[ " + translateVal.lemma.phonetic + " ]"
            }}</span>
          </div>
          <div
            v-for="(item, index) in translateVal.lemma.translationsV2"
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
      </div>
    </div>
    <!-- 查单词 -->

    <!-- 录音 -->
    <div
      v-if="recordVis"
      class="css2"
      :style="
        'left:' + left + 'px;top:' + (top + 5) + 'px;width:' + width + 'px;'
      "
    >
      <div class="flex">
        <div class="css3">
          {{ sentence }}
        </div>
      </div>

      <div
        style="height: 1px; background-color: #ececec; margin-top: 3px"
      ></div>
      <record
        @secondeHide="secondHide"
        ref="recordRef"
        :stopRecord="stopRecord"
      ></record>
    </div>
    <!-- 录音 -->
  </div>
</template>

<script setup>
import { defineProps, watch, ref, nextTick, defineEmits, computed } from "vue";
import record from "../record/record.vue";
import analyse from "../analyse/analyse.vue";
import { useStore, defineExpose } from "vuex";
import { getLocalPid } from "../../../libs/util";
import { ElMessage } from "element-plus";
import { bizTts, urlService, translate } from "../../../api/index";
import { useRouter } from "vue-router";
const store = useStore();
const emit = defineEmits(["noPopup", "close", "noPopup", "menuItemClick"]);
const sentence = computed(() => {
  return store.state.sentence
})
const word = computed(() => {
  return store.state.word
})
const offset = computed(() => {
  return store.state.offset
})
const safeMes = computed(() => {
  return store.state.safeMes
})

const recordRef = ref(null);
const router = useRouter();
const props = defineProps({
  menu: {
    type: Array,
    default() {
      return [];
    },
  },
  width: {
    type: Number,
    default: 0,
  },
  articleId: {
    type: [Number, String],
    default: 0,
  },
  readLogId: {
    type: [Number, String],
    default: 0,
  },
});
const status = ref(false);
const left = ref(0);
const top = ref(0);
const analyseVis = ref(false);
const translateVis = ref(false);
const wordVis = ref(false);
const translateVal = ref("");
const menuVis = ref(true);
const audioUrl = ref("");
const recordVis = ref(false);
let spk = false;
let ison = false;
let odl = null;
let maxX = 0;
const stopRecord = ref(false);
let justTrans = false;
watch(audioUrl, (newValue) => {
  if (newValue == "") return;
  if (spk) toSpeak();
});
const toView = () => {
  setTimeout(() => {
    window.scrollTo(0, top.value + 50);
  }, 100);
};

const allHide = () => {
  if (
    translateVis.value ||
    wordVis.value ||
    analyseVis.value ||
    recordVis.value
  ) {
    secondHide();
  } else {
    hide();
  }
};
const hide = () => {
  if (translateVis.value) return;
  if (wordVis.value) return;
  if (analyseVis.value) return;
  if (recordVis.value) return;
  status.value = false;
  menuVis.value = true;
  ison = false;
  emit("noPopup");
  justTrans = false;
  emit("close");
};
const secondHide = () => {
  if (recordVis.value) {
    recordRef.value.stop();
  }
  translateVis.value = false;
  analyseVis.value = false;
  wordVis.value = false;
  status.value = false;
  menuVis.value = true;
  recordVis.value = false;
  spk = false;
  ison = false;
  if (odl) odl.pause();
  emit("noPopup");
  stopRecord.value = false;
  justTrans = false;
  emit("close");
};
const popEvent = async (item) => {
  switch (item.event) {
    case "search":
      wordVis.value = true;
      getTranslate();
      break;
    case "teacher":
      if (!safeMes.value.sign) {
        ElMessage.warning("登录后才能使用这些功能哦");
        break;
      }
      getTeacherAddress();
      break;
    case "analyse":
      menuVis.value = false;
      await nextTick();
      analyseVis.value = true;

      break;
    case "translate":
      justTrans = true;
      translateVis.value = true;
      getTranslate();
      break;
    case "speak":
      translateVis.value = true;
      getTranslate(1);
      break;
    case "record":
      if (!safeMes.value.sign) {
        ElMessage.warning("登录后才能使用这些功能哦");
        break;
      }
      menuVis.value = false;
      recordVis.value = true;

      break;
    default:
      hide();
      emit("menuItemClick", item);
      break;
  }
};
const getTranslate = (type = 0) => {
  audioUrl.value = "";
  translateVal.value = null;
  menuVis.value = false;
  if (type) {
    spk = true;
    return getSpeaker();
  }
  let obj = {
    ...safeMes.value,
    articleId: props.articleId - 0,
    readLogId: props.readLogId - 0,
    content: translateVis.value ? sentence.value : word.value,
    sentence: translateVis.value ? "" : sentence.value,
    offset: translateVis.value ? 0 : offset.value - 0,
  };
  console.log(obj)
  translate(encodeURIComponent(JSON.stringify(obj)))
    .then((v) => {
      console.log(v);
      if (v.data.code)
        return store.commit("judgeCode", {
          code: v.data.code,
          msg: v.data.msg,
        });
      const data = v.data.data;
        console.log(data)
      translateVal.value = data.sentenceResult
        ? data.sentenceResult.translate
        : data.wordResult;
      console.log(translateVal.value);
      console.log("-----------------");
      if (!justTrans) getSpeaker();
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error(err);
    });
};

const getSpeaker = () => {
  try {
    menuVis.value = false;
    let obj = {
      ...safeMes.value,
      articleId: props.articleId - 0,
      readLogId: props.readLogId - 0,
      content: translateVis.value ? sentence.value : word.value,
    };
    bizTts(encodeURIComponent(JSON.stringify(obj)))
      .then((v) => {
        if (v.data.code)
          return store.commit("judgeCode", {
            code: v.data.code,
            msg: v.data.msg,
          });
        audioUrl.value = v.data.data.audioUrl;
      })
      .catch((err) => {
        ElMessage.error(err);
      });
  } catch (err) {
    ElMessage.error(JSON.stringify(err) + "1");
  }
};
// eslint-disable-next-line no-unused-vars
const show = (v1, v2) => {
  maxX = document.body.clientWidth - props.width;
  left.value = v1 > maxX ? maxX / 2 : v1;
  top.value = v2;
  status.value = true;
};
const toSpeak = () => {
  if (!ison) {
    try {
      odl = new Audio();
      odl.src = audioUrl.value;
      odl.play();
      ison = true;
      odl.addEventListener("ended", () => {
        ison = false;
      });
    } catch (err) {
      ElMessage.error(JSON.stringify(err));
    }
  }
};
const getTeacherAddress = () => {
  let obj = {
    ...safeMes.value,
    pid: getLocalPid(),
  };
  urlService(encodeURIComponent(JSON.stringify(obj)))
    .then((v) => {
      if (v.data.code === 10015) return router.push("/teacher");
      if (v.data.code) return ElMessage.error(v.data.msg);

      if (v.data) {
        window.location.href = v.data.data;
      }
    })
    .catch((err) => {
      return ElMessage.error(err + " 获取名师地址失败 ");
    });
};
defineExpose({
  show,
});
</script>

<style scoped>
.items > div > div {
  margin-bottom: 12px;
}
.items > div:nth-child(8) > div,
.items > div:nth-child(7) > div {
  margin-bottom: 0;
}
.items {
  position: relative;
}
.css1 {
  z-index: 5;
  position: absolute;
  flex-wrap: wrap;
  background-color: #ffffff;
  border-radius: 5px;
  box-sizing: content-box;
  padding: 20px;
  justify-content: space-between;
  box-shadow: 0 2px 23px 0 rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}
.css2 {
  z-index: 5;
  position: absolute;
  flex-wrap: wrap;
  background-color: #ffffff;
  border-radius: 5px;
  box-sizing: content-box;
  padding: 20px;
  justify-content: space-between;
  box-shadow: 0 2px 23px 0 rgba(0, 0, 0, 0.5);
  width: 280px;
}
.css3 {
  width: 100%;
  padding-left: 5px;
  padding-top: 5px;
  word-break: break-all;
  color: #032b72;
}
.css4 {
  z-index: 5;
  position: absolute;
  flex-wrap: wrap;
  background-color: #ffffff;
  border-radius: 5px;
  box-sizing: content-box;
  padding: 20px;
  justify-content: space-between;
  box-shadow: 0 2px 23px 0 rgba(0, 0, 0, 0.5);
  width: 280px;
}
.css5 {
  z-index: 5;
  position: absolute;
  flex-wrap: wrap;
  background-color: #ffffff;
  border-radius: 5px;
  box-sizing: content-box;
  padding: 20px;
  justify-content: space-between;
  box-shadow: 0 2px 23px 0 rgba(0, 0, 0, 0.5);
  width: 280px;
  box-sizing: border-box;
}
.css6 {
  width: 100%;
  color: #032b72;
  word-break: break-all;
  display: flex;
  align-items: center;
}
.css7 {
  height: 1px;
  background-color: #ececec;
  margin-top: 3px;
  margin-bottom: 6px;
}
.css8 {
  color: #000;
  width: 100%;
  padding-left: 5px;
  padding-top: 5px;
  word-break: break-all;
  color: #032b72;
}
.css9 {
  z-index: 5;
  background-color: #ffffff;
  position: fixed;
  padding: 20px;
  border-radius: 5px;
  flex-wrap: wrap;
  border-radius: 5px;
  box-sizing: content-box;
  justify-content: space-between;
  box-shadow: 0 2px 23px 0 rgb(0 0 0 / 50%);
  box-sizing: border-box;
  width: 90%;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  max-height: 80%;
  height: auto;
  overflow-y: scroll;
}
.css10 {
  background-color: rgba(231, 231, 231, 0.2);
  z-index: 2;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.css11 {
  width: 100%;
  height: 36px;
  background: #ddebff;
  border: 1px solid #0086f0;
  border-radius: 100px;
  color: #0086f0;
}
</style>
