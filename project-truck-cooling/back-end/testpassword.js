import bcrypt from 'bcrypt';

const testPassword = async () => {
    const password = 'lala25';
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);
    console.log("Hashed password:", hash);

    const isMatch = await bcrypt.compare(password, hash);
    console.log("Password match:", isMatch);
};

testPassword();
