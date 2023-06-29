<template>
  <div :class="[isMobile ? 'containerM' : 'containerPc']">
    <div class="user">
      <a href="javascript: void(0)">
        <div>
          <img v-if="!userInfo.avatar" src="../../../assets/new/20.png" />
          <img v-else :src="userInfo.avatar" />
          <div>
            <div>
              {{ userInfo.nickname || "蓝宝宝"
              }}<span>V{{ userInfo.level }}</span>
            </div>
            <div>ID：{{ userInfo.id }}</div>
          </div>
        </div>
        <span @click="dialogFormVisible = true">
          修改昵称
          <img src="../../../assets/new/30.png" />
        </span>
      </a>
      <div class="signIn">
        <img src="../../../assets/new/19.png" />
        签到
      </div>
    </div>
    <div class="container">
      <div class="read">
        <div @click="router.push({ name: 'plan', query: { pid: pid } })">
          <img src="../../../assets/new/21.png" />
          阅读计划
        </div>
        <div @click="router.push({ name: 'search', query: { pid: pid } })">
          <img src="../../../assets/new/22.png" />
          所有文章
        </div>
      </div>
      <div class="cells">
        <a
          href="javascript: void(0)"
          class="cell"
          @click="router.push({ name: 'myCourse', query: { pid: pid } })"
        >
          <div class="left">
            <img src="../../../assets/new/23.png" />
            <h4>我的课程</h4>
          </div>
          <div class="right">
            <img src="../../../assets/new/29.png" />
          </div>
        </a>
        <a
          href="javascript: void(0)"
          class="cell"
          @click="router.push({ name: 'level', query: { pid: pid } })"
        >
          <div class="left">
            <img src="../../../assets/new/24.png" />
            <h4>阅读等级</h4>
          </div>
          <div class="right">
            <img src="../../../assets/new/29.png" />
          </div>
        </a>
        <a
          href="javascript: void(0)"
          class="cell"
          @click="router.push({ name: 'schoolMes' })"
        >
          <div class="left">
            <img src="../../../assets/new/25.png" />
            <h4>设置学校信息</h4>
          </div>
          <div class="right">
            <img src="../../../assets/new/29.png" />
          </div>
        </a>
        <a
          href="javascript: void(0)"
          class="cell"
          @click="router.push({ name: 'ability' })"
        >
          <div class="left">
            <img src="../../../assets/new/25.png" />
            <h4>设置阅读能力</h4>
          </div>
          <div class="right">
            <img src="../../../assets/new/29.png" />
          </div>
        </a>
        <a
          href="javascript: void(0)"
          class="cell"
          @click="router.push({ name: 'recharge' })"
        >
          <div class="left">
            <img src="../../../assets/new/25.png" />
            <h4>会员中心</h4>
          </div>
          <div class="right">
            <img src="../../../assets/new/29.png" />
          </div>
        </a>
        <a href="javascript: void(0)" class="cell">
          <div class="left">
            <img src="../../../assets/new/26.png" />
            <h4>我的收藏</h4>
          </div>
          <div class="right">
            <img src="../../../assets/new/29.png" />
          </div>
        </a>
      </div>
      <div class="cells">
        <a href="javascript: void(0)" class="cell">
          <div class="left">
            <img src="../../../assets/new/27.png" />
            <h4>帮助与反馈</h4>
          </div>
          <div class="right">
            <img src="../../../assets/new/29.png" />
          </div>
        </a>
        <a href="javascript: void(0)" class="cell" @click="exit">
          <div class="left">
            <img src="../../../assets/new/28.png" />
            <h4>退出登录</h4>
          </div>
          <div class="right">
            <img src="../../../assets/new/29.png" />
          </div>
        </a>
      </div>
      <div style="height: 6rem" v-if="isMobile"></div>
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
  <el-dialog title="修改昵称" width="80%" v-model="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item style="margin: 0">
        <div style="display: flex; justify-content: end; width: 100%">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveNickName">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getLocalPid } from "../../../libs/util";
import { setNickName } from "../../../api/index";
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
const store = useStore();
const router = useRouter();
const token = computed(() => store.state.token);
const userId = computed(() => store.state.userId);
const sign = computed(() => store.state.sign);
const userInfo = computed(() => store.state.userInfo || {});

const form = ref({
  token: token.value,
  sign: sign.value,
  userId: userId.value,
  nickname: "",
});
console.log(userInfo.value);
onMounted(() => {
  if (!token.value) {
    getToken();
  } else if (token.value && !userInfo.value.nickname) {
    store.dispatch("getUserInfo", "article");
  }
  let title = localStorage.getItem("title");
  if (title) {
    document.title = title;
  }
});
const dialogFormVisible = ref(false);
const saveNickName = () => {
  setNickName(form.value).then((res) => {
    console.log(res);
    if (res.data.code === 0) {
      store.dispatch("getUserInfo", "article");
      dialogFormVisible.value = false;
    }
  });
};
const exit = () => {
  store.commit("exit");
  router.push({ name: "home", query: { pid: getLocalPid() } });
};
const getToken = () => {
  store.commit("init");
};
</script>

<style  scoped lang="less">
.containerPc {
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  background: url("../../../assets/new/56.png") no-repeat;
  background-size: 100% 100%;
  justify-content: center;
  .footer {
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    margin-top: 0.385rem;
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
  .container {
    width: 750px;
    .read {
      padding: 0.9rem 0;
      background: #ffffff;
      margin-top: 0.385rem;
      display: flex;
      justify-content: space-around;
      > div {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        font-size: 0.75rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 1.05rem;
      }
      img {
        height: 1.05rem;
        margin-bottom: 0.375rem;
      }
    }
    .cells {
      background: #ffffff;
      border-radius: 5px;
      padding: 0 0.625rem;
      margin-top: 0.385rem;
      .cell {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.625rem 0;
        border-bottom: 1px solid #e5e5e5;
        .left {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 1.05rem;
          img {
            width: 0.8rem;
            height: 0.8rem;
            margin-right: 0.375rem;
          }
          h4 {
            font-size: 0.75rem;
          }
        }
        .right {
          display: flex;
          align-items: center;
          span {
            font-size: 0.6rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #a2a2a2;
            line-height: 0.825rem;
            margin-right: 0.475rem;
          }
          img {
            height: 0.75rem;
          }
        }
      }
      .cell:last-child {
        border: 0 none;
      }
    }
  }
  .user {
    width: 750px;
    position: relative;
    .signIn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 1.05rem;
      img {
        width: 0.75rem;
      }
    }
    a {
      padding: 2.925rem 0.95rem;
      display: flex;
      background: #35b9ff;
      align-items: center;
      justify-content: space-between;
      > span img {
        width: 0.45rem;
      }
      > div {
        display: flex;
        img {
          width: 3.2rem;
          height: 3.2rem;
          margin-right: 0.725rem;
        }
        > div {
          display: flex;
          flex-flow: column;
          justify-content: space-around;
          > div:first-child {
            font-size: 1.2rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 1.675rem;
            span {
              font-size: 0.45rem;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #ffffff;
              line-height: 0.625rem;
              background: #ffce56;
              width: 1.35rem;
              height: 0.65rem;
              margin-left: 5px;
              border-radius: 5px;
              padding: 0 5px;
            }
          }
          > div:last-child {
            font-size: 0.6rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            padding-left: 0.5rem;
            background-color: rgba(255, 255, 255, 0.26);
            border-radius: 18px;
            width: 5.075rem;
            height: 0.925rem;
            border: 1px solid #ffffff;
          }
        }
      }
    }
  }
}
.containerM {
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
  .container {
    .read {
      padding: 0.9rem 0;
      background: #ffffff;
      margin-top: 0.385rem;
      display: flex;
      justify-content: space-around;
      > div {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        font-size: 0.75rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 1.05rem;
      }
      img {
        height: 1.05rem;
        margin-bottom: 0.375rem;
      }
    }
    padding: 0 0.625rem;
    .cells {
      background: #ffffff;
      border-radius: 5px;
      padding: 0 0.625rem;
      margin-top: 0.385rem;
      .cell {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.625rem 0;
        border-bottom: 1px solid #e5e5e5;
        .left {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 1.05rem;
          img {
            width: 0.8rem;
            height: 0.8rem;
            margin-right: 0.375rem;
          }
          h4 {
            font-size: 0.75rem;
          }
        }
        .right {
          display: flex;
          align-items: center;
          span {
            font-size: 0.6rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #a2a2a2;
            line-height: 0.825rem;
            margin-right: 0.475rem;
          }
          img {
            height: 0.75rem;
          }
        }
      }
      .cell:last-child {
        border: 0 none;
      }
    }
  }
  .user {
    position: relative;
    .signIn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 1.05rem;
      img {
        width: 0.75rem;
        margin-right: 0.3rem;
      }
    }
    a {
      padding: 2rem 0.95rem;
      display: flex;
      background: #35b9ff;
      align-items: center;
      justify-content: space-between;
      > span {
        display: flex;
        align-items: center;
        color: #ffffff;
      }
      > span img {
        width: 0.45rem;
        margin-left: 5px;
      }
      > div {
        display: flex;
        img {
          width: 3.2rem;
          height: 3.2rem;
          margin-right: 0.725rem;
        }
        > div {
          display: flex;
          flex-flow: column;
          justify-content: space-around;
          > div:first-child {
            font-size: 1rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 1.675rem;
            span {
              font-size: 0.45rem;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #ffffff;
              line-height: 0.625rem;
              background: #ffce56;
              width: 1.35rem;
              height: 0.65rem;
              margin-left: 5px;
              border-radius: 5px;
              padding: 0 5px;
            }
          }
          > div:last-child {
            font-size: 0.6rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            padding-left: 0.5rem;
            background-color: rgba(255, 255, 255, 0.26);
            border-radius: 18px;
            width: 5.075rem;
            height: 0.925rem;
            border: 1px solid #ffffff;
          }
        }
      }
    }
  }
}
</style>