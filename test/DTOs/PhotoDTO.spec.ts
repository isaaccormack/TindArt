import { expect } from "chai";
import "mocha";
import { PhotoDTO } from "../../src/DTOs/PhotoDTO";
import { GCP_URL } from "../../src/services/GCPService";

describe("PhotoDTO object", () => {
  const photoData = {
    _id: "fdjk39fdkfds0ffdss",
    user: "9ffdjklsfdsiofdsls"
  };

  it("should create a PhotoDTO object given valid data", () => {
    const photo: PhotoDTO = new PhotoDTO(photoData);

    expect(photo._id).to.equal(photoData._id);
    expect(photo.userId).to.equal(photoData.user);
    expect(photo.url).to.equal(GCP_URL(photoData._id));
  });
});
