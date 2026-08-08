const express = require("express");
const router = express.Router();

const {
  getAddressesController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
} = require("../controllers/addressController");

const { requireSignIn } = require("../middleware/authMiddleware");

// Get Logged-in User's Addresses
router.get("/", requireSignIn, getAddressesController);

// Add a New Address
router.post("/", requireSignIn, addAddressController);

// Update an Address
router.put("/:id", requireSignIn, updateAddressController);

// Delete an Address
router.delete("/:id", requireSignIn, deleteAddressController);

module.exports = router;
