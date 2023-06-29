<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div class="bg-white" style="height: 100%">
      <Header :title="'AI超级工具'"></Header>
      <div style="padding: 50px 20px 0">
        <div
          style="
            background: #3a3f53;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
            border-radius: 19px;
            position: relative;
            color: #ffffff;
            padding: 25px 0;
            font-size: 17px;
          "
        >
          <div
            style="position: absolute; top: -23px; height: 46px; width: 100%"
          >
            <div class="css3">帮你解决阅读中的几大难题</div>
          </div>
          <div style="padding: 15px 20px 0">
            <div style="display: flex; align-items: end">
              <div style="padding-right: 10px">
                <p>复杂长难句别发愁，帮你找出主句和从句，拆分句子的主谓宾。</p>
                <br />
                <p>句子中多词性单词理解不用怕，帮你找到唯一词性解释。</p>
              </div>
              <img
                src="../../../assets/jqr2.png"
                style="flex: 0 0 80px; transform: rotateY(180deg)"
              />
            </div>
          </div>
        </div>

        <div
          style="
            margin: 20px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span style="font-size: 18px; color: #181818; flex: 0 0 70%"
            >请在下方文本框内输入一句英文，或者点击右侧相机拍照。</span
          >
          <div style="display: flex; flex-flow: column; align-items: center">
            <div class="css4">
              <img
                src="../../../assets/camera.png"
                style="width: 30px"
                @click="imgClick"
              />
            </div>
            <span style="color: #1483ff">拍照</span>
          </div>
        </div>

        <div
          style="
            background: #e7f6ff;
            border: 1px solid #0086f0;
            border-radius: 16px;
            padding: 20px;
          "
        >
          <textarea
            v-model="txt"
            :placeholder="none"
            style="
              border: 0 none;
              outline: none;
              width: 100%;
              color: #032b72;
              font-size: 17px;
              min-height: 140px;
              background: none;
            "
          ></textarea>
          <button type="button" class="css5" @click="navTo()">
            {{ isAnalyse ? "分析中..." : "点击分析" }}
          </button>
        </div>
      </div>

      <div class="box">
        <input
          style="display: none"
          type="file"
          name="cover"
          class="file"
          id="uploadFile"
          accept="image/*"
          capture="camera"
          multiple
          v-on:change="readLocalFile()"
        />
      </div>

      <analyse v-if="queryTxt" :queryTxt="queryTxt" />
      <div style="height: 6rem"></div>
      <div class="footer">
        <a
          href="javascript: void(0)"
          @click="router.push({ name: 'index', query: { pid: pid } })"
        >
          <img src="../../../assets/new/49.png" />
          原版阅读
        </a>
        <a
          href="javascript: void(0)"
          style="color: #35b9ff"
          @click="router.push({ name: 'photo', query: { pid: getLocalPid() } })"
        >
          <img src="../../../assets/new/50.png" />
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
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getLocalPid } from "../../../libs/util";
import { ElMessage } from "element-plus";
import { grammarSplit, ocr } from "../../../api/index";
import Header from "../../../components/header.vue";
import analyse from "../../../components/analyse2.vue";
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
const pid = getLocalPid();
const queryTxt = ref("");
const theRequest = [];
const txt = ref("");
let ct = "";
const isAnalyse = ref(false);
const none =
  "You can fill in an English sentence here so that you can get the part of speech of the word as well as the explanation of the grammatical knowledge of the sentence";
const safeMes = computed(() => store.state.safeMes);
onMounted(() => {
  if (location.search.indexOf("?") != -1) {
    let query = location.search.substring(1);
    let strs = query.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
});
const navTo = () => {
  queryTxt.value = "";
  toSegment();
};
//  断句
const toSegment = () => {
  let obj = {
    ...safeMes.value,
    articleId: 0,
    readLogId: 0,
    content: txt.value ? txt.value : none,
  };
  grammarSplit(encodeURIComponent(JSON.stringify(obj)))
    .then(({ data }) => {
      if (data.code) {
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      }
      let list = data.data.lineResults.map((v) => {
        return v.validLine;
      });
      queryTxt.value = list;
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error("请求失败");
    });
};
const imgClick = () => {
  document.getElementById("uploadFile").click();
}; //点击选中图片
const readLocalFile = () => {
  var localFile = document.getElementById("uploadFile").files[0];

  var reader = new FileReader();

  var content;
  reader.onload = function (event) {
    content = event.target.result;
    ct = content;
    isAnalyse.value = true;
    let obj = {
      ...safeMes.value,
      imgBase64: ct,
    };

    ocr(obj)
      .then(({ data }) => {
        console.log(data);
        if (data.code)
          return store.commit("judgeCode", {
            code: data.code,
            msg: data.msg,
          });
        txt.value = data.data;

        isAnalyse.value = false;
      })
      .catch((err) => {
        console.log(err);
        ElMessage.error(JSON.stringify(err));
        isAnalyse.value = false;
      });
  };

  reader.onerror = function () {
    alert("error");
  };

  content = reader.readAsDataURL(localFile, "UTF-8");
};
</script>

<style scoped lang="less">
.container {
  @media screen and (max-width: 767px) {
    .box {
      width: 360px;
    }
    .banner-img {
      height: 240px;
    }
    .banner-div {
      top: 31px;
    }
    .text-title {
      font-size: 19px;
    }
    .text-photo {
      font-size: 14px;
    }
    .first-banner {
      height: 240px;
    }
    .left-margin {
      font-size: 12px;
      margin-left: 100px;
      width: 233px;
      line-height: 24px;
      margin-top: 20px;
    }
    .camera {
      width: 50px;
      height: 50px;
    }
    .bg-textarea {
      height: 181px;
      padding: 50px 36px;
    }
    .notice {
      width: 20px;
      height: 20px;
    }
    .notice-text {
      font-size: 11px;
    }
    .analyse-button {
      width: 215px;
      height: 55px;
      font-size: 17px;
    }
    .analyse-img {
      width: 40px;
      height: 40px;
    }
    .analyse-text {
      font-size: 11px;
    }
  }
  /* //	在小屏幕下  把container的布局容器宽度设为 750px */
  @media screen and (min-width: 768px) {
    .first-banner {
      height: 450px;
    }
    .banner-img {
      height: 450px;
    }
    .box {
      width: 750px;
    }
    .left-margin {
      font-size: 30px;
      margin-left: 210px;
      width: 478px;
      margin-top: 50px;
      line-height: 50px;
    }
    .banner-div {
      top: 70px;
    }
    .text-title {
      font-size: 40px;
    }
    .text-second {
      font-size: 30px;
    }
    .text-photo {
      font-size: 30px;
    }
    .camera {
      width: 95px;
      height: 95px;
    }
    .bg-textarea {
      height: auto;
      padding: 100px 75px;
    }
    .notice {
      width: 40px;
      height: 40px;
    }
    .notice-text {
      font-size: 24px;
    }
    .analyse-button {
      width: 449px;
      height: 115px;
      font-size: 36px;
    }
    .analyse-img {
      width: 90px;
      height: 90px;
    }
    .analyse-text {
      font-size: 24px;
    }
  }
  .box {
    margin: 0 auto;
  }
  /* 第一大图 */
  .banner-img {
    width: 100%;
  }
  .banner-div {
  }
  .text-title {
  }
  .bg-textarea {
    background-image: url(../../../../public/img/input3.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: 0px;
    resize: none;
    width: 100%;

    outline: none;
  }
  .text-area-top {
    background-image: url(../../../../public/img/input1.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: 0px;
    resize: none;
    width: 100%;
  }
  .text-area-bottom {
    background-image: url(../../../../public/img/input2.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: 0px;
    resize: none;
    width: 100%;
  }
  /* 分析按钮 */
  .analyse-button {
    background-image: url(../../../../public/img/buttton2.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .css3 {
    width: 70%;
    height: 46px;
    background-image: linear-gradient(180deg, #09b7cb 0%, #4515ec 100%);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    border-radius: 23px;
    text-align: center;
    line-height: 46px;
    margin: 0 auto;
  }
  .css4 {
    background-image: linear-gradient(231deg, #00b4ff 0%, #1a74ff 100%);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 4px solid rgb(183, 217, 253);
    margin-bottom: 5px;
  }
  .css5 {
    width: 160px;
    height: 45px;
    background-image: linear-gradient(-58deg, #2b9af3 6%, #4bb1fa 100%);
    border-radius: 100px;
    outline: none;
    border: 0 none;
    color: #ffffff;
    font-size: 17px;
    margin: 0 auto;
    display: block;
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
.containerPc {
  background: url(http://localhost:8080/img/56.c6a378cc.png) no-repeat;
  background-size: 100% 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .bg-white {
    width: 750px;
    height: 80% !important;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  @media screen and (max-width: 767px) {
    .box {
      width: 360px;
    }
    .banner-img {
      height: 240px;
    }
    .banner-div {
      top: 31px;
    }
    .text-title {
      font-size: 19px;
    }
    .text-photo {
      font-size: 14px;
    }
    .first-banner {
      height: 240px;
    }
    .left-margin {
      font-size: 12px;
      margin-left: 100px;
      width: 233px;
      line-height: 24px;
      margin-top: 20px;
    }
    .camera {
      width: 50px;
      height: 50px;
    }
    .bg-textarea {
      height: 181px;
      padding: 50px 36px;
    }
    .notice {
      width: 20px;
      height: 20px;
    }
    .notice-text {
      font-size: 11px;
    }
    .analyse-button {
      width: 215px;
      height: 55px;
      font-size: 17px;
    }
    .analyse-img {
      width: 40px;
      height: 40px;
    }
    .analyse-text {
      font-size: 11px;
    }
  }
  /* //	在小屏幕下  把container的布局容器宽度设为 750px */
  @media screen and (min-width: 768px) {
    .first-banner {
      height: 450px;
    }
    .banner-img {
      height: 450px;
    }
    .box {
      width: 750px;
    }
    .left-margin {
      font-size: 30px;
      margin-left: 210px;
      width: 478px;
      margin-top: 50px;
      line-height: 50px;
    }
    .banner-div {
      top: 70px;
    }
    .text-title {
      font-size: 40px;
    }
    .text-second {
      font-size: 30px;
    }
    .text-photo {
      font-size: 30px;
    }
    .camera {
      width: 95px;
      height: 95px;
    }
    .bg-textarea {
      height: auto;
      padding: 100px 75px;
    }
    .notice {
      width: 40px;
      height: 40px;
    }
    .notice-text {
      font-size: 24px;
    }
    .analyse-button {
      width: 449px;
      height: 115px;
      font-size: 36px;
    }
    .analyse-img {
      width: 90px;
      height: 90px;
    }
    .analyse-text {
      font-size: 24px;
    }
  }
  .box {
    margin: 0 auto;
  }
  /* 第一大图 */
  .banner-img {
    width: 100%;
  }
  .banner-div {
  }
  .text-title {
  }
  .bg-textarea {
    background-image: url(../../../../public/img/input3.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: 0px;
    resize: none;
    width: 100%;

    outline: none;
  }
  .text-area-top {
    background-image: url(../../../../public/img/input1.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: 0px;
    resize: none;
    width: 100%;
  }
  .text-area-bottom {
    background-image: url(../../../../public/img/input2.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: 0px;
    resize: none;
    width: 100%;
  }
  /* 分析按钮 */
  .analyse-button {
    background-image: url(../../../../public/img/buttton2.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .css3 {
    width: 70%;
    height: 46px;
    background-image: linear-gradient(180deg, #09b7cb 0%, #4515ec 100%);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    border-radius: 23px;
    text-align: center;
    line-height: 46px;
    margin: 0 auto;
  }
  .css4 {
    background-image: linear-gradient(231deg, #00b4ff 0%, #1a74ff 100%);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 4px solid rgb(183, 217, 253);
    margin-bottom: 5px;
  }
  .css5 {
    width: 160px;
    height: 45px;
    background-image: linear-gradient(-58deg, #2b9af3 6%, #4bb1fa 100%);
    border-radius: 100px;
    outline: none;
    border: 0 none;
    color: #ffffff;
    font-size: 17px;
    margin: 0 auto;
    display: block;
  }
  .footer {
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    width: 100%;
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
