const express = require("express")
const router = express.Router()
const {cartCreateController,cartDeleteController}
 = require("../controllers/cartController")

router.post("/my-cart",cartCreateController)
router.delete("/delete-cart",cartDeleteController)
module.exports = router