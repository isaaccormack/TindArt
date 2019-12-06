import { expect } from "chai";
import "mocha";
import { ArtworkDTO } from "../../src/DTOs/ArtworkDTO";
import { GCP_URL } from "../../src/services/GCPService";

describe("ArtworkDTO object", () => {
  const artworkData = {
    _id: "my _id",
    userId: "my userId",
    title: "my title",
    description: "my description",
    price: 0.0,
    units: "my units",
    dimensions: [1, 1, 1],
    city: "my city",
    province: "my province",
    photos: ["photoId1", "photoId2"]
  };

  it("should create a ArtworkDTO object given valid data", () => {
    const artwork: ArtworkDTO = new ArtworkDTO(artworkData);

    expect(artwork._id).to.equal(artworkData._id);
    expect(artwork.userId).to.equal(artworkData.userId);
    expect(artwork.title).to.equal(artworkData.title);
    expect(artwork.description).to.equal(artworkData.description);
    expect(artwork.price).to.equal(artworkData.price);
    expect(artwork.units).to.equal(artworkData.units);
    expect(artwork.dimensions).to.equal(artworkData.dimensions);
    expect(artwork.city).to.equal(artworkData.city);
    expect(artwork.province).to.equal(artworkData.province);
    expect(artwork.photos.length).to.equal(2);
    expect(artwork.photos[0]).to.equal(GCP_URL(artworkData.photos[0]));
    expect(artwork.photos[1]).to.equal(GCP_URL(artworkData.photos[1]));
  });
});
