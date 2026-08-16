const User = require("../modules/userModule");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Enter Name",
      });
    }

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Enter Email",
      });
    }

    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Enter Password",
      });
    }

    if (!phone) {
      return res.status(400).send({
        success: false,
        message: "Enter Phone Number",
      });
    }

    if (!address) {
      return res.status(400).send({
        success: false,
        message: "Enter Address",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    const token = JWT.sign(
      {
        _id: newUser._id,
      },
      process.env.JWT_CODE,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).send({
      success: true,
      message: "Register Successfully",
      newUser,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in Register",
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Enter UserId",
      });
    }

    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error in Deleting User",
    });
  }
};
const loginController = async (req,res) =>{
  try {
    const {email,password} = req.body;
    if(!email){
      return res.status(201).send({
        success:false,
        message:"Enter email"
      })
    }
    if(!password){
      return res.status(201).send({
        success:false,
        message:"Enter Password"
      })
    }
    const checkUser = await User.findOne({email})
    if(!checkUser){
      return res.status(404).send({
        success:false,
        message:"No User Found"
      })
    }
    const isMatch = await bcrypt.compare(password,checkUser.password)
    if(!isMatch){
      return res.status(401).send({
        success:false,
        message:"Incorrect Password"
      })
    }
    const hashPassword = await bcrypt.hash(password,10);
    const userData = {
      _id:checkUser._id,
      name:checkUser.name,
      email:checkUser.email,
      password:checkUser.password,
      phone:checkUser.phone,
      address:checkUser.address
    }
    const token = await JWT.sign({_id:checkUser._id},process.env.JWT_CODE,{expiresIn:"7d"});
    res.status(200).send({
      success:true,
      message:"User Login successfull",
      userData,
      token
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:"Error in Login"
    })
  }
}
const resetPasswordController = async (req,res) =>{
  try {
    const {email,currentPassword,newPassword} = req.body;
    if(!currentPassword){
      return res.status(201).send({
        success:false,
        message:"Enter Current Password"
      })
    }
    if(!newPassword){
      return res.status(201).send({
        success:false,
        message:"Enter New Password"
      })
    }
    const checkUser = await User.findOne({email});
    if(!checkUser){
      return res.status(404).send({
        success:false,
        message:"User not found",
      })
    }
    const isMatch = await bcrypt.compare(currentPassword,checkUser.password);
    if(!isMatch){
      return res.status(201).send({
        success:false,
        message:"Password not Match"
      })
    }
    const hashPassword = await bcrypt.hash(newPassword,10);
    checkUser.password = hashPassword;
    await checkUser.save()

    return res.status(200).send({
      success:true,
      message:"Password Updated"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:"Error in Password change",
    })
  }
}
const getProfileController = async (req,res) =>{
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password")
    if(!user){
      return res.status(404).send({
        success:false,
        message:"User Not Found"
      })
    }
    return res.status(200).send({
      success:true,
      message:"Profile Fetch Successfully",
      user
      
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message:"Error to get profile"
    })
  }
}
const updateProfileController = async (req,res) =>{
  try {
    const {name,address,phone} = req.body;
     const userId = req.user._id;
    if (!name && !phone && !address) {
      return res.status(400).send({
        success: false,
        message: "Enter details to update",
      });
    }

    const user = await User.findById(userId)
    if(!user){
      return res.status(404).send({
        success:false,
        message:"User Not Found"
      })
    }
    if(name){
      user.name = name;
    }
    if(address){
      user.address = address
    }
    if(phone){
      user.phone = phone
    }
    await user.save()
    const userData = {
      _id:user._id,
      name:user.name,
      address:user.address,
      phone:user.phone,
    }
    return res.status(200).send({
      success:true,
      message:"Profile Updated successfull",
      userData
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:"Error in updating profile"
    })
  }
}
const loginWithOtpController = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).send({
        success: false,
        message: "Enter Email or Phone",
      });
    }

    const conditions = [];

    if (email) {
      conditions.push({ email });
    }

    if (phone) {
      conditions.push({ phone });
    }

    const findUser = await User.findOne({
      $or: conditions,
    });

    if (!findUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 5 minutes
    const otpExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    findUser.otp = otp;
    findUser.otpExpiry = otpExpiry;

    await findUser.save();

    // Development only
    console.log("OTP:", otp);

    return res.status(200).send({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.log("LOGIN OTP ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error in Sending OTP",
    });
  }
};


const verifyOtpController = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if (!email && !phone) {
      return res.status(400).send({
        success: false,
        message: "Enter Email or Phone",
      });
    }

    if (!otp) {
      return res.status(400).send({
        success: false,
        message: "Enter OTP",
      });
    }

    const conditions = [];

    if (email) {
      conditions.push({ email });
    }

    if (phone) {
      conditions.push({ phone });
    }

    const findUser = await User.findOne({
      $or: conditions,
    });

    if (!findUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    // Check OTP expiry
    if (
      !findUser.otpExpiry ||
      Date.now() > findUser.otpExpiry.getTime()
    ) {
      return res.status(401).send({
        success: false,
        message: "OTP Expired",
      });
    }

    // Check OTP
    if (findUser.otp !== otp) {
      return res.status(401).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Clear OTP after successful verification
    findUser.otp = null;
    findUser.otpExpiry = null;

    await findUser.save();

    // Generate JWT
    const token = JWT.sign(
      {
        _id: findUser._id,
      },
      process.env.JWT_CODE,
      {
        expiresIn: "7d",
      }
    );

    const userData = {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      phone: findUser.phone,
      address: findUser.address,
    };

    return res.status(200).send({
      success: true,
      message: "Login Successful",
      userData,
      token,
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error in OTP Verification",
    });
  }
};
module.exports = {
  registerController,
  deleteUserController,
  loginController,
  resetPasswordController,
  getProfileController,
  updateProfileController,
  loginWithOtpController,
  verifyOtpController
};