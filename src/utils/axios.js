/** @format */

import axios from "axios";
import { message } from "antd";
import store from "../redux/store";
// import history from '../history'
// import Auth from '../auth'
import { userLogOut } from "../redux/actions";

const instance = axios.create({
  // baseURL: '/admin'
});
// // 有token的话就放在请求的头部
// if (store.getState().token) {
//   instance.defaults.headers.common.token = store.getState().token
// }
// // 当 store 发送变化时去更新token值
// store.subscribe(() => {
//   console.log('接受到store的变化')
//   instance.defaults.headers.common.token = store.getState().token
// })
instance.interceptors.response.use(res => {
  const data = res.data;
  if (data.code === 0) {
    return data.data;
  }
  if (data.code === 401) {
    console.warn("token 非法\n跳转到登录");
    // 准备跳转到登录
    store.dispatch(userLogOut());
    if (data.message) {
      message.error(data.message);
    }
    return Promise.reject({ msg: "token非法" });
  }
  console.error(data);
  if (data.message) {
    message.error(data.message);
  }
  return Promise.reject({
    code: data.code,
    msg: data.message
  });
});

// export {instance as default, axios}
export default instance;
