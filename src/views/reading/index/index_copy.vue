<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <div>
        <div class="banner">
          <img src="../../../assets/new/2.png" />
        </div>
        <div class="item">
          <div class="itemHead">
            <div>
              <h3>同步阅读</h3>
              <h4>与你所在年级匹配的阅读资源</h4>
            </div>
            <a href="javascript: void(0)">全部</a>
          </div>
          <div class="media">
            <a href="javascript: void(0)">
              <img src="../../../assets/new/3.png" />
              <div>
                <div>
                  <h3>装在口袋里的爸爸</h3>
                  <div>
                    <span
                      >难度：<img src="../../../assets/new/11.png" /><img
                        src="../../../assets/new/11.png" /><img
                        src="../../../assets/new/11.png" /><img
                        src="../../../assets/new/11.png" /><img
                        src="../../../assets/new/11.png"
                    /></span>
                  </div>
                </div>
                <span class="status">待完成</span>
              </div>
            </a>
          </div>
        </div>
        <div class="item">
          <div class="itemHead">
            <div>
              <h3>扩展阅读</h3>
              <h4>带你读、陪你读、教你读</h4>
            </div>
            <a
              href="javascript: void(0)"
              @click="router.push({ name: 'search', query: { pid: pid } })"
              >全部</a
            >
          </div>
          <div class="media">
            <a
              href="javascript: void(0)"
              v-for="(item, index) in articleData.recommendArticles"
              :key="index"
              @click="navTo(item.articleId)"
            >
              <img :src="item.coverImgUrl" v-if="item.coverImgUrl" />
              <img
                src="../../../assets/new/53.png"
                v-if="!item.coverImgUrl && index === 0"
              />
              <img
                src="../../../assets/new/54.png"
                v-if="!item.coverImgUrl && index === 1"
              />
              <div>
                <div>
                  <h3>{{ item.title }}</h3>
                  <div>
                    <span
                      >难度：
                      <img
                        src="../../../assets/new/11.png"
                        v-for="(i, k) in item.levelStar"
                        :key="k"
                        style="width: 16px" />
                      <img
                        src="../../../assets/new/12.png"
                        v-for="(i, k) in 5 - item.levelStar"
                        :key="k"
                        style="width: 16px"
                    /></span>
                  </div>
                </div>
                <span class="status" v-if="item.isUncompleted">待完成</span>
              </div>
            </a>
          </div>
        </div>
        <div class="item" :style="{ marginBottom: isMobile ? '1.55rem' : '0' }">
          <div class="itemHead">
            <div>
              <h3>他们都在读</h3>
              <h4>同级热点主题文章</h4>
            </div>
            <a href="javascript: void(0)">全部</a>
          </div>
          <ul class="list">
            <li>
              <a href="javascript: void(0)">
                <img src="../../../assets/new/5.png" />
                <h3>安妮日记</h3>
                <span>
                  难度：<img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" />
                </span>
              </a>
            </li>
            <li>
              <a href="javascript: void(0)">
                <img src="../../../assets/new/5.png" />
                <h3>安妮日记</h3>
                <span>
                  难度：<img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" />
                </span>
              </a>
            </li>
            <li>
              <a href="javascript: void(0)">
                <img src="../../../assets/new/5.png" />
                <h3>安妮日记</h3>
                <span>
                  难度：<img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" />
                </span>
              </a>
            </li>
            <li>
              <a href="javascript: void(0)">
                <img src="../../../assets/new/5.png" />
                <h3>安妮日记</h3>
                <span>
                  难度：<img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" />
                </span>
              </a>
            </li>
            <li>
              <a href="javascript: void(0)">
                <img src="../../../assets/new/5.png" />
                <h3>安妮日记</h3>
                <span>
                  难度：<img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" />
                </span>
              </a>
            </li>
            <li>
              <a href="javascript: void(0)">
                <img src="../../../assets/new/5.png" />
                <h3>安妮日记</h3>
                <span>
                  难度：<img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" /><img
                    src="../../../assets/new/11.png"
                  /><img src="../../../assets/new/11.png" />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div style="height: 6rem" v-if="isMobile"></div>
      <div class="footer">
        <a
          href="javascript: void(0)"
          style="color: #35b9ff"
          @click="router.push({ name: 'index', query: { pid: pid } })"
        >
          <img src="../../../assets/new/8.png" />
          原版阅读
        </a>
        <a
          href="javascript: void(0)"
          @click="router.push({ name: 'photo', query: { pid: pid } })"
        >
          <img src="../../../assets/new/9.png" />
          AI工具
        </a>
        <a
          href="javascript: void(0)"
          @click="router.push({ name: 'my', query: { pid: pid } })"
        >
          <img src="../../../assets/new/10.png" />
          个人中心
        </a>
      </div>
    </div>

    <van-dialog
      v-model:show="show"
      :show-cancel-button="false"
      :show-confirm-button="false"
      :close-on-click-overlay="true"
      style="
        width: 12.85rem;
        height: 19rem;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      "
    >
      <div class="dialog">
        <div>
          <h4>This is the Article</h4>
          <p>这是你首次阅读这篇文章<br />Una老师准备好了带你阅</p>
          <img src="../../../assets/new/48.png" />
          <a href="javascript: void(0)">不喜欢，换一篇</a>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { getLocalPid } from "../../../libs/util";
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
const router = useRouter();
const store = useStore();
const pid = getLocalPid();
const token = computed(() => store.state.token);
const show = ref(false);
const articleData = computed(() => store.state.articleData);
onMounted(() => {
  if (!token.value) {
    getToken();
  } else {
    store.dispatch("getUserInfo", "article");
  }
  let title = localStorage.getItem("title");
  if (title) {
    document.title = title;
  }
});
const navTo = (id) => {
  router.push({ name: "article", query: { id, pid } });
};
const getToken = () => {
  store.commit("init");
};
</script>

<style lang="less" scoped>
.container {
  background: url("../../../assets/new/1.png") no-repeat;
  min-height: 100%;
  background-size: contain;
  background-color: #ffffff;
  /deep/ .van-dialog {
    .van-dialog__content {
      width: 100%;
      height: 100%;
    }
    .dialog {
      width: 100%;
      height: 100%;
      background: url("../../../assets/new/47.png") no-repeat;
      background-size: contain;
      position: relative;
      > div {
        width: 13.1rem;
        height: 12.125rem;
        border-radius: 19px;
        background: #ffffff;
        position: absolute;
        bottom: 0;
        padding: 1.675rem 2.275rem;
        text-align: center;
        h4 {
          font-size: 0.75rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #4a90e2;
          line-height: 1.05rem;
          margin-bottom: 1.325rem;
        }
        p {
          font-size: 0.6rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #818181;
          line-height: 1rem;
          margin-bottom: 1.675rem;
        }
        img {
          width: 7.1rem;
          display: block;
          margin: 0 auto 0.525rem auto;
        }
        a {
          font-size: 0.6rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #818181;
          line-height: 0.825rem;
        }
      }
    }
  }
  > div {
    > div {
      padding: 0 0.5rem;
      .list {
        margin-top: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        list-style-type: none;
        li {
          margin-bottom: 0.7rem;
          a {
            > img {
              width: 4.75rem;
              display: block;
              border: 1px dotted #b5b5b5;
            }
            h3 {
              font-size: 0.7rem;
              font-family: Helvetica;
              color: #333333;
              line-height: 0.85rem;
              margin-top: 0.7rem;
              margin-bottom: 0.35rem;
            }
            span {
              font-size: 0.5rem;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #a2a2a2;
              line-height: 0.7rem;
              img {
                width: 0.475rem;
                height: 0.475rem;
              }
            }
          }
        }
      }
      .banner {
        padding-top: 0.875rem;
        margin-bottom: 0.875rem;
        img {
          width: 100%;
        }
      }
      .itemHead {
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          h3 {
            font-size: 0.9rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 1.25rem;
            position: relative;
            padding-left: 0.5rem;
          }
          h3::before {
            content: "";
            width: 0.15rem;
            height: 0.9rem;
            background: #35b9ff;
            display: block;
            position: absolute;
            left: 0;
            top: 0.175rem;
          }
          h4 {
            font-size: 0.6rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #acb1b9;
            line-height: 0.825rem;
            padding-left: 0.5rem;
          }
        }
        a {
          font-size: 0.65rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #a2a2a2;
          line-height: 0.925rem;
        }
      }
      .item {
        margin-bottom: 1.55rem;
        .media {
          margin-top: 0.75rem;
          > a {
            display: flex;
            margin-bottom: 0.8rem;
            > img {
              width: 3.75rem;
              height: 3.75rem;
              margin-right: 0.875rem;
            }
            > div {
              display: flex;
              flex-flow: column;
              justify-content: space-between;
              > div {
                h3 {
                  font-size: 0.75rem;
                  font-family: Helvetica;
                  color: #000000;
                  line-height: 0.9rem;
                  margin-bottom: 0.35rem;
                }
                span {
                  font-size: 0.6rem;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #666666;
                  line-height: 0.825rem;
                  img {
                    width: 0.6rem;
                    height: 0.6rem;
                  }
                }
              }
              > span {
                font-size: 0.55rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #a2a2a2;
                line-height: 0.75rem;
              }
            }
          }
          > a:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .footer {
      display: flex;
      position: fixed;
      bottom: 0;
      width: 100%;
      justify-content: space-between;
      background: #ffffff;
      padding: 1rem;
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
  }
}
.containerPc {
  background: url(http://localhost:8080/img/56.c6a378cc.png) no-repeat;
  background-size: 100% 100%;
  min-height: 100%;
  background-color: #ffffff;
  /deep/ .van-dialog {
    .van-dialog__content {
      width: 100%;
      height: 100%;
    }
    .dialog {
      width: 100%;
      height: 100%;
      background: url("../../../assets/new/47.png") no-repeat;
      background-size: contain;
      position: relative;
      > div {
        width: 13.1rem;
        height: 12.125rem;
        border-radius: 19px;
        background: #ffffff;
        position: absolute;
        bottom: 0;
        padding: 1.675rem 2.275rem;
        text-align: center;
        h4 {
          font-size: 0.75rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #4a90e2;
          line-height: 1.05rem;
          margin-bottom: 1.325rem;
        }
        p {
          font-size: 0.6rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #818181;
          line-height: 1rem;
          margin-bottom: 1.675rem;
        }
        img {
          width: 7.1rem;
          display: block;
          margin: 0 auto 0.525rem auto;
        }
        a {
          font-size: 0.6rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #818181;
          line-height: 0.825rem;
        }
      }
    }
  }
  > div {
    width: 750px;
    margin: 0 auto;
    > div {
      background: #ffffff;
      padding: 0 0.5rem;
      .list {
        margin-top: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        list-style-type: none;
        li {
          margin-bottom: 0.7rem;
          a {
            > img {
              width: 4.75rem;
              display: block;
              border: 1px dotted #b5b5b5;
            }
            h3 {
              font-size: 0.7rem;
              font-family: Helvetica;
              color: #333333;
              line-height: 0.85rem;
              margin-top: 0.7rem;
              margin-bottom: 0.35rem;
            }
            span {
              font-size: 0.5rem;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #a2a2a2;
              line-height: 0.7rem;
              img {
                width: 0.475rem;
                height: 0.475rem;
              }
            }
          }
        }
      }
      .banner {
        padding-top: 0.875rem;
        margin-bottom: 0.875rem;
        img {
          width: 100%;
        }
      }
      .itemHead {
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          h3 {
            font-size: 0.9rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 1.25rem;
            position: relative;
            padding-left: 0.5rem;
          }
          h3::before {
            content: "";
            width: 0.15rem;
            height: 0.9rem;
            background: #35b9ff;
            display: block;
            position: absolute;
            left: 0;
            top: 0.175rem;
          }
          h4 {
            font-size: 0.6rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #acb1b9;
            line-height: 0.825rem;
            padding-left: 0.5rem;
          }
        }
        a {
          font-size: 0.65rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #a2a2a2;
          line-height: 0.925rem;
        }
      }
      .item {
        margin-bottom: 1.55rem;
        .media {
          margin-top: 0.75rem;
          > a {
            display: flex;
            margin-bottom: 0.8rem;
            > img {
              width: 3.75rem;
              height: 3.75rem;
              margin-right: 0.875rem;
            }
            > div {
              display: flex;
              flex-flow: column;
              justify-content: space-between;
              > div {
                h3 {
                  font-size: 0.75rem;
                  font-family: Helvetica;
                  color: #000000;
                  line-height: 0.9rem;
                  margin-bottom: 0.35rem;
                }
                span {
                  font-size: 0.6rem;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #666666;
                  line-height: 0.825rem;
                  img {
                    width: 0.6rem;
                    height: 0.6rem;
                  }
                }
              }
              > span {
                font-size: 0.55rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #a2a2a2;
                line-height: 0.75rem;
              }
            }
          }
          > a:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .footer {
      display: flex;
      width: 100%;
      justify-content: space-between;
      background: #ffffff;
      padding: 1rem;
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
  }
}
</style>