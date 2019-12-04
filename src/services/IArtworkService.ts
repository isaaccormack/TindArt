import { Artwork } from "../models/Artwork";

export interface IArtworkService {
  insertNewArtwork(artwork: Artwork, photoIds: string[], userid: string): Promise<IArtworkResult>;
  removeArtworkById(artworkId: string): Promise<boolean>;
  getAllArtwork(): Promise<IArtworkDataJSON[]>;
  findArtworkByUserID(userId: string): Promise<IArtworkDataJSON[]>;
  findArtworkByLocation(city: string, province: string): Promise<IArtworkDataJSON[]>;
  clearArtwork(): void;
}

export interface IArtworkResult { // Type returned by insertNewArtwork
  // Types can be undefined so result can be falsey if error present and vice versa
  err?: {
    type: string;
    message: string;
  };
  result?: IArtworkDataJSON;
}

/* Type interface for the returned JSON for artwork sent to or returned by DB query */
export interface IArtworkDataJSON {
  userId: string;
  photos: string[];
  title: string;
  description: string;
  city: string;
  province: string;
  price: number;
  dimensions: number[];
  _id: string;
}
