import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import { Request, Response, NextFunction } from "express";
import flash = require("express-flash");
import logger from "morgan";
import mustache from "mustache-express";
import path from "path";
import session = require("express-session");

import { IndexRoute } from "./routes/index";
import { LogoutRoute } from "./routes/logout";
import { LoginRoute } from "./routes/login";
import { NotFoundRoute } from "./routes/notFound";
import { RegisterRoute } from "./routes/register";
import { LikesRoute } from "./routes/likes";
import { ArtworkRoute } from "./routes/artwork";
import { UserRoute } from "./routes/users";
import { UploadRoute } from "./routes/upload";
import { LoginHandler } from "./handlers/login";
import { LikesHandler } from "./handlers/likes";
import { ArtworkHandler } from "./handlers/artwork";
import { UserService } from "./services/UserService";
import { IUserService } from "./services/IUserService";
import { LikeService } from "./services/LikeService";
import { ILikeService } from "./services/ILikeService";
import { ArtworkService } from "./services/ArtworkService";
import { IArtworkService } from "./services/IArtworkService";
import { initDb, getDb } from "./database/dbclient";
import { PhotoService } from "./services/PhotoService";
import { IPhotoService } from "./services/IPhotoService";
import { UploadHandler } from "./handlers/upload";
import { UserHandler } from "./handlers/users";
import { RegisterHandler } from "./handlers/register";

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

    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  private config() {
    // add static paths
    this.app.use(express.static(path.join(__dirname, "../public")));

    // configure mustache
    this.app.engine("mustache", mustache());
    this.app.set("view engine", "mustache");
    this.app.set("views", __dirname + "/../src/views");

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
    const router: express.Router = express.Router();

    const userService: IUserService = new UserService({db: getDb()});
    const photoService: IPhotoService = new PhotoService({db: getDb()});
    const artworkService: IArtworkService = new ArtworkService({db: getDb()});
    const likeService: ILikeService = new LikeService({db: getDb()});

    const loginHandler: LoginHandler = new LoginHandler(userService);
    const userHandler: UserHandler = new UserHandler(userService);
    const registerHandler: RegisterHandler = new RegisterHandler(userService);
    const likesHandler: LikesHandler = new LikesHandler(likeService, artworkService);
    const uploadHandler: UploadHandler = new UploadHandler(photoService);
    const artworkHandler: ArtworkHandler = new ArtworkHandler(artworkService);

    IndexRoute.create(router, artworkHandler);
    RegisterRoute.create(router, registerHandler);
    LoginRoute.create(router, loginHandler);
    LogoutRoute.create(router);
    LikesRoute.create(router, likesHandler);
    UploadRoute.create(router, uploadHandler, photoService);
    ArtworkRoute.create(router, artworkHandler, uploadHandler);
    UserRoute.create(router, userHandler, artworkHandler); // 2nd last due to URL parsing
    NotFoundRoute.create(router); // 404 Route must be last

    // use router middleware
    this.app.use(router);
  }

}
