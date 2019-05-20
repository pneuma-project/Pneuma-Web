/** @format */

import PropTypes from 'prop-types'
import Chart from './Chart'
import React from 'react'
export default class ChartLineTrend extends Chart {
  static defaultProps = {
    className: 'chart-wrapper-bar-dau'
  }
  static propTypes = {
    // data: PropTypes.array.isRequired
  }
  constructor(props) {
    super(props)
    this.range = []
  }
  buildOptions(xAxis, yAxis, seriesData, legendData) {
    return {
      xAxis: {
        type: 'category',
        axisLabel: {
          formatter:function(value){
            console.log(value,'----->xvalue')
          }
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: seriesData,
          type: 'line'
        }
      ]
    }
  }
  getData(nexProps) {
    let seriesData = nexProps.seriesData
    let xAxis = nexProps.xAxisData || {}
    let yAxis = nexProps.yAxis || {}
    let legendData = nexProps.legendData
    return this.buildOptions(xAxis, yAxis, seriesData, legendData)
  }
  componentDidMount() {
    // 重写父类
    // dom ready之后调用父类mount函数，初始化echarts
    super.componentDidMount()
    this.initOptions(this.props)
    console.log(this.props,'---->props')
  }
  componentWillReceiveProps(nexProps) {
    console.log(nexProps,'nextprops')
    // if (this.props.data !== nexProps.data) {
      this.initOptions(nexProps)
    // }
  }

  initOptions() {
    const newData = this.getData(this.props)
    // 定制完成后，回写到state
    this.setState(
      {
        options: newData
      },
      () => {
        // draw
        this.draw()
      }
    )
  }
}
