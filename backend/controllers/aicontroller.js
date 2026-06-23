const CodeSnippet = require("../models/codesnippet");
const { validationResult } = require("express-validator");
//const openai = require("../utils/openai")
const generateExplanation = async (code, mode = "beginner") => {
  try {
    if (mode === "beginner") {
    return `Beginner Explanation:\nThis code means: ${code}`;
  }

  if (mode === "advanced") {
    return `Advanced Explanation:\nDetailed technical breakdown of: ${code}`;
  }

  if (mode === "debug") {
    return `Debug Mode:\nPossible issues found in: ${code}`;
  }

  if (mode === "optimize") {
    return `Optimization Suggestions:\nImprove performance of: ${code}`;
  }

  return `General Explanation:\n${code}`;
    /*let systemPrompt = "";
    if (mode === "beginner") {
      systemPrompt = "Explain the code in very simple terms for a beginner.";
    }
    else if (mode === "advanced") {
      systemPrompt = "Explain the code with deep technical details.";
    }
    else if (mode === "debug") {
      systemPrompt = "Find bugs, issues, and potential errors in this code.";
    }
    else if (mode === "optimize") {
      systemPrompt = "Suggest performance and code improvements.";
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: code }
      ]
    })
    return response.choices[0].message.content;
  }*/
  }
  catch (err) {
    throw err;
  }
}
const explanation = async (req, res) => {
  try {
    // ✅ CHECK VALIDATION ERRORS
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { code, projectId, mode = "beginner" } = req.body;
    const existingSnippet = await CodeSnippet.findOne({
      code,
      mode,
      projectId,
      userId: req.user.id
    });
    if (existingSnippet) {
      return res.status(200).json({
        message: "Fetched from cache",
        data: existingSnippet
      });
    }
    const aiResponse = await generateExplanation(code, mode);
    const snippet = await CodeSnippet.create({
      code,
      explanation: aiResponse,
      projectId,
      userId: req.user.id,
      mode,
    });

    res.status(201).json(snippet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getprojectsnippets = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query = {
      projectId: req.params.projectId,
      userId: req.user.id,
      code: { $regex: search, $options: "i" } // search in code
    };

    const snippets = await CodeSnippet.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await CodeSnippet.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: snippets
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { explanation, getprojectsnippets }