import { expect } from "chai";
import "mocha";
import { mock, when, instance, anything, deepEqual } from "ts-mockito";
import { Db, ObjectID, Collection, Cursor } from "mongodb";
import { User } from "../../src/models/User";
import { IUserService } from "../../src/services/IUserService";
import { UserService } from "../../src/services/UserService";

class DBError extends Error {
  public code: number;
  public errmsg: string;
    constructor(statusCode: number, msg: string) {
        super(msg);
        this.code = statusCode;
        this.errmsg = msg;
    }
}

describe("UserService object", async () => {
  // Creating mock
  const mockedDb: Db = mock(Db);
  const userData = {
    name: "Joe",
    username: "Joe.Schmoe",
    email: "joe@gmail.com",
    city: "Kelowna",
    provinceCode: "11"
  };
  const hash = "hashedPassword";

  const dbResult = {
    insertedCount: 1,
    ops: [{
      name: userData.name,
      username: userData.username,
      email: userData.email,
      city: userData.city,
      province: "Prince Edward Island",
      _id: new ObjectID("0123456789ab"),
      bio: "",
      phoneNumber: "",
      password: hash
    }],
    insertedId: new ObjectID("0123456789ab"),
    connection: null,
    result: { ok: 1, n: 1}
  };

  const user: User = new User(userData);
  const mockedUsers: Collection = mock<Collection>();
  when(mockedUsers.insertOne(anything()))
  .thenResolve(dbResult)
  .thenThrow(new DBError(11000, "username"))
  .thenThrow(new DBError(11000, "email"))
  .thenThrow(new DBError(99999, ""));

  const mockedFoundCursor: Cursor = mock(Cursor);
  when(mockedFoundCursor.toArray()).thenResolve(dbResult.ops);
  when(mockedUsers.find(deepEqual({ username: "Joe" }))).thenReturn(instance(mockedFoundCursor));

  const mockedNotFoundCursor: Cursor = mock(Cursor);
  when(mockedNotFoundCursor.toArray()).thenResolve([]);
  when(mockedUsers.find(deepEqual({ username: "Bob" }))).thenReturn(instance(mockedNotFoundCursor));

  when(mockedDb.collection("users")).thenReturn(instance(mockedUsers));
  const db: Db = instance(mockedDb);
  it("should throw an error while initializing the service", async () => {
    // tslint:disable-next-line: no-unused-expression
    expect(() => { new UserService({}); } ).to.throw();
  });
  let userService: IUserService;
  it("should initialize the service", () => {
    expect(() => { userService = new UserService({db}); } ).to.not.throw();
  });
  it("should insert a new user without error", async () => {
      try {
        const { err, result } = await userService!.insertNewUser(user, hash);
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.be.undefined;
        // tslint:disable-next-line: no-unused-expression
        expect(result).to.not.be.undefined;
        // tslint:disable-next-line: no-useless-cast
        expect(result!.name).to.equal(userData.name);
      } catch (error) {
        console.log(error);
        expect("No Error").to.equal(true);
      }
    });
  it("should find a user by username", async () => {
      try {
        const result = await userService!.findOneUserByAttr("username", "Joe");
        // tslint:disable-next-line: no-unused-expression
        expect(result).to.not.be.null;
      } catch (error) {
        console.log(error);
        expect("No Error").to.equal(true);
      }
    });
  it("should not find a user by username that doesn't exist", async () => {
      try {
        const {err, result} = await userService!.findOneUserByAttr("username", "Bob");
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.not.be.undefined;
        expect(result).to.be.undefined;
      } catch (error) {
        console.log(error);
        expect("No Error").to.equal(true);
      }
    });
  it("should throw an error on duplicate insert", async () => {
      try {
        const { err, result } = await userService!.insertNewUser(user, hash);
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.not.be.undefined;
        expect(err!.type).to.equal("usernameError");
        expect(result).to.be.undefined;
      } catch (error) {
        console.log(error);
        expect("No Error").to.equal(true);
      }
      try {
        const { err, result } = await userService!.insertNewUser(user, hash);
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.not.be.undefined;
        expect(err!.type).to.equal("emailError");
      } catch (error) {
        console.log(error);
        expect("No Error").to.equal(true);
      }
    });
});
