import React from "react";
import { Component } from "react";
import { Image } from "react-native";
import { Html4Entities } from "html-entities";
import { Post } from "../api/models/post.model";
import { NavigationScreenProps } from "react-navigation";

export interface Props extends NavigationScreenProps {}

export interface State {
  post?: Post;
}

export class ViewScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation } : NavigationScreenProps) => {
    return {
      title: (navigation.getParam("post", {}) as Post).data.title
    };
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      post: undefined
    };
  }

  componentDidMount() {
    this.setState(previousState => {
      const { navigation } = this.props;
      return {
        post: navigation.getParam("post", {}) as Post
      };
    });
  }

  render() {
    return this.state.post ? (
      <Image
        style={{ height: "100%", width: "100%", flex: 1 }}
        source={{
          uri: new Html4Entities().decode(
            this.state.post.data.preview.images[0].source.url
          )
        }}
      />
    ) : null;
  }
}
