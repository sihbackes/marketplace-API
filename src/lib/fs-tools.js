import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const publicFolderPath = join(process.cwd(), "./public/img/products");
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const productsJSONPath = join(dataFolderPath, "products.json");

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (productsArray) => writeJSON(productsJSONPath, productsArray);
export const saveProductsImg = (fileName, contentAsBuffer) => writeFile(join(publicFolderPath, fileName), contentAsBuffer);
