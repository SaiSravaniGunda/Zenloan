const multer = require('multer');
const upload = multer({
  dest: 'uploads/',  // specify the destination for the uploaded file
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpg|jpeg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File type is not allowed.'));
  }
});
