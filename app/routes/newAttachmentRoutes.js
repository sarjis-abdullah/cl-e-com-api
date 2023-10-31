const express = require('express');
const controller = require('../controllers/brandController');
const { validateCreateItem, validateUpdateItem } = require('../middlewares/brandMiddleware');
const multer = require("multer");
const { setUserData } = require('../middlewares/userMiddleware');
const controller2 = require("../controllers/attachmentController");
const { validateCreateItem2 } = require("../middlewares/attachmentMiddleware");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();
const Joi = require('joi');
const createSchema = Joi.object({
  type: Joi.string().required(),
  fileSource: Joi.required(),
  fileName: Joi.required(),
});
router.get('/', controller2.getAll);

router.post("/", setUserData, async (req, res, next) => {
  try {
    console.log(76767)
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
}, controller2.create);
// router.post('/', validateCreateItem, setUserData, controller.create);

// router.get('/:id', controller.getById);

// router.patch('/:id', validateUpdateItem, setUserData, controller.update);

// router.delete('/:id', controller.delete);

module.exports = router;
