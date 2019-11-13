import { MongoClient, Db } from "mongodb";

export class Database {
  private db: Promise<Db>;

  constructor() {
    this.db = this.connect();
  }

  public async getUserByEmail(email: string): Promise<any> {

  }

  private async connect(): Promise<Db> {
    const client: Promise<MongoClient> = MongoClient.connect("mongodb://localhost:27017");
    return client.then((c: MongoClient) => {
        console.log("Connected to database");
        return c.db("myapp");
      })
      .catch((err: any) => {
        console.log("Unable to connect to database");
        throw err;
      });
  }
}
