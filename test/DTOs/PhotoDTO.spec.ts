import { ObjectID } from "mongodb";
import { expect } from "chai";
import "mocha";
import { PhotoDTO } from "../../src/DTOs/PhotoDTO";
import { S3_URL } from "../../src/services/S3Service";

describe("PhotoDTO object", () => {
  const photoData = {
    _id: new ObjectID("9va8glqme1bt"),
    user: "9ffdjklsfdsiofdsls"
  };

  it("should create a PhotoDTO object given valid data", () => {
    const photo: PhotoDTO = new PhotoDTO(photoData);

    expect(photo._id).to.equal(photoData._id.toString());
    expect(photo.userId).to.equal(photoData.user);
    expect(photo.url).to.equal(S3_URL(photoData._id.toString()));
  });
});
