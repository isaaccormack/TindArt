import { expect } from "chai";
import "mocha";
import { mock, when, instance, anything, deepEqual } from "ts-mockito";
import { Db, ObjectID, Collection, Cursor } from "mongodb";
import { ILikeService, ILikeDataJSON } from "../../src/services/ILikeService";
import { LikeService } from "../../src/services/LikeService";

class DBError extends Error {
  public code: number;
  public errmsg: string;
    constructor(statusCode: number, msg: string) {
        super(msg);
        this.code = statusCode;
        this.errmsg = msg;
    }
}

describe("LikeService object", async () => {
  // Creating mock
  const mockedDb: Db = mock(Db);
  const likeData = {
    userId: "userId",
    artworkId: "artworkId"
  };

  const dbResult = {
    insertedCount: 1,
    ops: [{
      userId: likeData.userId,
      artworkId: likeData.artworkId,
      _id: new ObjectID("1234567890ab")
    }],
    insertedId: new ObjectID("0123456789ab"),
    connection: null,
    result: { ok: 1, n: 1}
  };

  const mockedLikes: Collection = mock<Collection>();
  when(mockedLikes.insertOne(anything()))
  .thenResolve(dbResult);

  const mockedFindAllCursor: Cursor = mock(Cursor);
  when(mockedFindAllCursor.toArray()).thenResolve(dbResult.ops);
  when(mockedLikes.find(anything())).thenReturn(instance(mockedFindAllCursor));

  when(mockedDb.collection("likes")).thenReturn(instance(mockedLikes));
  const db: Db = instance(mockedDb);

  it("should throw an error while initializing the service without db", async () => {
    // tslint:disable-next-line: no-unused-expression
    expect(() => { new LikeService({}); } ).to.throw();
  });
  let likeService: ILikeService;
  it("should initialize the service", () => {
    expect(() => { likeService = new LikeService({db}); } ).to.not.throw();
  });
  /*it("should insert a new like without error", async () => {
      try {
        expect(await likeService!.addArtworkLike(likeData.userId, likeData.artworkId)).to.not.throw();
      } catch (error) {
        console.log(error);
        expect("No Error").to.equal(true);
      }
    });*/
  it("should find all artwork likes", async () => {
      try {
        const likes: ILikeDataJSON[] = await likeService!.findAllLikes(likeData.userId);
        // tslint:disable-next-line: no-unused-expression
        expect(likes.length).to.equal(1);
        expect(likes[0].userId).to.equal(likeData.userId);
        expect(likes[0].artworkId).to.equal(likeData.artworkId);
      } catch (error) {
        console.log(error);
        expect("No Error").to.equal(true);
      }
    });
});
