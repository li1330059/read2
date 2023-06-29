<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <h1>学乐智能阅读</h1>
      <div class="card">
        <div>
          <img src="../../assets/new/14.png" />
          <input
            type="text"
            placeholder="用户名/账号/手机号"
            v-model="username"
          />
        </div>
        <div>
          <img src="../../assets/new/15.png" />
          <input type="text" placeholder="请输入您的密码" v-model="password" />
        </div>
        <button type="button" @click="login">登陆</button>
        <div class="link">
          <a href="javascript: void(0)">忘记密码?</a>
          <a
            href="javascript: void(0)"
            @click="router.push({ name: 'register' })"
            >新用户注册</a
          >
        </div>
        <div class="wx">
          <div>
            <img src="../../assets/new/16.png" /><span>社交账号快速登录</span
            ><img src="../../assets/new/16.png" />
          </div>
          <a
            href="javascript: void(0)"
            @click="router.push({ name: 'weChat' })"
          >
            <img src="../../assets/new/17.png" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getLocalPid } from "../../libs/util";
import { userLogin } from "../../api/index";
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
const username = ref("");
const password = ref("");
const login = () => {
  let obj = {
    username: username.value,
    password: password.value,
  };
  userLogin(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      let data = res.data;
      console.log(data);
      if (data.code === 0) {
        store.commit("login", data.data);
        localStorage.setItem("ways", "login");
        // 把token保存到本地
        let msg = JSON.stringify(data.data);
        // userMes中有userId和token
        localStorage.setItem("userMes", msg);
        localStorage.setItem("ways", "username");
        ElMessage.success(data.msg);
        router.push({ name: "my", query: { pid: getLocalPid() } });
      } else {
        ElMessage.error(data.msg);
      }
    })
    .catch(() => {
      ElMessage.error("发生错误,登录失败");
    });
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  background: url("../../assets/new/13.png") no-repeat;
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
        justify-content: space-between;
        margin-bottom: 2.5rem;
        a {
          font-size: 0.65rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          line-height: 0.925rem;
        }
      }
      .wx {
        margin: 0;
        > div {
          font-size: 0.6rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #a2a2a2;
          line-height: 0.825rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-bottom: 0.925rem;
          img {
            width: 3.3rem;
            height: auto;
            position: initial;
          }
        }
        img {
          width: 1.775rem;
          height: 1.775rem;
          position: inherit;
          margin: 0 auto;
          display: block;
        }
      }
    }
  }
}
.containerPc {
  height: 100%;
  width: 100%;
  background: url("../../assets/new/55.png") no-repeat;
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
        justify-content: space-between;
        margin-bottom: 2.5rem;
        a {
          font-size: 0.65rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          line-height: 0.925rem;
        }
      }
      .wx {
        margin: 0;
        > div {
          font-size: 0.6rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #a2a2a2;
          line-height: 0.825rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-bottom: 0.925rem;
          img {
            width: 3.3rem;
            height: auto;
            position: initial;
          }
        }
        img {
          width: 1.775rem;
          height: 1.775rem;
          position: inherit;
          margin: 0 auto;
          display: block;
        }
      }
    }
  }
}
</style>