export interface IPhotoService {
  insertNewPhoto(userId: string): Promise<IPhotoResult>;
  removePhotoById(photoId: string): Promise<boolean>;
  getAllPhotos(): Promise<IPhotoDataJSON[]>;
  findUserPhotosByID(userId: string): Promise<IPhotoDataJSON[]>;
  clearPhotos(): void;
}

export interface IPhotoResult { // Type returned by insertNewUser
  // Types can be undefined so result can be falsey if error present and vice versa
  err?: {
    type: string;
    message: string;
  };
  result?: IPhotoDataJSON;
}

/* Type interface for the returned JSON for photo returned by DB query */
export interface IPhotoDataJSON {
  _id: string;
  user: string;
}
