const express = require("express");
const { createRoute, loginRoute, logOut, getAllUsers } = require("../controllers/userController");
const { authorize, isAdmin } = require("../middlewares/userMiddleware");

const router = express.Router();

router.route("/").post(createRoute)
router.post("/login", loginRoute)
router.get("/users", authorize, isAdmin, getAllUsers)
router.get("/logout", logOut)


module.exports = router;