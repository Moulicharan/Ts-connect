const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const MessageRequest = require("../models/MessageRequest");

// Send a request: POST /api/requests
router.post("/", auth, async (req, res) => {
  const { to, text } = req.body;

  if (!to) return res.status(400).json({ error: "Recipient required" });

  if (to === req.user.id)
    return res.status(400).json({ error: "You cannot send request to yourself" });

  try {
    // check duplicate pending request
    const existing = await MessageRequest.findOne({
      from: req.user.id,
      to,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ error: "Request already sent" });
    }

    const request = await MessageRequest.create({
      from: req.user.id,
      to,
      text: text || "",
    });

    res.status(201).json({ request });
  } catch (err) {
    console.error("POST /requests error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all requests of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const requests = await MessageRequest.find({
      $or: [{ from: req.user.id }, { to: req.user.id }],
    })
      .populate("from", "name email")
      .populate("to", "name email");

    res.json({ requests });
  } catch (err) {
    console.error("GET /requests error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Accept request
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const request = await MessageRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.to.toString() !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    request.status = "accepted";
    await request.save();

    res.json({ request });
  } catch (err) {
    console.error("ACCEPT error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Reject request
router.post("/:id/reject", auth, async (req, res) => {
  try {
    const request = await MessageRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.to.toString() !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    request.status = "rejected";
    await request.save();

    res.json({ request });
  } catch (err) {
    console.error("REJECT error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
