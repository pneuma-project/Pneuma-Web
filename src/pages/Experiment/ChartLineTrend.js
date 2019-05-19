/** @format */

import PropTypes from 'prop-types'
import Chart from './Chart'
import React from 'react'
export default class ChartLineTrend extends Chart {
  static defaultProps = {
    className: 'chart-wrapper-bar-dau'
  }
  static propTypes = {
    data: PropTypes.array.isRequired
  }
  constructor(props) {
    super(props)
    this.range = []
  }
  buildOptions(xAxis, yAxis, data, legendData) {
    return {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }
      ]
    }
  }
  getData(nexProps) {
    let data = nexProps.data
    let xAxis = nexProps.xAxis || {}
    let yAxis = nexProps.yAxis || {}
    let legendData = nexProps.legendData
    return this.buildOptions(xAxis, yAxis, data, legendData)
  }
  componentDidMount() {
    // 重写父类
    // dom ready之后调用父类mount函数，初始化echarts
    super.componentDidMount()
    this.initOptions()
  }
  componentWillReceiveProps(nexProps) {
    if (this.props.data !== nexProps.data) {
      this.initOptions(nexProps)
    }
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
