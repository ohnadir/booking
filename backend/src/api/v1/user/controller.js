const {
  registerUserService,
  userSignInService,
  updateUserService,
  deleteUserService,
  getUsersService,
  searchUserService,
  getUserService,
  userLogoutService,
  forgotPasswordService,
  resetPasswordService,
  updatePasswordService,
  updateProfileService
  
} = require('./service');

exports.registerUser = async (req, res) => {
  const { status, code, message } = await registerUserService({
    body: req.body,
    ...req.body,
    res: res
  });
  res.status(code).json({ code, status, message });
};
exports.userSignIn = async (req, res) => {
  const { status, code, message, data } = await userSignInService({
    ...req.body,
    res: res
  });
  res.status(code).json({ code, status, message, data });
};

exports.updateUser = async (req, res) => {
  const { status, code, message, data } = await updateUserService({
    ...req.params,
    ...req.body,
  });
  if (data.user) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.deleteUser = async (req, res) => {
  const { status, code, message, data } = await deleteUserService({
    ...req.params,
  });
  res.status(code).json({ code, status, message, data });
};

exports.getUsers = async (req, res) => {
  const { status, code, message, users } = await getUsersService({
    ...req.query,
  });
  res.status(code).json({ code, status, message, users });
};

exports.searchUser = async (req, res) => {
  const { status, code, message, data } = await searchUserService({
    ...req.query,
  });
  if (data.users && data.users.length > 0) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.getUser = async (req, res) => {
  const { status, code, message, data } = await getUserService({
    ...req.params,
  });
  res.status(code).json({ code, status, message, data });
};

exports.logoutUser = async (req, res) => {
  const { status, code, message } = await userLogoutService({
    res
  });
  res.status(code).json({ code, status, message });
};

exports.forgotPassword = async (req, res) => {
  const { status, code, message } = await forgotPasswordService({
    ...req.body,
    req:req
  });
  res.status(code).json({ code, status, message });
};

exports.resetPassword = async (req, res) => {
  const { status, code, message } = await resetPasswordService({
    token: req.params.token,
    body: req.body,
    res
  });
  res.status(code).json({ code, status, message });
};

exports.updatePassword = async (req, res) => {
  const { status, code, message } = await updatePasswordService({
    ...req.params,
    body: req.body,
    res
  });
  res.status(code).json({ code, status, message });
};

exports.updateProfile = async (req, res) => {
  const { status, code, message } = await updateProfileService({
    ...req.params,
    body: req.body
  });
  res.status(code).json({ code, status, message });
};
