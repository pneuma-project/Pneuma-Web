/** @format */

import React from "react";
import PropTypes from "prop-types";
import echarts from "echarts";
// import { autoBind } from '../../component/utils';
// import { CHART_PAGE_SIZE } from '../../pages/constants';

// @autoBind
export default class Chart extends React.Component {
  static defaultProps = {
    className: "",
    chartCls: "",
    style: {},
    chartStyle: {}
  };
  static propTypes = {
    className: PropTypes.string,
    chartCls: PropTypes.string,
    domId: PropTypes.string.isRequired,
    style: PropTypes.object,
    chartStyle: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.chartInstance = null;
    this.state = {
      options: {},
      // size: CHART_PAGE_SIZE,
      filteredData: [],
      resizeStyle: {}
    };
    this.rangeMap = this.getRangeMap();
  }
  // 子类调用
  componentDidMount() {
    const { domId } = this.props;
    const domElement = document.getElementById(domId);
    if (!domId || !domElement) {
      throw new Error("Can not find the dom to mount echarts!");
    }
    this.chartInstance = echarts.init(domElement);
  }
  // 子类实现
  getRangeMap() {
    return {};
  }
  // 子类实现
  getChartStyle() {
    return {};
  }
  // 子类调用
  chartResize(style = undefined) {
    if (!this.chartInstance) {
      throw new Error("Can not resize an uninitialised echart instance!");
    }
    this.chartInstance.resize(style);
  }
  draw() {
    const { options } = this.state;
    this.chartInstance.setOption(options);
  }
  drawData(data) {
    this.chartInstance.clear();
    this.chartInstance.setOption(data);
  }
  bindChartEvent(eventName, callback) {
    if (!this.chartInstance) {
      throw new Error("Can not bind event to uninitialised echart instance!");
    }
    this.chartInstance.on(eventName, (...args) => {
      callback(...args);
    });
  }
  render() {
    const { chartCls = "", domId, chartStyle } = this.props;
    const { resizeStyle } = this.state;
    const cls = `table-box ${chartCls}`;
    const mergedStyle = Object.assign({}, chartStyle, resizeStyle);
    return <div className={cls} id={domId} style={mergedStyle} />;
  }
}
