import { Feedback } from "../models/Feedback.js";

/**
 * Submit feedback or support inquiry
 * POST /api/feedback
 */
export const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, category, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, subject, and message are required.",
      });
    }

    const feedback = await Feedback.create({
      user: req.user ? req.user._id : undefined,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category || "General Feedback",
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been received and logged.",
      feedback,
    });
  } catch (error) {
    next(error);
  }
};
