const express = require("express")
const router = express.Router()

const {productController,getProductController,
	deleteProductController,updateProductController} = require("../controllers/productController");

router.post("/create-product",productController);
router.get("/get-product",getProductController);
router.delete("/delete-product",deleteProductController)
router.put("/update-product",updateProductController)
module.exports = router