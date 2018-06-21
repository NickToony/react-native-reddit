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
    // Default the height to window width
    let height = Dimensions.get("window").width;
    // Now find the best resolution
    for (const post of this.props.row.posts) {
      const image = bestResolution(post, Dimensions.get("window").width/2);
      if (image.height > height) {
        height = image.height;
      }
    }

    // If it's a single or double post
    if (this.props.row.posts.length <= 2) {
      // Figure out ratio between the two
      const percentage = 100 / this.props.row.posts.length;
      // Map the items out as a row
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

      // Done!
      return <View style={{ flex: 1, flexDirection: "row" }}>{items}</View>;
    } else {

      // It's more than 2 items.. find the biggest item of the 3
      var bigItem = this.props.row.posts[0];
      var left = true;
      for (var i = 0; i < this.props.row.posts.length; i++) {
        const post = this.props.row.posts[i];
        if (calculateRatio(post) < 1) {
          bigItem = post;
          // somewhat randomised left/right orientation
          left = i < this.props.row.posts.length / 2;
        }
      }

      // Split out the smallitems from the big itesm
      const smallItems = this.props.row.posts.slice();
      removeFromArray(smallItems, bigItem);

      // Calculate a new ratio WITHOUT the big picture 
      const percentage = 100 / (this.props.row.posts.length - 1);
      // Map the small items
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

      // Now combine the big picture with the little pictures
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
