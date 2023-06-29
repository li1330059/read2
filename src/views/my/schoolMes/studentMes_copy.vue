<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <div class="header">填写真实信息</div>
      <div class="step">
        <div>1.填写学校</div>
        <img src="../../../assets/new/45.png" />
        <div>2.选择年级班级</div>
        <img src="../../../assets/new/45.png" />
        <div class="active">3.填写姓名</div>
      </div>
      <div class="search">
        <div class="cells">
          <a href="javascript: void(0)" class="cell">
            <div class="left">
              <h4>姓名</h4>
              <input
                type="text"
                v-model="formData.data.realname"
                placeholder="请输入姓名"
              />
            </div>
          </a>
        </div>
        <van-button
          round
          block
          type="primary"
          @click="next"
          style="width: 80%; margin: 1rem auto"
          >{{ route.query.type ? "保存并设置阅读能力" : "保存" }}</van-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getLocalPid } from "../../../libs/util";
import { userSetClass } from "../../../api/index";
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
const route = useRoute();
const formData = reactive({ data: {} });
const safeMes = computed(() => store.state.safeMes);
const userInfo = computed(() => store.state.userInfo || {});
const next = () => {
  userSetClass(JSON.stringify(formData.data))
    .then((res) => {
      let data = res.data;
      if (data.code) return ElMessage.error(data.msg);
      store.commit("destoryPreUserMes");
      if (route.query.type) {
        store.dispatch("getUserInfo", "article").then(() => {
          console.log(6666);
        });
        router.push({
          name: "ability",
          query: { type: formData.data.school_type },
        });
      } else
        router.push({
          name: "my",
          query: { pid: getLocalPid() },
        });
      return ElMessage.success("设置成功");
    })
    .catch((err) => {
      return ElMessage.error(JSON.stringify(err));
    });
};
onMounted(() => {
  console.log(route.params);
  if (Object.keys(route.params).length === 0) {
    router.push({ name: "schoolMes" });
  }
  console.log(formData);
  formData.data = {
    ...safeMes.value,
    ...route.params,
    realname: userInfo.value.realname,
  };
});
</script>
<style lang="less" scoped>
.container {
  > div {
    min-height: 100%;
    display: flex;
    flex-flow: column;
    .search {
      padding: 0.75rem 0.725rem;
      background: #ffffff;
      flex: 1;
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
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            font-size: 0.75rem;
            line-height: 1.05rem;
            h4 {
              margin-right: 0.5rem;
              width: 2rem;
              font-size: 0.75rem;
            }
            input {
              border: 0;
              outline: 0;
              font-size: 0.75rem;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 1.05rem;
            }

            input::-webkit-input-placeholder {
              color: #333333;
            }
            img {
              width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.375rem;
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
      }
      .schoolList {
        dt {
          font-size: 0.8rem;
          font-family: Helvetica;
          color: #000000;
          line-height: 0.95rem;
          margin-bottom: 0.375rem;
        }
        dd {
          font-size: 0.7rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #666666;
          line-height: 2rem;
        }
      }
      .searchInput {
        margin-bottom: 1.125rem;
        height: 2rem;
        position: relative;
        img {
          position: absolute;
          width: 1rem;
          left: 0.725rem;
          top: 0.4rem;
        }
        input {
          border: 1px solid #dddddd;
          outline: none;
          padding-left: 2.1rem;
          font-size: 0.75rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #cccccc;
          line-height: 0.75rem;
          height: 100%;
          width: 100%;
          background: #f7f7f7;
          border-radius: 44px;
          padding-right: 1rem;
        }

        input::-webkit-input-placeholder {
          font-size: 0.75rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #cccccc;
          line-height: 0.75rem;
        }
      }
    }
    .list {
      background: #ffffff;
      padding: 0.875rem;
      flex: 1;
      .item {
        padding: 0.675rem 0;
        border-bottom: 1px solid #f4f4f4;
      }
      span:first-child {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1b1b1b;
      }
      input {
        font-size: 0.6rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #cccccc;
        line-height: 1.05rem;
        border: 0 none;
        outline: none;
        margin-left: 0.9rem;
      }
      input::-webkit-input-placeholder {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cccccc;
      }
    }
    .step {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 0.775rem;
      font-size: 0.7rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #cccccc;
      line-height: 1rem;
      background: #ffffff;
      .active {
        color: #35b9ff;
      }
      img {
        width: 0.35rem;
      }
      margin-bottom: 0.5rem;
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
    display: flex;
    flex-flow: column;
    .search {
      padding: 0.75rem 0.725rem;
      background: #ffffff;
      flex: 1;
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
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            font-size: 0.75rem;
            line-height: 1.05rem;
            h4 {
              margin-right: 0.5rem;
              width: 2rem;
              font-size: 0.75rem;
            }
            input {
              border: 0;
              outline: 0;
              font-size: 0.75rem;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 1.05rem;
            }

            input::-webkit-input-placeholder {
              color: #333333;
            }
            img {
              width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.375rem;
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
      }
      .schoolList {
        dt {
          font-size: 0.8rem;
          font-family: Helvetica;
          color: #000000;
          line-height: 0.95rem;
          margin-bottom: 0.375rem;
        }
        dd {
          font-size: 0.7rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #666666;
          line-height: 2rem;
        }
      }
      .searchInput {
        margin-bottom: 1.125rem;
        height: 2rem;
        position: relative;
        img {
          position: absolute;
          width: 1rem;
          left: 0.725rem;
          top: 0.4rem;
        }
        input {
          border: 1px solid #dddddd;
          outline: none;
          padding-left: 2.1rem;
          font-size: 0.75rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #cccccc;
          line-height: 0.75rem;
          height: 100%;
          width: 100%;
          background: #f7f7f7;
          border-radius: 44px;
          padding-right: 1rem;
        }

        input::-webkit-input-placeholder {
          font-size: 0.75rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #cccccc;
          line-height: 0.75rem;
        }
      }
    }
    .list {
      background: #ffffff;
      padding: 0.875rem;
      flex: 1;
      .item {
        padding: 0.675rem 0;
        border-bottom: 1px solid #f4f4f4;
      }
      span:first-child {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1b1b1b;
      }
      input {
        font-size: 0.6rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #cccccc;
        line-height: 1.05rem;
        border: 0 none;
        outline: none;
        margin-left: 0.9rem;
      }
      input::-webkit-input-placeholder {
        font-size: 0.6rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cccccc;
      }
    }
    .step {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 0.775rem;
      font-size: 0.7rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #cccccc;
      line-height: 1rem;
      background: #ffffff;
      .active {
        color: #35b9ff;
      }
      img {
        width: 0.35rem;
      }
      margin-bottom: 0.5rem;
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