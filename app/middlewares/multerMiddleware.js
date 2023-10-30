const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public'));
  },
  filename: (req, file, cb) => {
    req.body.fileSource = file
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    let fileName = extension ??  "-" + originalName
    fileName = Date.now() + fileName
    req.body.fileName = fileName
    

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;