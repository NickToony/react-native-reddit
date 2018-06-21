import React from "react";
import { Component } from "react";
import { PostsResource, calculateRatio } from "../api/posts.resource";
import { PhotoGrid, Row } from "../components/photo-grid.component";
import { removeFromArray, shuffleArray } from "../utils";
import { Post } from "../api/models/post.model";
import { PostListing } from "../api/models/post-listing.model";
import { Footer, FooterTab, Button, Icon, Text } from "native-base";
import { Container } from "native-base";
import { NavigationScreenProps } from "react-navigation";

export interface Props extends NavigationScreenProps<State> {

}

export interface State {
  rows: Row[];
  stored: Post[];
  lastId: number;
  after: string;
  count: number;
  isLoading: boolean;
  mode: MODE;
}

enum MODE {
  TOP,
  HOT,
  NEW
}

export class MainScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "Aww"
  };

  postsResource = new PostsResource("aww");

  constructor(props: Props) {
    super(props);

    this.state = {
      rows: [],
      stored: [],
      lastId: 0,
      after: "",
      count: 0,
      isLoading: false,
      mode: MODE.HOT
    };
  }

  componentDidMount() {
    this.load(true);
  }

  load(clear = false) {
    if (clear) {
      this.setState(previousState => {
        return {
          rows: [],
          stored: [],
          lastId: 0,
          after: "",
          count: 0,
          isLoading: true
        };
      });
    } else {
      this.setState(previousState => {
        return {
          isLoading: true
        };
      });
    }

    let promise: Promise<PostListing>;
    switch (this.state.mode) {
      case MODE.NEW:
        promise = this.postsResource.getNew({
          count: this.state.count,
          after: this.state.after,
          limit: 50
        });
        break;

      case MODE.TOP:
        promise = this.postsResource.getTop({
          count: this.state.count,
          after: this.state.after,
          limit: 50
        });
        break;

      default:
      case MODE.HOT:
        promise = this.postsResource.getHot({
          count: this.state.count,
          after: this.state.after,
          limit: 50
        });
        break;
    }

    promise.then(response => {
      this.processResponse(response);
    });
  }

  processResponse(response: PostListing) {
    // Nothing to load
    if (response.data.children.length == 0) {
      this.setState(previousState => {
        isLoading: false;
      });
      this.load();
      return;
    }

    this.setState(previousState => {
      var lastId = previousState.lastId;
      const afterPost =
        response.data.children[response.data.children.length - 1];
      const after = afterPost.kind + "_" + afterPost.data.id;
      const toAdd: Row[] = [];
      const toMerge = previousState.stored;
      const posts = shuffleArray(
        response.data.children.filter(item => {
          return item.data.post_hint == "image";
        })
      );
      for (const post of posts) {
        if (calculateRatio(post) >= 0.9 || Math.random() <= 0.5) {
          toAdd.push({
            key: String(lastId),
            posts: [post]
          });
          lastId++;
        } else {
          toMerge.push(post);
        }
      }

      while (toMerge.length >= 2) {
        let posts: Post[] = [];
        const soloOne = this.findSoloRow(toAdd);
        const soloTwo = this.findSoloRow(toAdd, soloOne!);
        if (Math.random() <= 0.8 && soloOne && soloTwo) {
          posts = posts.concat([soloOne.posts[0], soloTwo.posts[0]]);
          removeFromArray(toAdd, soloOne);
          removeFromArray(toAdd, soloTwo);
          posts = shuffleArray(posts.concat([toMerge.pop()!]));
        } else {
          posts = posts.concat([toMerge.pop()!, toMerge.pop()!]);
        }

        toAdd.push({
          key: String(lastId),
          posts: posts
        });
        lastId++;
      }

      return {
        rows: [...previousState.rows, ...shuffleArray(toAdd)],
        stored: toMerge,
        lastId: lastId,
        after: after,
        count: previousState.count + response.data.children.length,
        isLoading: false
      };
    });
  }

  findSoloRow(array: Row[], existing?: Row) {
    var found = null;
    for (const row of array) {
      if (row.posts.length == 1 && row != existing) {
        if (found == null || Math.random() <= 0.5) {
          found = row;
        }
      }
    }
    return found;
  }

  setMode(mode: MODE) {
    this.setState(previousState => {
      return {
        mode: mode
      };
    });
    this.load(true);
  }

  viewImage(post: Post) {
    this.props.navigation.navigate("View", {
      post: post
    });
  }

  render() {
    const mode = this.state.mode;

    return (
      <Container>
        <PhotoGrid rows={this.state.rows} loadMore={() => this.load()} />

        <Footer>
          <FooterTab>
            <Button
              vertical
              active={mode == MODE.HOT}
              onPress={() => this.setMode(MODE.HOT)}
            >
              <Icon name="ios-flame" />
              <Text>Hot</Text>
            </Button>
            <Button
              vertical
              active={mode == MODE.TOP}
              onPress={() => this.setMode(MODE.TOP)}
            >
              <Icon name="ios-thumbs-up" />
              <Text>Top</Text>
            </Button>
            <Button
              vertical
              active={mode == MODE.NEW}
              onPress={() => this.setMode(MODE.NEW)}
            >
              <Icon name="ios-calendar" />
              <Text>New</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
