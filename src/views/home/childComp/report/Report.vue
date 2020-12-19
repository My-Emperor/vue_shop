<template>
  <div>
    <!--面包屑区域-->
    <el-breadcrumb replace separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <div ref="chart" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { getChart } from "network/home";
import * as echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  // 此时，页面上的元素，已经被渲染完毕了！
  mounted() {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.chart);

    getChart().then(res => {
      console.log(res.data);
      // 4. 准备数据和配置项
      const result = _.merge(res.data, this.options);

      // 5. 展示数据
      myChart.setOption(result);
    });
  }
};
</script>

<style lang="less" scoped></style>
