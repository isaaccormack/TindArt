/* Type interface for the returned JSON for like sent to or returned by DB query */
export interface LikeDataJSON {
  userId: string,
  artworkId: string,
}

/* LikeDTO object to transfer data between model and view */
export class LikeDTO {
  public userId: string = '';
  
  public artworkId: string = '';

  constructor(res: LikeDataJSON) {
    this.create(res);
  }

  public create(res: LikeDataJSON) {
    this.userId = res.userId;
    this.artworkId = res.artworkId;
  }
}