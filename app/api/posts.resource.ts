import { BaseResource } from "./base.resource";
import { Post } from "./models/post.model";
import { PostListing } from "./models/post-listing.model";

export function bestResolution(post: Post, width: number) {
  const images = post.data.preview.images[0].resolutions; // all the previews
  images.push(post.data.preview.images[0].source); // with source

  // Loop through backwards
  let accepted = images[0];
  for (const image of images) {
    // Always take one higher
    accepted = image;
    // If this one is too big, don't check anymore
    if (image.width > width) {
      break;
    }
  }
  return accepted;
}

export function calculateRatio(post: Post) {
  // Calculates the ratio width:height
  const image = post.data.preview.images[0].source;
  return image.width / image.height;
}

export class PostsResource extends BaseResource {
  constructor(subreddit: string) {
    super("r/" + subreddit);
  }

  getHot(params?: object) {
    return this.GET<PostListing>("/hot", params);
  }

  getTop(params?: object) {
    return this.GET<PostListing>("/top/?sort=top&t=all", params);
  }

  getNew(params?: object) {
    return this.GET<PostListing>("/new", params);
  }
}
