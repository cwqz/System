<template>
  <div class="wellsite">
    <div class="wellsite_left">
      <span class="wellsite_left_title"><b style="font-size: 35px;">{{ this.$route.query.name }}井场</b></span>
      <div class="wellsite_left_dailyData">
        <p class="wellsite_left_dailyData_p">
          日产液量:
          <span style="color: #ec8e25" v-if="this.wellSite1">{{
            this.wellSite1.drLiquidProd
          }}</span>
          m<sup>3</sup>
        </p>
        <p class="wellsite_left_dailyData_p">
          日注水量:
          <span style="color: #ec8e25" v-if="this.wellSite2">
            {{ this.wellSite2.drWaterInjection }}
          </span>
          m<sup>3</sup>
        </p>
        <p class="wellsite_left_dailyData_p">
          电子巡检次数: <span style="color: #ec8e25">0</span> 次
        </p>
      </div>
      <div class="wellsite_left_condition">
        <i class="iconfont icon-yujing_gaoliang wellsite_left_condition_icon" />
        <span class="wellsite_left_condition_title"> 工况预警 </span>
      </div>
      <div class="wellsite_left_condition_details">
        <ul :style="{ marginTop: marginTop + 'px' }">
          <li
            v-for="(item, index) in conditionData"
            :key="index"
            class="wellsite_left_condition_details_li"
          >
            {{ item.wellName }}出现{{ item.diagnosisResult }}预警情况
          </li>
        </ul>
      </div>
      <div class="wellsite_left_condition">
        <i class="iconfont icon-yujing_gaoliang wellsite_left_condition_icon" />
        <span class="wellsite_left_condition_title"> 监控预警 </span>
      </div>
      <div class="wellsite_left_condition_details">
        <ul :style="{ marginTop: marginTop + 'px' }">
          <li
            v-for="(item, index) in videoData"
            :key="index"
            class="wellsite_left_condition_details_li"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="wellsite_left_img">
        <!--视频监控-->
        <iframe
          id="show-iframe"
          :src="this.videoLink"
          frameborder="0"
          allow="autoplay;encrypted-media"
          allowfullscreen
          style="height: 100%; width: 100%; margin-top: 1%"
        />
      </div>
      <div class="wellsite_left_video">
        <div
          class="wellsite_left_video_container"
          v-for="(item, index) in this.wellSiteNumber"
          :key="index"
        >
          <div class="wellsite_left_video_container_text">
            <i
              class="iconfont icon-shexiangtou"
              style="color: green; font-size: 19px"
              @click="clickVideo(item)"
            />正常
          </div>
        </div>
        <!-- <div
          class="wellsite_left_video_container"
          v-for="(item, index) in 1"
          :key="index"
        >
          <div>
            <i
              class="iconfont icon-shexiangtou"
              style="color: red; font-size: 30px"
            />异常
          </div>
        </div> -->
      </div>
    </div>
    <div class="wellsite_right">
      <div class="wellsite_right_oilWell">
        <div
          class="wellsite_right_oilWell_details"
          v-for="(item, index) in this.wellSiteOilData"
          :key="index"
        >
          <div class="wellsite_right_oilWell_details_title">
            {{ item.wellName }}采油井
          </div>
          <img
            src="../../assets/images/oilWell.gif"
            class="wellsite_right_oilWell_details_img"
            @click="
              gotoSingleWell(item.wellName, item.wellId, item.wellSitName)
            "
          />
          <div class="wellsite_right_oilWell_details_dec">
            <span class="wellsite_right_waterWell_details_dec_span"
              >当日产液:
              <span style="color: #2cab6f">{{ item.drLiquidProd }}</span> m<sup
                >3</sup
              ></span
            >
            <span class="wellsite_right_waterWell_details_dec_span"
              >动液面:
              <span style="color: #2cab6f">{{ item.fluidLevel }}</span> m<sup
                >3</sup
              ></span
            >
            <span
              class="wellsite_right_waterWell_details_dec_span"
              v-if="item.diagnosisResult !== null"
              >工况诊断:
              <span style="color: #2cab6f">{{
                item.diagnosisResult
              }}</span></span
            >
            <span
              class="wellsite_right_waterWell_details_dec_span"
              v-if="item.diagnosisResult === null"
              >工况诊断:
              <span style="color: #e62c2c">停井修复无工况</span></span
            >
            <span
              class="wellsite_right_waterWell_details_dec_span"
              v-if="item.abnormalities !== null"
              >异常情况:
              <span style="color: #e62c2c">
                {{ item.abnormalities }}</span
              ></span
            >
            <span
              class="wellsite_right_waterWell_details_dec_span"
              v-if="item.abnormalities === null"
              >异常情况: <span style="color: #e62c2c"> 无</span></span
            >
          </div>
        </div>
      </div>
      <div class="wellsite_right_waterWell">
        <div
          class="wellsite_right_waterWell_details"
          v-for="(item, index) in this.wellSiteWaterData"
          :key="index"
        >
          <div class="wellsite_right_waterWell_details_title">
            {{ item.wellName }}注水井
          </div>
          <img
            src="../../assets/images/waterWell.png"
            class="wellsite_right_waterWell_details_img"
            @click="gotoSingleWell(item.wellName, item.wellId)"
          />
          <div class="wellsite_right_waterWell_details_dec">
            <span class="wellsite_right_waterWell_details_dec_span"
              >瞬时注量:
              <span style="color: #2cab6f">0</span> m<sup>3</sup>/h</span
            >
            <span class="wellsite_right_waterWell_details_dec_span"
              >当日注水:
              <span style="color: #2cab6f" v-if="item">
                {{ item.drWaterInjection }}
              </span>
              m<sup>3</sup></span
            >
            <span class="wellsite_right_waterWell_details_dec_span"
              >累计注水: <span style="color: #2cab6f">0</span> m<sup
                >3</sup
              ></span
            >
            <span
              class="wellsite_right_waterWell_details_dec_span"
              v-if="item.abnormalType === '0'"
              >异常情况: <span style="color: #e62c2c"> 正常</span></span
            >
            <span
              class="wellsite_right_waterWell_details_dec_span"
              v-if="item.abnormalType === '1'"
              >异常情况: <span style="color: #e62c2c"> 欠注</span></span
            >
            <span
              class="wellsite_right_waterWell_details_dec_span"
              v-if="item.abnormalType === '2'"
              >异常情况: <span style="color: #e62c2c"> 超注</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 井场汇总
      wellSite1: {},
      wellSite2: {},
      // 工况预警
      conditionData: [],
      // 监控预警
      videoData: [
        { name: "该井场出现视频遮挡" },
        { name: "该井场出现外来人员" },
      ],
      wellSiteVideoData: [],
      // 油井汇总
      wellSiteOilData: [],
      // 水井汇总
      wellSiteWaterData: [],
      // 视频数量
      wellSiteNumber: [],
      marginTop: 0,
      timer: "", // 定时器
      videoLink: "",
    };
  },
  created() {
    this.timer = setInterval(this.showNotice, 200); //100表示间隔时间，数字越大滚得越快
    this.wellSiteInit();
    this.wellSiteVideoInit();
  },
  methods: {
    // 井场汇总信息
    wellSiteInit() {
      var yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      var year = yesterday.getFullYear();
      var month =
        yesterday.getMonth() + 1 > 9
          ? yesterday.getMonth() + 1
          : "0" + (yesterday.getMonth() + 1);
      var day =
        yesterday.getDate() > 9
          ? yesterday.getDate()
          : "0" + yesterday.getDate();
      yesterday = year + "-" + month + "-" + day;
      this.getRequest(
        "/wellSits/wellSit/WellSitList?sTime=" +
          yesterday +
          "&wellSitId=" +
          this.$route.query.id
        // "/wellSits/wellSit/WellSitList?sTime=2021-01-03" +
        //   "&wellSitId=" +
        //   this.$route.query.id
      ).then((resp) => {
        if (resp) {
          // 左侧井场汇总信息
          this.wellSite1 = resp.data.wellSitInfo;
          this.wellSite2 = resp.data.waterSitInfo;
          // 右侧详细信息
          this.wellSiteOilData = resp.data.wellSitInfoList;
          this.wellSiteWaterData = resp.data.waterSitInfoList;
          this.conditionData = resp.data.wellAbnormalList;
        }
      });
    },
    // 视频信息
    wellSiteVideoInit() {
      this.getRequest(
        "/unattended/monitoring/getVideoLink?wellSitName=" +
          this.$route.query.name
      ).then((resp) => {
        if (resp) {
          this.wellSiteNumber = resp.data;
          //默认展示第一个视频
          this.videoLink = this.wellSiteNumber[0].videoLink;
        }
      });
    },

    // 返回采油站页面
    gotoOilStation() {
      this.$router.replace("/unattended/oilStation");
    },
    // 跳转到单井页面
    gotoSingleWell(val1, val2, val3) {
      this.$router.push({
        path: "/unattended/singleWell",
        query: {
          name: val1,
          id: val2,
          sitName: val3,
        },
      });
    },
    // 视频点击
    clickVideo(val) {
      this.videoLink = val.videoLink;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/css/unattended/wellsite.css";
</style>
<style>
.wellsite_left_condition_details ul li:before {
  display: inline-block;
  content: "●";
  padding-right: 10px;
  color: rgb(202, 137, 137);
  font-size: 20px;
}
/* 定义滚动条样式 */
.wellsite ::-webkit-scrollbar {
  width: 2px;
  height: 7px;
  background-color: #223c66;
}

/*定义滚动条轨道 内阴影+圆角*/
.wellsite ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px rgba(83, 82, 82, 0.5);
  border-radius: 10px;
  /* background-color: rgba(240, 240, 240, 0.5); */
}

/*定义滑块 内阴影+圆角*/
.wellsite ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  background-color: rgba(240, 240, 240, 0.5);
}
</style>
