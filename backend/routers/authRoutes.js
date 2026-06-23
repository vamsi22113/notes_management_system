const express = require("express");
const router = express.Router();
const { register, Login } = require("../controllers/authcontroller.js");

router.post("/register", register);
router.post("/login", Login);

module.exports = router;