import express from "express";
import multer from "multer";
import { extname } from "path";
import {getProducts, writeProducts, saveProductsImg,} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post("/:productId/upload", multer().single("imageUrl"), async (request, response, next) => {

    try {
      const originalFileExtension = extname(request.file.originalname);
      const fileName = request.params.productId + originalFileExtension;

      await saveProductsImg(fileName, request.file.buffer);

      const url = `http://localhost:3001/img/products/${fileName}`;

      const products = await getProducts();

      const index = products.findIndex((product) => product._id === request.params.productId);

      if (index !== -1) {
        const oldProduct = products[index];
        const updatedProduct = { ...oldProduct, imageUrl: url , updatedAt: new Date() };
        products[index] = updatedProduct;
        await writeProducts(products);
      }
      response.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter