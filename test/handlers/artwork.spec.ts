
import { expect } from "chai";
import "mocha";
import { mock, when, instance } from "ts-mockito";
import { ArtworkService } from "../../src/services/ArtworkService";
import { UserService } from "../../src/services/UserService";
import { ArtworkHandler } from "../../src/handlers/artwork";
import { IArtworkService, IArtworkResult, IArtworkDataJSON } from "../../src/services/IArtworkService";
import { Request, Response } from "express";
import { IUserService, IUserResult } from "../../src/services/IUserService";

describe("ArtworkHandler", () => {
  const mockedArtworkService: IArtworkService = mock<IArtworkService>(ArtworkService);
  const mockedUserService: IUserService = mock<IUserService>(UserService);
  const mockedReq: Request = mock<Request>();
  const mockedRes: Response = mock<Response>();
  const mockedSession: Express.Session = mock<Express.Session>();
  
  const _id = "1234567890ab";
  const userId = "ba0987654321";
  const dbArtwork: IArtworkDataJSON = {
    _id,
    userId,
    title: "title",
    description: "description",
    city: "Victoria",
    province: "British Columbia",
    price: 5,
    units: "meters",
    dimensions: [1, 1, 1],
    photos: ["111111111111", "222222222222"]
  };
  const dbUserResult: IUserResult = { result: {
    bio: "",
    name: "bob",
    username: "string",
    email: "string",
    city: "Victoria",
    province: "string",
    password: "British Columbia",
    _id: userId,
    phoneNumber: "",
  }};

  when(mockedSession.user).thenReturn({_id, city: "Victoria", province: "British Columbia"});

  when(mockedReq.params).thenReturn({username: "bob"});
  when(mockedReq.body).thenReturn({
    title: dbArtwork.title,
    description: dbArtwork.description,
    city: dbArtwork.city,
    province: dbArtwork.province,
    price: "5",
    units: dbArtwork.units,
    depth: "1",
    width: "1",
    height: "1",
  });
  when(mockedReq.session).thenReturn(instance(mockedSession));

  when(mockedUserService.findOneUserByAttr("username", "bob")).thenResolve(dbUserResult);
  when(mockedArtworkService.findArtworkByLocation("Victoria", "British Columbia")).thenResolve([dbArtwork]);

  when(mockedArtworkService.findArtworkByUserID(userId)).thenResolve([dbArtwork]);
  when(mockedArtworkService.getAllArtwork()).thenResolve([dbArtwork]);

  const req = instance(mockedReq);
  const res = instance(mockedRes);
  const artworkHandler: ArtworkHandler = new ArtworkHandler(instance(mockedArtworkService), instance(mockedUserService));

  it ("should add new artwork", async () => {
    await artworkHandler.addNewArtwork(req, res, (err?) => {});
  });
  it ("should get a artwork by username", async () => {
    const result = await artworkHandler.findUserArtwork(req, res, (err?) => {});
    expect(result.length).to.equal(1);
  });
  it ("should find local artwork for user", async () => {
    const result = await artworkHandler.findArtworkForUser(req, res, (err?) => {});
    expect(result.length).to.equal(1);
  });
  it ("should get all artwork", async () => {
    const result = await artworkHandler.getAllArtwork(req, res, (err?) => {});
    expect(result.length).to.equal(1);
  });
});

/*
public async getArtworkPage(req: Request, res: Response, next: NextFunction)
public clearArtwork(req: Request, res: Response, next: NextFunction)
*/