import * as dbModule from "../../src/database/dbclient";
import * as appModule from "../../src/app";
import chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import { Db, MongoClient } from "mongodb";
import { promisify } from "util";
import bcrypt from "bcrypt";

chai.use(chaiHttp);
const expect = chai.expect;
let app: any;
let client: MongoClient;
let db: Db;

describe("Integration Test", () => {
  before(async () => {
    const dbPromise = promisify(dbModule.initDb);
    const result = await dbPromise("mongodb://localhost:27017", "test");
    client = result.client;
    db = result.db;
    app = appModule.Server.bootstrap(db).app;
  });
  after(() => {
    client.close();
  });

  describe("Index Route", () => {
    it("should have no errors with get /", (done) => {
      chai.request(app).get("/")
      .end((err, res) => {
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
     });
    });
  });
  describe("Register Route", () => {
    before(() => {
      try {
        db.collection("users").drop();
      } catch (_) {
        // Ignore
      }
    });
    it("should have no errors with get /register", (done) => {
      chai.request(app).get("/register")
      .end((err, res) => {
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
     });
    });
    it("should have no errors with post /api/register", (done) => {
      chai.request(app).post("/api/register")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({name: "test", username: "username", email: "test@email.com", city: "Victoria", provinceCode: "59", password: "Pass"})
      .then((res) => {
        expect(res).to.not.have.header("location", "/register");
        expect(res).to.have.cookie("user_sid");
        done();
      })
      .catch((err) => {
        // tslint:disable-next-line: no-unused-expression
        done(err);
     });
    }).timeout(3000);
  });

  describe("Login Route", () => {
    before(async () => {
      try {
        db.collection("users").drop();
      } catch (_) {
        // Ignore
      }
        // Create a user to sign in with
      const hash = await bcrypt.hash("Pass", 10); // Use 10 salt rounds
      await db.collection("users").insertOne({
          "name": "test",
          "username": "username",
          "email": "test@email.com",
          "city": "Victoria",
          "province": "British Colombia",
          "password": hash
        });
    });
    it("should have no errors with get /login", (done) => {
      chai.request(app).get("/login")
      .end((err, res) => {
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
     });
    });
    it("should have no errors with post /api/login", (done) => {
      chai.request(app).post("/api/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({email: "test@email.com", password: "Pass"})
      .then((res) => {
        expect(res).to.not.have.header("location", "/login");
        expect(res).to.have.cookie("user_sid");
        done();
      })
      .catch((err) => {
        // tslint:disable-next-line: no-unused-expression
        done(err);
     });
    }).timeout(3000);
  });

});
