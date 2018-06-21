import React from "react";
import { Component } from "react";
import { Footer, FooterTab, Button, Icon, Text } from "native-base";

interface State {}

interface Props {
    active: string;
    show: boolean;
}

export class FooterNavigation extends Component<Props, State> {
  render() {
    return (
      <Footer>
        <FooterTab>
          <Button vertical>
            <Icon name="ios-flame" />
            <Text>Hot</Text>
          </Button>
          <Button vertical>
            <Icon name="ios-thumbs-up" />
            <Text>Top</Text>
          </Button>
          <Button vertical>
            <Icon name="ios-calendar" />
            <Text>New</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
