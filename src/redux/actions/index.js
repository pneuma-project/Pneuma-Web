/** @format */

import { AUTH, UPDATE_TOKEN, REMOVE_TOKEN } from "../constants";
import { auth as Auth } from "../../utils";

export function auth() {
  return {
    type: AUTH
  };
}

export function update(text = "") {
  return {
    type: UPDATE_TOKEN,
    text
  };
}

export function remove() {
  return {
    type: REMOVE_TOKEN
  };
}

export function userLogIn(userInfo) {
  return function(dispatch) {
    const { token, username } = userInfo;
    if (!(token && username)) {
      console.error("token与username不能为空");
      return;
    }
    Auth.checkIn(token);
    localStorage.setItem("username", username);
    dispatch(update(token));
  };
}

export function userLogOut() {
  return function(dispatch) {
    Auth.logOut();
    localStorage.removeItem("username");
    dispatch(remove());
  };
}
