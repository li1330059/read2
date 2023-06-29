<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <h1>学乐智能阅读</h1>
      <div class="card">
        <div>
          <img src="../../../assets/new/14.png" />
          <input type="text" placeholder="请输入用户名" v-model="username" />
        </div>
        <div>
          <img src="../../../assets/new/14.png" />
          <input type="text" placeholder="请输入姓名" v-model="nickname" />
        </div>
        <div>
          <img src="../../../assets/new/52.png" />
          <input type="text" placeholder="请输入手机号码" v-model="phone" />
        </div>
        <!-- <div>
          <img src="../../../assets/new/18.png" />
          <input type="text" placeholder="请输入验证码" />
          <span class="code">获取验证码</span>
        </div> -->
        <div>
          <img src="../../../assets/new/15.png" />
          <input type="text" placeholder="请设置您的密码" v-model="password" />
        </div>
        <button type="button" @click="toRegister" :disabled="disabled">
          立即注册
        </button>
        <div class="link">
          <span
            >已有账号，<a
              href="javascript: void(0)"
              @click="router.push({ name: 'home' })"
              >直接登陆</a
            ></span
          >
        </div>
        <div class="agreement">
          <span
            >注册即表示同意<a href="javascript: void(0)"
              >《用户隐私协议》</a
            ></span
          >
        </div>
      </div>
      <div style="height: 2rem"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getLocalPid } from "../../../libs/util";
import { userRegister } from "../../../api/index";
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
const disabled = ref(false);
const username = ref("");
const password = ref("");
const phone = ref("");
const nickname = ref("");
const toRegister = () => {
  let obj = {
    pid: getLocalPid(),
    username: username.value,
    password: password.value,
    mobile: phone.value,
    nickname: nickname.value,
  };
  disabled.value = true;
  userRegister(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      let data = res.data;
      disabled.value = false;
      console.log(data);
      if (data.code === 0) {
        store.commit("login", data.data);
        localStorage.setItem("ways", "login");
        // 把token保存到本地
        let msg = JSON.stringify(data.data);
        // userMes中有userId和token
        localStorage.setItem("userMes", msg);
        localStorage.setItem("ways", "username");
        ElMessage.success("注册成功");
        router.push({ name: "schoolMes", query: { type: 123 } });
      } else {
        ElMessage.error(data.msg);
      }
    })
    .catch(() => {
      disabled.value = false;
    });
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  background: url("../../../assets/new/13.png") no-repeat;
  background-size: 100%;
  > div {
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 0 1.25rem;
    h1 {
      margin-top: 4.675rem;
      margin-bottom: 2.5rem;
      font-size: 1.6rem;
      font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
      font-weight: bold;
      color: #ffffff;
      line-height: 2.2rem;
      letter-spacing: 1px;
    }
    .card {
      padding: 2.5rem 0.875rem;
      background: #ffffff;
      width: 100%;
      border-radius: 20px;
      > div {
        position: relative;
        margin-bottom: 0.75rem;
        border-radius: 10px;
        overflow: hidden;
        img {
          width: 0.75rem;
          position: absolute;
          top: 0.725rem;
          left: 0.975rem;
        }
        input {
          width: 100%;
          height: 2.25rem;
          border: 0 none;
          outline: none;
          background: #efefef;
          padding-left: 2.625rem;
          font-size: 0.675rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #c6c4c4;
        }
        input::-webkit-input-placeholder {
          font-size: 0.675rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #c6c4c4;
        }
        .code {
          position: absolute;
          right: 0.525rem;
          top: 0.75rem;
          font-size: 0.575rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #35b9ff;
          line-height: 0.8rem;
        }
      }
      button {
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
        background-image: linear-gradient(
          270deg,
          rgba(87, 154, 254, 1) 0,
          rgba(82, 185, 251, 1) 100%
        );
        border-radius: 50px;
        margin-top: 1.55rem;
        border: 0 none;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
        width: 100%;
        height: 2.45rem;
        color: #ffffff;
        margin-bottom: 0.875rem;
      }
      .link {
        display: flex;
        justify-content: center;
        margin-bottom: 1.425rem;
        font-size: 0.7rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        line-height: 1rem;
        a {
          color: #555555;
          text-decoration: underline;
        }
      }
      .agreement {
        text-align: center;
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a2a2a2;
        line-height: 0.65rem;
        a {
          color: #a2a2a2;
        }
      }
    }
  }
}
.containerPc {
  height: 100%;
  width: 100%;
  background: url("../../../assets/new/55.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    height: 613px;
    width: 436px;
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 0 1.25rem;
    h1 {
      margin-bottom: 2.5rem;
      font-size: 1.6rem;
      font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
      font-weight: bold;
      color: #ffffff;
      line-height: 2.2rem;
      letter-spacing: 1px;
    }
    .card {
      padding: 2.5rem 0.875rem;
      background: #ffffff;
      width: 100%;
      border-radius: 20px;
      > div {
        position: relative;
        margin-bottom: 0.75rem;
        border-radius: 10px;
        overflow: hidden;
        img {
          width: 0.75rem;
          position: absolute;
          top: 0.725rem;
          left: 0.975rem;
        }
        input {
          width: 100%;
          height: 2.25rem;
          border: 0 none;
          outline: none;
          background: #efefef;
          padding-left: 2.625rem;
          font-size: 0.675rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #c6c4c4;
        }
        input::-webkit-input-placeholder {
          font-size: 0.675rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #c6c4c4;
        }
        .code {
          position: absolute;
          right: 0.525rem;
          top: 0.75rem;
          font-size: 0.575rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #35b9ff;
          line-height: 0.8rem;
        }
      }
      button {
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
        background-image: linear-gradient(
          270deg,
          rgba(87, 154, 254, 1) 0,
          rgba(82, 185, 251, 1) 100%
        );
        border-radius: 50px;
        margin-top: 1.55rem;
        border: 0 none;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
        width: 100%;
        height: 2.45rem;
        color: #ffffff;
        margin-bottom: 0.875rem;
      }
      .link {
        display: flex;
        justify-content: center;
        margin-bottom: 1.425rem;
        font-size: 0.7rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        line-height: 1rem;
        a {
          color: #555555;
          text-decoration: underline;
        }
      }
      .agreement {
        text-align: center;
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a2a2a2;
        line-height: 0.65rem;
        a {
          color: #a2a2a2;
        }
      }
    }
  }
}
</style>