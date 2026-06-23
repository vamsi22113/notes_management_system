const Note = require("../models/Note");

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user.id
    });

    res.status(201).json({
      message: "Note created successfully",
      note
    });
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Fetch all notes for the authenticated user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update an existing note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    if (content !== undefined && !content.trim()) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }
    if (title === undefined && content === undefined) {
      return res.status(400).json({ message: "Please provide title or content to update" });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    // Verify ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied. You can only update your own notes."
      });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note
    });
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    // Verify ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied. You can only delete your own notes."
      });
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note deleted successfully"
    });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote
};
