const Product = require("../modules/productModule")

const productController = async (req,res) =>{
	try {
		const {name, description, price, category, quantity} = req.body;
		if(!name){
			return res.status(401).send({
				success:false,
				message:"Enter Name of Product"
			})
		}
		if(!description){
			return res.status(401).send({
				success:false,
				message:"Enter description of Product"
			})
		}
		if(!price){
			return res.status(401).send({
				success:false,
				message:"Enter price of Product"
			})
		}
		if(!category){
			return res.status(401).send({
				success:false,
				message:"Enter category of Product"
			})
		}
		if(!quantity){
			return res.status(401).send({
				success:false,
				message:"Enter Quantity of Product"
			})
		}
		if(price <= 0){
			return res.status(401).send({
				success:false,
				message:"Price should be more than zero"
			})
		}
		if(quantity <= 0){
			return res.status(401).send({
				success:false,
				message:"quantiy should be more than zero"
			})
		}
		const checkProductExist = await Product.findOne({name})
		if(checkProductExist){
			return res.status(401).send({
				success:false,
				message:"Product already exist"
			})
		}
		const newProduct = await Product.create({
			name,
			description,
			price,
			quantity,
			category
		});
		res.status(200).send({
			success:true,
			message:"New Product Created Successfully",
			newProduct
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			success:false,
			message:"Error in creating Product"
		})
	}
}
//GET product
const getProductController = async (req,res) =>{
	try {
		const {productId} = req.body;
		if(!productId){
			return res.status(404).send({
				success:false,
				message:"Enter Product Id"
			})
		}
		const checkProduct = await Product.findById(productId);
		if(!checkProduct){
			return res.status(404).send({
				success:false,
				message:"Product Not Found",
			})
		}
		res.status(200).send({
			success:true,
			message:"Product details",
			checkProduct,
		})
	} catch (error) {
		console.log(error)
		return res.status(401).send({
			success:false,
			message:"Error To Get product"
		})
	}
}
const deleteProductController = async (req,res) =>{
	try {
		const {productId} = req.body;
		if(!productId){
			return res.status(400).send({
				success:false,
				message:"Enter product Id"
			})
		}
		const checkProduct = await Product.findById(productId);
		if(!checkProduct){
			return res.status(400).send({
				success:false,
				message:"Product Not Found"
			})
		}
		await Product.findByIdAndDelete(productId)
		res.status(200).send({
			success:true,
			message:"Product Deleted"
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			success:false,
			message:"error in deleting product",
		})
	}
}
const updateProductController = async (req,res) =>{
	try {
		const {productId,name,description,quantity,category,price} = req.body;
		if(!productId){
			return res.status(400).send({
				success:false,
				message:"Enter Product Id"
			})
		}
		const checkProduct = await Product.findById(productId);
		if(!checkProduct){
			return res.status(400).send({
				success:false,
				message:"Product Not Found"
			})
		}
		const prdouctData = {}
		if(name !== undefined){
			prdouctData.name = name
		}
		if(description !== undefined){
			prdouctData.description = description
		}
		if(price !== undefined){
			if(price <= 0){
				return res.status(400).send({
					success:false,
					message:"product price cannot be negative or zero"
				});
			}
			prdouctData.price = price;
		}
		if(category !== undefined){
			prdouctData.category = category
		}
		if(quantity !== undefined){
			if(quantity <= 0){
				return res.status(400).send({
					success:false,
					message:"quantity cannot be in negative or zero"
				});
			}
			prdouctData.quantity = quantity
		}
		const updateproduct = await Product.findByIdAndUpdate(
			productId,
			prdouctData,
			{ new: true }
		)
		res.status(200).send({
			success:true,
			message:"Product Update",
			updateproduct
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			success:false,
			message:"Error in updating product"
		})
	}
}
module.exports = {productController,getProductController,
	deleteProductController,updateProductController}