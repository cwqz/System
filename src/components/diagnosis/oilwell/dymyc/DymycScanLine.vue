<template>
  <el-dialog
    title="动液面曲线"
    :modal="false"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    size="42%"
    :visible.sync="previewDymVisible"
    @opened="opens"
    :before-close="previewDymClose"
  >
    <el-form>
      <el-form-item label="选择日期" size="120px">
        <el-date-picker
          v-model="value2"
          type="daterange"
          size="small"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="gtDataInit()"
        />
      </el-form-item>
    </el-form>
    <div
      class="chart"
      id="myChart"
      :style="{ width: '100%', height: '400px' }"
    />
  </el-dialog>
</template>

<script>
let echarts = require("echarts/lib/echarts");
export default {
  props: {
    previewDymVisible: {
      type: Boolean,
    },
    previewData: {
      type: Object,
    },
  },
  data() {
    return {
      tableData: [],
      xAxis: [],
      yAxis: [],
      data: [[]],
      isColor: true,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value2: [],
    };
  },
  methods: {
    // 对话框父子组件传值
    previewDymClose() {
      this.$emit("previewDymRowClose");
    },
    mounted() {
      this.drawLine();
    },
    gtDataInit() {
      if (this.value2 !== null) {
        this.getRequest(
          "/diagnosis/abnormal/queryFluidLevelAbnormalByTime?startDate=" +
            this.value2[0] +
            "&endDate=" +
            this.value2[1] +
            "&wellId=" +
            this.previewData.wellId
        ).then((resp) => {
          if (resp) {
            this.tableData = [];
            this.tableData = resp.data;
            this.coordinate();
            this.$nextTick(() => {
              this.drawLine();
            });
          }
        });
      }
    },
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        title: {
          x: "center",
          text:
            this.previewData.wellName +
            "号井  " +
            this.value2[0] +
            "至" +
            this.value2[1] +
            "动液面曲线",
          top: "7%",
          textStyle: {
            fontSize: 13,
            fontStyle: "normal",
            fontWeight: "bolder",
          },
          subtext: "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          formatter: function (params) {
            return (
              "<div><p>时间：" +
              params[0].value[0] +
              "</p>" +
              "<p>动液面：" +
              params[0].value[1].toFixed(2) +
              "m</p>" +
              "</div>"
            );
          },
        },
        toolbox: {
          left: "right",
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        dataZoom: [
          {
            startValue: "2014-06-01",
          },
          {
            type: "inside",
          },
        ],
        grid: {
          left: "3%",
          right: "3%",
          bottom: "15%",
          top: "20%",
          containLabel: true,
        },
        xAxis: {
          nameLocation: "middle",
          type: "time",
        },
        yAxis: {
          name: "动液面(m)",
          nameLocation: "middle",
          nameGap: 30,
          type: "value",
          axisLine: { onZero: false },
          nameTextStyle: {
            padding: [0, 0, 6, 0],
            fontSize: 10,
          },
        },
        series: [
          {
            type: "line",
            smooth: true,
            lineStyle: {
              color: "green",
              width: 1,
            },
            data: this.data,
          },
        ],
      });
    },
    //将坐标数据串处理为坐标点
    coordinate() {
      this.data = [[]];
      for (var i = 0; i < this.tableData.length; i++) {
        this.data[i] = [];
        this.data[i][0] = this.tableData[i].analysisDate;
        this.data[i][1] = this.tableData[i].fluidLevel;
      }
      return this.data;
    },
    //初始化时间
    dateInit() {
      if (this.value2.length == 0) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = date.getDate();
        day = day < 10 ? "0" + day : day;
        var endDate = year + "-" + month + "-" + day;
        this.value2[1] = endDate;
        var date1 = new Date();
        date1.setTime(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        var year1 = date1.getFullYear();
        var month1 = date1.getMonth() + 1;
        month1 = month1 < 10 ? "0" + month1 : month1;
        var day1 = date1.getDate();
        day1 = day1 < 10 ? "0" + day1 : day1;
        var beginDate = year1 + "-" + month1 + "-" + day1;
        this.value2[0] = beginDate;
      }
    },
    opens() {
      this.value2 = [];
      this.dateInit();
      this.gtDataInit();
    },
  },
  watch: {
    value2() {
      this.gtDataInit();
    },
  },
};
</script>

<style lang="less" scoped>
.dialogDiv {
  height: 400px;
  overflow: auto;
}
.dialogDiv .el-input {
  width: 700px;
}
</style>

