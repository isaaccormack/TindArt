export interface ILikeService {
  addArtworkLike(userId: string, artworkId: string): Promise<any>;
  removeArtworkLike(userId: string, artworkId: string): Promise<void>;
  findAllLikes(userId: string): Promise<ILikeDataJSON[]>;
  findNextLikes(userId: string, numToSkip: number): Promise<ILikeDataJSON[]>;
}

/* Type interface for the returned JSON for like sent to or returned by DB query */
export interface ILikeDataJSON {
  userId: string;
  artworkId: string;
  _id: string;
}
