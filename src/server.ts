import { Server } from "@hapi/hapi";
import * as mongoose from "mongoose";
import { SellerController } from "./Controllers/SellerController";
var Config = require("../src/Config");

export class APIServer {
  private server: Server;

  constructor() {
    mongoose.connect(Config.connectionString, Config.options);
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
    mongoose.connection.on("error", () => {
      console.log("Error while conneting to MongoDB");
    });
  }

  public async init() {
    // Create a server with a host and port
    this.server = Server({
      host: "localhost",
      port: 3000,
    });

    // Add the route
    this.server.route({
      method: "GET",
      path: "/hello",
      handler: function (request, h) {
        return "hello world";
      },
    });

    const sellerController = new SellerController();
    this.server.route(sellerController.getAllRoutes());

    try {
      await this.server.start();
    } catch (err) {
      console.log(err);
      process.exit(1);
    }

    console.log("Server running at:", this.server.info.uri);
  }
}
