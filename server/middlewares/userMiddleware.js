const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../config/asyncHandler");

const authorize = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt
    console.log(req.cookies)
    console.log(token);
    if (token) {
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = await User.findById(decode.userId).select("-password")
            next();
        }
        catch {
            res.status(403).json({ message: "Invalid token provided" })
        }
    }
    else {
        res.status(403).json({ message: "Not authorized" })
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(403).json({ message: "only admins are allowed to access this" })
    }
})

module.exports = { authorize, isAdmin }