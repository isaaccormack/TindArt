export interface IArtworkService {
  insert(userId: string): Promise<IArtworkResult>;
  remove(photoId: string): Promise<boolean>;
  getAll(): Promise<IArtworkResult[]>;
  findUserPhotosByID(userId: string): Promise<IArtworkResult[]>;
  clearPhotos(): void;
}

export interface IArtworkResult { // Type returned by insertNew
  // Types can be undefined so result can be falsey if error present and vice versa
  err?: {
    type: string;
    message: string;
  };
  result?: IArtworkResult;
}

/* Type interface for the returned JSON for photo returned by DB query */
export interface IArtworkResult {
  _id: string;
  user: string;
}
