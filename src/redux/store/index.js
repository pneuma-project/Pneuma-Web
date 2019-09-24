/** @format */

import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers";
import Auth from "../../utils/auth";

const middlewares = [thunk];

const devToolsExtension =
  process.env.NODE_ENV !== "production" && window.devToolsExtension
    ? window.devToolsExtension()
    : f => f;

const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  devToolsExtension
);

const initValue = {
  token: Auth.getToken()
};

export default createStore(reducer, initValue, storeEnhancers);
