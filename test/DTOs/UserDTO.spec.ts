import { expect } from "chai";
import "mocha";
import { UserDTO, UserDataJSON } from "../../src/DTOs/UserDTO";

describe("PhotoDTO object", () => {
  const userData = {
    bio: "my bio",
    name: "my name",
    username: "my username",
    email: "my@email.com",
    city: "my city",
    province: "my province",
    password: "",
    _id: "my _id",
    phoneNumber: "my phoneNumber"
  };

  it("should create a UserDTO object given valid data", () => {
    const user: UserDTO = new UserDTO(userData);

    expect(user.bio).to.equal(userData.bio);
    expect(user.name).to.equal(userData.name);
    expect(user.username).to.equal(userData.username);
    expect(user.email).to.equal(userData.email);
    expect(user.city).to.equal(userData.city);
    expect(user.province).to.equal(userData.province);
    expect(user._id).to.equal(userData._id);
    expect(user.phoneNumber).to.equal(userData.phoneNumber);
  });
});
