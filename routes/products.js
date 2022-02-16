const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getAllProductsStatic,
} = require("../controllers/products");

router.get("/", getAllProductsStatic);
router.get("/products", getAllProducts);

module.exports = router;
