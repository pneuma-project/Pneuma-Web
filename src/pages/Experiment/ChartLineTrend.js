import PropTypes from "prop-types";
import Chart from "./Chart";
import React from "react";
import { max } from "moment";
export default class ChartLineTrend extends Chart {
  static defaultProps = {
    className: "chart-wrapper-bar-dau"
  };
  static propTypes = {
    // data: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.range = [];
  }
  buildOptions(xAxis, yAxis, seriesData, legendData, trainData, yAxisName, yMaxValue) {
    return {
      tooltip: {
        trigger: "axis",
        formatter: function(params) {
          params = params[0];
          var date = new Date(params.name);
          return (
            date.getFullYear() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getDate() +
            " : " +
            params.value[1]
          );
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: "time",
        // data:xAxis,
        // splitNumber:30,
        name:'data',
        nameLocation: "end",
        maxInterval: 3600 * 24 * 1000,
        minInterval: 3600 * 24 * 1000,

        splitLine: {
          show: true
        },

        axisLabel: {
          interval: 0,
          rotate: 45
          // formatter: function(val,index) {
          //   // console.log(val,'----------->val')
          //   // console.log(index,'----------->index')
          //   return val
          // }
        }
      },
      yAxis: {
        type: "value",
        name: yAxisName,
        max: yMaxValue
        // splitLine: {
        //   show:false
        // },
      },
      series: [
        {
          data: seriesData,
          lineStyle: {
            color: "#0A4DAA"
          },
          type: "line",
          markLine: {
            silent: true,
            lineStyle: {
              color: "#0A4DAA"
            },
            data: [
              {
                yAxis: trainData,
                lineStyle: {
                  type: "solid"
                }
              },
              {
                yAxis: trainData * 0.8
              },
              {
                yAxis: trainData * 1.2
              }
            ]
          }
        }
      ]
    };
  }
  getData(nexProps) {
    let seriesData = nexProps.seriesData;
    let yAxisName = nexProps.yAxisName || "";
    let yMaxValue = nexProps.yMaxValue || {};
    let trainData = nexProps.trainData || {};
    let xAxis = nexProps.xAxisData || {};
    let yAxis = nexProps.yAxis || {};
    let legendData = nexProps.legendData;
    return this.buildOptions(
      xAxis,
      yAxis,
      seriesData,
      legendData,
      trainData,
      yAxisName,
      yMaxValue
    );
  }
  componentDidMount() {
    // 重写父类
    // dom ready之后调用父类mount函数，初始化echarts
    super.componentDidMount();
    this.initOptions(this.props);
  }
  componentWillReceiveProps(nexProps) {
    if (this.props.seriesData !== nexProps.seriesData) {
      this.initOptions(nexProps);
    }
  }

  initOptions(nexProps) {
    if (nexProps && nexProps.seriesData.length > 0) {
      const newData = this.getData(nexProps);
      this.drawData(newData);
    } else {
      // dom ready之后调用父类mount函数，初始化echarts
      const newData = this.getData(this.props);
      this.drawData(newData);
    }
  }
}
