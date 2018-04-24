/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import FBSDK, { AccessToken, LoginManager } from "react-native-fbsdk";

import firebase from "firebase";

// Configuration Object for Firebase App.
let config = {
  apiKey: "AIzaSyATVAd84AvqTMIR2-k-OqJMj5P5pYhueGE",
  authDomain: "testlogin-d2e2a.firebaseapp.com/",
  databaseURL: "https://testlogin-d2e2a.firebaseio.com/"
};

// Firebase Reference
const firebaseRef = firebase.initializeApp(config);

export default class Login extends Component {
  // Initialize state booleans for facebook and anonymous accounts.
  state = { fb: false, anon: false };

  // When the component mounts, check to see if user has an account,
  // facebook account or if an anonymous account needs to be created.
  componentDidMount() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        // Check for user
        if (user) {
          this.setState({ anon: !this.state.anon });

          // Check if user has an email, letting us know it's a facebook account.
          if (user.email) {
            this.setState({ fb: !this.state.fb, anon: !this.state.anon });
          }

          // Resolve user.
          resolve(user);
        } else {
          // Create anonymous account.
          this._anonLogin();
        }
      });
    });
  }

  _fbLink = () => {
    if (this.state.fb === false) {
      this._authLogin();
    }
  };

  // Connect anonymous account to Facebook Account, replacing the anonymous account.
  _authLogin = () => {
    LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
      result => {
        if (result.isCancelled) {
          alert("Login was cancelled.");
        } else {
          // Get access token from Facebook to link facebook to anonymous account.
          AccessToken.getCurrentAccessToken().then(accessTokenData => {
            const credential = firebase.auth.FacebookAuthProvider.credential(
              accessTokenData.accessToken
            );

            // Link credential to facebook account.
            firebase
              .auth()
              .currentUser.linkWithCredential(credential)
              .then(
                user => {
                  this.setState({ anon: !this.state.anon, fb: !this.state.fb });
                },
                error => {
                  alert(`Error upgrading anonymous account: ${error}`);
                }
              );
          });
        }
      },
      error => {
        alert(`Error Message: ${error.message} | Error Code: ${error.code}`);
      }
    );
  };

  // Create anonymous account in firebase.
  _anonLogin = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then(
        result => {
          this.setState({ anon: !this.state.anon });
        },
        error => {
          alert(`Error Message: ${error.message} | Error Code: ${error.code}`);
        }
      );
  };

  render() {
    const { anon, fb, appState } = this.state;
    const anonymous = anon ? "true" : "false";
    const facebook = fb ? "true" : "false";
    const connectText = [styles.text, fb && styles.hide];
    const connectedText = [styles.text, !fb && styles.hide];

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this._fbLink}>
          <Text style={connectText}>Connect w/ Facebook</Text>
          <Text style={connectedText}>Connected to Facebook</Text>
        </TouchableOpacity>
        <Text style={styles.status}>
          Anonymous: {anonymous} | Facebook: {facebook}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#3b5998",
    borderRadius: 4
  },
  text: {
    fontSize: 20,
    color: "#fff"
  },
  status: {
    marginTop: 15
  },
  hide: {
    display: "none"
  }
});
