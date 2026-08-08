const Address = require("../modules/addressModule");

// GET ALL ADDRESSES FOR LOGGED-IN USER
const getAddressesController = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).send({
      success: true,
      total: addresses.length,
      addresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

// ADD A NEW ADDRESS
const addAddressController = async (req, res) => {
  try {
    const { fullName, phone, line1, line2, city, state, pincode, isDefault } =
      req.body;

    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      return res.status(400).send({
        success: false,
        message: "fullName, phone, line1, city, state and pincode are required",
      });
    }

    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      isDefault: !!isDefault,
    });

    res.status(201).send({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};

// UPDATE AN ADDRESS
const updateAddressController = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).send({
        success: false,
        message: "Address not found",
      });
    }

    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    Object.assign(address, req.body);
    await address.save();

    res.status(200).send({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating address",
      error: error.message,
    });
  }
};

// DELETE AN ADDRESS
const deleteAddressController = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).send({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting address",
      error: error.message,
    });
  }
};

module.exports = {
  getAddressesController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
};
