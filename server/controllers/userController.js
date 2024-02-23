const asyncHandler = require("../config/asyncHandler");
const generateToken = require("../config/token");
const User = require("../models/User");
const bcrypt = require("bcrypt")

const createRoute = asyncHandler(async (req, res) => {
    //getting data
    const { username, password, email } = req.body;
    if (!email || !username || !password) {
        res.status(404).json({ message: "provide all required parameters" });
    }
    //checking user exists
    const userExists = await User.findOne({ email: email })
    userExists && res.status(400).json({ message: "user already exists" });
    const hashPassword = await bcrypt.hash(password, 10)
    try {
        //creating new user
        const newUser = await User.create({ email: email, password: hashPassword, username: username })
        generateToken(res, newUser._id);
        //sending new user response
        res.status(200).json({
            message: "User created successfully", user: {
                username: newUser.username, email: newUser.email, _id: newUser._id, isAdmin: newUser.isAdmin
            }
        });
    } catch (error) {
        console.error(error.message);

    }


})

const loginRoute = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const isExistUser = await User.findOne({ email })
    if (!isExistUser) {
        return res.status(404).json({ message: "user not exist,check your email and password" })
    }
    if (isExistUser) {
        const passwordCompare = await bcrypt.compare(password, isExistUser.password)
        if (passwordCompare) {
            generateToken(res, isExistUser._id)
            return res.status(200).json({
                message: "login successfully", user: {
                    username: isExistUser.username, email: isExistUser.email, _id: isExistUser._id, isAdmin: isExistUser.isAdmin
                }
            })
        }
    }

})

const logOut = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        express: new Date(0)
    })
    res.status(200).json({ message: "logout successfully" })
})

const getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await User.find({});
    res.status(200).json({ users: allUsers })
});


module.exports = { createRoute: createRoute, loginRoute: loginRoute, logOut: logOut, getAllUsers: getAllUsers };