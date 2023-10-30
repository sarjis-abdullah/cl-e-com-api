const express = require("express");
const multer = require("multer");
const controller = require("../controllers/attachmentController");
const { validateCreateItem } = require("../middlewares/attachmentMiddleware");
const upload = require("../middlewares/multerMiddleware");
const { setUserData } = require("../middlewares/userMiddleware");

const router = express.Router();
const Joi = require('joi');

const createSchema = Joi.object({
  type: Joi.string().required(),
  fileSource: Joi.required(),
  fileName: Joi.required(),
});

router.get("/", controller.getAll);

router.post("/", setUserData, async (req, res, next) => {
  try {
    await upload.single("fileSource")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Multer Error", err });
      } else if (err) {
        res.status(500).json({ error: "Server Error", err });
      } else {
        next()
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error", err });
  }
}, (req, res, next) => {

  const { error } = createSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next()
}, controller.create);

router.get("/:id", controller.getById);

router.delete("/:id", controller.delete);

module.exports = router;
