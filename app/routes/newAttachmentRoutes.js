const express = require("express");
const multer = require("multer");
const { setUserData } = require("../middlewares/userMiddleware");
const controller = require("../controllers/attachmentController");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();
const Joi = require("joi");
const createSchema = Joi.object({
  type: Joi.string().required(),
  fileSource: Joi.required(),
  fileName: Joi.required(),
});

router.get("/", controller.getAll);

router.post(
  "/",
  async (req, res, next) => {
    try {
      await upload.single("fileSource")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          res.status(400).json({ error: "Multer Error", err });
        } else if (err) {
          res.status(500).json({ error: "Server Error", err });
        } else if (req.file && req.file.mimetype) {
          next();
        } else {
          res.status(500).json({ error: "Please give a binary file!", err });
        }
      });
    } catch (err) {
      res.status(500).json({ error: "Server Error", err });
    }
  },
  (req, res, next) => {
    const { error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();
  },
  setUserData,
  controller.create
);

module.exports = router;
