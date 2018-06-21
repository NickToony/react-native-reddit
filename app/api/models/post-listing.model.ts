import { Post } from "./post.model";

export interface PostListing {
    kind: string;
    data: {
      modhash: string;
      dist: number;
      after: string;
      before: string;
      children: Post[];
    };
  }