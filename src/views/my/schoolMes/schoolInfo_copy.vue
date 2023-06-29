<template>
  <div class="container">
    <div class="header">
      <a href="javascript: void(0)" @click="router.go(-1)">
        <img src="../../../assets/new/31.png" />
      </a>
      设置学校信息
    </div>
    <div class="tip">为了匹配阅读等级，请完善你的信息！</div>
    <div class="list">
      <div class="item" @click="showPicker = true">
        <span>所在地区</span>
        <span>选择地址<img src="../../../assets/new/32.png" /></span>
      </div>
      <div class="item">
        <span>所在学校</span>
        <input type="text" placeholder="搜索学校名称" />
      </div>
    </div>
    <button type="button">完成</button>
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
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker
      :columns="columns"
      @cancel="showPicker = false"
      @confirm="onConfirm"
    />
  </van-popup>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getLocalPid } from "../../../libs/util";
const pid = getLocalPid();
const router = useRouter();
const showPicker = ref(false);
const columns = ["杭州", "宁波", "温州", "绍兴", "湖州", "嘉兴", "金华"];
const onConfirm = () => {
  showPicker.value = false;
};
</script>

<style lang="less" scoped>
.container {
  min-height: 100%;
  background-color: #ffffff;
  button {
    background-color: rgba(53, 185, 255, 0.63);
    border-radius: 40px;
    width: 12.05rem;
    height: 2.2rem;
    color: rgba(255, 255, 255, 1);
    font-size: 0.775rem;
    font-family: PingFangSC-Light;
    border: 0 none;
    display: block;
    margin: 2.5rem auto;
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
  .tip {
    background-color: rgba(53, 185, 255, 0.09);
    height: 1.85rem;
    width: 100%;
    color: rgba(53, 185, 255, 1);
    font-size: 0.625rem;
    font-family: PingFangSC-Light;
    display: flex;
    align-items: center;
    padding: 0.5rem 0.725rem;
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
  .list {
    padding: 0 0.85rem;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.675rem 0;
      border-bottom: 1px solid #f4f4f4;
      position: relative;
      span:first-child {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1b1b1b;
        z-index: 1;
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
      input {
        position: absolute;
        width: 100%;
        padding-left: 4rem;
        border: 0 none;
        outline: none;
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a2a2a2;
      }

      input::-webkit-input-placeholder {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a2a2a2;
      }
    }
  }
}
</style>