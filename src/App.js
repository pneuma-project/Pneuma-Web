/** @format */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Route, Redirect, Switch } from "react-router-dom";
import { Layout, Menu } from "antd";
import { hot } from "react-hot-loader";
import Experiment from "./pages/Experiment";
import routes from "./router";

import "./App.less";
const loginRoute = routes.find(({ path }) => path === "/login");

class App extends React.Component {
  render() {
    const { auth } = this.props;

    return (
      <div className="App">
        <Layout>
          <Menu
          className='app-lefter'
            defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
            mode="inline"
            // theme="dark"
            // inlineCollapsed={this.state.collapsed}
          >
            <Menu.Item key="1">
              <span>Option 1</span>
            </Menu.Item>
          </Menu>
          {/* <div> */}
          <header className='app-top'>
            <span>用户名</span>
          </header>
          <Switch>
            <Route
              exact
              path={loginRoute.path}
              render={() => {
                const Login = loginRoute.component;
                if (auth) {
                  return <Redirect to="/experiment/index" />;
                }
                return <Login />;
              }}
            />
            <Route
              path="/"
              render={() => (auth ? <Experiment /> : <Redirect to="/login" />)}
            />
          </Switch>
          {/* </div> */}
        </Layout>
      </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.token !== ""
  };
}

const WithRouterAPP = withRouter(connect(mapStateToProps)(App));
// withRouter 必须添加 不然无法响应路由变化: https://reacttraining.com/react-router/web/guides/redux-integration
export default hot(module)(WithRouterAPP);
