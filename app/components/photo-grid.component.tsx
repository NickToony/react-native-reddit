import React from "react";
import { Component } from "react";
import { FlatList } from "react-native";
import { PhotoRow } from "./photo-row.component";
import { Post } from "../api/models/post.model";

export interface Props {
  rows: Row[];
  loadMore: () => void;
}

export interface State {}

export interface Row {
  key: string;
  posts: Post[];
}

export class PhotoGrid extends Component<Props, State> {
  viewabilityConfig = {
    waitForInteraction: false,
    viewAreaCoveragePercentThreshold: 100,
    minimumViewTime: 0
  };

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <FlatList
        style={{}}
        data={this.props.rows}
        renderItem={row => <PhotoRow row={row.item} />}
        onEndReached={e => this.props.loadMore()}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        viewabilityConfig={this.viewabilityConfig}
      />
    );
  }
}
