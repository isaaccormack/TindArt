import * as appModule from "../../src/app";
import chai from "chai";
import chaiHttp = require("chai-http");

const app = appModule.Server.bootstrap().app;
chai.use(chaiHttp);
const expect = chai.expect;

export { chai, app, expect };
