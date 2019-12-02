import { expect, app, chai } from "./route.spec";

describe("Not Found Route", () => {
  it("should return 404 on routes not found", (done) => {
    chai.request(app).get("/shouldnotbefound")
    .end((err, res) => {
      // tslint:disable-next-line: no-unused-expression
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      done();
   });
  });
});
