const express = require("express");
const multer = require("multer");
const controller = require("../controllers/attachmentController");
// const { validateCreateItem } = require("../middlewares/attachmentMiddleware");
const upload = require("../middlewares/multerMiddleware");

const router = express.Router();

router.get("/", controller.getAll);

router.post("/", async (req, res, next) => {
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
}, controller.create);

router.get("/:id", controller.getById);

router.delete("/:id", controller.delete);

module.exports = router;
