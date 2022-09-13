const { User } = require('../models');
const crypto = require('crypto');
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail');
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

exports.registerUser= catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, country, city, phone, password, role } = req.body;

  try {
    const isPhoneExist = await User.findOne({ phone });
    if (isPhoneExist) {
      return next(new ErrorHandler('Phone Number Already Taken', 422))
    }

    if (email) {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler('Email Already Taken', 422))
      }
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      country,
      city,
      password,
      phone, 
      role
    });
    await newUser.save();
    response.token = newUser.getJwtToken();
    sendToken(newUser, res)
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"User Register Successfully",
      data: {newUser}
    })

  } catch (error) {
    return next(new ErrorHandler('Error. Try Again', 500))
  }
});
exports.userLogin= catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler('Invalid Credential', 422))
    }
    
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler('Email & password are Incorrect', 422))
    }
    
    sendToken(user, res)
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Login Successfully"
    })
  } catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
});

exports.updateUser = catchAsyncErrors(async (req, res, next)=> {
  const { firstName, lastName, phone, email } = req.body;
  const id = req.params.id;

  try {
    const user = await User.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!user) {
      return next(new ErrorHandler('No User Found', 422))
    }

    const isPhoneExist = await User.findOne({ phone });
    if (
      isPhoneExist &&
      phone === isPhoneExist.phone &&
      String(user._id) !== String(isPhoneExist._id)
    ) {
      return next(new ErrorHandler('Phone Number Already Taken', 422))
    }

    const isEmailExist = await User.findOne({ email });
    if (
      isEmailExist &&
      email === isEmailExist.email &&
      String(user._id) !== String(isEmailExist._id)
    ) {
      return next(new ErrorHandler('Email Already Taken', 422))
    }

    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.phone = phone ? phone : user.phone;
    user.email = email ? email : user.email;
    

    await user.save();

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"User Update Successfully",
      data: {user}
    })

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({
      _id: id,
      isDelete: false,
    });
    if (!user) {
      return next(new ErrorHandler('No user found', 404))
    }

    user.isDelete = true;
    user.deletedAt = Date.now();
    await user.save();

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"User Delete Successfully"
    })
  } catch (error) {
    return next(new ErrorHandler('Error. Try Again', 500))
  }
});

exports.getUsers = catchAsyncErrors(async (req, res, next) => {

  try {
    /* const pageNumber = parseInt(page) || 1;
    const limit = parseInt(size) || 10;

    const totalDocuments = await User.countDocuments({
      isDelete: false,
    });
    const totalPage = Math.ceil(totalDocuments / limit); */

    /* const buyers = await User.find({ isDelete: false })
      .select('-__v -isDelete')
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .lean(); */
    
      const users = await User.find({ isDelete: false })
    if (users.length === 0) {
      return next(new ErrorHandler('No user Found', 404))
    }

    /* const data = {
      buyers,
      currentPage: pageNumber,
      totalDocuments,
      totalPage,
    }; */
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Fetch All user Successfully",
      data: users
    })
  } catch (error) {
    return next(new ErrorHandler('Error. Try Again', 500))
  }
});

exports.searchUser = catchAsyncErrors(async (req, res, next) => {
  const q = req.query;

  try {
    let query = { isDelete: false };
    if (q !== 'undefined' || q !== undefined || q) {
      let regex = new RegExp(q, 'i');
      query = {
        ...query,
        $or: [{ firstName: regex }, { lastName: regex }, { phone: regex }, { email: regex }],
      };
    }

    const users = await User.find(query)
      .select('-__v -isDelete')
      .sort({ _id: -1 });

    if (users.length === 0) {
      return next(new ErrorHandler('No User Found', 404))
    }

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Search User get Successfully",
      data: users
    })
  } catch (error) {
    return next(new ErrorHandler('Error. Try Again', 500))
  }
});

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({
      _id: id,
      isDelete: false,
    })
      .select('-__v -isDelete')
      .exec();
    
      res.status(200).json({
        Success: true,
        statusCode:200,
        message:"User Details get Successfully",
        data: user
      })

  } catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
});

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  res.status(200).json({
    Success: true,
    statusCode:200,
    message:"Logout Successfully"
  })
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const email = req.body;
  try {

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler('No user Founf', 422))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset password URL 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/password/reset/${resetToken}`
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nif you have not request this email, then ignore it.`
    if (user) {
      await sendEmail({
        email: user.email,
        subject: 'Booking Password Recovery',
        message
      })
    }

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Forgot Password token set Successfully"
    })

  }
  catch (error) {
    return next(new ErrorHandler('Error. Try Again', 500))
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const token  = req.params.token;
  const {password, confirmPassword} = req.body 
  try {
  //  Hash URL Token 
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
})
  if (!user) {
    response.message = 'Password reset token is invalid or has been expired';
    return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400))
  }

  // Setup new password
  user.password = password;
  await user.save();
  sendToken(user, res);
  res.status(200).json({
    Success: true,
    statusCode:200,
    message:"Password Reset Successfully"
  })
    
  }
  catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
  
})

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const { password, oldPassword } = req.body;

  const user = await User.findById({
    _id: id,
    isDelete: false,
  }).select('+password');

  if (!user) {
    return next(new ErrorHandler('User not found', 400))
  }

  const isMatched = await user.comparePassword(oldPassword)
  if (!isMatched) {
    return next(new ErrorHandler('Old password is incorrect', 400))
  }
  user.password = password;
  await user.save();
  sendToken(user, res);
  res.status(200).json({
    Success: true,
    statusCode:200,
    message:"Password update  Successfully"
  })
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const {  } = req.body;
  const id = req.params.id;


  const user = await User.findById({_id: id});

  if (!user) {
    response.code = 400;
    response.status = 'Failed';
    response.message = 'User is not Fount';
    return response;
  }

  const isMatched = await user.comparePassword(body.oldPassword)
  if (!isMatched) {
    response.code = 400;
    response.status = 'Failed';
    response.message = 'Old password is incorrect';
    return response;
  }
  user.password = body.password;
  await user.save();
  sendToken(user, 200, res)
})