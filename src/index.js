/**
 * Created by zhiyang on 2017/8/1.
 *
 * @format
 */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./App";
import store from "./redux/store";
import registerServiceWorker from "./registerServiceWorker";
import "./index.less";
import "./iPad.less";
// import 'draft-js/dist/t.css'
// 我们需要一个自定义的 history 对象。所以这里直接使用 <Router/> 而非 <BrowserRouter />
// BrowserRouter 有一个 basename 的 props，但是 Router 没有。再 history 创建时，可以设置 basename
// BrowserRouter 的实现细节: https://github.com/ReactTraining/react-router/issues/4059#issuecomment-306506430
ReactDOM.render(
  <Provider store={store}>
    <HashRouter basename="/pneuma-manager">
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
