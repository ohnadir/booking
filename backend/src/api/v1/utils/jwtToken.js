const sendToken = (user, res) => {
    
    // Create JWT Token  
    const token = user.getJwtToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    res.status(200).cookie('token', token, options);
}
module.exports = sendToken;