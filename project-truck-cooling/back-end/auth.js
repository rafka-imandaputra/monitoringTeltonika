import express, { query } from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import authenticateToken from './routes/authMiddleware.js';
import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config();
import { env } from "process"
const { Pool } = pkg;

import session from 'express-session';

const pool = new Pool({
    connectionString:
      "postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway", // Use the full connection string
  });


const router = express.Router();

router.use(session({
    secret: 'sdud89HAdua9hduiHUShdu',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // { secure: true }
}));

const isAuthenticated = (requiredRole) => (req, res, next) => {
    const user = req.session.user;

    if (user && user.role === requiredRole) {
        return next();
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

const generateOTP = (length = 6) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: env.USER,
        pass: env.APP_PASS
    },
});

// POST route untuk login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email dan Password wajib diisi." });
    }

    try {
        const isClient = email.includes('@');
        const queryText = isClient ? "SELECT * FROM client WHERE email = $1" : "SELECT * FROM admin WHERE namaadmin = $1";
        const result = await pool.query(queryText, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Email salah." });
        }

        const user = result.rows[0];

        if (isClient) {
            if (user.password_client !== password) {
                return res.status(401).json({ success: false, message: "Password salah." });
            }
        } else {
            if (user.passwordadmin !== password) {
                return res.status(401).json({ success: false, message: "Password salah." });
            }
        }

        const tokenPayload = isClient ? { email: user.email } : { namaadmin: user.namaadmin };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        const role = isClient ? 'client' : 'admin';
        req.session.user = { email: user.email, role };

        const dashboardURL = isClient ? '/dashboard/client' : '/dashboard/admin';
        return res.status(200).json({
            success: true,
            message: "Login berhasil.",
            token,
            user: { email: user.email, role },
            redirectURL: dashboardURL
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});


router.post('/protected-route', isAuthenticated, (req, res) => {
    res.json({ message: 'Restricted Route', user: req.session.user });
});

// EMAIL UJI COBA
const otpStore = {}; // Menggunakan objek untuk menyimpan OTP sementara

// router.post('/request-otp', async (req, res) =>{
//     const { email } = req.body;
//     const otp = generateOTP(6);

//     try {
//         await transporter.sendMail({
//             from: process.env.USER,
//             to: email,
//             subject: 'Kode OTP untuk reset password',
//             text: `Kode OTP kamu adalah ${otp}`,
//         });

//         otpStore[email] = otp;

//         res.status(200).json({ message: 'OTP berhasil dikirim' });
//     } catch (error) {
//         res.status(500).json({ message: 'Gagal mengirim OTP', error });
//     }
// });

// EMAIL DATABASE
router.post('/request-otp', async (req, res) =>{
    const { email } = req.body;
    const otp = generateOTP(6);

    try {
        const result = await pool.query("SELECT * FROM client WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Email tidak ditemukan." });
        }

        await transporter.sendMail({
            from: env.USER,
            to: email,
            subject: 'Kode OTP untuk reset password',
            text: `Kode OTP kamu adalah ${otp}`,
        });

        otpStore[email] = otp;
        console.log(`OTP for ${email}: ${otp}`);

        res.status(200).json({ message: 'OTP berhasil dikirim' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengirim OTP', error });
    }
});

const validateOTP = (email, otp) => {
    return otpStore[email] === otp;
};
// VALIDASI TANPA DATABASE
// router.post('/validate-otp', async(req, res) =>{
//     const { email, otp } = req.body;

//     const isValid = validateOTP(email, otp);
//     if (!isValid) {
//         return res.status(400).json({ message: 'OTP tidak valid'});
//     }

//     delete otpStore[email];

//     res.status(200).json({ message: "OTP valid, silakan reset password"});
// });

// VALIDASI PAKE DATABASE
router.post('/validate-otp', async(req, res) =>{
    const { email, otp } = req.body;

    try {
        const result = await pool.query("SELECT * FROM client WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Email tidak ditemukan." });
        }

        const isValid = validateOTP(email, otp);
        if (!isValid) {
            return res.status(400).json({ message: 'OTP tidak valid'});
        }

        delete otpStore[email];

        res.status(200).json({ message: "OTP valid, silakan reset password" });
    } catch {
        res.status(500).json({ message: "Gagal memvalidasi OTP", otp })
    }
});

// RESET TANPA DATABASE
// router.post('/reset-password', async (req, res) => {
//     const { email, newPassword } = req.body;

//     try {
//         const queryText = "UPDATE client SET password_client = $1 WHERE email = $2";
//         await pool.query(queryText, [newPassword, email]);

//         res.status(200).json({ message: 'Password berhasil direset' });
//     } catch (error) {
//         console.error('Error mereset password:', error);
//         res.status(500).json({ message: 'Gagal mereset password', error });
//     }
// });

// RESET DENGAN DATABASE
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const result = await pool.query("SELECT * FROM client WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Email tidak ditemukan." });
        }

        const queryText = "UPDATE client SET password_client = $1 WHERE email = $2";
        await pool.query(queryText, [newPassword, email]);

        res.status(200).json({ message: 'Password berhasil direset' });
    } catch (error) {
        console.error('Error mereset password:', error);
        res.status(500).json({ message: 'Gagal mereset password', error });
    }
});

// Rute yang dilindungi untuk testing
router.post('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Ini adalah rute yang dilindungi', user: req.user });
});

export default router;
