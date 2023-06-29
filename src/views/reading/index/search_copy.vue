<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div class="header">
      <a href="javascript: void(0)" @click="router.go(-1)">
        <img src="../../../assets/new/31.png" />
      </a>
      所有文章
    </div>
    <div class="filter">
      <div class="selects">
        <button
          type="button"
          :class="{ active: searchParams.grade || gradesPicker === true }"
          @click="gradesPicker = true"
        >
          {{ searchParams.grade ? gradeName : "年级" }}
          <img
            src="../../../assets/new/35.png"
            v-if="searchParams.grade || gradesPicker === true"
          />
          <img src="../../../assets/new/36.png" v-else />
        </button>
        <button
          type="button"
          :class="{ active: searchParams.subject || subjectPicker === true }"
          @click="subjectPicker = true"
        >
          {{ searchParams.subject ? subjectName : "主题" }}
          <img
            src="../../../assets/new/35.png"
            v-if="searchParams.subject || subjectPicker === true"
          />
          <img src="../../../assets/new/36.png" v-else />
        </button>
      </div>
      <a href="javascript: void(0)" @click="searchAll">全部</a>
    </div>
    <div class="list">
      <div
        class="item"
        @click="navTo(item.articleId)"
        :key="index"
        v-for="(item, index) in articleData.data.recommendArticles"
      >
        <h4>{{ item.title }}</h4>
        <div>
          <span>难度：</span>
          <van-rate v-model="item.levelStar" color="#3FABFA" readonly />
        </div>
      </div>
      <div
        class="page"
        v-if="
          articleData.data.recommendArticles &&
          articleData.data.recommendArticles.length > 0
        "
      >
        <a href="javascript: void(0)" @click="onBtnClickPrevPage">
          <img src="../../../assets/new/37.png" />
        </a>
        <a href="javascript: void(0)" @click="onBtnClickNextPage">
          <img src="../../../assets/new/38.png" />
        </a>
      </div>
    </div>
    <div style="height: 6rem" v-if="isMobile"></div>
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
        @click="router.push({ name: 'photo', query: { pid: getLocalPid() } })"
      >
        <img src="../../../assets/new/9.png" />
        AI工具
      </a>
      <a
        href="javascript: void(0)"
        style="color: #35b9ff"
        @click="router.push({ name: 'my', query: { pid: getLocalPid() } })"
      >
        <img src="../../../assets/new/51.png" />
        个人中心
      </a>
    </div>
  </div>
  <van-popup v-model:show="gradesPicker" round position="bottom">
    <van-picker
      :columns="grades"
      :columns-field-names="gradesFieldName"
      @cancel="gradesPicker = false"
      @confirm="onSelectChangedGrade"
    />
  </van-popup>
  <van-popup v-model:show="subjectPicker" round position="bottom">
    <van-picker
      :columns="subjects.data"
      :columns-field-names="subjectFieldName"
      @cancel="subjectPicker = false"
      @confirm="onSelectChangedSubject"
    />
  </van-popup>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { getLocalPid } from "../../../libs/util";
import { articleSearch, articleSubjects } from "../../../api/index";
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
const pid = getLocalPid();
const router = useRouter();
const articleData = reactive({ data: {} });
const gradeName = ref("");
const subjectName = ref("");
const searchParams = reactive({
  grade: "",
  subject: "",
  pageSize: 6,
  pageIdx: 0,
});
const store = useStore();
const token = computed(() => store.state.token);
const userId = computed(() => store.state.userId);
const sign = computed(() => store.state.sign);
const grades = [
  { name: "全部", value: "" },
  { name: "小一上 (0起点)", value: "X1s" },
  { name: "小一下", value: "X1x" },
  { name: "小二上", value: "X2s" },
  { name: "小二下", value: "X2x" },
  { name: "小三上", value: "X3s" },
  { name: "小三下", value: "X3x" },
  { name: "小四上", value: "X4s" },
  { name: "小四下", value: "X4x" },
  { name: "小五上", value: "X5s" },
  { name: "小五下", value: "X5x" },
  { name: "小六上", value: "X6s" },
  { name: "小六下", value: "X6x" },
  { name: "初一上", value: "C1s" },
  { name: "初一下", value: "C1x" },
  { name: "初二上", value: "C2s" },
  { name: "初二下", value: "C2x" },
  { name: "初三上", value: "C3s" },
  { name: "初三下", value: "C3x" },
  { name: "高一上", value: "G1s" },
  { name: "高一下", value: "G1x" },
  { name: "高二上", value: "G2s" },
  { name: "高二下", value: "G2x" },
  { name: "高三上", value: "G3s" },
  { name: "高三下", value: "G3x" },
  { name: "大一上", value: "B1s" },
  { name: "大一下", value: "B1x" },
  { name: "大二上", value: "B2s" },
  { name: "大二下", value: "B2x" },
  { name: "大三上", value: "B3s" },
  { name: "大三下", value: "B3x" },
  { name: "大四上", value: "B4s" },
  { name: "大四下", value: "B4x" },
  { name: "研一上", value: "Y1s" },
  { name: "研一下", value: "Y1x" },
  { name: "研二上", value: "Y2s" },
  { name: "研二下", value: "Y2x" },
  { name: "研三上", value: "Y3s" },
  { name: "研三下", value: "Y3x" },
  { name: "研四上", value: "Y4s" },
  { name: "研四下", value: "Y4x" },
];
const subjects = reactive({ data: [] });
const gradesFieldName = {
  text: "name",
};
const subjectFieldName = {
  text: "name",
};
const searchAll = () => {
  searchParams.pageIdx = 0;
  searchParams.grade = "";
  searchParams.subject = "";
  searchArticles();
};
const navTo = (id) => {
  router.push({ name: "article", query: { id, pid } });
};
const searchArticles = () => {
  let obj = {
    userId: userId.value,
    token: token.value,
    sign: sign.value,
    pid: getLocalPid(),
    ...searchParams,
  };
  articleSearch(JSON.stringify(obj))
    .then((res) => {
      articleData.data = res.data.data;
    })
    .catch(() => {
      ElMessage.error("获取文章列表失败 请稍后再试");
    });
};
const loadSubjects = () => {
  let obj = {
    userId: userId.value,
    token: token.value,
    sign: sign.value,
    pid: getLocalPid(),
  };
  articleSubjects(JSON.stringify(obj))
    .then((res) => {
      subjects.data = [{ name: "全部", value: "" }].concat(
        res.data.data.map((item) => {
          return { name: item, value: item };
        })
      );
      console.log(subjects.data);
    })
    .catch(() => {
      ElMessage.error("获取文章主题列表失败 请稍后再试");
    });
};
const onBtnClickPrevPage = () => {
  searchParams.pageIdx--;
  if (searchParams.pageIdx < 0) searchParams.pageIdx = 0;
  searchArticles();
};
const onBtnClickNextPage = () => {
  searchParams.pageIdx++;
  searchArticles();
};
const gradesPicker = ref(false);
const subjectPicker = ref(false);
const onSelectChangedGrade = (data) => {
  searchParams.pageIdx = 0;
  searchParams.grade = data.value;
  gradeName.value = data.name;
  searchArticles();
  gradesPicker.value = false;
};
const onSelectChangedSubject = (data) => {
  searchParams.pageIdx = 0;
  searchParams.subject = data.value;
  subjectName.value = data.name;
  searchArticles();
  subjectPicker.value = false;
};
onMounted(async () => {
  loadSubjects();
  searchArticles();
});
</script>

<style lang="less" scoped>
.container {
  min-height: 100%;
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
  .list {
    padding: 0 0.75rem;
    background: #fff;
    .page {
      padding-top: 0.8rem;
      padding-bottom: 1.25rem;
      display: flex;
      justify-content: center;
      img {
        width: 1.125rem;
        margin: 0 0.95rem;
      }
    }
    .item {
      padding: 0.85rem 0 0.85rem 0.85rem;
      border-bottom: 1px solid #eeeeee;
      h4 {
        color: rgba(94, 94, 94, 1);
        font-size: 0.7rem;
        line-height: 1.275rem;
        font-weight: normal;
      }
      > div {
        > span {
          color: rgba(150, 150, 150, 1);
          font-size: 0.65rem;
          line-height: 1.275rem;
        }
      }
    }
    .item:last-child {
      border: 0 none;
    }
  }
  .filter {
    height: 2.75rem;
    background: #ffffff;
    display: flex;
    margin: 0.375rem 0;
    align-items: center;
    justify-content: space-between;
    padding-left: 0.525rem;
    padding-right: 1.725rem;
    a {
      font-size: 0.65rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #969696;
    }
    .selects {
      display: flex;
      align-items: center;
      button {
        width: 6.7rem;
        height: 1.525rem;
        border-radius: 40px;
        border: 1px solid #e4e4e4;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #969696;
        margin-right: 0.85rem;
        img {
          width: 1.05rem;
        }
      }
      button.active {
        background: #3fabfa;
        border: 1px solid #3fabfa;
        color: #fff;
      }
    }
  }
  .header {
    padding: 0 0.85rem;
    background: #35b9ff;
    position: relative;
    display: flex;
    justify-content: center;
    font-size: 0.8rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    height: 2.2rem;
    align-items: center;
    a {
      position: absolute;
      left: 0.85rem;
      img {
        height: 0.9rem;
      }
    }
  }
}
.containerPc {
  height: 100%;
  background: url(http://localhost:8080/img/56.c6a378cc.png) no-repeat;
  background-size: 100% 100%;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
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
  .list {
    padding: 0 0.75rem;
    width: 750px;
    background: #fff;
    .page {
      padding-top: 0.8rem;
      padding-bottom: 1.25rem;
      display: flex;
      justify-content: center;
      img {
        width: 1.125rem;
        margin: 0 0.95rem;
      }
    }
    .item {
      padding: 0.85rem 0 0.85rem 0.85rem;
      border-bottom: 1px solid #eeeeee;
      h4 {
        color: rgba(94, 94, 94, 1);
        font-size: 0.7rem;
        line-height: 1.275rem;
        font-weight: normal;
      }
      > div {
        > span {
          color: rgba(150, 150, 150, 1);
          font-size: 0.65rem;
          line-height: 1.275rem;
        }
      }
    }
    .item:last-child {
      border: 0 none;
    }
  }
  .filter {
    width: 750px;
    height: 2.75rem;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.375rem;
    padding-left: 0.525rem;
    padding-right: 1.725rem;
    a {
      font-size: 0.65rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #969696;
    }
    .selects {
      display: flex;
      align-items: center;
      button {
        width: 6.7rem;
        height: 1.525rem;
        border-radius: 40px;
        border: 1px solid #e4e4e4;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #969696;
        margin-right: 0.85rem;
        img {
          width: 1.05rem;
        }
      }
      button.active {
        background: #3fabfa;
        border: 1px solid #3fabfa;
        color: #fff;
      }
    }
  }
  .header {
    width: 750px;
    padding: 0 0.85rem;
    background: #35b9ff;
    position: relative;
    display: flex;
    justify-content: center;
    font-size: 0.8rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    height: 2.2rem;
    align-items: center;
    a {
      position: absolute;
      left: 0.85rem;
      img {
        height: 0.9rem;
      }
    }
  }
}
</style>