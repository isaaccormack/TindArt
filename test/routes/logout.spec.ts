import { expect, app, chai } from "./route.spec";

describe("Logout Route", () => {
  it("should logout and redirect to index", (done) => {
    chai.request(app).get("/api/logout")
    .end((err, res) => {
      // tslint:disable-next-line: no-unused-expression
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
   });
  });
});
