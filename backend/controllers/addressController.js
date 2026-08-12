const Address = require("../modules/addressModule");

const addAddressController = async (req, res) => {
    try {
        const {
            name,
            phone,
            line1,
            line2,
            city,
            state,
            pincode,
            isDefault
        } = req.body;

        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Enter name",
            });
        }

        if (!phone) {
            return res.status(400).send({
                success: false,
                message: "Enter phone",
            });
        }

        if (!line1) {
            return res.status(400).send({
                success: false,
                message: "Enter line1",
            });
        }

        if (!city) {
            return res.status(400).send({
                success: false,
                message: "Enter city",
            });
        }

        if (!state) {
            return res.status(400).send({
                success: false,
                message: "Enter state",
            });
        }

        if (!pincode) {
            return res.status(400).send({
                success: false,
                message: "Enter pincode",
            });
        }

        const address = await Address.create({
            user: req.user,
            name,
            phone,
            line1,
            line2,
            city,
            state,
            pincode,
            isDefault,
        });

        return res.status(201).send({
            success: true,
            message: "Address added successfully",
            address,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Error in address creation",
            error: error.message,
        });
    }
};

// delete address

const deleteAddressController = async (req,res) =>{
	try{
		const address = await Address.findOneAndDelete({
			_id:req.params.id,
			user:req.user._id,
		})
		if (!address){
			return res.status(401).send({
				success:false,
				message:"Enter address",
			})
		}
		res.status(200).send({
			success:true,
			message:"address deleted"
		})
	}catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting address",
      error: error.message,
    });
  }
}

module.exports = { addAddressController , deleteAddressController};