<template>
  <div class="container">
    <div class="header">
      <a href="javascript: void(0)" @click="router.go(-1)">
        <img src="../../../assets/new/31.png" />
      </a>
      个人信息
    </div>
    <div class="avatar">
      <img src="../../../assets/new/20.png" />
    </div>
    <div class="list">
      <div class="item">
        <span>姓名</span>
        <span>李佳阳<img src="../../../assets/new/32.png" /></span>
      </div>
      <div class="item">
        <span>ID</span>
        <span>N4934703<img src="../../../assets/new/32.png" /></span>
      </div>
      <div class="item">
        <span>等级</span>
        <span>Lv12<img src="../../../assets/new/32.png" /></span>
      </div>
      <div class="item">
        <span>学校</span>
        <span
          >吉林省抚松县第七小学<img src="../../../assets/new/32.png"
        /></span>
      </div>
      <div class="item">
        <span>班级</span>
        <span>四年级3班<img src="../../../assets/new/32.png" /></span>
      </div>
      <div class="item">
        <span>性别</span>
        <span>女<img src="../../../assets/new/32.png" /></span>
      </div>
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
</template>

<script setup>
import { useRouter } from "vue-router";
import { getLocalPid } from "../../../libs/util";
const pid = getLocalPid();
const router = useRouter();
</script>

<style scoped lang="less">
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
    padding: 0 0.85rem;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.675rem 0;
      border-bottom: 1px solid #f4f4f4;
      span:first-child {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1b1b1b;
      }
      span:last-child {
        font-size: 0.625rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a2a2a2;
        display: flex;
        align-items: center;
        img {
          height: 0.6rem;
          margin-left: 0.3rem;
        }
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
  .avatar {
    background: #35b9ff;
    padding-top: 0.3rem;
    padding-bottom: 2.025rem;
    text-align: center;
    img {
      width: 3.475rem;
    }
  }
}
</style>