<template>
  <div style="margin-top: 10px">
    <button class="button" type="button" v-if="!inGetting">获取权限中</button>

    <button @click="onButtonClick" class="button" type="button" v-else>
      {{ stateText }}
    </button>
    <div v-if="ini" style="color: black">评定中...</div>
    <div style="color: black" v-if="remark" v-html="remark"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineEmits, defineExpose, computed } from "vue";
import { getLocalPid } from "../../../libs/util";
import { ElMessage } from "element-plus";
import { bizOralscore } from "../../../api/index";
import wx from "weixin-js-sdk";
import { useStore } from "vuex";
const store = useStore();
const emit = defineEmits(["secondeHide"]);
const safeMes = computed(() => store.state.safeMes);
const sentence = computed(() => store.state.sentence);
const inGetting = computed(() => store.state.inGetting);
const state = ref(false);
let localId = 0;
let serverId = 0;
const remark = ref("");
const stateText = ref("开始录音");
const ini = ref(false);
onMounted(() => {
  store.commit("changeGettingStatus", 0);
  store.dispatch("getWxAppIdAndJsapi_ticket", "record");
});

const getRemark = (result) => {
  stateText.value = "我的语音评分";
  state.value = false;
  var html = "";
  if (result.overall) html += "总分(overall): " + result.overall + "<br/>";
  if (result.fluency) html += "流利度(fluency): " + result.fluency + "<br/>";
  if (
    typeof result.pronunciation !== "undefined" &&
    result.pronunciation !== null
  ) {
    html += "发音(pronunciation): " + result.pronunciation + "<br/>";
  }
  if (typeof result.speed !== "undefined" && result.speed !== null) {
    html += "语速(speed): " + result.speed + "个/min<br/>";
  }
  if (typeof result.plosion !== "undefined" && result.plosion !== null) {
    html += "爆破音(plosion): " + result.plosion + "<br/>";
  }
  if (typeof result.stress !== "undefined" && result.stress !== null) {
    html += "单词重音(stress): " + result.stress + "<br/>";
  }
  if (typeof result.prominence !== "undefined" && result.prominence !== null) {
    html += "句子单词重读(prominence): " + result.prominence + "<br/>";
  }
  if (typeof result.rhythm !== "undefined" && result.rhythm !== null) {
    html += "韵律度(rhythm): " + result.rhythm + "<br/>";
  }
  if (typeof result.phonemes !== "undefined" && result.phonemes !== null) {
    html += "音素(phonemes): " + result.phonemes + "<br/>";
  }
  if (typeof result.integrity !== "undefined" && result.integrity !== null) {
    html += "完整度(integrity): " + result.integrity + "<br/>";
  }
  if (typeof result.coherence !== "undefined" && result.coherence !== null) {
    html += "逻辑准确性(coherence): " + result.coherence + "<br/>";
  }
  if (typeof result.phonics !== "undefined" && result.phonics !== null) {
    html += "发音字母组合(phonics): " + result.phonics + "<br/>";
  }
  if (result.words && result.words.length > 0) {
    html += "详细得分：<br/>";
    for (var i = 0; i < result.words.length; i++) {
      html +=
        "&nbsp;&nbsp;&nbsp;" +
        result.words[i].word +
        ": " +
        result.words[i].scores.overall +
        "<br/>";
    }
  }
  remark.value = html;
};

const uploadVoice = () => {
  wx.uploadVoice({
    localId: localId,
    isShowProgressTips: 1,
    success: function (res) {
      serverId = res.serverId;
      bizOralscore(
        encodeURIComponent(
          JSON.stringify({
            ...safeMes.value,
            pid: getLocalPid(),
            wxAudioServerId: serverId,
            sentence: sentence.value,
          })
        )
      )
        .then((r) => {
          if (res.code) return ElMessage.error(r.msg);
          console.log(r.data);
          ini.value = false;
          getRemark(r.data.data);
        })
        .catch((err) => {
          stateText.value = "开始录音";
          state.value = false;
          ElMessage.error(err + "语音评分失败");
        });
    },
    fail: function (err) {
      ElMessage.error(JSON.stringify(err) + "上传录音失败");
      ini.value = false;
      emit("secondeHide");
    },
  });
};
const onButtonClick = () => {
  if (state.value) {
    doStopRecord();
  } else {
    doStartRecord();
  }
};
const doStartRecord = () => {
  stateText.value = "点击结束录音";
  state.value = true;
  wx.onVoiceRecordEnd({
    complete: function (res) {
      onRecordSuccess(res);
    },
  });
  wx.startRecord();
};

// 点击遮罩层关闭并结束录音
// eslint-disable-next-line no-unused-vars
const stop = () => {
  if (state.value) return;
  wx.stopRecord({
    fail: function (err) {
      ElMessage.error(JSON.stringify(err) + "4");
      emit("secondeHide");
    },
    complete: function () {
      stateText.value = "开始录音";
      state.value = false;
    },
  });
};
// 停止录音
const doStopRecord = () => {
  wx.stopRecord({
    success: function (res) {
      // 录音成功后上传录音
      onRecordSuccess(res);
    },
    fail: function () {
      stateText.value = "开始录音";
      state.value = false;
      return ElMessage.warning("太短了，我没听清，再说一遍吧");
    },
    complete: function () {},
  });
};
// 录音成功后上传录音
const onRecordSuccess = (res) => {
  ini.value = true;
  localId = res.localId;
  uploadVoice();
};
defineExpose({
  stop,
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
}
.el-icon-info {
  color: #66a2ff;
}
</style>
