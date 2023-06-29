<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <div class="header">填写真实信息</div>
      <div class="step">
        <div>1.填写学校</div>
        <img src="../../../assets/new/45.png" />
        <div class="active">2.选择年级班级</div>
        <img src="../../../assets/new/45.png" />
        <div>3.填写姓名</div>
      </div>
      <div class="search">
        <div class="cells">
          <a
            href="javascript: void(0)"
            class="cell"
            @click="gradePicker = true"
          >
            <div class="left">
              <h4>年级</h4>
              {{ gradeName }}
            </div>
            <div class="right">
              <img src="../../../assets/new/29.png" />
            </div>
          </a>
          <a
            href="javascript: void(0)"
            class="cell"
            @click="classPicker = true"
          >
            <div class="left">
              <h4>班级</h4>
              {{ className }}
            </div>
            <div class="right">
              <img src="../../../assets/new/29.png" />
            </div>
          </a>
        </div>
        <van-button
          round
          block
          type="primary"
          @click="next"
          style="width: 80%; margin: 1rem auto"
          >下一步</van-button
        >
      </div>
    </div>
  </div>
  <van-popup v-model:show="gradePicker" round position="bottom">
    <van-picker
      title="请选择年级"
      :columns="getPeriod"
      @cancel="gradePicker = false"
      @confirm="selectGrade"
      :columns-field-names="{ text: 'name' }"
    />
  </van-popup>
  <van-popup v-model:show="classPicker" round position="bottom">
    <van-picker
      title="请选择班级"
      :columns="classData.data"
      @confirm="selectClass"
      @cancel="classPicker = false"
    />
  </van-popup>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
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
const router = useRouter();
const route = useRoute();
const gradeName = ref("");
const className = ref("");
const gradePicker = ref(false);
const classPicker = ref(false);
const classData = reactive({ data: [] });

const grade = [
  { name: "小一上 (0起点)", value: "X1s" },
  { name: "小一下", value: "X1x" },
  { name: "小二上", value: "X2s" },
  { name: "小二下", value: "X2x" },
  { name: "小三上", value: "X3s" },
  { name: "小三下", value: "X3x" },
  { name: "小四上", value: "X4s" },
  { name: "小四下", value: "X4x" },
  { name: "小五上", value: "X5s" },
  { name: "小五下", value: "X5x" },
  { name: "小六上", value: "X6s" },
  { name: "小六下", value: "X6x" },
  { name: "初一上", value: "C1s" },
  { name: "初一下", value: "C1x" },
  { name: "初二上", value: "C2s" },
  { name: "初二下", value: "C2x" },
  { name: "初三上", value: "C3s" },
  { name: "初三下", value: "C3x" },
  { name: "高一上", value: "G1s" },
  { name: "高一下", value: "G1x" },
  { name: "高二上", value: "G2s" },
  { name: "高二下", value: "G2x" },
  { name: "高三上", value: "G3s" },
  { name: "高三下", value: "G3x" },
  { name: "大一上", value: "B1s" },
  { name: "大一下", value: "B1x" },
  { name: "大二上", value: "B2s" },
  { name: "大二下", value: "B2x" },
  { name: "大三上", value: "B3s" },
  { name: "大三下", value: "B3x" },
  { name: "大四上", value: "B4s" },
  { name: "大四下", value: "B4x" },
  { name: "研一上", value: "Y1s" },
  { name: "研一下", value: "Y1x" },
  { name: "研二上", value: "Y2s" },
  { name: "研二下", value: "Y2x" },
  { name: "研三上", value: "Y3s" },
  { name: "研三下", value: "Y3x" },
  { name: "研四上", value: "Y4s" },
  { name: "研四下", value: "Y4x" },
];
const getPeriod = computed(() => {
  if (formData.data.school_type === "X")
    return grade.filter((v) => {
      return v.value[1] == "B" || v.value[0] === "X";
    });
  if (formData.data.school_type === "C")
    return grade.filter((v) => {
      return v.value[0] === "C";
    });
  if (formData.data.school_type === "G")
    return grade.filter((v) => {
      return v.value[0] === "G";
    });
  if (formData.data.school_type === "D")
    return grade.filter((v) => {
      return v.value[0] == "B" || v.value[0] === "Y";
    });
  return [];
});
const formData = reactive({ data: {} });
const next = () => {
  console.log(formData.data);
  if (formData.data.grade_id && formData.data.class_id) {
    if (route.query.type) {
      router.push({
        name: "studentMes",
        params: { ...formData.data },
        query: { type: route.query.type },
      });
    } else {
      router.push({ name: "studentMes", params: { ...formData.data } });
    }
  } else {
    ElMessage.error("请选择完整哦");
  }
};
const selectGrade = (data) => {
  console.log(data);
  gradeName.value = data.name;
  formData.data.grade_id = data.value;
  gradePicker.value = false;
};
const selectClass = (data) => {
  console.log(data);
  className.value = data.text;
  formData.data.class_id = data.value;
  classPicker.value = false;
};
onMounted(() => {
  console.log(route.params);
  if (Object.keys(route.params).length === 0) {
    router.push({ name: "schoolMes" });
  }
  formData.data = { ...route.params };
  console.log(formData);
  if (formData.data.grade_id) {
    gradeName.value = grade.filter(
      (item) => item.value === formData.data.grade_id
    )[0].name;
  }
  for (let i = 1; i <= 40; i++) {
    classData.data.push({ text: i + "班", value: i + "" });
  }
  if (formData.data.class_id !== "0") {
    className.value = classData.data.filter(
      (item) => item.value === formData.data.class_id + ""
    )[0].text;
  }
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