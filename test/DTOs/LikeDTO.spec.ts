import { expect } from "chai";
import "mocha";
import { LikeDTO } from "../../src/DTOs/LikeDTO";

describe("LikeDTO object", () => {
  const likeData = {
    userId: "my ownerId",
    artworkId: "my artworkId",
    _id: "my _id",
  };

  it("should create a LikeDTO object given valid data", () => {
    const art: LikeDTO = new LikeDTO(likeData);

    expect(art.userId).to.equal(likeData.userId);
    expect(art.artworkId).to.equal(likeData.artworkId);
    expect(art._id).to.equal(likeData._id);
  });
});
