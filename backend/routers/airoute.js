const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authmiddleware = require("../middlewares/authmiddleware");
const { explanation, getprojectsnippets } = require("../controllers/aicontroller");

router.post(
  "/explain",
  authmiddleware,
  body("code")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Code must be at least 3 characters"),
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required"),
  body("mode")
    .optional()
    .isIn(["beginner", "advanced", "debug", "optimize"])
    .withMessage("Invalid mode"),
  explanation
);

router.get("/:projectId", authmiddleware, getprojectsnippets);
module.exports = router;
