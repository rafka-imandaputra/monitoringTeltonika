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
  const [hourFirst, minuteFirst] = firstTime.split(":");
  const [hourLast, minuteLasts] = lastTime.split(":");
  interval = parseInt(interval);
  let hourFirstInt = parseInt(hourFirst);
  let hourLastInt = parseInt(hourLast);
  let minuteFirstInt = parseInt(minuteFirst);
  let minuteLastsInt = parseInt(minuteLasts);

  let deviation;
  var timeStamp = [];
  function timeInterval() {
    let timeStampi = [];
    deviation = (hourLastInt - hourFirstInt) * 60 + (minuteLastsInt - minuteFirstInt);
    let hourNow = hourFirstInt,
      minuteNow = minuteFirstInt;
    let n = deviation / interval;
    for (var i = 0; i < n + 1; i++) {
      if (hourNow <= 9 && minuteNow <= 9) timeStampi[i] = `0${hourNow}:0${minuteNow}`;
      else if (hourNow <= 9) timeStampi[i] = `0${hourNow}:${minuteNow}`;
      else if (minuteNow <= 9) timeStampi[i] = `${hourNow}:0${minuteNow}`;
      else timeStampi[i] = `${hourNow}:${minuteNow}`;

      minuteNow += interval;

      if (minuteNow >= 60) {
        hourNow += 1;
        minuteNow = minuteNow % 60;
      }
    }

    return timeStampi;
  }
  timeStamp = timeInterval(hourFirst, hourLast, interval);

  const statusDataInt = [];
  let statuslength = statusData.length;
  for (let i = 0; i < statuslength; i++) {
    if (statusData[i] === "true") statusData[i] = 1;
    else statusDataInt[i] = 0;
  }

  var dataSuhu = [];
  var dataPower = [];

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
      data: timeStamp,
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
        data: statusDataInt,
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
