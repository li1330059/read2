<template>
  <div :class="[isMobile ? 'isMobile' : 'isPc']">
    <div class="container">
      <div class="header">
        <a href="javascript: void(0)" @click="router.go(-1)">
          <img src="../../../assets/new/31.png" />
        </a>
        我的课程
      </div>
      <div class="title">
        <div>
          <h3>我的订购</h3>
          <span>您的最爱，我们都为您保存好啦</span>
        </div>
        <img src="../../../assets/new/32.png" />
      </div>
      <div class="list">
        <a href="javascript: void(0)">
          <img src="../../../assets/new/39.png" />
          <h4>安妮日记</h4>
          <span>零基础</span>
        </a>
        <a href="javascript: void(0)">
          <img src="../../../assets/new/39.png" />
          <h4>安妮日记</h4>
          <span>零基础</span>
        </a>
        <a href="javascript: void(0)">
          <img src="../../../assets/new/39.png" />
          <h4>安妮日记</h4>
          <span>零基础</span>
        </a>
        <a href="javascript: void(0)">
          <img src="../../../assets/new/39.png" />
          <h4>安妮日记</h4>
          <span>零基础</span>
        </a>
        <a href="javascript: void(0)">
          <img src="../../../assets/new/39.png" />
          <h4>安妮日记</h4>
          <span>零基础</span>
        </a>
        <a href="javascript: void(0)" class="add">
          <img src="../../../assets/new/40.png" />
          <span>添加课程</span>
        </a>
      </div>
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
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getLocalPid } from "../../../libs/util";
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
</script>

<style lang="less" scoped>
.isMobile {
  .container {
    min-height: 100%;
    background-color: #ffffff;
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
      padding: 0 1.025rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      a {
        margin-bottom: 0.85rem;
      }
      a.add {
        width: 5.025rem;
        height: 6.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f2f1f6;
        flex-flow: column;
        img {
          width: 1.075rem;
          height: 1.05rem;
          margin-bottom: 0.6rem;
        }
        span {
          font-size: 0.7rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #979797;
          line-height: 1rem;
        }
      }
      img {
        width: 5.025rem;
        height: 6.6rem;
        margin-bottom: 0.25rem;
      }
      h4 {
        font-size: 0.7rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 1rem;
      }
      span {
        font-size: 0.5rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #a2a2a2;
        line-height: 0.7rem;
      }
    }
    .title {
      margin: 0.775rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.025rem;
      h3 {
        font-size: 0.9rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 1.35rem;
      }
      span {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #acb1b9;
        line-height: 0.825rem;
      }
      img {
        height: 0.7rem;
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
}
.isPc {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background: url(http://localhost:8080/img/56.c6a378cc.png) no-repeat;
  background-size: 100% 100%;
  .container {
    margin: 0 auto;
    position: relative;
    width: 750px;
    min-height: 80%;
    background-color: #ffffff;
    .footer {
      background: #ffffff;
      position: absolute;
      bottom: 0;
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
    .list {
      padding: 0 1.025rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      a {
        margin-bottom: 0.85rem;
      }
      a.add {
        width: 5.025rem;
        height: 6.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f2f1f6;
        flex-flow: column;
        img {
          width: 1.075rem;
          height: 1.05rem;
          margin-bottom: 0.6rem;
        }
        span {
          font-size: 0.7rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #979797;
          line-height: 1rem;
        }
      }
      img {
        width: 5.025rem;
        height: 6.6rem;
        margin-bottom: 0.25rem;
      }
      h4 {
        font-size: 0.7rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 1rem;
      }
      span {
        font-size: 0.5rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #a2a2a2;
        line-height: 0.7rem;
      }
    }
    .title {
      margin: 0.775rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.025rem;
      h3 {
        font-size: 0.9rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 1.35rem;
      }
      span {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #acb1b9;
        line-height: 0.825rem;
      }
      img {
        height: 0.7rem;
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
}
</style>