/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, message } from 'antd'
// import { axios } from '../../utils'
import { userLogIn } from '../../redux/actions'
import { Link } from 'react-router-dom'
import './index.less'
import axios from 'axios'
import md5 from 'md5'
import Base64 from 'base-64'
const FormItem = Form.Item

class NormalLoginForm extends React.Component {
  state = {
    loading: false,
    image: '',
    key: ''
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        const query = `username=${values.username}&password=${md5(values.password)}`
        const queryBody = `${values.username}&49ba59abbe56e057`
        // const instance = axios.create({
        //   baseURL: 'http://pneuma-admin.com/pneuma-manager/web/',
        //   // headers: {common: {'checkSum': Base64.encode(md5(queryBody))}}
        //  })
        // instance.defaults.headers.common.checkSum = Base64.encode(md5(queryBody))
        axios
          .post(`http://pneuma-admin.com/pneuma-manager/web/login?${query}`)
          .then((res) => {
            const { username, loginKey } = res.data.result
            message.success('登陆成功')
            this.props.logIn({
              token: loginKey,
              username
            })
          })
          .catch((err) => {
            // 重新
            // this.getCaptcha()
            this.setState({
              loading: false
            })
          })
      }
    })
  }

  handleClick = (e) => {
    e.preventDefault()
    // this.getCaptcha()
  }

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
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <header className="header">
            <span>Pneuma</span>
            <span>Management</span>
          </header>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }]
            })(
              <Input
                prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                placeholder="username"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }]
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
            <Link to="/experiment/index">实验</Link>
          </FormItem>
        </Form>
      </div>
    )
  }
}

NormalLoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  logIn: PropTypes.func.isRequired
}

const LoginForm = Form.create()(NormalLoginForm)

const mapDispatchToProps = (dispatch) => ({
  logIn(userInfo) {
    dispatch(userLogIn(userInfo))
  }
})

export default connect(
  null,
  mapDispatchToProps
)(LoginForm)
