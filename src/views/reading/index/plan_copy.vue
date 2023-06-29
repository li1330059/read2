<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div class="box">
      <div class="header">
        <a href="javascript: void(0)" @click="router.go(-1)">
          <img src="../../../assets/new/31.png" />
        </a>
        我的阅读计划
      </div>
      <swiper
        :slides-per-view="7"
        :space-between="0"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="(item, index) in data.days" :key="index">
          <div class="wrapper" :class="{ active: item.active }">
            <div>
              <div class="day">{{ item.day }}</div>
              <div class="week">{{ item.week }}</div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="articles">
      <div class="number">
        <span>当日共<i>3</i>篇文章</span>
        <span>已完成0篇</span>
      </div>
      <div class="articlesList">
        <div class="line"></div>
        <div class="item">
          <div>
            <div class="circular"></div>
            <div class="line"></div>
          </div>
          <div>初级</div>
          <a href="javascript: void(0)">
            <h4>高三英语第一单元阅读</h4>
            <div>
              <img src="../../../assets/new/42.png" />
              <span>主讲：Uan</span>
            </div>
          </a>
        </div>
        <div class="item">
          <div>
            <div class="circular"></div>
            <div class="line"></div>
          </div>
          <div>中级</div>
          <a href="javascript: void(0)">
            <h4>高三英语第一单元阅读</h4>
            <div>
              <img src="../../../assets/new/42.png" />
              <span>主讲：Uan</span>
            </div>
          </a>
        </div>
        <div class="item">
          <div>
            <div class="circular"></div>
            <div class="line"></div>
          </div>
          <div>高级</div>
          <a href="javascript: void(0)">
            <h4>高三英语第一单元阅读</h4>
            <div>
              <img src="../../../assets/new/42.png" />
              <span>主讲：Uan</span>
            </div>
          </a>
        </div>
      </div>
    </div>
    <a href="javascript: void(0)" class="all">查看全部文章 ></a>
    <div style="height: 6rem" v-if="isMobile"></div>
    <div style="height: 6rem; width: 750px; background: #fff" v-else></div>
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
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { useRouter } from "vue-router";
import "swiper/css";
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { getLocalPid } from "../../../libs/util";
import { ElMessage } from "element-plus";
import { articleListPlan } from "../../../api/index";
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
const pid = getLocalPid();
const router = useRouter();
const token = computed(() => store.state.token);
const userId = computed(() => store.state.userId);
const sign = computed(() => store.state.sign);
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const today = date.getDate();
const onSwiper = (swiper) => {
  swiper.slideTo(today - 4);
};
const onSlideChange = () => {
  console.log("slide change");
};
const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let week = new Date(`${year}-${month + 1}`).getDay();
const data = reactive({
  days: [],
  articleData: {},
});
for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) {
  data.days.push({
    day: i,
    week: weekDays[week],
    active: i === today,
  });
  if (week === 6) {
    week = 0;
  } else {
    week++;
  }
}
const request30DaysArticles = () => {
  let obj = {
    token: token.value,
    sign: sign.value,
    userId: userId.value,
    pid: getLocalPid(),
  };
  articleListPlan(JSON.stringify(obj))
    .then((res) => {
      data.articleData = res.data.data;
      console.log(data.articleData);
    })
    .catch(() => {
      ElMessage.error("获取文章列表失败 请稍后再试");
    });
};
onMounted(() => {
  request30DaysArticles();
});
</script>

<style lang="less" scoped>
.container {
  min-height: 100%;
  background-color: #ffffff;
  overflow: hidden;
  .footer {
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    position: absolute;
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
  .all {
    font-size: 0.675rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4a4a4a;
    line-height: 0.95rem;
    margin-top: 1.225rem;
    text-align: center;
    display: block;
  }
  .articles {
    margin-top: 2.05rem;
    padding: 0 0.825rem;
    .articlesList {
      position: relative;
      > .line {
        position: absolute;
        left: 0;
        background: #d8d8d8;
        width: 0.1rem;
        height: calc(100% - 0.475rem);
        bottom: 0;
        left: 0.18rem;
        z-index: 0;
      }
      .item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.4rem;
        > div:nth-child(1) {
          margin-top: 0.475rem;
          display: flex;
          flex-flow: column;
          align-items: center;
          margin-right: 1.1rem;
          .circular {
            width: 0.45rem;
            height: 0.45rem;
            background: #9b9b9b;
            border-radius: 50%;
            z-index: 1;
          }
          .line {
            width: 0.1rem;
            background: none;
            height: calc(100% - 0.45rem);
          }
        }
        > div:nth-child(2) {
          font-size: 0.575rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4a4a4a;
          line-height: 0.8rem;
          margin-top: 0.275rem;
        }
        > a {
          background-color: rgba(247, 248, 252, 1);
          border-radius: 13px;
          display: block;
          width: 12.6rem;
          height: 3.45rem;
          padding: 0.525rem 1.075rem;
          margin-left: 1.6rem;
          div {
            display: flex;
            align-items: center;
          }
          h4 {
            font-size: 0.75rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4a4a4a;
            line-height: 1.05rem;
            margin-bottom: 0.3rem;
          }
          img {
            width: 1.025rem;
            margin-right: 0.55rem;
          }
          span {
            font-size: 0.625rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #9b9b9b;
            line-height: 0.9rem;
          }
        }
      }

      .item:last-child {
        > div:nth-child(1) {
          .line {
            background: #fff;
            z-index: 1;
          }
        }
      }
    }
    .number {
      display: flex;
      align-items: center;
      margin-bottom: 0.775rem;
      span:first-child {
        font-size: 0.675rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4a4a4a;
        line-height: 0.95rem;
        margin-right: 0.9rem;
        i {
          color: #45adff;
          font-style: normal;
        }
      }
      span:last-child {
        font-size: 0.575rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #9b9b9b;
        line-height: 0.8rem;
      }
    }
  }
  .box {
    background: url("../../../assets/new/41.png") no-repeat;
  }
  .header {
    padding: 0 0.85rem;
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
  .swiper {
    overflow: initial;
    .swiper-wrapper {
      .swiper-slide {
        .wrapper {
          > div {
            height: 2.875rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-flow: column;
            .day {
              font-size: 0.925rem;
              font-family: CenturyGothic;
              color: #ffffff;
              line-height: 1.125rem;
              margin-bottom: 0.05rem;
            }
            .week {
              font-size: 0.625rem;
              font-family: AppleSDGothicNeo-Medium, AppleSDGothicNeo;
              font-weight: 500;
              color: #ffffff;
              line-height: 0.775rem;
            }
          }
        }
        .wrapper.active {
          position: absolute;
          left: 0;
          width: 100%;
          box-shadow: 0px 2px 4px 0px rgba(69, 173, 255, 0.19);
          background-color: rgba(255, 255, 255, 1);
          border-radius: 9px;
          height: 3.275rem;
          > div {
            .day {
              color: rgba(69, 173, 255, 1);
            }
            .week {
              color: rgba(69, 173, 255, 1);
            }
          }
        }
      }
    }
  }
}
.containerPc {
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-flow: column;
  align-items: center;
  background: url("../../../assets/new/56.png") no-repeat;
  background-size: 100% 100%;
  justify-content: center;
  .footer {
    width: 750px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
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
  .all {
    width: 750px;
    font-size: 0.675rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4a4a4a;
    line-height: 0.95rem;
    padding-top: 1.225rem;
    background: #fff;
    text-align: center;
    display: block;
  }
  .articles {
    width: 750px;
    padding: 2.05rem 0.825rem;
    background: #fff;
    .articlesList {
      position: relative;
      > .line {
        position: absolute;
        left: 0;
        background: #d8d8d8;
        width: 0.1rem;
        height: calc(100% - 0.475rem);
        bottom: 0;
        left: 0.18rem;
        z-index: 0;
      }
      .item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.4rem;
        > div:nth-child(1) {
          margin-top: 0.475rem;
          display: flex;
          flex-flow: column;
          align-items: center;
          margin-right: 1.1rem;
          .circular {
            width: 0.45rem;
            height: 0.45rem;
            background: #9b9b9b;
            border-radius: 50%;
            z-index: 1;
          }
          .line {
            width: 0.1rem;
            background: none;
            height: calc(100% - 0.45rem);
          }
        }
        > div:nth-child(2) {
          font-size: 0.575rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4a4a4a;
          line-height: 0.8rem;
          margin-top: 0.275rem;
        }
        > a {
          background-color: rgba(247, 248, 252, 1);
          border-radius: 13px;
          display: block;
          width: 12.6rem;
          height: 3.45rem;
          padding: 0.525rem 1.075rem;
          margin-left: 1.6rem;
          div {
            display: flex;
            align-items: center;
          }
          h4 {
            font-size: 0.75rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4a4a4a;
            line-height: 1.05rem;
            margin-bottom: 0.3rem;
          }
          img {
            width: 1.025rem;
            margin-right: 0.55rem;
          }
          span {
            font-size: 0.625rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #9b9b9b;
            line-height: 0.9rem;
          }
        }
      }

      .item:last-child {
        > div:nth-child(1) {
          .line {
            background: #fff;
            z-index: 1;
          }
        }
      }
    }
    .number {
      display: flex;
      align-items: center;
      margin-bottom: 0.775rem;
      span:first-child {
        font-size: 0.675rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4a4a4a;
        line-height: 0.95rem;
        margin-right: 0.9rem;
        i {
          color: #45adff;
          font-style: normal;
        }
      }
      span:last-child {
        font-size: 0.575rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #9b9b9b;
        line-height: 0.8rem;
      }
    }
  }
  .box {
    width: 750px;
    background: url("../../../assets/new/41.png") no-repeat;
  }
  .header {
    padding: 0 0.85rem;
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
  .swiper {
    overflow: hidden;
    .swiper-wrapper {
      .swiper-slide {
        .wrapper {
          > div {
            height: 2.875rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-flow: column;
            .day {
              font-size: 0.925rem;
              font-family: CenturyGothic;
              color: #ffffff;
              line-height: 1.125rem;
              margin-bottom: 0.05rem;
            }
            .week {
              font-size: 0.625rem;
              font-family: AppleSDGothicNeo-Medium, AppleSDGothicNeo;
              font-weight: 500;
              color: #ffffff;
              line-height: 0.775rem;
            }
          }
        }
        .wrapper.active {
          position: absolute;
          left: 0;
          width: 100%;
          box-shadow: 0px 2px 4px 0px rgba(69, 173, 255, 0.19);
          background-color: rgba(255, 255, 255, 1);
          border-radius: 9px;
          height: 3.275rem;
          > div {
            .day {
              color: rgba(69, 173, 255, 1);
            }
            .week {
              color: rgba(69, 173, 255, 1);
            }
          }
        }
      }
    }
  }
}
</style>