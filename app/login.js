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
  },
  anon: {
    marginTop: 15
  },
  hide: {
    display: "none"
  },
  show: {
    display: "flex"
  }
});

let config = {
  apiKey: "AIzaSyATVAd84AvqTMIR2-k-OqJMj5P5pYhueGE",
  authDomain: "testlogin-d2e2a.firebaseapp.com/",
  databaseURL: "https://testlogin-d2e2a.firebaseio.com/"
};

const firebaseRef = firebase.initializeApp(config);

export default class App extends Component {
  state = { loggedIn: false };
  _authLogin = (error, result) => {
    if (error) {
      console.log("Login error: " + result.error);
    } else if (result.isCancelled) {
      console.log("Login was cancelled.");
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
              console.log("Login success!");
            },
            error => {
              console.log("Login error: " + error);
            }
          );
      });
      this.setState({ loggedIn: !this.state.loggedIn });
    }
  };

  _anonLogin = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then(
        result => {
          console.log("Login success!");
        },
        error => {
          console.log(`${error.message} | Code: ${error.message}`);
        }
      );
    this.setState({ loggedIn: !this.state.loggedIn });
  };

  render() {
    const { loggedIn } = this.state;
    const fbButton = [styles.fb, loggedIn && styles.hide];
    const anonButton = [styles.anon, loggedIn && styles.hide];
    const logText = [styles.hide, loggedIn && styles.show];

    return (
      <View style={styles.container}>
        <View style={fbButton}>
          <LoginButton onLoginFinished={this._authLogin} />
        </View>
        <TouchableOpacity style={anonButton} onPress={this._anonLogin}>
          <Text>No Thanks</Text>
        </TouchableOpacity>
        <Text style={logText}>You've been logged in!</Text>
      </View>
    );
  }
}
