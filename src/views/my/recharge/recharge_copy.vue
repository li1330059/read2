<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <div class="header">
        <a href="javascript: void(0)" @click="router.go(-1)">
          <img src="../../../assets/new/31.png" />
        </a>
        会员充值
      </div>
      <div class="main">
        <h4>请输入12位卡密进行充值</h4>
        <div class="input">
          <img src="../../../assets/new/33.png" />
          <input
            type="text"
            placeholder="请输入密码"
            v-model="card"
            maxlength="12"
          />
          <img src="../../../assets/new/34.png" @click="card = ''" />
        </div>
        <div class="num">
          <span>{{ card.length }}</span
          >/12
        </div>
        <button type="button" @click="recharge">确定</button>
        <a href="javascript: void(0)" @click="navToBuy" v-if="address"
          >去学习商城购买卡密 >></a
        >
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
import { ref, onMounted, computed } from "vue";
import { Dialog } from "vant";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getLocalPid } from "../../../libs/util";
import { bizRecharge, bizUrlStore } from "../../../api/index";
import { ElMessage } from "element-plus";
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
const safeMes = computed(() => store.state.safeMes);
const card = ref("");
const address = ref("");
const recharge = () => {
  Dialog.confirm({
    message: "是否需要修改学校信息",
    "confirm-button-text": "修改",
    "cancel-button-text": "不修改",
  })
    .then(() => {
      router.push({ name: "schoolMes" });
    })
    .catch(() => {
      let obj = {
        ...safeMes.value,
        cardNumber: card.value,
        pid: getLocalPid(),
      };
      bizRecharge(encodeURIComponent(JSON.stringify(obj)))
        .then((res) => {
          let data = res.data;
          console.log(data);
          if (data.code)
            return store.commit("judgeCode", {
              code: data.code,
              msg: data.msg,
            });
          if (data.data.cardType == "READING") {
            ElMessage.success("阅读服务 充值成功");
          } else {
            ElMessage.success("名师在线服务 充值成功");
          }
          store.commit("destoryPreUserMes");
          card.value = "";
        })
        .catch((err) => {
          console.log(err);
          return ElMessage.error("充值失败 请稍后再试");
        });
    });
};

const navToBuy = () => {
  window.location.href = address.value;
};
const getStoreAddress = () => {
  let obj = {
    ...safeMes.value,
    pid: getLocalPid(),
  };
  console.log(obj);
  bizUrlStore(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      let data = res.data;
      if (data.code) return ElMessage.error(data.msg);
      address.value = data.data;
    })
    .catch((err) => {
      console.log(err);
      return ElMessage.error("发生错误 获取商城地址失败");
    });
};
onMounted(() => {
  getStoreAddress();
});
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  > div {
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
    .main {
      padding: 0 0.75rem;
      button {
        background-color: rgba(53, 185, 255, 0.5);
        font-size: 0.75rem;
        color: #ffffff;
        text-align: center;
        width: 15rem;
        height: 2.2rem;
        border: 0 none;
        border-radius: 20px;
        margin: 0 auto;
        display: block;
        margin-bottom: 0.55rem;
      }
      a {
        font-size: 0.65rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #35b9ff;
        justify-content: center;
        display: flex;
      }
      h4 {
        font-size: 0.8rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 1.125rem;
        margin-bottom: 1.25rem;
        margin-top: 1.95rem;
        text-align: center;
      }
      .num {
        margin-top: 0.425rem;
        margin-bottom: 3.125rem;
        text-align: right;
        font-size: 0.7rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a2a2a2;
        line-height: 1rem;
        span {
          color: #00beff;
          font-size: 0.7rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
      .input {
        position: relative;
        height: 1.475rem;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        input {
          width: 100%;
          border: 0 none;
          height: 100%;
          outline: none;
          font-size: 0.7rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #a2a2a2;
        }
        input::-webkit-input-placeholder {
          color: #a2a2a2;
          font-size: 0.7rem;
        }
        img:first-child {
          height: 1rem;
          margin-right: 0.55rem;
          margin-left: 0.375rem;
        }
        img:last-child {
          height: 0.7rem;
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
    width: 750px;
    height: 80%;
    position: relative;
    background-color: #ffffff;
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
    .main {
      padding: 0 0.75rem;
      button {
        background-color: rgba(53, 185, 255, 0.5);
        font-size: 0.75rem;
        color: #ffffff;
        text-align: center;
        width: 15rem;
        height: 2.2rem;
        border: 0 none;
        border-radius: 20px;
        margin: 0 auto;
        display: block;
        margin-bottom: 0.55rem;
      }
      a {
        font-size: 0.65rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #35b9ff;
        justify-content: center;
        display: flex;
      }
      h4 {
        font-size: 0.8rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 1.125rem;
        margin-bottom: 1.25rem;
        margin-top: 1.95rem;
        text-align: center;
      }
      .num {
        margin-top: 0.425rem;
        margin-bottom: 3.125rem;
        text-align: right;
        font-size: 0.7rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a2a2a2;
        line-height: 1rem;
        span {
          color: #00beff;
          font-size: 0.7rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
      }
      .input {
        position: relative;
        height: 1.475rem;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        input {
          width: 100%;
          border: 0 none;
          height: 100%;
          outline: none;
          font-size: 0.7rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #a2a2a2;
        }
        input::-webkit-input-placeholder {
          color: #a2a2a2;
          font-size: 0.7rem;
        }
        img:first-child {
          height: 1rem;
          margin-right: 0.55rem;
          margin-left: 0.375rem;
        }
        img:last-child {
          height: 0.7rem;
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
}
</style>