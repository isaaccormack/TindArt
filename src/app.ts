import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import express from "express";
import logger from "morgan";
var mustacheExpress = require('mustache-express');
import path from "path";

import flash = require("express-flash");
import session = require("express-session");

import { IndexRoute } from "./routes/index";
import { LogoutRoute } from "./routes/logout";
import { LoginRoute } from "./routes/login";
import { RegisterRouter } from "./routes/registerRouter";
import { NotFoundRoute } from "./routes/notFound";
import { UploadRouter } from "./routes/uploadRouter";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.app = express();

    // configure application
    this.config();

    // add routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    // add static paths
    this.app.use(express.static(path.join(__dirname, "../public")));

    // configure mustache
    this.app.engine('mustache', mustacheExpress());
    this.app.set('view engine', 'mustache');
    this.app.set('views', __dirname + '/../src/views');

    // mount logger
    this.app.use(logger("dev"));

    // mount json form parser
    this.app.use(bodyParser.json());

    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // mount cookie parser middleware
    this.app.use(cookieParser("SECRET_GOES_HERE"));

    // initialize express-session to allow us track the logged-in user across sessions.
    this.app.use(session({
      name: "user_sid",
      secret: "SECRET_GOES_HERE",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 360000 // 1 hour
      }
    }));

    this.app.use(flash());

    /* This middleware will check if user's cookie is still saved in browser and
     * user is not set, then automatically log the user out.
     * This usually happens when you stop your express server after login, your
     * cookie still remains saved in the browser.
     */
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.cookies.user_sid && !req.session!.user) {
        res.clearCookie("user_sid");
      }
      next();
    });
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    IndexRoute.create(router);
    RegisterRouter.create(router);
    LogoutRoute.create(router);
    LoginRoute.create(router);
    UploadRouter.create(router);
    NotFoundRoute.create(router); // 404 Route must be last

    //use router middleware
    this.app.use(router);
  }

}
