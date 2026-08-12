const express = require("express");
const router = express.Router();

const {addAddressController,deleteAddressController} = require("../controllers/addressController")

// const { requireSignIn } = require("../middleware/authMiddleware");


router.post("/",  addAddressController);
router.post("/:id",deleteAddressController)

module.exports = router