<template>
  <div :class="[isMobile ? 'container' : 'containerPc']">
    <div>
      <div class="header">填写真实信息</div>
      <div class="step">
        <div class="active">1.填写学校</div>
        <img src="../../../assets/new/45.png" />
        <div>2.选择年级班级</div>
        <img src="../../../assets/new/45.png" />
        <div>3.填写姓名</div>
      </div>
      <div class="search">
        <div class="cells">
          <a
            href="javascript: void(0)"
            class="cell"
            @click="provincePicker = true"
          >
            <div class="left">
              <h4>省份</h4>
              {{ provinceName }}
            </div>
            <div class="right">
              <img src="../../../assets/new/29.png" />
            </div>
          </a>
          <a href="javascript: void(0)" class="cell" @click="cityPicker = true">
            <div class="left">
              <h4>城市</h4>
              {{ cityName }}
            </div>
            <div class="right">
              <img src="../../../assets/new/29.png" />
            </div>
          </a>
          <a
            href="javascript: void(0)"
            class="cell"
            @click="areasPicker = true"
          >
            <div class="left">
              <h4>区</h4>
              {{ areasName }}
            </div>
            <div class="right">
              <img src="../../../assets/new/29.png" />
            </div>
          </a>
          <a
            href="javascript: void(0)"
            class="cell"
            @click="sectionPicker = true"
          >
            <div class="left">
              <h4>学段</h4>
              {{ sectionName }}
            </div>
            <div class="right">
              <img src="../../../assets/new/29.png" />
            </div>
          </a>
          <a
            href="javascript: void(0)"
            class="cell"
            @click="schoolPicker = true"
          >
            <div class="left">
              <h4>学校</h4>
              {{ schoolData.name }}
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
  <van-popup v-model:show="provincePicker" round position="bottom">
    <van-picker
      title="请选择省份"
      :columns="provinceList.data"
      @confirm="getProvinceVal"
      @cancel="provincePicker = false"
      :columns-field-names="{ text: 'name', value: 'id' }"
    />
  </van-popup>
  <van-popup v-model:show="cityPicker" round position="bottom">
    <van-picker
      title="请选择城市"
      :columns="cityList.data"
      @confirm="getCityVal"
      @cancel="cityPicker = false"
      :columns-field-names="{ text: 'name', value: 'id' }"
    />
  </van-popup>
  <van-popup v-model:show="areasPicker" round position="bottom">
    <van-picker
      title="请选择区"
      :columns="regionList.data"
      @confirm="getRegionVal"
      @cancel="areasPicker = false"
      :columns-field-names="{ text: 'name', value: 'id' }"
    />
  </van-popup>
  <van-popup v-model:show="sectionPicker" round position="bottom">
    <van-picker
      title="请选择学段"
      :columns="school"
      @confirm="sectionChange"
      @cancel="sectionPicker = false"
    />
  </van-popup>
  <van-popup v-model:show="schoolPicker" round position="bottom">
    <van-picker
      title="请选择学校"
      :columns="schoolList.data"
      @confirm="selectFinalSchool"
      @cancel="schoolPicker = false"
      :columns-field-names="{ text: 'name', value: 'id' }"
    />
  </van-popup>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useStore } from "vuex";
import { userCityList, userSchoolList } from "../../../api/index";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
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
const store = useStore();
const safeMes = computed(() => store.state.safeMes);
const userInfo = computed(() => store.state.userInfo);
// ------------------------------------------
const provincePicker = ref(false);
const cityPicker = ref(false);
const sectionPicker = ref(false);
const schoolPicker = ref(false);
const areasPicker = ref(false);
const provinceName = ref("");
const cityName = ref("");
const areasName = ref("");
const sectionName = ref("");
// ---------------------------------------------
let schoolPeriod = ""; //学段值
let nowPeriod = ""; //年级id
let class_id = 0; //班级id
const schoolData = reactive({ name: "", id: "" }); // 学校值
const area = reactive({ data: [] }); // 地区值
// ---------------------------------------------
const school = ["小学", "初中", "高中", "大学"]; // 学段
const schoolList = reactive({ data: [] }); // 学校
const provinceList = reactive({ data: [] }); // 省
const cityList = reactive({ data: [] }); // 市
const regionList = reactive({ data: [] }); // 区

const next = () => {
  const formData = {
    province_id: area.data[0],
    city_id: area.data[1],
    county_id: area.data[2],
    school_id: schoolData.id,
    school_name: schoolData.name,
    school_type: schoolPeriod,
    grade_id: nowPeriod,
    class_id: class_id,
  };
  console.log(formData);
  if (
    !formData.province_id ||
    !formData.city_id ||
    !formData.county_id ||
    !formData.school_type ||
    !formData.school_id
  ) {
    ElMessage.error("请选择完整哦");
  } else {
    if (route.query.type) {
      router.push({
        name: "classMes",
        params: { ...formData },
        query: { type: route.query.type },
      });
    } else {
      router.push({ name: "classMes", params: { ...formData } });
    }
  }
  console.log(formData);
};
const getProvinceVal = (data) => {
  provinceName.value = data.name;
  provincePicker.value = false;
  cityName.value = "";
  areasName.value = "";
  getAreaData(data.id, 1);
  sectionName.value = "";
  schoolPeriod = "";
  schoolData.name = "";
  schoolData.id = "";
};
const getCityVal = (data) => {
  cityName.value = data.name;
  cityPicker.value = false;
  areasName.value = "";
  getAreaData(data.id, 2);
  sectionName.value = "";
  schoolPeriod = "";
  schoolData.name = "";
  schoolData.id = "";
};
const getRegionVal = (data) => {
  areasName.value = data.name;
  area.data.splice(2, 1, data.id);
  areasPicker.value = false;
  sectionName.value = "";
  schoolPeriod = "";
  schoolData.name = "";
  schoolData.id = "";
};
const sectionChange = (data) => {
  console.log(data);
  sectionPicker.value = false;
  sectionName.value = data;
  let arr = ["X", "C", "G", "D"];
  schoolPeriod = arr[school.indexOf(data)];
  getSchoolList();
  schoolData.name = "";
  schoolData.id = "";
};
const selectFinalSchool = (data) => {
  schoolPicker.value = false;
  schoolData.name = data.name;
  schoolData.id = data.id;
};
const getSchoolList = () => {
  if (area.data.findIndex((v) => v === 0) !== -1 || !schoolPeriod)
    return ElMessage.info("请先选择完地区和学习阶段哦");
  let obj = {
    ...safeMes.value,
    city_id: area.data[2],
    school_type: schoolPeriod,
  };
  userSchoolList(JSON.stringify(obj))
    .then((res) => {
      let data = res.data;
      if (data.code)
        return store.commit("judgeCode", {
          code: data.code,
          msg: data.msg,
        });
      schoolList.data = data.data;
    })
    .catch(() => {
      return ElMessage.error("获取学校列表失败");
    });
};
const getAreaData = (data0, type = 0) => {
  let obj = {
    parentid: data0,
    ...safeMes.value,
  };
  userCityList(encodeURIComponent(JSON.stringify(obj)))
    .then((res) => {
      let data = res.data;
      if (data.code) return ElMessage.error(data.msg);
      if (!type) {
        provinceList.data = data.data;
      } else if (type === 1) {
        regionList.data = [];
        cityList.data = data.data;
        //	数组响应式
        console.log(data0);
        console.log(cityList.data[0].id);
        area.data.splice(0, 1, data0);
        area.data.splice(1, 1, cityList.data[0].id);
        area.data.splice(2, 1, 0);
        console.log(area.data);
      } else {
        regionList.data = data.data;
        area.data.splice(1, 1, data0);
        area.data.splice(2, 1, regionList.data[0].id);
      }
    })
    .catch(() => {});
};
onMounted(() => {
  if (userInfo.value && localStorage.getItem("ways") === "wechat") {
    nowPeriod = "X1s";
    class_id = 1;
  }
  if (localStorage.getItem("title")) {
    document.title = localStorage.getItem("title");
  }
  console.log(userInfo.value);
  if (userInfo.value.hasSchoolInfo) {
    nowPeriod = userInfo.value.grade_id;
    class_id = userInfo.value.class_id;
    schoolPeriod = userInfo.value.school_type;
    provinceList.data = userInfo.value.province_list;
    cityList.data = userInfo.value.city_list;
    regionList.data = userInfo.value.county_list;
    schoolData.id = userInfo.value.school_id;
    schoolData.name = userInfo.value.school_name;
    area.data.splice(0, 1, userInfo.value.province_id);
    area.data.splice(1, 1, userInfo.value.city_id);
    area.data.splice(2, 1, userInfo.value.county_id);

    provinceList.data.forEach((item) => {
      if (item.id === userInfo.value.province_id) {
        provinceName.value = item.name;
      }
    });
    cityList.data.forEach((item) => {
      if (item.id === userInfo.value.city_id) {
        cityName.value = item.name;
      }
    });
    regionList.data.forEach((item) => {
      if (item.id === userInfo.value.county_id) {
        areasName.value = item.name;
      }
    });
    let arr = ["X", "C", "G", "D"];
    sectionName.value = school[arr.indexOf(schoolPeriod)];
  } else {
    getAreaData(1);
  }
  getSchoolList();
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