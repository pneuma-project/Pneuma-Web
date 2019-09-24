/** @format */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, message } from "antd";
// import { axios } from '../../utils'
import { userLogIn } from "../../redux/actions";
import { Link } from "react-router-dom";
import "./index.less";
import axios from "axios";
import { MD5 } from "../../utils";
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  state = {
    loading: false,
    image: "",
    key: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: false
        });
        var pwd = values.password;
        const query = `username=${values.username}&password=${pwd.MD5(16)}`;
        const queryBody = `${values.username}&49ba59abbe56e057`;
        // const instance = axios.create({
        //   baseURL: 'http://pneuma-admin.com/pneuma-manager/web/',
        //   // headers: {common: {'checkSum': Base64.encode(md5(queryBody))}}
        //  })
        // instance.defaults.headers.common.checkSum = Base64.encode(md5(queryBody))
        axios
          .post(`http://pneuma-admin.com/pneuma-manager/web/login?${query}`)
          .then(res => {
            this.setState({
              loading: false
            });
            if (res.data.code === 200) {
              const { username, loginKey } = res.data.result;
              message.success("login successful");
              this.props.logIn({
                token: loginKey,
                username
              });
              this.props.push("/experiment/index");
            } else if (res.data.code === 500) {
              if (res.data.message == 4000002) {
                message.error("Wrong username or password");
              } else if (res.data.message == 4000005) {
                message.error(
                  "Enter the password incorrectly more than 5 times in one minute"
                );
              } else {
                message.error("Login failed");
              }
            } else {
              //600 checkSum校验错误
              message.error("Login failed");
            }
          })
          .catch(err => {
            // 重新
            // this.getCaptcha()
            this.setState({
              loading: false
            });
          });
      }
    });
  };

  handleClick = e => {
    e.preventDefault();
    // this.getCaptcha()
  };

  // getCaptcha = () => {
  //   axios.get('/captcha').then(({ image, key }) => {
  //     this.setState({
  //       image,
  //       key
  //     })
  //   })
  // }

  componentDidMount() {
    // this.getCaptcha()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <header className="header">
            <span>Pneuma</span>
            <span>Management</span>
          </header>
          <FormItem>
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "请输入用户名!" }]
            })(
              <Input
                prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                placeholder="username"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码!" }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                type="password"
                placeholder="password"
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              // type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={this.state.loading}
            >
              Sign In
            </Button>
            <Link to="/experiment/index" />
          </FormItem>
        </Form>
      </div>
    );
  }
}

NormalLoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  logIn: PropTypes.func.isRequired
};

const LoginForm = Form.create()(NormalLoginForm);

const mapDispatchToProps = dispatch => ({
  logIn(userInfo) {
    dispatch(userLogIn(userInfo));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(LoginForm);
