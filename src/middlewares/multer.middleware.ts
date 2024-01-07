import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/uploads");
    },
    filename: function (req, file, cb) {
        const random = Math.random();
        const uniqueSuffix = Date.now() + "-" + Math.round(random * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

export default multer({
    storage,
    limits: {
        fileSize: 8000000,
    },
});
