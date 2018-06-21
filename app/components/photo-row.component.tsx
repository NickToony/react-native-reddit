import React from "react";
import { Component } from "react";
import { View, Dimensions, Text } from "react-native";
import { bestResolution, calculateRatio } from "../api/posts.resource";
import { removeFromArray } from "../utils";
import { Row } from "./photo-grid.component";
import Photo from "./photo.component";

export interface Props {
  row: Row;
}

export interface State {}

export class PhotoRow extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    let height = Dimensions.get("window").width;
    for (const post of this.props.row.posts) {
      const image = bestResolution(post, 200);
      if (image.height > height) {
        height = image.height;
      }
    }

    if (this.props.row.posts.length <= 2) {
      const percentage = 100 / this.props.row.posts.length;
      const items = this.props.row.posts.map(post => {
        return (
          <Photo
            post={post}
            widthPercentage={percentage}
            height={height}
            key={post.data.id}
          />
        );
      });

      return <View style={{ flex: 1, flexDirection: "row" }}>{items}</View>;
    } else {
      var bigItem = this.props.row.posts[0];
      var left = true;
      for (var i = 0; i < this.props.row.posts.length; i++) {
        const post = this.props.row.posts[i];
        if (calculateRatio(post) < 1) {
          bigItem = post;
          left = i < this.props.row.posts.length / 2;
        }
      }
      const smallItems = this.props.row.posts.slice();
      removeFromArray(smallItems, bigItem);

      const percentage = 100 / (this.props.row.posts.length - 1);
      const items = smallItems.map(post => {
        return (
          <Photo
            post={post}
            widthPercentage={100}
            height={height * (percentage / 100)}
            key={post.data.id}
          />
        );
      });

      return (
        <View
          style={{ flex: 1, flexDirection: "row" }}
        >
          {left && (
            <View style={{ width: "50%" }}>
              <Photo post={bigItem} widthPercentage={100} height={height}  />
            </View>
          )}
          <View style={{ width: "50%" }}>{items}</View>
          {!left && (
            <View style={{ width: "50%" }}>
              <Photo post={bigItem} widthPercentage={100} height={height}  />
            </View>
          )}
        </View>
      );
    }
  }
}
