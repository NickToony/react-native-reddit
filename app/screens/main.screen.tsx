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

export interface Props extends NavigationScreenProps<State> {}

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

  // Post resource helps us talk to reddit API
  postsResource = new PostsResource("aww");

  constructor(props: Props) {
    super(props);

    // default state
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
    // Initial load
    this.load(true);
  }

  /** Load the next chunk of posts
   *
   * @param clear if true, will clear all current posts
   */
  load(clear = false) {
    if (clear) {
      // Reset the state to empty
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
      // Keep tracking of loading
      this.setState(previousState => {
        return {
          isLoading: true
        };
      });
    }

    // different API calls depending on mode
    let promise: Promise<PostListing>;
    switch (this.state.mode) {
      // Fetch new posts
      case MODE.NEW:
        promise = this.postsResource.getNew({
          count: this.state.count,
          after: this.state.after,
          limit: 50
        });
        break;

      // Fetch top posts
      case MODE.TOP:
        promise = this.postsResource.getTop({
          count: this.state.count,
          after: this.state.after,
          limit: 50
        });
        break;

      // default: fetch hot posts
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

  /**
   * Process the response from the Reddit API
   * @param response
   */
  processResponse(response: PostListing) {
    // Nothing to load?
    if (response.data.children.length == 0) {
      this.setState(previousState => {
        isLoading: false;
      });
      // Try again..
      this.load();
      return;
    }

    this.setState(previousState => {
      // IDs for list tracking = better performance
      var lastId = previousState.lastId;

      // Get the last post
      const endPost = response.data.children[response.data.children.length - 1];
      // and calculate it's kind+id hash
      const after = endPost.kind + "_" + endPost.data.id;

      // Array for tracking new posts to accept
      const toAdd: Row[] = [];
      // Begin the merge array with the previous state's
      const toMerge = previousState.stored;

      // Initial shuffle to randomise merging
      const posts = shuffleArray(
        // Filter out non-image posts
        response.data.children.filter(item => {
          return item.data.post_hint == "image";
        })
      );

      // For each post..
      for (const post of posts) {
        // If the ratio is quite square, or random.
        if (calculateRatio(post) >= 0.9 || Math.random() <= 0.5) {
          // Add it straight to the list
          toAdd.push({
            key: String(lastId),
            posts: [post]
          });
          lastId++;
        } else {
          // Otherwise, it's going to be merged with another post
          toMerge.push(post);
        }
      }

      // Handle merged posts
      while (toMerge.length >= 2) {
        // Find two other solo posts
        let posts: Post[] = [];
        const soloOne = this.findSoloRow(toAdd);
        const soloTwo = this.findSoloRow(toAdd, soloOne!);
        // If the solo posts exist AND random chance
        if (Math.random() <= 0.8 && soloOne && soloTwo) {
          // Pull out the solo posts
          posts = posts.concat([soloOne.posts[0], soloTwo.posts[0]]);
          removeFromArray(toAdd, soloOne);
          removeFromArray(toAdd, soloTwo);
          // And merge them with the current
          posts = shuffleArray(posts.concat([toMerge.pop()!]));
        } else {
          // can't merge - just merge two mergeables instead
          posts = posts.concat([toMerge.pop()!, toMerge.pop()!]);
        }

        // Add whatever row we just produced
        toAdd.push({
          key: String(lastId),
          posts: posts
        });
        lastId++;
      }

      // Update the state with the new rows, and provide info for next API call
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

  /**
   * Within an array of Rows, find a row which has only one image
   *
   * @param array the array to search
   * @param existing (optional) a row to ignore
   */
  findSoloRow(array: Row[], existing?: Row) {
    var found = null;
    for (const row of array) {
      // If the row has 1 post and isn't ignored
      if (row.posts.length == 1 && row != existing) {
        // If this is the first found, otherwise random
        if (found == null || Math.random() <= 0.5) {
          found = row;
        }
      }
    }
    return found;
  }

  /**
   * Change the current mode (top, hot, new)
   * @param mode
   */
  setMode(mode: MODE) {
    this.setState(previousState => {
      return {
        mode: mode
      };
    });
    this.load(true);
  }

  render() {
    // Quick reference to mode
    const mode = this.state.mode;

    return (
      <Container>
        // Content
        <PhotoGrid rows={this.state.rows} loadMore={() => this.load()} />
        // Navigation
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
