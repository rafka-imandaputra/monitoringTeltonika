import bcrypt from 'bcrypt';

// Fungsi untuk hash password
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Fungsi untuk membandingkan password
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};