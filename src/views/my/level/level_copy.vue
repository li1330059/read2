<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <div class="box">
        <div class="header">
          <a href="javascript: void(0)" @click="router.go(-1)">
            <img src="../../../assets/new/31.png" />
          </a>
          我的阅读能力
        </div>
        <img src="../../../assets/new/44.png" />
        <div class="progress">
          Lv{{ userInfo.level }}
          <div>
            <span :style="{ width: (userInfo.level / 396) * 100 + '%' }"></span>
          </div>
        </div>
      </div>

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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
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
const userInfo = computed(() => store.state.userInfo || {});
</script>

<style lang="less" scoped>
.container {
  min-height: 100%;
  background-color: #ffffff;
  > div {
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
    .box {
      height: 12.625rem;
      background: url("../../../assets/new/43.png") no-repeat;
      background-size: 100% 100%;
      > img {
        width: 6.75rem;
        display: block;
        margin: 0 auto 2.475rem auto;
      }
      .progress {
        padding: 0 0.7rem;
        font-size: 0.525rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 0.725rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        div {
          width: 16.025rem;
          height: 0.475rem;
          margin-left: 0.5rem;
          background: rgb(255 255 255 / 38%);
          border-radius: 8.5px;
          position: relative;
          overflow: hidden;
          span {
            display: block;
            background: #ffe156;
            width: 50%;
            height: 100%;
          }
        }
      }
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
  }
}
.containerPc {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: url(http://localhost:8080/img/56.c6a378cc.png) no-repeat;
  background-size: 100% 100%;
  > div {
    position: relative;
    .footer {
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      position: absolute;
      width: 750px;
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
    width: 750px;
    height: 80%;
    background: #fff;
    .box {
      height: 12.625rem;
      background: url("../../../assets/new/43.png") no-repeat;
      background-size: 100% 100%;
      > img {
        width: 6.75rem;
        display: block;
        margin: 0 auto 2.475rem auto;
      }
      .progress {
        padding: 0 0.7rem;
        font-size: 0.525rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 0.725rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        div {
          width: 16.025rem;
          height: 0.475rem;
          margin-left: 0.5rem;
          background: rgb(255 255 255 / 38%);
          border-radius: 8.5px;
          position: relative;
          overflow: hidden;
          span {
            display: block;
            background: #ffe156;
            width: 50%;
            height: 100%;
          }
        }
      }
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
  }
}
</style>