const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/authmiddleware");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} = require("../controllers/noteController");

router.get("/", authmiddleware, getNotes);
router.post("/", authmiddleware, createNote);
router.put("/:id", authmiddleware, updateNote);
router.delete("/:id", authmiddleware, deleteNote);

module.exports = router;
