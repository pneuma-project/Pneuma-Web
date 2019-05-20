/** @format */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ChartLineTrend from './ChartLineTrend'
import { Input } from 'antd'
import moment from 'moment'
import { auth as Auth } from '../../utils'
import './index.less'
import qs from 'qs'
import axios from 'axios'

export default class Experiment extends Component {
  state = {
    searchVal: '13055082954',
    token: Auth.getToken(),
    xAxisHisData:[],
    seriesHisData:[],
    xAxisTraiData:[],
    seriesTraiData:[]
  }

  getTrainData = () => {
    const { searchVal, token } = this.state
    let params = {
      key: searchVal,
      loginKey: token
    }
    axios
      .post(
        `http://pneuma-admin.com/pneuma-manager/web/suck/fog/get/train/data`,
      qs.stringify(params)
      )
      .then((res) => {
        console.log(res,'----->res')
      }).catch((err) => {
        console.log(err,'-------> getTrainData err')
      })
  }

  getHistoryData = () => {
    const { searchVal, token } = this.state
    let params = {
      key: searchVal,
      loginKey: token,
      currentPageNo: 1,
      pageSize: 999
    }
    axios
      .post(
        `http://pneuma-admin.com/pneuma-manager/web/suck/fog/get/history/data`,
      qs.stringify(params)
      )
      .then((res) => {
       const { list } =  res.data.result
       console.log(list,'--->result')
       if(list.length > 0 ){
         this.setState({
           xAxisHisData: list.map(item => {
            return item.addDate
           }),
           seriesHisData: list.map((item) => {
             return {name: item.addDate,value:item.dataSum}
           })
         })
       }
       
      }).catch((err) => {
        console.log(err,'-------> getHistoryData err')
      })
  }

  componentDidMount() {
    this.getHistoryData()
  }

  handleSearch = (value) => {
    const searchVal = value.trim() ? value.trim() : null

    this.setState({ searchVal }, () => {
      this.getTrainData()
      this.getHistoryData()
    })
  }

  render() {
    const { xAxisHisData, seriesHisData} = this.state;
    return (
      <div className="wrapper">
        <div className="title-bar">
          <img />
          <Input.Search
            placeholder="input search text"
            onSearch={this.handleSearch}
            style={{ width: 200 }}
            enterButton
          />
        </div>
        <ChartLineTrend
          itemId={`${1}-bar-repeat1`}
          xAxisData={xAxisHisData}
          seriesData={seriesHisData}
          dummyTime={+new Date()}
          domId={`chartKey-${1}-bar-repeat1`}
        />
      </div>
    )
  }
}
