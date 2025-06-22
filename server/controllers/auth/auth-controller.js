const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const axios = require("axios");
const { oauth2Client } = require("../../helpers/google");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
    
  try {
    const checkEmail = await User.findOne({ email });
    const checkUser = await User.findOne({userName});
    if(checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same username! Please try again",
      })
    
    if (checkEmail)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName:userName,
      email:email,
      password: hashPassword,
      authProvider: 'local',
      profilePic: null,
    });
    
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};


const loginWithGoogle = async (req, res) => {
  try {
    const { code } = req.body;

   
    if (!code) {
      return res.status(400).json({ message: "Authorization code missing." });
    }

    // Exchange code for token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);


    // Get user info
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;



    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        userName: name,
        email,
        authProvider: 'google',
        profilePic: picture,
      });
      await user.save();
    }


    const token = jwt.sign(
      { id: user._id, email: user.email, userName: user.userName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );



    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true in production
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profilePic: user.profilePic,
      }
    });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(400).json({ success: false, message: "Google login failed" });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, loginWithGoogle };