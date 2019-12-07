import { expect } from "chai";
import "mocha";
import { mock, when, instance } from "ts-mockito";
import { UserService } from "../../src/services/UserService";
import { UserHandler } from "../../src/handlers/users";
import { IUserService, IUserResult } from "../../src/services/IUserService";
import { Request, Response } from "express";

describe("UserHandler", () => {
  const mockedUserService: IUserService = mock<IUserService>(UserService);
  const mockedReq: Request = mock<Request>();
  const mockedRes: Response = mock<Response>();
  const mockedSession: Express.Session = mock<Express.Session>();

  const _id = "1234567890ab";
  const dbResult: IUserResult = { result: {
    bio: "",
    name: "bob",
    username: "string",
    email: "string",
    city: "string",
    province: "string",
    password: "string",
    _id,
    phoneNumber: "",
  }};

  when(mockedSession.user).thenReturn({_id});

  when(mockedReq.params).thenReturn({username: "bob"});
  when(mockedReq.body).thenReturn({bio: "updatedBio", phoneNumber: "2502252154"});
  when(mockedReq.session).thenReturn(instance(mockedSession));
  when(mockedUserService.findOneUserByAttr("username", "bob")).thenResolve(dbResult);
  when(mockedUserService.updateUserAttrByID(_id, "bio", "updatedBio")).thenResolve(true);
  when(mockedUserService.updateUserAttrByID(_id, "phoneNumber", "2502252154")).thenResolve(true);

  const req = instance(mockedReq);
  const res = instance(mockedRes);
  const userHandler: UserHandler = new UserHandler(instance(mockedUserService));

  it ("should get a user by username", async () => {
    const result = await userHandler.getUserByUsername(req, res, (err?) => {});
    expect(result.name).to.equal("bob");
  });
  it ("should update a bio using the user _id", async () => {
    await userHandler.updateBio(req, res, (err?) => {});
    expect(req.session!.user.bio).to.equal("updatedBio");
  });
  it ("should update a phonenumber using the user _id", async () => {
    await userHandler.updatePhoneNumber(req, res, (err?) => {})
    expect(req.session!.user.phoneNumber).to.equal("2502252154");
  });
});
