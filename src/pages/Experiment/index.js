/** @format */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import ChartLineTrend from "./ChartLineTrend";
import { Input, message } from "antd";
import moment from "moment";
import { auth as Auth } from "../../utils";
import "./index.less";
import qs from "qs";
import axios from "axios";
import { withRouter } from "react-router-dom";

@withRouter
export default class Experiment extends Component {
  state = {
    searchVal: "13055082954",
    token: Auth.getToken(),
    xAxisHisData: [],
    seriesHisData: [],
    trainData: "",
    timeData: []
  };

  getTrainData = () => {
    const { searchVal, token } = this.state;
    let params = {
      key: searchVal,
      loginKey: token
    };
    const _self = this;
    axios
      .post(
        `http://pneuma-admin.com/pneuma-manager/web/suck/fog/get/train/data`,
        qs.stringify(params)
      )
      .then(res => {
        console.log(res, "----->res.code");
        if (res.data.code === 200) {
          const { dataSum } = res.data.result;
          this.setState({ trainData: dataSum });
        }
        if (res.data.code === 500 && res.data.message === "4000006") {
          localStorage.removeItem("PNEUMA_TOKEN");
          message.error("Login invalid");
        }
      })
      .catch(err => {
        console.log(err, "-------> getTrainData err");
      });
  };

  getHistoryData = () => {
    const { searchVal, token } = this.state;
    let params = {
      key: searchVal,
      loginKey: token,
      currentPageNo: 1,
      pageSize: 999
    };
    const _self = this;
    axios
      .post(
        `http://pneuma-admin.com/pneuma-manager/web/suck/fog/get/history/data`,
        qs.stringify(params)
      )
      .then(res => {
        if (res.data.code === 500 && res.data.message === "4000006") {
          localStorage.removeItem("PNEUMA_TOKEN");
          message.error("Login invalid");
        }
        if (res.data.code === 200) {
          const { list } = res.data.result;
          let dateList = list.map(item => {
            return item.addDate;
          });

          if (list.length > 0) {
            this.setState({
              xAxisHisData: dateList,
              seriesHisData: list.map(item => {
                return {
                  name: new Date(item.addDate).toString(),
                  value: [
                    moment(item.addDate).format("YYYY/MM/DD HH:MM"),
                    item.dataSum
                  ]
                };
              }),
              timeData: list.map(item => {
                return {
                  name: new Date(item.addDate).toString(),
                  value: [
                    moment(item.addDate).format("YYYY/MM/DD HH:MM"),
                    Number(moment(item.addDate).format("HH"))
                  ]
                };
              })
            });
          }
        }
      })
      .catch(err => {
        console.log(err, "-------> getHistoryData err");
      });
  };

  componentDidMount() {
    this.getHistoryData();
    this.getTrainData();
  }

  handleSearch = value => {
    const searchVal = value.trim() ? value.trim() : null;
    this.setState({ searchVal }, () => {
      this.getTrainData();
      this.getHistoryData();
    });
  };

  render() {
    const {
      xAxisHisData,
      seriesHisData,
      trainData,
      timeData,
      searchVal
    } = this.state;
    return (
      <div className="wrapper">
        <div className="title-bar">
          <img />
          <Input.Search
            placeholder="input search text"
            onSearch={this.handleSearch}
            defaultValue={searchVal}
            style={{ width: 200 }}
            enterButton
          />
        </div>
        <ChartLineTrend
          itemId={`${1}-bar-repeat1`}
          xAxisData={xAxisHisData}
          seriesData={timeData}
          yAxisName={"Hours"}
          dummyTime={+new Date()}
          domId={`chartKey-${0}-bar-repeat1`}
          yMaxValue={24}
        />
        <ChartLineTrend
          itemId={`${1}-bar-repeat1`}
          xAxisData={xAxisHisData}
          seriesData={seriesHisData}
          yAxisName={"L"}
          trainData={trainData}
          dummyTime={+new Date()}
          domId={`chartKey-${1}-bar-repeat1`}
          yMaxValue={'dataMax'}
        />
      </div>
    );
  }
}
