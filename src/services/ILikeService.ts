export interface ILikeService {
  likeArtwork(userId: string, artworkId: string): Promise<void>;
  dislikeArtwork(userId: string, artworkId: string): Promise<void>;
  findAllLikes(userId: string): Promise<ILikeDataJSON[]>;
  findAllLikesOrDislikes(userId: string): Promise<ILikeDataJSON[]>;
}

/* Type interface for the returned JSON for like sent to or returned by DB query */
export interface ILikeDataJSON {
  userId: string;
  artworkId: string;
  isLike: boolean;
  _id: string;
}
