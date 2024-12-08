import jwt from 'jsonwebtoken';

// Middleware untuk memverifikasi token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Mengambil token dari header

    if (!token) {
        return res.sendStatus(401); // Unauthorized jika tidak ada token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden jika token tidak valid
        }
        req.user = user; // Simpan informasi pengguna ke dalam request
        next(); // Lanjut ke middleware berikutnya
    });
};

export default authenticateToken;
