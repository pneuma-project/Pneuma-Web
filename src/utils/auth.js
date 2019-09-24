/** @format */

const tokenName = "PNEUMA_TOKEN";
class Auth {
  static status() {
    return !!localStorage.getItem(tokenName);
  }

  static checkIn(token) {
    if (token) {
      localStorage.setItem(tokenName, token);
    }
  }

  static logOut() {
    localStorage.removeItem(tokenName);
  }

  static getToken() {
    return localStorage.getItem(tokenName) || "";
  }
}

export default Auth;
