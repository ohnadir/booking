const { User } = require('../models');
const crypto = require('crypto');
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')

exports.registerUserService = async ({ body, res }) => {
  const { firstName, lastName, email, country, city, phone, password, role } = body;
  
  const response = {
    code: 201,
    status: 'success',
    message: 'User added successfully',
  };

  try {
    const isPhoneExist = await User.findOne({ phone });
    if (isPhoneExist) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'Phone number already taken';
      return response;
    }

    if (email) {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        response.code = 422;
        response.status = 'failed';
        response.message = 'Email already taken';
        return response;
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
    return response;

  } catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
};
exports.userSignInService = async ({ email, password, res }) => {
  const response = {
    code: 201,
    status: 'success',
    message: 'User login successfully',
  };

  try {
    const user = await User.findOne({ email });

    if (!user) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'Data don not found by Email';
      return response;
    }
    
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'Email & Password are  Incorrect';
      return response;
      
    }
    
    sendToken(user, res)
    return response;
    
    

  } catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.updateUserService = async ({
  id, firstName, lastName, phone, email
}) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'User updated successfully',
    data: {},
  };

  try {
    const user = await User.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!user) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'No User data found';
      return response;
    }

    const isPhoneExist = await User.findOne({ phone });
    if (
      isPhoneExist &&
      phone === isPhoneExist.phone &&
      String(user._id) !== String(isPhoneExist._id)
    ) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'Phone number already taken';
      return response;
    }

    const isEmailExist = await User.findOne({ email });
    if (
      isEmailExist &&
      email === isEmailExist.email &&
      String(user._id) !== String(isEmailExist._id)
    ) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'Email already taken';
      return response;
    }

    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.phone = phone ? phone : user.phone;
    user.email = email ? email : user.email;
    

    await user.save();

    response.data.user = user;
    return response;

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.deleteUserService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Delete User successfully',
  };

  try {
    const user = await User.findOne({
      _id: id,
      isDelete: false,
    });
    if (!user) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No User data found';
      return response;
    }

    user.isDelete = true;
    user.deletedAt = Date.now();
    await user.save();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getUsersService = async () => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Fetch User list successfully'
  };

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
      response.code = 404;
      response.status = 'failded';
      response.message = 'No User data found';
      return response;
    }

    /* response.data = {
      buyers,
      currentPage: pageNumber,
      totalDocuments,
      totalPage,
    }; */
    response.users = {
      users
    };
    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.searchUserService = async ({ q }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'User data found successfully',
    data: {},
  };

  try {
    let query = { isDelete: false };
    if (q !== 'undefined' || q !== undefined || q) {
      let regex = new RegExp(q, 'i');
      query = {
        ...query,
        $or: [{ firstName: regex }, { lastName: regex }, { phone: regex }, { email: regex }],
      };
    }

    response.data.users = await User.find(query)
      .select('-__v -isDelete')
      .sort({ _id: -1 });

    if (response.data.users.length === 0) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No User data found';
    }

    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getUserService = async ({ id }) => {

  const response = {
    code: 200,
    status: 'Success',
    message: 'Fetch detailed User successfully'
  };

  try {
    const user = await User.findOne({
      _id: id,
      isDelete: false,
    })
      .select('-__v -isDelete')
      .exec();
    
    response.data= user;
    return response;

  } catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.userLogoutService = async ({res}) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Logout successfully',
  };
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  return response;
};

// Forgot Password
exports.forgotPasswordService = async ({ email, req }) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Forgot Password token set Successfully',
  };

  try {

    const user = await User.findOne({ email });
    if (!user) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'User not Found';
      return response;
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
        subject: 'Fruits Password Recovery',
        message
      })
    }

    return response;

  }
  catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.resetPasswordService = async ({ token, body, res }) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Password reset Successfully',
  };

  try {

  //  Hash URL Token 
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
})
  console.log(user);
  if (!user) {
    response.code = 400;
    response.status = 'Failed';
    response.message = 'Password reset token is invalid or has been expired';
    return response;
  }

  if (body.password !== body.confirmPassword) {
    response.code = 400;
    response.status = 'Failed';
    response.message = 'Password does not match';
    return response;
  }

  // Setup new password
  user.password = body.password;
  await user.save();
  sendToken(user, res);
  return response;
    
  }
  catch (error) {
    response.code = 500;
    response.status = 'Failed';
    response.message = 'Error. Try again';
    return response;
  }
  
}

exports.updatePasswordService = async ({ id, body, res }) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Password update  successfully',
  };

  const user = await User.findById({
    _id: id,
    isDelete: false,
  }).select('+password');

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
  sendToken(user, res)
}

exports.updateProfileService = async ({ id, body }) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Password update  successfully',
  };

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
}