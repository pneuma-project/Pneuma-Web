/** @format */

// auth 与 token 的 管理
import { combineReducers } from "redux";
import { UPDATE_TOKEN, REMOVE_TOKEN } from "../constants";

// import Auth from '../auth'
function token(state = "", action) {
  switch (action.type) {
    case UPDATE_TOKEN:
      return action.text;
    case REMOVE_TOKEN:
      return "";
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  token
});

export default rootReducer;
