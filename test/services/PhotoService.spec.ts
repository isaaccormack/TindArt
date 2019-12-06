import { expect } from "chai";
import "mocha";
import { mock, when, instance, anything, deepEqual } from "ts-mockito";
import { Db, ObjectID, Collection, Cursor } from "mongodb";
import { Photo } from "../../src/models/Photo";
import { IPhotoService, IPhotoDataJSON } from "../../src/services/IPhotoService";
import { PhotoService } from "../../src/services/PhotoService";

class DBError extends Error {
  public code: number;
  public errmsg: string;
    constructor(statusCode: number, msg: string) {
        super(msg);
        this.code = statusCode;
        this.errmsg = msg;
    }
}

describe("PhotoService object", () => {
  // Creating mock
  const mockedDb: Db = mock(Db);
  const photoData = {
    userId: "userId"
  };
  const id = new ObjectID("1234567890ab");

  const dbResult = {
    insertedCount: 1,
    ops: [{
      user: photoData.userId,
      _id: id,
    }],
    insertedId: id,
    connection: null,
    result: { ok: 1, n: 1}
  };

  const mockedPhotos: Collection = mock<Collection>();
  when(mockedPhotos.insertOne(anything()))
  .thenResolve(dbResult);

  const mockedFoundCursor: Cursor = mock(Cursor);
  when(mockedFoundCursor.toArray()).thenResolve(dbResult.ops);
  when(mockedPhotos.find(deepEqual({ "user": { $regex: ".*" + photoData.userId + ".*" } })))
    .thenReturn(instance(mockedFoundCursor));

  const mockedAllCursor: Cursor = mock(Cursor);
  when(mockedAllCursor.toArray()).thenResolve(dbResult.ops);
  when(mockedPhotos.find())
    .thenReturn(instance(mockedAllCursor));

  const mockedNotFoundCursor: Cursor = mock(Cursor);
  when(mockedNotFoundCursor.toArray()).thenResolve([]);
  when(mockedPhotos.find(deepEqual({ "user": { $regex: ".*" + "not_a_user_id" + ".*" } })))
    .thenReturn(instance(mockedNotFoundCursor));

  when(mockedDb.collection("photos")).thenReturn(instance(mockedPhotos));
  const db: Db = instance(mockedDb);

  it("should throw an error while initializing the service", () => {
    // tslint:disable-next-line: no-unused-expression
    expect(() => { new PhotoService({}); } ).to.throw();
  });
  let photoService: IPhotoService;
  it("should initialize the service", () => {
    // tslint:disable-next-line: no-unused-expression
    expect(() => { photoService = new PhotoService({db}); } ).to.not.throw();
  });
  it("should insert a new photo without error", async () => {
    try {
      const { err, result } = await photoService!.insertNewPhoto(photoData.userId);
      // tslint:disable-next-line: no-unused-expression
      expect(err).to.be.undefined;
      // tslint:disable-next-line: no-unused-expression
      expect(result).to.not.be.undefined;
      // tslint:disable-next-line: no-useless-cast
      expect(result!.user).to.equal(photoData.userId);
      expect(result!._id).to.equal(id);
    } catch (error) {
      console.log(error);
      expect("No Error").to.equal(true);
    }
  });
  it("should return all photos without error", async () => {
    try {
      const result: IPhotoDataJSON[] = await photoService!.getAllPhotos();
      expect(result.length).to.equal(1);
      expect(result[0].user).to.equal(photoData.userId);
      expect(result[0]._id).to.equal(id);
    } catch (error) {
      console.log(error);
      expect("No Error").to.equal(true);
    }
  });
  it("should find all photos for a userId", async () => {
    try {
      const result: IPhotoDataJSON[] = await photoService!.findUserPhotosByID(photoData.userId);
      expect(result.length).to.equal(1);
      expect(result[0].user).to.equal(photoData.userId);
      expect(result[0]._id).to.equal(id);
    } catch (error) {
      console.log(error);
      expect("No Error").to.equal(true);
    }
  });
  it("should not find any photos for a userId that doesn't exist", async () => {
    try {
      const result: IPhotoDataJSON[] = await photoService!.findUserPhotosByID("not_a_user_id");
      expect(result.length).to.equal(0);
    } catch (error) {
      console.log(error);
      expect("No Error").to.equal(true);
    }
  });
});
