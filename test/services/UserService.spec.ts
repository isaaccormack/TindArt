import { expect } from "chai";
import "mocha";
import { UserService } from "../../src/services/UserService";
import { mock, when, instance, anything, deepEqual } from "ts-mockito";
import { Db, ObjectID, Collection, Cursor } from "mongodb";
import { User } from "../../src/models/User";

interface UserDBResultInterface {
  bio: string;
  name: string;
  username: string;
  email: string;
  city: string;
  province: string;
  password: string;
  _id: ObjectID;
  phoneNumber: string;
}

class DBError extends Error {
  public code: number;
  public keyPattern: any;
    constructor(statusCode: number, un: boolean, message?: string) {
        super(message);
        this.code = statusCode;
        this.keyPattern = {
          username: un
        }
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

  const user: User = new User();
  user.create(userData);
  const mockedUsers: Collection = mock<Collection>();
  when(mockedUsers.insertOne(anything()))
  .thenResolve(dbResult)
  .thenThrow(new DBError(11000, true))
  .thenThrow(new DBError(11000, false))
  .thenThrow(new DBError(99999, false));

  const mockedFoundCursor: Cursor = mock(Cursor);
  when(mockedFoundCursor.toArray()).thenResolve(dbResult.ops);
  when(mockedUsers.find(deepEqual({ username: "Joe" }))).thenReturn(instance(mockedFoundCursor));

  const mockedNotFoundCursor: Cursor = mock(Cursor);
  when(mockedNotFoundCursor.toArray()).thenResolve([]);
  when(mockedUsers.find(deepEqual({ username: "Bob" }))).thenReturn(instance(mockedNotFoundCursor));

  when(mockedDb.collection("users")).thenReturn(instance(mockedUsers));
  const db: Db = instance(mockedDb);
  it("should throw an error while initializing the service", async () => {
    // tslint:disable-next-line: no-use-of-empty-return-value
    expect(() => { UserService.initService({}); } ).to.throw();

    // All attempts to use the UserService should throw
    let allFailed = true;
    UserService.insertNewUser({} as User, "").then(
      (value) => {
        allFailed = false;
      }
    ).catch(
      // Log the rejection reason
     (reason) => {
      // tslint:disable-next-line: no-duplicate-string
      expect(reason.message).to.equal("Database error");
    });
    /*UserService.findOneUserByAttr("username", "").then(
      (value) => {
        allFailed = false;
      }
    ).catch(
      // Log the rejection reason
     (reason) => {
      expect(reason.message).to.equal("Database find error");
    });*/
    UserService.updateUserAttrByID("", "name", "").then(
      (value) => {
        allFailed = false;
      }
    ).catch(
      // Log the rejection reason
     (reason) => {
      expect(reason.message).to.equal("Database update error");
    });
    // tslint:disable-next-line: no-unused-expression
    expect(allFailed).to.be.true;
  });
  it("should initialize the service", () => {
    // tslint:disable-next-line: no-use-of-empty-return-value
    expect(() => { UserService.initService({db}); } ).to.not.throw();
  });
  it("should insert a new user without error", async () => {
    try {
      const { err, result } = await UserService.insertNewUser(user, hash);
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
      const result = await UserService.findOneUserByAttr("username", "Joe");
      // tslint:disable-next-line: no-unused-expression
      expect(result).to.not.be.null;
    } catch (error) {
      console.log(error);
      expect("No Error").to.equal(true);
    }
  });
  it("should not find a user by username that doesn't exist", async () => {
    try {
      const result = await UserService.findOneUserByAttr("username", "Bob");
      // tslint:disable-next-line: no-unused-expression
      expect(result).to.be.null;
    } catch (error) {
      console.log(error);
      expect("No Error").to.equal(true);
    }
  });
  it("should throw an error on duplicate insert", async () => {
    try {
      const { err, result } = await UserService.insertNewUser(user, hash);
      // tslint:disable-next-line: no-unused-expression
      expect(err).to.not.be.undefined;
      expect(err!.type).to.equal("usernameError");
    } catch (error) {
      console.log(error);
      expect("No Error").to.equal(true);
    }
    try {
      const { err, result } = await UserService.insertNewUser(user, hash);
      // tslint:disable-next-line: no-unused-expression
      expect(err).to.not.be.undefined;
      expect(err!.type).to.equal("emailError");
    } catch (error) {
      console.log(error);
      expect("No Error").to.equal(true);
    }
  });
});
