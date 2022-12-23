import express from "express";
import { getProducts } from "../../lib/fs-tools.js";
import { writeProducts } from "../../lib/fs-tools.js";
import uniqid from "uniqid";
import httpErrors from "http-errors";

const { NotFound } = httpErrors;
const productsRouter = express.Router();

//POST//
productsRouter.post("/", async (request, response, next) => {
  try {
    console.log("Request Body: ", request);
    const newProduct = {
      ...request.body,
      _id: uniqid(),
      createdAt: new Date(),
    };
    console.log(newProduct);
    const arrayOfProducts = await getProducts();
    arrayOfProducts.push(newProduct);
    writeProducts(arrayOfProducts);
    response.status(201).send({ id: newProduct._id });
  } catch (error) {
    next(error);
  }
});

//GET//
productsRouter.get("/", async (request, response, next) => {
  try {
    const arrayOfProducts = await getProducts();
    response.send(arrayOfProducts);
  } catch (error) {
    next(error);
  }
});

//GET BY ID//
productsRouter.get("/:productId", async (request, response, next) => {
  try {
    const arrayOfProducts = await getProducts();
    const product = arrayOfProducts.find(
      (product) => product._id === request.params.productId
    );
    if (product) {
      response.send(product);
    } else {
      next(
        NotFound(
          `Sorry, product with id ${request.params.productId} not found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//EDIT//
productsRouter.put("/:productId", async (request, response, next) => {
  try {
    const arrayOfProducts = await getProducts();
    const index = arrayOfProducts.findIndex(
      (product) => product._id === request.params.productId
    );
    if (index !== 1) {
      const oldProduct = arrayOfProducts[index];
      const updatedProduct = {
        ...oldProduct,
        ...request.body,
        updateAt: new Date(),
      };
      arrayOfProducts[index] = updatedProduct;
      writeProducts(arrayOfProducts);
      response.send(updatedProduct);
    } else {
      next(
        NotFound(
          `Sorry, product with id ${request.params.productId} not found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//DELETE//
productsRouter.delete("/:productId", async (request, response, next) => {
  try {
    const arrayOfProducts = await getProducts();
    const remainingProducts = arrayOfProducts.filter(
      (product) => product._id !== request.params.productId
    );
    if (arrayOfProducts.length !== remainingProducts.length) {
      writeProducts(remainingProducts);
      response.status(204).send();
    } else {
      next(
        NotFound(
          `Sorry, product with id ${request.params.productId} not found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
