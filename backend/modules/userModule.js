const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
	name:{
		type:String,
		trim:true,
		required:[true,"Enter name"],
	},
	email:{
		type:String,
		trim:true,
		required:[true,"Enter Email"],
		unique:true,
	},
	password:{
		trim:true,
		type:String,
		required:[true,"Enter password"],
		minlength:6
	}
})

module.exports = mongoose.model("user",userSchema);