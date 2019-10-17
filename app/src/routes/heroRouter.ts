import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
// const Heroes = require('../../dist/data.json');
const DbClient = require('../DbClient');
export class HeroRouter {
  public static create(router: Router) {
    //log
    console.log("[HeroRoute::create] Creating HeroRoutes route.");

    //add home page route
    router.get("/api/heroes", (req: Request, res: Response, next: NextFunction) => {
      new HeroRouter().getAll(req, res, next);
    });

    // add getOne route
    router.get("/api/heroes/:id", (req: Request, res: Response, next: NextFunction) => {
      new HeroRouter().getOne(req, res, next);
    });
  }

  constructor() {
    // not much here yet
  }

  /**
 * GET all Heroes.
 */
  public getAll(req: Request, res: Response, next: NextFunction) {
    DbClient.connect()
      .then((db: any) => {
        return db!.collection("heroes").find().toArray();
      })
      .then((heroes: any) => {
        console.log(heroes);
        res.send(heroes);
      })
      .catch((err: any) => {
        console.error(err);
      })
  }

  /**
   * GET one hero by id
   */
  public getOne(req: Request, res: Response, next: NextFunction) {
    let query = parseInt(req.params.id);
    DbClient.connect()
      .then((db: any) => {
        return db!.collection("heroes").find({ id: query }).toArray();
      })
      .then((heroes: any) => {
        console.log(heroes);
        res.send(heroes);
      })
      .catch((err: any) => {
        console.error(err);
      })
  }

}