/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// Temporary fix - these are fixed in next version
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Warning: isMounted(...) is deprecated"]);
YellowBox.ignoreWarnings(["Module RCTImageLoader requires"]);

import React from "react";
import { Component } from "react";
import RootStack from "./app/navigation";

import { Container} from 'native-base';

export default class App extends Component {
  render() {
    return (
        <Container>
          <RootStack />
        </Container>
    );
  }
}
