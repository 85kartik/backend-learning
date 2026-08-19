const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
	name:{
		type:String,
		required:[true,"Enter name"]
	},
	description:{
		type:String,
		required:[true,"Enter Description"]
	},
	price:{
		type:Number,
		required:[true,"Enter Price"]
	},
	category:{
		type:String,
		required:[true,"Enter category"]
	},
	quantity:{
		type:Number,
		required:[true,"Enter Number"]
	}
},{timestamp:true},);

module.exports = mongoose.model("Product",productSchema)