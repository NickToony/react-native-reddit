import React, { ComponentType } from "react";
import { Component } from "react";
import { TouchableHighlight, Image } from "react-native";
import { Html4Entities } from "html-entities";
import { bestResolution } from "../api/posts.resource";
import { Post } from "../api/models/post.model";
import { withNavigation } from 'react-navigation';
import { NavigationProp } from "../navigation.props";

export interface Props extends NavigationProp {
  post: Post;
  widthPercentage: number;
  height: number;
}

export interface State {}

class Photo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  pressed() {
    this.props.navigation!.navigate("View", {
      post: this.props.post
    });
  }

  render() {

    const image = bestResolution(this.props.post, this.props.height);

    return (
      <TouchableHighlight
        style={{
          height: this.props.height,
          width: this.props.widthPercentage + "%"
        }}
        onPress={() => this.pressed()}
      >
        <Image
          style={{ height: "100%", width: "100%" }}
          source={{ uri: new Html4Entities().decode(image.url) }}
        />
      </TouchableHighlight>
    );
  }
}

// @ts-ignore: TS doesn't seem to understand this
export default withNavigation(Photo);