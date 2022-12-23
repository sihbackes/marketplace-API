import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import filesRouter from "./api/files/index.js";
import {genericErrorHandler, notFoundHandler, badRequestHandler, unauthorizedHandler} from "./errorHandlers.js";

const server = express();
const port = 3001;
server.use(express.json());
server.use("/products", productsRouter);
server.use("/files", filesRouter)

///my error handlers//
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("server is running", port);
});
