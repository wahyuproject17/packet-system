const multer = require('multer');
const path = require('path');
const sharp = require('sharp');  // Import sharp untuk kompresi
const fs = require('fs');

// Tentukan folder untuk menyimpan gambar
const uploadFolder = path.join(__dirname, '..', 'uploads');

// Pastikan folder ada, jika tidak buat
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Menentukan penyimpanan dengan diskStorage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);  // Tentukan lokasi penyimpanan
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);  // Mendapatkan ekstensi file
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;  // Nama unik untuk file
        cb(null, uniqueName);  // Simpan dengan nama unik
    }
});

// Filter file yang hanya menerima gambar
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Files are not allowed!'), false);
    }
};

// Setup multer
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },  // Maksimal ukuran file 2MB
    fileFilter: fileFilter
});

// Middleware untuk kompresi gambar
const compressImage = async (req, res, next) => {
    if (req.file) {
        try {
            // Kompresi gambar dengan sharp
            const inputPath = req.file.path;
            const outputPath = path.join(uploadFolder, 'image-' + path.basename(inputPath));  // Menyimpan file terkompresi dengan nama baru

            // Kompresi gambar
            await sharp(inputPath)
                .resize(800)  // Resize jika perlu (misal, lebar gambar menjadi 800px)
                .toFormat('jpeg')  // Format gambar menjadi jpeg
                .jpeg({ quality: 80 })  // Kompresi gambar menjadi kualitas 80%
                .toFile(outputPath);  // Simpan gambar yang telah terkompresi ke outputPath

            // Hapus file asli jika kompresi berhasil
            // fs.unlinkSync(inputPath);  // Menghapus file asli setelah kompresi berhasil

            // Jika berhasil, ganti path file di req.file dengan path gambar yang terkompresi
            req.file.path = outputPath;
            next();  // Lanjutkan ke proses berikutnya (misalnya, simpan ke database)
        } catch (error) {
            console.error(error);  // Debugging error
            return res.status(500).json({ error: 'Error compressing image' });
        }
    } else {
        next();  // Jika tidak ada file, lanjutkan tanpa kompresi
    }
};

// Middleware untuk memastikan hanya file yang berhasil dikompresi yang diteruskan
const validateAndUpload = (req, res, next) => {
    if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'No valid image file uploaded or compression failed.' });
    }
    next();  // Lanjutkan jika file valid
};

module.exports = { upload, compressImage, validateAndUpload };
