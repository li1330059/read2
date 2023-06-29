<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <div class="header">
        <a href="javascript: void(0)" @click="router.go(-1)">
          <img src="../../../assets/new/31.png" />
        </a>
        设置阅读能力
      </div>
      <div style="padding: 20px">
        <div style="font-size: 16px; color: #181818; margin-bottom: 20px">
          如果感觉真实的阅读能力与当前级别不匹配，请在下方手动调整。
        </div>
        <div
          style="
            display: flex;
            justify-content: space-evenly;
            margin-bottom: 30px;
          "
        >
          <div
            v-for="(item, index) in school"
            :key="index"
            @click="getSchoolList(index)"
            class="item"
            :class="{ active: checked === item ? true : false }"
          >
            <span>{{ item }}</span>
          </div>
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            font-weight: bold;
            margin-bottom: 10px;
          "
        >
          <img src="../../../assets/jibie.png" style="margin-right: 5px" />
          级别
        </div>
        <div
          style="
            width: 80%;
            margin: 0 auto;
            position: relative;
            margin-bottom: 40px;
          "
        >
          <select @change="changeOption" v-model="user_grade_bak">
            <option
              :value="item.value"
              v-for="item in getPeriod"
              :key="item.value"
            >
              {{ item.name }}
            </option>
          </select>
          <img
            src="../../../assets/select.png"
            style="position: absolute; right: 0; top: 0"
          />
        </div>
        <button
          type="button"
          v-if="user_grade_bak === '' || user_grade_bak === init_user_grade_bak"
          class="font-bold text-center btn"
          @click="$router.push('/my')"
        >
          跳过
        </button>
        <button
          type="button"
          v-else
          class="font-bold text-center btn"
          @click="submit"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { onMounted, computed, ref } from "vue";
import { getLocalPid } from "../../../libs/util";
import { ElMessage } from "element-plus";
import { userSetLevel } from "../../../api/index";
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
const route = useRoute();
const router = useRouter();
const getPeriod = computed(() => {
  if (schoolPeriod.value === "X")
    return grade.filter((v) => {
      return v.value[1] === "B" || v.value[0] === "X";
    });
  if (schoolPeriod.value === "C")
    return grade.filter((v) => {
      return v.value[0] === "C";
    });
  if (schoolPeriod.value === "G")
    return grade.filter((v) => {
      return v.value[0] === "G";
    });
  if (schoolPeriod.value === "D")
    return grade.filter((v) => {
      return v.value[0] === "B" || v.value[0] === "Y";
    });
  return [];
});
const school = ["小学", "初中", "高中", "大学"];
const vis = ref(true);
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
const user_grade_bak = ref("");
let schoolPeriod = ref("");
const checked = ref("");
const init_user_grade_bak = ref("");
const safeMes = computed(() => store.state.safeMes);
const userInfo = computed(() => store.state.userInfo);

onMounted(() => {
  console.log(route.query.type);
  const gradeVal = userInfo.value.grade || route.query.type;
  if (gradeVal) {
    init_user_grade_bak.value = user_grade_bak.value = gradeVal;
    if (gradeVal[1] == "B" || gradeVal == "X") {
      schoolPeriod.value = "X";
      checked.value = "小学";
    }
    if (gradeVal[0] == "C") {
      schoolPeriod.value = "C";
      checked.value = "初中";
    }
    if (gradeVal[0] == "G") {
      schoolPeriod.value = "G";
      checked.value = "高中";
    }
    if (gradeVal[0] == "B" || gradeVal[0] == "Y" || gradeVal == "D") {
      schoolPeriod.value = "D";
      checked.value = "大学";
    }
  }
});
const getSchoolList = (index) => {
  let arr = ["X", "C", "G", "D"];
  schoolPeriod.value = arr[index];
  checked.value = school[index];
  vis.value = false;
  setTimeout(() => {
    vis.value = true;
    user_grade_bak.value = getPeriod.value[0].value;
  }, 100);
};
//  改变选中值
const changeOption = ($event) => {
  user_grade_bak.value = $event.target.value;
};
const submit = () => {
  if (!user_grade_bak.value) return ElMessage.error("请勾选调整后的年级");
  let obj = {
    ...safeMes.value,
    grade: user_grade_bak.value,
    pid: getLocalPid(),
  };
  userSetLevel(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      let data = res.data;
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      store.commit("destoryPreUserMes");
      if (route.query.type) {
        router.push({
          name: "my",
          query: { pid: getLocalPid() },
        });
      } else {
        router.push({
          name: "my",
          query: { pid: getLocalPid() },
        });
      }
      return ElMessage.success("设置成功");
    })
    .catch((err) => {
      return ElMessage.error(JSON.stringify(err));
    });
};
</script>

<style scoped lang="less">
.container {
  > div {
    min-height: 100%;
    background: #ffffff;
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
    .item {
      width: 49px;
      height: 29px;
      border: 0.5px solid #dbdbdb;
      border-radius: 3px;
      font-size: 14px;
      line-height: 27px;
      text-align: center;
    }
    .active {
      background-image: linear-gradient(-58deg, #2b9af3 6%, #4bb1fa 100%);
      border: 0 none;
      color: #ffffff;
    }
    select {
      width: 100%;
      display: block;
      height: 31px;
      padding: 0 10px;
      border: 1px solid #dbdbdb;
      outline: none;
    }
    button {
      width: 100%;
      height: 55px;
      background-image: linear-gradient(-58deg, #2b9af3 6%, #4bb1fa 100%);
      box-shadow: 0px 8px 14px 0px rgba(74, 144, 226, 0.3);
      border-radius: 100px;
      color: #ffffff;
      box-shadow: none;
      font-size: 17px;
      border: 0 none;
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
    background: #ffffff;
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
    .item {
      width: 49px;
      height: 29px;
      border: 0.5px solid #dbdbdb;
      border-radius: 3px;
      font-size: 14px;
      line-height: 27px;
      text-align: center;
    }
    .active {
      background-image: linear-gradient(-58deg, #2b9af3 6%, #4bb1fa 100%);
      border: 0 none;
      color: #ffffff;
    }
    select {
      width: 100%;
      display: block;
      height: 31px;
      padding: 0 10px;
      border: 1px solid #dbdbdb;
      outline: none;
    }
    button {
      width: 100%;
      height: 55px;
      background-image: linear-gradient(-58deg, #2b9af3 6%, #4bb1fa 100%);
      box-shadow: 0px 8px 14px 0px rgba(74, 144, 226, 0.3);
      border-radius: 100px;
      color: #ffffff;
      box-shadow: none;
      font-size: 17px;
      border: 0 none;
    }
  }
}
</style>
