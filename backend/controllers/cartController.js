const Cart = require("../modules/cartModule")
const Product = require("../modules/productModule")
const cartCreateController = async (req,res) =>{
	try {
		const {productId,quantity} = req.body;
		if(!productId){
			return res.status(204).send({
				success:false,
				message:"Enter Product Id"
			})
		}
		if(!quantity){
			return res.status(204).send({
				success:false,
				message:"Enter quantity"
			})
		} 
		const checkProduct = await Product.findById(productId)
		if(!checkProduct){
			return res.status(404).send({
				success:false,
				message:"Product Not Found"
			})
		}
		const myCart = await Cart.create({
			productId,
			quantity,
		})
		await myCart.populate("productId");
		return res.status(200).send({
			success:true,
			message:"cart created",
			myCart
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			success:false,
			message:"Error in Cart Creation"
		})
	}
}

const cartDeleteController = async (req,res) =>{
	try {
		const {cartId} = req.body;
		if(!cartId){
			return res.status(201).send({
				success:false,
				message:"Enter cart Id"
			})
		}
		const checkCart = await Cart.findByIdAndDelete(cartId);
		if(!checkCart){
			return res.status(404).send({
				success:false,
				message:"Cart Not found"
			})
		}
		return res.status(200).send({
			success:true,
			message:"cart deleted"
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			success:false,
			message:"Error in deleting cart"
		})
	}
}
module.exports = {cartCreateController,cartDeleteController}