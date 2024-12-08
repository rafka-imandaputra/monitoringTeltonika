import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";
import { map } from "lodash";

export default function ChartStatus({
  height,
  color = [],
  chartData,
  firstTime,
  lastTime,
  interval
}) {
  const theme = useTheme();

  // Extract time and status values from chartData
  const timeStamp = chartData.map(item => item.time);
  const statusData = chartData.map(item => (item.value === "true" ? 1 : 0)); // Convert status to 1 or 0

  const option = {
    grid: { top: "10%", bottom: "10%", left: "5%", right: "5%" },
    legend: {
      itemGap: 20,
      icon: "circle",
      textStyle: {
        fontSize: 13,
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily
      }
    },
    label: {
      fontSize: 13,
      color: theme.palette.text.secondary,
      fontFamily: theme.typography.fontFamily
    },
    xAxis: {
      type: "category",
      data: timeStamp, // Use actual timestamps from chartData
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 14,
        fontFamily: "roboto",
        color: theme.palette.text.secondary
      }
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 }
      },
      axisLabel: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: "roboto" }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: theme.palette.background.paper
        }
      },
      formatter: function (params) {
        let tooltipHtml = "";
        params.forEach((param) => {
          let param_implication = param.data == 1 ? "Hidup" : "Mati";
          tooltipHtml += `<div><strong>${param.seriesName}:</strong> ${param_implication} at ${param.axisValue}</div>`;
        });
        return tooltipHtml;
      }
    },
    series: [
      {
        data: statusData, // Use status data
        type: "line",
        stack: "Status Alat",
        name: "Status Alat",
        smooth: true,
        symbolSize: 4,
        lineStyle: { width: 4 }
      }
    ]
  };

  return <ReactEcharts style={{ height: height }} option={{ ...option, color: [...color] }} />;
}
