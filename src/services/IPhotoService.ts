import { ObjectID } from "mongodb";

export interface IPhotoService {
  insertNewPhoto(userId: string): Promise<IPhotoResult>;
  removePhotoById(photoId: string): Promise<boolean>;
  findUserPhotosByID(userId: string): Promise<IPhotoDataJSON[]>;
}

export interface IPhotoResult { // Type returned by insertNewPhoto
  // Types can be undefined so result can be falsey if error present and vice versa
  err?: {
    type: string;
    message: string;
  };
  result?: IPhotoDataJSON;
}

/* Type interface for the returned JSON for photo returned by DB query */
export interface IPhotoDataJSON {
  _id: ObjectID;
  user: string;
}
