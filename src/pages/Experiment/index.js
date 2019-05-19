/** @format */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ChartLineTrend from './ChartLineTrend'
import { Input } from 'antd'
import moment from 'moment'
import { axios, auth as Auth } from '../../utils'
import './index.less'

export default class Experiment extends Component {
  state = {
    searchVal: '',
    token: Auth.getToken()
  }
  getData = () => {
    const { searchVal, token } = this.state

    console.log(token, '---->auth')
    axios
      .post(
        `http://pneuma-admin.com/pneuma-manager/web/suck/fog/get/train/data?loginKey=d8a408db6435e135&key=${searchVal}`
      )
      .then((res) => {
        console.log(res)
      })
  }
  componentDidMount() {}
  handleSearch = (e) => {
    let value = e.target.value
    const searchVal = value.trim() ? value.trim() : null

    this.setState({ searchVal }, () => {
      this.getData()
    })
  }

  render() {
    return (
      <div className="wrapper">
        <div className="title-bar">
          <img />
          <Input.Search
            placeholder="input search text"
            onChange={this.handleSearch}
            style={{ width: 200 }}
          />
        </div>
        <ChartLineTrend
          itemId={`${1}-bar-repeat1`}
          dummyTime={+new Date()}
          domId={`chartKey-${1}-bar-repeat1`}
        />
      </div>
    )
  }
}
