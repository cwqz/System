<template>
  <div class="features">
    <el-form class="features_form" :model="logForm" :inline="true">
      <el-form-item label="采油站:">
        <el-select
          @change="queryWellNameByOrgName"
          v-model="logForm.oilStation"
          placeholder="全区"
        >
          <el-option
            v-for="item in oilStationOptions"
            :key="item.orgName"
            :label="item.orgName"
            :value="item.orgName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="井号:">
        <el-select v-model="logForm.wellId" placeholder>
          <el-option
            v-for="item in wellNameoptions"
            :key="item.wellName"
            :label="item.wellName"
            :value="item.wellName"
          />
        </el-select>
      </el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="searchFeatures()"
        >查询</el-button
      >
    </el-form>
    <div class="features_echarts">
      <div
        v-for="item in tableData"
        :key="item.dynaId"
        :style="{ width: '25%', height: '260px' }"
      >
        <div
          class="features_echarts_child"
          :key="item.dynaId"
          :id="item.dynaId"
        />
        <div class="features_echarts_button">
          <el-button type="primary" size="mini" @click="editFeatures(item)"
            >修改</el-button
          >
          <el-button type="primary" size="mini" @click="deleteFeatures(item)"
            >删除</el-button
          >
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="features_page">
      <el-pagination
        :current-page.sync="logForm.currentPage"
        :page-size="logForm.pageSize"
        :total="logForm.total"
        :page-sizes="[8, 16, 32, 48, 60]"
        layout="total, prev, pager, next, jumper, sizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 修改 -->
    <common-edit-features
      :editFeaturesVisible="editFeaturesVisible"
      :featuresData="editFeaturesData"
      @featuresRowClose="editFeaturesClose"
    />
  </div>
</template>
<script>
import CommonEditFeatures from "../../../components/diagnosis/knowledge/CommonEditFeatures";
let echarts = require("echarts/lib/echarts");
export default {
  components: {
    CommonEditFeatures,
  },
  data() {
    return {
      //搜索框
      logForm: {
        currentPage: 1,
        pageSize: 8,
        total: 0,
        oilStation: "",
        wellId: "定1155",
      },
      editFeaturesVisible: false,
      wellNameoptions: [],
      oilStationOptions: [],
      editFeaturesData: {
        wellName: "",
        dynaCreateTime: "",
        addType: "标准功图",
        diagnosticResults: "泵工作正常",
      },
      tableData: [],
      coordinates: [[]],
    };
  },
  created() {
    this.searchFeatures();
    this.queryOrgName();
  },
  methods: {
    //根据输入信息查询
    searchFeatures() {
      this.postRequest(
        "/diagnosis/knowledge/tile/queryByterm",
        this.logForm
      ).then((resp) => {
        if (resp) {
          this.tableData = resp.data.records;
          this.logForm.total = resp.data.total;
          this.logForm.currentPage = resp.data.current;
          this.logForm.pageSize = resp.data.size;
          this.tableData.forEach((element) => {
            //延迟到DOM更新之后再执行绘制图形
            this.$nextTick(function () {
              //处理数据为坐标
              this.coordinate(element);
              //将处理后的坐标添加到对象中
              this.$set(element, "coordinates", this.coordinates);
              //实例化echarts
              this.drawLine(element);
            });
          });
        }
      });
    },
    //获取采油站信息
    queryOrgName() {
      this.getRequest("/diagnosis/knowledge/tile/queryorgName").then((resp) => {
        if (resp) {
          this.oilStationOptions = resp.data;
        }
      });
    },
    //获取采油站井名称
    queryWellNameByOrgName(val) {
      this.getRequest(
        "/diagnosis/knowledge/tile/queryWellNameByOrgName?orgName=" + val
      ).then((resp) => {
        if (resp) {
          this.wellNameoptions = resp.data;
        }
      });
    },
    //实例化图表
    drawLine(val) {
      let dom = document.getElementById(val.dynaId);
      let myChart = echarts.init(dom);
      myChart.setOption({
        title: {
          x: "center",
          text: val.dynaCreateTime,
          top: "7%",
          textStyle: {
            fontSize: 13,
            fontStyle: "normal",
            fontWeight: "bolder",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          formatter: function (params) {
            return (
              "<div><p>位移：" +
              params[0].value[0] +
              "M</p>" +
              "<p>载荷：" +
              params[0].value[1] +
              "KN</p>" +
              "</div>"
            );
          },
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "15%",
          top: "20%",
          containLabel: true,
        },
        xAxis: {
          name: "位移(M)",
          nameLocation: "middle",
          min: 0,
          max: 4,
          type: "value",
          axisLine: { onZero: false },
          nameTextStyle: {
            padding: [10, 250, 0, 0],
            fontSize: 10,
          },
        },
        yAxis: {
          name: "载荷(KN)",
          nameLocation: "middle",
          type: "value",
          axisLine: { onZero: false },
          nameTextStyle: {
            padding: [0, 0, 6, 0],
            fontSize: 10,
          },
        },
        series: [
          {
            symbol: "none",
            data: val.coordinates,
            type: "line",
            smooth: true,
            lineStyle: {
              width: 1.5,
            },
          },
        ],
      });
    },
    //将坐标数据串处理为坐标点
    coordinate(val) {
      //每次处理之前保证坐标数组集合为空
      this.coordinates = [[]];
      var displacementArray = val.displacement.split(";");
      var disploadArray = val.dispLoad.split(";");
      for (var i = 0; i < displacementArray.length; i++) {
        this.coordinates[i] = [];
        this.coordinates[i][0] = parseFloat(displacementArray[i]);
        this.coordinates[i][1] = parseFloat(disploadArray[i]);
      }
      return this.coordinates;
    },
    // 分页，页码大小改变
    handleSizeChange(val) {
      this.logForm.pageSize = val;
      this.searchFeatures();
    },
    // 分页，当前页改变
    handleCurrentChange(val) {
      this.logForm.currentPage = val;
      this.searchFeatures();
    },
    //修改特征库
    editFeatures(val) {
      this.editFeaturesData.wellName = val.wellId;
      this.editFeaturesData.dynaCreateTime = val.dynaCreateTime;
      this.editFeaturesVisible = true;
    },
    //删除特征库
    deleteFeatures() {
      alert("要删吗?");
    },
    // 关闭修改对话框
    editFeaturesClose() {
      this.editFeaturesVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../assets/css/diagnosis/knowledge/features.css";
</style>
