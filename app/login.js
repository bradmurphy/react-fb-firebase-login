/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from "react-native";
import FBSDK, {
  LoginManager,
  LoginButton,
  AccessToken
} from "react-native-fbsdk";
import firebase from "firebase";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});

let config = {
  apiKey: "AIzaSyATVAd84AvqTMIR2-k-OqJMj5P5pYhueGE",
  authDomain: "testlogin-d2e2a.firebaseapp.com/",
  databaseURL: "https://testlogin-d2e2a.firebaseio.com/"
};

const firebaseRef = firebase.initializeApp(config);

export default class App extends Component {
  _authLogin(error, result) {
    if (error) {
      alert("Login fail without error: " + error);
    } else if (result.isCancelled) {
      alert("Login was cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(accessTokenData => {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          accessTokenData.accessToken
        );
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(
            result => {
              alert("Login success!");
            },
            error => {
              alert("Login error: " + error);
            }
          );
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginButton onLoginFinished={this._authLogin} />
      </View>
    );
  }
}
